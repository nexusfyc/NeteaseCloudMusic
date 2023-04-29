import React, { useState, Fragment } from 'react'
import MyCarousel from '../../../service/MyCarousel';
import './index.css'
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import PubSub from 'pubsub-js';
import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Menu } from 'antd';
import axios from 'axios';
import { useMount, useSetState, useUpdateEffect } from 'ahooks';
import { connect } from 'react-redux';
import { getHotListAction } from '../../../redux/action/action-creator'


const items = [
  {
    label: (
      <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
        热门推荐
      </a>
    ),
    key: 'hot',
  },
  {
    label: (
      <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
        华语
      </a>
    ),
    key: 'chinese',
  },
  {
    label: (
      <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
        流行
      </a>
    ),
    key: 'fashion',
  },
  {
    label: (
      <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
        摇滚
      </a>
    ),
    key: 'rock',
  },
  {
    label: (
      <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
        民谣
      </a>
    ),
    key: 'rhyme',
  },
  {
    label: (
      <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
        电子
      </a>
    ),
    key: 'electronic',
  },
  {
    label: (
      <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
        更多
      </a>
    ),
    key: 'electronic',
  }
];


function Recommend(props) {
  const { setInfoToRedux, hotlistReducer } = props;

  const wyyService = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 2000
  });

  wyyService.interceptors.response.use((response) => {
    return response.data.playlists
  })

  const [size, setSize] = useState('large');

  const [current, setCurrent] = useState('mail');
  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };



  async function getInfo(url) {
    // let info = await wyyService.get(url);
    let info = await wyyService.get(url);
    const action = getHotListAction(info);
    setInfoToRedux(action);
  }

  //  组件挂载时执行，获取当前页面所有所需信息
  useMount((params) => {
    console.log('组件挂载');
    getInfo('/top/playlist?limit=10&order=hot');
    console.log(props);
    const list = document.querySelector('.hot-recommend').getElementsByTagName('div');
    console.log(list);
    for (let index = 0; index < list.length; index++) {
      list[index].style.backgroundImage = `url(${hotlistReducer.Lists[index].coverImgUrl})`;
      list[index].style.backgroundSize = '140px';
      list[index].style.backgroundRepeat = 'no-repeat';
      list[index].style.fontSize = '12px';
      list[index].style.textAlign = 'left';
      list[index].querySelector('span').style.position = 'relative';
      list[index].querySelector('span').style.top = '155px';

    }
  })


  function toPrevious() {
    PubSub.publish('toPrevious');
    // console.log(state);
  }


  function toNext() {
    PubSub.publish('toNext');
    // console.log(state);
  }

  return (
    <div className='carousel'>

      <div className='carousel-content'>

        <a className='left-arrow' href='javascript:;' onClick={toPrevious}>
          <LeftOutlined className='left' />
        </a>
        <div className='mycarousel'>
          <MyCarousel />
        </div>
        <div className='login-area'>
          <Button className="downloadapp" type="primary" shape="round" icon={<DownloadOutlined />} size={size}>
            下载客户端
          </Button>
        </div>
        <a className='right-arrow' href='javascript:;' onClick={toNext}>
          <RightOutlined className='right' />
        </a>


      </div>

      <div className='g-wrap'>
        <div className='left'>
          <Menu className='left-menu' onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
          <div className='hot-recommend'>
            <div><a href=""><span>{hotlistReducer.Lists[0].name}</span></a></div>
            <div><a href=""><span>{hotlistReducer.Lists[1].name}</span></a></div>
            <div><a href=""><span>{hotlistReducer.Lists[2].name}</span></a></div>
            <div><a href=""><span>{hotlistReducer.Lists[3].name}</span></a></div>
            <div><a href=""><span>{hotlistReducer.Lists[4].name}</span></a></div>
            <div><a href=""><span>{hotlistReducer.Lists[5].name}</span></a></div>
            <div><a href=""><span>{hotlistReducer.Lists[6].name}</span></a></div>
            <div><a href=""><span>{hotlistReducer.Lists[7].name}</span></a></div>
            <div><a href=""><span>{hotlistReducer.Lists[8].name}</span></a></div>
            <div><a href=""><span>{hotlistReducer.Lists[9].name}</span></a></div>
            
          </div>
        </div>
        <div className='right'>

        </div>
      </div>

    </div>
  )
}

export default connect((state) => {
  return state;
}, 
(dispatch, ownProps) => {
  return {
    setInfoToRedux: (action) => {
      dispatch(action)
    }
  }
})(Recommend)