$list_editUrl = getPath()+"/projectm/task/editTask?personFlag=self";//编辑及查看url
$list_addUrl = getPath()+"/projectm/task/addTask?personFlag=self";//新增url
$list_deleteUrl = getPath()+"/projectm/task/deleteTask";//删除url
$list_editWidth = "722px";
$list_editHeight = "308px";
$list_dataType = "任务";//数据名称
var totalWorkload = 0; //总共的工作量
$(document).ready(function(){
	
	var columns = [ 
	               
	               {display: '部门', name: 'org.name', align: 'left', width: 100},
	               {display: '责任人', name: 'dutyPerson.name', align: 'left', width: 50},
	               {display: '任务名称', name: 'displayName', align: 'left', width: 100},
	               {display: '计划起始日期', name: 'beginDate', align: 'left', width: 100},
	               {display: '计划结束日期', name: 'planEndDate', align: 'left', width: 100},
	               {display: '工作量', name: 'workload', align: 'left', width: 50},
	               {display: '详细内容', name: 'description', align: 'left', width: 230},
//	               {display: '完成日期', name: 'endDate', align: 'left', width: 73},
	               {display: '工作进度', name: 'tempo', align: 'left', width: 90,render:tempoRender},
	               {display: '验证进度', name: 'validatedTempo', align: 'left', width: 90,render:validatedTempoRender},
	               {display: '操作', name: 'operate', align: 'center', width: 130,render:operateRender}
	           ]
	
	if(null == $("#view").val() || '' == $("#view").val() || (null != $("#self").val() && '' != $("#self").val())){	//如果是查看过来则没有新增和编辑的那些操作
		$("#toolBar").ligerToolBar({
			items:[
			       {id:'add',text:'新增',click:addRow,icon:'add'}
			      
				]
			}); 
	} else {
		columns.splice(columns.length -1,1);
	}
	$("#toolBar").append(
		' <div style="padding-top:5px;display:inline;">'+statusSelectTag+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;开始时间：<input type="text" name="queryStartDate" id="queryStartDate" value="'+$("#queryStartDateStr").val()+'" onclick="WdatePicker({dateFmt:\'yyyy-MM-dd\',alwaysUseStartDate:true})"/>至<input type="text" value="'+$("#queryEndDateStr").val()+'" onclick="WdatePicker({dateFmt:\'yyyy-MM-dd\',alwaysUseStartDate:true})" id="queryEndDate" name="queryEndDate"/></div><a class="mini-button" href="javascript:void(0)"><span class="mini-button-low-text" onclick="searchData();return false;">查询</span></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总工作量：<span id="totalSpan" style="color:red;"></span>'
	);
//	overflagSelectChangeFun();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: columns,
        height:'95%',
        fixedCellHeight:true,
        url:getPath()+'/projectm/task/taskPersonListAllData',
        delayLoad:true
    }));
	
	searchData();
	
	if(null != $("#from").val()  && '' != $("#from").val()){
		setTimeout(function(){
			$("div[toolbarid='add']").click();
		},200);
	}
});

function validatedTempoRender(data){
	return ((data.validatedTempo == '' || data.validatedTempo == null) ? 0 : data.validatedTempo)+ "%";
}

function searchData(){
	totalWorkload = 0;
	$("#totalSpan").html(0);
	var queryStartDate = $("#queryStartDate").val();
	var queryEndDate = $("#queryEndDate").val();
	if(queryStartDate != null && queryStartDate != '' && queryEndDate!=null && queryEndDate != '' && queryStartDate > queryEndDate){
		art.dialog.tips("查询时间第一个框的值不能够大于第二个框的值！！");
		return;
	}
	
	if(null == $("#personId").val() || $("#personId").val() == ''){
		delete $list_dataParam['personId'];
	} else {
		$list_dataParam['personId'] = $("#personId").val();
	}
	
	if(null == queryStartDate || queryStartDate == ''){
		delete $list_dataParam['queryStartDate'];
	} else {
		$list_dataParam['queryStartDate'] = queryStartDate;
	}
	
	if(null == queryEndDate || queryEndDate == ''){
		delete $list_dataParam['queryEndDate'];
	} else {
		$list_dataParam['queryEndDate'] = queryEndDate;
	}
	
	var overflag = $("#overflag option:selected").val();
	if(overflag == null || '' == overflag){
		delete $list_dataParam['overflag'];
	} else {
		$list_dataParam['overflag'] = overflag;
	}
	
	resetList();
	
	/**
	 * 得到总的工作量
	 */
	$.post(getPath()+'/projectm/task/getTotalWorkload',{
		queryStartDate:$list_dataParam['queryStartDate'],
		queryEndDate:$list_dataParam['queryEndDate'],
		overflag:$list_dataParam['overflag'],
		personId:$("#personId").val(),
		personFlag:true
	},function(result){
		if(null == result.totalWorkload  || '' == result.totalWorkload){
			$("#totalSpan").html('0');
		} else {
			$("#totalSpan").html(result.totalWorkload);
		}
	},'json');
}
