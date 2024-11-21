import Atom from "./Atom";
import { StoreHandler } from "./StoreHandler";
import type { CleanUp } from "./Types/CleanUp";
import type { IReadOnlyAtom } from "./Types/IReadOnlyAtom";

export default function Computed<T>(
  callback: () => T
): [IReadOnlyAtom<T>, CleanUp] {
  let [captured_atoms, result] = StoreHandler.Capture(callback);
  const computed_atom = new Atom<T>(result);

  let subscriptions: CleanUp[] = [];

  const CleanSubscriptions = () => {
    for (const cleanup of subscriptions) {
      cleanup();
    }
    subscriptions = [];
  };

  const OnChanged = () => {
    CleanSubscriptions();
    [captured_atoms, result] = StoreHandler.Capture(callback);
    const previous_value = computed_atom.Peek();
    console.log(
      "Computed value has updated to ",
      result,
      previous_value,
      computed_atom
    );
    computed_atom.Set(result);
    for (const atom of captured_atoms) {
      subscriptions.push(atom.Subscribe(OnChanged));
    }
  };

  for (const atom of captured_atoms) {
    subscriptions.push(atom.Subscribe(OnChanged));
  }

  return [
    computed_atom,
    () => {
      console.log("Disconnected", computed_atom.DebugId);
      CleanSubscriptions();
    },
  ];
}
