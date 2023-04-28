import { createStore } from "redux";
import { combineReducers } from "redux";
import playingReducer from "./reducers/playing-reducer";
import userinfoReducer from "./reducers/userinfo-reducer";

const store = createStore(combineReducers({playingReducer, userinfoReducer}))

export default store