import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class TodoInput {
  @Field()
  @IsNotEmpty()
  id: number;
}
