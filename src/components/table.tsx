"use client";

import styled from "@emotion/styled";

interface Position {
  x: number,
  y: number,
}

interface ColumnType {
  name: string,
  pk: boolean,
  fk: boolean,
  nullable: boolean,
};

export function Table ({
  pos,
  name,
  mainColumn,
  childColumns,
}:{
  pos: Position,
  name: string,
  mainColumn: ColumnType,
  childColumns: Array<ColumnType>,
}) {
  return <styles.displayWrapper>

  </ styles.displayWrapper>
}

const styles = {
  displayWrapper: styled.div`
    width: 100px;
    height: 50px;
    position: absolute;
    left: 100px;
    top: 300px;
    display: flex;
    border-radius: 16px;
    border: 0.5px solid #606060;
    background: rgba(34, 34, 34, 0.70);
    font-size: 12px;
    font-color: #ededed;
  `
}