import React, { useEffect, useRef, useState } from 'react'
import { Layout, Menu, Breadcrumb, Button, Form, Input, message, Space, Table } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import http from '@/service'

/**
 * Auther lizheyu
 * nav1234表示区域 改掉即可
 * 图片保存在public目录下 名称就是nav1/nav2 比如你区域是大厅 那图片就是大厅.jpeg
 * 
 */

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;



export default () => {
  const [info, setInfo] = useState({})
  const [act, setAct] = useState('')
  const [currBuyBook, setCurrBuyBook] = useState({})
  const [book, setBook] = useState([])
  const [pj, setPj] = useState('')
  const fromRef = useRef({})
  const navigate = useNavigate() 

  const handleBuy = (record) => {
    setAct('pj')
    setCurrBuyBook(record)

  }
  const handleBuyOk = () => {
    http({
      url: '/api/orderPj',
      data: { orderId: currBuyBook.orderId, pj },
      method: 'POST'
    }).then((res) => {
      if (res.status === 'success') {

        message.success('评价成功')
        navigate('/pj')

      }
    })

  }

  const getOrderList = () => {
    http({
      url: '/api/getOrderList',
      method: 'POST'
    }).then((res) => {
      res.value && setBook(res.value)

    })
  }

  const columns = [
    {
      title: '书名',
      dataIndex: 'book',
      key: 'title',
      render: (e) => e[0].title,
    },
    {
      title: '详情',
      dataIndex: 'book',
      key: 'detail',
      render: (e) => e[0].detail,

    },
    {
      title: '订单号',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: '发布人',
      dataIndex: 'book',
      key: 'username',
      render: (e) => e[0].detail,
    },
    {
      title: '价格',
      dataIndex: 'book',
      key: 'price',
      render: (e) => e[0].detail,
    },
  
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => handleBuy(record)}>评价</Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    http({
      url: '/auth'
    }).then((res) => {
      res.value && setInfo(res.value)

    })
    getOrderList()
  }, [])
  return <div>
    <Table columns={columns} dataSource={book} />
    {/* <Button onClick={() => {
      setAct('add')
    }}> 新增</Button> */}
    {act === 'pj' && <div>
      <p>评价</p>
      <Input.TextArea value={pj} onChange={(e) => setPj(e.target.value)}></Input.TextArea>
      <Button onClick={handleBuyOk}>确认评价</Button>
    </div>}



  </div>
}