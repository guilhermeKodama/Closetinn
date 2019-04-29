import config from '/config'
import { ObjectID } from 'mongodb'
import User from '/src/models/user'
import Newsletter from '/src/models/newsletter'

module.exports = {
  /**
  @api {post} /newsletters create newsletter subscription
  @apiVersion 0.0.1
  @apiName CreateNewsletterSubscription
  @apiGroup Newsletter
  @apiDescription
  Create newsletter subscription
  **/
  createSubscription: async (req, res, next) => {
    try {
      const { email } = req.body
      const data = {}

      const exist = await Newsletter.findOne({ email })
      if (exist) return res.status(409).json({ error: 'Newsletter already exist.' })

      const user = await User.findOne({ email })

      if(user) data.user = new ObjectID(user._id)

      data.email = email

      const newSubscription = await Newsletter.create(data)

      if(user) {
        user.newsletter = newSubscription._id
        await user.save()
      }

      res.json({ ...newSubscription.toJSON() })
    } catch (e) {
      console.log('E:', e)
      res.status(500).json({ error: e && e.toString() })
    }
  },
  /**
  @api {delete} /newsletters/:id delete newsletter subscription
  @apiVersion 0.0.1
  @apiName DeleteNewsletterSubscription
  @apiGroup Newsletter
  @apiDescription
  Delete newsletter subscription
  **/
  deleteSubscription: async (req, res, next) => {
    try {
      const { id } = req.params

      const subscription = await Newsletter.findOne({ _id: new ObjectID(id) })

      if(!subscription) return res.status(404).json({ error: 'Subscription not found.' })

      await Newsletter.findOneAndRemove({ _id: new ObjectID(id) })
      await User.findOneAndUpdate({ email: subscription.email }, { newsletter: null })

      res.json({ success: true })
    } catch (e) {
      res.status(500).json({ error: e && e.toString() })
    }
  }
}
