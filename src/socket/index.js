// import io from 'socket.io-client'
// const ele = document.createElement('script')
// ele.src = 'https://cdn.bootcss.com/socket.io/2.1.0/socket.io.js'
// document.body.appendChild(ele)

// 连接服务器, 得到与服务器的连接对象
const socket = window.io('ws://localhost:3000/file',{
  transports: ['websocket'],
})
// 绑定监听, 接收服务器发送的消息
socket.on('receiveMsg', function (data) {
  console.log('客户端接收服务器发送的消息', data)
})

// 发送消息
export default socket