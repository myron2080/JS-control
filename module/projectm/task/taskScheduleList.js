var bugListUrl =  getPath()+"/projectm/bugList/list?from=workbench";	//bugurl
var taskListUrl =  getPath()+"/projectm/task/taskPersonList?from=workbench";		//任务url
var viewBugListUrl =  getPath()+"/projectm/bugList/list?view=fromworkbench";	//bugurl
var viewTaskListUrl =  getPath()+"/projectm/task/taskPersonList?view=fromworkbench";		//任务url
$(function(){
	loadingData(1);
});

//添加任务
function addTask(){
	top.addTabItem("addTask",taskListUrl,"写任务");
}

//添加bug
function addBug(){
	top.addTabItem("addBug",bugListUrl,"提BUG");
}

//上一页
function prev(){
	var currentPage = parseInt($("#currentPage").html()); //当前页
	var totalPage = parseInt($("#totalPage").html());	//
	if(currentPage == 1){
		art.dialog.tips("已经是第一页");
		return;
	}
	loadingData(currentPage-1);
	
}

//下一页
function next(){
	var currentPage = parseInt($("#currentPage").html()); //当前页
	var totalPage = parseInt($("#totalPage").html());	//
	if(currentPage == totalPage){
		art.dialog.tips("已经是最后一页");
		return;
	}
	loadingData(currentPage+1);
}

//查看任务
function viewTask(personId,personName){
	top.addTabItem("viewTask_"+personId,viewTaskListUrl+"&personId="+personId,"查看【"+personName+"】任务");
}

//查看bug
function viewBug(personId,personName){
	top.addTabItem("viewBug_"+personId,viewBugListUrl+"&personId="+personId,"查看【"+personName+"】BUG");
}

//加载数据
var loadingData = function(currentPage){
	$.post(getPath()+'/projectm/taskSchedule/listData',{currentPage:currentPage},function(result){
		$("#currentPage").html(currentPage);
		$("#dataUl").html("");
		if(result.items){
			$("#totalPage").html(result.pageCount)
			for(var i = 0; i< result.items.length;i++){
				var tmpTaskSchedule = result.items[i];
				var liHtml = '<li>'
							      +'  <div class="audit-avatar"><img src="'+imgBase+"/"+tmpTaskSchedule.taskPerson.photo+'" onerror="this.src=\''+base+'/default/style/images/home/man_head.gif\'"/></div>'
							      +'   <div class="audit-gray">'
							      +'         <div class="audit-grayin">'
							      +'             <div class="audit-grayin-arrow"></div>'
							      +'             <div class="audit-graybox">'
							      +'                   <div class="audit-graybox-top">'
							      +'                        <p class="audit-name"><b class="font16 bold">'+tmpTaskSchedule.taskPerson.name+'</b> '+tmpTaskSchedule.taskPerson.position.belongOrg.name+' '+tmpTaskSchedule.taskPerson.position.name+'</p>'
							      +'                  </div>'
							                       
							      +'                   <div style="cursor:pointer;" class="audit-graybox-font" onclick="javascript:viewTask(\''+tmpTaskSchedule.taskPerson.id+'\',\''+tmpTaskSchedule.taskPerson.name+'\')">'
							      +'                       剩余任务（<b class="orangecolor font16 bold">'+tmpTaskSchedule.leftTask+'</b>）'
							      +'                        平均工作进度（<b class="orangecolor font16 bold">'+tmpTaskSchedule.avgCompletePercent+'</b>）'
							      +'                        平均验证进度（<b class="orangecolor font16 bold">'+tmpTaskSchedule.avgValidatedPercent+'</b>）'
							      +'                   </div>';
					if(true == tmpTaskSchedule.kfgw){		                       
					  liHtml +='                  <div style="cursor:pointer;" class="audit-graybox-font" onclick="javascript:viewBug(\''+tmpTaskSchedule.taskPerson.id+'\',\''+tmpTaskSchedule.taskPerson.name+'\')">'
							      +'                        剩余待处理BUG（<b class="redcolor font16 bold">'+tmpTaskSchedule.leftBug+'</b>）'
							      +'                        本周已处理BUG（<b class="orangecolor font16 bold">'+tmpTaskSchedule.weekDealedBug+'</b>）'
							      +'                        已关闭BUG（<b class="greencolor font16 bold">'+tmpTaskSchedule.kfWeekClosedBug+'</b>）'
							      +'                   </div>';
					} else {
						liHtml +='                  <div style="cursor:pointer;" class="audit-graybox-font" onclick="javascript:viewBug(\''+tmpTaskSchedule.taskPerson.id+'\',\''+tmpTaskSchedule.taskPerson.name+'\')">'
						      +'                        本周新增BUG（<b class="redcolor font16 bold">'+tmpTaskSchedule.weekAddedBug+'</b>）'
						      +'                        待验证BUG（<b class="orangecolor font16 bold">'+tmpTaskSchedule.weekValidatingBug+'</b>）'
						      +'                        已关闭BUG（<b class="greencolor font16 bold">'+tmpTaskSchedule.csWeekClosedBug+'</b>）'
						      +'                   </div>';
					}
				      liHtml += '             </div>'
							      +'         </div>'
							      +'    </div>'
							      +'  </li>';
				      $("#dataUl").append(liHtml);
			}
		}
	},'json');
}

