import { useErdStore } from "@/shared/erd";

export function ConnectLine() {
  const {lines} = useErdStore();

  return <svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
    {
      lines.map((line, index) => {
        return <line x1={line.startX} 
            y1={line.startY} 
            x2={line.endX} 
            y2={line.endY} 
            stroke="#ededed"
            stroke-width="1"
        />;
      })
    }
  </svg>;
}