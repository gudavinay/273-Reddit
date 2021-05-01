import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import signupReducer from './signupReducer';
import communitySearchReducer from './communitySearchReducer';

export default combineReducers({
    login: loginReducer,
    signup: signupReducer,
    communitySearch: communitySearchReducer
});

// const rootReducer = (state, action) => {
//   if (action.type === 'USER_LOGOUT') {
//     state = undefined
//   }

//   return appReducer(state, action)
// }