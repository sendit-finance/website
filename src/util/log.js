const debug = require('debug')

// make this work in the browser
debug.log = console.info.bind(console)

const logger = debug('sendit')

if (typeof window !== 'undefined') {
  const rgx = /.*(?:debug=)([^&]+).*/
  const { search } = window.location
  const match = rgx.exec(search)

  if (match && match[1]) {
    debug.enable('sendit*')
  } else {
    debug.disable()
  }

  window.logger = logger
}

module.exports = logger
