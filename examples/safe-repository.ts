import { Relation } from "@/entity";
import { SafeRepository } from "@/repository";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  DataSource,
  OneToMany,
  ManyToOne,
} from "typeorm";

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Relation<Photo>[]; // 1. Annotate relation
  // Relation<Photo[]> is also available

  constructor(id: number, photos: Relation<Photo>[]) {
    this.id = id;
    this.photos = photos;
  }
}

@Entity()
class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
  })
  name: string;

  @ManyToOne(() => User, (user) => user.photos)
  user: Relation<User>; // 1. Annotate relation

  @OneToOne(() => PhotoMetadata, (metadata) => metadata.photo)
  metadata: Relation<PhotoMetadata>; // 1. Annotate relation

  constructor(
    id: number,
    name: string,
    user: Relation<User>,
    metadata: Relation<PhotoMetadata>
  ) {
    this.id = id;
    this.name = name;
    this.user = user;
    this.metadata = metadata;
  }
}

@Entity()
class PhotoMetadata {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  height: number;

  @Column("int")
  width: number;

  @OneToOne(() => Photo, (photo) => photo.metadata)
  @JoinColumn()
  photo: Relation<Photo>; // 1. Annotate relation

  constructor(
    id: number,
    height: number,
    width: number,
    photo: Relation<Photo>
  ) {
    this.id = id;
    this.height = height;
    this.width = width;
    this.photo = photo;
  }
}

const dataSource = new DataSource({
  type: "mysql",
});

const photoRepository = dataSource.getRepository(
  Photo
) as unknown as SafeRepository<Photo>; // 2. Cast repository to the SafeRepository

// 3. Just use the repository. The properties of returned types are automatically filtered
async function example() {
  const photos = await photoRepository.find();
  type HasMetadataInPhotos = (typeof photos)[number] extends {
    metadata: unknown;
  }
    ? true
    : false; // false

  const photosWithRelation = await photoRepository.find({
    relations: {
      user: true,
      metadata: true,
    },
  });
  type HasMetadataInPhotosWithRelation =
    (typeof photosWithRelation)[number] extends {
      metadata: unknown;
    }
      ? true
      : false; // true
  type HasUserInPhotosWithRelation =
    (typeof photosWithRelation)[number] extends {
      user: unknown;
    }
      ? true
      : false; // true
}

example();
