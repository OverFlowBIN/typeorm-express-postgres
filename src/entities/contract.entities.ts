// import { Field, Int, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Request, User } from '.';

@Entity()
// @ObjectType()
export default class Contract {
  /**
   * ACCESSIBLE
   * @param requestId
   * @param userId
   * @param data
   */
  // @Field((type) => Int, { nullable: true })
  @PrimaryColumn()
  public readonly requestId: number;

  // @Field({ nullable: true })
  @Column()
  public data: string;

  /**
   * INACCESSIBLE
   * @param key
   * @param createAt
   */
  @Column()
  public key: string;

  @CreateDateColumn()
  public createdAt: Date;

  /**
   * REFERENCE
   * @param request
   */
  @OneToOne((type) => Request, (request) => request.contract)
  @JoinColumn({ name: 'requestId' })
  public readonly request: Request;
}
