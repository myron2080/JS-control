$list_editUrl = getPath()+"/basedata/weixinorg/edit";//编辑及查看url
$list_addUrl = getPath()+"/basedata/weixinorg/add";//新增url
$list_deleteUrl = getPath()+"/basedata/weixinorg/delete";//删除url
$list_editWidth = "500px";
$list_editHeight = "200px";
$list_dataType = "微信组织";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:200,minLeftWidth:200,allowLeftCollapse:true,allowLeftResize:true});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
      			{display: '名称', name: 'name', align: 'left', width:130},
      			{display: '编码', name: 'number', align: 'left', width:100 },
      			{display: '上级组织', name: 'parent.name', align: 'left', width:100 },
      			{display: '备注', name: 'description', align: 'left', width:250 },
      			{display: '操作', name: 'operate', align: 'center', width: 130,render:operateRender} 
        ],
        url:getPath()+'/basedata/weixinorg/listData',
        delayLoad:false
    }));
	$("#selectData").click(function(){
		selectList();
	});
	eventFun($("#keyConditions"));
});

function operateRender(data,filterData){
	return '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>|'
	+'<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
}



function beforeAddRow(){
	addRow({});
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
//清除
$("#clearData").click(function(){	
	$("#keyConditions").val($('#keyConditions').attr("defaultValue"));
});
//新增
$("#addNoteApply").click(function(){
	beforeAddRow();
});
$("#firstimp").click(function(){
	art.dialog.confirm('确定导入微信企业号组织数据?',function(){
		firstimp();
	},function(){
		
	});
});
/************************
 * 根据条件查询数据
 * **********************
 */

function selectList(){
	var keyWord = $("#keyConditions").val();
	if(keyWord== '' || keyWord ==$('#keyConditions').attr("defaultValue")){
		delete $list_dataParam['key'];
	} else{
		$list_dataParam['key'] = keyWord;
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

function firstimp(){
	$.post(getPath()+"/basedata/weixinorg/importData",{},function(data){
		if(data.STATE == "SUCCESS"){
			art.dialog.tips(data.MSG);
			resetList();
		}else{
			art.dialog.alert(data.MSG);
		}
	},'json');
}

//删除行
function deleteRow(rowData){
	if($list_deleteUrl && $list_deleteUrl!=''){
		art.dialog.confirm('确定删除该行数据?',function(){
			$.ligerDialog.confirm('是否与微信服务器同步？', function (yes) {
				var syncweixin = "0";
				if(yes==true){
					syncweixin = "1";
				}
				
				$.post($list_deleteUrl,{id:rowData.id,syncweixin:syncweixin},function(res){
					art.dialog.tips(res.MSG);
					if(res.STATE=='SUCCESS'){					
						refresh();
					}
				},'json');
				
			});
			return true;
		},function(){
			return true;
		});
	}
}
