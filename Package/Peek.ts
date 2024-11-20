import type { IReadOnlyAtom } from "./IReadOnlyAtom";
import { StoreHandler } from "./StoreHandler";

export function Peek<T>(selector: () => T): T {
  if (typeof selector === "object") {
    selector = () => (selector as unknown as IReadOnlyAtom<T>).Get();
  }
  const [_, result] = StoreHandler.Capture(selector as () => T);
  return result;
}
