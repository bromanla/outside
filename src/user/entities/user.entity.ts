import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from 'src/tag/entities/tag.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column({ unique: true, length: 30 })
  nickname: string;

  @ManyToMany(() => Tag, (tag) => tag.users)
  tags: Tag[];

  @OneToMany(() => Tag, (tag) => tag.creator)
  createdTags: Tag[];
}
