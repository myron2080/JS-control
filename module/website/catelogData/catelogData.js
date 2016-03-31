/**
 * 收货地址
 * @author Cai.xing
 * @since 2012-04-02
 * */
$list_addUrl = getPath() + '/website/catelogData/add';  			//设置添加的路径
$list_editUrl = getPath() + '/website/catelogData/edit';			//设置修改的路径
$list_deleteUrl = getPath() + '/website/catelogData/delete';			//设置删除的路径
$list_editWidth = "870px";				
$list_editHeight = "545px";	
$list_dataType = "栏目数据";//数据名称
$list_hr_approve = false;//是审批界面
var true_count=0;
$(function(){
	//$("#toolBar").ligerToolBar();
//	params ={};
//	params.inputTitle = "使用期限";	
//	MenuManager.common.create("DateRangeMenu","effectdate",params);
	
	//$("#main").ligerLayout({});
	//新增按钮
	$("#toAddBtn").bind("click",function(){
		addRow();
	});
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		columns : [ {
			display : '操作',
			name : 'operate',
			align : 'center',
			width : 230,
			render : operateRender
		}, {
			display : '发布日期',
			name : 'createTime',
			align : 'center',
			width : 120
		}, {
			display : '标题',
			name : 'title',
			align : 'center',
			width : 200
		}, {
			display : '所属栏目',
			name : 'catelog.name',
			align : 'center',
			width : 200
		},{
			display : '状态',
			name : 'operate',
			align : 'center',
			width : 80,
			render:function (data){
				if (data.isLaunch == 1) {
					return "已发布";
				} else if (data.isLaunch == 0) {
					return "未发布";
				} 
			}
		}],
		 checkbox:true,
        delayLoad:true,
		url : getPath() + "/website/catelogData/listData"
       
    }));
	$("#revokeBtn").bind("click",function(){
		uodateBillStatu("REVOKE");
	});
	$("#rejectBtn").bind("click",function(){
		uodateBillStatu("REJECT");
	});
	
	$("#key").bind('keyup', function(event) {
		if (event.keyCode == 13){
			searchData();
		}
	});
	
	$('#tab li').bind('click',function(){
		$(this).addClass("hover").siblings().removeClass("hover");
		searchData();
	});
	searchData();
});

function uodateBillStatu(ststu){
	 var selectRows = $list_dataGrid.getSelectedRows();
	 var housePowers =[];
	 if(selectRows==null || selectRows.length==0){
			art.dialog.tips("请至少选择一个进行操作！");
			return false;
		}
	 for (var i = 0; i < selectRows.length; i++)
	    {
		 	if(selectRows[i].billStatu=="SUBMIT" ){
		 		var newRow={};
			 	newRow.id = selectRows[i].id;
			 	newRow.billStatu =ststu;
		    	housePowers.push(newRow);
		 	}
	    }
	 if(housePowers.length==0){
		 art.dialog.tips("没有需要做此操作的单据！");
		 return;
	 }
	 	var hpStr  =JSON.stringify(housePowers);
		$.post(getPath()+"/hr/employeeOrientation/updateStatu",{hpStr:hpStr},function(data){
			if(data.STATE=="SUCCESS"){
 			art.dialog.tips(data.MSG);
 			resetList();
 		}else{
 			art.dialog.tips(data.MSG);
 			resetList();
 		}
		},"json");
}
/**
 * 操作
 * 
 * @param data
 * @returns {String}
 */
function operateRender(data) {

	var res = "<a style=\"color:blue\" href=\"javascript:editRow({id:'"+ data.id + "'})\">编辑</a>"
		         +" | <a style=\"color:red\" href=\"javascript:deleteRow({id:'"+ data.id +"'})\">删除 </a> |" ;
	if (data.isLaunch == 1) {
		res = res+'<a href="javascript:onOff({id:\'' + data.id + '\',status:\'0\'});">取消发布</a>';
	} else if (data.isLaunch == 0) {
		res = res+'<a href="javascript:onOff({id:\'' + data.id + '\',status:\'1\'});">发布</a>';
	} 
	if (data.isTop == 1) {
		res = res+'<a href="javascript:onOffTop({id:\'' + data.id + '\',status:\'0\'});"> | 取消置顶</a>';
	} else if (data.isTop == 0) {
		res = res+'<a href="javascript:onOffTop({id:\'' + data.id + '\',status:\'1\'});"> | 置顶</a>';
	} 
	return res;
}
/**
 * 启用禁用；status：1表示启用；status:0表示禁用
 * 
 * @param data
 * @returns
 */
function onOff(data) {
	if (data.status == 1) {
		art.dialog.confirm('确定发布操作吗?', function() {
			$.post(getPath() + '/website/catelogData/onOffBatch', {
				id : data.id,
				isLaunch : 1
			}, function(res) {
				art.dialog.tips(res.MSG);
				if (res.STATE == 'SUCCESS') {
					refresh();
				}
			}, 'json');
			return true;
		}, function() {
			return true;
		});
	} else if (data.status == 0) {
		art.dialog.confirm('确定取消发布操作吗?', function() {
			$.post(getPath() + '/website/catelogData/onOffBatch', {
				id : data.id,
				isLaunch : 0
			}, function(res) {
				art.dialog.tips(res.MSG);
				if (res.STATE == 'SUCCESS') {
					refresh();
				}
			}, 'json');
			return true;
		}, function() {
			return true;
		});
	} 

}


//批量发布与取消
function batchOnOff(isLaunch){
	var arr = $list_dataGrid.selected;
	if(arr.length==0){
		art.dialog.tips("请至少选择一个进行操作！");
		return;
	}
	var result = conStr(arr);
	art.dialog.confirm('确定此批量操作吗?', function() {
		$.post(getPath() + '/website/catelogData/onOffBatch', {
			id : result,
			isLaunch : isLaunch
		}, function(res) {
			art.dialog.tips(res.MSG);
			if (res.STATE == 'SUCCESS') {
				refresh();
			}
		}, 'json');
		return true;
	}, function() {
		return true;
	});
	
}
//置顶操作
function onOffTop(data){
	if (data.status == 1) {
		art.dialog.confirm('确定置顶操作吗?', function() {
			$.post(getPath() + '/website/catelogData/onOffTop', {
				id : data.id,
				isTop : 1
			}, function(res) {
				art.dialog.tips(res.MSG);
				if (res.STATE == 'SUCCESS') {
					refresh();
				}
			}, 'json');
			return true;
		}, function() {
			return true;
		});
	} else if (data.status == 0) {
		art.dialog.confirm('确定取消置顶操作吗?', function() {
			$.post(getPath() + '/website/catelogData/onOffTop', {
				id : data.id,
				isTop : 0
			}, function(res) {
				art.dialog.tips(res.MSG);
				if (res.STATE == 'SUCCESS') {
					refresh();
				}
			}, 'json');
			return true;
		}, function() {
			return true;
		});
	} 
}
function conStr(arr){
	var result = "";
	for(var i = 0 ;i<arr.length ; i++){
		result +=arr[i].id;
		if(i < arr.length-1 ){
			result+=",";
		}
	}
	return result;
}


/**
 * 状态显示方法
 * 
 * @param data
 * @returns {String}
 */
function isEnable(data) {
	if (data.isEnable == 1) {
		return '启用';
	} else if (data.isEnable == 0) {
		return '<span style="color:red">禁用</span>';
	} 
}

/**
 *	查询
 */
function searchData() {
	$list_dataParam['longNumber'] = longNumber;
	var keyWord = $("#keyWork").val();
	if (keyWord && ($('#keyWork').attr("defaultValue") != keyWord)) {
		$list_dataParam['keyWork'] = keyWord;
	} else {
		delete $list_dataParam['keyWork'];
	}
	var isLaunch = $("#isLaunch").val();
	if(isLaunch!=''){
		$list_dataParam['isLaunch'] = isLaunch;
	}else{
		delete $list_dataParam['isLaunch'];
	}
	$list_dataParam['catelogId'] = catelogId;
	var dType = "SINGLE" ;
	resetList();
}



/**
 * 清空
 */
function onEmpty() {
	$("#keyWork").val($("#keyWork").attr("defaultValue"));
	$('#isLaunch').val("");
	searchData();
}



