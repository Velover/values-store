export interface IAtomConfig<T> {
  /**checks if the new value is equals to the previous */
  Equals?: (value: T, previous_value: T) => boolean;
  DebugName?: string;
}
