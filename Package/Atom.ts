import type { IReadOnlyAtom } from "./IReadOnlyAtom";
import { StoreHandler } from "./StoreHandler";
import Broadcaster from "./Utils/Broadcaster";
import type { CleanUp } from "./Utils/Types";

export default class Atom<T> implements IReadOnlyAtom<T> {
  private value_: T;
  private changed_event_ = new Broadcaster<[value: T, previous_value: T]>();

  constructor(value: T) {
    this.value_ = value;
  }

  /**lowlevel call to trigger changed event*/
  Notify(previous_value: T) {
    this.changed_event_.Fire(this.value_, previous_value);
  }

  /**sets the value of the atom */
  Set(value: T) {
    if (value === this.value_) return;
    const previous_value = value;
    this.value_ = value;
    if (StoreHandler.IsBatch) return;
    this.changed_event_.Fire(value, previous_value);
  }

  Computed<Q>(callback: (value: T) => Q): [IReadOnlyAtom<Q>, CleanUp] {
    const computed_atom = new Atom(callback(this.value_));

    return [
      computed_atom,
      this.Subscribe((value) => computed_atom.Set(callback(value))),
    ];
  }

  /**gets the value of the atom */
  Get() {
    StoreHandler.ReportOnRead(this);
    return this.value_;
  }

  /**gets the value without notifying*/
  Peek() {
    return this.value_;
  }

  /**subscribes to atom change */
  Subscribe(callback: (value: T, previous_value: T) => void): CleanUp {
    return this.changed_event_.Listen(callback);
  }

  /**subscribes to atom change and immediately executes*/
  Effect(callback: (value: T, previous_value?: T) => void): CleanUp {
    callback(this.value_);
    return this.Subscribe(callback);
  }
}
