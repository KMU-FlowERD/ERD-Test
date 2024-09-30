import { create } from 'zustand';

export interface ERDColumn {
  type: string;
  name: string;
  nullable: boolean;
}

export interface ERDTable {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface ERDRelation {
  id: string;
  from: ERDTable['id'];
  to: ERDTable['id'];
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  identify: boolean;
  multiplicity?: {
    from?: 'optional' | 'mandatory';
    to?: 'optional' | 'mandatory';
  };
}

export interface ERDProject {
  id: string;
  title: string;
  description?: string;
  width: number;
  height: number;
  tables: ERDTable[];
  relations: Record<ERDTable['id'], ERDRelation[]>;
}

export interface ERDProjectAction {
  setProject: (project: ERDProject) => void;
  updateDescriptions: (metaData: {
    title: string;
    description: string;
  }) => void;
  updateCanvasSize: (size: { width: number; height: number }) => void;
  createTable: (table: ERDTable) => void;
  updateTable: (table: ERDTable) => void;
  deleteTable: (tableId: ERDTable['id']) => void;
  createRelation: (relation: ERDRelation) => void;
  updateRelation: (relation: ERDRelation) => void;
  deleteRelation: (relation: ERDRelation) => void;
}

export type ERDProjectStore = ERDProject & ERDProjectAction;

export const defaultInitState: ERDProject = {
  id: 'default',
  title: '프로젝트 이름',
  description: undefined,
  height: 0,
  width: 0,
  tables: [],
  relations: {},
};

export const createERDProjectStore = (
  initState: ERDProject = defaultInitState,
) =>
  create<ERDProjectStore>()((set) => ({
    ...initState,
    setProject: (project) => set(project),
    updateDescriptions: ({ title, description }) =>
      set((prev) => ({ ...prev, title, description })),
    updateCanvasSize: ({ width, height }) => {
      if (width <= 0 || height <= 0)
        throw new Error('width, height must greater than 0');
      set((prev) => ({ ...prev, width, height }));
    },
    createTable: (table) =>
      set((prev) => ({ ...prev, tables: prev.tables.concat(table) })),
    updateTable: (table: ERDTable) =>
      set((prev) => ({
        ...prev,
        tables: prev.tables.map((t) => (t.id === table.id ? table : t)),
      })),
    deleteTable: (tableId) =>
      set((prev) => ({
        ...prev,
        tables: prev.tables.filter((table) => table.id !== tableId),
      })),
    createRelation: (relation) => {
      if (relation.type === 'one-to-one' || relation.type === 'one-to-many') {
        set((prev) => ({
          ...prev,
          relations: {
            ...prev.relations,
            [relation.to]: [...(prev.relations[relation.to] ?? []), relation],
            [relation.from]: [
              ...(prev.relations[relation.from] ?? []),
              relation,
            ],
          },
        }));
      } else {
        // 여기가 좀 애매합니다.
        // 서버로 새로운 테이블을 생성해야하는데, API 요청을 여기서 하면 의존관계가 이상해집니다.
      }
    },
    updateRelation: (relation) => {
      if (relation.type === 'many-to-many')
        throw new Error('it cannot be many-to-many');

      set((prev) => ({
        ...prev,
        relations: {
          ...prev.relations,
          [relation.to]: prev.relations[relation.to].map((v) =>
            v.id === relation.id ? relation : v,
          ),
          [relation.from]: prev.relations[relation.from].map((v) =>
            v.id === relation.id ? relation : v,
          ),
        },
      }));
    },
    deleteRelation: (relation) =>
      set((prev) => ({
        ...prev,
        relations: {
          ...prev.relations,
          [relation.to]: prev.relations[relation.to].filter(
            (v) => v.id !== relation.id,
          ),
          [relation.from]: prev.relations[relation.from].filter(
            (v) => v.id !== relation.id,
          ),
        },
      })),
  }));
