var io=require('socket.io')();


var userList=[];
io.on('connection',function(socket){
  console.log('a user has connection');
//获取客户端登录信息
socket.on('login',function(user){
  user.id=socket.id;
  userList.push(user);
  //io.emit相当于向所有的用户广播，也就是所有的客户端都会收到该该事件
  io.emit('userList',userList);
  //socket.emit只向当前登录的客户端发送该事件
  socket.emit('userInfo',user);
  //广播出去告诉所有客户端，谁上线了；
  //socket.broadcast.emit向除了自己以外的所有客户端发送该事件。
  socket.broadcast.emit('loginInfo',user.name+"上线了。");
});

//send to all
socket.on('toAll',function(msgObj){
  /*
    format:{
      from:{
        name:"",
        img:"",
        id:""
      },
      msg:""
    }
  */

  console.log("我只收到一次，别让我背郭！")
  socket.broadcast.emit('toAll',msgObj);
});

  socket.on('disconnect',function(){
    console.log('a user has disconnection');
    io.emit('unline',0);
  });
//  io.emit('online',1);
})


exports.listen=function(server){
  io.listen(server);

}
