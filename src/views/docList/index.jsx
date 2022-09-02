import React, { useEffect, useRef, useState } from 'react'
import { Layout, Menu, Space, Table, Button, Input, message, DatePicker, List, Comment, Avatar, Modal, Form } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import http from '@/service'
import moment from 'moment'
import Chat from '../components/chat'
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;



export default (props) => {


  const [info, setInfo] = useState({})
  const [docList, setDocList] = useState([])
  const [act, setAct] = useState('')
  const [currBuyBook, setCurrBuyBook] = useState({})
  const [pj, setPj] = useState('')
  const [joinId, setJoinId] = useState('')
  const fromRef = useRef(null)
  const navigate = useNavigate() 


  const onFinish = (values) => {
    http({
      url: '/api/conversations',
      method: 'POST',
      data: values
    }).then((res) => {
      setAct('')
      getDocList()
    })
  }

  const getDocList = () => {
    http({
      url: '/api/conversations',
      method: 'GET'
    }).then((res) => {
      setDocList(res.conversations)
    })

  }

  // const handleDel = (r) => {
  //   Modal.confirm({
  //     title: '请确认操作',
  //     onOk: () => {
  //       http({
  //         url: '/api/delDoc',
  //         data: { id: r.id },
  //         method: 'POST'
  //       }).then((res) => {
  //         message.success('删除成功')
  //         getDocList()
  //       })
  //     }
  //   })
  // }

  const columns = [
    {
      title: 'title',
      dataIndex: 'title',
      key: 'title',
    },
    // {
    //   title: '创建时间',
    //   dataIndex: 'time',
    //   key: 'time',
    //   render: (v) => moment(v).format('YYYY-MM-DD hh:mm:ss')
    // },

 

    {
      title: 'Edit',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => {
            setJoinId(record.id)
          }}>Join</Button>
          {/* {(record.creater === info.username || info.isAdmin) &&  <Button onClick={() => handleDel(record)}>删除</Button>} */}
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

    getDocList()
  }, [])
  return <div>

      <Button onClick={() => setAct('add')}>Create</Button>
        <Table pagination={{pageSize:5}} columns={columns} dataSource={docList.filter(props.filter ? props.filter: (e) => true)} />
        {(act === 'edit' || act === 'add') && <Modal
    visible
    footer={false}
    title={act === 'edit' ? 'Edit' : 'Create'}
    onCancel={() => setAct('')}
  ><Form
      name="basic"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
      ref={(e) => { fromRef.current = e }}
    >
      <Form.Item
        label="Session Name"
        name="title"
      >
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Confirm
        </Button>
      </Form.Item>
    </Form></Modal>}
    {joinId && <Chat id={joinId} />}
  </div>
}