import { ObjectID } from 'mongodb'

export const promotions = [
  {
    _id: new ObjectID('5b6cd04d0a3da6be561647aa'),
    category: "short",
    biggestDiscount: 0.8915217391304348,
    biggestDiscountCloth: new ObjectID('5a107b81f32c59d2218de5ba'),
    lowestPrice: 12.90,
    lowestPriceCloth: new ObjectID('5a107b81f32c59d2218de5ba'),
    clothes: [
      new ObjectID('5a107b81f32c59d2218de5ba'),
      new ObjectID('5a107b81f32c59d2218de5bc'),
      new ObjectID('5a107b81f32c59d2218de5bf')
    ]
  }
]
