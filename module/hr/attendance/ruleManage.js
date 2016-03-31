$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:200,allowLeftCollapse:true,allowLeftResize:true,rightWidth:360});
	$("#addBtn").bind("click",addRule);	
	$("#saveBtn").bind("click",saveRule);	
	initRuleData(1);
});

saveRule = function(obj){
	var orgId  = $("#orgId").val();
	//var jobId = $("#jobId").val();
	//var reminderTime = $("#reminderTime").val();
	if(!orgId){
		art.dialog.tips("规则组织不能为空！");
		return ;
	}
	/*if(!jobId){
		art.dialog.tips("提醒岗位不能为空！");
		return ;
	}
	if(!reminderTime){
		art.dialog.tips("提醒时间不能为空！");
		return ;
	}*/
	
	$.post($('form').attr('action'),$('form').serialize(),function(res){
		if(res.STATE == "SUCCESS"){
			initRuleData(1);
			$("#id").val(res.id);
			art.dialog({icon: 'succeed', time: 1,content: "保存成功!"});
			setTimeout(function(){art.dialog.close();},1000);
		}else{
			art.dialog.tips("保存失败,已存在该组织的考勤规则");
		}
		$("#btnSend").attr('disabled',false);
    },'json');
}
 

function pagGetRuleData(id){
	var page = parseInt($("#pagediv").attr("currPage"));//当前页
	var count = parseInt($("#pagediv").attr("total"));//总页数
	if(id=="prev"){
		 
		initRuleData(page-1);
		$("#next").show();
		if(page==2){
			 $("#prev").hide();
		}else{
			$("#prev").show();
		}
		
	}else{
		
		initRuleData(page+1);
		$("#prev").show();
		if(page==(count-1)){
			 $("#next").hide();
		}else{
			$("#next").show();
		}
	}
}


function initRuleData(page){
	if(!page) page = 1;
	 
	var param = {};
	param.currentPage = page;
	param.pageSize = 20;
	$.post(getPath()+"/hr/attendanceRule/listData",param,function(data){ 
		 
		$("#ruleListDiv").html('');
		if(data && data.items){
			var ruleHtml = '<table style="border:sold 0;line-height: 20px;">';
			for(var i=0;i<data.items.length;i++){
				var rule = data.items[i];
				ruleHtml += ('<tr onclick="editRule(this)" style="cursor:pointer;" id="'+rule.id+'" orgId="'+rule.org.id+'" orgName="'+rule.org.name+'" jobId="'+getFieldFromData(rule,"job.id")+
						'" jobName="'+getFieldFromData(rule,"job.name")+'" ruleType="'+rule.ruleType+'" reminderTime="'+rule.reminderTime+'"><td>'+rule.org.name+' </td></tr>');
			}
			ruleHtml += '</table>';
			var total = Math.floor(data.count%data.pageSize==0?data.count/data.pageSize:data.count/data.pageSize+1);
			$("#pagediv").attr("currPage",page);//当前页
			$("#pagediv").attr("total",total);//总页数
			if(total && total>1){
				$("#pagediv").show();
			}else{
				$("#pagediv").hide();
			}
			$("#ruleListDiv").html(ruleHtml);
		}
		
	},'json');
}

function addRule(){
	
	$("#id").val("");
	$("#ruleType").get(0).selectedIndex=0;
	$("#orgId").val("");
	$("#orgName").val("");
	$("#jobId").val("");
	$("#jobName").val("");
	$("#reminderTime").val("");
}

function editRule(obj){
	$("#id").val($(obj).attr("id"));
	$("#ruleType").val($(obj).attr("ruleType"));
	$("#orgId").val($(obj).attr("orgId"));
	$("#orgName").val($(obj).attr("orgName"));
	$("#jobId").val($(obj).attr("jobId"));
	$("#jobName").val($(obj).attr("jobName"));
	$("#reminderTime").val($(obj).attr("reminderTime"));
}