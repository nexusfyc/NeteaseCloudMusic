import { createStore } from "redux";
import { combineReducers } from "redux";
import playingReducer from "./reducers/playing-reducer";
import userinfoReducer from "./reducers/userinfo-reducer";
import hotlistReducer from "./reducers/hotlist-reducer";

const store = createStore(combineReducers({
    playingReducer, 
    userinfoReducer,
    hotlistReducer
}))

export default store