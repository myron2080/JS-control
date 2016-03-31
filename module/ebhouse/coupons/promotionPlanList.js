$list_editUrl = getPath()+"/ebhouse/promotion/edit";//编辑及查看url
$list_addUrl = getPath()+"/ebhouse/promotion/add";//新增url
$list_deleteUrl = getPath()+"/ebhouse/promotion/delete";//删除url
$list_editWidth = "600px";
$list_editHeight = "420px";
$list_dataType = "推广方案列表";//数据名称
var manager;
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:200,minLeftWidth:200,allowLeftCollapse:true,allowLeftResize:true});
	manager = $list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
                {display: '标题', name: 'title', align: 'left', width: 110 },
      			{display: '所属项目', name: 'houseProject.registerName', align: 'left', width:130 },
      			{display: '已售数量', name: 'soldCount', align: 'left', width:100 },
      			{display: '剩余数量', name: 'surplusCount', align: 'left', width:100 },
      			{display: '描述', name: 'description', align: 'left', width: 160},
      			{display: '重点推广', name: 'keyPromotion', align: 'left', width:60,render:function(data){
      				if(data.keyPromotion==0)
      					return "否";
      					return "是";
      			}},
      			{display: '默认显示', name: 'isShow', align: 'left', width:60,render:function(data){
      				if(data.isShow==0)
      					return "否";
      					return "是";
      			}},
      			{display: '操作', name: 'operate', align: 'center', width: 180,render:operateRender} 
        ],
        url:getPath()+'/ebhouse/promotion/listData',
        delayLoad:false
    }));
	bindEvent();
});
function operateRender(data,filterData){
	var str ='';
	var e = (data.status=='ENABLE'?'DISABLED':'ENABLE');
	var t = (data.status=='ENABLE'?'禁用':'启用');
	str+= '<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a>';
	str+='|<a href="javascript:enableRow({id:\''+data.id+'\',status:\''+e+'\'});">'+t+'</a>'
	//str+= '|<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	if(data.keyPromotion==0){
	str+= '|<a href="javascript:keyPromotion({id:\''+data.id+'\',keyPromotion:\'YES\'});">重点推广</a>';}else{
	str+= '|<a href="javascript:keyPromotion({id:\''+data.id+'\',keyPromotion:\'NO\'});">取消推广</a>';	
	}
	if(data.isShow==0){
	str+= '|<a href="javascript:isShow({id:\''+data.id+'\',isShow:\'YES\'});">默认显示</a>';}else{
	str+= '|<a href="javascript:isShow({id:\''+data.id+'\',isShow:\'NO\'});">取消显示</a>';	
	}
	return str;	
}
function enableRow(config){
	$.post(getPath()+'/ebhouse/promotion/enable',config,function(res){
		art.dialog.tips(res.MSG);
		if(res.STATE=='SUCCESS'){
			refresh();
		}
	},'json');
}
function keyPromotion(data){
	$.post(getPath()+'/ebhouse/promotion/keyPromotion',{id:data.id,keyPromotion:data.keyPromotion},function(res){
		art.dialog.tips(res.MSG);
		if(res.STATE=='SUCCESS'){
			refresh();
		}
	},'json');
}
function isShow(data){
	$.post(getPath()+'/ebhouse/promotion/isShow',data,function(res){
		art.dialog.tips(res.MSG);
		if(res.STATE=='SUCCESS'){
			refresh();
		}
	},'json');
}
function getAddRowParam(){

	var row = $list_dataGrid.getSelectedRow();
	if(row){
		return {parent:row.id};
	}
	return null;
}

function beforeAddRow(){
	addRow({});
}
function bindEvent(){
	$("#selectData").click(function(){
		selectList();
	});
//清除
	$("#clearData").click(function(){	
		$("#keyConditions").val($("#keyConditions").attr("defaultValue"));
		$("#houseProjectId").val("");
		selectList();
	});
	$("#keyConditions").keydown(function(e){
    	enterSearch(e);
	});
}

/************************
 * 根据条件查询数据
 * **********************
 */

function selectList(){
	//关键字
	var key=$("#keyConditions").val();
	
	//项目
	if($("#houseProjectId").val()!= ""){
		$list_dataParam['houseProjectId'] = $("#houseProjectId").val();
	} else {
		delete $list_dataParam['houseProjectId'];
	}
	
	//关键字
	if(key && ($('#keyConditions').attr("defaultValue") != key) && key!=$("#keyConditions").attr("defaultValue")){
		$list_dataParam['keyConditions'] = key;
	}else{
		delete $list_dataParam['keyConditions'];
	}
	resetList();
}
/**
 ***************************
 ** 回车查询
 ***************************
 */
function enterSearch(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		selectList();
    }  
}
