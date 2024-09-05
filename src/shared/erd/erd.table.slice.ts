import { StateCreator } from 'zustand'
import { ColumnType } from '@/shared/column';
  
interface TableType {
  positionX: number,
  positionY: number,
  name: string,
  mainColumn: ColumnType,
  childColumns: Array<ColumnType>,
};

export interface TableSlice {
  tables: Array<TableType>,
  addTable: (x: number, y: number) => void,
};

const defaultState: Array<TableType> = [];

export const createTableSlice: StateCreator<TableSlice, [], [], TableSlice> = (set, get) => ({
  tables: defaultState,
  addTable: (x: number, y: number) => {
    console.log(x, y);

    const newTable = {
      positionX: x,
      positionY: y,
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
    console.log(tables);
  },
});