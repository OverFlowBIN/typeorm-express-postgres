// import { Field, Int, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Provider, UserRole } from '../interfaces/enums';

@Entity()
// @ObjectType()
export default class User {
  /**
   * ACCESSIBLE
   * @param userId
   */
  // @Field(type => ID, { nullable: true })
  @PrimaryColumn({ type: 'text' })
  public readonly userId: string;

  /**
   * INACCESSIBLE
   * @param provider
   * @param providerUserId
   * @param role
   * @param refreshToken
   * @param updatedAt
   * @param createdAt
   * @param lastLoggedIn
   */
  @Column({ type: 'enum', enum: Provider })
  public provider: Provider;

  @Column({ type: 'text' })
  public providerUserId: string;

  @Column({ type: 'enum', enum: UserRole })
  public role: UserRole;

  @Column({ type: 'text', nullable: true })
  public phone: string;

  @Column({ type: 'text', nullable: true })
  public authKey: string;

  @Column({ type: 'text', nullable: true })
  public refreshToken: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  public lastLoggedIn: Date;

  // /**q
  //  * REFERENCE
  //  * @param customer
  //  * @param requests
  //  */
  // @OneToOne(type => Customer, customer => customer.user)
  // public readonly customer: Customer;

  // @OneToMany(type => Request, request => request.user)
  // public readonly requests: Request[];
}
