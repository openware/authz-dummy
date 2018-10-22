const express = require('express')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const privkey = fs.readFileSync("./src/auth/privkey.txt").toString('ascii')

function payload () {
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
}

module.exports = () => {
  let auth = express()

  // Skip authentication for open endpoints and static files
  auth.all([
    // root path
    /^\/$/,

    // Ambassador diagnostics
    /^\/ambassador/,

    // static files
    /\.(js|css|ico|jpe?g|png|svg)$/
  ], (req, res) => res.send(200))

  auth.all('*', (req, res) => {
    // TODO: check for a "Set-Cookie" header and return default user data

    let token = jwt.sign(payload(), privkey, { algorithm: 'RS256' })
    console.log(payload(), token)

    res.set('Authorization', `Bearer ${token}`)

    res.status(200)

    res.end()
  })

  return auth
}
