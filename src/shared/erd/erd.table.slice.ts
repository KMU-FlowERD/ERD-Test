import { StateCreator } from 'zustand'

interface ColumnType {
  name: string,
  pk: boolean,
  fk: boolean,
  nullable: boolean,
};
  
interface TableType {
  name: string,
  mainColumn: ColumnType,
  childColumns: Array<ColumnType>,
};

export interface TableSlice {
  tables: Array<TableType>,
  addChild: () => void,
};

const defaultState: Array<TableType> = [];

export const createTableSlice: StateCreator<TableSlice, [], [], TableSlice> = (set, get) => ({
  tables: defaultState,
  addChild: () => {

  },
});