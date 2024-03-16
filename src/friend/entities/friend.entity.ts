import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from 'src/user/entities';

@Entity()
export class Friend {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id_1' })
  user1: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id_2' })
  user2: User;

  @CreateDateColumn()
  createdAt: Date;
}
