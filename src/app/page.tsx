"use client";

import { Table } from "@/components";
import styled from "@emotion/styled";
import {useErdStore} from "@/shared/erd";
import { ConnectLine } from "@/components/connect-line";

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
          index={table.index}
          pos={{x: table.positionX, y: table.positionY}}
          name={table.name}
          mainColumn={table.mainColumn}
          childColumns={table.childColumns}
        />;
      })
    }
    <ConnectLine />
  </ styles.displayWrapper>;
}

const styles = {
  displayWrapper: styled.div`
    position: relative;
    height: 100vh;
    background: #2f2f2f;
  `
}
