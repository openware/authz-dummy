const express = require('express')

const config = require('./config')
const auth = require('./auth')

const server = {
  app: express(),

  init: function () {
    this.app.locals.config = config.load()

    this.app.use((req, res, next) => {
      console.log(`[${req.method}] ${req.url}`)
      return next()
    })

    // Mount express authorizer app
    auth.init()
    this.app.use('/auth', auth.app)

    return this
  },

  start: function () {
    this.app.listen(8005, function () {
      console.log('Starting Peatio development authz server on localhost:8005')
    })
  }
}

module.exports = server