const jwt = require('jsonwebtoken')
import User from '/src/models/user'

const getToken = (req) => {
  return req.headers['authorization'] || req.headers['Authorization'] || req.body.token || req.params.token
}

module.exports = {
  getToken: (req) => {
    return req.headers['authorization'] || req.headers['Authorization'] || req.body.token || req.params.token
  },
  /**
   * Check if the user making the request has a valid token,
   * exist in the database and
   * has the correct permission role if permissions is set
   *
   * @param  {[Array]} permissions Array containing the roles that can access the endpoint ['user', 'admin']
   * @return {[]}  next | 401 | 403
   */
  ensurePermission: (permissions) => {
    return (req, res, next) => {
      // check header or url parameters or post parameters for token
      const token = getToken(req)

      User.findByToken(token).then((user) => {
        if (!user) return res.status(403).send({ message: 'Failed to authenticate token.' })

        req.user = user
        req.token = token

        if(permissions && !(permissions.indexOf(req.user.role) > -1) ) {
          return res.status(403).send({ message: 'User dont have permission to access this endpoint.' })
        }

        next()
      }, error => {
        res.status(401).send()
      })
    }
  },
  /**
   * Check if anonymousId is present in the body OR the user is logged.
   * That way we can keep anonymousId optional in the body
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  checkAnonymousCredential(req, res, next) {
    if(req.body.anonymousId) return next()
    const token = getToken(req)

    User.findByToken(token).then((user) => {
      if (!user) return res.status(401).send({ error: 'You need to be logged or send the anonymousId!'})

      req.user = user
      req.token = token

      return next()
    }, error => {
      return res.status(401).send({ error: 'You need to be logged or send the anonymousId!'})
    })
  }
}
