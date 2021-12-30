const httpHelper = require('../../common/http-helper')

/**
 * Envoie une réponse au client
 * @param res {object} objet response d'express pour envoyer physiquement la réponse
 * @param req {object}
 * @param next {function}
 */
function main (req, res, next) {
  Object.keys(httpHelper).forEach(hh => {
    res.send[hh] = function (x) {
      const h = httpHelper[hh](x)
      res.status(h.status)
      if (h.body !== null) {
        if (typeof h.body === 'object') {
          res.json(h.body)
        } else {
          res.end(h.body)
        }
      } else {
        res.end()
      }
    }
  })
  next()
}

module.exports = main
