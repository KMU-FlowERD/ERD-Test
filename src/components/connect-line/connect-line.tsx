import { useErdStore } from "@/shared/erd";

export function ConnectLine() {
  const {lines} = useErdStore();

  return <svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
    {
      lines.map((line, index) => {
        return <line x1={line.x1} 
            y1={line.y1} 
            x2={line.x2} 
            y2={line.y2} 
            stroke="#ededed"
            stroke-width="1"
        />;
      })
    }
  </svg>;
}