import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLazyLoading } from './useLazyLoading';

// Mock IntersectionObserver
const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect,
  callback,
}));

describe('useLazyLoading hook', () => {
  beforeEach(() => {
    mockObserve.mockClear();
    mockUnobserve.mockClear();
    mockDisconnect.mockClear();
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useLazyLoading());

    expect(result.current.isIntersecting).toBe(false);
    expect(result.current.hasIntersected).toBe(false);
    expect(result.current.targetRef.current).toBe(null);
  });

  it('should create IntersectionObserver when element is available', () => {
    const { result } = renderHook(() => useLazyLoading());
    expect(result.current.targetRef).toBeDefined();
    expect(result.current.isIntersecting).toBe(false);
  });

  it('should work with custom options', () => {
    const customOptions = {
      threshold: 0.5,
      rootMargin: '50px',
    };

    const { result } = renderHook(() => useLazyLoading(customOptions));
    expect(result.current.targetRef).toBeDefined();
  });

  it('should initialize observer state correctly', () => {
    renderHook(() => useLazyLoading());
    expect(mockObserve).not.toHaveBeenCalled(); // Initially no element to observe
  });
});