import { createSagaAction } from '../../utils/sagas'

// Constants
export const constants = {
  SEARCH: createSagaAction('SEARCH'),
  CLEAN_SEARCH: createSagaAction('CLEAN_SEARCH'),
}

// Action Creators
export const actions = {
  search: (query, offset, currentPage) => ({
    type: constants.SEARCH.ACTION,
    query,
    offset,
    currentPage
  }),
  cleanSearch: () => ({
    type: constants.CLEAN_SEARCH.ACTION
  })
}
