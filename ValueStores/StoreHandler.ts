import type { IReadOnlyAtom } from "./Types/IReadOnlyAtom";
import Broadcaster from "./Utils/Broadcaster";

export namespace StoreHandler {
  let index = 0;
  let is_batch = false;
  const batched_atoms = new Map<
    IReadOnlyAtom<any>,
    [value: unknown, previous_value: unknown]
  >();

  export function IsBatch() {
    return is_batch;
  }

  const read_report_event = new Broadcaster<[IReadOnlyAtom<any>]>();

  export function ReportOnRead(atom: IReadOnlyAtom<any>) {
    read_report_event.Fire(atom);
  }

  export function ReportOnBatchWrite(
    atom: IReadOnlyAtom<any>,
    value: unknown,
    previous_value: unknown
  ) {
    const atom_data = batched_atoms.get(atom);
    if (atom_data === undefined) {
      batched_atoms.set(atom, [value, previous_value]);
      return;
    }
    atom_data[0] = value;
  }

  export function Capture<T>(callback: () => T): [IReadOnlyAtom<any>[], T] {
    const current_index = ++index;
    const captured_atoms: IReadOnlyAtom<any>[] = [];
    const cleanup = read_report_event.Listen((atom) => {
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

  export function Peek<T>(callback: () => T): T {
    ++index;
    try {
      return callback();
    } catch (error) {
      throw error;
    } finally {
      --index;
    }
  }

  export function Batch(callback: () => void) {
    if (is_batch) {
      callback();
      return;
    }

    is_batch = true;
    const subscribers = new Map<
      (value: unknown, previous_value: unknown) => void,
      [unknown, unknown]
    >();

    try {
      callback();
    } catch (error_message) {
      throw error_message;
    } finally {
      is_batch = false;

      for (const [atom, values] of batched_atoms) {
        for (const subscriber of atom.GetSubscribers()) {
          subscribers.set(subscriber, values);
        }
      }

      for (const [subscriber, values] of subscribers) {
        try {
          subscriber(values[0], values[1]);
        } catch (error) {
          console.warn(error);
        }
      }

      batched_atoms.clear();
    }
  }
}
