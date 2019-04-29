import { reducer as formReducer } from 'redux-form'

import clothes from './cloth'
import checkout from './checkout'
import filters from './filters'

const rootReducer = { clothes, form: formReducer, checkout, filters }

export default rootReducer
