export default {
  async fetch(request, env, ctx) {
    // Enable CORS for our mobile frontend
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, User-Agent",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const fetchOpts = {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Referer": "https://www.formula1.com/"
        }
      };

      // Step A: Fetch current session info with browser spoofing
      const sessionUrl = "https://livetiming.formula1.com/static/SessionInfo.json";
      const sessionResponse = await fetch(sessionUrl, fetchOpts);
      
      if (!sessionResponse.ok) {
        return new Response(JSON.stringify({ error: "SessionInfo not available" }), { status: sessionResponse.status, headers: corsHeaders });
      }
      
      const sessionText = await sessionResponse.text();
      const cleanSessionText = sessionText.replace(/^\uFEFF/, ''); // Strip BOM
      const sessionData = JSON.parse(cleanSessionText);
      const path = sessionData.Path;

      // Step B: Fetch the live TimingData text stream
      const streamUrl = `https://livetiming.formula1.com/static/${path}TimingData.jsonStream`;
      const streamResponse = await fetch(streamUrl, fetchOpts);

      // Graceful error handling if F1 locks the bucket mid-race
      if (!streamResponse.ok) {
        return new Response(JSON.stringify({ error: "TimingData stream is locked by F1" }), {
          status: streamResponse.status === 403 ? 404 : streamResponse.status, // Convert 403 to 404 to avoid frontend crash logs
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }

      const streamText = await streamResponse.text();
      
      // Step C: Advanced Stream Merging Logic
      const lines = streamText.split('\n');
      let baseState = { Lines: {} };

      // Helper function to mathematically deep merge telemetry deltas
      const deepMerge = (target, source) => {
        for (const key in source) {
          if (source[key] instanceof Object && key in target) {
            Object.assign(source[key], deepMerge(target[key], source[key]));
          }
        }
        Object.assign(target || {}, source);
        return target;
      };

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) continue;

        // F1 stream lines are prefixed with a timestamp like "00:01:23.456 {"Lines":...}"
        // Find the first '{' character which marks the start of the JSON payload
        const jsonStartIdx = line.indexOf('{');
        if (jsonStartIdx !== -1) {
          const jsonStr = line.substring(jsonStartIdx);
          try {
            const delta = JSON.parse(jsonStr);
            if (delta && delta.Lines) {
              baseState.Lines = deepMerge(baseState.Lines, delta.Lines);
            }
          } catch (e) {
            // Ignore malformed lines in the stream
          }
        }
      }

      // Return the perfectly reconstructed base state!
      return new Response(JSON.stringify(baseState), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
  }
};
