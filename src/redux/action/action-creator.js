import {GET_PLAYING_MUSIC} from '../../assets/action-type'


export const getPlayingMusicAction  = (data)=>({    //把得到的数据放到Redux的store中
    type:GET_PLAYING_MUSIC,
    data
})