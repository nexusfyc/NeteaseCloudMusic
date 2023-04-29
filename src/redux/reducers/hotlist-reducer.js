import {GET_HOT_LIST} from '../../assets/action-type'

const infoState = {
    //  存放十个热门歌单
    Lists: []
}

const hotlistReducer = (state = infoState, action) => {
    const {type, data} = action;
    switch (type) {
        case GET_HOT_LIST:
            console.log(data);
            return {
                Lists: data
            }
            break;
    
        default:
            return state;
    }
    
}

export default hotlistReducer