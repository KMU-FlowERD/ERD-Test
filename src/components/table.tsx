"use client";

import { ColumnType } from "@/shared/column";
import { useErdStore } from "@/shared/erd";
import styled from "@emotion/styled";
import { useRef } from "react";

interface Position {
  x: number,
  y: number,
}

export function Table ({
  index,
  pos,
  name,
  mainColumn,
  childColumns,
}:{
  index: number,
  pos: Position,
  name: string,
  mainColumn: ColumnType,
  childColumns: Array<ColumnType>,
}) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const {clickPosition, setRect, setPos, connectTable, setLines} = useErdStore();

  const tableClicked = () => {
    if(boxRef.current && clickPosition.positionX != 0) {
      const rect = boxRef.current.getBoundingClientRect();

      setRect(index, rect.width, rect.height);// 테이블의 크기 저장
      connectTable(clickPosition.index, index);
      setPos(0, 0, 0, 0, 0); // 다시 0으로 돌아와서 새로운 라인 생성 준비
      setLines(); // 라인 초기화
    } else if(boxRef.current && clickPosition.positionX == 0) {
      const rect = boxRef.current.getBoundingClientRect();

      setRect(index, rect.width, rect.height);
      setPos(pos.x + rect.width/2, pos.y + rect.height / 2, rect.width, rect.height, index); // 테이블의 가운데 Position과 크기 저장
    }
  }

  return <styles.displayWrapper ref={boxRef} onClick={tableClicked} $name={name} $pos={pos}>
    <Column column={mainColumn} title={true}/>
    {
      childColumns.map((column, index) => {
        return <Column key={index} column={column} title={false}/>
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
    font-size: 12px;
    color: #ededed;
    cursor: pointer;

    &::before {
      content: ${({$name}) => `"${$name}"`};
      position: absolute;
      left: 3px;
      top: -20px;
    }

    &:hover {
      color: #fff;
    }
  `,
  mainColumnWrapper: styled.div`
    display:flex;
    border-bottom: 1px solid #ededed;
    padding-bottom: 4px;
    margin: 2px;
  `,
  childColumnWrapper: styled.div`
    display:flex;
    margin: 2px;
  `,
  extraWrapper: styled.div`
    display: flex;
    flex-grow: 1;
    align-items: right;
    margin-left: 40px;
  `,
  pkStyle: styled.div`
    width: 20px;
  `,
  fkStyle: styled.div`
    width: 20px;
  `,
  nullableStyle: styled.div`
    width: 60px;
  `,
}