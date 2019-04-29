import { ObjectID } from 'mongodb'

export const view = {
  user: new ObjectID().toString(),
  url: 'http://local.closetinn.com.br:3000/admin/looks',
}
