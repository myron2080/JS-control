initBillData = function(page){
	$("#billMessage").html("");
	//录入时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["createTime2"]){
		queryStartDate = MenuManager.menus["createTime2"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["createTime2"].getValue().timeEndValue;
	}
	var name = $("#billCon").val();
	if(name=="开单人/发布人"){
		name='';
	}
	var type = $("#type").val();
	$.post(getPath()+"/interflow/bill/getAllBill",{page:page,size:9,startDate:queryStartDate,endDate:queryEndDate,searchName:name,type:type},function(pag){
		$("#loading").hide();
		if(pag){
			var data = pag.items;
			for(var i = 0;i < data.length; i++){
				var imgUrl = "zuanshi.png";
				var levelName = "";
				if(data[i].level=='DIAMOND'){
					imgUrl = "zuanshi.png";
					levelName = "钻石单";
				}else if(data[i].level=="GLOD"){
					imgUrl = "jin.png";
					levelName = "黄金单";
				}else if(data[i].level=="CROWN"){
					imgUrl = "huangguan.png";
					levelName = "皇冠单";
				}else if(data[i].level=="SILVER"){
					imgUrl = "yin.png";
					levelName = "银单";
				}else{
					imgUrl = "tong.png";
					levelName = "铜单";
				}
				//alert(screen.width);
				var classhtm = '<div class="success_news03k">';
				if(screen.width == 1024 && screen.height == 768) classhtm = '<div class="success_news03">';
				if(screen.width == 1152 && screen.height == 864) classhtm = '<div class="screen1152864">';
				if(screen.width == 1280 && screen.height == 600) classhtm = '<div class="screen1280600">';
				if(screen.width == 1280 && screen.height == 720) classhtm = '<div class="screen1280720">';
				if(screen.width == 1280 && screen.height == 800) classhtm = '<div class="screen1280800">';
				if(screen.width == 1280 && screen.height == 960) classhtm = '<div class="screen1280960">';
				if(screen.width == 1280 && screen.height == 1024) classhtm = '<div class="screen12801024">';
				if(screen.width == 1360 && screen.height == 768) classhtm = '<div class="screen1360768">';
				if(screen.width == 1366 && screen.height == 768) classhtm = '<div class="screen1366768">';
				if(screen.width >= 1440 && screen.height >= 900) classhtm = '<div class="screen1440900">';
				
				var photosStr = "";
				if(data[i].photos){
					for(var k = 0;k < data[i].photos.length; k++){
						var photo = data[i].photos[k];
						photosStr += '<a href="javascript:void(0)"><img enlarger="'+getPath()+'/images/' + photo.replace("size","origin")+'"  src="'+getPath()+'/images/'+photo.replace("size","150X100")+'" /></a>';
	                }
				}
				
				var photo = data[i].biller.photo==null || data[i].biller.photo==''?"default/style/images/home/man_head.gif":"images/"+data[i].biller.photo;
				$('<div class="success_news01">'+
                '<div class="success_news02" person-pop='+data[i].biller.number+' pop-name='+data[i].biller.name+' ><img onerror="this.src=\''+base+'/default/style/images/home/man_head.gif\'" src="'+base+'/'+photo+'" /></div>'+
                classhtm 
                + '<div class="sn">'+
                         '<div class="sn_line">'+
				              '<div class="sn_left">'+
				                   '<h1>'+
				                      '<a style="color:#333;" onclick="toBillReply(\'billReply'+i+'\','+i+',\''+data[i].id+'\',\''+data[i].biller.id+'\')">'+(data[i].projectName!=null && data[i].projectName!=''?"《"+data[i].projectName+"》":"")+''+data[i].title+'</a>'+
				                   '</h1>'+
                              '</div>'+
				              '<div class="sn_right">'+
				                    '<img src="'+getPath()+'/default/style/images/home/'+imgUrl+'"/>'+
			                        levelName+'</span>'+
				              '</div>'+
				         '</div>'+
                         '<div class="sn_list">'+
                         photosStr+
                               '<ul>'+
                         '<li>点击<span id="clickspan'+i+'">('+data[i].clickCount+')</span></li><li>'+                  
                        ((currentId==data[i].creator.id||usertype=='T01')?'<a href=javascript:editbill("'+data[i].id+'")>修改</a>':'')+'</li><li>'+
                         ((currentId==data[i].creator.id||usertype=='T01')?'<a href=javascript:deletebill("'+data[i].id+'")>删除 </a>':'')+'</li>'+
                         '<li><a href="javascript:toBillReply(\'billReply'+i+'\','+i+',\''+data[i].id+'\',\''+data[i].biller.id+'\')">查看内容并评论('+data[i].replyCount+')</a></li>'+
                              '</ul>'+
                         '</div>'+
                    '</div>'+
                    '<div id="str'+i+'" style="display:none">'+ '<p>'+data[i].dateStr+'&nbsp;'+data[i].creator.name+'发布</p><div class="sn_pl">'+data[i].content+'</div>'+'</div>'+
                    '<div class="success_list" style="display:none" id="billReply'+i+'"/>'+
                    '</div>'+
                    '</div>').appendTo("#billMessage");
			}
			var totalPage = pag.recordCount%pag.pageSize==0?(pag.recordCount/pag.pageSize):Math.floor(pag.recordCount/pag.pageSize)+1;
			var pagediv = "<div><font>当前第"+pag.currentPage+"页,共"+totalPage
			+"页</font><a href='javascript:void(0)' id='prev' onclick=pagGetBillData("+pag.currentPage+",'prev',"+totalPage+")>上一页</a>"		
			+"<a href='javascript:void(0)' id='next' onclick=pagGetBillData("+pag.currentPage+",'next',"+totalPage+")>下一页</a></div>";
			$("#Pagination").html(pagediv);
			EnlargerImg.init();	//放大图片
		}
		personPop.init();
		$("#billMessage").mCustomScrollbar();
	});
	
}

function pagGetBillData(page,id,count){
	if(id=="prev"){
		if(page==1){
			art.dialog.tips('已经是第一页');
			return
		}else{
			initBillData(page-1);
		}
	}else{
		if(page==count){
			art.dialog.tips('已经是最后一页');
			return
		}else{
			initBillData(page+1);
		}
	}
}
function PageCallback(index, jq) {             
	initBillData(index);  
}  
function addBill(){
var dlg = art.dialog.open(getPath()+"/interflow/bill/addBill",{
		title:'发布战报',
		 lock:true,
		 width:'800px',
		 height:'540px',
		 id:"addBill",
		 close:function(){
			 if(dlg.iframe.contentWindow){
				 return true
			 }
			},
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.validateBillForm){
						dlg.iframe.contentWindow.validateBillForm(dlg);
					}
					
					return false;
				}},{name:'取消',callback:function(){
					
					return true;
				}}]
	});
	
}
/**
 * 得到战报的所有评论
 * divId：评论内容展示的div
 * index：下标
 * billId：战报主贴ID
 */
toBillReply = function(divId,index,billId,creatorById){
	if($("#"+divId).css("display")=="none"){
		$("#"+divId).html('');
	$("#"+divId).show();
	$("#str"+index).show();
		var htmlStr ='<div class="common_arrow"><em class="common_arrow01"></em><span class="common_arrow02"></span></div>'+
        '<div class="srbox01"><textarea name="reContent'+index+'" id="reContent'+index+'" cols="" rows=""></textarea></div>'+
         '<div class="aline01">'+
             '<div class="aline01_left"><img src="'+getPath()+'/default/style/images/Announcement02.png"/>'+ 
             '<a href="javascript:void(0)" onclick="show(\'reContent'+index+'\')">表情</a> <img src="'+getPath()+'/default/style/images/Announcement01.png"/>'+ 
             '<a href="javascript:void(0)" onclick="offenLang(this,\'reContent\','+index+',0)">常用语</a></div>'+
             '<div class="aline01_right"><input type="hidden" id="creatorById'+index+'"/><input type="hidden" id="orgById'+index+'"/><input class="pinglun_btn01" type="button" onclick="addBillComment('+index+',\''+billId+'\')" value="发表评论"></div>'+
    		 '</div>'+
             '<div class="amessages01" id="billReplyContent'+index+'"></div>';
		$(htmlStr).appendTo("#"+divId);
		initBillCommentData("billReplyContent"+index,index,billId);
	}else{
		$("#"+divId).hide();
		$("#str"+index).hide();
	}
}

/**
 * 系统消息  展开查看战报评论
 */
toBillReplyMsg = function(divId,index,billId,creatorById,orgById){
        $("#"+divId).html('');
		var htmlStr ='<div class="common_arrow"><em class="common_arrow01"></em><span class="common_arrow02"></span></div>'+
        '<div class="srbox01"><textarea name="reContent'+index+'" id="reContent'+index+'" cols="" rows=""></textarea></div>'+
         '<div class="aline01">'+
             '<div class="aline01_left"><img src="'+getPath()+'/default/style/images/Announcement02.png"/>'+ 
             '<a href="javascript:void(0)" onclick="show(\'reContent'+index+'\')">表情</a> <img src="'+getPath()+'/default/style/images/Announcement01.png"/>'+ 
             '<a href="javascript:void(0)" onclick="offenLang(this,\'reContent\','+index+',0)">常用语</a></div>'+
             '<div class="aline01_right"><input type="hidden" value="'+creatorById+'" id="creatorById'+index+'"/><input type="hidden" value="'+orgById+'" id="orgById'+index+'"/><input class="pinglun_btn01" type="button" onclick="addBillComment('+index+',\''+billId+'\')" value="发表评论"></div>'+
    		 '</div>'+
             '<div class="amessages01" id="billReplyContent'+index+'"></div>';
		$(htmlStr).appendTo("#"+divId);
		initBillCommentData("billReplyContent"+index,index,billId);
}
initBillCommentData = function(contentId,index,billId){
	$.post(getPath()+"/interflow/billComment/getAllReply",{billId:billId},function(res){
		var data = res.comment;
		var clickCount = res.clickCount;
		$("#clickspan"+index).html("("+clickCount+")");
		$("#"+contentId).html('');
		for(var i = 0;i<data.length;i++){
			var photo ="";
			if(data[i].reCreator.photo){
				
				photo="images/"+data[i].reCreator.photo;
			}else{
				photo = "default/style/images/home/man_head.gif";
			}
			
				var replyStr = "";
			   if(currentId!=data[i].reCreator.id){
			    replyStr = "<a style='color:#608fbf;' href='javascript:toBillReplyStr("+index+",\""+data[i].reCreator.name+"\",\""+data[i].reCreator.id+"\",\""+data[i].belongOrg.id+"\")'><img src='"+getPath()+"/default/style/images/home_img05.png'/>回复</a></span></p>";
			   }else{
			   replyStr = "</span></p>";
			   }
			   var hmcom = "<dl id='billReply"+i+"'>";
			   hmcom +="<dt><img src='"+getPath()+"/"+photo+"'/></dt>";
			   hmcom += "<dd><p><span class='btleft01'>"+data[i].belongOrg.name+"："+data[i].reCreator.name+"&nbsp;&nbsp;&nbsp;"+data[i].dateStr+"</span> ";
			   hmcom += " <span class='btright01'>";
			   hmcom += (currentId==data[i].reCreator.id?"<a href='javascript:delBillComment(\""+data[i].id+"\","+i+",\""+billId+"\")'>删除</a>&nbsp;&nbsp;":"");         
			   hmcom += replyStr+"<p class='afont02'>"+convertImg(data[i].reContent)+"</p>";
			   hmcom += "</dd>"+"</dl>";
			   $(hmcom).appendTo("#billReplyContent"+index);
			   
		}
		personPop.init();
	});
}
addBillComment = function(index,billId){
	var creatorById = $("#creatorById"+index).val();
	var orgById = $("#orgById"+index).val();
	var content = $("#reContent"+index).val();
	if(content==""){
		art.dialog.tips('评论不能为空！');
		return
	}else{
	$.post(getPath()+"/interflow/billComment/addBillComment",{billId:billId,reContent:content,creatorBy:creatorById,orgBy:orgById},function(data){
		$("#reContent"+index).val("");
		$("#billReply"+index).show();
		initBillCommentData("billReplyContent"+index,index,billId);
		//content,url,msgType,topicId,creatorById,orgById
		//insertOtherMessage($("#neirong"+index).html(),"","BILL",billId,creatorById,orgById);
		
	});
	}
}

delBillComment = function(id,index,billId){
	$.post(getPath()+"/interflow/billComment/delBillComment",{id:id},function(data){
		if(data==1){
			art.dialog.tips("删除成功",null,"succeed");
			$("#billReply"+index).hide();
			toBillReply(index,billId);
		}else{
			art.dialog.tips("删除成功",null,"succeed");
			$("#billReply"+index).hide();
			toBillReply(index,billId);
		}
	});
}

deletebill = function(id){
	art.dialog.confirm("确定删除这条战报吗?",function(){		
		$.post(getPath()+"/interflow/bill/deteleById",{id:id},function(data){
			art.dialog.tips("删除成功",null,"succeed");
			initBillData();
		},"json");
	},function(){});
}

toBillReplyStr = function(index,reCreatorName,creatorById,orgById){
	$("#creatorById"+index).val(creatorById);
	$("#orgById"+index).val(orgById);
	$("#reContent"+index).val("回复"+reCreatorName+":");
}

removeDiv = function(obj){
	$("#"+obj).remove();
}

editbill = function(id){
	var dlg = art.dialog.open(getPath()+"/interflow/bill/editBill?id="+id,{
		title:'修改战报',
		 lock:true,
		 width:'800px',
		 height:'540px',
		 id:"editBill",
		 close:function(){
			 if(dlg.iframe.contentWindow){
				 return true
			 }
			},
			cancel:function(){
				initBillData();
			},
			ok:function(){
				 if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.validateBillForm){
					 dlg.iframe.contentWindow.validateBillForm(dlg);
				}
				return false;
			}
	});
}

function getBillType(){
	$.post(getPath()+"/interflow/bill/getBillTypes",function(data){
		
		var htmlStr='<option value="">全部战报</option>';
		for(var i =0;i<data.length;i++){
			htmlStr +='<option value="'+data[i].value+'">'+data[i].name+'</option>';
		}
		$(htmlStr).appendTo("#type");
	},'json');
}

