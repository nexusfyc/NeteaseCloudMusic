import './index.css'
import React, { useState, useEffect } from 'react'
import { NavLink, Routes, Route, Link, Outlet, useRoutes, useNavigate, createSearchParams } from 'react-router-dom'
import { PlayCircleOutlined, AudioOutlined } from '@ant-design/icons'
import { Input, Button, Modal, QRCode, Space } from 'antd';
import routesTable from '../../routes';
import PubSub from 'pubsub-js'
import axios from 'axios';
import { useSetState } from 'ahooks';
import { nanoid } from 'nanoid';


export default function HeaderBar() {


  const getQR = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 2000
  });

  getQR.interceptors.request.use(config => {
    config['X-Timestamp'] = new Date().getTime();
    return config;
  }, (err) => {
    return Promise.reject(err);
  })

  getQR.interceptors.response.use((res) => {
    res.data.timestamp = res.config['X-Timestamp'];
    return res;
  }, (err) => {
    return Promise.reject(err);
  })


  //  异步关闭对话框
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');
  const [qrObj, setObj] = useSetState({
    qrURL: '',
    id: -1
  });

  const showModal = () => {
    let Timestamp=new Date().getTime();
    console.log(Timestamp);
    getQR.get(`/login/qr/key?timestamp=${Timestamp}`).then((res) => {
      console.log('获取unikey成功');
      let unikey = res.data.data.unikey;
      getQR.get(`/login/qr/create?key=${unikey}&qrimg=1`).then((res) => {
        console.log('获取二维码链接成功');
        // console.log(res.data.data.qrimg)
        setObj({ qrURL: res.data.data.qrimg, id: nanoid() })
        setOpen(true);
        const timeInterval = setInterval(() => {
          getQR.get(`/login/qr/check?key=${unikey}`).then((response) => {
            console.log('接口轮询中...');
            console.log(unikey);
            if (response.data.code == 803) {
              console.log('登陆成功！返回cookie~');
              handleCancel(timeInterval);
            }
          }, (error) => {
            
          })
        }, 1000);
      }, (error) => {
        console.log('获取二维码链接失败', error)
      })
    }, (error) => {

    })
  };

  const refreshQR = (params) => {
    let Timestamp=new Date().getTime();
    getQR.get(`/login/qr/key?timestamp=${Timestamp}`).then((res) => {
      let unikey = res.data.data.unikey;
      getQR.get(`/login/qr/create?key=${unikey}&qrimg=1`).then((response) => {
        // console.log(res.data.data.qrimg)
        setObj({ qrURL: response.data.data.qrimg, id: nanoid() })
        setOpen(true);
        const timeInterval = setInterval(() => {
          getQR.get(`/login/qr/check?key=${unikey}`).then((response) => {
            console.log('接口轮询中...');
            if (response.data.code == 803) {
              console.log('登陆成功！返回cookie~');
              handleCancel(timeInterval);
            }
          }, (error) => {
            
          })
        }, 500);
      }, (error) => {
        console.log('获取二维码链接失败', error)
      })
    }, (error) => {

    })
  }

  const handleOk = () => {
    setModalText('The modal will be closed after two seconds');
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };
  const handleCancel = (timeInterval) => {
    console.log('Clicked cancel button');
    timeInterval = null;
    setOpen(false);
  };


  const navigate = useNavigate();

  const [size, setSize] = useState('large');
  const element = useRoutes(routesTable);

  const onSearch = (value) => {
    //  value为搜索框中填入的值    
    const searchInfo = {
      keywords: value,
      type: 1
    }
    PubSub.publish('search-params', searchInfo);
    // console.log(value)
    navigate({
      pathname: '/search',
      search: `?${createSearchParams(searchInfo)}`
    });
  };

  // const { data, loading, run } = useRequest(onSearch, {
  //   debounceWait: 300,
  //   manual: true,
  // });


  const { Search } = Input;

  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: '#1890ff',
      }}
    />
  );





  return (
    <div className='header-bar'>
      <div className='header-bar-content'>
        <ul>
          <li className='wyy-logo'>
            <Link to={`/discover`}>
              <PlayCircleOutlined />
              网抑云音乐
            </Link>
          </li>
          <li>
            <NavLink className={(navData) => navData.isActive ? "active" : ""} to={`/discover/recommend`} >发现音乐</NavLink>
          </li>
          <li>
            <NavLink className={(navData) => navData.isActive ? "active" : ""} to={`/my`}>我的音乐</NavLink>
          </li>
          <li>
            <NavLink className={(navData) => navData.isActive ? "active" : ""} to={`/friend`}>关注</NavLink>
          </li>
          <li>
            <a href="javascript:;">商城</a>
          </li>
          <li>
            <a href="javascript:;">音乐人</a>
          </li>
          <li>
            <NavLink to={`/download`}>下载客户端</NavLink>
          </li>
          <li className='search-input'>
            <Search placeholder="音乐/视频/电台/用户" onSearch={onSearch} style={{ width: 200 }} />
          </li>
          <li className='creator'>

            <Button type="primary" shape="round" size={size}>
              创作者中心
            </Button>
          </li>
          <li className='login-button'>
            <Button type="primary" onClick={showModal}>
              登陆
            </Button>
            <Modal
              title="请扫描二维码登陆"
              open={open}
              onOk={handleOk}
              confirmLoading={confirmLoading}
              onCancel={handleCancel}
              destroyOnClose
              key={qrObj.id}
            >
              <p><img src={qrObj.qrURL} alt="" /></p>
              <Button type="primary" onClick={refreshQR}>刷新二维码</Button>
            </Modal>
          </li>
        </ul>
      </div>
      {element}

      {/* <Routes>
        <Route path='/my' element={<MyMusic />}></Route>
        <Route path='/friend' element={<Friends />}></Route>
        <Route path='/download' element={<Download />}></Route>
        <Route path='/' element={<Discover />}></Route>
      </Routes> */}
    </div>
  )
}
