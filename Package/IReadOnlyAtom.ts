import type { CleanUp } from "./Utils/Types";

export interface IReadOnlyAtom<T> {
  Get(): T;
  Subscribe(callback: (value: T, previous_value: T) => void): CleanUp;
  Effect(callback: (value: T, previous_value?: T) => void): CleanUp;
}
