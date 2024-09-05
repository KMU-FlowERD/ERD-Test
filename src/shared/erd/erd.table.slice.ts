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
  addTable: () => void,
};

const defaultState: Array<TableType> = [
  {
    positionX: 100,
    positionY: 200,
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
  }
];

export const createTableSlice: StateCreator<TableSlice, [], [], TableSlice> = (set, get) => ({
  tables: defaultState,
  addTable: () => {

  },
});