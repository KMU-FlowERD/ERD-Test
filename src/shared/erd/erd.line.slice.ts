import { StateCreator } from 'zustand'
import { ColumnType } from '@/shared/column';
import { TableSlice } from './erd.table.slice';
  
interface LineType {
  x1: number,
  y1: number,
  x2: number,
  y2: number,
};

export interface LineSlice {
  lines: Array<LineType>,
  setLines: () => void,
};

const defaultState: Array<LineType> = [];

export const createLineSlice: StateCreator<LineSlice & TableSlice, [], [], LineSlice> = (set, get) => ({
  lines: defaultState,
  setLines: () => {
    const tables = get().tables;
    const lines: Array<LineType> = [];

    tables.map((startTable) => {
      startTable.connectIndex.map((connect) => {
        const endTable = tables[connect];

        const startX = startTable.positionX + startTable.width/2;
        const startY = startTable.positionY + startTable.height/2;

        const endX = endTable.positionX + endTable.width/2;
        const endY = endTable.positionY + endTable.height/2;

        const angle = calculateAngle({x1: startX, x2: endX, y1:startY, y2: endY});

        if(angle == 0) {
          lines.push({
            x1: startX + startTable.width / 2, 
            x2: endX - endTable.width / 2,
            y1: startY,
            y2: endY,
          });
        } else if(angle < 90) {
          linePush(
            lines,
            angle,
            startTable,
            endTable,
            startX,
            startY,
            endX,
            endY
          );
        } else if(angle == 90) {
          lines.push({
            x1: startX, 
            x2: endX,
            y1: startY - startTable.height / 2,
            y2: endY + endTable.height / 2,
          });
        } else if(angle < 180) {

        } else if(angle == 180) {
          lines.push({
            x1: startX - startTable.width / 2, 
            x2: endX + endTable.width / 2,
            y1: startY,
            y2: endY,
          });
        } else if(angle < 270) {

        } else if(angle == 270) {
          lines.push({
            x1: startX, 
            x2: endX,
            y1: startY + startTable.height / 2,
            y2: endY - endTable.height / 2,
          });
        } else {

        }
      });
    });

    set({lines:lines});
  },
});

function linePush(
  lines: Array<LineType>, 
  angle: number, 
  startTable: {width:number, height:number},
  endTable: {width:number, height:number},
  startX: number,
  startY: number,
  endX: number,
  endY: number
) {
  if(Math.tan(getRadian(angle)) < (startTable.height / startTable.width)) {
    if(Math.tan(getRadian(angle)) < (endTable.height / endTable.width)) {
      lines.push({
        x1: startX + startTable.width / 2,
        x2: endX - endTable.width / 2,
        y1: startY,
        y2: endY,
      });
    } else {
      lines.push({
        x1: startX + startTable.width / 2,
        x2: endX,
        y1: startY,
        y2: endY + endTable.height / 2,
      });
    }
  } else {
    if(Math.tan(getRadian(angle)) < (endTable.height / endTable.width)) {
      lines.push({
        x1: startX,
        x2: endX - endTable.width / 2,
        y1: startY - startTable.height / 2,
        y2: endY,
      });
    } else {
      lines.push({
        x1: startX,
        x2: endX,
        y1: startY - startTable.height / 2,
        y2: endY + endTable.height / 2,
      });
    }
  }
}

function calculateAngle(line: LineType): number {
  const deltaX = line.x2 - line.x1;
  const deltaY = line.y1 - line.y2;

  const radians = Math.atan2(deltaY, deltaX);

  const degrees = radians * (180 / Math.PI);

  return (degrees + 360) % 360;
}

function getRadian(degree: number): number {
  return (degree * Math.PI) / 180;
}