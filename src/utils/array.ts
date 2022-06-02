import { arrayMove as dndKitArrayMove } from "@dnd-kit/sortable";

export const removeAtIndex = (array: Array<any>, index: number) => {
  return [...array.slice(0, index), ...array.slice(index + 1)];
};

export const insertAtIndex = (array: Array<any>, index: number, item: any) => {
  return [...array.slice(0, index), item, ...array.slice(index)];
};

export const arrayMove = (
  array: Array<any>,
  oldIndex: number,
  newIndex: number
) => {
  return dndKitArrayMove(array, oldIndex, newIndex);
};

export const isEmpty = (object: any) => {
  for (const property in object) {
    return false;
  }
  return true;
};

export const reorder = <T>(list: T[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
