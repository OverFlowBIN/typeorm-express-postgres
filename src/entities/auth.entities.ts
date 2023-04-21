import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
@Index(['userId', 'phone'], { unique: true })
export default class Authentication {
  /**
   * INACCESSIBLE
   * @param userId
   * @param name
   * @param phone
   * @param authKey
   * @param updatedAt
   * @param createdAt
   */
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({ type: 'text' })
  public userId: string;

  @Column({ type: 'text' })
  public phone: string;

  @Column({ type: 'text' })
  public authKey: string;

  @Column({ type: 'timestamptz', nullable: true })
  public authorizedAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @CreateDateColumn()
  public createdAt: Date;
}
