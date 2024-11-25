import Atom from "./Atom";
import { StoreHandler } from "./StoreHandler";
import type { CleanUp } from "./Types/CleanUp";
import type { IAtomConfig } from "./Types/IAtomConfig";
import type { IReadOnlyAtom } from "./Types/IReadOnlyAtom";

export default function Computed<T>(
  callback: () => T,
  config?: IAtomConfig<T>
): [IReadOnlyAtom<T>, CleanUp] {
  let [captured_atoms, result] = StoreHandler.Capture(callback);
  const computed_atom = new Atom<T>(result, config);

  let subscriptions: CleanUp[] = [];

  const ClearSubscriptions = () => {
    for (const cleanup of subscriptions) {
      cleanup();
    }
    subscriptions = [];
  };

  const OnChanged = () => {
    ClearSubscriptions();
    [captured_atoms, result] = StoreHandler.Capture(callback);

    computed_atom.Set(result);
    for (const atom of captured_atoms) {
      subscriptions.push(atom.Subscribe(OnChanged));
    }
  };

  for (const atom of captured_atoms) {
    subscriptions.push(atom.Subscribe(OnChanged));
  }

  return [computed_atom, ClearSubscriptions];
}
