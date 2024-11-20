import { atom, computed, peek } from "./Package";

const atom_value = atom(1);
const atom_value_2 = atom(2);

const [multiplication_atom, cleanup] = computed(() => {
  return atom_value.Get() * atom_value_2.Get();
});

multiplication_atom.Effect((value) => {
  console.log(value, "Result");
});

atom_value.Set(2);
atom_value_2.Set(3);
// cleanup();
atom_value_2.Set(4);
