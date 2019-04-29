import config from '/config'
import request from 'request-promise'
import { ObjectID } from 'mongodb'
import PurchaseOrder from '/src/models/purchaseOrder'
import Cart from '/src/models/cart'

const id = 0

module.exports = {
  /**
    * @api {post} /purchaseOrders Create Purchase Order
    * @apiVersion 1.0.0
    * @apiName PurchaseOrder
    * @apiGroup PurchaseOrder
    * @apiPermission none
    *
    * @apiDescription Create new PO to be processed
    */
  createPO: async (req, res, next) => {
    try {
      const { cartId } = req.body
      const cart = await Cart.findOne({ _id: new ObjectID(cartId) })
      if(!cart) return res.status(404).json({ error: 'Cart doesnt exist!'})

      const { _id, __v, ...data } = cart.toJSON()
      /*
      const response = await request({
        uri: `${config.queueAPI}/job`,
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: {
          type: 'purchaseOrders',
          data: {
            user: req.user,
            ...req.body
          },
          options: {
            // attempts: 10,
            // backoff: true
          }
        },
        json: true
       })
       */

      const newPO = await PurchaseOrder.create({
        user: new ObjectID(req.user._id.toString()),
        jobId: id + 1,
        ...data
      })

      await newPO.fetchProducts()

      await Cart.findOneAndUpdate({ _id: new ObjectID(cartId) }, { products: [], address: null, creditCard: null })

      res.json({ ...newPO.toJSON() })

      await newPO.sendConfirmationEmail(req.user.email)

    } catch(error) {
      console.log('ERROR:', error)
      return res.status(500).json({ error: error && error.toString() })
    }
  },

  /**
    * @api {get} /purchaseOrders Get authenticated user POs
    * @apiVersion 1.0.0
    * @apiName PurchaseOrder
    * @apiGroup PurchaseOrder
    * @apiPermission none
    *
    * @apiDescription get auth user POs
    */
  getPOs: async (req, res, next) => {
    try {
      const purchaseOrders = await PurchaseOrder
        .find({ user: new ObjectID(req.user._id) })
        .sort({ _id: 1 })

      for(let i = 0; i < purchaseOrders.length; i++) {
        const po = purchaseOrders[i]
        await po.fetchProducts()
        purchaseOrders[i] = po
      }

      res.send({ purchaseOrders })
    } catch(error) {
      console.log('ERROR:', error)
      return res.status(500).json({ error: error && error.toString() })
    }
  },

  /**
    * @api {put} /purchaseOrders/:id/cancel Cancel PO
    * @apiVersion 1.0.0
    * @apiName PurchaseOrder
    * @apiGroup PurchaseOrder
    * @apiPermission none
    *
    * @apiDescription put cancel PO
    */
  cancelPO: async (req, res, next) => {
    try {
      const po = await PurchaseOrder.findOne({ _id: new ObjectID(req.params.id) })

      if(!po) return res.status(404).send({ error: 'PO not found'})

      if(req.user.role !== 'admin' && req.user._id.toString() !== po.user.toString()) return res.status(403).send({ error: 'You dont have permission to cancel this PO' })

      if(po.status === 'enqueue'){
        /*
        const response = await request({
          uri: `${config.queueAPI}/job/${po.jobId}`,
          method: 'DELETE',
          headers: {
            'content-type': 'application/json'
          }
         })
         */
        const updatedPO = await PurchaseOrder.findOneAndUpdate({ _id: new ObjectID(req.params.id) },
          { status: 'cancel' },
          { new: true })

        await updatedPO.fetchProducts()

        return res.send({ ...updatedPO.toJSON() })
      } else {
        return res.status(400).send({ error: `PO cant be cancelled. Because current status is ${po.status}` })
      }
    } catch(error) {
      console.log('ERROR:', error)
      return res.status(500).json({ error: error && error.toString() })
    }
  }
}
