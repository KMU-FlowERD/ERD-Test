export interface LineType {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  identify: boolean;
}

export interface LineCount {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export enum Direction {
  TOP,
  BOTTOM,
  LEFT,
  RIGHT,
}
