import Computed from "./Computed";
import type { CleanUp } from "./Types/CleanUp";
import type { IReadOnlyAtom } from "./Types/IReadOnlyAtom";

export default function Subscribe<T>(
  selector: () => T | IReadOnlyAtom<T>,
  callback: (value: T, previous_value: T) => void
): CleanUp {
  if (typeof selector === "object") {
    selector = () => (selector as unknown as IReadOnlyAtom<T>).Get();
  }
  const [computed_atom, cleanup] = Computed(selector as () => T);
  computed_atom.Subscribe(callback);
  return cleanup;
}
