import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import signupReducer from './signupReducer';
import searchReducer from './communitySearchReducer';

export default combineReducers({
    login: loginReducer,
    signup: signupReducer,
    search: searchReducer
});

// const rootReducer = (state, action) => {
//   if (action.type === 'USER_LOGOUT') {
//     state = undefined
//   }

//   return appReducer(state, action)
// }