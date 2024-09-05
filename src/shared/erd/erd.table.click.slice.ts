import { StateCreator } from 'zustand'
  
interface ClickType {
  positionX: number,
  positionY: number,
};

export interface ClickSlice {
  clickPosition: ClickType,
  setPos: (x: number, y: number) => void,
};

const defaultState: ClickType = {positionX: 0, positionY: 0};

export const createClickSlice: StateCreator<ClickSlice, [], [], ClickSlice> = (set, get) => ({
  clickPosition: defaultState,
  setPos: (x: number, y: number) => {
    set({clickPosition: {positionX: x, positionY: y}})
  },
});