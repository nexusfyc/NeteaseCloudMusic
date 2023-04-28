import {GET_PLAYING_MUSIC} from '../../assets/action-type'

const musicState = {
    playingMusic: {}
}

const playingReducer = (state = musicState, action) => {
    
    const {type, data} = action;
    switch (type) {
        case GET_PLAYING_MUSIC:
            return {
                playingMusic: data
            }
    
        default:
            break;
    }
    return state
}

export default playingReducer