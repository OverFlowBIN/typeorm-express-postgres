// import { Field, Int, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Planner } from '.';

@Entity()
@Unique(['appId'])
@Unique(['phone'])
// @ObjectType()
export default class PlannerReferralHistory {
  /**
   * ACCESSIBLE
   * @param appId
   * @param phone
   * @param email
   * @param createdAt
   */
  // @Field({ nullable: true })
  @Column()
  public appId: string;

  // @Field({ nullable: true })
  @Column()
  public phone: string;

  // @Field({ nullable: true })
  @Column()
  public email: string;

  // @Field({ nullable: true })
  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  /**
   * INACCESSIBLE
   * @param referralId
   * @param plannerId
   */
  @PrimaryGeneratedColumn()
  public readonly referralId: number;

  @Column()
  public readonly plannerId: string;

  /**
   * REFERENCE
   * @param planner
   */
  // @Field((type) => Planner)
  @ManyToOne((type) => Planner, (planner) => planner.referralHistory)
  @JoinColumn({ name: 'plannerId' })
  public readonly planner: Planner;
}
