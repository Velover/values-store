import Atom from "./Atom";
import Computed from "./Computed";
import Effect from "./Effect";
import { StoreHandler } from "./StoreHandler";
import Subscribe from "./Subscribe";

export function atom<T>(value: T) {
  return new Atom(value);
}

export type { IReadOnlyAtom } from "./Types/IReadOnlyAtom";
export type { default as Atom } from "./Atom";
export const effect = Effect;
export const computed = Computed;
export const subscribe = Subscribe;
export const peek = StoreHandler.Peek;
export const batch = StoreHandler.Batch;
