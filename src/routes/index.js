import Discover from "../pages/Discover"
import MyMusic from "../pages/MyMusic"
import Download from "../pages/Download"
import Friends from "../pages/Friends"
import Album from "../pages/Discover/Album"
import Artist from "../pages/Discover/Artist"
import Djradio from "../pages/Discover/Djradio"
import Playlist from "../pages/Discover/Playlist"
import Toplist from "../pages/Discover/Toplist"
import Recommend from "../pages/Discover/Recommend"
import IndexSearch from "../pages/IndexSearch"
// import SearchSong from '../pages/IndexSearch/SearchSong'
// import SearchSingers from '../pages/IndexSearch/SearchSingers'
// import SearchAlbum from '../pages/IndexSearch/SearchAlbum'
// import SearchVideo from '../pages/IndexSearch/SearchVideo'
// import SearchText from '../pages/IndexSearch/SearchText'
// import SearchMenu from '../pages/IndexSearch/SearchMenu'
// import SearchAnchor from '../pages/IndexSearch/SearchAnchor'
// import SearchUsers from '../pages/IndexSearch/SearchUsers'
import { Navigate } from "react-router-dom"

const routesTable = [
    {
        path: '/discover',
        element: <Discover />,
        children: [
            {
                path: 'recommend',
                element: <Recommend />
            },
            {
                path: 'toplist',
                element: <Toplist />
            },
            {
                path: 'playlist',
                element: <Playlist />
            },
            {
                path: 'djradio',
                element: <Djradio />
            },
            {
                path: '/discover/artist',
                element: <Artist />
            },
            {
                path: '/discover/album',
                element: <Album />
            },
        ]
    },
    {
        path: '/my',
        element: <MyMusic />
    },
    {
        path: '/friend',
        element: <Friends />
    },
    {
        path: '/download',
        element: <Download />
    },
    {
        path: '/search',
        element: <IndexSearch />
        // children: [
        //     {
        //         path: '/search?keywords=xxx&type=1',
        //         element: <SearchSong />
        //     },
        //     {
        //         path: '/search?keywords=:keyword&type=10',
        //         element: <SearchAlbum />
        //     },
        //     {
        //         path: '/search?keywords=:keyword&type=100',
        //         element: <SearchSingers />
        //     },
        //     {
        //         path: '/search?keywords=:keyword&type=1000',
        //         element: <SearchMenu />
        //     },
        //     {
        //         path: '/search?keywords=:keyword&type=1002',
        //         element: <SearchUsers />
        //     },
        //     {
        //         path: '/search?keywords=:keyword&type=1006',
        //         element: <SearchText />
        //     },
        //     {
        //         path: '/search?keywords=:keyword&type=1014',
        //         element: <SearchVideo />
        //     },
        //     {
        //         path: '/search?keywords=:keyword&type=1009',
        //         element: <SearchAnchor />
        //     }
        // ]
    },
    {
        path: '/',
        element: <Navigate replace to="/discover/recommend" />
    }
]

export default routesTable