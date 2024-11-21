import { StoreHandler } from "./StoreHandler";
import type { CleanUp } from "./Types/CleanUp";

export default function Effect(callback: () => CleanUp | void): CleanUp {
  let [captured_atoms, cleanup] = StoreHandler.Capture(callback);
  const subscriptions: CleanUp[] = [];

  const CleanSubscriptions = () => {
    for (const cleanup of subscriptions) {
      cleanup();
    }
  };

  const OnChanged = () => {
    if (cleanup !== undefined) {
      cleanup();
    }
    CleanSubscriptions();
    [captured_atoms, cleanup] = StoreHandler.Capture(callback);
    for (const atom of captured_atoms) {
      subscriptions.push(atom.Subscribe(OnChanged));
    }
  };

  for (const atom of captured_atoms) {
    subscriptions.push(atom.Subscribe(OnChanged));
  }

  return CleanSubscriptions;
}
