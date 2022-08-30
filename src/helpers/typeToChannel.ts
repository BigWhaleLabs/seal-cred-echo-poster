import PostingService from '@/models/PostingService'
import channels from '@/helpers/channels'

export default {
  [PostingService.twitter]: () => channels.twitter(),
  [PostingService.farcaster]: () => channels.farcaster(),
}
