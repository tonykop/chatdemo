var userSelf = {};
var toOneId;
$(function(){
	$('#myModal').modal({
		//backdrop: 'static',
		keyboard: false
	});
	Messenger.options = {
		extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
		theme: 'flat'
	};

	$('.popover-dismiss').popover('show');

	//login
  //点击“应用昵称”按钮时触发的事件
	$('#btn-setName').click(function(){
    //获取输入的用户名
		var name = $('#username').val();

		if(checkUser(name)){
      //将昵称输入框置空
			$('#username').val('');
      //提醒用户名已经存在或者不能输入为空！
			alert('Nickname already exists or can not be empty!');
		}else{
      //用户头像数组
			var imgList = ["/images/1.jpg","/images/2.jpg","/images/3.jpg","/images/4.jpg","/images/5.jpg"];
			var randomNum = Math.floor(Math.random()*5);
			//random user
      //随机获取一张图片作为用户的头像
			var img = imgList[randomNum];
			//package user
      //讲用户信息封装。
			var dataObj = {
				name:name,
				img:img
			};
			//send user info to server
			socket.emit('login',dataObj);
			//hide login modal
      //隐藏登录对话框
			$('#myModal').modal('hide');
      //将昵称输入文本框置空
			$('#username').val('');
      //将鼠标的焦点设置到信息输入框
			$('#msg').focus();
		}
	});

	//send to all
  //群聊发送信息事件
  $('#sendMsg').click(function(){
    var msg = $('#msg').val();
    if(msg==''){
      alert('Please enter the message content!');
      return;
    }
    var from = userSelf;
    var msgObj = {
      from:from,
      msg:msg
    };
		addMsgFromUser(msgObj,true);
    socket.emit('toAll',msgObj);//socket.broadcast.

    $('#msg').val('');
  });

  //send image to all

  $('#sendImage').change(function(){
  	if(this.files.length != 0){
  		var file = this.files[0];
  		reader = new FileReader();
  		if(!reader){
  			alert("!your browser doesn\'t support fileReader");
  			return;
  		}
  		reader.onload = function(e){
  			//console.log(e.target.result);
        //组织发送者的信息
  			var msgObj = {
  				from:userSelf,
  				img:e.target.result
  			};
  			socket.emit('sendImageToALL',msgObj);
  			addImgFromUser(msgObj,true);
  		};
  		reader.readAsDataURL(file);
  	}
  });

  //send to one
  $('#btn_toOne').click(function(){
  	var msg = $('#input_msgToOne').val();
  	if(msg==''){
      alert('Please enter the message content!');
      return;
    }
  	var msgObj = {
  		from:userSelf,
  		to:toOneId,
  		msg:msg
  	};
  	socket.emit('toOne',msgObj);
  	$('#setMsgToOne').modal('hide');
  	$('#input_msgToOne').val('');
  })
});




//======================================================


//add message in UI
function addImgFromUser(msgObj,isSelf){
	var msgType = isSelf?"message-reply":"message-receive";
	var msgHtml = $('<div><div class="message-info"><div class="user-info"><img src="/images/1.jpg" class="user-avatar img-thumbnail"></div><div class="message-content-box"><div class="arrow"></div><div class="message-content">test</div></div></div></div>');
	msgHtml.addClass(msgType);
	msgHtml.children('.message-info').children('.user-info').children('.user-avatar').attr('src',msgObj.from.img);
	msgHtml.children('.message-info').children('.user-info').children('.user-avatar').attr('title',msgObj.from.name);
	msgHtml.children('.message-info').children('.message-content-box').children('.message-content').html("<img src='"+msgObj.img+"'>");
	$('.msg-content').append(msgHtml);
	//滚动条一直在最底
	$(".msg-content").scrollTop($(".msg-content")[0].scrollHeight);
}

//add message in UI
//接收到聊天信息后显示
function addMsgFromUser(msgObj,isSelf){
	var msgType = isSelf?"message-reply":"message-receive";
	var msgHtml = $('<div><div class="message-info"><div class="user-info"><img src="/images/1.jpg" class="user-avatar img-thumbnail"></div><div class="message-content-box"><div class="arrow"></div><div class="message-content">test</div></div></div></div>');
	msgHtml.addClass(msgType);
	msgHtml.children('.message-info').children('.user-info').children('.user-avatar').attr('src',msgObj.from.img);
	msgHtml.children('.message-info').children('.user-info').children('.user-avatar').attr('title',msgObj.from.name);
	msgHtml.children('.message-info').children('.message-content-box').children('.message-content').text(msgObj.msg);
	$('.msg-content').append(msgHtml);
	//滚动条一直在最底
	$(".msg-content").scrollTop($(".msg-content")[0].scrollHeight);
}

//add msg from system in UI
//用户上线通知，谁上线了。
function addMsgFromSys(msg){
	$.scojs_message(msg, $.scojs_message.TYPE_OK);
}




//add user in UI
//把新的用户加入到左边的用户列表里
function addUser(userList){
	var parentUl = $('.user-content').children('ul');
	var cloneLi = parentUl.children('li:first').clone();
	parentUl.html('');
	parentUl.append(cloneLi);
	for(var i in userList){
		var cloneLi = parentUl.children('li:first').clone();
		cloneLi.children('a').attr('href',"javascript:showSetMsgToOne('"+userList[i].name+"','"+userList[i].id+"');");
		cloneLi.children('a').children('img').attr('src',userList[i].img);
		cloneLi.children('a').children('span').text(userList[i].name);
		cloneLi.show();
		parentUl.append(cloneLi);
	}
}

//check is the username exist.
//判断该用户名是否已被用
function checkUser(name){
	var haveName = false;
	$(".user-content").children('ul').children('li').each(function(){
		if(name == $(this).find('span').text()){
			haveName = true;
		}
	});
	return haveName;
}

//set name enter function
function keywordsName(e){
	var event1 = e || window.event;
	if(event1.keyCode == 13){
		$('#btn-setName').click();
	}
}



//send message enter function
//点击发送按钮触发的事件
function keywordsMsg(e){
	var event1 = e || window.event;
	if(event1.keyCode == 13){
		$('#sendMsg').click();
	}
}
