import React, {useState} from 'react'
import { StepBackwardOutlined, PlayCircleOutlined, StepForwardOutlined } from '@ant-design/icons'
import './index.css'
import PubSub from 'pubsub-js'
import axios from 'axios'
import {connect} from 'react-redux'

const mapStateToProps = (state) => {
    return state;
  }

function AudioBar(props) {
  //  要播放的歌曲信息在playingReducerState的playingMusic属性中（Reducer定义的state）
  const playingReducerState = props.playingReducer;
  const {playingMusic} = playingReducerState;
  const [state, setState] = useState({url: ''});

  const getMsg = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 2000
  });
  
  PubSub.subscribe('playsong', (msg, data) => {
    console.log('这里是从redux获取到的数据：', props);
    getMsg.get(`/check/music?id=${data}`).then((response) => {
      if (response.data.success) {
        //  音乐有版权，继续获取URL
        getMsg.get(`/song/url?id=${data}`).then((response) => {
          if (response.data.freeTrialInfo == null) {
            //  表示当前音乐不需要会员、登陆，可以直接播放
            setState({url: response.data.data[0].url});
            console.log('获取音乐成功，准备播放');
            
          }
        }, (error) => {
          console.log('获取音乐URL失败')
        })
      } else {
        //  音乐无版权，弹窗警告

      }
    }, (error) => {
      console.log('获取音乐可用状态失败')
    })
    

  })

  

  return (
    <div className='audio-background'>
      <a href="javascript:;">
        <StepBackwardOutlined className='audio-icon' />
      </a>
      <a href="javascript:;">
        <PlayCircleOutlined className='audio-icon' />
      </a>
      <a href="javascript:;">
        <StepForwardOutlined className='audio-icon' />
      </a>
      <audio controls src={playingMusic.url} autoPlay >
        <a href={playingMusic.url}></a>
      </audio>
      
    </div>
  )
}

export default connect(mapStateToProps)(AudioBar)
