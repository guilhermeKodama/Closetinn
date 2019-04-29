import { ObjectID } from 'mongodb'
import View from '/src/models/view'
import Click from '/src/models/click'

module.exports = {
  /**
    * @api {post} /analytics View Page
    * @apiVersion 1.0.0
    * @apiName Cart
    * @apiGroup Cart
    * @apiPermission none
    *
    * @apiDescription Add visualization to view
    */
  pageView: async (req, res, next) => {
    try {
      if (!ObjectID.isValid(req.body.user)) return res.status(400).send({ message: 'User id invalid.' })

      var newView = new View(req.body)
      const view = await newView.save()

      return res.json(view)
    } catch(error) {
      res.status(500).send({ error: error && error.message })
    }
  },

  saveClick: async (req, res, next) => {
    try {
      const click = new Click(req.body)
      const result = await click.save()

      res.json({ result })
    } catch(e) {
      if(e.name === 'ValidationError') {
        res.status(422).send({ error: e && e.message })
      } else {
        res.status(500).send({ error: e && e.message })
      }
    }
  }
}
