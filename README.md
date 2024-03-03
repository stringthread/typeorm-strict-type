# TypeORM-Strict-Type

An all-TypeScript package which provides safer typing for functions in TypeORM.

- Enhansed type supports for TypeORM data-mapper pattern
  - Pick only joined relations with `find***` functions.
- Almost zero runtime

## Features

In TypeORM repositories, returned types of `find***` functions have all relations, regardless of whether they are actually joined.

This package introduces type-safe repository type. Its `find***` functions return only the actually joined relations by checking `relations` option.

This package is inspired by the article below:

[TypeORMのData Mapperパターンにおけるリレーションの型安全性を担保する](https://tech.mobilefactory.jp/entry/2023/09/06/160000) (Japanese)

## Usage

1. Annotate relations with the `Relation` type in the entity.
2. Cast repository to the `SafeRepository`.
3. Just use the repository. The properties of returned types are automatically filtered.

```ts
@Entity()
class Sample {
  @OneToOne()
  rel: Relation<Sample2>; // 1. Annotate relation
}

const sampleRepository = dataSource.getRepository(
  Sample
) as unknown as SafeRepository<Sample>; // 2. Cast repository to the SafeRepository

// 3. Just use the repository. The properties of returned types are automatically filtered
const withoutRelations = await sampleRepository.find();
// => {}
const withRelations = await sampleRepository.find({
  relations: {
    rel: true,
  },
});
// => { rel: Relation<Sample2> }
```

For more information about usage, see the `examples` directory.

## Installation

Available via npm.

```sh
npm i --save typeorm-strict-type
```

## License

MIT
