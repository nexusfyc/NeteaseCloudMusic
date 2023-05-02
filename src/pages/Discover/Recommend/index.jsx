import React, { useState, Fragment, useEffect } from 'react'
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
import { Carousel } from 'antd';
const contentStyle = {
  margin: 0,
  height: '240px',
  color: '#fff',
  lineHeight: '240px',
  textAlign: 'center',
  background: '#364d79',
};


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
        更多--
      </a>
    ),
    key: 'electronic',
  }
];

const newAlbumItems = [
  {
    label: (
      <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
        新碟上架
      </a>
    ),
    key: 'newAlbum',
  },
  {
    label: (
      <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
        更多--
      </a>
    ),
    key: 'more',
  }
]

const ourSingers = [
  {
    label: (
      <span>热门歌手</span>
    ),
    key: 'singers',
  },
  {
    label: (
      <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
        查看全部
      </a>
    ),
    key: 'all',
  }
];


function Recommend(props) {
  const { setInfoToRedux, hotlistReducer } = props;

  const wyyService = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 2000
  });

  const wyyServiceGetHotSingers = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 2000
  });

  //  wyyService请求拦截器设置
  wyyService.interceptors.response.use((response) => {
    return response.data.playlists
  })

  const [size, setSize] = useState('large');
  const [current, setCurrent] = useState('mail');
  const [hotSingers, setHotSingers] = useState([])

  //  UI组件中的方法
  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  const onChange = (currentSlide) => {
    console.log(currentSlide);
  };



  async function getInfo(url) {
    // let info = await wyyService.get(url);
    let info = await wyyService.get(url);
    const action = getHotListAction(info);
    setInfoToRedux(action);
  }

  async function getHotSingers(url) {
    // let info = await wyyService.get(url);
    try {
      let hotArtists = await wyyServiceGetHotSingers.get(url);
      setHotSingers(hotArtists.data.artists);


    } catch (error) {
      console.log('出错了', error);
    }


  }


  //  获取并保存相关数据
  useEffect((params) => {
    getInfo('/top/playlist?limit=10&order=hot');
    getHotSingers('/top/artists?offset=0&limit=5')
  }, [])

  //  渲染页面
  useEffect((params) => {
    const songList = document.querySelector('.hot-recommend');
    for (let index = 0; index < hotlistReducer.Lists.length; index++) {
      const divElement = document.createElement('div');
      divElement.style.backgroundImage = `url(${hotlistReducer.Lists[index].coverImgUrl})`;
      divElement.style.backgroundSize = '140px';
      divElement.style.backgroundRepeat = 'no-repeat';
      divElement.style.fontSize = '12px'
      divElement.innerHTML = `<a href=""><span>${hotlistReducer.Lists[index].name}</span></a>`;
      divElement.querySelector('span').style.position = 'relative';
      divElement.querySelector('span').style.top = '160px';

      songList.appendChild(divElement);
    }
  }, [hotlistReducer.Lists.length])

  useEffect((params) => {
    const singerListElement = document.querySelector('.hot-singer-list');
    hotSingers.map((item) => {
      const aDiv = document.createElement('div');
      aDiv.style.width = '210px';
      aDiv.style.height = '62px';
      aDiv.style.marginTop = '20px';
      aDiv.style.marginLeft = 'auto';
      aDiv.style.marginRight = 'auto';
      aDiv.style.backgroundImage = `url(${item.picUrl})`;
      aDiv.style.backgroundSize = '62px 62px';
      aDiv.style.backgroundRepeat = 'no-repeat';
      singerListElement.appendChild(aDiv);
      const nameSpan = document.createElement('span');
      nameSpan.style.display = 'block';
      nameSpan.style.position = 'relative';
      nameSpan.style.left = '70px';
      nameSpan.style.top = '20px';
      nameSpan.innerHTML = item.name;
      aDiv.appendChild(nameSpan);
    })
  }, [hotSingers.length])



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
            {/* <div><a href=""><span></span></a></div>
            <div><a href=""><span></span></a></div>
            <div><a href=""><span></span></a></div>
            <div><a href=""><span></span></a></div>
            <div><a href=""><span></span></a></div>
            <div><a href=""><span></span></a></div>
            <div><a href=""><span></span></a></div>
            <div><a href=""><span></span></a></div>
            <div><a href=""><span></span></a></div>
            <div><a href=""><span></span></a></div> */}

          </div>
          <Menu className='left-menu' onClick={onClick} selectedKeys={[current]} mode="horizontal" items={newAlbumItems} />
          <div className='new-album'>
            <Carousel afterChange={onChange}>
              <div>
                <h3 style={contentStyle}>
                  <div className='first-photo'>
                    
                  </div>
                </h3>
              </div>
              <div>
                <h3 style={contentStyle}>
                <div className='second-photo'>
                    
                    </div>
                </h3>
              </div>
              
            </Carousel>
          </div>
        </div>
        <div className='right'>
          <div className='below-login-area'>
            <span id='description'>登陆网抑云音乐，可以享受无限收藏的乐趣，并且无限同步到手机</span>
            <Button className='login-button' type="primary" size={size}>
              用户登录
            </Button>
          </div>
          <div className='our-singers'>
            <Menu className='our-singers-menu' onClick={onClick} selectedKeys={[current]} mode="horizontal" items={ourSingers} />
            <div className='hot-singer-list'>
              <Button type="primary" className='apply-button'>申请成为网易音乐人</Button>
            </div>
          </div>
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