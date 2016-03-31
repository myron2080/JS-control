$(document).ready(function(){
	//$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer1").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '投标人', name: 'investmentName', align: 'center', width:'5%'},
			{display: '投标金额', name: 'amount', align: 'center', width:'10%'},
			{display: '投标时间', name: 'investmentDate', align: 'center', width:'8%' },
			{display: '投标方式', name: 'investmentOptionName', align: 'center', width:'9%'}
        ],
        url:getPath()+"/p2p/investmentProject/addRecord?pid="+pid
       ,rownumbers:false
    }));
	$("#listui1").css("display","none");
	$list_dataGrid = $("#tableContainer2").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '评论人', name: 'user.name', align: 'center', width:'5%'},
			{display: '评论时间', name: 'createDate', align: 'center', width:'10%'},
			{display: '评论内容 ', name: 'remark', align: 'left', width:'80%' }
			
        ],
        url:getPath()+"/p2p/investmentProject/getMsg?pid="+pid
    }));
	$("#listui2").css("display","none");
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '期号', name: 'planSeq', align: 'center', width:'5%'},
			{display: '操作', name: 'title', align: 'center', width:'10%',render:option},
			{display: '还款日期', name: 'planRmDate', align: 'center', width:'8%',render:date1},
			{display: '计划还款金额', name: 'planRmAmount', align: 'center', width:'9%'},
			{display: '计划还款本金', name: 'planRmCorpus', align: 'center', width: '9%'},
			{display: '计划还款利息', name: 'planRmInterest', align: 'center', width: '9%'},
			{display: '实际还款日期', name: 'realRmDate', align: 'center', width: '9%'},
			{display: '实际还款金额', name: 'realRmAmount', align: 'center', width:'9%'},
			{display: '实际还款本金', name: 'realRmCorpus', align: 'center', width: '9%'},
			{display: '实际还款利息', name: 'realRmInterest', align: 'center', width:'9%'},
			{display: '备注', name: 'remark', align: 'left', width: '12%'}
        ],
        url:getPath()+"/p2p/investmentProject/repaymentData?pid="+pid,
        rownumbers:false
    }));
	$("#listui").css("display","none");
});
function date1(data){
//	if(pstatus=="REPAYMENT" || pstatus=="OVER"){
	return data.planRmDate;
//	}else{
//		return "";
//	}
}
function selectList(){
	payStatus = "Y";
	resetList();
}
function toApp(dlg){
	var ispass=$("input[name='ispass']:checked").val();
	$.post(getPath()+"/p2p/investmentProject/toApp",{fid:pid,remark:$("#remark").val(),ispass:ispass},function(data){
		if(data.STATE=='SUCCESS'){
			art.dialog({
			    time: 1,
			    content: '&nbsp;&nbsp;&nbsp;审批成功！',
			    close:function(){
			    	dlg.close();
			    }
			});
		}else{
			art.dialog.alert("审批失败！错误信息："+data.MSG);
		}
	},"json");
}
function toBack(dlg){
	var ispass=$("input[name='ispass']:checked").val();
	$.post(getPath()+"/p2p/investmentProject/toBack",{fid:pid,remark:$("#remark").val(),ispass:ispass},function(data){
		if(data.STATE=='SUCCESS'){
			art.dialog({
			    time: 1,
			    content: '&nbsp;&nbsp;&nbsp;审批成功！',
			    close:function(){
			    	dlg.close();
			    }
			});
		}else{
			art.dialog.alert("审批失败！错误信息："+data.MSG);
		}
	},"json");
}
var payStatus = "Y";
function option(data){
	if(data.status=='WHK' && pstatus == 'REPAYMENT'){
		if(payStatus == "Y"){
			payStatus = "N";
			return "<a href='javascript:void(0)' onclick=\"okRePay(\'"+data.id+"\');\">还款</a>";
		}else{
			return "<a href='javascript:void(0)'>未还款</a>";
		}
		
	}
	
}
function okRePay(repayId){
  var dlg = art.dialog.open(getPath()+"/p2p/investmentProject/okRePay?pid="+repayId
			, {
		init : function() {
		},
		id : 'okpayWindow',
		width : 700,
		title:"还款操作",
		height : 235,
		lock:true,
		button : [ {
			className : 'aui_state_highlight',
			name : '保存',
			 callback: function () {
				 flag = true;
				 	if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.editRePay){
				 		dlg.iframe.contentWindow.editRePay(dlg);
					}
					return false;
			 }
		}, {
			name : '取消',
			callback : function() {
			}   
		} ],
		close:function(){
			selectList();
		}
	});
}