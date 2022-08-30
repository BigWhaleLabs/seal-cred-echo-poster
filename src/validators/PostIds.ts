import { IsInt } from 'amala'

export default class {
  @IsInt({ each: true })
  ids!: number[]
}
