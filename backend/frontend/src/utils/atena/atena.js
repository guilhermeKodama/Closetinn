import axios from './axios'
import util from 'util'

const logPrefix = 'ATENA_LOG -> '

let user: ''

export function pageView(url) {
  try {
    if (!user) return
    const payload = { user, url }
    axios.post('/analytics/pageView', payload)
    .then((response) => {
      console.log(`${logPrefix} ${util.inspect(response.data, false, null, true)}`)
    })
    .catch((e) =>  {
      console.log(`${logPrefix} error: ${e}`)
    })
  } catch (e) {
    console.log(e)
  }
}

export const setUser = userId => {
  user = userId
}

export const EVENT = {
  PRODUCT_CLICK: 'PRODUCT_CLICK',
  LOOK_CLICK: 'LOOK_CLICK',
  EMAIL_LOOK_RECOMMENDATION_CLICK: 'EMAIL_LOOK_RECOMMENDATION_CLICK',
  EMAIL_PROMOTION_RECOMMENDATION_CLICK: 'EMAIL_PROMOTION_RECOMMENDATION_CLICK',
  EMAIL_UNSUBSCRIBE_CLICK: 'EMAIL_UNSUBSCRIBE_CLICK',
  UNSUBSCRIBE_CLICK: 'UNSUBSCRIBE_CLICK',
  PRODUCT_LIKE: 'PRODUCT_LIKE',
  PRODUCT_DISLIKE: 'PRODUCT_DISLIKE',
  LOOK_LIKE: 'LOOK_LIKE',
  LOOK_DISLIKE: 'LOOK_DISLIKE'
}

 /**
 * HOW TO IMPORT
 * import { click, EVENT } from './utils/atena/'
 * HOW TO USE
 * click('5ad651c16ed33100197d4cc6', null, '5bae35ecaa8f2b152f447959', EVENT.LOOK_CLICK)
 * @param  {[type]} user    [description]
 * @param  {[type]} product [description]
 * @param  {[type]} look    [description]
 * @param  {[type]} event   [description]
 * @return {[type]}         [description]
 */
export function click(user, product, look, event, url) {
  if (!(event in EVENT)) return false
  axios.post('/analytics/clicks', {
    user,
    product,
    look,
    event,
    url
  })
  .then((response) => {
    console.log(`${logPrefix} ${util.inspect(response.data, false, null, true)}`)
  })
  .catch((e) =>  {
    console.log(`${logPrefix} error: ${e}`)
  })
}
