"use client";

import { Table } from "@/components";
import styled from "@emotion/styled";
import {useErdStore} from "@/shared/erd";

export default function Home() {
  const {tables, addTable} = useErdStore();

  return <styles.displayWrapper>
    {
      tables.map((table, index) => {
        return <Table
          key={index} 
          pos={{x: table.positionX, y: table.positionY}}
          name={table.name}
          mainColumn={table.mainColumn}
          childColumns={table.childColumns}
        />
      })
    }
  </ styles.displayWrapper>;
}

const styles = {
  displayWrapper: styled.div`
    display: relative;
    width: 100%;
    height: 100vh;
    background: #2f2f2f;
  `
}
