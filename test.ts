import { atom } from "./src";
import { computed } from "./src/index";

const map_value_atom = atom(new Map<number, number>());

function GetValue(id: number) {
  return map_value_atom.Get().get(id) ?? 0;
}

const [computed_1] = computed(() => GetValue(1), { DebugName: "Value1" });
const [computed_2] = computed(() => GetValue(2), { DebugName: "Value2" });

computed_1.Subscribe((value) => {
  console.log("Computed 1 became", value);
});
computed_2.Subscribe((value) => {
  console.log("Computed 2 became", value);
});

map_value_atom.Set(new Map([...map_value_atom.Peek(), [1, 1]]));
map_value_atom.Set(new Map([...map_value_atom.Peek(), [1, 2]]));
map_value_atom.Set(new Map([...map_value_atom.Peek(), [1, 3]]));
map_value_atom.Set(new Map([...map_value_atom.Peek(), [1, 4]]));

map_value_atom.Set(new Map([...map_value_atom.Peek(), [2, 4]]));
