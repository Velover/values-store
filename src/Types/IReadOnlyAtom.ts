import type { CleanUp } from "./CleanUp";

export interface IReadOnlyAtom<T> {
  DebugId: number;
  /**lowlevel call to get subscribers*/
  GetSubscribers(): ((value: T, previous_value: T) => void)[];
  /**gets the value of the atom */
  Get(): T;
  /**gets the value without notifying*/
  Peek(): T;
  /**subscribes to atom change */
  Subscribe(callback: (value: T, previous_value: T) => void): CleanUp;
  /**subscribes to atom change and immediately executes*/
  Effect(callback: (value: T, previous_value?: T) => void): CleanUp;
  /**creates computed atom from this atom */
  Computed<Q>(callback: (value: T) => Q): [IReadOnlyAtom<Q>, CleanUp];
}
