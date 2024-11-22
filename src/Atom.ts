import { StoreHandler } from "./StoreHandler";
import type { CleanUp } from "./Types/CleanUp";
import type { IAtomConfig } from "./Types/IAtomConfig";
import type { IReadOnlyAtom } from "./Types/IReadOnlyAtom";
import Broadcaster from "./Utils/Broadcaster";

export default class Atom<T> implements IReadOnlyAtom<T> {
  DebugId = Math.random();
  private value_: T;
  private changed_event_ = new Broadcaster<[value: T, previous_value: T]>();
  private equals_?: IAtomConfig<T>["Equals"];

  constructor(value: T, config?: IAtomConfig<T>) {
    this.value_ = value;
    this.equals_ = config?.Equals;
  }

  GetSubscribers() {
    return this.changed_event_.GetListeners();
  }

  /**sets the value of the atom */
  Set(value: T) {
    if (this.equals_?.(value, this.value_) ?? value === this.value_) return;

    const previous_value = value;
    this.value_ = value;
    if (StoreHandler.IsBatch()) {
      StoreHandler.ReportOnBatchWrite(this, value, previous_value);
      return;
    }
    this.changed_event_.Fire(value, previous_value);
  }

  Computed<Q>(callback: (value: T) => Q): [IReadOnlyAtom<Q>, CleanUp] {
    const computed_atom = new Atom(callback(this.value_));

    return [
      computed_atom,
      this.Subscribe((value) => computed_atom.Set(callback(value))),
    ];
  }

  Get() {
    StoreHandler.ReportOnRead(this);
    return this.value_;
  }

  Peek() {
    return this.value_;
  }

  Subscribe(callback: (value: T, previous_value: T) => void): CleanUp {
    return this.changed_event_.Listen(callback);
  }

  Effect(callback: (value: T, previous_value?: T) => void): CleanUp {
    callback(this.value_);
    return this.Subscribe(callback);
  }
}
