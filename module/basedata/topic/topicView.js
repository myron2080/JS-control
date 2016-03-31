function  initTopicComment(){
	 var  topicid = $("#topicid").val();
	 
	 $.post(getPath()+"/basedata/topicNewList/getTopicCommentData",{topicid:topicid},function(data){
		 var _blog_html="";
		 $("#topicCommentDiv").html("");
		 if(data){
				var _items = data.items;
				for ( var i = 0; i < _items.length; i++) {
					_blog_html = "<div class=\"wb_screen blues\" id=\"_items_"+i+"\">";
					_blog_html +='<input type=hidden value='+_items[i].id+' id=objId />';
					_blog_html +='<input type=hidden value=BLOG id=type />';	
					_blog_html +="<div class=\"myface\" person-pop="+_items[i].creator.number+" pop-name="+_items[i].creator.name+" >";
					var _photo = _items[i].creator.photo==null?""+base+"/images/home/man_head.gif":imgBase+"/"+_items[i].creator.photo;
					//微博头像
					_blog_html +="<img src="+_photo+" width=\"66\" height=\"65\" onerror=\"this.src='"+base+"/default/style/images/home/man_head.gif'\"/>";
					_blog_html +="</div>";
					_blog_html +="<div class=\"wb_detail\">";
					_blog_html +="<div class=\"wb_arrow\">";
//					_blog_html +="<a href=javascript:void(0)></a>";
					_blog_html +="</div>";
					_blog_html +="<div class=\"wb_text\">";
//					var _phone = _items[i].creator.shortNumber==null?"":"-"+_items[i].creator.shortNumber;
					//用户信息
					_blog_html +="<div class=\"name\">"+_items[i].creator.name+"（"+_items[i].org.name+"）</div>";
					_blog_html +="<div class=\"box\">";
					//微博内容
					_blog_html +="<div style=\"width: 520px;\" class=\"textarea\" id=content >"+convertImg(_items[i].content)+"</div>";
					//微博照片
					if(isNotNull(_items[i].photoUrl)){
						_blog_html +="<A ><img enlarger="+getPath()+"/"+_items[i].photoUrl.replace("size","origin")+" src="+getPath()+"/"+_items[i].photoUrl.replace("size","100X100")+" /></A>";
					}
					_blog_html +="</div>";
					_blog_html +="<div style='margin-left: 400px;'>"+_items[i].formatDate+"</div>";
//					_blog_html +="<div class=\"bottom_line01\">"+_itmes[i].createrTime;
					$("#topicCommentDiv").append(_blog_html);
				}
		 }
		//初始化头像浮动框
		personPop.init();
		//图片放大
		EnlargerImg.init();
		 
	 },'json');
}



function topicSubmitForm(){
	 var bottuns;
  if(currentDialog){
	   bottuns=currentDialog.config.button;
	   $(bottuns).each(function(){
		  var name=this.name; 
		  currentDialog.button({name:name,disabled:true});
	   });
	}
	$.ajax({
		url:$('form').attr('action'),
		dataType: "json",
		type:"POST",
		data: $('form').serialize(),
		success: function(res) {
			if(res.STATE == "SUCCESS"){
				if(res.MSG){
//					art.dialog({
//						icon: 'succeed',
//					    time: 1,
//					    content: res.MSG
//					});
					$("#content").val("");
					$("#photoUrl").val("");
					$("#imgDiv").hide();
					$("#closeDiv").hide();
					$("#imgDiv").html('<img id="img" src="" style="margin-left: 0px" />');
					initTopicComment();
				}else{
//					art.dialog.close();
				}
			}else{
				if(currentDialog){
					$(bottuns).each(function(){
					  var name=this.name; 
					  currentDialog.button({name:name,disabled:false});
				    });
					if(currentDialog.iframe.contentWindow && currentDialog.iframe.contentWindow.saveFail){
						currentDialog.iframe.contentWindow.saveFail(res);
					}
				}
				art.dialog.alert(res.MSG);
			}
		},
		error:function(){
			if(currentDialog){
				$(bottuns).each(function(){
				  var name=this.name; 
				  currentDialog.button({name:name,disabled:false});
			    });
			}
		}
	});
	
}

/**
 * 修改问题反馈信息
 */
function updateTopic(obj){
	var  topicid = $("#topicid").val();
	var saq = $("#saq").val();
	if(saq==0 &&  obj=='checkbox'){
		saq=1;
	}else if(saq==1 && obj=='checkbox'){
		saq=0;
	}
	
	$.post(getPath()+"/basedata/topicNew/updateTopic",{id:topicid,status:$("#status").val(),saq:saq},function(data){
		art.dialog.tips('操作成功');
//		if(data.STATE == "SUCCESS"){
//			if(data.MSG){
//				 art.dialog({
//				 icon: 'succeed',
//				 time: 1,
//				 content: data.MSG});
//			
//			}else{
//				
//			}
//		}else{
//			if(currentDialog){
//				$(bottuns).each(function(){
//				  var name=this.name; 
//				  currentDialog.button({name:name,disabled:false});
//			    });
//				if(currentDialog.iframe.contentWindow && currentDialog.iframe.contentWindow.saveFail){
//					currentDialog.iframe.contentWindow.saveFail(data);
//				}
//			}
//			art.dialog.alert(data.MSG);
	});
}