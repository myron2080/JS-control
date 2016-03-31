
var manager, g;
$(document).ready(function(){
	
	$("#selectDate").bind("change",function(){
		var val=$("#selectDate").val();
		if(val=="month"){
			$("div[id="+val+"_div]").show();
			$("div[id=day_div]").hide();
		}
		if(val=="day"){
			$("div[id="+val+"_div]").show();
			$("div[id=month_div]").hide();
//			var dd = new Date();
//		    var x = dd.toLocaleString();
//		    var o = pasDate(x);
//		    $('#queryDay').val(o.join('-'));
		}
	});
	//上一个月
	$("#lastMonth").bind("click",function(){
		var monthVal=$("#queryMonth").val();
		changeMonth("up");
	});
	//下一个月
	$("#nextMonth").bind("click",function(){
		var monthVal=$("#queryMonth").val();
		changeMonth("dp");
	});
	//上一天
	$("#lastDay").bind("click",function(){
		changeDay('up');
	});
	//下一天
	$("#nextDay").bind("click",function(){
		changeDay('down');
	});
	
	/***************************data Panel***************************/
	g =  manager = $list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		//
        columns: [ 
            {display: '操作', name: 'operate', align: 'center', width: 85,render:operateRender},
            {display: '操作用户', name: 'user.name', align: 'left', width: 130,render:operaterNameRender},
            {display: 'IP', name: 'ip', align: 'left', width: 80},
            {display: '操作描述', name: 'eventDesc', align: 'left', width: 220},
            {display: '操作时间', name: 'createTime', align: 'left', width: 125,dateFormat:"yyyy-MM-dd HH:mm",formatters:"date"},
            {display: '操作事件', name: 'eventUrl', align: 'left', width: 350}
            
        ],
        fixedCellHeight:false,
        isScroll: true
        ,rownumbers:true,
        delayLoad:true,
        url:getPath()+'/lunch/log//listData'
    		
    }));
	searchData();
	bindEvent();
	$(document).keydown(function(e){
		var charCode= ($.browser.msie)?e.keyCode:e.which;  
		if(charCode==13){  
			$("#searchBtn").click();
	    }});
});

function operaterNameRender(data,filterData){
	var operaterStr = "";
	if(data.user){
		if(data.user.name){
			operaterStr = data.user.name; 	
		}else if(data.user.nickName){
			operaterStr = data.user.nickName; 	
		}
		
	}
	return operaterStr;
}

function operateRender(data,filterData){
	var operateStr = "";
	 
	/*if(data.errorMsg) { 
	 
		operateStr += '<a href="javascript:void(0)" onclick="showErrorMsg(\''+data.__id+'\');" class="modify_font">查看异常</a>'
		operateStr += '<div id='+data.__id+' style="display:none">'+data.errorMsg+'</div>';
	}*/
	
	return operateStr;
}

function showErrorMsg(contentId){
	 
	var errorMsgDialog = art.dialog({
			title:"异常信息",
			icon:"",
			content:'<div><textarea  cols="95" rows="45">'+$("#"+contentId).html()+'</textarea></div>',
		    id: "errorMsg",
		    lock:true,
		    width:700,
		    height:400,
		    resize:true,
		    button: [ { name: '取消', callback: closeErrorMsgDialog } ]
		});
		return false;
	
	function closeErrorMsgDialog(){
		errorMsgDialog.close();
	}
	errorMsgDialog.show();
}

function bindEvent(){
	
	//查询
	$("#searchBtn").click(function(){
		searchData();
	});
	//清空
	$("#resetBtn").click(function(){
		$("#keyConditions").val($("#keyConditions").attr("defaultValue"));
	});
	
	eventFun($("#keyConditions"));
	
	$("#keyConditions").bind('keyup', function(event) {
		if (event.keyCode == 13){
			searchData();
		}
	});
	
	//导出按钮
	$("#exportBtn").bind("click",function(){
		exportData();
	});
}
 
function eventFun(obj){
	$(obj).blur(function(){
		if(!$(obj).val() || ($(obj).val() == "")){
			$(obj).val($(obj).attr("defaultValue"));
		}
	}).focus(function(){
		if($(obj).val() && ($(obj).val() == $(obj).attr("defaultValue"))){
			$(obj).val("");
		}else {
			$(obj).select();
		}
	});
}

 
function searchData(){
	
	$list_dataParam['orderByClause'] = " D.FCREATETIME desc";
	
	
	var dateVal=$("#selectDate").val();
	//月查询
	if(dateVal=="month"){
		var monthVal=$("#queryMonth").val();
		if(!isNotNull(monthVal)){
			art.dialog({icon:'warning',time:1, content:"请选择月份!"});	
			return;
		}else{
			$list_dataParam['queryMonth'] = monthVal;
			delete $list_dataParam['queryDay'];
		}
	}
	//日查询
	if(dateVal=="day"){
		var dayVal=$("#queryDay").val();
		if(!isNotNull(dayVal)){
			art.dialog({icon:'warning',time:1, content:"请选择一天!"});	
			return;
		}else{
			$list_dataParam['queryDay'] = dayVal;
			delete $list_dataParam['queryMonth'];
		}
	}
	
	//关键字条件 [单据编号/员工编号/姓名/职位/职级]
	var keyConditions = $('#keyConditions').val();
	if(keyConditions && ($('#keyConditions').attr("defaultValue") != keyConditions)){
		$list_dataParam['keyConditions'] = keyConditions;
	}else{
		delete $list_dataParam['keyConditions'];
	}
	resetList();
}


//月的累加减
function changeMonth(type) {
	var showMonth = $("#queryMonth").val();
	if (null != showMonth && showMonth != '') {
		var y = parseInt(showMonth.split("-")[0], 10);// 年
		var m = parseInt(showMonth.split("-")[1], 10);// 月
		var year;
		var month;
		if (type == 'up') {// 上一月
			if (m == 1) {
				year = (y - 1) + "";
				month = "12";
			} else {
				year = y + "";
				if (m < 11) {// 月份 需加0
					month = "0" + (m - 1);
				} else {
					month = (m - 1) + "";
				}
			}
		} else {// 下一月
			if (m == 12) {
				year = (y + 1) + "";
				month = "01";
			} else {
				year = y + "";
				if (m < 9) {//月份 需加0
					month = "0" + (m + 1);
				} else {
					month = (m + 1) + "";
				}
			}
		}
		$("#queryMonth").val(year + "-" + month);
	}else{
		art.dialog({icon:'warning',time:1, content:"请选择日期!"});
	}
}
/**
 * 天的加减
 * @param type
 */
function changeDay(type){
	var showDay=$("#queryDay").val();

if(null != showDay && showDay != ''){
	var str =showDay;
	str = showDay.replace(/-/g,"/");
	var date = getDayByDate(new Date(str),type=="up"?-1:1).Format("yyyy-MM-dd");
	$("#queryDay").val(date);
	searchData();
			
	
	}else{
		art.dialog.tips("请选择日期!");
	}
}

function getDayByDate(currentDate, scaleStep) {  
    //scaleStep = 1 向后计算后一天  
    //scaleStep = -1 向前计算前一天  
    for(var minIncrements = 1;; minIncrements++) {  
        var nextDate = new Date(currentDate);  
        nextDate.setHours(currentDate.getHours() + scaleStep * minIncrements);  
  
        if(nextDate.getDate() != currentDate.getDate()) {  
            return nextDate;  
        }  
    } 
    }
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
function getNextDay(d){
    d = new Date(d);
    d = +d + 1000*60*60*24;
    d = new Date(d);
    //return d;
    //格式化
    return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
     
}
//转化日期函数
function pasDate(da) {
    var yp = da.indexOf('年'),
   mp = da.indexOf('月'),
   dp = da.indexOf('日');
    var y = da.substr(0,yp),
   m = da.substr(yp + 1,mp - yp - 1),
   d = da.substr(mp + 1,dp - mp - 1);
    return [y,m,d];
}