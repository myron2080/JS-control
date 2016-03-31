$list_addUrl = getPath()+"/p2p/homeData/add";//新增url
$list_editUrl = getPath()+"/p2p/homeData/edit";//编辑及查看url
$list_deleteUrl = getPath()+"/p2p/homeData/delete";//删除url
$list_editWidth = "750px";
$list_editHeight = "450px";
$list_dataType = "数据";//数据名称
$(document).ready(function() {
		$("#main").ligerLayout({});
		$(".system_tab li").click(function(){
			$(this).parent().find("li").removeClass("hover");
			$(this).addClass("hover");
			$("#curmenu").val($(this).attr("key"));
			if($(this).attr("key") != 'POUNDAGE'){
				searchlist();
				$("#poundageDiv").hide();
				$("#tableContainer").show();
				$("#top").show();
			} else {
				$.post(getPath()+'/p2p/poundage/queryPoundage',function(res){
					$("#nodetr").children("table").remove();
					var j=0;
					for(var i=0;i<res.poundageList.length;i++){
						var poundage = res.poundageList[i];
						if(poundage.id!="88888888"){
							//页面 提现手续费id=withdrawalTable 先赋值一次后再动态创建table
							if(j==0){
								$("#minMoney").attr("value",poundage.minMoney);
								$("#maxMoney").attr("value",poundage.maxMoney);
								$("#poundage").attr("value",poundage.poundage);
								j++;
							}else{
								var msg=document.getElementById("nodetr");
								var dl=document.createElement("table");
								dl.cellspacing="0";
								dl.cellpadding="0";
								dl.class="common_table";
								dl.width="100%";
								dl.border="0";
								
								msg.appendChild(dl);
								date="<tr><td width='34%' style='background:#ebebeb;'>起始金额</td><td width='33%' style='background:#ebebeb;'>结束金额</td><td width='33%' style='background:#ebebeb;'>手续费（元）</td></tr>" +
								 		"<tr><td><input name='minMoney' readonly='readonly' validate='{required:true,maxlength:15,number:true,min:0}' value="+poundage.minMoney+" type='text'/>" +
								 		"</td><td><input class='inputbox' name='maxMoney' onblur='validateMaxMoney(this)' validate='{required:true,maxlength:15,number:true,min:0}' value="+poundage.maxMoney+" type='text'/></td>" +
								 		"<td><input class='inputbox' name='poundage' validate='{required:true,maxlength:15,number:true,min:0}' value="+poundage.poundage+" type=text/></td></tr>";
								 dl.innerHTML=date;
							}
						}else{
							//充值手续费
							$("#payPoundage").attr("value",poundage.poundage);
							$("#payMaxPoundage").attr("value",poundage.maxPoundage);
						}
					}
				},'json');
				$("#poundageDiv").show();
				$("#tableContainer").hide();
				$("#top").hide();
			}
		});
		var params = {};
		params.inputTitle = "创建时间";
		params.width="310";
		MenuManager.common.create("DateRangeMenu","createTimeLi",params);
		
		params = {};
		params.inputTitle = "失效时间";
		params.width="310";
		MenuManager.common.create("DateRangeMenu","endTimeLi",params);
		
		$list_dataGrid = $("#tableContainer").ligerGrid(
		$.extend($list_defaultGridParam,
		{columns : [ 
	            	{display : '标题',name : 'name',align : 'center',width : 150} ,
	            	{display : '状态',name : 'publishdesc',align : 'center',width : 150} ,
	            	{display : '创建人',name : 'creator.name',align : 'center',width : 150} ,
	            	{display : '创建时间',name : 'createTime',align : 'center',width : 150} ,
		            {display : '失效时间',name : 'endTime',align : 'center',width : 150} ,
		            {display : '操作',name : 'id',align : 'center',width : 150,render : operateRender} ,
	            	],
					url : getPath()+ '/p2p/homeData/listData',
					height:'100%',
					delayLoad:true
			}));
		searchlist();
		
});
//添加提现手续费节点
function addnode(){
	var msg=document.getElementById("nodetr");
	var dl=document.createElement("table");
	dl.cellspacing="0";
	dl.cellpadding="0";
	$(dl).addClass('common_table');
	dl.width="100%";
	dl.border="0";
	var minValue =  $("#nodetr").children().last("tr").find("input[name='maxMoney']").val();
	if(minValue==null){
		 msg.appendChild(dl);
		 date="<tr><td width='34%' style='background:#ebebeb;'>起始金额</td><td width='33%' style='background:#ebebeb;'>结束金额</td><td width='33%' style='background:#ebebeb;'>手续费（元）</td></tr>" +
		 		"<tr><td><input name='minMoney' value='"+$("#maxMoney").val()+"' readonly='readonly' validate='{required:true,maxlength:15,number:true,min:0}' type='text'/>" +
		 		"</td><td><input class='inputbox' name='maxMoney' onblur='validateMaxMoney(this)' validate='{required:true,maxlength:15,number:true,min:0}' type='text'/></td>" +
		 		"<td><input class='inputbox' name='poundage' validate='{required:true,maxlength:15,number:true,min:0}' type=text/></td></tr>";
		 dl.innerHTML=date;
		return;
	}
	
	if(minValue!=""){
		 msg.appendChild(dl);
		 date="<tr><td width='34%' style='background:#ebebeb;'>起始金额</td><td width='33%' style='background:#ebebeb;'>结束金额</td><td width='33%' style='background:#ebebeb;'>手续费（元）</td></tr>" +
		 		"<tr><td><input name='minMoney' value='"+minValue+"' readonly='readonly' validate='{required:true,maxlength:15,number:true,min:0}' type='text'/>" +
		 		"</td><td><input class='inputbox' name='maxMoney' onblur='validateMaxMoney(this)' validate='{required:true,maxlength:15,number:true,min:0}' type='text'/></td>" +
		 		"<td><input class='inputbox' name='poundage' validate='{required:true,maxlength:15,number:true,min:0}' type=text/></td></tr>";
		 dl.innerHTML=date;
	}else{
		art.dialog.alert("请先填写完毕上条信息！");
	}
	
}
//删除节点
function delnode(){
//	$(node).closest("span").remove();
	var msg=document.getElementById("nodetr");  
	msg.removeChild(msg.lastChild);
}
function validateMaxMoney(node){
	var minPoundage = parseInt($(node).parents("table").find("tr").last().find("input").val());
	var maxPoundage = parseInt($(node).val());
	if(minPoundage>=maxPoundage){
		art.dialog.alert(minPoundage + "结束金额必须大于起始金额！" + maxPoundage);
		$(node).attr("value","");
	}
}

//保存手续费
function savepoundage(){
	$("#update").attr({"disabled":"disabled"});
	var payPoundage = $("input[id=payPoundage]").val();
	var payMaxPoundage = $("input[id=payMaxPoundage]").val();
	var i=0;
	var value;
	var minarr = new Array();
	$("input[name=minMoney]").each(function(){  
		value = $(this).val();  
        minarr[i++]=value;
    });
	var maxarr = new Array();
	i=0;
	$("input[name=maxMoney]").each(function(){  
		value = $(this).val();  
        maxarr[i++]=value;
    });
	var parr = new Array();
	i=0;
	$("input[name=poundage]").each(function(){  
		value = $(this).val();  
        parr[i++]=value;
    });
	$.post(getPath()+'/p2p/poundage/savePoundage',{payPoundage:payPoundage,payMaxPoundage:payMaxPoundage,minarr:minarr.join(","),maxarr:maxarr.join(","),parr:parr.join(",")},function(res){
			art.dialog.tips(res.MSG);
			$("#update").removeAttr("disabled");
	},'json');
}

function searchlist(){
	var params = {};
	params.type = $("#curmenu").val();
	
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["createTimeLi"]){
		queryStartDate = MenuManager.menus["createTimeLi"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["createTimeLi"].getValue().timeEndValue;
		params.createTimeStaStr = queryStartDate;
		params.createTimeEndStr = queryEndDate;
	}
	
	if(MenuManager.menus["endTimeLi"]){
		queryStartDate = MenuManager.menus["endTimeLi"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["endTimeLi"].getValue().timeEndValue;
		params.endTimeStaStr = queryStartDate;
		params.endTimeEndStr = queryEndDate;
	}
	var keyword = $("#keyword").val();
	if(keyword == $("#keyword").attr("defvalue")) keyword = '';
	params.keyword = keyword;
	
	$list_dataParam = params;	
	resetList();
}

function addone(){
	
	var flag = false;
	var dlg = art.dialog
	.open(getPath() +"/p2p/homeData/add?type="+$("#curmenu").val(),
			{
				id : "addhomeData",
				title : '添加数据',
				background : '#333',
				width : 750,
				height : 450,
				lock : true,
				button:[{name:'确定',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.valiData){
							dlg.iframe.contentWindow.valiData(dlg);
						}
						flag = true;
						return false;
					}},{name:'取消',callback:function(){
						flag = false;
						return true;
					}}],
				close:function(){
					if(flag){
						searchlist();
					}
				}
			});	
}

function operateRender(data,filterData){
	var operateStr ="";
	if(data.publish=='PUBLISHED'){
		operateStr +='<a href="javascript:publishData(\''+data.id+'\',\'NOTPUBLISH\');">取消发布</a>';
	}else{
		operateStr +='<a href="javascript:publishData(\''+data.id+'\',\'PUBLISHED\');">发布</a>|';
		operateStr +='<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a>|';
		operateStr +='<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	}
	return operateStr;
}

function publishData(id,publish){
	$.post(getPath()+"/p2p/homeData/publishData",{id:id,publish:publish},function(data){
		if(data.STATE=='SUCCESS'){
			art.dialog.tips(data.MSG);
			resetList();
			
		}
	},'json');
}
