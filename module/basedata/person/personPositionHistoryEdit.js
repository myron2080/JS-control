$(document).ready(function(){
	$("input[name='oldOrgId']",$("#pstHisListDiv").get(0)).each(function(){
		var orgId = $(this).val();
		var rowIndex = this.id.replace("oldOrgId","");
		var defPstVal = $("#oldPositionId"+rowIndex).val();
		var defJobLevelVal = $("#oldJobLevel"+rowIndex).val();
		changePositionByOrg(orgId,rowIndex,"old",defPstVal,defJobLevelVal);
	});
	
	$("input[name='changeOrgId']",$("#pstHisListDiv").get(0)).each(function(){
		var orgId = $(this).val();
		var rowIndex = this.id.replace("changeOrgId","");
		var defPstVal = $("#changePositionId"+rowIndex).val();
		var defJobLevelVal = $("#changeJobLevel"+rowIndex).val();
		changePositionByOrg(orgId,rowIndex,"change",defPstVal,defJobLevelVal);
	});
		
});


function changeOrg(oldValue,newValue,doc){
	var f7Id =  "oldOrgF7" ;
	var objType =  "old" ;
	if(doc[0].id.indexOf("old")<0){
		objType = "change";
		f7Id =  "changeOrgF7" ;
	} 
	var rowIndex = doc[0].id.replace(f7Id,"");
	changePositionByOrg(newValue.id,rowIndex,objType);
	 
}

function changePositionByOrg(orgId,rowIndex,objType,defPstVal,defJobLevelVal){
	var positionId =  "oldPositionId" ;
	var joblevelId =  "oldJobLevel" ;
	if(objType != "old" ){
		positionId = "changePositionId";
		joblevelId =  "changeJobLevel" ;
	} 
	var p = $("#"+positionId+rowIndex);
	p.val(null);
	p.html('');
	if(orgId){
		$.post(getPath()+'/basedata/position/getByOrg',{org:orgId},function(res){
			if(res && res.length > 0){
				for(var i = 0; i < res.length; i++){
					if(defPstVal && defPstVal==res[i].id ){
						$('<option value="'+res[i].id+'" selected="selected" >'+res[i].name+'</option>').appendTo(p);
					}else{
					  $('<option value="'+res[i].id+'">'+res[i].name+'</option>').appendTo(p);
					}
				}
				changePosition(null,rowIndex,objType,defJobLevelVal);
				p.attr("style","width:135px");
				p.trigger('change');
			}
		},'json');
	}else{
		var jl = $("#"+joblevelId+rowIndex);
		jl.val(null);
		jl.html('');
	}
}

function changePosition(obj,index,objType,defJobLevelVal){
	var positionId =  "oldPositionId" ;
	var joblevelId =  "oldJobLevel" ;
	if(objType != "old" ){
		positionId = "changePositionId";
		joblevelId =  "changeJobLevel" ;
	} 
	var rowIndex = index||obj.id.replace(positionId,"");
	var d = $("#"+positionId+rowIndex);
	d.unbind('change');
	d.bind('change',function(){
		var jl = $("#"+joblevelId+rowIndex);
		jl.val(null);
		jl.html('');
		jl.get(0).options.length =0;
		if($(d).val()){
			$.post(getPath()+'/basedata/position/getJobLevelByPosition',{position:d.val()},function(res){
				if(res && res.length > 0){
					for(var i = 0; i < res.length; i++){
						
						if(defJobLevelVal && defJobLevelVal==res[i].id ){
							$('<option value="'+res[i].id+'" selected="selected" >'+res[i].name+'</option>').appendTo(jl);
						}else{
							$('<option value="'+res[i].id+'">'+res[i].name+'</option>').appendTo(jl);
						}
					}
				}
				jl.attr("style","width:135px");
			},'json');
		}
	});
}

//新增调职单
function addPositionChangeBill(){
	var pstHisListDiv = $("#pstHisListDiv");
	var pstHisDiv = $("#pstHisDiv");
	var pstHisDivClone = pstHisDiv.clone(true,true);
	var addIndex = $("div[id^='pstHisDiv']:last").attr("id").replace("pstHisDiv","")||0;
	addIndex = parseInt(addIndex)+1;//新增索引加1
	
	$("input[id]",pstHisDivClone.get(0)).each(function(){
		this.id += addIndex;
	});
	
	$("div[id]",pstHisDivClone.get(0)).each(function(){
		this.id += addIndex;
	});
	$("select[id]",pstHisDivClone.get(0)).each(function(){
		this.id += addIndex;
	});
	pstHisDivClone.attr("id",(pstHisDivClone.attr("id")+addIndex)) ;
	pstHisDivClone.css("display","block");
	pstHisDivClone.appendTo(pstHisListDiv);
}

//删除调职单
function deletePositionHistory(delDiv){
	var rowIndex = delDiv.replace("delDiv","");
	$('#pstHisDiv'+rowIndex).remove();
}

function saveEdit(preWinObj){
	currentDialog = preWinObj;
	submitData(preWinObj);
}

function submitData(preWinObj){
	var flag = true;
	var positionHistorys =new Array();
	art.dialog.confirm("修改任职历史可能影响业务数据，是否确定保存修改？",function(){
	 
		$("#positionHistorys").val('');
		var personId = $("#personId").val();
		$("div[id^='pstHisDiv'][id!='pstHisDiv']").each(function(i,pstHisDiv){
			var positionHistory = {};
			var rowIndex = this.id.replace("pstHisDiv","");
			 
			 //构建申请单JSON对象
			 positionHistory.id = $("#dataId"+rowIndex).val()||'';
			 positionHistory.personId = personId;
		     positionHistory.primary = $("#primary"+rowIndex).val()||'';
		     positionHistory.changeType = $("#changeType"+rowIndex).val()||'';
		     var jobStatus = {};
		     jobStatus.id = $("#jobStatus"+rowIndex).val()||'';
		     jobStatus.name = $("#jobStatus"+rowIndex).find("option:selected").text()||'';
		     positionHistory.jobStatus = jobStatus;
		     positionHistory.effectdate = $("#effectdate"+rowIndex).val()||'';
			 //isdisable 默认为N
			 positionHistory.isdisable = $("#isdisable"+rowIndex).val()||'N';
			 
			 positionHistory.oldOrgId = $("#oldOrgId"+rowIndex).val()||'';
			 positionHistory.oldOrgName = $("#oldOrgName"+rowIndex).val()||'';
			 positionHistory.oldPositionId = $("#oldPositionId"+rowIndex).val()||'';
			 positionHistory.oldPositionName = $("#oldPositionId"+rowIndex).find("option:selected").text()||'';
			 positionHistory.oldJobLevel = $("#oldJobLevel"+rowIndex).val()||'';
			 positionHistory.oldJobLevelName = $("#oldJobLevel"+rowIndex).find("option:selected").text()||'';
			 //变动后 组织 职位 职级
			 positionHistory.changeOrgId = $("#changeOrgId"+rowIndex).val()||'';
			 positionHistory.changeOrgName = $("#changeOrgName"+rowIndex).val()||'';
			 positionHistory.changePositionId = $("#changePositionId"+rowIndex).val()||'';
			 positionHistory.changePositionName = $("#changePositionId"+rowIndex).find("option:selected").text()||'';
			 positionHistory.changeJobLevel = $("#changeJobLevel"+rowIndex).val()||'';
			 positionHistory.changeJobLevelName = $("#changeJobLevel"+rowIndex).find("option:selected").text()||'';
			 var expirydate = $("#expirydate"+rowIndex).val()||'';
		     if(expirydate){
		    	 positionHistory.expirydate = expirydate;
		     }
		     
		     if(!positionHistory.effectdate){
				 art.dialog.tips(rowMsg+'请选择生效日期！');
				 flag = false;
				 return false;
			 }
			 positionHistorys.push(positionHistory);
		 });
		 if(positionHistorys.length<1){
			 art.dialog.tips(rowMsg+' 没有可操作的数据！');
			 flag = false;
			 return false;
		 }
		 $("#positionHistoryJson").val(JSON.stringify(positionHistorys));
		 if(flag){
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
					data: {"positionHistoryJson":JSON.stringify(positionHistorys),"personId":personId},
					success: function(res) {
						if(currentDialog){
							   bottuns=currentDialog.config.button;
							   $(bottuns).each(function(){
								  var name=this.name; 
								  currentDialog.button({name:name,disabled:false});
							   });
							}
						if(res.STATE == "SUCCESS"){
							if(res.MSG){
								art.dialog({
									icon: 'succeed',
								    time: 1,
								    content: res.MSG
								});
								setTimeout(function(){art.dialog.close();},1000);				
							}else{
								art.dialog.close();
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
	 
  });
}
 