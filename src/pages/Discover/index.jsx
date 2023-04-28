import React, { Fragment } from 'react'
import { NavLink, Outlet, useRoutes } from 'react-router-dom'
import './index.css'


export default function Discover() {
  return (
    <Fragment>
      <div className='second-headbar'>
        <div className='middle-content'>
          <ul>
            <li><NavLink to={`recommend`}>推荐</NavLink></li>
            <li><NavLink to={`/discover/toplist`}>排行榜</NavLink></li>
            <li><NavLink to={`/discover/playlist`}>歌单</NavLink></li>
            <li><NavLink to={`/discover/djradio`}>主播电台</NavLink></li>
            <li><NavLink to={`/discover/artist`}>歌手</NavLink></li>
            <li><NavLink to={`/discover/album`}>新碟上架</NavLink></li>
          </ul>
        </div>
      </div>
      <Outlet />
      
    </Fragment>
  )
}
