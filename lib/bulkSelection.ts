export function toggleSelectedId(selectedIds: string[], id: string) {
  return selectedIds.includes(id) ? selectedIds.filter((selectedId) => selectedId !== id) : [...selectedIds, id];
}

export function togglePageSelection(selectedIds: string[], pageIds: string[]) {
  const selected = new Set(selectedIds);
  const pageIsSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  pageIds.forEach((id) => pageIsSelected ? selected.delete(id) : selected.add(id));
  return [...selected];
}
