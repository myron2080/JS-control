$list_editUrl = getPath()+"/cmct/phonemember/edit";//编辑及查看url
$list_addUrl = getPath()+"/cmct/phonemember/add";//新增url
$list_deleteUrl = getPath()+"/cmct/phonemember/delete";//删除url
$list_editWidth = 1000;
$list_editHeight = 600;
$list_dataType = "电话" ;
var curbindId = '';
$(document).ready(function(){
	params ={};
	params.width = 260;
	params.inputTitle = "开通日期";
	MenuManager.common.create("DateRangeMenu","openDate",params);
	
	$("#key").focus(function(){
		if($(this).val()=="号码/分配号码/mac地址"){
			$(this).val("");
		}
	}).blur(function(){
		if($(this).val()==""){
			$(this).val("号码/分配号码/mac地址");
		}
	});
	
	//注册控件key的回车查询事件
	inputEnterSearch('key',searchData);
	
	/**
	 * 设置默认值
	 */
	
	$("#searchBtn").bind("click",function(){
		searchData();
	});
	
	var columnsParam=[ 
                    {display: '操作', name: '', align: 'center', width: 70,render:editMethod, isSort:false},
                    {display: '核算渠道', name: 'configName', align: 'center', width: 80, isSort:false},
                    {display: '使用组织', name: 'org.name', align: 'center', width: 100, isSort:false},
	                {display: '分配固定号码', name: 'showPhone', align: 'center', width: 100, isSort:false}, 
	                {display: '别名', name: 'alias', align: 'center', width: 120, isSort:false},
		            {display: '权限模版', name: 'phoneRight.name', align: 'left',width:90,render:operateIsDefaultPrivilege},
		            {display: '允许呼叫本地手机', name: 'phoneRight.localMob', align: 'center', width: 120, isSort:false,render:staterender},
	                 {display: '允许呼叫本地固话', name: 'phoneRight.localFixed', align: 'center', width: 120, isSort:false,render:staterender},
	                 {display: '允许呼叫国内长途', name: 'phoneRight.domestic', align: 'center', width: 120, isSort:false,render:staterender},
	                 {display: '允许呼叫国际长途', name: 'phoneRight.interTempletID', align: 'center', width: 120, isSort:false,render:staterender},
	                 {display: '允许隐藏呼出', name: 'phoneRight.hide', align: 'center', width: 120, isSort:false,render:staterender},
	                 {display: '黑名单', name: 'phoneRight.black', align: 'center', width: 150, isSort:false}
		            /*{display: '当前使用', name: 'currentUser.name', align: 'right', width: 100,render:currentOprate, isSort:false}*/
	                  ];
    
	//{display: '当前使用', name: 'currentUser.name', align: 'right', width: 100,render:currentOprate, isSort:false}
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: columnsParam,
        width:"99%",
        enabledSort:true,
        parms:{orgId:$("#orgId").val()},
        url:getPath() + '/cmct/phonemember/listRightData'

    }));
	
	
});


function editMethod(data){
	var str='';
	
	if(data.phoneRight&&data.phoneRight.callRightId&&data.isDefaultPrivilege!='YES'){
		str += '<a class="delete_font" href="javascript:unbindRight({id:\''+data.id+'\'});">解绑权限</a>';
	}else{
		str += '<a class="delete_font" href="javascript:bindRight({id:\''+data.id+'\',orgId:\''+data.orgInterfaceId+'\'});">绑定权限</a>';
	}
	
	return str;
}


function searchData(){
	var key=$("#key").val();
	if(key == '号码/分配号码/mac地址'){
		key='';
	}
	$list_dataParam['key'] = key;
	$list_dataParam['state'] = $("#state").val();
	$list_dataParam['orgId'] = $("#orgId").val();
	resetList();
}


function bindRight(obj){
	var orgId = obj.orgId;
	curbindId = obj.id;
	art.dialog.open(getPath()+"/framework/dataPicker/list?query=phoneRightQuery&orgId="+orgId,{
		id : "getPhoneRight",
		title : '绑定权限',
		background : '#333',
		width : 450,
		height : 450,
		lock : true	 
		});
	art.dialog.data("returnFunName","updateRight");
}

function updateRight(obj,type){
	var param = {};
	param['rightid'] = obj.id;
	param['memberid'] = curbindId;
	param['callRightId'] = obj.callRightId;
	param['type'] = 'bind';
	$.post(getPath()+"/cmct/phonemember/bindRight",param,function(res){
		
		if(res.STATE=='SUCCESS'){
			art.dialog.tips(res.MSG);
			refresh();
		}else{
			art.dialog.alert(res.MSG);
		}
	},'json');
}

function unbindRight(obj){
	var param = {};
	param['memberid'] = obj.id;
	param['type'] = 'unbind';
	$.post(getPath()+"/cmct/phonemember/bindRight",param,function(res){
		
		if(res.STATE=='SUCCESS'){
			art.dialog.tips(res.MSG);
			refresh();
		}else{
			art.dialog.alert(res.MSG);
		}
	},'json');
}

function staterender(d,filterData,a,b){
	if(b.name == 'phoneRight.localMob'){
		if(a=='1') return "是";
		else return "";
	}else if(b.name == 'phoneRight.localFixed'){
		if(a=='1') return "是";
		else return "";
	}else if(b.name == 'phoneRight.domestic'){
		if(a=='1') return "是";
		else return "";
	}else if(b.name == 'phoneRight.interTempletID'){
		if(a=='99') return "是";
		else return "";
	}else if(b.name == 'phoneRight.hide'){
		if(a=='1') return "是";
		else return "";
	}
	return "";
}

function operateIsDefaultPrivilege(data){
	if(data.phoneRight!=null){
		if(data.isDefaultPrivilege=="YES"){
			return data.phoneRight.name+ "<img src='"+imgPrePath+"/default.png'/>";
		}
		return data.phoneRight.name;
	}

}
function rightmanage(){
	 art.dialog.open(getPath()+'/cmct/phoneRight/list',
				{title:'权限管理',
				 lock:true,
				 width:$list_editWidth||'auto',
				 height:$list_editHeight||'auto',
				 id:$list_dataType+"-ADD",
				 button:[{name:'取消',callback:function(){					
						return true;
					}}],
				 close:function(){
					 searchData();
				 }
				});
}