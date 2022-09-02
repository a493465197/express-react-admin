import React, { useEffect, useRef, useState } from 'react'
import { Layout, Menu, Breadcrumb, Button, Form, Input, message, Space, Table } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
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
  const fromRef = useRef({})


  const handleBuy = (record) => {
    setAct('buy')
    setCurrBuyBook(record)

  }
  const handleBuyOk = () => {
    http({
      url: '/api/buyBook',
      data: { id: currBuyBook.id },
      method: 'POST'
    }).then((res) => {
      if (res.status === 'success') {

        message.success('购买成功')
      }
    })

  }

  const columns = [
    {
      title: '主图',
      dataIndex: 'mainImg',
      key: 'mainImg',
      render: (v) => {
        return <img style={{height: 40}} src={v?.fileList && v?.fileList[0]?.response?.filePathName}></img>
      }
    },
    {
      title: '书名',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '详情',
      dataIndex: 'detail',
      key: 'detail',
    },
    {
      title: '作者',
      dataIndex: 'auth',
      key: 'auth',
    },
    {
      title: '发布人',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
    },
  
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => handleBuy(record)}>购买</Button>
        </Space>
      ),
    },
  ];

  const onFinish = (values) => {
    console.log('Success:', values);
    http({
      url: '/api/addBook',
      data: { ...values, id: currBuyBook },
      method: 'POST'
    }).then((res) => {
      if (res.status === 'success') {
        fromRef.current.setFieldsValue({})
        setAct('')
        setCurrBuyBook({})
        getBookList()
        message.success('修改成功')
      }
    })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const getBookList = () => {
    http({
      url: '/api/buyBookList',
      method: 'POST'
    }).then((res) => {
      res.value && setBook(res.value)

    })
  }

  useEffect(() => {
    http({
      url: '/auth'
    }).then((res) => {
      res.value && setInfo(res.value)

    })
    getBookList()
  }, [])
  return <div>
    {act !== 'buy' && <Table columns={columns} dataSource={book} />}
    {/* <Button onClick={() => {
      setAct('add')
    }}> 新增</Button> */}
    {act === 'buy' && <div>
      <p>确定购买信息</p>
      <Table pagination={false} columns={columns.slice(0, columns.length -1)} dataSource={[currBuyBook]} />
      {currBuyBook?.detailImg?.fileList?.map((v) => {
        return <img style={{width: '100%'}} src={v?.response?.filePathName}></img>
      })}
      <Button onClick={handleBuyOk}>确认购买</Button>
      <Button style={{margin: '12px'}} onClick={() => setAct('')}>返回</Button>
    </div>}



  </div>
}