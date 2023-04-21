// import { Field, Int, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  RequestMeetingTime,
  RequestPurpose,
  RequestStatus,
} from '../interfaces/enums';
import { Contract, Customer, Planner, RequestHistory, User } from '.';

@Entity()
// @ObjectType()
export default class Request {
  /**
   * ACCESSIBLE
   * @param requestId
   * @param customerId
   * @param plannerId
   * @param purpose
   * @param meetingTime
   * @param address
   * @param updatedAt
   * @param createdAt
   */
  // @Field((type) => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  public readonly requestId: number;

  // @Field((type) => Int, { nullable: true })
  @Column({ type: 'int' })
  public readonly customerId: number;

  // @Field({ nullable: true, defaultValue: '' })
  @Column({ type: 'text', nullable: true })
  public readonly plannerId: string;

  // @Field((type) => RequestPurpose, { nullable: true })
  @Column({
    type: 'enum',
    enum: RequestPurpose,
    nullable: true,
    default: RequestPurpose.GUARANTEE,
  })
  public purpose: RequestPurpose;

  // @Field((type) => RequestMeetingTime, { nullable: true })
  @Column({
    type: 'enum',
    enum: RequestMeetingTime,
    nullable: true,
    default: RequestMeetingTime.ANYTIME,
  })
  public meetingTime: RequestMeetingTime;

  // @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  public address: string;

  // @Field((type) => RequestStatus, { nullable: true })
  @Column({
    type: 'enum',
    enum: RequestStatus,
    nullable: true,
    default: RequestStatus.UNASSIGNED,
  })
  public status: RequestStatus;

  // @Field({ nullable: true })
  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date;

  // @Field({ nullable: true })
  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  /**
   * INACCESSIBLE
   * @param docId
   * @param designated
   */
  @Column({ type: 'text', nullable: true })
  public docId: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  public designated: boolean;

  @Column({ type: 'boolean', nullable: true, default: false })
  public healthcare: boolean;
  /**
   * REFERENCE
   * @param requestHistory
   * @param planner
   * @param customer
   * @param contract
   */
  @OneToMany((type) => RequestHistory, (history) => history.request)
  public readonly requestHistory: RequestHistory[];

  @OneToOne((type) => Customer)
  @JoinColumn({ name: 'customerId' })
  public readonly customer: Customer;

  @OneToOne((type) => Contract, (contract) => contract.request)
  public readonly contract: Contract;
}
