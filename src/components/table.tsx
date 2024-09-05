"use client";

import { ColumnType } from "@/shared/column";
import styled from "@emotion/styled";

interface Position {
  x: number,
  y: number,
}

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
  console.log(pos);
  return <styles.displayWrapper $name={name} $pos={pos}>
    <Column column={mainColumn} title={true}/>
    {
      childColumns.map((column, index) => {
        return <Column column={column} title={false}/>
      })
    }
  </ styles.displayWrapper>
}

function Column({column, title} : {column: ColumnType, title: boolean}) {
  const pk = (isIn: boolean) => {
    if(isIn) return <styles.pkStyle>pk</ styles.pkStyle>;
    else return <styles.pkStyle />;
  }

  const fk = (isIn: boolean) => {
    if(isIn) return <styles.fkStyle>fk</ styles.fkStyle>;
    else return <styles.fkStyle />;
  }

  const nullable = (isIn: boolean) => {
    if(isIn) return <styles.nullableStyle>nullable</ styles.nullableStyle>;
    else return <styles.nullableStyle />;
  }

  if(title) {
    return <styles.mainColumnWrapper>
      {column.name}
      <styles.extraWrapper>
        {pk(column.pk)}
        {fk(column.fk)}
        {nullable(column.nullable)}
      </ styles.extraWrapper>
    </styles.mainColumnWrapper>
  } else {
    return <styles.childColumnWrapper>
      {column.name}
      <styles.extraWrapper>
        {pk(column.pk)}
        {fk(column.fk)}
        {nullable(column.nullable)}
      </ styles.extraWrapper>
    </styles.childColumnWrapper>
  }
}

const styles = {
  displayWrapper: styled.div<{$name: string, $pos: Position}>`
    position: absolute;
    left: ${({$pos}) => `${$pos.x}px`};
    top: ${({$pos}) => `${$pos.y}px`};
    display: inline flex;
    border-radius: 16px;
    border: 0.5px solid #606060;
    background: rgba(34, 34, 34, 0.70);
    flex-direction: column;
    padding: 5px;

     &::before {
      content: ${({$name}) => `"${$name}"`};
      position: absolute;
      left: 3px;
      top: -20px;
      font-size: 12px;
      color: #ededed;
    }
  `,
  mainColumnWrapper: styled.div`
    display:flex;
    border-bottom: 1px solid #ededed;
    padding-bottom: 4px;
    font-size: 12px;
    color: #ededed;
    margin: 2px;
  `,
  childColumnWrapper: styled.div`
    display:flex;
    margin: 2px;
    font-size: 12px;
    color: #ededed;
  `,
  extraWrapper: styled.div`
    display: flex;
    flex-grow: 1;
    align-items: right;
    margin-left: 40px;
  `,
  pkStyle: styled.div`
    font-size: 12px;
    color: #ededed;
    width: 20px;
  `,
  fkStyle: styled.div`
    font-size: 12px;
    color: #ededed;
    width: 20px;
  `,
  nullableStyle: styled.div`
    font-size: 12px;
    color: #ededed;
    width: 60px;
  `,
}