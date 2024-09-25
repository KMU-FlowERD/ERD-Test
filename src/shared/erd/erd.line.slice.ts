import { StateCreator } from 'zustand';
import { TableSlice } from './erd.table.slice';
import {
  CircleType,
  Direction,
  LineCount,
  LineType,
  PolygonType,
} from './erd.line.type';
import { calculateAngle, getDirection, linePush } from './erd.line.helper';
import { KeyboardSlice } from './erd.keyboard.slice';

export interface LineSlice {
  lines: Array<LineType>;
  circles: Array<CircleType>;
  polygons: Array<PolygonType>;
  setLines: () => void;
}

const defaultState: Array<LineType> = [];
const defaultCircle: Array<CircleType> = [];
const defaultPolygon: Array<PolygonType> = [];

export const createLineSlice: StateCreator<
  LineSlice & TableSlice & KeyboardSlice,
  [],
  [],
  LineSlice
> = (set, get) => ({
  lines: defaultState,
  circles: defaultCircle,
  polygons: defaultPolygon,
  setLines: () => {
    const tables = get().tables;
    const keyboard = get().keyboard;

    const tableLineCount: Array<LineCount> = tables.map(() => {
      return { top: 0, bottom: 0, left: 0, right: 0 };
    });

    const lines: Array<LineType> = [];
    const circles: Array<CircleType> = [];
    const polygons: Array<PolygonType> = [];

    tables.forEach((startTable, startIndex) => {
      startTable.connectIndex.forEach((end) => {
        const endIndex = end.index;
        const endTable = tables[endIndex];

        const startX = startTable.positionX + startTable.width / 2;
        const startY = startTable.positionY + startTable.height / 2;
        const endX = endTable.positionX + endTable.width / 2;
        const endY = endTable.positionY + endTable.height / 2;

        const angle = calculateAngle({
          startX,
          startY,
          endX,
          endY,
        });

        const { startDirection, endDirection } = getDirection(
          angle,
          startTable,
          endTable,
        );

        if (startDirection == Direction.TOP) {
          tables[startIndex].connectDirection.top += 1;
        } else if (startDirection == Direction.BOTTOM) {
          tables[startIndex].connectDirection.bottom += 1;
        } else if (startDirection == Direction.LEFT) {
          tables[startIndex].connectDirection.left += 1;
        } else if (startDirection == Direction.RIGHT) {
          tables[startIndex].connectDirection.right += 1;
        }

        if (endDirection == Direction.TOP) {
          tables[endIndex].connectDirection.top += 1;
        } else if (endDirection == Direction.BOTTOM) {
          tables[endIndex].connectDirection.bottom += 1;
        } else if (endDirection == Direction.LEFT) {
          tables[endIndex].connectDirection.left += 1;
        } else if (endDirection == Direction.RIGHT) {
          tables[endIndex].connectDirection.right += 1;
        }
      });
    });

    tables.forEach((startTable, startIndex) => {
      startTable.connectIndex.forEach((end) => {
        const endIndex = end.index;
        const endTable = tables[endIndex];

        const startX = startTable.positionX + startTable.width / 2;
        const startY = startTable.positionY + startTable.height / 2;
        const endX = endTable.positionX + endTable.width / 2;
        const endY = endTable.positionY + endTable.height / 2;

        const angle = calculateAngle({
          startX,
          startY,
          endX,
          endY,
        });

        linePush(
          lines,
          circles,
          polygons,
          angle,
          startTable,
          endTable,
          { startX, startY, endX, endY, identify: end.identify },
          tableLineCount,
          startIndex,
          endIndex,
          end.many,
          end.startNullable,
          end.endNullable,
          keyboard.crowFoot,
        );
      });
    });

    set({ lines: lines, circles: circles, polygons: polygons });
  },
});
