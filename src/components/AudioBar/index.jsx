import React, { useEffect, useRef, useState } from 'react'
import { StepBackwardOutlined, PlayCircleOutlined, StepForwardOutlined, PauseCircleOutlined } from '@ant-design/icons'
import { SmileOutlined } from '@ant-design/icons';
import './index.css'
import PubSub from 'pubsub-js'
import axios from 'axios'
import { connect } from 'react-redux'
import { Slider, Switch, notification } from 'antd';
import { timeTransfer } from '../../utils/audio';

//  右上角信息提示框
const openNotification = () => {
  notification.open({
    message: 'Notification Title',
    description:
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    icon: (
      <SmileOutlined
        style={{
          color: '#108ee9',
        }}
      />
    ),
  });
};

const mapStateToProps = (state) => {
  return state;
}




function AudioBar(props) {

  //  进度条基本控制
  const [disabled, setDisabled] = useState(false);
  const onChange = (checked) => {
    setDisabled(checked);
  };

  //  时间调整
  const [currentTime, setCurrentTime] = useState(0);
  //  单曲播放进度保存
  const [progress, setProgress] = useState(0);
  function handleTimeUpdate() {
    const currentTime = audio.current.currentTime;
    const progress = ((currentTime * 1000) / playingInfo.dt) * 100;
    setProgress(progress);
    setCurrentTime(timeTransfer(Math.floor(progress * 1000)))
  }

  //  歌曲详情
  const [playingInfo, setPlayingInfo] = useState({
    name: '--',
    al: {picUrl: ' '},
    ar: [{name: '--'}],
    dt: 0
  })

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
    audio.current.src = props.playingReducer.playingMusic.url;
    //  获取音乐版权有无
    const songState = props.playingReducer.playingMusic.success;
    console.log('这里是redux中的信息：', props.playingReducer.playingMusic);
    console.log('这里是歌曲的版权状态:', songState);
    console.log('这里已经获取到了redux中的数据:', audio.current.src);
    const audioElement = document.querySelector('.audio-element');
    audioElement.querySelector('a').src = props.playingReducer.playingMusic.url;
    const audioEl = document.querySelector('.audio-element');
    //  获取歌曲详细信息
    // const musicInfo = getMusicInfo(msg);
    // console.log('这里是歌曲的详细信息:', musicInfo);
    getMsg.get(`/song/detail?ids=${data}`).then((res) => { 
        console.log('获取到了单曲详情：', res.data)
        setPlayingInfo(res.data.songs[0])
     }).catch((error) => { console.log('获取歌曲详情时出错：', error) })
    const photoEl = document.querySelector('.music-photo');
    photoEl.style.backgroundImage = `url(${playingInfo.al.picUrl})`;
    photoEl.style.backgroundSize = '35px 35px';
     
    audioEl.play();
    const playBtnEl = document.querySelector('.play-btn')
    playBtnEl.style.backgroundPosition = '0px -164px';
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
  const changePlay = function (e) {
    const audioEl = document.querySelector('.audio-element');
    //  暂停与否
    const playState = audioEl.paused;
    //  redux中没有歌曲时不允许切换状态
    if (audio.current.src === undefined) {
      console.log('redux中暂无歌曲数据');
      return;
    } else {
      if(!playState) {
        audioEl.pause();
        //  暂停状态（显示播放键）
        e.target.style.backgroundPosition = '0px -203px'
        return ;
      }
      audioEl.play();
      //  播放状态（显示暂停键）
      e.target.style.backgroundPosition = '0px -164px'
      const nowPosition = getComputedStyle(e.target)
      console.log(nowPosition.backgroundPosition);
    }


  }



  return (
    <div className='audio-background'>
      <div className='control-area'>
        <a href="javascript:;">
          <StepBackwardOutlined className='audio-icon' />
        </a>
        <a href="javascript:;" >
          <div className='play-btn' onClick={changePlay}></div>
        </a>
        <a href="javascript:;">
          <StepForwardOutlined className='audio-icon' />
        </a>
      </div>

      <div className='play-area'>
        <div className='music-photo'></div>

        <div className='music-info'>
          <p style={{ 'color': 'white' }}>{playingInfo.name} {playingInfo.ar[0].name}</p>
          <Slider step={0.2} defaultValue={30} disabled={disabled} className='player-bar' value={progress} />
        </div>
        <div className='player-time' style={{ 'color': 'white' }}>{currentTime}/{timeTransfer(Math.floor(playingInfo.dt / 1000)) }</div>
      </div>
      <div className='function-area'>
        <a href="javascript:;"><div className='lyrics'></div></a>
        <a href="javascript:;"><div className='collect'></div></a>
        <a href="javascript:;"><div className='share'></div></a>
        <a href="javascript:;"><div className='volumn'></div></a>
        <a href="javascript:;"><div className='player-mode'></div></a>
        <a href="javascript:;"><div className='player-list'></div></a>
      </div>

      <audio ref={audio} className='audio-element' onTimeUpdate={handleTimeUpdate} >
        <a href=""></a>
      </audio>

    </div>
  )
}

export default connect(mapStateToProps)(AudioBar)
