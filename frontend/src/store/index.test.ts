import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAppStore } from './index';

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAppStore.setState({
      searchQuery: '',
      selectedBreed: null,
      currentTab: 'browse',
    });
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useAppStore());

    expect(result.current.searchQuery).toBe('');
    expect(result.current.selectedBreed).toBe(null);
    expect(result.current.currentTab).toBe('browse');
  });

  it('should update search query', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.setSearchQuery('retriever');
    });

    expect(result.current.searchQuery).toBe('retriever');
  });

  it('should update selected breed', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.setSelectedBreed('bulldog');
    });

    expect(result.current.selectedBreed).toBe('bulldog');
  });

  it('should update current tab', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.setCurrentTab('favourites');
    });

    expect(result.current.currentTab).toBe('favourites');
  });

  it('should handle null selected breed', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.setSelectedBreed('retriever');
    });
    expect(result.current.selectedBreed).toBe('retriever');

    act(() => {
      result.current.setSelectedBreed(null);
    });
    expect(result.current.selectedBreed).toBe(null);
  });

  it('should handle empty search query', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.setSearchQuery('test query');
    });
    expect(result.current.searchQuery).toBe('test query');

    act(() => {
      result.current.setSearchQuery('');
    });
    expect(result.current.searchQuery).toBe('');
  });

  it('should maintain state across multiple updates', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.setSearchQuery('poodle');
      result.current.setSelectedBreed('poodle/standard');
      result.current.setCurrentTab('favourites');
    });

    expect(result.current.searchQuery).toBe('poodle');
    expect(result.current.selectedBreed).toBe('poodle/standard');
    expect(result.current.currentTab).toBe('favourites');
  });
});