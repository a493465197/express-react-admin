import React, {useState, useEffect, useRef} from 'react'
import { Comment, Tooltip, Avatar, Form, Button, Input } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom'
import './index.scss'
import http from '@/service'
import { DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined,DeleteOutlined } from '@ant-design/icons';
import moment from 'moment'
import io from 'socket.io-client'
export default (props) => {
  const [chats, setChats] = useState([])
  const socketRef = useRef({})
  const chatsRef = useRef([])
  const formRef = useRef()
  const [urlParams] = useSearchParams()

  useEffect(() => {
    socketRef.current = io('ws://'+window.location.host, {
      transports: ['websocket'],
      query: {
        room: props.id
      }
    })
    socketRef.current.on('update', (v) => {
      setTimeout(() => {
      getData()
        
      }, 100);
    })

  }, [])
  const getData = () => {
    http({
      url: '/api/conversations/'+props.id,
      method: 'GET'
    }).then((res) => {
      setChats(res.messages)
    })
  }
  useEffect(() => {
    getData()
  },[props.id])

  const onFinish = (v) => {
    console.log(v)
    socketRef.current.emit('data', {
      data: v.data,
      username: props.username
    })
    http({
      url: '/api/conversations/'+props.id,
      method: 'POST',
      data: {
        text: v.data
      }
    }).then((res) => {
      getData()
    })
  }

  const del = (msgId) => {
    http({
      url: '/api/conversations/'+props.id+'/'+msgId,
      method: 'DELETE',
    }).then((res) => {
      getData()
    })
  }
  return <div>
    {chats.map((item) => {
      return <Comment
      author={<a>{item.creator}</a>}
      avatar={<Avatar src={'https://joeschmoe.io/api/v1/random'+item.creator} alt={item.creator} />}
      content={
        <p>
          {item.text}
        </p>
      }
      datetime={
        <Tooltip title={moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss')}>
          <span>{moment(item.timestamp).fromNow()}</span>
        </Tooltip>
      }
      actions={[
        <Tooltip key="comment-basic-like" title="Like">
          <span onClick={() => {
                http({
                  url: '/api/conversations/'+props.id+'/'+item.id+'/like',
                  method: 'POST',
                }).then((res) => {
                  getData()
                })
          }}>
            {item.like ? <LikeFilled></LikeFilled> : <LikeOutlined></LikeOutlined>}
            <span className="comment-action">{item.like}</span>
          </span>
        </Tooltip>,
        <Tooltip key="comment-basic-dislike" title="Dislike">
          <span onClick={() => {
            http({
              url: '/api/conversations/' + props.id + '/' + item.id + '/dislike',
              method: 'POST',
            }).then((res) => {
              getData()
            })
          }}>
            {item.dislike ? <DislikeFilled></DislikeFilled> : <DislikeOutlined></DislikeOutlined>}
            <span className="comment-action">{item.dislike}</span>
          </span>
        </Tooltip>,
        <Tooltip key="comment-basic-dislike" title="Delete">
          <span onClick={() => del(item.id)}>
            {<DeleteOutlined></DeleteOutlined> }
          </span>
        </Tooltip>,
      ]}
    />
    })}
    
    <Form
      name="basic"
      labelCol={{ span: 2 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
      autoComplete="off"
      ref={(r) => {formRef.current = r}}
    >
      <Form.Item
        label="text"
        name="data"
      >
        <Input />
      </Form.Item>


      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          
          Send
        </Button>
      </Form.Item>
    </Form>

  </div>
}