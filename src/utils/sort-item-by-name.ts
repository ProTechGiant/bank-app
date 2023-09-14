export const sortItemsByName = <Type extends { Name: string }>(items: Type[]): Type[] => {
  items.sort((a, b) => (a.Name.toUpperCase() > b.Name.toUpperCase() ? 1 : -1));
  return items;
};
