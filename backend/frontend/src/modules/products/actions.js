import {
  LIKE_PRODUCT,
  DISLIKE_PRODUCT,
} from './constants'

export const likeProduct = payload => ({
  type: LIKE_PRODUCT.ACTION,
  payload
})

export const dislikeProduct = payload => ({
  type: DISLIKE_PRODUCT.ACTION,
  payload
})
