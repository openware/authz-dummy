const fs = require('fs')

const config = {
  loadPrivateKey: () => {
    if (process.env.JWT_PRIVATE_KEY_FILE)
      return fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILE).toString()
    else
      throw new Error('private key path is missing, set JWT_PRIVATE_KEY_FILE env variable')
  },

  load: function () {
    return {
      jwtPrivateKey: this.loadPrivateKey()
    }
  }
}

module.exports = config
