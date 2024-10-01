import { ERDTable } from '@/features/erd-project';

export type TableDirectionChild = Map<
  Direction,
  { top: number; tableID: ERDTable['id'] }[]
>;

export function getStartEndDirection(fromTable: ERDTable, toTable: ERDTable) {
  const { fromX, fromY, toX, toY } = calculateMiddlePosition(
    fromTable,
    toTable,
  );

  const angle = calculateAngle({ fromX, fromY, toX, toY });

  return getDirection(
    angle,
    { width: fromTable.width, height: fromTable.height },
    { width: toTable.width, height: toTable.height },
    fromTable.id === toTable.id,
  );
}

export function getStartEndPosition(
  fromTable: ERDTable,
  toTable: ERDTable,
  tableDir: Map<ERDTable['id'], TableDirectionChild>,
) {
  const { fromX, fromY, toX, toY } = calculateMiddlePosition(
    fromTable,
    toTable,
  );

  const angle = calculateAngle({ fromX, fromY, toX, toY });

  const { fromDirection, toDirection } = getDirection(
    angle,
    { width: fromTable.width, height: fromTable.height },
    { width: toTable.width, height: toTable.height },
    fromTable.id === toTable.id,
  );

  const { updatedFrom, updatedTo } = getPosition(
    { width: fromTable.width, height: fromTable.height },
    { width: toTable.width, height: toTable.height },
    fromDirection,
    toDirection,
    { fromX, fromY, toX, toY },
  );

  if (fromTable.id === toTable.id)
    return {
      fromDirection,
      toDirection,
      lastFromPosition: updatedFrom,
      lastToPosition: updatedTo,
    };

  const lastFromPosition = getSortPosition(
    'from',
    fromDirection,
    tableDir,
    updatedFrom,
    fromTable,
    toTable,
  );
  const lastToPosition = getSortPosition(
    'to',
    toDirection,
    tableDir,
    updatedTo,
    toTable,
    fromTable,
  );

  return { fromDirection, toDirection, lastFromPosition, lastToPosition };
}

function getSortPosition(
  startPos: 'from' | 'to',
  direct: Direction,
  tableDir: Map<ERDTable['id'], TableDirectionChild>,
  pos: { x: number; y: number },
  fromTable: ERDTable,
  toTable: ERDTable,
) {
  const directionOnTable = tableDir.get(fromTable.id);

  if (directionOnTable) {
    const leftCnt = directionOnTable.get(direct)?.length;
    const left = directionOnTable
      .get(direct)
      ?.findIndex((a) => a.tableID === toTable.id);

    const size =
      direct === 'left' || direct === 'right'
        ? fromTable.height
        : fromTable.width;

    if (leftCnt !== undefined && leftCnt > 0 && left !== undefined) {
      if (direct === 'left' || direct === 'right') {
        const lastPos = {
          x: pos.x,
          y: pos.y - size / 2 + (size / (leftCnt + 1)) * (left + 1),
        };

        return lastPos;
      }
      const lastPos = {
        x: pos.x - size / 2 + (size / (leftCnt + 1)) * (left + 1),
        y: pos.y,
      };

      return lastPos;
    }
  }

  return pos;
}

export function getDrawLines(
  startDirection: Direction,
  endDirection: Direction,
  from: { x: number; y: number },
  to: { x: number; y: number },
) {
  if (
    (startDirection === 'top' && endDirection === 'bottom') ||
    (startDirection === 'bottom' && endDirection === 'top')
  ) {
    return getVerticalDrawLines(from, to);
  }
  if (
    (startDirection === 'top' && endDirection === 'bottom') ||
    (startDirection === 'bottom' && endDirection === 'top')
  ) {
    return getVerticalDifferntDrawLines(from, to);
  }
  if (
    (startDirection === 'left' && endDirection === 'right') ||
    (startDirection === 'right' && endDirection === 'left')
  ) {
    return getHorizontalDrawLines(from, to);
  }

  return getHorizontalDifferentDrawLines(from, to);
}

export function getDrawLinesMineMapping(
  from: { x: number; y: number },
  to: { x: number; y: number },
  minHeight: number,
  mineMappingCnt?: number,
) {
  const drawLines: {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
  }[] = [];

  const chagne = [
    { x: from.x, y: from.y },
    { x: from.x + 40, y: from.y },
    {
      x: from.x + 40,
      y: from.y + minHeight + 15 + (mineMappingCnt ? mineMappingCnt * 15 : 0),
    },
    {
      x: to.x,
      y: from.y + minHeight + 15 + (mineMappingCnt ? mineMappingCnt * 15 : 0),
    },
    { x: to.x, y: to.y },
  ];

  chagne.slice(0, -1).forEach((_, i) =>
    drawLines.push({
      fromX: chagne[i].x,
      fromY: chagne[i].y,
      toX: chagne[i + 1].x,
      toY: chagne[i + 1].y,
    }),
  );

  return drawLines;
}

export function getStartIEOneLine(
  startDirection: Direction,
  from: { x: number; y: number },
) {
  const startLine = {
    left: [
      { x: -5, y: -5 },
      { x: -5, y: +5 },
    ],
    right: [
      { x: +5, y: -5 },
      { x: +5, y: +5 },
    ],
    top: [
      { x: -5, y: -5 },
      { x: +5, y: -5 },
    ],
    bottom: [
      { x: -5, y: +5 },
      { x: +5, y: +5 },
    ],
  };

  const startLineDirection = startLine[startDirection];

  return {
    fromX: from.x + startLineDirection[0].x,
    fromY: from.y + startLineDirection[0].y,
    toX: from.x + startLineDirection[1].x,
    toY: from.y + startLineDirection[1].y,
  };
}

export function getEndIEOneLine(
  endDirection: Direction,
  to: { x: number; y: number },
) {
  const endLine = {
    left: [
      { x: -5, y: -5 },
      { x: -5, y: +5 },
    ],
    right: [
      { x: +5, y: -5 },
      { x: +5, y: +5 },
    ],
    top: [
      { x: -5, y: -5 },
      { x: +5, y: -5 },
    ],
    bottom: [
      { x: -5, y: +5 },
      { x: +5, y: +5 },
    ],
  };

  const endLineDirection = endLine[endDirection];

  return {
    fromX: to.x + endLineDirection[0].x,
    fromY: to.y + endLineDirection[0].y,
    toX: to.x + endLineDirection[1].x,
    toY: to.y + endLineDirection[1].y,
  };
}

export function getStartIENotNullOneLine(
  startDirection: Direction,
  from: { x: number; y: number },
) {
  const startLine = {
    left: [
      { x: -10, y: -5 },
      { x: -10, y: +5 },
    ],
    right: [
      { x: +10, y: -5 },
      { x: +10, y: +5 },
    ],
    top: [
      { x: -5, y: -10 },
      { x: +5, y: -10 },
    ],
    bottom: [
      { x: -5, y: +10 },
      { x: +5, y: +10 },
    ],
  };

  const startLineDirection = startLine[startDirection];

  return {
    fromX: from.x + startLineDirection[0].x,
    fromY: from.y + startLineDirection[0].y,
    toX: from.x + startLineDirection[1].x,
    toY: from.y + startLineDirection[1].y,
  };
}

export function getStartIENullableCircle(
  startDirection: Direction,
  from: { x: number; y: number },
) {
  const startCircle = {
    left: { x: from.x - 13, y: from.y, radius: 3 },
    right: { x: from.x + 13, y: from.y, radius: 3 },
    top: { x: from.x, y: from.y - 13, radius: 3 },
    bottom: { x: from.x, y: from.y + 13, radius: 3 },
  };

  return startCircle[startDirection];
}

export function getStartIDEFNullablePolygon(
  startDirection: Direction,
  from: { x: number; y: number },
) {
  const startPolygon = {
    left: {
      positions: `${from.x},${from.y} ${from.x - 4},${from.y - 4} ${from.x - 8},${from.y} ${from.x - 4},${from.y + 4}`,
    },
    right: {
      positions: `${from.x},${from.y} ${from.x + 4},${from.y - 4} ${from.x + 8},${from.y} ${from.x + 4},${from.y + 4}`,
    },
    top: {
      positions: `${from.x},${from.y} ${from.x - 4},${from.y - 4} ${from.x},${from.y - 8} ${from.x + 4},${from.y - 4}`,
    },
    bottom: {
      positions: `${from.x},${from.y} ${from.x - 4},${from.y + 4} ${from.x},${from.y + 8} ${from.x + 4},${from.y + 4}`,
    },
  };

  return startPolygon[startDirection];
}

export function getManyLines(
  endDirection: Direction,
  to: { x: number; y: number },
) {
  const endLines = {
    left: [
      { x: 0, y: 5 },
      { x: -10, y: 0 },
      { x: 0, y: -5 },
    ],
    right: [
      { x: 0, y: 5 },
      { x: 10, y: 0 },
      { x: 0, y: -5 },
    ],
    top: [
      { x: 5, y: 0 },
      { x: 0, y: -10 },
      { x: -5, y: 0 },
    ],
    bottom: [
      { x: 5, y: 0 },
      { x: 0, y: 10 },
      { x: -5, y: 0 },
    ],
  };

  const endLinesDirection = endLines[endDirection];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return endLinesDirection.slice(0, -1).map((_, i) => ({
    fromX: to.x + endLinesDirection[i].x,
    fromY: to.y + endLinesDirection[i].y,
    toX: to.x + endLinesDirection[i + 1].x,
    toY: to.y + endLinesDirection[i + 1].y,
  }));
}

export function getEndIENotNullOneLine(
  endDirection: Direction,
  to: { x: number; y: number },
) {
  const endLine = {
    left: [
      { x: -10, y: -5 },
      { x: -10, y: +5 },
    ],
    right: [
      { x: +10, y: -5 },
      { x: +10, y: +5 },
    ],
    top: [
      { x: -5, y: -10 },
      { x: +5, y: -10 },
    ],
    bottom: [
      { x: -5, y: +10 },
      { x: +5, y: +10 },
    ],
  };

  const endLineDirection = endLine[endDirection];

  return {
    fromX: to.x + endLineDirection[0].x,
    fromY: to.y + endLineDirection[0].y,
    toX: to.x + endLineDirection[1].x,
    toY: to.y + endLineDirection[1].y,
  };
}

export function getEndIENullableCircle(
  endDirection: Direction,
  to: { x: number; y: number },
) {
  const endCircle = {
    left: { x: to.x - 13, y: to.y, radius: 3 },
    right: { x: to.x + 13, y: to.y, radius: 3 },
    top: { x: to.x, y: to.y - 13, radius: 3 },
    bottom: { x: to.x, y: to.y + 13, radius: 3 },
  };

  return endCircle[endDirection];
}

export function getEndIDEFCircle(
  endDirection: Direction,
  to: { x: number; y: number },
) {
  const endCircle = {
    left: { x: to.x - 4, y: to.y, radius: 4 },
    right: { x: to.x + 4, y: to.y, radius: 4 },
    top: { x: to.x, y: to.y - 4, radius: 4 },
    bottom: { x: to.x, y: to.y + 4, radius: 4 },
  };

  return endCircle[endDirection];
}

function getVerticalDrawLines(
  from: { x: number; y: number },
  to: { x: number; y: number },
) {
  const drawLines: {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
  }[] = [];

  const delta = { x: to.x - from.x, y: to.y - from.y };
  const chagne = [
    { x: from.x, y: from.y },
    { x: from.x, y: from.y + delta.y / 2 },
    { x: to.x, y: from.y + delta.y / 2 },
    { x: to.x, y: to.y },
  ];

  chagne.slice(0, -1).forEach((_, i) =>
    drawLines.push({
      fromX: chagne[i].x,
      fromY: chagne[i].y,
      toX: chagne[i + 1].x,
      toY: chagne[i + 1].y,
    }),
  );

  return drawLines;
}

function getVerticalDifferntDrawLines(
  from: { x: number; y: number },
  to: { x: number; y: number },
) {
  const drawLines: {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
  }[] = [];
  const delta = { x: to.x - from.x, y: to.y - from.y };

  const chagne = [
    { x: from.x, y: from.y },
    { x: from.x, y: from.y + delta.y / 2 },
    { x: from.x + delta.x / 2, y: from.y + delta.y / 2 },
    { x: from.x + delta.x / 2, y: to.y },
    { x: to.x, y: to.y },
  ];

  chagne.slice(0, -1).forEach((_, i) =>
    drawLines.push({
      fromX: chagne[i].x,
      fromY: chagne[i].y,
      toX: chagne[i + 1].x,
      toY: chagne[i + 1].y,
    }),
  );

  return drawLines;
}

function getHorizontalDrawLines(
  from: { x: number; y: number },
  to: { x: number; y: number },
) {
  const drawLines: {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
  }[] = [];
  const delta = { x: to.x - from.x, y: to.y - from.y };

  const chagne = [
    { x: from.x, y: from.y },
    { x: from.x + delta.x / 2, y: from.y },
    { x: from.x + delta.x / 2, y: to.y },
    { x: to.x, y: to.y },
  ];

  chagne.slice(0, -1).forEach((_, i) =>
    drawLines.push({
      fromX: chagne[i].x,
      fromY: chagne[i].y,
      toX: chagne[i + 1].x,
      toY: chagne[i + 1].y,
    }),
  );

  return drawLines;
}

function getHorizontalDifferentDrawLines(
  from: { x: number; y: number },
  to: { x: number; y: number },
) {
  const drawLines: {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
  }[] = [];
  const delta = { x: to.x - from.x, y: to.y - from.y };

  const chagne = [
    { x: from.x, y: from.y },
    { x: from.x + delta.x / 2, y: from.y },
    { x: from.x + delta.x / 2, y: from.y + delta.y / 2 },
    { x: to.x, y: from.y + delta.y / 2 },
    { x: to.x, y: to.y },
  ];

  chagne.slice(0, -1).forEach((_, i) =>
    drawLines.push({
      fromX: chagne[i].x,
      fromY: chagne[i].y,
      toX: chagne[i + 1].x,
      toY: chagne[i + 1].y,
    }),
  );

  return drawLines;
}

function getDirection(
  angle: number,
  fromSize: { width: number; height: number },
  toSize: { width: number; height: number },
  mine: boolean,
) {
  let fromDirection: Direction;
  let toDirection: Direction;

  if (mine) {
    fromDirection = 'right';
    toDirection = 'bottom';
    return { fromDirection, toDirection };
  }

  const tanAngle = Math.tan(getRadian(angle));
  const startAspect = fromSize.height / fromSize.width;
  const endAspect = toSize.height / toSize.width;

  if (angle <= 90) {
    fromDirection = tanAngle < startAspect ? 'right' : 'top';
    toDirection = tanAngle < endAspect ? 'left' : 'bottom';
  } else if (angle <= 180) {
    fromDirection = tanAngle > -startAspect ? 'left' : 'top';
    toDirection = tanAngle > -endAspect ? 'right' : 'bottom';
  } else if (angle <= 270) {
    fromDirection = tanAngle < startAspect ? 'left' : 'bottom';
    toDirection = tanAngle < endAspect ? 'right' : 'top';
  } else {
    fromDirection = tanAngle > -startAspect ? 'right' : 'bottom';
    toDirection = tanAngle > -endAspect ? 'left' : 'top';
  }

  return { fromDirection, toDirection };
}

function getPosition(
  fromSize: { width: number; height: number },
  toSize: { width: number; height: number },
  startDirection: Direction,
  endDirection: Direction,
  initLine: { fromX: number; fromY: number; toX: number; toY: number },
) {
  const updatedFrom = updatePosition(
    { x: initLine.fromX, y: initLine.fromY },
    startDirection,
    fromSize,
  );

  const updatedTo = updatePosition(
    { x: initLine.toX, y: initLine.toY },
    endDirection,
    toSize,
  );

  return { updatedFrom, updatedTo };
}

function updatePosition(
  position: { x: number; y: number },
  direction: string,
  size: { width: number; height: number },
) {
  const update = { x: position.x, y: position.y };

  switch (direction) {
    case 'right':
      update.x += size.width / 2;
      break;
    case 'left':
      update.x -= size.width / 2;
      break;
    case 'top':
      update.y -= size.height / 2;
      break;
    case 'bottom':
      update.y += size.height / 2;
      break;
    default:
      break;
  }

  return update;
}

function calculateMiddlePosition(fromTable: ERDTable, toTable: ERDTable) {
  const fromX = fromTable.left + fromTable.width / 2;
  const fromY = fromTable.top + fromTable.height / 2;
  const toX = toTable.left + toTable.width / 2;
  const toY = toTable.top + toTable.height / 2;

  return { fromX, fromY, toX, toY };
}

function calculateAngle(line: {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}): number {
  const deltaX = line.toX - line.fromX;
  const deltaY = line.fromY - line.toY;
  const radians = Math.atan2(deltaY, deltaX);
  return (radians * (180 / Math.PI) + 360) % 360;
}

function getRadian(degree: number): number {
  return (degree * Math.PI) / 180;
}

type Direction = 'top' | 'bottom' | 'left' | 'right';
