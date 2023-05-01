import React, { Fragment, useEffect, useRef } from 'react'
import axios from 'axios';
import { Carousel } from 'antd';
import { useMount, useSetState, useUpdateEffect } from 'ahooks';
import PubSub from 'pubsub-js'

const contentStyle = {
  height: '270px',
  color: '#fff',
  lineHeight: '270px',
  textAlign: 'center',
  background: '#364d79',
};

// function saveBannersMes(data) {
//   const [state, setState] = useSetState({banners: data});
//  }


export default function MyCarousel() {
 
  const [state, setState] = useSetState({});
  const oldStateRef = useRef();


  const wyyService = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 2000
  });

  function getImgUrl() {
     // console.log("组件挂载完成");
     console.log('正在加载', state.banners[0]);
     let divArray = document.querySelectorAll('.ad-image');
     console.log(divArray[1].querySelector('h3').innerText);
     for (let i = 0; i < 8; i++) {
       let imgElement = document.createElement('img');
       // console.log(state.banners[0].imageUrl);
       imgElement.src = state.banners[i].imageUrl;
       divArray[i].querySelector('h3').appendChild(imgElement);
     }
  }


  useEffect((params) => {
    wyyService.get('/banner').then((response) => {
      setState(response.data);
    getImgUrl();
    }, (error) => {
      console.log("失败了", error)
    });
    
  }, [state.code])

  PubSub.subscribe('toPrevious', (msg, data) => {
    carousel.current.prev();
  })

  PubSub.subscribe('toNext', (msg, data) => {
    carousel.current.next();
  })

  const carousel = React.createRef();


  return (
    <Fragment>
      <Carousel effect="fade" autoplay='true' ref={carousel}>
        <div className='ad-image'>
          <h3 style={contentStyle}></h3>
        </div>
        <div className='ad-image'>
          <h3 style={contentStyle}></h3>
        </div>
        <div className='ad-image'>
          <h3 style={contentStyle}></h3>
        </div>
        <div className='ad-image'>
          <h3 style={contentStyle}></h3>
        </div>
        <div className='ad-image'>
          <h3 style={contentStyle}></h3>
        </div>
        <div className='ad-image'>
          <h3 style={contentStyle}></h3>
        </div>
        <div className='ad-image'>
          <h3 style={contentStyle}></h3>
        </div>
        <div className='ad-image'>
          <h3 style={contentStyle}></h3>
        </div>
      </Carousel>
    </Fragment>
  )
}
