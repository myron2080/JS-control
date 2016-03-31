var entryGrid;
$(document).ready(function(){
	entryGrid=$("#entryContainer").ligerGrid($.extend({},$edit_defaultGridParam,{
		toolbar: { items: [
            {id:'addNewRow',text:'增加',click:addEntry,icon:'add'},
            {line: true },
            {text: '删除', click: removeEntry, icon: 'delete'}
            ]
        },
		columns:[
			{display:'职级名称',name:'name',width:200,align:'left',editor:{type:'text'}},
			{display:'等级',name:'level',width:80,align:'left',editor:{type:'int',minValue:1}},
			{display:'描述',name:'description',width:260,align:'left',editor:{type:'text'}}
		],
		height:'200px',
		usePager:false,
		alternatingRow:false,
		checkbox:false,
		enabledEdit:$edit_viewstate!='VIEW',
		url:getPath() + "/basedata/job/jobLevel",
		parms:{job:$('#dataId').val()}
	}));
	
	//名字输入完之后自动带出简写
	$('#name').bind('change',function(){
		toPinyin($(this).val(),function(result){
			$('#simplePinyin').val(result.simple);
		});
	});
});
function addEntry(){
	
	if($edit_viewstate=="VIEW")return;
	
	var datas = entryGrid.getData();
	var index = 1;
	for(var i = 0; i < datas.length; i++){
		if(datas[i].level >= index){
			index = datas[i].level + 1;
		}
	}
	entryGrid.addEditRow({'level':index});
}
function removeEntry(){
	
	if($edit_viewstate=="VIEW")return;
	
	entryGrid.deleteSelectedRow();
}
function saveEdit(){
	entryGrid.endEdit();
	
	if($("#haslevelchk").attr("checked")=='checked'){
		$("#haslevelinp").val('1');
	}else{
		$("#haslevelinp").val('0');
	}
	
	var datas = entryGrid.getData();
	if($("#haslevelinp").val()=='1'){
		if(datas && datas.length <= 0){
			art.dialog.tips("请录入职级");
			return;
		}
	}
		
	if(datas && datas.length > 0){
		var str = "[";
		for(var i = 0; i < datas.length;i++){
				if(datas[i].id && datas[i].id!='undefined'){
					str += "{id:'"+datas[i].id+"'";
				}else{
					str +="{id:''";
				}
				if(datas[i].name&& datas[i].name!='undefined'){
					str +=",name:'"+datas[i].name+"'";
				}else{
					art.dialog.tips("第"+(i+1)+"行职级名称为空");
					return;
				}
				if(!isNaN(datas[i].level&& datas[i].level!='undefined')){
					str +=",level:'"+datas[i].level+"'";
				}else{
					art.dialog.tips("第"+(i+1)+"行等级不合法");
					return;
				}
				if(datas[i].description&& datas[i].description!='undefined'){
					str +=",description:'"+datas[i].description+"'}";
				}else{
					str +=",description:''}";
				}
				if(i != datas.length-1){
					str += ",";
				}
		}
		str += "]";
		$('#entryJson').val(str);
	
	}
	
	$("form").submit();
	return false;
}
function saveAdd(){
	saveEdit();
}

function changelevel(obj){
	if($(obj).attr("checked")=='checked'){
		$("#entryContainer").show();
	}else{
		$("#entryContainer").hide();
	}
}