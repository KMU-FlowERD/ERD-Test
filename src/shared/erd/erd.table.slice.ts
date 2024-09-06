import { StateCreator } from 'zustand'
import { ColumnType } from '@/shared/column';
  
interface LineCount {
  top: number,
  bottom: number,
  left: number,
  right: number,
}

interface TableType {
  index: number,
  connectIndex: Array<number>,
  positionX: number,
  positionY: number,
  width: number,
  height: number,
  name: string,
  mainColumn: ColumnType,
  childColumns: Array<ColumnType>,
};

export interface TableSlice {
  tables: Array<TableType>,
  setRect: (index: number, width: number, height: number) => void,
  addTable: (x: number, y: number) => void,
  connectTable: (start: number, end: number) => void,
};

const defaultState: Array<TableType> = [];

export const createTableSlice: StateCreator<TableSlice, [], [], TableSlice> = (set, get) => ({
  tables: defaultState,
  setRect: (index: number, width: number, height: number) => {
    const tables = get();
    tables.tables[index].width = width;
    tables.tables[index].height = height;
    set({tables: tables.tables});
  },
  addTable: (x: number, y: number) => {
    const newTable = {
      index: get().tables.length,
      connectIndex: [],
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
    set({tables:tables.tables});
  },

  connectTable: (start: number, end: number) => {
    const tables = get();
    tables.tables[start].connectIndex.push(end);
    set({tables: tables.tables});
  }
});