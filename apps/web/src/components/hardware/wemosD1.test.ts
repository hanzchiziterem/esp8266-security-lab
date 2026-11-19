import { describe, it, expect } from 'vitest';
import {
  WEMOS_D1_COMPONENTS,
  WEMOS_D1_PINS,
  WEMOS_D1_QUIZ_QUESTIONS,
} from '../../data/wemosD1Metadata';

describe('WeMos D1 R1 Hardware Specifications & Metadata', () => {
  it('contains all core components verified from physical hardware', () => {
    const requiredComponents = [
      'esp8266_module',
      'pcb_antenna',
      'ch340g',
      'micro_usb',
      'dc_barrel_jack',
      'reset_button',
      'voltage_regulator',
      'inductor_4r7',
      'capacitors',
      'status_led',
      'pin_headers',
    ];

    requiredComponents.forEach((id) => {
      expect(WEMOS_D1_COMPONENTS[id]).toBeDefined();
      expect(WEMOS_D1_COMPONENTS[id].name.length).toBeGreaterThan(0);
      expect(WEMOS_D1_COMPONENTS[id].description.length).toBeGreaterThan(0);
      expect(WEMOS_D1_COMPONENTS[id].securityRelevance.length).toBeGreaterThan(0);
    });
  });

  it('contains all header pins matching Arduino Uno footprint', () => {
    expect(WEMOS_D1_PINS.length).toBeGreaterThanOrEqual(28);

    // Verify key digital pins
    const d8 = WEMOS_D1_PINS.find((p) => p.id === 'pin_d8');
    expect(d8).toBeDefined();
    expect(d8?.gpio).toBe(0);
    expect(d8?.bootstrapping?.requiredState).toBe('HIGH');

    const d9 = WEMOS_D1_PINS.find((p) => p.id === 'pin_d9');
    expect(d9).toBeDefined();
    expect(d9?.gpio).toBe(2);

    const d10 = WEMOS_D1_PINS.find((p) => p.id === 'pin_d10');
    expect(d10).toBeDefined();
    expect(d10?.gpio).toBe(15);
    expect(d10?.bootstrapping?.requiredState).toBe('LOW');

    // Verify analog pin A0
    const a0 = WEMOS_D1_PINS.find((p) => p.id === 'pin_a0');
    expect(a0).toBeDefined();
    expect(a0?.type).toBe('analog');
  });

  it('verifies all quiz questions map to valid hardware targets', () => {
    expect(WEMOS_D1_QUIZ_QUESTIONS.length).toBeGreaterThanOrEqual(5);

    WEMOS_D1_QUIZ_QUESTIONS.forEach((q) => {
      expect(q.id).toBeDefined();
      expect(q.question.length).toBeGreaterThan(0);
      expect(q.hint.length).toBeGreaterThan(0);
      expect(q.explanation.length).toBeGreaterThan(0);

      if (q.targetType === 'component') {
        expect(WEMOS_D1_COMPONENTS[q.targetId]).toBeDefined();
      } else {
        const pin = WEMOS_D1_PINS.find((p) => p.id === q.targetId);
        expect(pin).toBeDefined();
      }
    });
  });
});
