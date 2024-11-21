import Computed from "./Computed";
import type { CleanUp } from "./Types/CleanUp";

export default function Subscribe<T>(
  selector: () => T,
  callback: (value: T, previous_value: T) => void
): CleanUp {
  const [computed_atom, cleanup] = Computed(selector);
  computed_atom.Subscribe(callback);
  return cleanup;
}
