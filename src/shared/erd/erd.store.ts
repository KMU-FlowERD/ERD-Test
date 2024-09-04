import { create } from 'zustand'
import { TableSlice, createTableSlice} from './erd.table.slice';

export const useErdStore = create<TableSlice>((...a) => ({
    ...createTableSlice(...a),
}));