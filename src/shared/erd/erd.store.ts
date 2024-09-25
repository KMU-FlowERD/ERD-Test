import { create } from 'zustand';
import { TableSlice, createTableSlice } from './erd.table.slice';
import { ClickSlice, createClickSlice } from './erd.table.click.slice';
import { LineSlice, createLineSlice } from './erd.line.slice';
import { KeyboardSlice, createKeyboardSlice } from './erd.keyboard.slice';

export const useErdStore = create<
  TableSlice & ClickSlice & LineSlice & KeyboardSlice
>((...a) => ({
  ...createTableSlice(...a),
  ...createClickSlice(...a),
  ...createLineSlice(...a),
  ...createKeyboardSlice(...a),
}));
