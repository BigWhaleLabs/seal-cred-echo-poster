import * as mongoose from 'mongoose'
import env from '@/helpers/env'

export default function runMongo(mongoUrl = env.MONGO) {
  console.log(`Connecting to MongoDB at ${mongoUrl}`)
  return mongoose.connect(mongoUrl)
}
