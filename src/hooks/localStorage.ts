import { useCallback, useState } from 'react';

import { FacultyRequirement } from '@/types/facultyRequirement';

interface UseLocalStorageResult<T> {
  value: T;
  updateValue: (newValue: T | ((prev: T) => T)) => void;
  removeValue: () => void;
}

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): UseLocalStorageResult<T> => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);

      // facultyRequirementsの互換性を保つための処理
      if (item && key === 'facultyRequirements') {
        const parsedItem = JSON.parse(item) as FacultyRequirement[];

        const newItem = parsedItem.map((facultyRequirement) => ({
          ...{ requiredCourseNames: [] },
          ...facultyRequirement,
        }));
        return newItem as T;
      }
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const updateValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          newValue instanceof Function ? newValue(storedValue) : newValue;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error('Error writing to localStorage:', error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      setStoredValue(initialValue);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }, [key, initialValue]);

  return { value: storedValue, updateValue, removeValue };
};
