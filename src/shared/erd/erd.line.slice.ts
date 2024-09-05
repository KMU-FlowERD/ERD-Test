import { StateCreator } from 'zustand'
import { ColumnType } from '@/shared/column';
  
interface LineType {
  x1: number,
  y1: number,
  x2: number,
  y2: number,
};

export interface LineSlice {
  lines: Array<LineType>,
  addLine: (x1: number, y1: number, x2: number, y2:number) => void,
};

const defaultState: Array<LineType> = [];

export const createLineSlice: StateCreator<LineSlice, [], [], LineSlice> = (set, get) => ({
  lines: defaultState,
  addLine: (x1: number, y1: number, x2: number, y2:number) => {
    const newLine = {
      x1:x1,
      y1:y1,
      x2:x2,
      y2:y2,
    };

    const lines = get();
    lines.lines.push(newLine);
    set({lines:lines.lines});
  },
});