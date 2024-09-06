import { useErdStore } from "@/shared/erd";

export function ConnectLine() {
  const {tables} = useErdStore();

  const createLines = (start: number, end: Array<number>) => {
    return end.map((val, index) => {
      return <line x1={tables[start].positionX} 
            y1={tables[start].positionY}
            x2={tables[val].positionX}
            y2={tables[val].positionY}
            stroke="#ededed"
            stroke-width="1"
      />;
    });
  }

  return <svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
    {
      tables.map((table, index) => {
        if(table.connectIndex.length > 0) {
          console.log(index, table.connectIndex);
          return createLines(index, table.connectIndex);
        }
      })
    }
  </svg>;
}