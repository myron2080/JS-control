$list_dataType = "ucs通话记录";//数据名称
$(document).ready(function(){
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [
            {display: 'ip', name: 'ip', align: 'left', width: 200},
            {display: '费率', name: 'callUnit', align: 'left', width: 80},
            {display: '卡号', name: 'cardNo', align: 'left', width: 80},
            {display: '计费号码 ', name: 'caller', align: 'center', width: 120},
            {display: '接通时间', name: 'connectTime', align: 'left', width: 150},
            {display: '通话时长', name: 'duration', align: 'left', width: 80},
            {display: '结束时间', name: 'svcalloutuseroffhoktime', align: 'left', width: 150},
            {display: '通话费用', name: 'msvcalloutusertalkmoney', align: 'left', width: 100},
            {display: '客户名称', name: 'svcalloutcusconame', align: 'left', width: 100},
            {display: '主叫号码', name: 'svcalloutdispcaller', align: 'left', width: 100}
        ],
        url:getPath()+'/cmct/ucsPhonenew/getCallRecordList?telNo=075561904996&key='+hex_md5(UcsCall.enckey+"075561904996")
    }));
});
