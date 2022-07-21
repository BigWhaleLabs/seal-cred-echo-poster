import { IsInt, IsOptional } from 'amala'

export default class {
  @IsOptional()
  @IsInt()
  skip!: number
  @IsOptional()
  @IsInt()
  limit!: number
}
