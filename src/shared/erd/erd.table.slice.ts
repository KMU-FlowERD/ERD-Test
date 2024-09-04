import { StateCreator } from 'zustand'

interface ColumnType {
  name: string,
  pk: boolean,
  fk: boolean,
  nullable: boolean,
};
  
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
      pk: false,
      fk: false,
      nullable: false,
    },
    childColumns: [{
      name: 'main',
      pk: false,
      fk: false,
      nullable: false,
    },],
  }
];

export const createTableSlice: StateCreator<TableSlice, [], [], TableSlice> = (set, get) => ({
  tables: defaultState,
  addTable: () => {

  },
});