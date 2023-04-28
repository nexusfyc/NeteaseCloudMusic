import React, { Fragment, componentDidMount, useEffect } from 'react'
import MyCarousel from '../../../service/MyCarousel';
import './index.css'
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import PubSub from 'pubsub-js';
import { useSetState } from 'ahooks';



export default function Recommend() {

  
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

        </div>
        <a className='right-arrow' href='javascript:;' onClick={toNext}>
          <RightOutlined className='right' />
        </a>
      </div>

    </div>
  )
}
