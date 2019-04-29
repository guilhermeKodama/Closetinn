import React from 'react'
import { Router, Switch } from 'react-router'
import createHistory from 'history/createBrowserHistory'

import withTracker from '../utils/withTracker'

import AdminLooksView from '../views/Admin/LooksView'
import UpsertLookView from '../views/Admin/UpsertLookView'

import SignInView from '../views/User/SignInView'
import LooksView from '../views/User/LooksView'
import RecommendationsLooksView from '../views/User/LooksRecommendationsView'
import RecommendationsPromotionsView from '../views/User/ProductsPromotionsRecommedationView'
import UnsubscribeView from '../views/User/UnsubscribeView'
import MyAccountView from '../views/User/MyAccountView'

import NotFoundView from '../views/NotFoundView'

import PublicRoute from './PublicRoute'
import PrivateRoute from './PrivateRoute'
import AdminRoute from './AdminRoute'

export const history = createHistory()

const AppRouter = () => (
  <Router history={history}>
    <Switch>
      <AdminRoute exact path='/admin/looks' component={AdminLooksView} />
      <AdminRoute path='/admin/looks/create' component={UpsertLookView} />
      <AdminRoute path='/admin/looks/:lookId' component={UpsertLookView} />
      <PrivateRoute path='/profile' component={withTracker(MyAccountView)}/>
      <PublicRoute path='/signin' component={SignInView}/>
      <PrivateRoute path='/looks' component={withTracker(LooksView)}/>
      <PublicRoute path='/recommendations/:recommendationId/looks' component={withTracker(RecommendationsLooksView)}/>
      <PublicRoute path='/recommendations/:recommendationId/promotions' component={withTracker(RecommendationsPromotionsView)}/>
      <PublicRoute path='/unsubscribe' component={withTracker(UnsubscribeView)}/>
      <PublicRoute component={NotFoundView}/>
    </Switch>
  </Router>
)

export default AppRouter
