import { useErdStore } from '@/shared/erd';

export function ConnectLine() {
  const { lines, circles, polygons, keyboard } = useErdStore();

  return (
    <svg
      width='100%'
      height='100%'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
    >
      {lines.map((line, index) => {
        if (line.identify) {
          return (
            <line
              x1={line.startX}
              y1={line.startY}
              x2={line.endX}
              y2={line.endY}
              stroke='#ededed'
              stroke-width='1'
            />
          );
        } else {
          return (
            <line
              x1={line.startX}
              y1={line.startY}
              x2={line.endX}
              y2={line.endY}
              stroke='#ededed'
              stroke-width='1'
              stroke-dasharray='5,5'
            />
          );
        }
      })}
      {circles.map((circle, index) => {
        return (
          <circle
            r={4}
            cx={circle.posX}
            cy={circle.posY}
            stroke='#ededed'
            stroke-width='1'
            fill={keyboard.crowFoot ? '#2f2f2f' : '#ededed'}
          />
        );
      })}
      {polygons.map((polygon, index) => {
        return (
          <polygon points={polygon.positions} stroke='#ededed' fill='#ededed' />
        );
      })}
    </svg>
  );
}
