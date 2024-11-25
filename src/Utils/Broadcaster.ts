import type { CleanUp } from "../Types/CleanUp";
import RemoveElementFromArray from "./RemoveElementFromArray";

export default class Broadcaster<T extends unknown[]> {
  private listeners_: ((...args: T) => void)[] = [];

  GetListeners() {
    return [...this.listeners_];
  }

  Listen(callback: (...args: T) => void): CleanUp {
    this.listeners_.push(callback);
    return () => {
      RemoveElementFromArray(this.listeners_, callback);
    };
  }

  Fire(...args: T) {
    //it changes itself so it's better to take the copy of it
    for (const listener of [...this.listeners_]) {
      try {
        listener(...args);
      } catch (error_message) {
        console.warn(error_message);
      }
    }
  }
}
