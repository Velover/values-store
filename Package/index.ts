import Atom from "./Atom";
import Computed from "./Cumputed";
import Effect from "./Effect";
import { Peek } from "./Peek";
import Subscribe from "./Subscribe";

// namespace Charm {
export function atom<T>(value: T) {
  return new Atom(value);
}

export type { IReadOnlyAtom } from "./IReadOnlyAtom";
export type { default as Atom } from "./Atom";
export const effect = Effect;
export const computed = Computed;
export const subscribe = Subscribe;
export const peek = Peek;
// }

// export = Charm;
