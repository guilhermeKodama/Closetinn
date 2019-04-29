import * as actionCreators from './actionCreators'
import * as cloth from './cloth'
import * as closet from './closet'
import * as cart from './cart'
import * as purchaseOrder from './purchaseOrder'
import * as filters from './filters'
import * as newsletter from './newsletter'

const rootActions = {
  ...actionCreators,
  ...closet,
  ...cloth,
  ...cart,
  ...purchaseOrder,
  ...filters,
  ...newsletter,
}

export default rootActions
