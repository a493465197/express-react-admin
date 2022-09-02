import React, { useEffect, useRef, useState } from 'react'
import { Layout, Menu, Breadcrumb, Button, Form, Input, message, InputNumber } from 'antd';
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
    const fromRef = useRef({})
    const onFinish = (values) => {
        console.log('Success:', values);
        http({
            url: '/auth/setInfo',
            data: {...values},
            method: 'POST'
        }).then((res) => {
            if (res.status === 'success') {
                message.success('修改成功')
            }
        })
      };
    
      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

    useEffect(() => {
        http({
            url: '/auth'
        }).then((res) => {
            res && setInfo(res)
            fromRef.current.setFieldsValue(res)

        })
    }, [])
    return <div>
        <Form
      name="basic"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      ref={(e) => {fromRef.current = e}}
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
        label="姓名"
        name="name"
      >
        <Input />
      </Form.Item>
      {/* <Form.Item
        label="职位描述"
        name="job"
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="薪资"
        name="xinjin"
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="入职时间"
        name="joinDate"
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="上级"
        name="shangji"
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="下级"
        name="xiaji"
      >
        <Input />
      </Form.Item> */}

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>




    </div>
}