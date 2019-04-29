import thunk from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'
import { createStore, compose, applyMiddleware, combineReducers} from 'redux'

//Modules setup
import { rootReducer as modulesReducers, rootSaga}  from './modules'

import rootReducer from './reducers/index'
import mySaga from './sagas/index'
import axios from './utils/axios'
import { saveState } from './localStorage'

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  combineReducers({ ...rootReducer , ...modulesReducers }),
  composeEnhancers(applyMiddleware(thunk, sagaMiddleware))
)

store.subscribe(() => {
  saveState('userData', store.getState().user.data)

  const { data } = store.getState().user
  if (data && data.token) axios.defaults.headers.common['Authorization'] = data.token

  saveState('categories', store.getState().clothes.data.categories)
})

if(module.hot) {
  module.hot.accept('./reducers/', () => {
    const nextRootReducer = require('./reducers/index').default
    store.replaceReducer(nextRootReducer)
  })
}

// then run the saga
sagaMiddleware.run(mySaga)
sagaMiddleware.run(rootSaga)

export default store
