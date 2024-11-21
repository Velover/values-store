import Computed from "./Computed";
import type { IReadOnlyAtom } from "./Types/IReadOnlyAtom";
import type { CleanUp } from "./Utils/Types";

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
