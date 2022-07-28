import TwitterError from 'models/TwitterError'

const isTwitterError = (err: unknown): err is TwitterError =>
  !!err &&
  typeof err === 'object' &&
  'data' in err &&
  'detail' in (err as TwitterError).data &&
  typeof (err as TwitterError).data.detail === 'string'

export default isTwitterError
