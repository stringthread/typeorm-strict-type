type PathImpl<K extends string | number, V> = V extends object
  ? [`${K}`] | [`${K}`, ...Path<V>]
  : [`${K}`];

export type Path<T> =
  | (T extends object
      ? {
          [K in keyof T]: PathImpl<K & string, T[K]>;
        }[keyof T]
      : never)
  | [];

export type StringToPath<S extends string> =
  | (S extends `${infer F}.${infer Rest}`
      ? [F] | [F, ...StringToPath<Rest>]
      : S extends ""
        ? never
        : [S])
  | [];
