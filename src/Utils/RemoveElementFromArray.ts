export default function RemoveElementFromArray<T>(array: T[], element: T) {
  const index = array.indexOf(element);
  if (index === -1) return;
  return array.splice(index, 1);
}
