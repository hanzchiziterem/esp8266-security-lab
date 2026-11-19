import { describe, it, expect } from 'vitest';
import app from './index';

describe('API Server Health', () => {
  it('instantiates app properly', () => {
    expect(app).toBeDefined();
  });
});
