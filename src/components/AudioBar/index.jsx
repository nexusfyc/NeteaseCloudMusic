import React, { useEffect, useState } from 'react'
import { StepBackwardOutlined, PlayCircleOutlined, StepForwardOutlined, PauseCircleOutlined } from '@ant-design/icons'
import './index.css'
import PubSub from 'pubsub-js'
import axios from 'axios'
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
  return state;
}

function AudioBar(props) {
  //  要播放的歌曲信息在playingReducerState的playingMusic属性中（Reducer定义的state）
  const playingReducerState = props.playingReducer;
  const { playingMusic } = playingReducerState;
  const [state, setState] = useState({ url: '' });

  const getMsg = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 2000
  });

  const audio = React.useRef();

  PubSub.subscribe('playsong', (msg, data) => {
    console.log(audio);
    audio.current.src = props.playingReducer.playingMusic.url;
    const audioElement = document.querySelector('.audio-element');
    audioElement.querySelector('a').src = props.playingReducer.playingMusic.url;
    // getMsg.get(`/check/music?id=${data}`).then((response) => {
    //   if (response.data.success) {
    //     //  音乐有版权，继续获取URL
    //     getMsg.get(`/song/url?id=${data}`).then((response) => {
    //       if (response.data.freeTrialInfo == null) {
    //         //  表示当前音乐不需要会员、登陆，可以直接播放
    //         setState({url: response.data.data[0].url});
    //         console.log('获取音乐成功，准备播放');

    //       }
    //     }, (error) => {
    //       console.log('获取音乐URL失败')
    //     })
    //   } else {
    //     //  音乐无版权，弹窗警告

    //   }
    // }, (error) => {
    //   console.log('获取音乐可用状态失败')
    // })


  })

  //  进度条拖拽响应
  const showInfo = function () {
    const value = document.getElementById('range-bar').value;
    console.log(value);
  }

  //  播放点击切换
  const changePlay = function () {

  }



  return (
    <div className='audio-background'>
      <div className='control-area'>
        <a href="javascript:;">
          <StepBackwardOutlined className='audio-icon' />
        </a>
        <a href="javascript:;" onClick={changePlay}>
          <PauseCircleOutlined className='audio-icon' />
        </a>
        <a href="javascript:;">
          <StepForwardOutlined className='audio-icon' />
        </a>
      </div>

      <div className='play-area'>
        <div className='music-photo'></div>

        <div className='music-info'>
          <p>12</p>
          <input id='range-bar' type="range" className='play-bar' min={0} max={10} step={0.25} onInput={showInfo} />
        </div>



      </div>

      <audio controls autoPlay ref={audio} className='audio-element'>
        <a href=""></a>
      </audio>

    </div>
  )
}

export default connect(mapStateToProps)(AudioBar)
