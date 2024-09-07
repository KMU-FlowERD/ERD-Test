import { StateCreator } from 'zustand';
import { TableSlice } from './erd.table.slice';

interface LineType {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface LineCount {
  top: number,
  bottom: number,
  left: number,
  right: number,
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

    const tableLineCount: Array<LineCount> = tables.map(()=>{return {top: 0, bottom: 0, left: 0, right: 0}});

    const lines: Array<LineType> = [];

    tables.forEach((startTable, startIndex) => {
      startTable.connectIndex.forEach((endIndex) => {
        const endTable = tables[endIndex];

        const startX = startTable.positionX + startTable.width / 2;
        const startY = startTable.positionY + startTable.height / 2;
        const endX = endTable.positionX + endTable.width / 2;
        const endY = endTable.positionY + endTable.height / 2;

        const angle = calculateAngle({ startX: startX, startY: startY, endX: endX, endY: endY });

        const {startDirection, endDirection} = getDirection(angle, startTable, endTable);
        
        if(startDirection == Direction.TOP) {
          tables[startIndex].connectDirection.top += 1;
        } else if(startDirection == Direction.BOTTOM) {
          tables[startIndex].connectDirection.bottom += 1;
        } else if(startDirection == Direction.LEFT) {
          tables[startIndex].connectDirection.left += 1;
        } else if(startDirection == Direction.RIGHT) {
          tables[startIndex].connectDirection.right += 1;
        }

        if(endDirection == Direction.TOP) {
          tables[endIndex].connectDirection.top += 1;
        } else if(endDirection == Direction.BOTTOM) {
          tables[endIndex].connectDirection.bottom += 1;
        } else if(endDirection == Direction.LEFT) {
          tables[endIndex].connectDirection.left += 1;
        } else if(endDirection == Direction.RIGHT) {
          tables[endIndex].connectDirection.right += 1;
        }
      });
    });

    tables.forEach((startTable, startIndex) => {
      startTable.connectIndex.forEach((endIndex) => {
        const endTable = tables[endIndex];

        const startX = startTable.positionX + startTable.width / 2;
        const startY = startTable.positionY + startTable.height / 2;
        const endX = endTable.positionX + endTable.width / 2;
        const endY = endTable.positionY + endTable.height / 2;

        const angle = calculateAngle({ startX: startX, startY: startY, endX: endX, endY: endY });

        linePush(
          lines, 
          angle, 
          startTable, 
          endTable, 
          {startX, startY, endX, endY},
          tableLineCount,
          startIndex,
          endIndex
        );
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

function linePush(
  lines: Array<LineType>,
  angle: number,
  startTable: { width: number; height: number, connectDirection: LineCount },
  endTable: { width: number; height: number, connectDirection: LineCount },
  line: LineType,
  tableLineCount: Array<LineCount>,
  startIndex: number,
  endIndex: number,
) {
  const { startDirection, endDirection, updatedStart, updatedEnd } = getLineDirectionsAndPositions(
    angle,
    startTable,
    endTable,
    line,
  );

  line.startX = updatedStart.x;
  line.startY = updatedStart.y;
  line.endX = updatedEnd.x;
  line.endY = updatedEnd.y;

  if(startDirection == Direction.TOP) {
    tableLineCount[startIndex].top += 1;
    line.startX -= startTable.width / 2;
    line.startX += startTable.width / (startTable.connectDirection.top+1) * tableLineCount[startIndex].top
  } else if(startDirection == Direction.BOTTOM) {
    tableLineCount[startIndex].bottom += 1;
    line.startX -= startTable.width / 2;
    line.startX += startTable.width / (startTable.connectDirection.bottom+1) * tableLineCount[startIndex].bottom
  } else if(startDirection == Direction.LEFT) {
    tableLineCount[startIndex].left += 1;
    line.startY -= startTable.height / 2;
    line.startY += startTable.height / (startTable.connectDirection.left+1) * tableLineCount[startIndex].left
  } else if(startDirection == Direction.RIGHT) {
    tableLineCount[startIndex].right += 1;
    line.startY -= startTable.height/2;
    line.startY += startTable.height / (startTable.connectDirection.right+1) * tableLineCount[startIndex].right
  }

  if(endDirection == Direction.TOP) {
    tableLineCount[endIndex].top += 1;
    line.endX -= endTable.width / 2;
    line.endX += endTable.width / (endTable.connectDirection.top+1) * tableLineCount[endIndex].top
  } else if(endDirection == Direction.BOTTOM) {
    tableLineCount[endIndex].bottom += 1;
    line.endX -= endTable.width / 2;
    line.endX += endTable.width / (endTable.connectDirection.bottom+1) * tableLineCount[endIndex].bottom
  } else if(endDirection == Direction.LEFT) {
    tableLineCount[endIndex].left += 1;
    line.endY -= endTable.height / 2;
    line.endY += endTable.height / (endTable.connectDirection.left+1) * tableLineCount[endIndex].left
  } else if(endDirection == Direction.RIGHT) {
    tableLineCount[endIndex].right += 1;
    line.endY -= endTable.height/2;
    line.endY += endTable.height / (endTable.connectDirection.right+1) * tableLineCount[endIndex].right
  }

  const deltaX = line.endX - line.startX;
  const deltaY = line.endY - line.startY;

  const drawLines: Array<LineType> = getDrawLines(startDirection, endDirection, line, deltaX, deltaY);

  drawLines.forEach((line) => lines.push(line));
}

function getDirection(
  angle: number,
  startTable: { width: number; height: number },
  endTable: { width: number; height: number },
) {
  const tanAngle = Math.tan(getRadian(angle));
  const startAspect = startTable.height / startTable.width;
  const endAspect = endTable.height / endTable.width;

  let startDirection: Direction;
  let endDirection: Direction;

  if (angle <= 90) {
    if (tanAngle < startAspect) {
      startDirection = Direction.RIGHT;
      endDirection = tanAngle < endAspect ? Direction.LEFT : Direction.BOTTOM;
    } else {
      startDirection = Direction.TOP;
      endDirection = tanAngle < endAspect ? Direction.LEFT : Direction.BOTTOM;
    }
  } else if (angle <= 180) {
    if (tanAngle > -startAspect) {
      startDirection = Direction.LEFT;
      endDirection = tanAngle > -endAspect ? Direction.RIGHT : Direction.BOTTOM;
    } else {
      startDirection = Direction.TOP;
      endDirection = tanAngle > -endAspect ? Direction.RIGHT : Direction.BOTTOM;
    }
  } else if (angle <= 270) {
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

  return {startDirection: startDirection, endDirection: endDirection};
}

function getLineDirectionsAndPositions(
  angle: number,
  startTable: { width: number; height: number },
  endTable: { width: number; height: number },
  line: LineType
) {
  const tanAngle = Math.tan(getRadian(angle));
  const startAspect = startTable.height / startTable.width;
  const endAspect = endTable.height / endTable.width;

  let startDirection: Direction;
  let endDirection: Direction;

  if (angle <= 90) {
    if (tanAngle < startAspect) {
      startDirection = Direction.RIGHT;
      endDirection = tanAngle < endAspect ? Direction.LEFT : Direction.BOTTOM;
    } else {
      startDirection = Direction.TOP;
      endDirection = tanAngle < endAspect ? Direction.LEFT : Direction.BOTTOM;
    }
  } else if (angle <= 180) {
    if (tanAngle > -startAspect) {
      startDirection = Direction.LEFT;
      endDirection = tanAngle > -endAspect ? Direction.RIGHT : Direction.BOTTOM;
    } else {
      startDirection = Direction.TOP;
      endDirection = tanAngle > -endAspect ? Direction.RIGHT : Direction.BOTTOM;
    }
  } else if (angle <= 270) {
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

  const updatedStart = {x: line.startX, y: line.startY};
  const updatedEnd = {x: line.endX, y: line.endY};

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
  line: LineType,
  deltaX: number,
  deltaY: number
): Array<LineType> {
  const lines: Array<LineType> = [];

  const startX = line.startX;
  const startY = line.startY;
  const endX = line.endX;
  const endY = line.endY;

  if ((startDirection === Direction.TOP && endDirection === Direction.BOTTOM) || (startDirection === Direction.BOTTOM && endDirection === Direction.TOP)) {
    lines.push({ startX: startX, startY: startY, endX: startX, endY: startY + deltaY / 2 });
    lines.push({ startX: startX, startY: startY + deltaY / 2, endX: endX, endY: startY + deltaY / 2 });
    lines.push({ startX: endX, startY: startY + deltaY / 2, endX: endX, endY: endY });
  } else if ((startDirection === Direction.TOP && endDirection !== Direction.BOTTOM) || (startDirection === Direction.BOTTOM && endDirection !== Direction.TOP)) {
    lines.push({ startX: startX, startY: startY, endX: startX, endY: startY + deltaY / 2});
    lines.push({ startX: startX, startY: startY + deltaY / 2, endX: startX + deltaX / 2, endY: startY + deltaY / 2});
    lines.push({ startX: startX + deltaX / 2, startY: startY + deltaY / 2, endX: startX + deltaX / 2, endY: endY });
    lines.push({ startX: startX + deltaX / 2, startY: endY, endX: endX, endY: endY });
  } else if ((startDirection === Direction.LEFT && endDirection === Direction.RIGHT) || (startDirection === Direction.RIGHT && endDirection === Direction.LEFT)) {
    lines.push({ startX: startX, startY: startY, endX: startX + deltaX / 2, endY: startY });
    lines.push({ startX: startX + deltaX / 2, startY: startY, endX: startX + deltaX / 2, endY: endY });
    lines.push({ startX: startX + deltaX / 2, startY: endY, endX: endX, endY: endY });
  } else {
    lines.push({ startX: startX, startY: startY, endX: startX + deltaX / 2, endY: startY, });
    lines.push({ startX: startX + deltaX / 2, startY: startY, endX: startX + deltaX / 2, endY: startY + deltaY / 2 });
    lines.push({ startX: startX + deltaX / 2, startY: startY + deltaY / 2, endX: endX, endY: startY + deltaY / 2 });
    lines.push({ startX: startX + deltaX / 2, startY: startY + deltaY / 2, endX: endX, endY: endY });
  }

  return lines;
}

function calculateAngle(line: LineType): number {
  const deltaX = line.endX - line.startX;
  const deltaY = line.startY - line.endY;
  const radians = Math.atan2(deltaY, deltaX);
  return (radians * (180 / Math.PI) + 360) % 360;
}

function getRadian(degree: number): number {
  return (degree * Math.PI) / 180;
}
