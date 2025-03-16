import { Schedule } from 'src/order/entities/schedule.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Film {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  rating: string;

  @Column()
  director: string;

  @Column()
  tags: string;

  @Column()
  image: string;

  @Column()
  cover: string;

  @Column()
  title: string;

  @Column()
  about: string;

  @OneToMany(() => Schedule, (schedule) => schedule.filmId)
  schedule: Schedule[];
}
