import cuid from 'cuid'
import TagManager from 'react-gtm-module'
import { setUser } from '../../utils/atena'

import {
  SET_TOKEN,
  GET_ME,
  UNSUBSCRIBE,
  UPDATE_USER
} from './constants'

import { loadState } from '../../localStorage'

const INITIAL_STATE = {
  data: loadState('userData') || {
    closet: [],
    cart: {
      products: [],
    },
    purchaseOrders: [],
    logged: false,
    anonymousId: cuid(),
    newsletter: '',
  },
  error: null,
}

const user = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case '@@INIT':
      if (state.data._id) {
        TagManager.dataLayer({ dataLayer: { 'userId': state.data._id } })
        setUser(state.data._id)
      }
      return state
    case UPDATE_USER.SUCCESS:
      return {
        data: {
          ...state.data,
          ...action.payload.data,
        }
      }
    case 'CLEAR_USER_ERROR':
      return {
        data: {
          ...state.data,
        },
        error: null,
      }
    case SET_TOKEN.SUCCESS:
      return {
        data: {
          ...state.data,
          ...action.payload,
        },
        error: null,
      }
    case 'LOGOUT':
      return {
        data: {
          closet: [],
          cart: {
            products: [],
          },
          logged: false,
          anonymousId: state.data.anonymousId,
        },
        error: null,
      }
    case UNSUBSCRIBE.SUCCESS:
      return {
        data: {
          ...state.data,
          ...action.payload.data,
        },
        error: null,
      }
    case UNSUBSCRIBE.FAILED:
      return {
        error: action.error,
      }
    case GET_ME.SUCCESS:
      TagManager.dataLayer({ dataLayer: { 'userId': action.payload._id } })
      setUser(action.payload._id)
      return {
        data: {
          ...state.data,
          ...action.payload,
          logged: true,
        },
        error: null,
      }
    case GET_ME.FAILED:
      return {
        data: {
          ...state.data,
          logged: false,
        },
        error: action.error,
      }
    case 'SIGN_IN_SUCCESS':
      TagManager.dataLayer({ dataLayer: { 'userId': action.payload._id } })
      setUser(action.payload._id)
      return {
        data: {
          ...state.data,
          ...action.payload,
          logged: true,
        },
        error: null,
      }
    case 'SIGN_IN_FAILURE':
      return {
        data: {
          ...state.data,
          logged: false,
        },
        error: action.error,
      }
    case 'SIGN_IN_FACEBOOK_SUCCESS':
      TagManager.dataLayer({ dataLayer: { 'userId': action.payload._id } })
      setUser(action.payload._id)
      return {
        data: {
          ...state.data,
          ...action.payload,
          logged: true,
        },
        error: null,
      }
    case 'SIGN_IN_FACEBOOK_FAILURE':
      return {
        data: {
          ...state.data,
          logged: false
        },
        error: action.error,
      }
    case 'SIGNUP_SUCCESS':
      return {
        data: {
          ...state.data,
          ...action.payload,
          logged: true,
        },
        error: null,
      }
    case 'SIGNUP_FAILURE':
      return {
        data: {
          ...state.data,
          logged: false
        },
        error: action.error,
      }
    case 'USER_UPDATE_SUCCESS':
      return {
        data: {
          ...state.data,
          ...action.payload
        },
        error: null,
      }
    case 'USER_UPDATE_FAILURE':
      return {
        data: {
          ...state.data,
        },
        error: action.error,
      }
    /**
      FORGOT PASSWORD
    */
    case 'REQUEST_FORGOT_PASSWORD':
      return {
        data: {
          ...state.data,
          sendForgotPasswordEmail: false,
        },
        error: null,
      }
    case 'RECEIVE_FORGOT_PASSWORD':
      return {
        data: {
          ...state.data,
          sendForgotPasswordEmail: true,
        },
        error: null,
      }
    case 'REQUEST_FORGOT_PASSWORD_FAILED':
      return {
        data: {
          ...state.data,
          sendForgotPasswordEmail: false,
        },
        error: action.error,
      }

    /**
      IS FORGOT PASSWORD TOKEN VALID
    */
    case 'REQUEST_IS_FORGOT_PASSWORD_TOKEN_VALID':
      return {
        data: {
          ...state.data,
          resetPasswordTokenIsValid: false,
        },
        error: null,
      }
    case 'RECEIVE_IS_FORGOT_PASSWORD_TOKEN_VALID':
      return {
        data: {
          ...state.data,
          resetPasswordTokenIsValid: true,
          emailValidResetPasswordToken: action.email,
        },
        error: null,
      }
    case 'REQUEST_IS_FORGOT_PASSWORD_TOKEN_VALID_FAILED':
      return {
        data: {
          ...state.data,
          resetPasswordTokenIsValid: false,
        },
        error: action.error,
      }

    /**
      RESET PASSWORD
    */
    case 'REQUEST_RESET_PASSWORD':
      return {
        data: {
          ...state.data,
          resetPasswordSuccess: false,
        },
        error: null,
      }
    case 'RECEIVE_RESET_PASSWORD':
      return {
        data: {
          ...state.data,
          resetPasswordSuccess: true,
        },
        error:null
      }
    case 'REQUEST_RESET_PASSWORD_FAILED':
      return {
        data: {
          ...state.data,
          resetPasswordTokenIsValid: false,
        },
        error: action.error,
      }

    /**
      Closet
    */
    case 'GET_CLOSET_SUCCESS':
      return {
        data: {
          ...state.data,
          closet: action.closet || [],
        },
        error: null,
      }
    case 'GET_CLOSET_FAILURE':
      return {
        data: {
          ...state.data,
          closet: [],
        },
        error: action.error,
      }
    case 'GET_CLOSET_CLOTHES_SUCCESS':
      const folderId = action.folderId
      const clothes = action.clothes
      const newCloset = state.closet.map(folder => {
        if (folder._id === folderId) {
          return folder.products = clothes
        }
        return folder
      })
      return {
        data: {
          ...state.data,
          closet: newCloset,
        },
        error: null,
      }
    case 'GET_CLOSET_CLOTHES_FAILURE':
      return {
        data: {
          ...state.data,
          closet: [],
        },
        error: action.error,
      }
    case 'ADD_PRODUCT_TO_CLOSET_FOLDER_SUCCESS':
      return {
        data: {
          ...state.data,
          closet: action.closet || [],
        },
        error: null,
      }
    case 'ADD_PRODUCT_TO_CLOSET_FOLDER_FAILURE':
      return {
        data: {
          ...state.data,
          closet: [],
        },
        error: action.error,
      }
    case 'REMOVE_PRODUCT_FROM_CLOSET_FOLDER_SUCCESS':
      return {
        data: {
          ...state.data,
          closet: action.closet || [],
        },
        error: null,
      }
    case 'REMOVE_PRODUCT_FROM_CLOSET_FOLDER_FAILURE':
      return {
        data: {
          ...state.data,
          closet: [],
        },
        error: action.error,
      }
    case 'CLOSET_CREATE_FOLDER_SUCCESS':
      return {
        data: {
          ...state.data,
          closet: action.closet,
        },
        error: null,
      }
    case 'CLOSET_CREATE_FOLDER_FAILURE':
      return {
        data: {
          ...state.data,
          closet: [],
        },
        error: action.error,
      }
    case 'CLOSET_EDIT_FOLDER_SUCCESS':
      return {
        data: {
          ...state.data,
          closet: action.closet,
        },
        error: null,
      }
    case 'CLOSET_EDIT_FOLDER_FAILURE':
      return {
        data: {
          ...state.data,
          closet: [],
        },
        error: action.error,
      }
    case 'CLOSET_REMOVE_FOLDER_SUCCESS':
      return {
        data: {
          ...state.data,
          closet: action.closet,
        },
        error: null,
      }
    case 'CLOSET_REMOVE_FOLDER_FAILURE':
      return {
        data: {
          ...state.data,
          closet: [],
        },
        error: action.error,
      }

    /**
      Cart
    */
    case 'GET_CART_SUCCESS':
      return {
        data: {
          ...state.data,
          cart: {
            ...action.payload,
          },
        },
        error: null,
      }
    case 'GET_CART_FAILURE':
      return {
        data: {
          ...state.data,
        },
        error: action.error,
      }
    case 'UPDATE_CART_CLOTH_SUCCESS':
      return {
        data: {
          ...state.data,
          cart: {
            ...action.payload,
          },
        },
        error: null,
      }
    case 'UPDATE_CART_CLOTH_FAILURE':
      return {
        data: {
          ...state.data,
        },
        error: action.error,
      }
    case 'ADD_CLOTH_TO_CART_SUCCESS':
      return {
        data: {
          ...state.data,
          cart: {
            ...action.payload,
          },
        },
        error: null,
      }
    case 'ADD_CLOTH_TO_CART_FAILURE':
      return {
        data: {
          ...state.data,
        },
        error: action.error,
      }
    case 'REMOVE_CLOTH_FROM_CART_SUCCESS':
      return {
        data: {
          ...state.data,
          cart: {
            ...action.payload,
          },
        },
        error: null,
      }
    case 'REMOVE_CLOTH_FROM_CART_FAILURE':
      return {
        data: {
          ...state.data,
        },
        error: action.error,
      }
    case 'CREATE_CART_SUCCESS':
      return {
        data: {
          ...state.data,
          cart: {
            ...action.payload,
          },
        },
        error: null,
      }
    case 'CREATE_CART_FAILURE':
      return {
        data: {
          ...state.data,
        },
        error: action.error,
      }

    /**
      PURCHASE ORDERS
    */
    case 'GET_PURCHASE_ORDERS_SUCCESS':
      return {
        data: {
          ...state.data,
          purchaseOrders: action.payload.purchaseOrders || [],
        },
        error: null,
      }
    case 'GET_PURCHASE_ORDERS_FAILURE':
      return {
        data: {
          ...state.data,
          purchaseOrders: [],
        },
        error: action.error,
      }
    case 'CANCEL_PURCHASE_ORDER_SUCCESS':
      const newPOs = state.data.purchaseOrders.map(po => {
        if (po._id === action.payload._id) return action.payload
        return po
      })

      return {
        data: {
          ...state.data,
          purchaseOrders: newPOs,
        },
        error: null,
      }
    case 'CANCEL_PURCHASE_ORDER_FAILURE':
      return {
        data: {
          ...state.data,
        },
        error: action.error
      }
    case 'UPDATE_CART_SUCCESS':
      return {
        data: {
          ...state.data,
          cart: {
            ...action.payload,
          },
        },
        error: null,
      }
    case 'UPDATE_CART_FAILURE':
      return {
        data: {
          ...state.data,
        },
        error: action.error,
      }
    case 'SUBSCRIBE_NEWSLETTER_SUCCESS':
      return {
        data: {
          ...state.data,
          newsletter: action.payload._id,
        },
        error: null,
      }
    case 'SUBSCRIBE_NEWSLETTER_FAILURE':
      return {
        data: {
          ...state.data,
        },
        error: action.error,
      }
    case 'UNSUBSCRIBE_NEWSLETTER_SUCCESS':
      const { newsletter, ...rest } = state.data
      return {
        data: {
          ...rest
        },
        error: null,
      }
    case 'UNSUBSCRIBE_NEWSLETTER_FAILURE':
      return {
        data: {
          ...state.data,
        },
        error: action.error,
      }
    default:
      return state
  }
}

export default user
