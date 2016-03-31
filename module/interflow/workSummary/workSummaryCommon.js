function addWorkSummary(){
	art.dialog.data("result",null);
	var dlg = art.dialog.open(getPath()+"/interflow/workSummary/addWorkSummary",{
			title:'发布工作总结',
			 lock:true,
			 width:'750px',
			 height:'425px',
			 id:"addBill",
			 close:function(){
				 return true;
				
			 },
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.valiWorkSummaryForm){
						dlg.iframe.contentWindow.valiWorkSummaryForm(dlg);
					}
					
					return false;
				}},{name:'取消',callback:function(){
					
					return true;
				}}],
			close:function(){
				queryData();
			}
		});
}

function queryData(cur){
	var status = $("#workSummaryStatus").val();
	var type = $("#summaryType").val();
	var keyword = $("#keyword").val();
	var includeLeav="";
	if($('#includeChild').attr("checked")){
		includeChild="1";
	}else{
		includeChild="0";
	}
	
	if(keyword=='搜索标题、内容、录入人')keyword = '';
	var para = {};
	para.includeChild=includeChild;
	para.summaryType = type;
	para.workSummaryType = status;
	if(cur)
		para.page = cur;
	else
		para.page =  1;
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["createTime"]){
		queryStartDate = MenuManager.menus["createTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["createTime"].getValue().timeEndValue;
	}
	para.workType=$('#workType option:selected').val();
	para.startDate = queryStartDate;
	para.endDate = queryEndDate;
	para.personId = currentId;
	para.pageSize = 10;
	para.name = keyword;
	para.orgId=$('#orgId').val();
	para.jobs = $("#jobs").val();
	$('#loadingDiv').show();
	$.post(getPath()+"/interflow/workSummary/getSummaryPage",para,function(data){
		$('#loadingDiv').hide();
		$(".audit-content").html('');
		$(".audit-content").html($(data).find("#searchlist").html());
		
		$("#pagediv").html('');
		$("#pagediv").html($(data).find("#pagediv").html());
		EnlargerImg.init();
		personPop.init();
	});
}

function pagesearch(cur){
		queryData(cur);
}

function downFile(id){
	$("#fileForm").attr("src",getPath()+"/basedata/attach/downFile?id="+id);
}

function viewbill(obj,id){
	if($("#reply_talk_"+id).css("display")=='none'){
		
		$("#reply_talk_"+id).show();
		initBillCommentData($("#reply_list_"+id),id);
	}else{
		
		$("#reply_talk_"+id).hide();
		
	}
	
}

function editwork(obj,id){
	art.dialog.data("result",null);
	var dlg = art.dialog.open(getPath()+"/interflow/workSummary/editWorkSummary?id="+id,{
			title:'修改工作总结',
			 lock:true,
			 width:'800px',
			 height:'500px',
			 id:"editBill",
			 close:function(){
				 return true;
			 },
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.valiWorkSummaryForm){
						dlg.iframe.contentWindow.valiWorkSummaryForm(dlg);
					}
					
					return false;
				}},{name:'取消',callback:function(){
					
					return true;
				}}],
				close:function(){
					queryData();
				}
		});
}

function delwork(obj,id){
	artDialog.confirm("确定删除该条工作总结吗?",function(){
		$.post(getPath()+"/interflow/workSummary/deteleById",{id:id},function(data){
			data = eval('('+data+')');
			art.dialog({
				content:data.MSG,
				time:2,
				close:function(){
					queryData();
				},
				width:200
			});
		});
	},function(){})
}

toBillReplyStr = function(billId,reCreatorName,creatorById,orgById){
	
	$("#rely_content_"+billId).val("回复"+reCreatorName+":");
}

initBillCommentData = function(obj,billId){
	$.post(getPath()+"/interflow/workSummaryComment/getComment",{workSummaryId:billId},function(res){
		$(obj).html('');
		var data = res.comment;
		var clickCount = res.clickCount;		
		$("#reply_click_"+billId).html(clickCount);
		$("#summary_comment_"+billId).html(data.length);
		for(var i = 0;i<data.length;i++){
			var photo ="";
			if(data[i].reCreator.photo){
				
				photo="images/"+data[i].reCreator.photo;
			}else{
				photo = "default/style/images/home/man_head.gif";
			}		
			   var hmcom = "<dl>";
			   hmcom +="<dt class='kd-avatar01'><img src='"+getPath()+"/"+photo+"'/></dt>";
			   hmcom += "<dd class='kd_msg01'><div class='replyBox01'><p><b class='fl link-blue'>"+data[i].reOrg.name+"："+data[i].reCreator.name+"&nbsp;&nbsp;&nbsp;"+data[i].dateStr+"</b> ";
			   hmcom += " <b class='fr'><a class='kd-talk-ico03' onclick=toBillReplyStr('"+billId+"','"+data[i].reCreator.name+"','"+data[i].reCreator.id+"','"+data[i].reOrg.id+"') href='javascript:void(0)'>回复</a></b>"
			   hmcom += "</p>";
			   hmcom += "<p>"+convertImg(data[i].reContent)+"</p>";
			   hmcom += "</div></dd>"+"</dl>";
			   $(hmcom).appendTo($(obj));
			   
		}
		
	});
}

addBillComment = function(obj,billId){
	$(obj).attr("disabled",true);
	
	var content = $("#rely_content_"+billId).val();
	if(content==""){
		art.dialog.tips('评论不能为空！');
		return
	}else{
		$.post(getPath()+"/interflow/workSummaryComment/insertComment",{workSummaryId:billId,reContent:content},function(data){
			if(data.STATUS == "SUCCES"){
				$("#rely_content_"+billId).val("");
				initBillCommentData($("#reply_list_"+billId),billId);
				$(obj).attr("disabled",false);
			}else{
				art.dialog.tips(data.MSG);
			}
			
		},"json");
	}
}


function showall(obj,id){
	$(obj).parent().parent().find("div[key='content']").show();
	$(obj).parent().hide();
}

function hideall(obj,id){
	$(obj).parent().parent().find("div[key='preview']").show();
	$(obj).parent().hide();
}

function viewSummary(id){
	var dlg = art.dialog.open(getPath()+"/interflow/workSummary/selectById?id="+id,
			{title:'查看',
			 lock:true,
			 width:850,
			 height:600,
			 id:"viewSummary",
			 button:[{name:'关闭'}]
			});
}