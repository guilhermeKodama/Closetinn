import { MongoClient } from 'mongodb'
import config from '/config'

export class MongoDB {

  constructor(ensureIndexes) {
    this.con = null
  }

  getConnection(collection, cb) {
    if(!this.con) {
      MongoClient.connect(config.mongodb.url, {
        poolSize: 10
      }, (err, db) => {
        if(err) {
          console.log('[MongoDB] ', err)
          cb(err)
        } else {
          this.con = db
          // make sure indexes are there
          this.con.collection('clothes').createIndex( { productName: "text" } )
          this.con.collection('clothes').createIndex( { brand: 1 }, { background:true }  )
          this.con.collection('clothes').createIndex( { site: 1 }, { background:true }  )
          this.con.collection('clothes').createIndex( { price: 1 }, { background:true }  )
          this.con.collection('clothes').createIndex( { sizes: 1 }, { background:true }  )
          this.con.collection('clothes').createIndex( { gender: 1 }, { background:true }  )
          this.con.collection('users').createIndex( { email: 1 }, { unique:true, background:true } )
          cb(null, this.con.collection(collection))
        }
      })
    } else {
      cb(null, this.con.collection(collection))
    }
  }

  save(collection, doc, cb) {
    this.getConnection(collection, (err, con) => {
      if(err) {
        cb(err, null)
      } else {
        con.insertOne(doc, cb)
      }
    })
  }

}

export const instance = new MongoDB()

export default instance
