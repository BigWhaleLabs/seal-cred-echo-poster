enum ModerationLevel {
  medium = 'medium', // Moderate posts that don't pass filters, approve the rest
  high = 'high', // Moderate posts that pass filters, reject the rest
}

export default ModerationLevel
