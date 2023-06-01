import { createStore } from "redux";
import { combineReducers } from "redux";
import playingReducer from "./reducers/playing-reducer";
import userinfoReducer from "./reducers/userinfo-reducer";
import hotlistReducer from "./reducers/hotlist-reducer";

import {composeWithDevTools} from 'redux-devtools-extension'

const store = createStore(combineReducers({
    playingReducer, 
    userinfoReducer,
    hotlistReducer
}), composeWithDevTools())

export default store