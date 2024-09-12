import { StateCreator } from 'zustand'
  
interface ClickType {
  index: number,
};

export interface ClickSlice {
  clickPosition: ClickType,
  setPos: (index: number) => void,
};

const defaultState: ClickType = {index: -1};

export const createClickSlice: StateCreator<ClickSlice, [], [], ClickSlice> = (set, get) => ({
  clickPosition: defaultState,
  setPos: (index: number) => {
    set({clickPosition: {index: index}})
  },
});