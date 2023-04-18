// import { Field, Int, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Request from './request';
import { RequestStatus } from '../interfaces/enums';

@Entity()
// @ObjectType()
export default class RequestHistory {
  /**
   * ACCESSIBLE
   * @param historyId
   * @param requestId
   * @param plannerId
   * @param status
   * @param createdAt
   */
  // @Field(type => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  public readonly historyId: number;

  // @Field((type) => Int, { nullable: true })
  @Column()
  public readonly requestId: number;

  // @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  public plannerId: string;

  // @Field((type) => RequestStatus, { nullable: true })
  @Column({ type: 'enum', enum: RequestStatus })
  public status: RequestStatus;

  // @Field({ nullable: true })
  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  /**
   * REFERENCE
   * @param request
   */
  @ManyToOne((type) => Request, { cascade: true })
  @JoinColumn({ name: 'requestId' })
  public readonly request: Request;
}
