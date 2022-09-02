import { Form, Input, Button, Checkbox, message } from 'antd';
import http from '@/service' 
import {useNavigate} from 'react-router-dom'

import './index.scss'

const Login = (props) => {
    const navigate = useNavigate()
  const onFinish = (values) => {
    console.log('Success:', values);
    http({
        url: '/auth/register',
        method: 'POST',
        data: values
    }).then((res) => {
        console.log(res)
        if (res.status === 'success') {
            localStorage.setItem('auth', res.token)
            message.success('注册成功')
            navigate('/')
        }

     })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
      <div className='login-container'>
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>


      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
  
        <Button type="primary" htmlType="submit">
          注册
        </Button>
      </Form.Item>
    </Form>
    </div>
  );
};

export default Login;