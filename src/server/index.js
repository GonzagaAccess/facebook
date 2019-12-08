require('dotenv').config()

const fs = require('fs')
const path = require('path')
const fastify = require('fastify')({
  logger: { level: 'info' },
  http2: true,
  https: {
    key: fs.readFileSync(path.join(__dirname, 'localhost-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'localhost.pem'))
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
  startRedirectPath: '/login/facebook',
  callbackUri: 'https://localhost:3000/login/facebook/callback'
})

fastify.get('/login/facebook/callback', async function (request, reply) {
  const token = await this.getAccessTokenFromAuthorizationCodeFlow(request)
  reply.send({ access_token: token.access_token })
})

fastify.listen(3000, err => {
  if (err) throw err
})
