import { StateCreator } from 'zustand';

interface KeyboardType {
  identify: boolean;
  many: boolean;
  startNullable: boolean;
  endNullable: boolean;
  crowFoot: boolean;
}

export interface KeyboardSlice {
  keyboard: KeyboardType;
  setIdentify: (val: boolean) => void;
  setMany: (val: boolean) => void;
  setStartNull: (val: boolean) => void;
  setEndNull: (val: boolean) => void;
  setCrowFoot: (val: boolean) => void;
}

const defaultState: KeyboardType = {
  identify: true,
  many: false,
  startNullable: false,
  endNullable: false,
  crowFoot: true,
};

export const createKeyboardSlice: StateCreator<
  KeyboardSlice,
  [],
  [],
  KeyboardSlice
> = (set, get) => ({
  keyboard: defaultState,
  setIdentify: (val: boolean) => {
    const keyboard = get();
    keyboard.keyboard.identify = val;
    set({ keyboard: keyboard.keyboard });
    console.log(keyboard.keyboard);
  },
  setMany: (val: boolean) => {
    const keyboard = get();
    keyboard.keyboard.many = val;
    set({ keyboard: keyboard.keyboard });
    console.log(keyboard.keyboard);
  },
  setStartNull: (val: boolean) => {
    const keyboard = get();
    keyboard.keyboard.startNullable = val;
    set({ keyboard: keyboard.keyboard });
    console.log(keyboard.keyboard);
  },
  setEndNull: (val: boolean) => {
    const keyboard = get();
    keyboard.keyboard.endNullable = val;
    set({ keyboard: keyboard.keyboard });
    console.log(keyboard.keyboard);
  },
  setCrowFoot: (val: boolean) => {
    const keyboard = get();
    keyboard.keyboard.crowFoot = val;
    set({ keyboard: keyboard.keyboard });
    console.log(keyboard.keyboard);
  },
});
