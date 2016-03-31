		//打电话
		function dialPhone(obj){
			var tabObj = $(obj).parents("table") ;
			var phone = $("span[name='mobile']",tabObj).text();
			var name =  $("span[name='name']",tabObj).text();
			CallOut.show(name, phone);
		}
		//发短信
		function sendMsg(obj){
			var tabObj = $(obj).parents("table") ;
			var personId = $("input[name='cid']",tabObj).val();
			$.ligerDialog.open({height:460,
				width:660,
				url: getPath()+"/cmct/note/topicMessage?personId="+personId,
				title:"发送短信",
				isResize:true,
				isDrag:true}
			);
		}
		//发邮件
		function sendEmail(obj){
			//art.dialog.tips("暂未开放邮箱");
			var openUrl = "" ;
			openUrl = ctx + "/qqmail/ssologin" ;
			top.addTabItem("tab_mail", openUrl , "邮件发送");
		}
		//发私信
		function sendPrivateLetter(obj){
			var tabObj = $(obj).parents("table") ;
			var personId = $("input[name='cid']",tabObj).val();
			if(personId == null || personId == ''){
				art.dialog.tips("数据丢失，未能打开");
			}else{
				var dlg = art.dialog.open(getPath()+"/basedata/cchatNew/toDetail?id="+personId,{
					id : 'detail',
					title:"鼎尖聊聊",
					width : 620,
					height : 510,
					lock:true
				});
			}
		}
