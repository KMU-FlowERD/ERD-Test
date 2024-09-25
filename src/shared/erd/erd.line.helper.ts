import {
  CircleType,
  Direction,
  LineCount,
  LineType,
  PolygonType,
} from './erd.line.type';

export function linePush(
  lines: Array<LineType>,
  circles: Array<CircleType>,
  polygons: Array<PolygonType>,
  angle: number,
  startTable: { width: number; height: number; connectDirection: LineCount },
  endTable: { width: number; height: number; connectDirection: LineCount },
  line: LineType,
  tableLineCount: Array<LineCount>,
  startIndex: number,
  endIndex: number,
  manyEnd: boolean,
  startNullable: boolean,
  endNullable: boolean,
  crowFoot: boolean,
) {
  const { startDirection, endDirection, updatedStart, updatedEnd } =
    getLineDirectionsAndPositions(angle, startTable, endTable, line);

  line.startX = updatedStart.x;
  line.startY = updatedStart.y;
  line.endX = updatedEnd.x;
  line.endY = updatedEnd.y;

  if (startDirection == Direction.TOP) {
    tableLineCount[startIndex].top += 1;
    line.startX -= startTable.width / 2;
    line.startX +=
      (startTable.width / (startTable.connectDirection.top + 1)) *
      tableLineCount[startIndex].top;
  } else if (startDirection == Direction.BOTTOM) {
    tableLineCount[startIndex].bottom += 1;
    line.startX -= startTable.width / 2;
    line.startX +=
      (startTable.width / (startTable.connectDirection.bottom + 1)) *
      tableLineCount[startIndex].bottom;
  } else if (startDirection == Direction.LEFT) {
    tableLineCount[startIndex].left += 1;
    line.startY -= startTable.height / 2;
    line.startY +=
      (startTable.height / (startTable.connectDirection.left + 1)) *
      tableLineCount[startIndex].left;
  } else if (startDirection == Direction.RIGHT) {
    tableLineCount[startIndex].right += 1;
    line.startY -= startTable.height / 2;
    line.startY +=
      (startTable.height / (startTable.connectDirection.right + 1)) *
      tableLineCount[startIndex].right;
  }

  if (endDirection == Direction.TOP) {
    tableLineCount[endIndex].top += 1;
    line.endX -= endTable.width / 2;
    line.endX +=
      (endTable.width / (endTable.connectDirection.top + 1)) *
      tableLineCount[endIndex].top;
  } else if (endDirection == Direction.BOTTOM) {
    tableLineCount[endIndex].bottom += 1;
    line.endX -= endTable.width / 2;
    line.endX +=
      (endTable.width / (endTable.connectDirection.bottom + 1)) *
      tableLineCount[endIndex].bottom;
  } else if (endDirection == Direction.LEFT) {
    tableLineCount[endIndex].left += 1;
    line.endY -= endTable.height / 2;
    line.endY +=
      (endTable.height / (endTable.connectDirection.left + 1)) *
      tableLineCount[endIndex].left;
  } else if (endDirection == Direction.RIGHT) {
    tableLineCount[endIndex].right += 1;
    line.endY -= endTable.height / 2;
    line.endY +=
      (endTable.height / (endTable.connectDirection.right + 1)) *
      tableLineCount[endIndex].right;
  }

  const deltaX = line.endX - line.startX;
  const deltaY = line.endY - line.startY;

  const { drawLines, drawCircles, drawPolygons } = getDrawLines(
    startDirection,
    endDirection,
    line,
    deltaX,
    deltaY,
    manyEnd,
    startNullable,
    endNullable,
    crowFoot,
  );

  drawLines.forEach((line) => lines.push(line));
  drawCircles.forEach((circle) => circles.push(circle));
  drawPolygons.forEach((polygon) => polygons.push(polygon));
}

export function getDirection(
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
    startDirection = tanAngle < startAspect ? Direction.RIGHT : Direction.TOP;
    endDirection = tanAngle < endAspect ? Direction.LEFT : Direction.BOTTOM;
  } else if (angle <= 180) {
    startDirection = tanAngle > -startAspect ? Direction.LEFT : Direction.TOP;
    endDirection = tanAngle > -endAspect ? Direction.RIGHT : Direction.BOTTOM;
  } else if (angle <= 270) {
    startDirection = tanAngle < startAspect ? Direction.LEFT : Direction.BOTTOM;
    endDirection = tanAngle < endAspect ? Direction.RIGHT : Direction.TOP;
  } else {
    startDirection =
      tanAngle > -startAspect ? Direction.RIGHT : Direction.BOTTOM;
    endDirection = tanAngle > -endAspect ? Direction.LEFT : Direction.TOP;
  }

  return { startDirection: startDirection, endDirection: endDirection };
}

function getLineDirectionsAndPositions(
  angle: number,
  startTable: { width: number; height: number },
  endTable: { width: number; height: number },
  line: LineType,
) {
  const tanAngle = Math.tan(getRadian(angle));
  const startAspect = startTable.height / startTable.width;
  const endAspect = endTable.height / endTable.width;

  let startDirection: Direction;
  let endDirection: Direction;

  if (angle <= 90) {
    startDirection = tanAngle < startAspect ? Direction.RIGHT : Direction.TOP;
    endDirection = tanAngle < endAspect ? Direction.LEFT : Direction.BOTTOM;
  } else if (angle <= 180) {
    startDirection = tanAngle > -startAspect ? Direction.LEFT : Direction.TOP;
    endDirection = tanAngle > -endAspect ? Direction.RIGHT : Direction.BOTTOM;
  } else if (angle <= 270) {
    startDirection = tanAngle < startAspect ? Direction.LEFT : Direction.BOTTOM;
    endDirection = tanAngle < endAspect ? Direction.RIGHT : Direction.TOP;
  } else {
    startDirection =
      tanAngle > -startAspect ? Direction.RIGHT : Direction.BOTTOM;
    endDirection = tanAngle > -endAspect ? Direction.LEFT : Direction.TOP;
  }

  const updatedStart = { x: line.startX, y: line.startY };
  const updatedEnd = { x: line.endX, y: line.endY };

  if (startDirection === Direction.RIGHT) {
    updatedStart.x += startTable.width / 2;
  } else if (startDirection === Direction.LEFT) {
    updatedStart.x -= startTable.width / 2;
  } else if (startDirection === Direction.TOP) {
    updatedStart.y -= startTable.height / 2;
  } else if (startDirection === Direction.BOTTOM) {
    updatedStart.y += startTable.height / 2;
  }

  if (endDirection === Direction.RIGHT) {
    updatedEnd.x += endTable.width / 2;
  } else if (endDirection === Direction.LEFT) {
    updatedEnd.x -= endTable.width / 2;
  } else if (endDirection === Direction.TOP) {
    updatedEnd.y -= endTable.height / 2;
  } else if (endDirection === Direction.BOTTOM) {
    updatedEnd.y += endTable.height / 2;
  }

  return { startDirection, endDirection, updatedStart, updatedEnd };
}

function getDrawLines(
  startDirection: Direction,
  endDirection: Direction,
  line: LineType,
  deltaX: number,
  deltaY: number,
  manyEnd: boolean,
  startNullable: boolean,
  endNullable: boolean,
  crowFoot: boolean,
) {
  const drawLines: Array<LineType> = [];
  const drawCircles: Array<CircleType> = [];
  const drawPolygons: Array<PolygonType> = [];

  const startX = line.startX;
  const startY = line.startY;
  const endX = line.endX;
  const endY = line.endY;

  if (
    (startDirection === Direction.TOP && endDirection === Direction.BOTTOM) ||
    (startDirection === Direction.BOTTOM && endDirection === Direction.TOP)
  ) {
    drawLines.push({
      startX: startX,
      startY: startY,
      endX: startX,
      endY: startY + deltaY / 2,
      identify: line.identify,
    });
    drawLines.push({
      startX: startX,
      startY: startY + deltaY / 2,
      endX: endX,
      endY: startY + deltaY / 2,
      identify: line.identify,
    });
    drawLines.push({
      startX: endX,
      startY: startY + deltaY / 2,
      endX: endX,
      endY: endY,
      identify: line.identify,
    });
  } else if (
    (startDirection === Direction.TOP && endDirection !== Direction.BOTTOM) ||
    (startDirection === Direction.BOTTOM && endDirection !== Direction.TOP)
  ) {
    drawLines.push({
      startX: startX,
      startY: startY,
      endX: startX,
      endY: startY + deltaY / 2,
      identify: line.identify,
    });
    drawLines.push({
      startX: startX,
      startY: startY + deltaY / 2,
      endX: startX + deltaX / 2,
      endY: startY + deltaY / 2,
      identify: line.identify,
    });
    drawLines.push({
      startX: startX + deltaX / 2,
      startY: startY + deltaY / 2,
      endX: startX + deltaX / 2,
      endY: endY,
      identify: line.identify,
    });
    drawLines.push({
      startX: startX + deltaX / 2,
      startY: endY,
      endX: endX,
      endY: endY,
      identify: line.identify,
    });
  } else if (
    (startDirection === Direction.LEFT && endDirection === Direction.RIGHT) ||
    (startDirection === Direction.RIGHT && endDirection === Direction.LEFT)
  ) {
    drawLines.push({
      startX: startX,
      startY: startY,
      endX: startX + deltaX / 2,
      endY: startY,
      identify: line.identify,
    });
    drawLines.push({
      startX: startX + deltaX / 2,
      startY: startY,
      endX: startX + deltaX / 2,
      endY: endY,
      identify: line.identify,
    });
    drawLines.push({
      startX: startX + deltaX / 2,
      startY: endY,
      endX: endX,
      endY: endY,
      identify: line.identify,
    });
  } else {
    drawLines.push({
      startX: startX,
      startY: startY,
      endX: startX + deltaX / 2,
      endY: startY,
      identify: line.identify,
    });
    drawLines.push({
      startX: startX + deltaX / 2,
      startY: startY,
      endX: startX + deltaX / 2,
      endY: startY + deltaY / 2,
      identify: line.identify,
    });
    drawLines.push({
      startX: startX + deltaX / 2,
      startY: startY + deltaY / 2,
      endX: endX,
      endY: startY + deltaY / 2,
      identify: line.identify,
    });
    drawLines.push({
      startX: startX + deltaX / 2,
      startY: startY + deltaY / 2,
      endX: endX,
      endY: endY,
      identify: line.identify,
    });
  }

  if (!crowFoot) {
    if (endDirection == Direction.TOP) {
      drawCircles.push({ posX: endX, posY: endY - 4, radius: 4 });
    } else if (endDirection == Direction.BOTTOM) {
      drawCircles.push({ posX: endX, posY: endY + 4, radius: 4 });
    } else if (endDirection == Direction.LEFT) {
      drawCircles.push({ posX: endX - 4, posY: endY, radius: 4 });
    } else if (endDirection == Direction.RIGHT) {
      drawCircles.push({ posX: endX + 4, posY: endY, radius: 4 });
    }

    if (startNullable) {
      if (startDirection == Direction.TOP) {
        drawPolygons.push({
          positions: `${startX},${startY} ${startX - 2},${startY - 4} ${startX},${startY - 8} ${startX + 2},${startY - 4}`,
        });
      } else if (startDirection == Direction.BOTTOM) {
        drawPolygons.push({
          positions: `${startX},${startY} ${startX - 2},${startY + 4} ${startX},${startY + 8} ${startX + 2},${startY + 4}`,
        });
      } else if (startDirection == Direction.LEFT) {
        drawPolygons.push({
          positions: `${startX},${startY} ${startX - 4},${startY - 2} ${startX - 8},${startY} ${startX - 4},${startY + 2}`,
        });
      } else if (startDirection == Direction.RIGHT) {
        drawPolygons.push({
          positions: `${startX},${startY} ${startX + 4},${startY - 2} ${startX + 8},${startY} ${startX + 4},${startY + 2}`,
        });
      }
    }

    return {
      drawLines,
      drawCircles,
      drawPolygons,
    };
  }

  if (startDirection == Direction.TOP) {
    drawLines.push({
      startX: startX - 5,
      startY: startY - 5,
      endX: startX + 5,
      endY: startY - 5,
      identify: true,
    });
  } else if (startDirection == Direction.BOTTOM) {
    drawLines.push({
      startX: startX - 5,
      startY: startY + 5,
      endX: startX + 5,
      endY: startY + 5,
      identify: true,
    });
  } else if (startDirection == Direction.LEFT) {
    drawLines.push({
      startX: startX - 5,
      startY: startY - 5,
      endX: startX - 5,
      endY: startY + 5,
      identify: true,
    });
  } else if (startDirection == Direction.RIGHT) {
    drawLines.push({
      startX: startX + 5,
      startY: startY - 5,
      endX: startX + 5,
      endY: startY + 5,
      identify: true,
    });
  }

  if (startNullable) {
    if (startDirection == Direction.TOP) {
      drawCircles.push({ posX: startX, posY: startY - 13, radius: 3 });
    } else if (startDirection == Direction.BOTTOM) {
      drawCircles.push({ posX: startX, posY: startY + 13, radius: 3 });
    } else if (startDirection == Direction.LEFT) {
      drawCircles.push({ posX: startX - 13, posY: startY, radius: 3 });
    } else if (startDirection == Direction.RIGHT) {
      drawCircles.push({ posX: startX + 13, posY: startY, radius: 3 });
    }
  } else {
    if (startDirection == Direction.TOP) {
      drawLines.push({
        startX: startX - 5,
        startY: startY - 10,
        endX: startX + 5,
        endY: startY - 10,
        identify: true,
      });
    } else if (startDirection == Direction.BOTTOM) {
      drawLines.push({
        startX: startX - 5,
        startY: startY + 10,
        endX: startX + 5,
        endY: startY + 10,
        identify: true,
      });
    } else if (startDirection == Direction.LEFT) {
      drawLines.push({
        startX: startX - 10,
        startY: startY - 5,
        endX: startX - 10,
        endY: startY + 5,
        identify: true,
      });
    } else if (startDirection == Direction.RIGHT) {
      drawLines.push({
        startX: startX + 10,
        startY: startY - 5,
        endX: startX + 10,
        endY: startY + 5,
        identify: true,
      });
    }
  }

  if (manyEnd) {
    if (endDirection == Direction.TOP) {
      drawLines.push({
        startX: endX,
        startY: endY - 10,
        endX: endX + 10,
        endY: endY,
        identify: true,
      });
      drawLines.push({
        startX: endX,
        startY: endY - 10,
        endX: endX - 10,
        endY: endY,
        identify: true,
      });
    } else if (endDirection == Direction.BOTTOM) {
      drawLines.push({
        startX: endX,
        startY: endY + 10,
        endX: endX + 10,
        endY: endY,
        identify: true,
      });
      drawLines.push({
        startX: endX,
        startY: endY + 10,
        endX: endX - 10,
        endY: endY,
        identify: true,
      });
    } else if (endDirection == Direction.LEFT) {
      drawLines.push({
        startX: endX - 10,
        startY: endY,
        endX: endX,
        endY: endY + 10,
        identify: true,
      });
      drawLines.push({
        startX: endX - 10,
        startY: endY,
        endX: endX,
        endY: endY - 10,
        identify: true,
      });
    } else if (endDirection == Direction.RIGHT) {
      drawLines.push({
        startX: endX + 10,
        startY: endY,
        endX: endX,
        endY: endY + 10,
        identify: true,
      });
      drawLines.push({
        startX: endX + 10,
        startY: endY,
        endX: endX,
        endY: endY - 10,
        identify: true,
      });
    }
  }

  if (endNullable) {
    if (endDirection == Direction.TOP) {
      drawCircles.push({ posX: endX, posY: endY - 13, radius: 3 });
    } else if (endDirection == Direction.BOTTOM) {
      drawCircles.push({ posX: endX, posY: endY + 13, radius: 3 });
    } else if (endDirection == Direction.LEFT) {
      drawCircles.push({ posX: endX - 13, posY: endY, radius: 3 });
    } else if (endDirection == Direction.RIGHT) {
      drawCircles.push({ posX: endX + 13, posY: endY, radius: 3 });
    }
  } else {
    if (endDirection == Direction.TOP) {
      drawLines.push({
        startX: endX - 5,
        startY: endY - 10,
        endX: endX + 5,
        endY: endY - 10,
        identify: true,
      });
    } else if (endDirection == Direction.BOTTOM) {
      drawLines.push({
        startX: endX - 5,
        startY: endY + 10,
        endX: endX + 5,
        endY: endY + 10,
        identify: true,
      });
    } else if (endDirection == Direction.LEFT) {
      drawLines.push({
        startX: endX - 10,
        startY: endY - 5,
        endX: endX - 10,
        endY: endY + 5,
        identify: true,
      });
    } else if (endDirection == Direction.RIGHT) {
      drawLines.push({
        startX: endX + 10,
        startY: endY - 5,
        endX: endX + 10,
        endY: endY + 5,
        identify: true,
      });
    }
  }

  return {
    drawLines,
    drawCircles,
    drawPolygons,
  };
}

export function calculateAngle(line: {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}): number {
  const deltaX = line.endX - line.startX;
  const deltaY = line.startY - line.endY;
  const radians = Math.atan2(deltaY, deltaX);
  return (radians * (180 / Math.PI) + 360) % 360;
}

function getRadian(degree: number): number {
  return (degree * Math.PI) / 180;
}
