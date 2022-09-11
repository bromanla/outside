import {
  Entity,
  Column,
  ManyToOne,
  JoinTable,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  creatorUid: string;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.createdTags, { onDelete: 'CASCADE' })
  creator: User;

  @Column({ length: 40, unique: true })
  name: string;

  @Column({ default: 0 })
  sortOrder: number;

  @ManyToMany(() => User, (user) => user.tags, { onDelete: 'CASCADE' })
  @JoinTable({ name: 'tagUser' })
  users: User[];
}
