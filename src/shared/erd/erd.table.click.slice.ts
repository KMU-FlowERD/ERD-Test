import { StateCreator } from 'zustand'
  
interface ClickType {
  positionX: number,
  positionY: number,
  width: number,
  height: number,
  index: number,
};

export interface ClickSlice {
  clickPosition: ClickType,
  setPos: (x: number, y: number, width: number, height: number, index: number) => void,
};

const defaultState: ClickType = {positionX: 0, positionY: 0, width: 0, height: 0, index: 0};

export const createClickSlice: StateCreator<ClickSlice, [], [], ClickSlice> = (set, get) => ({
  clickPosition: defaultState,
  setPos: (x: number, y: number, width: number, height: number, index: number) => {
    set({clickPosition: {positionX: x, positionY: y, width: width, height: height, index: index}})
  },
});