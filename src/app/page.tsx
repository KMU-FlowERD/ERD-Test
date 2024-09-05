"use client";

import { Table } from "@/components";
import styled from "@emotion/styled";
import {useErdStore} from "@/shared/erd";

export default function Home() {
  const {tables, lines, addTable} = useErdStore();

  const displayClicked = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const {pageX, pageY} = event;
    
    addTable(pageX, pageY);
  };

  return <styles.displayWrapper onDoubleClick={displayClicked}>
    {
      tables.map((table, index) => {
        return <Table
          key={index}
          pos={{x: table.positionX, y: table.positionY}}
          name={table.name}
          mainColumn={table.mainColumn}
          childColumns={table.childColumns}
        />;
      })
    }
    <svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
      {
        lines.map((line, index) => {
          return <line x1={line.x1} x2={line.x2} y1={line.y1} y2={line.y2} stroke="#ededed" stroke-width="1"/>
        })
      }
    </svg>
  </ styles.displayWrapper>;
}

const styles = {
  displayWrapper: styled.div`
    position: relative;
    height: 100vh;
    background: #2f2f2f;
  `
}
