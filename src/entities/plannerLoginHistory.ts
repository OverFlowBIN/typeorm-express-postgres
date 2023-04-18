// import { Field, ID, Int, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Planner } from '.';

@Entity()
// @ObjectType()
export default class PlannerLoginHistory {
  /**
   * ACCESSIBLE
   * @param appId
   * @param createdAt
   */
  // @Field({ nullable: true })
  @Column()
  public appId: string;

  // @Field({ nullable: true })
  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  /**
   * INACCESSIBLE
   * @param loginId
   * @param plannerId
   */
  @PrimaryGeneratedColumn()
  public readonly loginId: number;

  @Column()
  public readonly plannerId: string;

  /**
   * REFERENCE
   * @param planner
   */
  @ManyToOne((type) => Planner, (planner) => planner.loginHistory)
  @JoinColumn({ name: 'plannerId' })
  public readonly planner: Planner;
}
