import { ObjectID } from 'mongodb'
import security from '../src/utils/security'

export const defaultProductId = new ObjectID()

export const newProductId = {
  productId: new ObjectID()
}

export const defaultFolder = {
  "_id": new ObjectID(),
  "folderName": "Verão 🌞",
  "products": [
    defaultProductId
  ],
  "description": "Roupas para usar no verão"
}

export const user = {
  _id: new ObjectID(),
  role: 'user',
  email: 'guilherme.kodam1a@gmail.com',
  name: 'Guilherme Kodama',
  password: 'c6ce24ed0a7dbd98f82a0be3f9757309168f97fce02a9eeda860663144fbab5b6baf814bf55d201fd3477c3f06ea197f251a9d257c46692dab6c43d9c1f4680f',
  salt: '52c9903cd04c74d6',
  closet: [
    defaultFolder
  ]
}

export const userNoCart = {
  _id: new ObjectID(),
  role: 'user',
  email: 'no.cart@gmail.com',
  name: 'No Cart',
  password: 'c6ce24ed0a7dbd98f82a0be3f9757309168f97fce02a9eeda860663144fbab5b6baf814bf55d201fd3477c3f06ea197f251a9d257c46692dab6c43d9c1f4680f',
  salt: '52c9903cd04c74d6',
  closet: [
    defaultFolder
  ]
}

export const userHasCart = {
  _id: new ObjectID(),
  role: 'user',
  email: 'has.cart@gmail.com',
  name: 'Has Cart',
  password: 'c6ce24ed0a7dbd98f82a0be3f9757309168f97fce02a9eeda860663144fbab5b6baf814bf55d201fd3477c3f06ea197f251a9d257c46692dab6c43d9c1f4680f',
  salt: '52c9903cd04c74d6',
  closet: [
    defaultFolder
  ]
}

export const userAdmin = {
  _id: new ObjectID(),
  role: 'admin',
  email: 'admin@gmail.com',
  name: 'Guilherme Kodama',
  password: 'c6ce24ed0a7dbd98f82a0be3f9757309168f97fce02a9eeda860663144fbab5b6baf814bf55d201fd3477c3f06ea197f251a9d257c46692dab6c43d9c1f4680f',
  salt: '52c9903cd04c74d6',
  closet: [
    defaultFolder
  ]
}

export const userFacebook = {
  _id: new ObjectID(),
  email: 'guilherme.kodama.facebook@gmail.com',
  name: 'Guilherme Kodama',
  userID: '"1596812120397672"',
  accessToken: '123123',
  signedRequest: '123123',
  closet: [
    defaultFolder
  ]
}

export const validToken = security.generateToken(user)

export const validTokenFacebook = security.generateToken(userFacebook)

export const validTokenAdmin = security.generateToken(userAdmin)

export const invalidToken = '123123'

export const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imd1aWxoZXJtZS5rb2RhbWFAZ21haWwuY29tIiwiaWF0IjoxNTA5Mjc3MDQ3LCJleHAiOjE1MDkyODA2NDd9.Rn_535WD3mCzwWlfJ1KsCO52ucfGaIcBWBArOOr_IOg'

export const validTokenForgotPassword = security.generateForgotPasswordToken({ email: user.email })

export const newUserFacebook = {
  _id: new ObjectID(),
  email: 'new@facebook.com',
  name: 'New Facebook',
  userID: '"1596812120397672"',
  accessToken: '123123',
  signedRequest: '123123'
}

export const updateUser = {
  name: 'New Name',
  password: '654321'
}

export const newUser = {
  email: 'newuser@gmail.com',
  name: 'New User',
  password: '123456@*&'
}

export const invalidUser = {
  name: 'Invalid User',
  password: '123456'
}

export const invalidCreateFacebookUserTestCases = [
  {
    picture: {},
    userID: '123',
    fullName: 'unknown',
    accessToken: '123',
    signedRequest: '123',
    email: 'unknown@gmail.com'
  },
  {
    id: '123',
    userID: '123',
    fullName: 'unknown',
    accessToken: '123',
    signedRequest: '123',
    email: 'unknown@gmail.com'
  },
  {
    id: '123',
    picture: {},
    fullName: 'unknown',
    accessToken: '123',
    signedRequest: '123',
    email: 'unknown@gmail.com'
  },
  {
    id: '123',
    picture: {},
    userID: '123',
    accessToken: '123',
    signedRequest: '123',
    email: 'unknown@gmail.com'
  },
  {
    id: '123',
    picture: {},
    userID: '123',
    fullName: 'unknown',
    signedRequest: '123',
    email: 'unknown@gmail.com'
  },
  {
    id: '123',
    picture: {},
    userID: '123',
    fullName: 'unknown',
    accessToken: '123',
    email: 'unknown@gmail.com'
  },
  {
    id: '123',
    picture: {},
    userID: '123',
    fullName: 'unknown',
    accessToken: '123',
    signedRequest: '123'
  }
]

export const newFolder = {
  "_id": new ObjectID("5aae9d3523dcda026155e732"),
  "folderName": "Inverno 🧣",
  "description": "Roupas para usar no inverno"
}

export const updateFolder = {
  "folderName": "Inverno 🧦🧤🧣",
  "description": "Roupas para o inverno"
}

export const newFolderWithProduct = {
  "folderName": "Inverno em Paris 🧣",
  "productId": "5a142dffdc11eb497f076dbd",
  "description": "Roupas para usar no inverno"
}

export const newFolderWithInvalidProduct = {
  "folderName": "Privamera 🌻",
  "productId": "123",
  "description": "Roupas para usar na privamera"
}
