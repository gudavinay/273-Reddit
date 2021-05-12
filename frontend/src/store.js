import { createStore, applyMiddleware, compose } from 'redux';
import {logger} from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from './reduxOps/reduxReducers';

const initialState = {};

const middleware = [thunk];

if (process.env.NODE_ENV === `development`) {
    middleware.push(logger);
}

const store = createStore(
    rootReducer,
    initialState,
    compose(
        applyMiddleware(...middleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
    ));

export default store;