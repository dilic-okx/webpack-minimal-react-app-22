import { combineReducers } from 'redux'
import common from './common/reducers'
import profile from './profile/reducers'

export default combineReducers({
	common,
	profile
})
