$list_editUrl = getPath()+"/cmct/phoneRight/edit";//编辑及查看url
$list_addUrl = getPath()+"/cmct/phoneRight/add";//新增url
$list_deleteUrl = getPath()+"/cmct/phoneRight/delRight";//删除url
$list_editWidth = "580px";
$list_editHeight = "290px";
$(document).ready(function(){
	$("#toolBar").ligerToolBar({
		items:[
		       {id:'add',text:'新增',click:addPhoneRight,icon:'add'}
			]
		});
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns:[ 
                 {display: 'id', name: 'id', align: 'center', width: 0, hide:true},
                 {display: '名称', name: 'name', align: 'center', width: 80, isSort:false},
                 {display: '组织名称', name: 'callOrgName', align: 'center', width: 100, isSort:false},
                 {display: '核算渠道', name: 'configName', align: 'center', width: 80, isSort:false},
                 {display: '允许呼叫本地手机', name: 'localMob', align: 'center', width: 100, isSort:false,render:staterender},
                 {display: '允许呼叫本地固话', name: 'localFixed', align: 'center', width: 100, isSort:false,render:staterender},
                 {display: '允许呼叫国内长途', name: 'domestic', align: 'center', width: 100, isSort:false,render:staterender},
                 {display: '允许呼叫国际长途', name: 'interTempletID', align: 'center', width: 100, isSort:false,render:staterender},
                 {display: '允许隐藏呼出', name: 'hide', align: 'center', width: 100, isSort:false,render:staterender},
                 {display: '黑名单', name: 'black', align: 'center', width: 150, isSort:false},
                 {display: '操作', name: 'id', align: 'center', width: 120, isSort:false,render:oprender}
                 ],
        headerRowHeight:50,
        enabledSort:true,
        delayLoad:true,
        pageSize:30,
        url:getPath() + '/cmct/phoneRight/listData',
        onDblClickRow:function(rowData,rowIndex,rowDomElement){
        	
	    }
    }));
	searchData();
});

/**
 * 查询
 */
function searchData(){
	$list_dataParam['orgInterfaceId'] = $("#orgInterfaceId").val();
	resetList();
}

function oprender(d){
	var opHtml = "<a href='javascript:void(0)' onclick=editPhoneRight({id:'"+d.id+"'})>修改</a>|<a href='javascript:void(0)'  onclick=deleteRow({id:'"+d.id+"'})>删除</a>";
	if(d.orgDefault && d.orgDefault == 'YES'){
		opHtml += "|<a href='javascript:void(0)' class='delete_font' onclick=doSetDefault({id:'"+d.id+"',type:'setDefaultNone'}) >取消默认</a>" ;
	}else{
		opHtml += "|<a href='javascript:void(0)' onclick=doSetDefault({id:'"+d.id+"',type:'setDefault'}) >设为默认</a>" ;
	}
	return opHtml ;
}


function doSetDefault(obj){
	var param = {};
	param['rightid'] = obj.id;
	param['type'] = obj.type;
	$.post(getPath()+"/cmct/phoneRight/setDefault",param,function(res){
		if(res.STATE=='SUCCESS'){
			art.dialog.tips(res.MSG);
			refresh();
		}else{
			art.dialog.alert(res.MSG);
		}
	},'json');
}

function staterender(d,filterData,a,b){
	if(b.name == 'localMob'){
		if(a=='1') return "是";
		else return "否";
	}else if(b.name == 'localFixed'){
		if(a=='1') return "是";
		else return "否";
	}else if(b.name == 'domestic'){
		if(a=='1') return "是";
		else return "否";
	}else if(b.name == 'interTempletID'){
		if(a=='99') return "是";
		else return "否";
	}else if(b.name == 'hide'){
		if(a=='1') return "是";
		else return "否";
	}
	return "";
}

function addPhoneRight(){
		//增加行
		if($list_addUrl && $list_addUrl!=''){
			var paramStr = '';
			if($list_addUrl.indexOf('?')>0){
				paramStr = '&VIEWSTATE=ADD';
			}else{
				paramStr = '?VIEWSTATE=ADD';
			}
	
			var flag = true;
			var dlg = art.dialog.open($list_addUrl,
					{title:getTitle('ADD'),
					 lock:true,
					 width:$list_editWidth||'auto',
					 height:$list_editHeight||'auto',
					 id:$list_dataType+"-ADD",
					 button:[{name:'确定',callback:function(){
							if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.validateForm){
								dlg.iframe.contentWindow.validateForm(dlg);
							}
							return false;
						}},{name:'取消',callback:function(){
							flag = false;
							return true;
						}}],
					 close:function(){
						 if(flag){
							 resetList();
						 }
					 }
					});
		}
	
}

function editPhoneRight(rowData){
	if($list_editUrl && $list_editUrl!=''){
		var paramStr;
		if($list_editUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=EDIT&id='+rowData.id;
		}else{
			paramStr = '?VIEWSTATE=EDIT&id='+rowData.id;
		}
		var flag = true;
		var dlg = art.dialog.open($list_editUrl+paramStr,
				{title:getTitle('EDIT'),
				 lock:true,
				 width:$list_editWidth||'auto',
				 height:$list_editHeight||'auto',
				 id:$list_dataType+"-EDIT",
				 button:[{name:'确定',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.validateForm){
							dlg.iframe.contentWindow.validateForm(dlg);
						}
						return false;
					}},{name:'取消',callback:function(){
						flag = false;
						return true;
					}}],
				 close:function(){
					
					 if(flag){

						 refresh();
					 }
				 }
				});
	}

}
