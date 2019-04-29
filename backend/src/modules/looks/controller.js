import { ObjectID } from 'mongodb'
import fs from 'fs'
import config from '/config'
import Look from '/src/models/look'
import cloudinary from '/src/utils/cloudinary'

module.exports = {

  getLook: async (req, res, next) => {
    try {
      const { id } = req.params

      const look = await Look.findOne({ _id: new ObjectID(id) })
      .populate('products')
      .exec()

      res.json(look)
    } catch (e) {
      console.log(e)
      res.status(500).json({ error: e && e.toString() })
    }
  },

  getLooks: async (req, res, next) => {
    try {
      const offset = parseInt(req.query.offset)
      const page = parseInt(req.query.page)

      const looks = await Look.find()
      .skip(page * offset)
      .limit(offset)
      .populate('products')

      const count = await Look.count()
      const pages = count % offset > 0 ? parseInt(count / offset) + 1 : parseInt(count / offset)
      const pagination = {
        page,
        offset,
        totalPages: parseInt(count / offset) < 1 ? 1 : pages,
        totalItems: count
      }

      res.json({ looks, pagination })
    } catch (e) {
      res.status(500).json({ error: e && e.toString() })
    }
  },

  createLook: async (req, res, next) => {
    try {
      // formdata should be parsed
      const ids = JSON.parse(req.body.products)

      // Check if array
      if (!Array.isArray(ids)) return res.status(400).json({ error: 'Products should be array'})

      // Check if has invalid product ids
      ids.forEach(id => {
        if (!ObjectID.isValid(id)) return res.status(400).json({ error: 'Invalid product id'})
      })
      req.body.products = ids

      if (!req.file) return res.status(402).json({ error: 'File is required'})
      const { url } = await cloudinary.v2.uploader.upload(req.file.path, { folder: 'looks' })
      req.body.image = url

      const look = new Look(req.body)
      const newLook = await look.save()
      if (!newLook) return res.status(500).json({ error: 'Error creating look' })

      res.json(newLook)
    } catch (e) {
      if (e.code === 11000) {
        res.status(409).json({ error: 'Look already exist.' })
      } else {
        res.status(500).json({ error: e && e.toString() })
      }
    } finally {
      try {
        // Dele file from temp folder
        fs.unlinkSync(req.file.path)
      } catch (e) {
        res.status(500).json({ error: e && e.toString() })
      }
    }
  },

  updateLook: async (req, res, next) => {
    try {
      const newData = {}
      const { id } = req.params
      // formdata should be parsed
      const ids = JSON.parse(req.body.products)

      // Check if array
      if (!Array.isArray(ids)) return res.status(400).json({ error: 'Products should be array'})

      // Check if has invalid product ids
      ids.forEach(id => {
        if (!ObjectID.isValid(id)) return res.status(400).json({ error: 'Invalid product id'})
      })
      newData.products = ids

      if (req.file) {
        const { url } = await cloudinary.v2.uploader.upload(req.file.path, { folder: 'looks' })
        newData.image = url
      }

      const look = await Look.findOneAndUpdate({ _id: new ObjectID(id) }, { $set: newData }, { new: true })
      .populate('products')
      .exec()
      if(!look) return res.status(404).send({ error: 'No look found'})

      res.json(look)
    } catch (e) {
      if (e.code === 11000) {
        res.status(409).json({ error: 'Look already exist.' })
      } else {
        res.status(500).json({ error: e && e.toString() })
      }
    } finally {
      try {
        if(req.file) {
          // Dele file from temp folder
          fs.unlinkSync(req.file.path)
        }
      } catch (e) {
        res.status(500).json({ error: e && e.toString() })
      }
    }
  }
}
