$(function(){
	queryDebate(); 
	bindEvent();
});

//事件绑定 
function bindEvent(){
	
	$("#toAddBtn").bind("click",addRow);	
	$("#searchBtn").bind("click",function(){queryDebate();});	
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
	var $list_addUrl =  getPath()+"/interflow/debate/add";
	var flag = true;
	var dlg = art.dialog.open($list_addUrl,
			{title:"新增辩论项目",
			 lock:true,
			 width:800||'auto',
			 height:520||'auto',
			 id:"辩论项目-ADD",
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
					 queryDebate(1);
					 
				 }
			 }
			});
}

function editRow(rowData){ 
	var $list_addUrl =  getPath()+"/interflow/debate/edit?id="+rowData.id;
	var flag = true;
	var dlg = art.dialog.open($list_addUrl,
			{title:"修改辩论项目",
			 lock:true,
			 width:800||'auto',
			 height:520||'auto',
			 id:"辩论项目-ADD",
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
					  
					 
				 }
			 }
			});
}

function viewRow(rowData){
	var viewUrl =  getPath()+"/interflow/debate/toView4Host?id="+rowData.id;
	//可个性化实现
	if(viewUrl && viewUrl!=''){
	 
		art.dialog.open(viewUrl,
				{title:"查看辩论项目",
				lock:true,
				width:800||'auto',
				height:($(window).height()-90)||'auto',
				id:'辩论项目-VIEW',
				button:[{name:'关闭'}]}
		);
	}
}

//删除行
function deleteRow(rowData){
	var $list_deleteUrl =  getPath()+"/interflow/debate/delete";
	if($list_deleteUrl && $list_deleteUrl!=''){
		art.dialog.confirm('确定删除该行数据?',function(){
			$.post($list_deleteUrl,{id:rowData.id},function(res){
				art.dialog.tips(res.MSG);
				if(res.STATE=='SUCCESS'){
					if(typeof(queryDebate)=='function'){
						queryDebate();
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


function viewUnFinish(id,type,consType,debateType){
	var dataUrl="/interflow/debate/unFinishData"
	var viewUrl =  getPath()+"/interflow/debate/unFinish?id="+id+"&type="+type+"&url="+dataUrl+"&consType="+consType+"&debateType="+debateType;
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

function queryDebate(page){
 
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
	
	$.post(ctx+"/interflow/debate/listData",param,function(res){
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
				 stateDis = '<p class="status-gold">未发布</p>';
			 }else if(data[i].state=="PUBLISHED"){
				 stateDis = '<p class="status-green">已发布</p>';
			 }else if(data[i].state=="HASEXPIRED"){
				 stateDis = '<p class="status-red">已过期</p>';
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
                                           '<a class="survey-pen" href="javascript:void(0)"   style="display:'+((data[i].state=="UNPUBLISHED" && (data[i].creatorId==currentUserId || currentUserName=='admin'))?'inline;':'none;')+'"    onclick="editRow({id:\''+data[i].id+'\'})">修改</a>'+
                                           '<a class="survey-magnifier" href="javascript:void(0)" onclick="viewRow({id:\''+data[i].id+'\'})">查看</a>'+
                                           '<a class="survey-release" href="javascript:void(0)"  style="display:'+((data[i].state=="UNPUBLISHED" && (data[i].creatorId==currentUserId || currentUserName=='admin'))?'inline;':'none;')+'"  onclick="publish(\''+data[i].id+'\')">发布</a>'+
                                           '<a class="survey-delete" href="javascript:void(0)"  style="display:'+((data[i].creatorId==currentUserId || currentUserName=='admin')?'inline;':'none;')+'"  onclick="deleteRow({id:\''+data[i].id+'\'})">删除</a>'+
                                      '</div>'+
                                 '</div>'+
                                 '<div class="survey-cl">'+
                                 '<div class="vote-length02"><div class="vote-length03">'+ data[i].demand+
                                 '</div></div><div class="vote-length01">要求：</div></div>'+
                                 '<div class="survey-cl">'+
                                       '<p class="fl" style="padding-right:15px;"><b class="boldfont">时间：</b> <b>'+ timeDis+'</b></p>';
			 							if(data[i].debateType=='FREE'){
			 								dataHtml +='<p class="fl" style="padding-right:15px;"><b class="boldfont">参与对象：</b>'+(data[i].prosObjectType=='COMPANY'?'全公司':data[i].prosObjectName)+'</p>';
			 							}else{
			 								dataHtml +='<p class="fl" style="padding-right:15px;"><b class="boldfont">正方参与对象：</b>'+data[i].prosObjectName+'</p>'+
			 										   '<p class="fl" style="padding-right:15px;"><b class="boldfont">反方参与对象：</b>'+data[i].consObjectName+'</p>';
			 							}
                                       dataHtml +='<p class="fl" style="padding-right:15px;"><b class="boldfont">已参与人数：</b>'+data[i].personCount+'人(<a class="colorblue" href="javascript:void(0)" onclick="viewRow({id:\''+data[i].id+'\'})">查看</a>) </p>'+
                                       '<p class="fl" style="padding-right:15px;"><b class="boldfont">未参与人数：</b>'+(data[i].totalPersonCount-data[i].personCount)+'人(<a class="colorblue" href="javascript:void(0)" onclick="viewUnFinish(\''+data[i].id+'\',\''+data[i].prosObjectType+'\',\''+data[i].consObjectType+'\',\''+data[i].debateType+'\')">查看</a>) </p>'+
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
	queryDebate(num);
}


function publish(id){
	
	if(!id){
		art.dialog.tips("没有需要发布的数据！！");
		return ;
	}
	 
	$.post(getPath()+"/interflow/debate/updateState",{id:id},function(data){
		if(data.STATE == "SUCCESS"){
			art.dialog.tips("发布成功");
			queryDebate();
		} else {
			art.dialog.tips(data.MSG);
		}
	},'json');
	 
}

