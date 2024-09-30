'use client';

import styled from '@emotion/styled';
import { useEffect, useState } from 'react';

import { Table } from '@/components';
import {
  ConnectLine,
  getStartEndDirection,
  TableDirectionChild,
} from '@/components/connect-line';
import {
  createERDProjectStore,
  ERDRelation,
  ERDTable,
} from '@/features/erd-project';

export const useERDProjectStore = createERDProjectStore();

export default function Home() {
  const [identify, setIdentify] = useState<boolean>(true);
  const [many, setMany] = useState<boolean>(false);
  const [startNull, setStartNull] = useState<boolean>(false);
  const [endNull, setEndNull] = useState<boolean>(false);
  const [crowFoot, setCrowFoot] = useState<boolean>(true);
  const [lastTable, setLastTable] = useState<ERDTable | undefined>(undefined);

  // Zustand 상태 구독
  const { tables, relations, createTable, createRelation, updateTable } =
    useERDProjectStore((state) => ({
      tables: state.tables,
      relations: state.relations,
      createTable: state.createTable,
      createRelation: state.createRelation,
      updateTable: state.updateTable,
    }));

  const displayClicked = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    const { pageX, pageY } = event;
    const tableCount = tables.length;

    // 테이블 생성
    createTable({
      id: tableCount.toString(),
      left: pageX,
      top: pageY,
      width: 100,
      height: 50,
    });
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'q') {
        setIdentify(!identify);
      } else if (event.key === 'w') {
        setMany(!many);
      } else if (event.key === 'e') {
        setStartNull(!startNull);
      } else if (event.key === 'r') {
        setEndNull(!endNull);
      } else if (event.key === 't') {
        setCrowFoot(!crowFoot);
      }

      console.log(identify, many, startNull, endNull, crowFoot);
    };

    // 키보드 입력 이벤트 리스너 추가
    window.addEventListener('keydown', handleKeyPress);

    // 컴포넌트가 unmount 될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  });

  const TableClick = (table: ERDTable) => {
    if (lastTable) {
      createRelation({
        id: Math.random().toString(36).slice(2),
        from: lastTable.id,
        to: table.id,
        type: many ? 'one-to-many' : 'one-to-one',
        identify,
        multiplicity: {
          from: startNull ? 'optional' : 'mandatory',
          to: endNull ? 'optional' : 'mandatory',
        },
      });
      setLastTable(undefined);
    } else {
      setLastTable(table);
    }
  };

  const onPositionChange = (id: string, pos: { left: number; top: number }) => {
    const table = tables.find((t) => t.id === id);

    if (table) {
      table.left = pos.left;
      table.top = pos.top;
      updateTable(table);
    }
  };

  const relationDuplicate: ERDRelation[] = [];
  const childTables: Set<string> = new Set<string>();

  const tableDir: Map<ERDTable['id'], TableDirectionChild> = new Map();

  tables.forEach((table) => {
    relations[table.id]?.forEach((relation) => {
      childTables.add(relation.to);

      if (!relationDuplicate.includes(relation))
        relationDuplicate.push(relation);
    });
  });

  tables.forEach((table) => {
    tableDir.set(
      table.id,
      new Map([
        ['left', []],
        ['right', []],
        ['top', []],
        ['bottom', []],
      ]),
    );
  });

  relationDuplicate.forEach((relation) => {
    const fromTable = tables.find((t) => t.id === relation.from);
    const toTable = tables.find((t) => t.id === relation.to);

    if (fromTable && toTable) {
      const { fromDirection, toDirection } = getStartEndDirection(
        fromTable,
        toTable,
      );

      if (fromDirection === 'left' || fromDirection === 'right') {
        tableDir
          .get(fromTable.id)
          ?.get(fromDirection)
          ?.push({ top: toTable.top, tableID: toTable.id });
      } else {
        tableDir
          .get(fromTable.id)
          ?.get(fromDirection)
          ?.push({ top: toTable.left, tableID: toTable.id });
      }

      if (toDirection === 'left' || toDirection === 'right') {
        tableDir
          .get(toTable.id)
          ?.get(toDirection)
          ?.push({ top: fromTable.top, tableID: fromTable.id });
      } else {
        tableDir
          .get(toTable.id)
          ?.get(toDirection)
          ?.push({ top: fromTable.left, tableID: fromTable.id });
      }
    }
  });

  tableDir.keys().forEach((tableID) => {
    tableDir
      .get(tableID)
      ?.get('top')
      ?.sort((a, b) => a.top - b.top);
    tableDir
      .get(tableID)
      ?.get('bottom')
      ?.sort((a, b) => a.top - b.top);
    tableDir
      .get(tableID)
      ?.get('left')
      ?.sort((a, b) => a.top - b.top);
    tableDir
      .get(tableID)
      ?.get('right')
      ?.sort((a, b) => a.top - b.top);
  });

  console.log(tableDir);

  return (
    <styles.displayWrapper onDoubleClick={displayClicked}>
      {getTable(tables, childTables, crowFoot, TableClick, onPositionChange)}
      {getRelation(tables, relationDuplicate, tableDir, crowFoot)}
    </styles.displayWrapper>
  );
}

function getTable(
  tables: ERDTable[],
  childTables: Set<string>,
  crowFoot: boolean,
  onClick: (table: ERDTable) => void,
  onPositionChange: (id: string, pos: { left: number; top: number }) => void,
) {
  return tables.map((table) => (
    <Table
      key={table.id}
      table={table}
      onClick={onClick}
      onPositionChange={onPositionChange}
      rounded={childTables.has(table.id) && !crowFoot}
    />
  ));
}

function getRelation(
  tables: ERDTable[],
  relations: ERDRelation[],
  tableDir: Map<ERDTable['id'], TableDirectionChild>,
  crowFoot: boolean,
) {
  return (
    <svg
      width='100%'
      height='100%'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
    >
      {relations.map((relation) => (
        <ConnectLine
          key={Math.random().toString(36).slice(2)}
          tables={tables}
          crowFoot={crowFoot}
          relation={relation}
          tableDir={tableDir}
        />
      ))}
    </svg>
  );
}

const styles = {
  displayWrapper: styled.div`
    position: relative;
    height: 100vh;
    background: #2f2f2f;
  `,
};
