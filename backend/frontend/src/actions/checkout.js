import cep from 'cep-promise'

/**
 * GET ADDRESS BY ZIP CODE
 */

const getAddressByPostcodeRequest = () => ({
 type: 'GET_ADDRESS_BY_POSTCODE_REQUEST'
})

const getAddressByPostcodeSuccess = payload => ({
 type: 'GET_ADDRESS_BY_POSTCODE_SUCCESS',
 payload,
})

const getAddressByPostcodeFailure = error => ({
 type: 'GET_ADDRESS_BY_POSTCODE_FAILURE',
 error: error.message
})

export const getAddressByPostcode = postcode => (
  dispatch => {
    dispatch(getAddressByPostcodeRequest())

    return cep(postcode)
    .then(payload => {
      return dispatch(getAddressByPostcodeSuccess(payload))
    })
    .catch(error => {
      return dispatch(getAddressByPostcodeFailure(error))
    })
  }
)
