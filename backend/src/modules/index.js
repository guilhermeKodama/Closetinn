const glob = require('glob')

module.exports = function initModules(app) {
  // modules
  const cart = require(`${__dirname}/cart/router`)
  const auth = require(`${__dirname}/auth/router`)
  const admin = require(`${__dirname}/admin/router`)
  const users = require(`${__dirname}/users/router`)
  const looks = require(`${__dirname}/looks/router`)
  const search = require(`${__dirname}/search/router`)
  const clothes = require(`${__dirname}/clothes/router`)
  const analytics = require(`${__dirname}/analytics/router`)
  const promotions = require(`${__dirname}/promotions/router`)
  const newsletters = require(`${__dirname}/newsletters/router`)
  const healthcheck = require(`${__dirname}/healthcheck/router`)
  const purchaseOrder = require(`${__dirname}/purchaseOrder/router`)
  const recommendation = require(`${__dirname}/recommendation/router`)

  // assign routes
  app.use(cart.baseUrl, cart.router)
  app.use(auth.baseUrl, auth.router)
  app.use(users.baseUrl, users.router)
  app.use(admin.baseUrl, admin.router)
  app.use(looks.baseUrl, looks.router)
  app.use(search.baseUrl, search.router)
  app.use(clothes.baseUrl, clothes.router)
  app.use(analytics.baseUrl, analytics.router)
  app.use(promotions.baseUrl, promotions.router)
  app.use(healthcheck.baseUrl, healthcheck.router)
  app.use(newsletters.baseUrl, newsletters.router)
  app.use(purchaseOrder.baseUrl, purchaseOrder.router)
  app.use(recommendation.baseUrl, recommendation.router)
}
