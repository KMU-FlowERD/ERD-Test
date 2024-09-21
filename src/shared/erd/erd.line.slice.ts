import { StateCreator } from 'zustand';
import { TableSlice } from './erd.table.slice';
import { Direction, LineCount, LineType } from './erd.line.type';
import { calculateAngle, getDirection, linePush } from './erd.line.helper';

export interface LineSlice {
  lines: Array<LineType>;
  setLines: () => void;
}

const defaultState: Array<LineType> = [];

export const createLineSlice: StateCreator<
  LineSlice & TableSlice,
  [],
  [],
  LineSlice
> = (set, get) => ({
  lines: defaultState,
  setLines: () => {
    const tables = get().tables;

    const tableLineCount: Array<LineCount> = tables.map(() => {
      return { top: 0, bottom: 0, left: 0, right: 0 };
    });

    const lines: Array<LineType> = [];

    tables.forEach((startTable, startIndex) => {
      startTable.connectIndex.forEach((endIndex) => {
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
      startTable.connectIndex.forEach((endIndex) => {
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
          angle,
          startTable,
          endTable,
          { startX, startY, endX, endY, identify: false },
          tableLineCount,
          startIndex,
          endIndex,
          true,
        );
      });
    });

    set({ lines });
  },
});
