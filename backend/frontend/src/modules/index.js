import { all, fork } from 'redux-saga/effects'

// do your import magic here
// reducers
import appReducer from './app/reducers'
import userReducer from './user/reducers'
import searchReducer from './search/reducers'
import looksReducer from './looks/reducers'
import promotionsReducer from './promotions/reducers'
import entitiesReducer from './entities/reducers'
import productsReducer from  './products/reducers'

// sagas
import userSagas from './user/sagas'
import searchSagas from './search/sagas'
import looksSagas from './looks/sagas'
import productsSagas from './products/sagas'
import promotionsSagas from './promotions/sagas'

/* Reducers */
export const rootReducer = {
  app: appReducer,
  user: userReducer,
  search: searchReducer,
  looks: looksReducer,
  promotions: promotionsReducer,
  entities: entitiesReducer,
  products: productsReducer
}

/* Sagas */
export function* rootSaga() {
  yield all([
    fork(userSagas),
    fork(searchSagas),
    fork(looksSagas),
    fork(productsSagas),
    fork(promotionsSagas),
  ])
}
