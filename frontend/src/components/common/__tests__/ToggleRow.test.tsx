import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { ToggleRow } from '../ToggleRow';
import { Switch, Text } from 'react-native';

describe('ToggleRow Component', () => {
  it('should render title and description correctly', () => {
    const mockOnValueChange = jest.fn();
    let component: any;
    
    act(() => {
      component = renderer.create(
        <ToggleRow
          title="Test Title"
          description="Test Description"
          value={true}
          onValueChange={mockOnValueChange}
        />
      );
    });

    const textInstances = component.root.findAllByType(Text);
    const textContent = textInstances.map((inst: any) => {
      const children = inst.props.children;
      return Array.isArray(children) ? children.join(' ') : String(children);
    }).join(' ');

    expect(textContent).toContain('Test Title');
    expect(textContent).toContain('Test Description');
  });

  it('should pass correct value to Switch component and handle change', () => {
    const mockOnValueChange = jest.fn();
    let component: any;
    
    act(() => {
      component = renderer.create(
        <ToggleRow
          title="Test Title"
          description="Test Description"
          value={false}
          onValueChange={mockOnValueChange}
        />
      );
    });

    const switchInstance = component.root.findByType(Switch);
    expect(switchInstance.props.value).toBe(false);

    // Simulate switch toggling inside act
    act(() => {
      switchInstance.props.onValueChange(true);
    });
    
    expect(mockOnValueChange).toHaveBeenCalledTimes(1);
    expect(mockOnValueChange).toHaveBeenCalledWith(true);
  });
});
