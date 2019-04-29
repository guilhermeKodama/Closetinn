/**
 *  SUBSCRIBE
 */

export const subscribeNewsletter = email => ({
  type: 'SUBSCRIBE_NEWSLETTER_REQUEST',
  email,
})

export const subscribeNewsletterSuccess = payload => ({
  type: 'SUBSCRIBE_NEWSLETTER_SUCCESS',
  payload,
})

export const subscribeNewsletterFailure = error => ({
  type: 'SUBSCRIBE_NEWSLETTER_FAILURE',
  error,
})

/**
 *  UNSUBSCRIBE
 */

export const unsubscribe = newletterId => ({
  type: 'SUBSCRIBE_NEWSLETTER_REQUEST',
  newletterId,
})

export const unsubscribeNewsletterSuccess = payload => ({
  type: 'UNSUBSCRIBE_NEWSLETTER_SUCCESS',
  payload,
})

export const unsubscribeNewsletterFailure = error => ({
  type: 'UNSUBSCRIBE_NEWSLETTER_FAILURE',
  error,
})
