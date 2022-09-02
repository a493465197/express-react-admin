import React, { useEffect, useRef, useState, memo } from 'react'
import { Layout, Menu, Breadcrumb, Button } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import {useNavigate} from 'react-router-dom'
import http from '@/service' 
const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

export default (Com) =>  (props) => {
  const [info, setInfo] = useState({})
  const navigate = useNavigate()
  useEffect(() => {
    http({
      url: '/auth'
    }).then((res) => {
      res && setInfo(res)
    })
  }, [])

  return(
  <Layout>
    <Header className="header">
      <div className="logo" />
      {/* <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
        <Menu.Item key="1">home</Menu.Item>
      </Menu> */}
      <h2 style={{color: '#fff'}}></h2>
      <Button style={{position: 'absolute', right: 14, top: 14}} onClick={() => {
            localStorage.removeItem('auth')
            window.location.href = '/#/login'
      }}>Logout</Button>
    </Header>
    <Layout>
      <Sider width={200} className="site-layout-background">
      <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['home', 'gly']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <SubMenu key="home" title="Menu">
            {info.auth && info.auth.includes('home') && <Menu.Item onClick={() => navigate('/home')} key="5">个人设置</Menu.Item>}
            {info.auth && info.auth.includes('docList') && <Menu.Item onClick={() => navigate('/docList')} key="7">房间列表</Menu.Item>}
          </SubMenu>
          {info.isAdmin ? <SubMenu key="gly" title="管理员设置">
            <Menu.Item onClick={() => navigate('/yonghu')} key="8">用户管理</Menu.Item>
            {/* <Menu.Item onClick={() => navigate('/getAuthList')} key="10">密钥使用申请</Menu.Item> */}
            {/* <Menu.Item onClick={() => navigate('/yudin')} key="10">会议室预定</Menu.Item> */}
          </SubMenu> : <SubMenu key="gly" title=""></SubMenu>}
        </Menu>
      </Sider>
      <Layout
        // style={{
        //   padding: '0 24px 24px',
        // }}
      >
        {/* <Breadcrumb
          style={{
            margin: '16px 0',
          }}
        >
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb> */}
        <Content
          className="site-layout-background"
          style={{
            padding: '24px 24px 0 24px',
            margin: 0,
            minHeight: 280,
          }}
        >
          <Com {...props}/>
        </Content>
      </Layout>
    </Layout>
  </Layout>
)};