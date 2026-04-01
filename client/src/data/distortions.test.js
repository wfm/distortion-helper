import { describe, it, expect } from 'vitest';
import distortions from './distortions.js';

describe('distortions data', () => {
  it('contains exactly 10 entries', () => {
    expect(distortions).toHaveLength(10);
  });

  it('every entry has all required fields', () => {
    const requiredFields = ['id', 'name', 'shortDescription', 'example', 'reframeTechnique'];
    for (const distortion of distortions) {
      for (const field of requiredFields) {
        expect(distortion, `entry "${distortion.id}" is missing field "${field}"`).toHaveProperty(field);
        expect(distortion[field], `"${field}" on entry "${distortion.id}" must be a non-empty string`).toMatch(/\S/);
      }
    }
  });

  it('all IDs are unique', () => {
    const ids = distortions.map((d) => d.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('contains the correct 10 distortion IDs', () => {
    const expectedIds = [
      'all-or-nothing',
      'overgeneralization',
      'mental-filter',
      'disqualifying-the-positive',
      'jumping-to-conclusions',
      'magnification-or-minimization',
      'emotional-reasoning',
      'should-statements',
      'labeling',
      'personalization-and-blame',
    ];
    const actualIds = distortions.map((d) => d.id);
    expect(actualIds).toEqual(expectedIds);
  });
});
