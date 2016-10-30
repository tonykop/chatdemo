var socket=io();
var i=0;

// socket.on('online',function(msg){
//   showMsg(msg);
// });
// socket.on('unline',function(msg){
//   showMsg(msg);
// })


//connection to host and port
//when user login or logout,system notice
//用户上线事件监听
socket.on('loginInfo',function(msg){
	addMsgFromSys(msg);
  Messenger().post({
    message: msg,
    showCloseButton: true
  });
});


//client review user information after login
//用户上线后接收自己的登录信息
socket.on('userInfo',function(userObj){
  //should be use cookie or session
	userSelf = userObj;
  $('#spanuser').text('欢迎您！ '+userObj.name);
});
//add user in ui
//监听用户加入事件
socket.on('userList',function(userList){
	//modify user count
	//modifyUserCount(userList.length);
  addUser(userList);
});

//review message from toAll
//监听接收群发信息的事件
socket.on('toAll',function(msgObj){
//	alert('Please enter the message content!');
console.log("我是不是接收了两次啊，我滴哥！"+i++);
  if(userSelf.name==msgObj.from.name){
    //addMsgFromUser(msgObj,true);
  }else{
  addMsgFromUser(msgObj,false);
  }
});
