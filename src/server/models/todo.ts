import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from './user';

@ObjectType()
export class Todo {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  completed?: boolean;

  @Field(() => User, { nullable: true })
  user?: User | null;
}

@ObjectType()
export class TodosResult {
  @Field()
  count: number;

  @Field(() => [Todo], { nullable: true })
  todos?: Todo[];
}
