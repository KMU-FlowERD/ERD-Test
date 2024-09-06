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
        } else if(angle == 90) {
          lines.push({
            x1: startX, 
            x2: endX,
            y1: startY - startTable.height / 2,
            y2: endY + endTable.height / 2,
          });
        } else if(angle == 180) {
          lines.push({
            x1: startX - startTable.width / 2, 
            x2: endX + endTable.width / 2,
            y1: startY,
            y2: endY,
          });
        } else if(angle == 270) {
          lines.push({
            x1: startX, 
            x2: endX,
            y1: startY + startTable.height / 2,
            y2: endY - endTable.height / 2,
          });
        } else {
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
        }
      });
    });

    set({lines:lines});
  },
});

enum Direction {
  TOP, BOTTOM, LEFT, RIGHT
};

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
  let startDirection: Direction;
  let endDirection: Direction;

  if(angle < 90){
    if(Math.tan(getRadian(angle)) < (startTable.height / startTable.width)) {
      if(Math.tan(getRadian(angle)) < (endTable.height / endTable.width)) {
        startDirection = Direction.RIGHT;
        endDirection = Direction.LEFT;

        startX += startTable.width / 2;
        endX -= endTable.width / 2;
      } else {
        startDirection = Direction.RIGHT;
        endDirection = Direction.BOTTOM;

        startX += startTable.width / 2;
        endY += endTable.height / 2;
      }
    } else {
      if(Math.tan(getRadian(angle)) < (endTable.height / endTable.width)) {
        startDirection = Direction.TOP;
        endDirection = Direction.LEFT;

        endX -= endTable.width / 2;
        startY -= startTable.height / 2;
      } else {
        startDirection = Direction.TOP;
        endDirection = Direction.BOTTOM;

        startY -= startTable.height / 2;
        endY += endTable.height / 2;
      }
    }
  } else if(angle < 180) {
    if(Math.tan(getRadian(angle)) > -(startTable.height / startTable.width)) {
      if(Math.tan(getRadian(angle)) > -(endTable.height / endTable.width)) {
        startDirection = Direction.LEFT;
        endDirection = Direction.RIGHT;

        startX -= startTable.width / 2;
        endX += endTable.width / 2;
      } else {
        startDirection = Direction.LEFT;
        endDirection = Direction.BOTTOM;

        startX -= startTable.width / 2;
        endY += endTable.height / 2;
      }
    } else {
      if(Math.tan(getRadian(angle)) > -(endTable.height / endTable.width)) {
        startDirection = Direction.TOP;
        endDirection = Direction.RIGHT;

        endX += endTable.width / 2;
        startY -= startTable.height / 2;
      } else {
        startDirection = Direction.TOP;
        endDirection = Direction.BOTTOM;

        startY -= startTable.height / 2;
        endY += endTable.height / 2;
      }
    }
  } else if(angle < 270) {
    if(Math.tan(getRadian(angle)) < (startTable.height / startTable.width)) {
      if(Math.tan(getRadian(angle)) < (endTable.height / endTable.width)) {
        startDirection = Direction.LEFT;
        endDirection = Direction.RIGHT;

        startX -= startTable.width / 2;
        endX += endTable.width / 2;
      } else {
        startDirection = Direction.LEFT;
        endDirection = Direction.TOP;

        startX -= startTable.width / 2;
        endY -= endTable.height / 2;
      }
    } else {
      if(Math.tan(getRadian(angle)) < (endTable.height / endTable.width)) {
        startDirection = Direction.BOTTOM;
        endDirection = Direction.RIGHT;

        endX += endTable.width / 2;
        startY += startTable.height / 2;
      } else {
        startDirection = Direction.BOTTOM;
        endDirection = Direction.TOP;

        startY += startTable.height / 2;
        endY -= endTable.height / 2;
      }
    }
  } else {
    if(Math.tan(getRadian(angle)) > -(startTable.height / startTable.width)) {
      if(Math.tan(getRadian(angle)) > -(endTable.height / endTable.width)) {
        startDirection = Direction.RIGHT;
        endDirection = Direction.LEFT;

        startX += startTable.width / 2;
        endX -= endTable.width / 2;
      } else {
        startDirection = Direction.RIGHT;
        endDirection = Direction.TOP;

        startX += startTable.width / 2;
        endY -= endTable.height / 2;
      }
    } else {
      if(Math.tan(getRadian(angle)) > -(endTable.height / endTable.width)) {
        startDirection = Direction.BOTTOM;
        endDirection = Direction.LEFT;

        endX -= endTable.width / 2;
        startY += startTable.height / 2;
      } else {
        startDirection = Direction.BOTTOM;
        endDirection = Direction.TOP;

        startY += startTable.height / 2;
        endY -= endTable.height / 2;
      }
    }
  }

  const deltaX = endX - startX;
  const deltaY = endY - startY;
  
  const drawLines: Array<LineType> = [];

  if((startDirection == Direction.TOP && endDirection == Direction.BOTTOM) ||
      (startDirection == Direction.BOTTOM && endDirection == Direction.TOP)) {
    drawLines.push({
      x1: startX,
      y1: startY,
      x2: startX,
      y2: startY + deltaY/2
    });

    drawLines.push({
      x1: startX,
      y1: startY + deltaY/2,
      x2: endX,
      y2: startY + deltaY/2
    });

    drawLines.push({
      x1: endX,
      y1: startY + deltaY/2,
      x2: endX,
      y2: endY
    });

  } else if((startDirection == Direction.LEFT && endDirection == Direction.RIGHT) ||
            (startDirection == Direction.RIGHT && endDirection == Direction.LEFT)) {
    drawLines.push({
      x1: startX,
      y1: startY,
      x2: startX + deltaX/2,
      y2: startY
    });

    drawLines.push({
      x1: startX + deltaX/2,
      y1: startY,
      x2: startX + deltaX/2,
      y2: endY
    });

    drawLines.push({
      x1: startX + deltaX/2,
      y1: endY,
      x2: endX,
      y2: endY
    });
  } else if((startDirection == Direction.TOP && endDirection != Direction.BOTTOM) ||
            (startDirection == Direction.BOTTOM && endDirection != Direction.TOP)) {
    drawLines.push({
      x1: startX,
      y1: startY,
      x2: startX,
      y2: startY + deltaY/2
    });

    drawLines.push({
      x1: startX,
      y1: startY + deltaY/2,
      x2: startX + deltaX/2,
      y2: startY + deltaY/2
    });

    drawLines.push({
      x1: startX + deltaX/2,
      y1: startY + deltaY/2,
      x2: startX + deltaX/2,
      y2: endY
    });

    drawLines.push({
      x1: startX + deltaX/2,
      y1: endY,
      x2: endX,
      y2: endY
    });
  } else if((startDirection == Direction.LEFT && endDirection != Direction.RIGHT) ||
            (startDirection == Direction.RIGHT && endDirection != Direction.LEFT)) {
    drawLines.push({
      x1: startX,
      y1: startY,
      x2: startX + deltaX/2,
      y2: startY,
    });

    drawLines.push({
      x1: startX + deltaX/2,
      y1: startY,
      x2: startX + deltaX/2,
      y2: startY + deltaY/2
    });

    drawLines.push({
      x1: startX + deltaX/2,
      y1: startY + deltaY/2,
      x2: endX,
      y2: startY + deltaY/2
    });

    drawLines.push({
      x1: startX + deltaX/2,
      y1: startY + deltaY/2,
      x2: endX,
      y2: endY
    });
  }

  drawLines.map((line) => {
    lines.push({
      x1: line.x1,
      x2: line.x2,
      y1: line.y1,
      y2: line.y2,
    });
  });
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