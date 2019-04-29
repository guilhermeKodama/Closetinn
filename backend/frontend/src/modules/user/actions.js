import {
  SET_TOKEN,
  GET_ME,
  UNSUBSCRIBE,
  UPDATE_USER
} from './constants'

import axios from '../../utils/axios'

export const clearUserError = () => ({
  type: 'CLEAR_USER_ERROR',
})

export const unsubscribe = payload => ({
  type: UNSUBSCRIBE.ACTION,
  payload
})

/**
 * GET ME
 */

export const getMe = payload => ({
  type: GET_ME.ACTION,
  payload
})

/**
 * SET TOKEN
 */

export const setToken = token => ({
  type: SET_TOKEN.ACTION,
  token
})

/**
 * SIGN IN
 */

export const signIn = () => ({
  type: 'SIGN_IN_REQUEST',
})

export const signInSuccess = payload => ({
  type: 'SIGN_IN_SUCCESS',
  payload,
})

export const signInFailure = error => ({
  type: 'SIGN_IN_FAILURE',
  error,
})

/**
 * SIGN IN FACEBOOK
 */

export const signInFacebook = response => ({
  type: 'SIGN_IN_FACEBOOK_REQUEST',
  response,
})

export const signInFacebookSuccess = payload => ({
  type: 'SIGN_IN_FACEBOOK_SUCCESS',
  payload
})

export const signInFacebookFailure = error => ({
  type: 'SIGN_IN_FACEBOOK_FAILURE',
  error,
})

/**
 * SIGNUP
 */

const signUpRequest = () => ({
  type: 'SIGNUP_REQUEST'
})

const signUpSuccess = payload => ({
  type: 'SIGNUP_SUCCESS',
  payload
})

const signUpFailure = error => ({
  type: 'SIGNUP_FAILURE',
  error: error.message
})

export const signUp = data => (
  (dispatch, getState) => {
    dispatch(signUpRequest())
    // const { anonymousId } = getState().user.data

    return axios('/users',
    {
        method: 'post',
        data: JSON.stringify({ ...data })
     }).then(response => {
       return dispatch(signUpSuccess(response.data))
     }).catch(error => {
       return dispatch(signUpFailure(error.message || 'Error during request.'))
     })
  }
)

/**
 * UPDATE
 */

 /**
  * SIGN IN
  */

 export const updateUser = payload => ({
   type: UPDATE_USER.ACTION,
   payload
 })

 export const updateUserSuccess = payload => ({
   type: UPDATE_USER.SUCCESS,
   payload,
 })

 export const updateUserFailure = error => ({
   type: UPDATE_USER.FAILED,
   error,
 })

export const logout = () => ({
  type: 'LOGOUT'
})
