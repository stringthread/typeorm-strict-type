type PathImpl<K extends string | number, V> = V extends object
  ? [`${K}`, ...Path<V>]
  : [`${K}`];

export type Path<T> = T extends object
  ? {
      [K in keyof T]: PathImpl<K & string, T[K]>;
    }[keyof T]
  : never;

export type Waypoints<T extends string[]> = T extends [infer F, ...infer R]
  ? R extends string[]
    ? [F] | [F, ...Waypoints<R>]
    : never
  : never;

export type StringToPath<S extends string> =
  S extends `${infer F}.${infer Rest}` ? [F, ...StringToPath<Rest>] : [S];
