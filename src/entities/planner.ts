// import { Field, ID, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import PlannerLoginHistory from './plannerLoginHistory';
import PlannerReferralHistory from './plannerReferralHistory';
import { Company } from '../interfaces/enums';
import { Request } from '.';

@Entity()
// @ObjectType()
export default class Planner {
  /**
   * ACCESSIBLE
   * @param plannerId
   * @param name
   * @param phone
   * @param company
   * @param headquarter
   * @param branch
   * @param position
   * @param salesPosition
   * @param updatedAt
   * @param createdAt
   */
  // @Field((type) => ID, { description: '설계사 아이디', nullable: true })
  @PrimaryColumn({ type: 'text' })
  public readonly plannerId: string;

  // @Field({ nullable: true })
  @Column({ type: 'text' })
  public name: string;

  // @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  public phone: string;

  // @Field((type) => Company, { nullable: true })
  @Column({ type: 'enum', enum: Company })
  public company: Company;

  // @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  public headquarter: string;

  // @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  public branch: string;

  // @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  public position: string;

  // @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  public salesPosition: string;

  // @Field({ nullable: true })
  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date;

  // @Field({ nullable: true })
  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  // @Field({ nullable: true })
  @Column({ type: 'boolean', nullable: true, default: false })
  public certificateLife: boolean;

  // @Field({ nullable: true })
  @Column({ type: 'boolean', nullable: true, default: false })
  public certificateProp: boolean;

  // @Field({ nullable: true })
  @Column({ type: 'boolean', nullable: true, default: false })
  public certificateVari: boolean;

  /**
   * INACCESSIBLE
   * @param installed
   * @param installedAt
   */

  @Column({ type: 'boolean', nullable: true, default: false })
  public installed: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  public installedAt: Date;

  /**
   * REFERENCE
   * @param loginHistory
   * @param referralHistory
   * @param requests
   */
  @OneToMany((type) => PlannerLoginHistory, (history) => history.planner)
  public readonly loginHistory: PlannerLoginHistory[];

  @OneToMany((type) => PlannerReferralHistory, (history) => history.planner)
  public readonly referralHistory: PlannerReferralHistory[];
}
