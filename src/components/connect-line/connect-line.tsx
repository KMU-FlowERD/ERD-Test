import React, { JSX } from 'react';

import {
  getDrawLines,
  getDrawLinesMineMapping,
  getEndIDEFCircle,
  getEndIENotNullOneLine,
  getEndIENullableCircle,
  getEndIEOneLine,
  getManyLines,
  getStartEndPosition,
  getStartIDEFNullablePolygon,
  getStartIENotNullOneLine,
  getStartIENullableCircle,
  getStartIEOneLine,
  TableDirectionChild,
} from './erd-relation.helper';

import {
  createERDProjectStore,
  ERDRelation,
  ERDTable,
} from '@/features/erd-project';

export const useERDProjectStore = createERDProjectStore();

export function ConnectLine({
  crowFoot,
  tables,
  relation,
  tableDir,
  mineMapping,
}: {
  crowFoot: boolean;
  tables: ERDTable[];
  relation: ERDRelation;
  tableDir: Map<ERDTable['id'], TableDirectionChild>;
  mineMapping: Map<ERDTable['id'], number>;
}) {
  return <>{SvgComponent(crowFoot, tables, relation, tableDir, mineMapping)}</>;
}

function SvgComponent(
  crowFoot: boolean,
  tables: ERDTable[],
  relation: ERDRelation,
  tableDir: Map<ERDTable['id'], TableDirectionChild>,
  mineMapping: Map<ERDTable['id'], number>,
) {
  const lines: JSX.Element[] = [];

  const fromTable = tables.find((t) => t.id === relation.from);
  const toTable = tables.find((t) => t.id === relation.to);

  if (fromTable && toTable) {
    const navigateLines = [];

    const { fromDirection, toDirection, lastFromPosition, lastToPosition } =
      getStartEndPosition(fromTable, toTable, tableDir);

    if (fromTable.id !== toTable.id) {
      navigateLines.push(
        ...getDrawLines(
          fromDirection,
          toDirection,
          lastFromPosition,
          lastToPosition,
        ),
      );
    } else {
      const mineMappingCnt = mineMapping.get(fromTable.id);
      if (mineMappingCnt !== undefined)
        mineMapping.set(fromTable.id, mineMappingCnt + 1);

      navigateLines.push(
        ...getDrawLinesMineMapping(
          lastFromPosition,
          lastToPosition,
          fromTable.height / 2,
          mineMapping.get(fromTable.id),
        ),
      );
    }

    const updatedFrom = lastFromPosition;
    const updatedTo = lastToPosition;

    const drawLines = [];
    const drawCircles = [];
    const drawPolygons = [];

    if (crowFoot) {
      drawLines.push(getStartIEOneLine(fromDirection, updatedFrom));

      if (relation.type === 'one-to-many')
        drawLines.push(...getManyLines(toDirection, updatedTo));
      else if (relation.type === 'one-to-one')
        drawLines.push(getEndIEOneLine(toDirection, updatedTo));

      if (
        relation.multiplicity &&
        relation.multiplicity.from &&
        relation.multiplicity.from === 'optional'
      ) {
        drawCircles.push(getStartIENullableCircle(fromDirection, updatedFrom));
      } else {
        drawLines.push(getStartIENotNullOneLine(fromDirection, updatedFrom));
      }

      if (
        relation.multiplicity &&
        relation.multiplicity.to &&
        relation.multiplicity.to === 'optional'
      ) {
        drawCircles.push(getEndIENullableCircle(toDirection, updatedTo));
      } else {
        drawLines.push(getEndIENotNullOneLine(toDirection, updatedTo));
      }
    } else {
      drawCircles.push(getEndIDEFCircle(toDirection, updatedTo));

      if (
        relation.multiplicity &&
        relation.multiplicity.from &&
        relation.multiplicity.from === 'optional'
      ) {
        drawPolygons.push(
          getStartIDEFNullablePolygon(fromDirection, updatedFrom),
        );
      }
    }

    navigateLines.forEach((line) => {
      lines.push(
        <line
          key={Math.random().toString(36).slice(2)}
          x1={line.fromX}
          y1={line.fromY}
          x2={line.toX}
          y2={line.toY}
          stroke='#ededed'
          strokeWidth='1'
          strokeDasharray={relation.identify ? '0' : '5,5'}
        />,
      );
    });

    drawLines.forEach((line) => {
      lines.push(
        <line
          key={Math.random().toString(36).slice(2)}
          x1={line.fromX}
          y1={line.fromY}
          x2={line.toX}
          y2={line.toY}
          stroke='#ededed'
          strokeWidth='1'
        />,
      );
    });

    drawCircles.forEach((circle) => {
      lines.push(
        <circle
          key={Math.random().toString(36).slice(2)}
          r={circle.radius}
          cx={circle.x}
          cy={circle.y}
          stroke='#ededed'
          strokeWidth='1'
          fill={crowFoot ? '#2f2f2f' : '#ededed'}
        />,
      );
    });

    drawPolygons.forEach((polygon) => {
      lines.push(
        <polygon
          key={Math.random().toString(36).slice(2)}
          points={polygon.positions}
          stroke='#ededed'
          strokeWidth='1'
          fill='#2f2f2f'
        />,
      );
    });
  }

  return lines;
}
