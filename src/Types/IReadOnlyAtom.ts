import type { CleanUp } from "./CleanUp";

export interface IReadOnlyAtom<T> {
  GetSubscribers(): ((value: T, previous_value: T) => void)[];
  Get(): T;
  Subscribe(callback: (value: T, previous_value: T) => void): CleanUp;
  Effect(callback: (value: T, previous_value?: T) => void): CleanUp;
}
