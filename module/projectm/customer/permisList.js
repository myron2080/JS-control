$list_editUrl = getPath()+"/projectm/customer/editPermis";//编辑及查看url
$list_addUrl = getPath()+"/projectm/customer/addPermis";//新增url
$list_deleteUrl = getPath()+"/projectm/customer/deletePermis";//删除url
$list_editWidth = "900px";
$list_editHeight = "350px";
$list_dataType = "客户授权";//数据名称
$(document).ready(function(){
	params ={};
	params.inputTitle = "合作日期:不限";	
	MenuManager.common.create("DateRangeMenu","operatedate",params);
	$("#main").ligerLayout({leftWidth:200,minLeftWidth:200,allowLeftCollapse:true,allowLeftResize:true});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
      			{display: '操作', name: 'operate', align: 'center', width:130,render:operateRender,isSort: false},
      			{display: '许可号', name: 'licenseNo', align: 'left', width:60,isSort: true},
      			{display: '客户名称', name: 'customer.name', align: 'left', width:80,isSort: true },
      			{display: '备注', name: 'remark', align: 'left', width:90,isSort: false },
      			{display: '模块数', name: 'moduleCount', align: 'left', width:50,isSort: false },
      			{display: '台式终端许可', name: 'computerNumber', align: 'left', width:90,render:cRender,isSort: true },
      			{display: '移动终端许可', name: 'mobileNumber', align: 'left', width:80,render: mRender,isSort: false },
      			{display: '特征码', name: 'number', align: 'center', width: 80,isSort: false},
      			{display: '服务启动时间', name: 'runTime', align: 'left',dateFormat:"yyyy-MM-dd HH:mm",formatters:"date", width:130,isSort: false },
      			//{display: '服务器IP', name: 'ip', align: 'left', width:110,isSort: false },
      			{display: '最后刷新时间', name: 'lastUpdateTime', align: 'left',dateFormat:"yyyy-MM-dd HH:mm",formatters:"date", width:130,isSort: false },
      			//{display: '失效时间', name: 'failureTime', align: 'center',dateFormat:"yyyy-MM-dd",formatters:"date", width:80,isSort: true },
//      			{display: '当前台式数', name: 'onlineCount_c', align: 'left', width:75,isSort: true },
//      			{display: '当前移动数', name: 'onlineCount_m', align: 'left', width:75,isSort: false },
      			{display: '访问地址', name: 'visitUrl', align: 'left', width:350,isSort: false }
        ],        
        url:getPath()+'/projectm/customer/permisListData',
        enabledSort :true,
        delayLoad:false
        ,
        onDblClickRow:function(data){
        	showPermis(data.id);
        }
    }));
	$("#searchBtn").click(function(){
		selectList();
		var key = $("#key").val();
		if(key!="" && key!=null && key!=$("#key").attr("dValue")){
			$.post(base+"/projectm/customer/permisOnlineData?key="+key,function(res){
				$("#online_m").text(res.ONLINE_M);
				$("#online_c").text(res.ONLINE_C);
			},"json");
		}else{
			$.post(base+"/projectm/customer/permisOnlineData",function(res){
				$("#online_m").text(res.ONLINE_M);
				$("#online_c").text(res.ONLINE_C);
			},"json");
		}
		
	});
	//清除
	$("#clearBtn").click(function(){	
		clearAll();
	});
	
	$.post(base+"/projectm/customer/permisOnlineData",function(res){
		$("#online_m").text(res.ONLINE_M);
		$("#online_c").text(res.ONLINE_C);
	},"json");
	
});

/**
 * 清空
 */
function clearAll(){
	$("#key").val($("#key").attr("dValue"));
	MenuManager.menus["operatedate"].resetAll();
}

function showPermis(id){
	var showDetailCustomerUrl = getPath()+"/projectm/customer/viewPermis?id="+id;//新增url
	art.dialog.open(showDetailCustomerUrl,
			{title:'查看详细',
			lock:true,
			width:"550px",
			height:"300px",
			id:'showPermis',
			button:[{name:'关闭'}]}
	);
}

function cRender(data){
	if(data.computerNumber != -1){
		if(data.computerNumber!=0&&data.computerNumber!=null&&data.computerNumber!=""){
		return data.onlineCount_c+"/"+data.computerNumber;
		}else{
			return data.onlineCount_c+"/禁用";	
		}
	}else{
		return data.onlineCount_c+"/"+"无限";
	}
}

function mRender(data){
	if(data.mobileNumber != -1){
		if(data.mobileNumber!=0&&data.mobileNumber!=null&&data.mobileNumber!=""){
			return data.onlineCount_m+"/"+data.mobileNumber;
			}else{
				return data.onlineCount_m+"/禁用";	
			}
	}else{
		return data.onlineCount_m+"/"+"无限";
	}
}

function operateRender(data,filterData){
		var str= '<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a>';
		if(data.valid==1){
			str+='|<a href="javascript:disableRow({id:\''+data.id+'\'},0);"><font color="red">禁用</font></a>';
		}else{
			str += '|<a href="javascript:disableRow({id:\''+data.id+'\'},1);">启用</a>';
		}
		var url = data.visitUrl;
		if(data.visitUrl==null||data.visitUrl==''){
			str +='|<a href="javascript:toLogin();">登录</a>' 
		}else{
			if(data.dataSource!=null&&data.dataSource!=''){
				url += "?dataCenter="+data.dataSource +"&signature=4C-0F-6E-F8-65-9A"
			}else{
				url += "?signature=4C-0F-6E-F8-65-9A"
			}
			str +='|<a href="'+url+'" target="_blank">登录</a>' 
		}
		str +='|<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>'
		return str;
}
function toLogin(){
		art.dialog.tips("登录地址不存在!");		
}

/**
 * 禁用
 */
function disableRow(data,valid){
	$.post(getPath()+"/projectm/customer/updatePermisValid",{id:data.id,valid:valid},function(res){
		resetList();
	},"json");
	
}

/************************
 * 根据条件查询数据
 * **********************
 */

function selectList(){	
	var key = $("#key").val();
	if(key!="" && key!=null && key!=$("#key").attr("dValue")){
		$list_dataParam['key'] = key;
	}else{
		delete $list_dataParam['key'];
	}
	
//	var queryStartDate = "";
//	var queryEndDate = "";
//	if(MenuManager.menus["operatedate"]){
//		queryStartDate = MenuManager.menus["operatedate"].getValue().timeStartValue;
//		queryEndDate = MenuManager.menus["operatedate"].getValue().timeEndValue;
//	}
	
	//查询开始时间
//	if(queryStartDate != ""){
//		$list_dataParam['startDay'] = queryStartDate
//	} else {
//		delete $list_dataParam['startDay'];
//	}
//	//查询结束时间
//	if(queryEndDate != ""){
//		$list_dataParam['endDay'] = queryEndDate
//	} else {
//		delete $list_dataParam['endDay'];
//	}
	
	resetList();
}
/**
 ***************************
 ** 回车查询
 ***************************
 */
//回车查询
$(document).keydown(function(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		$("#searchBtn").click();
     }
}); 
