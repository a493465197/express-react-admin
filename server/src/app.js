const express = require('express')
require('express-async-errors')
const morgan = require('morgan')
const errorhandler = require('errorhandler')
const cookieParser = require('cookie-parser')
const notifier = require('node-notifier')
const cors = require('cors')
const path = require('path')
const router = require('./routes')
const config = require('./config')
const app = express()
const expressStatic = require('express-static')
var server = require('http').Server(app)
const io = require('socket.io')(server)

function errorNotification (err, str, req) {
    var title = 'Error in ' + req.method + ' ' + req.url
  
    notifier.notify({
      title: title,
      message: str
    })
  }
app.use(morgan('dev'))
app.use(express.json())
app.use(cors({
  credentials: true,
  origin: config.corsClientDomain
}))
if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorhandler({ log: errorNotification }))
  }
app.use(cookieParser(config.sessionSecret))

app.use('/', router)

io.on('connection', function (socket) {
  socket.join(socket.handshake.query.room)
  socket.on('login',function(data){
    socket.emit('username',{
      name:data.name,
    })
    
    socket.broadcast.emit('user join',{
      name:data.name,
    })
  })
 
  //处理信息
  socket.on('data',function(data){
    socket.broadcast.emit('update',{

    })
  })
 
})
app.use(expressStatic(path.resolve(__dirname, '..', 'static')))

module.exports = server