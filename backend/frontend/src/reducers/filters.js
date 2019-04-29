const INITIAL_STATE = {
  data: {
    filters: [],
    selectedFilters: {},
  },
  error: null,
}

const products = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case 'GET_FILTERS_SUCCESS':
      return {
        data: {
          ...state.data,
          filters: action.payload.filters,
        },
        error: null,
      }
    case 'GET_FILTERS_FAILURE':
      return {
        data: {
          ...state.data,
        },
        error: action.error,
      }
    case 'SET_FILTER':
      const hasKey = action.payload.filter in state.data.selectedFilters

      if (hasKey) {
        return {
          data: {
            ...state.data,
            selectedFilters: {
              ...state.data.selectedFilters,
              [action.payload.filter]: [
                ...state.data.selectedFilters[action.payload.filter],
                action.payload.option,
              ],
            },
          },
          error: null,
        }
      } else {
        return {
          data: {
            ...state.data,
            selectedFilters: {
              ...state.data.selectedFilters,
              [action.payload.filter]: [action.payload.option],
            }
          },
          error: null,
        }
      }
    case 'SET_FILTER_PRICE':
      return {
        data: {
          ...state.data,
          selectedFilters: {
            ...state.data.selectedFilters,
            ...action.payload.option,
          }
        },
        error: null,
      }
    case 'REMOVE_FILTER':
      const newSelectedFilters = { ...state.data.selectedFilters }
      const newFilter = newSelectedFilters[action.payload.filter].filter(option => option !== action.payload.option)

      if (newFilter.length === 0) {
        delete newSelectedFilters[action.payload.filter]
      } else {
        newSelectedFilters[action.payload.filter] = newFilter
      }

      return {
        data: {
          ...state.data,
          selectedFilters: {
            ...newSelectedFilters
          }
        },
        error: null,
      }
    case 'CLEAR_FILTER':
      return {
        data: {
          ...state.data,
          selectedFilters: [],
        },
        error: null,
      }
    default:
      return state
  }
}

export default products
