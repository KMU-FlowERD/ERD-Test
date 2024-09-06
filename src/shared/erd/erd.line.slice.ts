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
  addLine: (newLine: LineType, 
            width1: number, height1: number, 
            width2: number, height2: number
          ) => void,
};

const defaultState: Array<LineType> = [];

function calculateAngle(line: LineType): number {
  const deltaX = line.x2 - line.x1;
  const deltaY = line.y2 - line.y1;

  const radians = Math.atan2(deltaY, deltaX);

  const degrees = radians * (180 / Math.PI);

  return (degrees + 360) % 360;
}

export const createLineSlice: StateCreator<LineSlice, [], [], LineSlice> = (set, get) => ({
  lines: defaultState,
  addLine: (
    newLine: LineType, 
    width1: number, height1: number, 
    width2: number, height2: number
  ) => {
    const lines = get();
    const angle = calculateAngle(newLine);
    console.log(angle);

    if(angle == 0) {

    } else if(angle < 90) {

    } else if(angle == 90) {

    } else if(angle < 180) {

    } else if(angle == 180) {

    } else if(angle < 270) {

    } else {

    }
  },
});