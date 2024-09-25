import { StateCreator } from 'zustand';
import { ColumnType } from '@/shared/column';
import { KeyboardSlice } from './erd.keyboard.slice';

interface LineCount {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface ConnectTableType {
  index: number;
  identify: boolean;
  many: boolean;
  startNullable: boolean;
  endNullable: boolean;
}

interface TableType {
  index: number;
  connectIndex: Array<ConnectTableType>;
  connectDirection: LineCount;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  name: string;
  mainColumn: ColumnType;
  childColumns: Array<ColumnType>;
}

export interface TableSlice {
  tables: Array<TableType>;
  setRect: (index: number, width: number, height: number) => void;
  setTablePosition: (index: number, x: number, y: number) => void;
  addTable: (x: number, y: number) => void;
  connectTable: (start: number, end: number) => void;
  InitTablesDirection: () => void;
}

const defaultState: Array<TableType> = [];

export const createTableSlice: StateCreator<
  TableSlice & KeyboardSlice,
  [],
  [],
  TableSlice
> = (set, get) => ({
  tables: defaultState,
  setRect: (index: number, width: number, height: number) => {
    const tables = get();
    tables.tables[index].width = width;
    tables.tables[index].height = height;
    set({ tables: tables.tables });
  },
  setTablePosition: (index: number, x: number, y: number) => {
    const tables = get();
    tables.tables[index].positionX = x;
    tables.tables[index].positionY = y;
    set({ tables: tables.tables });
  },
  addTable: (x: number, y: number) => {
    const newTable = {
      index: get().tables.length,
      connectIndex: [],
      connectDirection: { top: 0, bottom: 0, left: 0, right: 0 },
      positionX: x,
      positionY: y,
      width: -1,
      height: -1,
      name: 'employee',
      mainColumn: {
        name: 'main',
        pk: true,
        fk: false,
        nullable: false,
      },
      childColumns: [
        {
          name: 'child',
          pk: false,
          fk: true,
          nullable: false,
        },
        {
          name: 'child',
          pk: false,
          fk: true,
          nullable: true,
        },
      ],
    };

    const tables = get();
    tables.tables.push(newTable);
    set({ tables: tables.tables });
  },

  connectTable: (start: number, end: number) => {
    const tables = get().tables;
    const keyboard = get().keyboard;

    if (!tables[start].connectIndex.some((item) => item.index === end)) {
      tables[start].connectIndex.push({
        index: end,
        identify: keyboard.identify,
        many: keyboard.many,
        startNullable: keyboard.startNullable,
        endNullable: keyboard.endNullable,
      });
      set({ tables: tables });
    }
  },

  InitTablesDirection: () => {
    const tables = get().tables.map((table, index) => {
      table.connectDirection = { top: 0, bottom: 0, left: 0, right: 0 };

      return table;
    });

    set({ tables: tables });
  },
});
