import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class TodosParams {
  @Field()
  @IsNotEmpty()
  perPage: number;

  @Field()
  @IsNotEmpty()
  page: number;
}
