import logo from './logo.svg';
import Home from './views/home/index'
import DocList from './views/docList/index'
import LogList from './views/logList/index'
import TagList from './views/tagList/index'
import Login from './views/login/index'
import Yonghu from './views/yonghu/index'
import Reg from './views/reg/index'
import Layout from './views/layout'
import './App.css';

import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
function App(){
    const LayoutHome = Layout(Home)
    const LayoutDocList = Layout(DocList)
    const LayoutLogList = Layout(LogList)
    const LayoutTagList = Layout(TagList)
    const LayoutYonghu = Layout(Yonghu)
    return (
        <HashRouter>
            <Routes>
                <Route path='/home' element={<LayoutHome></LayoutHome>} />
                <Route path='/docList' element={<LayoutDocList></LayoutDocList>} />
                <Route path='/logList' element={<LayoutLogList></LayoutLogList>} />
                <Route path='/tagList' element={<LayoutTagList></LayoutTagList>} />
                <Route path='/yonghu' element={<LayoutYonghu></LayoutYonghu>} />
                
                <Route path='/login' element={<Login></Login>} />
                <Route path='/reg' element={<Reg></Reg>} />
                <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
        </HashRouter>
    )
}

export default App;
