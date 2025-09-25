import { describe, it, expect } from 'vitest';
import { classNames } from './classNames';

describe('classNames utility', () => {
  it('should join multiple class names', () => {
    const result = classNames('class1', 'class2', 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  it('should handle conditional classes', () => {
    const result = classNames(
      'base-class',
      true && 'true-class',
      false && 'false-class',
      null && 'null-class'
    );
    expect(result).toBe('base-class true-class');
  });

  it('should filter out falsy values', () => {
    const result = classNames('valid', '', null, undefined, false, 'another-valid');
    expect(result).toBe('valid another-valid');
  });

  it('should handle empty input', () => {
    const result = classNames();
    expect(result).toBe('');
  });

  it('should handle mixed types', () => {
    const result = classNames(
      'string-class',
      42 && 'number-truthy',
      0 && 'number-falsy',
      [] && 'empty-array'
    );
    expect(result).toBe('string-class number-truthy empty-array');
  });
});