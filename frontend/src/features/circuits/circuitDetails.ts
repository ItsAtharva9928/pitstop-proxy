export interface CircuitDetails {
  length: string;
  laps: number;
  lapRecord: {
    time: string;
    driver: string;
    year: string;
  };
  drsZones: number;
}

export const CIRCUIT_DETAILS: Record<string, CircuitDetails> = {
  "villeneuve": {
    length: "4.361 km",
    laps: 70,
    lapRecord: { time: "1:13.078", driver: "Valtteri Bottas", year: "2019" },
    drsZones: 2
  },
  "monaco": {
    length: "3.337 km",
    laps: 78,
    lapRecord: { time: "1:12.909", driver: "Lewis Hamilton", year: "2021" },
    drsZones: 1
  },
  "silverstone": {
    length: "5.891 km",
    laps: 52,
    lapRecord: { time: "1:27.097", driver: "Max Verstappen", year: "2020" },
    drsZones: 2
  },
  "bahrain": {
    length: "5.412 km",
    laps: 57,
    lapRecord: { time: "1:31.447", driver: "Pedro de la Rosa", year: "2005" },
    drsZones: 3
  },
  "catalunya": {
    length: "4.657 km",
    laps: 66,
    lapRecord: { time: "1:16.330", driver: "Max Verstappen", year: "2023" },
    drsZones: 2
  },
  "red_bull_ring": {
    length: "4.318 km",
    laps: 71,
    lapRecord: { time: "1:05.619", driver: "Carlos Sainz", year: "2020" },
    drsZones: 3
  },
  "hungaroring": {
    length: "4.381 km",
    laps: 70,
    lapRecord: { time: "1:16.627", driver: "Lewis Hamilton", year: "2020" },
    drsZones: 2
  },
  "spa": {
    length: "7.004 km",
    laps: 44,
    lapRecord: { time: "1:46.286", driver: "Valtteri Bottas", year: "2018" },
    drsZones: 2
  },
  "zandvoort": {
    length: "4.259 km",
    laps: 72,
    lapRecord: { time: "1:11.097", driver: "Lewis Hamilton", year: "2021" },
    drsZones: 2
  },
  "monza": {
    length: "5.793 km",
    laps: 53,
    lapRecord: { time: "1:21.046", driver: "Rubens Barrichello", year: "2004" },
    drsZones: 2
  }
};

export const getCircuitDetails = (circuitId: string): CircuitDetails => {
  return CIRCUIT_DETAILS[circuitId] || {
    length: "N/A",
    laps: 0,
    lapRecord: { time: "N/A", driver: "N/A", year: "N/A" },
    drsZones: 0
  };
};
