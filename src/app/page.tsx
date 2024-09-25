'use client';

import { Table } from '@/components';
import styled from '@emotion/styled';
import { useErdStore } from '@/shared/erd';
import { ConnectLine } from '@/components/connect-line';
import { useEffect } from 'react';

export default function Home() {
  const {
    tables,
    keyboard,
    addTable,
    setIdentify,
    setMany,
    setStartNull,
    setEndNull,
    setCrowFoot,
    setLines,
    InitTablesDirection,
  } = useErdStore();

  const displayClicked = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    const { pageX, pageY } = event;

    addTable(pageX, pageY);
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key == 'q') {
        setIdentify(!keyboard.identify);
      } else if (event.key == 'w') {
        setMany(!keyboard.many);
      } else if (event.key == 'e') {
        setStartNull(!keyboard.startNullable);
      } else if (event.key == 'r') {
        setEndNull(!keyboard.endNullable);
      } else if (event.key == 't') {
        setCrowFoot(!keyboard.crowFoot);
        InitTablesDirection();
        setLines();
      }
    };

    // 키보드 입력 이벤트 리스너 추가
    window.addEventListener('keydown', handleKeyPress);

    // 컴포넌트가 unmount 될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <styles.displayWrapper onDoubleClick={displayClicked}>
      {tables.map((table, index) => {
        return (
          <Table
            key={index}
            isChild={table.isChild}
            index={table.index}
            pos={{ x: table.positionX, y: table.positionY }}
            name={table.name}
            mainColumn={table.mainColumn}
            childColumns={table.childColumns}
          />
        );
      })}
      <ConnectLine />
    </styles.displayWrapper>
  );
}

const styles = {
  displayWrapper: styled.div`
    position: relative;
    height: 100vh;
    background: #2f2f2f;
  `,
};
