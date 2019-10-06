module.exports = {
  name: 'facebookOAuth2',
  credentials: {
    client: {
      id: process.env.APP_ID,
      secret: process.env.APP_SECRET
    },
    auth: oauthPlugin.FACEBOOK_CONFIGURATION
  },
  // register a fastify url to start the redirect flow
  startRedirectPath: '/login/facebook',
  // facebook redirect here after the user login
  callbackUri: 'http://localhost:3000/login/facebook/callback'
}
