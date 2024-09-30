'use client';

import styled from '@emotion/styled';
import { useRef, useState, useEffect } from 'react';

import { ERDTable } from '@/features/erd-project';

interface Position {
  left: number;
  top: number;
}

export function Table({
  table,
  rounded,
  onClick,
  onPositionChange,
}: {
  table: ERDTable;
  rounded: boolean;
  onClick: (table: ERDTable) => void;
  onPositionChange: (id: string, pos: Position) => void;
}) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState<Position>({ left: 0, top: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (boxRef.current) {
      const rect = boxRef.current.getBoundingClientRect();
      setDragging(true);
      setOffset({
        left: e.clientX - rect.left,
        top: e.clientY - rect.top,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) {
        const newPos = {
          left: e.clientX - offset.left,
          top: e.clientY - offset.top,
        };
        onPositionChange(table.id, newPos);
      }
    };

    const handleMouseUp = () => {
      if (dragging) {
        setDragging(false);
      }
    };

    if (dragging) {
      // 전역적으로 이벤트 리스너를 추가
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      // cleanup 함수에서 이벤트 리스너 제거
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, offset.left, offset.top, onPositionChange, table.id]);

  return (
    <styles.displayWrapper
      ref={boxRef}
      onMouseDown={handleMouseDown}
      onClick={() => onClick(table)}
      $name={table.id}
      $pos={{ left: table.left, top: table.top }}
      $rounded={rounded}
    />
  );
}

const styles = {
  displayWrapper: styled.div<{
    $name: string;
    $pos: Position;
    $rounded: boolean;
  }>`
    min-width: 100px;
    min-height: 50px;
    position: absolute;
    left: ${({ $pos }) => `${$pos.left}px`};
    top: ${({ $pos }) => `${$pos.top}px`};
    display: inline flex;
    border: 0.5px solid #606060;
    border-radius: ${({ $rounded }) => ($rounded ? `8px` : `0px`)};
    background: rgba(34, 34, 34, 0.7);
    flex-direction: column;
    padding: 5px;
    font-size: 12px;
    color: #ededed;
    cursor: pointer;

    &::before {
      content: ${({ $name }) => `"${$name}"`};
      position: absolute;
      left: 3px;
      top: -20px;
    }

    &:hover {
      color: #fff;
    }
  `,
};
