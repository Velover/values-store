import type { IReadOnlyAtom } from "./IReadOnlyAtom";
import Broadcaster from "./Utils/Broadcaster";

export namespace StoreHandler {
  let index = 0;
  export let IsBatch = false;

  /**To interact with index from outside */
  export function IncrementIndex() {
    return index++;
  }
  /**To interact with index from outside */
  export function DecrementIndex() {
    return index--;
  }

  const report_event = new Broadcaster<[IReadOnlyAtom<any>]>();
  export function ReportOnRead(atom: IReadOnlyAtom<any>) {
    report_event.Fire(atom);
  }

  export function Capture<T>(callback: () => T): [IReadOnlyAtom<any>[], T] {
    const current_index = ++index;
    const captured_atoms: IReadOnlyAtom<any>[] = [];
    const cleanup = report_event.Listen((atom) => {
      if (index !== current_index) return;
      captured_atoms.push(atom);
    });

    try {
      return [captured_atoms, callback()];
    } catch (error_message) {
      throw error_message;
    } finally {
      cleanup();
      --index;
    }
  }
}
