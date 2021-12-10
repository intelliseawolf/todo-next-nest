import { Field, ID, ObjectType, Directive } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "id")')
export class User {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  password?: string;

  @Field()
  gender: boolean;

  @Field()
  role: string;

  @Field()
  token?: string;
}

@ObjectType()
export class LoginResult {
  @Field()
  token: string;

  @Field(() => User, { nullable: true })
  user?: User;
}
