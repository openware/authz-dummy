const express = require('express')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const auth = {
  // Create express middleware instance
  app: express(),

  // Private key for generating JWT
  jwtPrivateKey: Buffer.from((process.env.JWT_PRIVATE_KEY || ''), 'base64').toString('ascii'),

  // Initialize auth middleware routes
  init: function () {
    // Skip authentication for open endpoints and static files
    this.app.all([
      // root path
      /^\/$/,

      // Ambassador diagnostics
      /^\/ambassador/,

      // static files
      /\.(js|css|ico|jpe?g|png|svg)$/
    ], (req, res) => res.send(200))

    this.app.all('*', (req, res) => {
      // TODO: check for a "Set-Cookie" header and return default user data

      let token = jwt.sign(this.generatePayload(), this.jwtPrivateKey, { algorithm: 'RS256' })

      res.set('Authorization', `Bearer ${token}`)
      res.status(200).end()
    })
  },

  // Generates new payload with default uid and email
  generatePayload: () => {
    let ts = parseInt(Date.now() / 1000)

    return {
      "iat": ts,
      "exp": ts + 5,
      "sub": "session",
      "iss": "barong",
      "aud": ["peatio"],
      "jti": crypto.randomBytes(8).toString("hex"),
      "uid": "ID0000000000",
      "email": "john.doe@gmail.com",
      "role": "admin",
      "level": 3,
      "state": "active"
    }
  },
}

module.exports = auth