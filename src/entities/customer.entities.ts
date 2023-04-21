// import { Field, Int, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Request, User } from '.';

@Entity()
// @ObjectType()
export default class Customer {
  /**
   * ACCESSIBLE
   * @param customerId
   * @param requestId
   * @param name
   * @param sex
   * @param birth
   * @param email
   * @param phone
   * @param updatedAt
   * @param createdAt
   */
  // @Field(type => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  public readonly customerId: number;

  // @Field({ nullable: true })
  @Column({ type: 'text' })
  public name: string;

  // @Field({ nullable: true })
  @Column({ type: 'text' })
  public sex: string;

  // @Field({ nullable: true })
  @Column({ type: 'text' })
  public birth: string;

  // @Field({ nullable: true })
  @Column({ type: 'text' })
  public email: string;

  // @Field({ nullable: true })
  @Column({ type: 'text' })
  public phone: string;

  // @Field({ nullable: true })
  @UpdateDateColumn()
  public updatedAt: Date;

  // @Field({ nullable: true })
  @CreateDateColumn()
  public createdAt: Date;

  /**
   * INACCESSIBLE
   * @param agreeYN
   * @param agreeMethod
   * @param agreeWay
   * @param agreeConfirm
   * @param agreeNo
   * @param certiWay
   * @param certiDesc
   * @param termStart
   * @param termEnd
   */
  @Column({ type: 'text' })
  public agreeYN: string;

  @Column({ type: 'text' })
  public agreeMethod: string;

  @Column({ type: 'text' })
  public agreeWay: string;

  @Column({ type: 'text' })
  public agreeConfirm: string;

  @Column({ type: 'text' })
  public agreeNo: string;

  @Column({ type: 'text' })
  public certiWay: string;

  @Column({ type: 'timestamptz' })
  public certiDesc: Date;

  @Column({ type: 'timestamptz' })
  public termStart: Date;

  @Column({ type: 'timestamptz' })
  public termEnd: Date;
}
