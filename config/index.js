let configs = {}

if (process.env.NODE_ENV === 'prod') {
  configs = require('./prod.json')
} else if (process.env.NODE_ENV === 'dev') {
  configs = require('./dev.json')
} else {
  throw new Error('NODE_ENV not set');
}

module.exports = configs
