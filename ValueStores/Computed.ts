import Atom from "./Atom";
import type { IReadOnlyAtom } from "./Types/IReadOnlyAtom";
import { StoreHandler } from "./StoreHandler";
import type { CleanUp } from "./Types/CleanUp";

export default function Computed<T>(
  callback: () => T
): [IReadOnlyAtom<T>, CleanUp] {
  let [captured_atoms, result] = StoreHandler.Capture(callback);
  const computed_atom = new Atom<T>(result);

  const subscriptions: CleanUp[] = [];

  const CleanSubscriptions = () => {
    for (const cleanup of subscriptions) {
      cleanup();
    }
  };

  const OnChanged = () => {
    CleanSubscriptions();
    [captured_atoms, result] = StoreHandler.Capture(callback);
    computed_atom.Set(result);
    for (const atom of captured_atoms) {
      subscriptions.push(atom.Subscribe(OnChanged));
    }
  };

  for (const atom of captured_atoms) {
    subscriptions.push(atom.Subscribe(OnChanged));
  }

  return [computed_atom, CleanSubscriptions];
}
