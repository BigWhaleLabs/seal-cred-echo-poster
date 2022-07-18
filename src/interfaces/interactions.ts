/* eslint-disable @typescript-eslint/no-explicit-any */
export interface InteractionInterface {
  name: string
  customId: string
  execute: (...args: any) => unknown | Promise<unknown>
}
