import { GET_RECOMMENDATION_PROMOTIONS } from './constants'

export const getRecommendationPromotions = payload => ({
  type: GET_RECOMMENDATION_PROMOTIONS.ACTION,
  payload,
})