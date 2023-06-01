import React, { Fragment } from 'react'
import PubSub from 'pubsub-js'
import { AudioOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { Menu } from 'antd';
import { useState, useEffect } from 'react';
import { Outlet, Link, useSearchParams } from 'react-router-dom';
import './index.css'
import { useSetState } from 'ahooks';
import { Divider, Space, Table } from 'antd';
import axios from 'axios'
import { getPlayingMusicAction } from '../../redux/action/action-creator'
import store from '../../redux/store';
import { connect } from 'react-redux';

const getMsg = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 2000
});


//  头部标题
const items = [
  {
    label: (
      <Link to={'/search?keywords=xxx&type=1'} >
        单曲
      </Link>
    ),
    key: 'song',
  },
  {
    label: (
      <Link to='/search?keywords=xxx&type=100'>
        歌手
      </Link>
    ),
    key: 'singer',
  },
  {
    label: (
      <Link to='/search?keywords=xxx&type=10'>
        专辑
      </Link>
    ),
    key: 'album',
  },
  {
    label: (
      <Link to='/search?keywords=xxx&type=1014'>
        视频
      </Link>
    ),
    key: 'video',
  },
  {
    label: (
      <Link to='/search?keywords=xxx&type=1006'>
        歌词
      </Link>
    ),
    key: 'text',
  },
  {
    label: (
      <Link to='/search?keywords=xxx&type=1000'>
        歌单
      </Link>
    ),
    key: 'menu',
  },
  {
    label: (
      <Link to='/search?keywords=xxx&type=1009'>
        声音主播
      </Link>
    ),
    key: 'anchor',
  },
  {
    label: (
      <Link to='/search?keywords=xxx&type=1002'>
        用户
      </Link>
    ),
    key: 'user',
  }
];


const { Search } = Input;

const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: '#1890ff',
    }}
  />
);

const onSearch = (value) => console.log(value);
const positionOptions = ['top', 'bottom', 'both'];
const alignOptions = ['start', 'center', 'end'];

function sendPlayMsg(songId) {
  PubSub.publish('playsong', songId);
}

function sendPlayingToRedux(songId, dispatch) {
  getMsg.get(`/check/music?id=${songId}`).then((response) => {
    //  定义播放歌曲的状态信息对象
    const statusInfo = response.data;
    if (statusInfo.success) {
      //  音乐有版权，需要同时保存单曲状态信息和单曲详细信息
      getMsg.get(`/song/url?id=${songId}`).then((response) => {
        const playingMusicInfo = response.data.data[0];
        Object.assign(playingMusicInfo, statusInfo);
        const action = getPlayingMusicAction(playingMusicInfo);
        store.dispatch(action);
      }, (error) => {
        console.log('获取音乐URL失败')
      })
    } else {
      //  音乐无版权，直接保存单曲状态信息
      const action = getPlayingMusicAction(statusInfo);
      dispatch(action);
    }
  }, (error) => {
    console.log('获取音乐可用状态失败')
  })
}


const mapDispatchToProps = (dispatch) => {
  return {
    getPlayingMusicInfo: (songId) => {
      sendPlayingToRedux(songId, dispatch)
    }
  }
}


let data = [
  // {
  //   key: '1',
  //   name: '晴天',
  //   singer: '周杰伦',
  //   album: '不能说的秘密',
  //   time: '2:30'
  // },
  // {
  //   key: '2',
  //   name: '晴天',
  //   singer: '周杰伦',
  //   album: '不能说的秘密',
  //   time: '2:30'
  // },
  // {
  //   key: '3',
  //   name: '晴天',
  //   singer: '周杰伦',
  //   album: '不能说的秘密',
  //   time: '2:30'
  // }
];

function IndexSearch(props) {
  const {getPlayingMusicInfo} = props
  const [position, setPosition] = useState('bottom');
  const [align, setAlign] = useState('center');
  const [current, setCurrent] = useState('mail');
  const [searchKeywords, setKeywords] = useSetState('');
  const [state, setState] = useSetState({ count: 0 });

  const [searchParams] = useSearchParams();
  const keywords = searchParams.get("keywords");
  const type = searchParams.get("type");

  //  列表
const columns = [
  {
    title: '歌名',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>
  },
  {
    title: '歌手',
    dataIndex: 'singer',
    key: 'singer',
    render: (text) => <a>{text}</a>
  },
  {
    title: '专辑',
    dataIndex: 'album',
    key: 'album',
    render: (text) => <a>{text}</a>
  },
  {
    title: '时长',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: '播放',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        {/* <a>Invite {record.name}</a> */}
        <a href onClick={() => {
          // alert(record.key);
          //  将单曲相关信息保存至redux
          getPlayingMusicInfo(record.key);
          //  发送单曲id
          sendPlayMsg(record.key);
        }}><PlayCircleOutlined /></a>
      </Space>
    ),
  },
];

 


  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  //  设置网络请求基本配置
  const getInfo = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 2000
  });

  //  首次挂载组件执行
  useEffect(() => {
    getInfo.get(`/search?keywords=${keywords}&type=${type}`).then((response) => {
      console.log('初次挂载组件获取数据成功', response.data);
      data = [];
      for (let index = 0; index < response.data.result.songs.length; index++) {
        data.push({
          key: response.data.result.songs[index].id,
          name: response.data.result.songs[index].name,
          singer: response.data.result.songs[index].artists[0].name,
          album: response.data.result.songs[index].album.name,
          songId: response.data.result.songs[index].id
        })
      }
      setState({ count: response.data.result.songs.length });
      setKeywords(keywords);

    }, (error) => {
      console.log('获取数据失败，', error);
    })
  }, [])





  //  接收来自顶部搜索栏的关键字、信息类型（二次以及多次搜索执行）
  PubSub.subscribe('search-params', (msg, getDataFromHeaderBar) => {
    const { keywords, type } = getDataFromHeaderBar;
    getInfo.get(`/search?keywords=${keywords}&type=${type}`).then((response) => {
      console.log('多次请求数据成功', response.data);
      data = [];
      for (let index = 0; index < response.data.result.songs.length; index++) {
        data.push({
          key: response.data.result.songs[index].id,
          name: response.data.result.songs[index].name,
          singer: response.data.result.songs[index].artists[0].name,
          album: response.data.result.songs[index].album.name,
        })
      }
      setState({ count: response.data.result.songs.length });
      setKeywords(keywords);
      // console.log(showList); 
    }, (error) => {
      console.log('获取数据失败，', error);
    })
  })




  return (
    <Fragment>
      <div className='inner-menu'>
        <div className='inner-search-area'>
          <Search placeholder="音乐/视频/用户" onSearch={onSearch} enterButton />
        </div>

        <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
        <div className='showlist'>
          <div className='resule-list'>

            <Divider orientation="center">搜索“{keywords}”，找到{state.count}首单曲</Divider>
            <Table columns={columns} dataSource={data} />
          </div>
        </div>
        <Outlet />
      </div>

    </Fragment>
  )
}

export default connect(null, mapDispatchToProps)(IndexSearch)