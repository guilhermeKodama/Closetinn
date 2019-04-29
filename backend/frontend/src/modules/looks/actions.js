import {
  UPDATE_LOOK,
  GET_LOOK,
  GET_LOOKS,
  CREATE_LOOK,
  GET_RECOMMENDATION_LOOKS,
  LIKE_LOOK,
  DISLIKE_LOOK,
} from './constants'

export const getLook = payload => ({
  type: GET_LOOK.ACTION,
  payload,
})

export const updateLook = payload => ({
  type: UPDATE_LOOK.ACTION,
  payload,
})

export const getLooks = payload => ({
  type: GET_LOOKS.ACTION,
  payload,
})

export const createLook = payload => ({
  type: CREATE_LOOK.ACTION,
  payload
})

export const getRecommendationLooks = payload => ({
  type: GET_RECOMMENDATION_LOOKS.ACTION,
  payload
})

export const likeLook = payload => ({
  type: LIKE_LOOK.ACTION,
  payload
})

export const dislikeLook = payload => ({
  type: DISLIKE_LOOK.ACTION,
  payload
})
