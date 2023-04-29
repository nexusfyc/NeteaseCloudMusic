import { type } from '@testing-library/user-event/dist/type'
import {GET_PLAYING_MUSIC, GET_HOT_LIST} from '../../assets/action-type'


export const getPlayingMusicAction  = (data)=>({    //把得到的数据放到Redux的store中
    type:GET_PLAYING_MUSIC,
    data
})

export const getHotListAction = (data) => ({
    type: GET_HOT_LIST,
    data
})