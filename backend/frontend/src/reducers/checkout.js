const INITIAL_STATE = {
  data: {
    address: {},
  },
  error: null,
}

const checkout = (state = INITIAL_STATE, action) => {
  switch(action.type){
    case 'GET_ADDRESS_BY_POSTCODE_SUCCESS':
      const { cep, ...rest } = action.payload

      return {
        data: {
          ...state.data,
          address: {
            postcode: cep,
            ...rest,
          },
        },
        error: null,
      }
    case 'GET_ADDRESS_BY_POSTCODE_FAILURE':
      return {
        data: {
          ...state.data,
        },
        error: action.error,
      }
    default: return state
  }
}

export default checkout
