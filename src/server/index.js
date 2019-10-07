require('dotenv').config()

const fs = require('fs')
const path = require('path')
const fastify = require('fastify')({
  logger: { level: 'info' },
  http2: true,
  https: {
    key: fs.readFileSync(path.join(__dirname, 'localhost.key')),
    cert: fs.readFileSync(path.join(__dirname, 'localhost.crt'))
  }
})

const oauthPlugin = require('fastify-oauth2')

fastify.register(oauthPlugin, {
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
})

fastify.get('/login/facebook/callback', async function (request, reply) {
  const token = await this.getAccessTokenFromAuthorizationCodeFlow(request)

  console.log(token.access_token)
  // if later you need to refresh the token you can use
  // const newToken = await this.getNewAccessTokenUsingRefreshToken(token.refresh_token)

  reply.send({ access_token: token.access_token })
})

fastify.listen(3000)
