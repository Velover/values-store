import Atom from "./Atom";
import Computed from "./Computed";
import Effect from "./Effect";
import { StoreHandler } from "./StoreHandler";
import Subscribe from "./Subscribe";
import type { IAtomConfig } from "./Types/IAtomConfig";

export function atom<T>(value: T, config?: IAtomConfig<T>): Atom<T>;
export function atom<T>(
  value?: T,
  config?: IAtomConfig<T>
): Atom<T | undefined>;
export function atom(
  value?: unknown,
  config?: IAtomConfig<unknown>
): Atom<unknown> {
  return new Atom(value, config);
}

export type { default as Atom } from "./Atom";
export type { IReadOnlyAtom } from "./Types/IReadOnlyAtom";
export const effect = Effect;
export const computed = Computed;
export const subscribe = Subscribe;
export const peek = StoreHandler.Peek;
export const batch = StoreHandler.Batch;
export const capture = StoreHandler.Capture;
