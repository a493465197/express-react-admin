import React, { useEffect, useRef, useState } from 'react'
import { Layout, Menu, Space, Table, Button, Input, message, DatePicker, List, Comment, Avatar, Modal, Form, Select } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import http from '@/service'
import moment from 'moment'

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;



export default (props) => {


  const [info, setInfo] = useState({})
  const [act, setAct] = useState('')
  const [currBuyBook, setCurrBuyBook] = useState({})
  const [pj, setPj] = useState('')
  const fromRef = useRef(null)
  const [docList, setDocList] = useState([])
  const [logList, setLogList] = useState([])
  const navigate = useNavigate() 

  const getDocList = () => {
    http({
      url: '/api/docList',
      method: 'POST'
    }).then((res) => {
      setDocList(res.value)
    })

  }
const onFinish = (values) => {
  getLogList({docId: values.docId})
}

  const getLogList = (v) => {
    http({
      url: '/api/logList',
      method: 'POST',
      data: {
        isTag: true,
        ...(v ? v : {})
      }
    }).then((res) => {
      setLogList(res.value)
    })

  }

  const handleBack = (r) => {
    http({
      url: '/api/docBack',
      method: 'POST',
      data: {
        ...r
      }
    }).then((res) => {
      message.success('回退成功')
    })
  }

  const columns = [
    {
      title: '文档标题',
      dataIndex: 'doc',
      key: 'doc',
      render: (v) => {
        return v[0]?.title
      }
    },
    {
      title: '用户',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '详情',
      dataIndex: 'desc',
      key: 'desc',
    },
    {
      title: '创建时间',
      dataIndex: 'time',
      key: 'time',
      render: (v) => moment(v).format('YYYY-MM-DD hh:mm:ss')
    },

 

    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => handleBack(record)}>回退到此版本</Button>
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

    getLogList()
  }, [])
  return <div>

<Form
      name="basic"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
      ref={(e) => { fromRef.current = e }}
    >
      <Form.Item
        label="文档标题"
        name="docId"
      >
        <Select options={docList.map((e) => ({
          label: e.title,
          value: e.id
        }))} />
      </Form.Item>


      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>

          <Table pagination={{pageSize:5}} columns={columns} dataSource={logList.filter(props.filter ? props.filter: (e) => true)} />
  </div>
}