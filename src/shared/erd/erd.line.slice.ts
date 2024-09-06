import { StateCreator } from 'zustand';
import { TableSlice } from './erd.table.slice';

interface LineType {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface LineSlice {
  lines: Array<LineType>;
  setLines: () => void;
}

const defaultState: Array<LineType> = [];

export const createLineSlice: StateCreator<LineSlice & TableSlice, [], [], LineSlice> = (set, get) => ({
  lines: defaultState,
  setLines: () => {
    const tables = get().tables;
    const lines: Array<LineType> = [];

    tables.forEach((startTable) => {
      startTable.connectIndex.forEach((connect) => {
        const endTable = tables[connect];

        const startX = startTable.positionX + startTable.width / 2;
        const startY = startTable.positionY + startTable.height / 2;
        const endX = endTable.positionX + endTable.width / 2;
        const endY = endTable.positionY + endTable.height / 2;

        const angle = calculateAngle({ x1: startX, x2: endX, y1: startY, y2: endY });

        if ([0, 90, 180, 270].includes(angle)) {
          lines.push(getStraightLine(angle, startX, startY, endX, endY, startTable, endTable));
        } else {
          linePush(lines, angle, startTable, endTable, startX, startY, endX, endY);
        }
      });
    });

    set({ lines });
  },
});

enum Direction {
  TOP,
  BOTTOM,
  LEFT,
  RIGHT,
}

function getStraightLine(angle: number, startX: number, startY: number, endX: number, endY: number, startTable: any, endTable: any): LineType {
  switch (angle) {
    case 0:
      return { x1: startX + startTable.width / 2, y1: startY, x2: endX - endTable.width / 2, y2: endY };
    case 90:
      return { x1: startX, y1: startY - startTable.height / 2, x2: endX, y2: endY + endTable.height / 2 };
    case 180:
      return { x1: startX - startTable.width / 2, y1: startY, x2: endX + endTable.width / 2, y2: endY };
    case 270:
      return { x1: startX, y1: startY + startTable.height / 2, x2: endX, y2: endY - endTable.height / 2 };
    default:
      throw new Error('Invalid angle');
  }
}

function linePush(
  lines: Array<LineType>,
  angle: number,
  startTable: { width: number; height: number },
  endTable: { width: number; height: number },
  startX: number,
  startY: number,
  endX: number,
  endY: number
) {
  const { startDirection, endDirection, updatedStart, updatedEnd } = getLineDirectionsAndPositions(
    angle,
    startTable,
    endTable,
    startX,
    startY,
    endX,
    endY
  );

  startX = updatedStart.x;
  startY = updatedStart.y;
  endX = updatedEnd.x;
  endY = updatedEnd.y;

  const deltaX = endX - startX;
  const deltaY = endY - startY;

  const drawLines: Array<LineType> = getDrawLines(startDirection, endDirection, startX, startY, endX, endY, deltaX, deltaY);

  drawLines.forEach((line) => lines.push(line));
}

function getLineDirectionsAndPositions(
  angle: number,
  startTable: { width: number; height: number },
  endTable: { width: number; height: number },
  startX: number,
  startY: number,
  endX: number,
  endY: number
) {
  const tanAngle = Math.tan(getRadian(angle));
  const startAspect = startTable.height / startTable.width;
  const endAspect = endTable.height / endTable.width;

  let startDirection: Direction;
  let endDirection: Direction;

  if (angle < 90) {
    if (tanAngle < startAspect) {
      startDirection = Direction.RIGHT;
      endDirection = tanAngle < endAspect ? Direction.LEFT : Direction.BOTTOM;
    } else {
      startDirection = Direction.TOP;
      endDirection = tanAngle < endAspect ? Direction.LEFT : Direction.BOTTOM;
    }
  } else if (angle < 180) {
    if (tanAngle > -startAspect) {
      startDirection = Direction.LEFT;
      endDirection = tanAngle > -endAspect ? Direction.RIGHT : Direction.BOTTOM;
    } else {
      startDirection = Direction.TOP;
      endDirection = tanAngle > -endAspect ? Direction.RIGHT : Direction.BOTTOM;
    }
  } else if (angle < 270) {
    if (tanAngle < startAspect) {
      startDirection = Direction.LEFT;
      endDirection = tanAngle < endAspect ? Direction.RIGHT : Direction.TOP;
    } else {
      startDirection = Direction.BOTTOM;
      endDirection = tanAngle < endAspect ? Direction.RIGHT : Direction.TOP;
    }
  } else {
    if (tanAngle > -startAspect) {
      startDirection = Direction.RIGHT;
      endDirection = tanAngle > -endAspect ? Direction.LEFT : Direction.TOP;
    } else {
      startDirection = Direction.BOTTOM;
      endDirection = tanAngle > -endAspect ? Direction.LEFT : Direction.TOP;
    }
  }

  const updatedStart = {x: startX, y: startY};
  const updatedEnd = {x: endX, y: endY};

  if(startDirection === Direction.RIGHT) {
    updatedStart.x += startTable.width/2;
  } else if(startDirection === Direction.LEFT) {
    updatedStart.x -= startTable.width/2;
  } else if(startDirection === Direction.TOP) {
    updatedStart.y -= startTable.height/2;
  } else if(startDirection === Direction.BOTTOM) {
    updatedStart.y += startTable.height/2;
  }

  if(endDirection === Direction.RIGHT) {
    updatedEnd.x += endTable.width/2;
  } else if(endDirection === Direction.LEFT) {
    updatedEnd.x -= endTable.width/2;
  } else if(endDirection === Direction.TOP) {
    updatedEnd.y -= endTable.height/2;
  } else if(endDirection === Direction.BOTTOM) {
    updatedEnd.y += endTable.height/2;
  }

  return { startDirection, endDirection, updatedStart, updatedEnd };
}

function getDrawLines(
  startDirection: Direction,
  endDirection: Direction,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  deltaX: number,
  deltaY: number
): Array<LineType> {
  const lines: Array<LineType> = [];

  if ((startDirection === Direction.TOP && endDirection === Direction.BOTTOM) || (startDirection === Direction.BOTTOM && endDirection === Direction.TOP)) {
    lines.push({ x1: startX, y1: startY, x2: startX, y2: startY + deltaY / 2 });
    lines.push({ x1: startX, y1: startY + deltaY / 2, x2: endX, y2: startY + deltaY / 2 });
    lines.push({ x1: endX, y1: startY + deltaY / 2, x2: endX, y2: endY });
  } else if ((startDirection === Direction.TOP && endDirection !== Direction.BOTTOM) || (startDirection === Direction.BOTTOM && endDirection !== Direction.TOP)) {
    lines.push({ x1: startX, y1: startY, x2: startX, y2: startY + deltaY / 2});
    lines.push({ x1: startX, y1: startY + deltaY / 2, x2: startX + deltaX / 2, y2: startY + deltaY / 2});
    lines.push({ x1: startX + deltaX / 2, y1: startY + deltaY / 2, x2: startX + deltaX / 2, y2: endY });
    lines.push({ x1: startX + deltaX / 2, y1: endY, x2: endX, y2: endY });
  } else if ((startDirection === Direction.LEFT && endDirection === Direction.RIGHT) || (startDirection === Direction.RIGHT && endDirection === Direction.LEFT)) {
    lines.push({ x1: startX, y1: startY, x2: startX + deltaX / 2, y2: startY });
    lines.push({ x1: startX + deltaX / 2, y1: startY, x2: startX + deltaX / 2, y2: endY });
    lines.push({ x1: startX + deltaX / 2, y1: endY, x2: endX, y2: endY });
  } else {
    lines.push({ x1: startX, y1: startY, x2: startX + deltaX / 2, y2: startY, });
    lines.push({ x1: startX + deltaX / 2, y1: startY, x2: startX + deltaX / 2, y2: startY + deltaY / 2 });
    lines.push({ x1: startX + deltaX / 2, y1: startY + deltaY / 2, x2: endX, y2: startY + deltaY / 2 });
    lines.push({ x1: startX + deltaX / 2, y1: startY + deltaY / 2, x2: endX, y2: endY });
  }

  return lines;
}

function calculateAngle(line: LineType): number {
  const deltaX = line.x2 - line.x1;
  const deltaY = line.y1 - line.y2;
  const radians = Math.atan2(deltaY, deltaX);
  return (radians * (180 / Math.PI) + 360) % 360;
}

function getRadian(degree: number): number {
  return (degree * Math.PI) / 180;
}
