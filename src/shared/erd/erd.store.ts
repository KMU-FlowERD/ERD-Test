import { create } from 'zustand'
import { TableSlice, createTableSlice} from './erd.table.slice';
import { ClickSlice, createClickSlice } from './erd.table.click.slice';
import { LineSlice, createLineSlice } from './erd.line.slice';

export const useErdStore = create<TableSlice & ClickSlice & LineSlice>((...a) => ({
    ...createTableSlice(...a),
    ...createClickSlice(...a),
    ...createLineSlice(...a),
}));