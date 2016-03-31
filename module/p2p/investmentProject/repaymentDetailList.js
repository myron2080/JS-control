$(document).ready(function(){
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
                  {display: '期号', name: 'planSeq', align: 'center', width:'50'},
      			{display: '还款日期', name: 'planRmDate', align: 'center', width:'80' },
      			{display: '计划还款金额', name: 'planRmAmount', align: 'center', width:'80'},
      			{display: '计划还款本金', name: 'planRmCorpus', align: 'center', width: '80'},
      			{display: '计划还款利息', name: 'planRmInterest', align: 'center', width: '80'},
      			{display: '实际还款日期', name: 'realRmDate', align: 'center', width: '80'},
      			{display: '实际还款金额', name: 'realRmAmount', align: 'center', width:'80'},
      			{display: '实际还款本金', name: 'realRmCorpus', align: 'center', width: '80'},
      			{display: '实际还款利息', name: 'realRmInterest', align: 'center', width:'80'},
      			{display: '备注', name: 'remark', align: 'left', width: '120'}
        ],
        url:getPath()+"/p2p/investmentProject/repaymentData?pid="+pid,
        rownumbers:false 
    }));
	resetList();
});
