import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { TimingRow } from '../TimingRow';
import { Text } from 'react-native';

describe('TimingRow Component', () => {
  const getRenderedText = (component: any) => {
    const textInstances = component.root.findAllByType(Text);
    return textInstances.map((inst: any) => {
      const children = inst.props.children;
      return Array.isArray(children) ? children.join(' ') : String(children);
    }).join(' ');
  };

  it('should render position, driver number, name and interval correctly', () => {
    let component: any;
    
    act(() => {
      component = renderer.create(
        <TimingRow
          position={3}
          driverNumber={44}
          driverName="HAM"
          teamColor="#00D2BE"
          interval="+4.567"
          isPits={false}
        />
      );
    });

    const textContent = getRenderedText(component);
    expect(textContent).toContain('3');
    expect(textContent).toContain('44');
    expect(textContent).toContain('HAM');
    expect(textContent).toContain('+4.567');
    expect(textContent).not.toContain('IN PIT');
  });

  it('should render IN PIT status when isPits is true', () => {
    let component: any;
    
    act(() => {
      component = renderer.create(
        <TimingRow
          position={5}
          driverNumber={16}
          driverName="LEC"
          teamColor="#F60000"
          interval="+12.345"
          isPits={true}
        />
      );
    });

    const textContent = getRenderedText(component);
    expect(textContent).toContain('5');
    expect(textContent).toContain('16');
    expect(textContent).toContain('LEC');
    expect(textContent).toContain('IN PIT');
    expect(textContent).not.toContain('+12.345');
  });
});
