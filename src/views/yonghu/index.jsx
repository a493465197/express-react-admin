import React, { useEffect, useRef, useState } from 'react'
import { Layout, Menu, Breadcrumb, Button, Form, Input, message, Space, Table, Checkbox, Modal, InputNumber } from 'antd';
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
  const [currUser, setCurrUser] = useState('')
  const [users, setUsers] = useState([])
  const fromRef = useRef({})

  const handleDel = (record) => {
    Modal.confirm({
      title: '请确定操作',
      onOk: () => {
        http({
          url: '/auth/delUser',
          method: 'POST',
          data: {
            username: record.username
          }
        }).then((res) => {
          getUserList()
        })
      }
    })

  }

  const handleEdit = (record) => {
    console.log(record)
    setAct('edit')
    setCurrUser(record.username)
    setTimeout(() => {
      fromRef.current.setFieldsValue(record)
    }, 10);
  }

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
  
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record)}>编辑</Button>
          <Button onClick={() => handleDel(record)}>删除</Button>
        </Space>
      ),
    },
  ];

  const onFinish = (values) => {
    console.log('Success:', values);
    http({
      url: '/auth/setInfo',
      data: { ...values, currUser },
      method: 'POST'
    }).then((res) => {
      if (res.status === 'success') {
        fromRef.current.setFieldsValue({})
        setAct('')
        setCurrUser('')
        getUserList()
        message.success('修改成功')
      }
    })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const getUserList = () => {
    http({
      url: '/auth/userList',
      method: 'POST'
    }).then((res) => {
      res.value && setUsers(res.value)

    })
  }

  useEffect(() => {
    http({
      url: '/auth'
    }).then((res) => {
      res.value && setInfo(res.value)

    })
    getUserList()
  }, [])


  const options = [
    { label: '我的信息', value: 'home' },
    { label: '房间列表', value: 'docList' },
  ];

  return <div>
    <Table columns={columns} dataSource={users} />

    {act === 'edit' && <Modal
    visible
    title="用户信息编辑"
    onCancel={() => setAct('')}
    footer={false}><Form
      name="basic"
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      ref={(e) => { fromRef.current = e }}
    >
      <Form.Item
        label="用户名"
        name="username"
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="name"
        name="name"
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="权限"
        name="auth"
      >
        <Checkbox.Group options={options} />
      </Form.Item>


      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form></Modal>}



  </div>
}