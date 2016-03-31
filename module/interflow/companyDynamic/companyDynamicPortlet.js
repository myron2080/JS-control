/**
 * 加载进来就执行
 */
var type="all";
var flag = "all";
(function(){
	bindAEvent();	//绑定事件
	loadCompayDynamicData(1,type);	//加载数据
})();

function clickFilter(t,vthis,fid) { 
	$("font[color='#008bbf']").attr("color","");
	$("#"+fid).attr("color","#008bbf");
	type = t;
	loadCompayDynamicData(1,type);
}

/**
 * 滚动到底端回调的函数  
 * 滚动的函数在common.js里面
 */
function scrollLoadBackFun(){
	var $_div = $("div[name='queryMoreBtn']");
    if($_div.length > 0){
   	 loadCompayDynamicData($_div.attr("pageNo"),type);
    }
}

function refreshUI(){
	$(".dynamic-body").html("");
	loadCompayDynamicData(1,type);
}

/**
 * 绑定动态类型的点击事件
 */
function bindAEvent(){
	$("div[dynamicType] a").each(function(i){
		$(this).bind("click",function(){
			top.addTabItem($(this).attr("tabId"),$(this).attr("openUrl"),$(this).html());
		});
	});
}

/**
 * 展开和收起文本
 * @param obj
 */
function openOrCloseText(obj){
	if("show" == $(obj).attr("key")){
		$(obj).prev("b").html($(obj).attr("allText"));
		$(obj).attr("key","hide");
		$(obj).html("[收起]");
	} else {
		$(obj).prev("b").html($(obj).attr("partText"));
		$(obj).attr("key","show");
		$(obj).html("[展开]");
	}
}

/**
 * 加载公司动态数据
 */
function loadCompayDynamicData(pageNo,type){
	$(".dynamic-body").find("div[name='queryMoreBtn']").remove();
	$.post(getPath()+"/interflow/companyDynamic/detail",{pageNo:pageNo,type:type},function(data){
		if(type != flag){
			$('.dynamic-bodylist').remove();
			flag = type;
		}
		//convert2face(getPath(),data);
		
		$(".dynamic-body").append(convert2face(getPath(),data));
		EnlargerImg.init({
			type:'enlararr'
		});		//放大图片
		
		personPop.init();	//悬浮头像
	});
}

String.prototype.replaceAll = function (str1,str2){
	  var str    = this;     
	  var result   = str.replace(eval("/\["+str1+"\]/g"),str2);
	  return result;
	}
//查看单条公司公告
function viewNotice(id){
	var height = 450;
	var topH  = $(document).scrollTop()+(document.body.clientHeight-height-70)/2;
	var hasY = hasScroll(window.document).Y ; 
	if(hasY){
		$(window.document).find('body').css({overflow:"hidden"});    //禁用滚动条
	}
	art.dialog.open(getPath()+'/interflow/notice/selectById?id='+id,
		{title:"查看公告",
			lock:true,
			width:830,
			height:450,
//			top:topH+'px',
			id:'NOTICE-VIEW',
			close:function(){
				if(hasY){
					$(window.document).find('body').css({overflow:"scroll"});    //启用滚动条
				}
			}
		}
	);
}

//单条制度发文查看
function viewInstitution(id){
	var height = 450;
	var topH  = $(document).scrollTop()+(document.body.clientHeight-height-70)/2;
	var hasY = hasScroll(window.document).Y ; 
	if(hasY){
		$(window.document).find('body').css({overflow:"hidden"});    //禁用滚动条
	}
	art.dialog.open(getPath()+'/interflow/institution/selectById?id='+id,
		{title:"查看制度发文",
			lock:true,
			width:830,
			height:height,
//			top:topH+'px',
			id:'NOTICE-VIEW',
			close:function(){
				if(hasY){
					$(window.document).find('body').css({overflow:"scroll"});    //启用滚动条
				}
			}
		}
	);
}

//删除开单战报
function deleteBill(id){
	
	art.dialog.confirm("确定删除这条战报吗？",function(){
		$.post(getPath()+"/interflow/bill/deteleById",{id:id},function(data){
			art.dialog.tips("删除成功",null,"succeed");
			refreshUI();
		},"json");
	});
}

//删除公司公告
function deleteNotice(id){
	var topH  = (document.body.clientHeight-70)/2;
	art.dialog.confirm("确定删除该条公告吗?",function(){
		$.post(getPath()+"/interflow/notice/deteleById",{id:id},function(data){
			data = eval('('+data+')');
			art.dialog({
				content:data.MSG,
				time:2,
				close:function(){
					refreshUI();
				},
				width:200
			});
		});
	});
}

/**
 * 编辑公告
 * @param id
 */
function editNotice(obj,id){
	var height = 500;
	var topH  = $(document).scrollTop()+(document.body.clientHeight-height-70)/2;
	var flag = false;
	art.dialog.data("result",null);
	var hasY = hasScroll(window.document).Y ; 
	if(hasY){
		$(window.document).find('body').css({overflow:"hidden"});    //禁用滚动条
	}
	var dlg = art.dialog.open(getPath()+"/interflow/notice/editNotice?id="+id,{
			title:'修改公告',
			 lock:true,
			 width:'800px',
			 height:height+'px',
			 id:"editNotice",
//			 top:topH+"px",
			 close:function(){
				 if(flag){
					 refreshUI();
				 }
				 if(hasY){
						$(window.document).find('body').css({overflow:"scroll"});    //启用滚动条
				}
				 return true;
			 },
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.valiNoticeForm){
						dlg.iframe.contentWindow.valiNoticeForm(dlg);
						flag = true;
					}
					
					return false;
				}},{name:'取消',callback:function(){
					
					return true;
				}}]
		});
}

/**
 * 编辑开单战报
 * @param id
 */
function editBill(obj,id){
	var height = 500;
	var topH  = $(document).scrollTop()+(document.body.clientHeight-height-70)/2;
	var flag = false;
	var hasY = hasScroll(window.document).Y ; 
	if(hasY){
		$(window.document).find('body').css({overflow:"hidden"});    //禁用滚动条
	}
	var dlg = art.dialog.open(getPath()+"/interflow/bill/editBill?id="+id,{
		title:'修改战报',
		 lock:true,
		 width:'800px',
		 height:height+'px',
		 id:"editBill",
//		 top:topH+"px",
		 close:function(){
			 if(flag){
				 refreshUI();
			 }
			 if(hasY){
					$(window.document).find('body').css({overflow:"scroll"});    //启用滚动条
			}
			},
			cancel:function(){
				
			},
			ok:function(){
				 if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.validateBillForm){
					 dlg.iframe.contentWindow.validateBillForm(dlg);
					 flag = true;
				}
				return false;
			}
	});
}

/**
 * 修改制度
 * @param id
 */
function editInstitution(obj,id){
	var height = 500;
	var topH  = $(document).scrollTop()+(document.body.clientHeight-height-70)/2;
	var flag = false;
	art.dialog.data("result",null);
	var hasY = hasScroll(window.document).Y ; 
	if(hasY){
		$(window.document).find('body').css({overflow:"hidden"});    //禁用滚动条
	}
	var dlg = art.dialog.open(getPath()+"/interflow/institution/editInstitution?id="+id,{
			title:'修改制度发文',
			 lock:true,
			 width:'800px',
			 height:height+'px',
			 id:"editInstitution",
//			 top:topH+"px",
			 close:function(){
				 if(flag){
					 refreshUI();
				 }
				 if(hasY){
						$(window.document).find('body').css({overflow:"scroll"});    //启用滚动条
				}
				 return true;
			 },
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.valiInstitutionForm){
						dlg.iframe.contentWindow.valiInstitutionForm(dlg);
						flag = true;
					}
					
					return false;
				}},{name:'取消',callback:function(){
					
					return true;
				}}]
		});
}

/**
 * 删除制度
 * @param id
 */
function deleteInstitution(id){
	art.dialog.confirm('确定删除该条制度发文吗?',function(){
		$.post(getPath()+"/interflow/institution/deteleById",{id:id},function(data){
			data = eval('('+data+')');
			art.dialog({
				content:data.MSG,
				time:2,
				close:function(){
					refreshUI();
				},
				width:200
			});
		});
	});
}

/**
 * 查看评论
 * @param obj
 * @param id
 */
function viewbill(obj,id){
	if($("#reply_talk_"+id).css("display")=='none'){
		$("#reply_talk_"+id).show();
		initBillCommentData($("#reply_list_"+id),id);
	}else{
		$("#reply_talk_"+id).hide();
		
	}
	
}

/**
 * 增加评论
 * @param obj
 * @param billId
 */
function addBillComment(obj,billId){
	$(obj).attr("disabled",true);
	var creatorById = $("#creatorById_"+billId).val();
	var orgById = $("#orgById_"+billId).val();
	var content = $("#rely_content_"+billId).val();
	if(content==""){
		art.dialog.tips('评论不能为空！');
		return
	}else{
		$.post(getPath()+"/interflow/billComment/addBillComment",{billId:billId,reContent:content,creatorBy:creatorById,orgBy:orgById},function(data){
			$("#rely_content_"+billId).val("");
			
			initBillCommentData($("#reply_list_"+billId),billId);
			$(obj).attr("disabled",false);
			
		});
	}
}

/**
 * 加载开单战报的评论
 * @param obj
 * @param billId
 */
function initBillCommentData(obj,billId){
	$.post(getPath()+"/interflow/billComment/getAllReply",{billId:billId},function(res){
		$(obj).html('');
		var data = res.comment;
		var clickCount = res.clickCount;		
		$("#reply_click_"+billId).html(clickCount);
		$("#reply_comment_"+billId).html(data.length);
		for(var i = 0;i<data.length;i++){
			var photo ="";
			if(data[i].reCreator.photo){
				
				photo="images/"+data[i].reCreator.photo;
			}else{
				photo = "default/style/images/home/man_head.gif";
			}		
			   var hmcom = "<dl>";
			   hmcom +="<dt class='talk-avatar'><img src='"+getPath()+"/"+photo+"'/></dt>";
			   hmcom += "<dd class='talk-msg'><div class='talk-replyBox'><p><b class='fl link-blue'>"+data[i].belongOrg.name+"："+data[i].reCreator.name+"</b></p>";
			   hmcom +="<p>"+convertImg(data[i].reContent)+"</p>";
			   hmcom +="<p>";
			   hmcom +="<b class='fl color999'>"+data[i].dateStr+"</b>";
			   hmcom +="<b class='fr'><a class='link-blue' onclick=toBillReplyStr('"+billId+"','"+data[i].reCreator.name+"','"+data[i].reCreator.id+"','"+data[i].belongOrg.id+"') href='javascript:void(0)'>回复</a></b>";
			   hmcom +="</p>";
			   hmcom +="</div>";
			   hmcom +="</dd>";
			   hmcom +="</dl>";
			   
			   $(hmcom).appendTo($(obj));
			   
		}
		
	});
}

/**
 * 回复操作
 * @param billId
 * @param reCreatorName
 * @param creatorById
 * @param orgById
 */
function toBillReplyStr(billId,reCreatorName,creatorById,orgById){
	$("#creatorById_"+billId).val(creatorById);
	$("#orgById_"+billId).val(orgById);
	$("#rely_content_"+billId).val("回复"+reCreatorName+":");
}