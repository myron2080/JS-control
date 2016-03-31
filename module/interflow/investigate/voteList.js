$(function(){
	queryVote(); 
	bindEvent();
});

//事件绑定 
function bindEvent(){
	
	$("#toAddBtn").bind("click",addRow);	
	$("#searchBtn").bind("click",function(){queryVote();});	
	eventFun($("#keyConditions"));
	//清空
	$("#resetBtn").click(function(){
		clearDataPicker('orgF7');
		$("#keyConditions").val($("#keyConditions").attr("defaultValue"));
		$("#orgName").val($("#orgName").attr("defaultValue"));
		$("#orgId").val($("#orgId").attr("defaultValue"));
		$("#longNumber").val($("#longNumber").attr("defaultValue"));
		$("#state").find("option").first().attr("selected","selected");
	});
}


function addRow(){ 
	var $list_addUrl =  getPath()+"/interflow/vote/add";
	var flag = true;
	var dlg = art.dialog.open($list_addUrl,
			{title:"新增投票项目",
			 lock:true,
			 width:800||'auto',
			 height:520||'auto',
			 id:"投票项目-ADD",
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
						dlg.iframe.contentWindow.saveAdd(this);
					}
					return false;
				}},{name:'取消',callback:function(){
					flag = false;
					return true;
				}}],
			 close:function(){
				 if(flag){
					  
					 queryVote(); 
				 }
			 }
			});
}

function editRow(rowData){ 
	var $list_addUrl =  getPath()+"/interflow/vote/edit?id="+rowData.id;
	var flag = true;
	var dlg = art.dialog.open($list_addUrl,
			{title:"修改投票项目",
			 lock:true,
			 width:800||'auto',
			 height:520||'auto',
			 id:"投票项目-ADD",
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
						dlg.iframe.contentWindow.saveAdd(this);
					}
					return false;
				}},{name:'取消',callback:function(){
					flag = false;
					return true;
				}}],
			 close:function(){
				 if(flag){
					  
					 queryVote(); 
				 }
			 }
			});
}

function viewRow(rowData){
	var viewUrl =  getPath()+"/interflow/vote/toView?id="+rowData.id;
	//可个性化实现
	if(viewUrl && viewUrl!=''){
	 
		art.dialog.open(viewUrl,
				{title:"查看投票项目",
				lock:true,
				width:800||'auto',
				height:($(window).height()-90)||'auto',
				id:'投票项目-VIEW',
				button:[{name:'关闭'}]}
		);
	}
}

//删除行
function deleteRow(rowData){
	var $list_deleteUrl =  getPath()+"/interflow/vote/delete";
	if($list_deleteUrl && $list_deleteUrl!=''){
		art.dialog.confirm('确定删除该行数据?',function(){
			$.post($list_deleteUrl,{id:rowData.id},function(res){
				art.dialog.tips(res.MSG);
				if(res.STATE=='SUCCESS'){
					if(typeof(queryVote)=='function'){
						queryVote();
					}
					refresh();
				}
			},'json');
			return true;
		},function(){
			return true;
		});
	}
}

function changeOrg(oldValue,newValue,doc){
	$("#longNumber").val(newValue.longNumber||'');
}


function viewUnFinish(id,type){
	var dataUrl="/interflow/vote/unFinishData"
	var viewUrl =  getPath()+"/interflow/vote/unFinish?id="+id+"&type="+type+"&url="+dataUrl;
	//可个性化实现
	if(viewUrl && viewUrl!=''){
	 
		art.dialog.open(viewUrl,
				{title:"未参与人员",
				lock:true,
				width:800||'auto',
				height:450,
				id:'问卷-VIEW',
				button:[{name:'关闭'}]}
		);
	}
}

var param = {};
param.orderByClause = " D.FCREATORTIME DESC ";

function queryVote(page){
 
	param.pageSize = 10 ;
	param.currentPage = page||1 ;
	var state = $("#state").val();
	if(state){
		param.state = state ;
	}else{
		delete param.state ;
	}
	
	var keyConditions = $("#keyConditions").val();
	if(keyConditions && ($('#keyConditions').attr("defaultValue") != keyConditions)){
		param.keyConditions = keyConditions ;
	}else{
		delete param.keyConditions ;
	}
	
	var longNumber =  $("#longNumber").val();
	if(longNumber != null && longNumber != ""){
		param.longNumber = longNumber;
	}else{
		delete param.longNumber;
	}
	
	$.post(ctx+"/interflow/vote/listData",param,function(res){
		var currentUserId = $("#currentUserId").val();
		var currentUserName = $("#currentUserName").val();
		var data = res.items; 
		$("#tableContainer").html('');
		for(var i = 0;i<data.length;i++){
			 var timeDis = ' ';
			 if(data[i].timeLimitFlag=="Y"){
				 timeDis = '时间：';
				 timeDis += (data[i].startDate+'至'+data[i].endDate);
			 }
			 var stateDis = '';
			 if(data[i].state=="UNPUBLISHED"){
				 stateDis = '<b class="status-green">未发布</b>';
			 }else if(data[i].state=="PUBLISHED"){
				 stateDis = '<b class="status-gold">已发布</b>';
			 }else if(data[i].state=="HASEXPIRED"){
				 stateDis = '<b class="status-red">已过期</b>';
			 }
			 var dataHtml = '<li>'+
                            '<div class="survey-arrow"></div>'+
                            '<div class="survey-contect-list">'+
                                ' <div class="survey-cl">'+
                                      '<div class="survey-cl-l">'+
                                           '<div class="survey-cl-l01">'+
                                                '<b class="boldfont">标题：</b> <b class="font14 colorblue">'+ data[i].title+'</b>'+stateDis+
                                           '</div>'+
                                     ' </div>'+
                                      '<div class="survey-cl-l02">'+
                                           '<a class="survey-pen" href="javascript:void(0)"  style="display:'+((data[i].state=="UNPUBLISHED" && (data[i].creatorId==currentUserId || currentUserName=='admin'))?'inline;':'none;')+'"  onclick="editRow({id:\''+data[i].id+'\'})">修改</a>'+
                                           '<a class="survey-magnifier" href="javascript:void(0)" onclick="viewRow({id:\''+data[i].id+'\'})">查看</a>'+
                                           '<a class="survey-release" href="javascript:void(0)" style="display:'+((data[i].state=="UNPUBLISHED" && (data[i].creatorId==currentUserId || currentUserName=='admin'))?'inline;':'none;')+'" onclick="publish(\''+data[i].id+'\')">发布</a>'+
                                           '<a class="survey-delete" href="javascript:void(0)"  style="display:'+((data[i].creatorId==currentUserId || currentUserName=='admin')?'inline;':'none;')+'"  onclick="deleteRow({id:\''+data[i].id+'\'})">删除</a>'+
                                      '</div>'+
                                 '</div>'+
                                 '<div class="survey-cl">'+
                                  '<div class="vote-length02"><div class="vote-length03">'+ data[i].demand+
                                  '</div></div><div class="vote-length01">要求：</div></div>'+
                                  '<div class="survey-cl">'+
                                       '<p class="fl" style="padding-right:15px;"><b class="boldfont">时间：</b> <b>'+ timeDis+'</b></p>'+
                                       '<p class="fl" style="padding-right:15px;"><b class="boldfont">参与对象：</b>'+(data[i].attenderObjectType=='COMPANY'?'全公司':data[i].objectName)+'</p>'+
                                       '<p class="fl" style="padding-right:15px;"><b class="boldfont">已参与人数：</b>'+data[i].personCount+'人(<a class="colorblue" href="javascript:void(0)" onclick="viewRow({id:\''+data[i].id+'\'})">查看</a>) </p>'+
                                       '<p class="fl" style="padding-right:15px;"><b class="boldfont">未参与人数：</b>'+(data[i].totalPersonCount-data[i].personCount)+'人(<a class="colorblue" href="javascript:void(0)" onclick="viewUnFinish(\''+data[i].id+'\',\''+data[i].attenderObjectType+'\')">查看</a>) </p>'+
                                  '</div>'+
                            '</div>'+
                            
                           '</li>';
			$(dataHtml).appendTo("#tableContainer");
		}
		$("#pagelist").html('');
		var total = Math.floor(res.count%res.pageSize==0?res.count/res.pageSize:res.count/res.pageSize+1);
		$("#pagelist").html(initpagelist(page,total));
		 
	},'json');
}

function pagesearch(num){
	queryVote(num);
}


function publish(id){
	
	if(!id){
		art.dialog.tips("没有需要发布的数据！！");
		return ;
	}
	 
	$.post(getPath()+"/interflow/vote/updateState",{id:id},function(data){
		if(data.STATE == "SUCCESS"){
			art.dialog.tips("发布成功");
			queryVote();
		} else {
			art.dialog.tips(data.MSG);
		}
	},'json');
	 
}

