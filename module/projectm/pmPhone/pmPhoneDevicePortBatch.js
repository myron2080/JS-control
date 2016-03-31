 $(document).ready(function(){
//	 $("#toolBar").ligerToolBar();
//	$("#toolBar").append(
//			'<div style="float:left;display:inline;">'
//		    +'		<input style="height:20px;" type="text" name="searchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="Mac/TT号" defaultValue="Mac/TT号" value="Mac/TT号" id="searchKeyWord" class="input"/>'
//		    +'		<li class="bluebtn btn"><a href="javascript:void(0)"><span onclick="searchData();return false;"><img src='+getPath()+'/default/style/images/common/common_search.png />查询</span></a></li>'
//		    +'		<span style="margin-left:20px;color:red;">端口TT数：</span><span id="portNumSpan"></span> '
//		    +'		<span style="margin-left:5px;color:red;">电话数：</span><span id="phoneNumSpan"></span> '
//	    	+'</div>'
//	);
//	$("#toolBar").ligerToolBar({
//		items:[{id:'autoDistribute',text:'<a href="javascript:void(0)">自动配号</a>',click:autoDistributePhoneNum}]
//	});
//	
//	$("div[toolbarid='autoDistribute'] span","#toolBar").addClass("orangebtn btn");
//	$("div[toolbarid='autoDistribute']","#toolBar").hover(function(){
//		$(this).removeClass("l-panel-btn-over");
//	});
 
	var customerId = $("#customerId").val();
	if(customerId){
		searchData();
	}
});
 
  

function searchData(){
	var para = {};
	//para.currentPage = 1;
	//para.pageSize = 30;
	var kw = $('#searchKeyWord').val();
	kw = kw.replace(/^\s+|\s+$/g,'');
	$('#searchKeyWord').val(kw);
	if(kw==$('#searchKeyWord').attr('defaultValue')){
		kw='';
	}
	if(kw==null || kw == ''){
		delete para['keyWord'];
	}else{
		para['keyWord'] = kw;
	}
 
	para['status'] = 'NOTDISTRIBUTED';//空闲状态
	var customerId = $("#customerId").val();
	if(customerId){
		para['customerId'] = customerId;
	}else{
		delete para['customerId'];
		art.dialog.tips("请选择客户!");
		return ;
	}
	
	para['orderByClause'] = " D.FLASTUPDATETIME DESC";
	 
	$.post(base+'/projectm/pmPhoneDevicePort/listAllData',para,function(showList){
		$("#customerIdTemp").val($("#customerId").val());
		$("#tableContainer").html(""); 
		if(showList  && showList.length>0){
			var div='<table id="tabDevicePort"  width="100%" cellpadding="0" cellspacing="0" border="0" class="common_table">';
			div += '<tr><td align="center">设备标识</td><td align="center">端口TT号</td><td align="center">对应号码</td></tr>';
			for(var i=0;i<showList.length;i++){
				var obj=showList[i];
				 div += '<tr><td >'+obj.deviceMac+'</td>';
				 div += '<td >'+obj.portNum+'</td>';
				 div += '<td ><input class="length-medium" id="'+obj.id+'"  phoneMemberId="'+(obj.phoneMemberId||'')+'" onblur="getDistributePhoneNum(this)"  name="phoneNum"    />';
				 div += '<span phoneMsg style="color:red;display:none;">  *不存在该电话号或者已分配给其它端口TT号</span></td>';
				 div += '</tr>';
			}
			div+= '</table>';
			$("#tableContainer").append(div);
			$("#portNumSpan").text(showList.length); 
		}else{
			$("#portNumSpan").text(0); 
			var html="";
			html +='<div style="width:95%; min-height:200px; text-align:center; padding-top:30%;">';
			html +='<img  src="'+base+'/default/style/images/mobile/approveblank.png" />';
			html +='</div>'
			$("#tableContainer").append(html);
			 
		}
	},'json');
}

/**
 * 自动分配号码
 */
function autoDistributePhoneNum(){
	var para = {};
	var customerId = $("#customerId").val();
	if(customerId){
		para['customerId'] = customerId;
	}else{
		delete para['customerId'];
		art.dialog.tips("请选择客户!");
		return ;
	}
	var portNum = $("#portNumSpan").text(); 
	if(!portNum){
		portNum = 0;
		art.dialog.tips("没有要配号的端口TT号，请先查询!");
		return ;
	}else{
		portNum = parseInt(portNum);
	}
	var phoneNum = $("#phoneNumSpan").text(); 
	if(!phoneNum){
		phoneNum = 0;
	}else{
		phoneNum = parseInt(portNum);
	}
	para['statesIn'] = "'USE','UNUSE'";//已分配 +已分配
	para['notDistributed'] = 'Y';//未匹配端口TT号
	showload();
	$.post(base+'/projectm/pmPhonemember/listAllData',para,function(showList){
		hideload(); 
		if(showList  && showList.length>0){
			for(var i=0;i<showList.length;i++){
				var obj=showList[i];
				if(i==portNum){
					//如果号码多于端口TT号 则跳出循环
					break;
				}
				var portObj =  $("input",$("#tableContainer tr:eq("+(i+1)+")").get(0));
				 portObj.attr("phoneMemberId",obj.id);
				 portObj.val(obj.showNumber);
				 
			}
			$("#phoneNumSpan").text(showList.length);
		}else{
			$("#phoneNumSpan").text(0);
			art.dialog.tips("没有可分配的电话号!");
		} 
	},'json');
}


/**
 * 校验分配号码
 */
function getDistributePhoneNum(iptObj){
	iptObj.value = $.trim(iptObj.value);
	if(!iptObj.value){
		return ;
	}
	var para = {};
	var customerId = $("#customerId").val();
	if(customerId){
		para['customerId'] = customerId;
	}else{
		delete para['customerId'];
		art.dialog.tips("请选择客户!");
		return ;
	}
	 
	para['statesIn'] = "'USE','UNUSE'";//已分配 +已分配
	para['notDistributed'] = 'Y';//未匹配端口TT号
	para['showNumberEq'] = iptObj.value;
	showload();
	$.post(base+'/projectm/pmPhonemember/listAllData',para,function(showList){
		hideload(); 
		if(showList  && showList.length>0){
			if(showList.length==1){
				var obj=showList[0];
				$(iptObj).attr("phoneMemberId",obj.id);
				$("span",$(iptObj).parent("td").get(0)).text(" 正确");
				$("span",$(iptObj).parent("td").get(0)).show();
			}else{
				$(iptObj).attr("phoneMemberId",'');
				$("span",$(iptObj).parent("td").get(0)).text(" *存在重复的电话号!");
				$("span",$(iptObj).parent("td").get(0)).show();
				//art.dialog.tips($("#customerName").val()+" 存在重复的电话号!");
				//$(iptObj).focus();
			}
		}else{
			$(iptObj).attr("phoneMemberId",'');
			$("span",$(iptObj).parent("td").get(0)).text(" *不存在该电话号或者已分配给其它端口TT号!");
			$("span",$(iptObj).parent("td").get(0)).show();
			//art.dialog.tips($("#customerName").val()+" 不存在该电话号或者已分配给其它端口TT号!");
			//$(iptObj).focus();
		} 
	},'json');
}
 
function clearSearch(){
	$('#searchKeyWord').val($('#searchKeyWord').attr('defaultValue'));
	MenuManager.menus["operatedate"].resetAll();
}

//回车查询
$(document).keydown(function(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		searchData();
     }
}); 


function beforesave(dlg){
	var devicePortArr = [];
	var devicePortCkObj = {};
	var flag = true;
	var msgflag = true;
	$("input",$("#tableContainer").get(0)).each(function(){
		var devicePort = {};
		devicePort.id = $(this).attr("id");
		devicePort.phoneMemberId = $(this).attr("phoneMemberId");
		devicePort.phoneNum = $(this).val();
		if(!devicePort.phoneNum){
			return true;
		} 
		if(!devicePort.phoneMemberId){
			$("span",$(this).parent("td").get(0)).text(" *不存在该电话号或者已分配给其它端口TT号!");
			$("span",$(this).parent("td").get(0)).show();
			msgflag = false ;
			return false;
		}
		if(devicePortCkObj.phoneMemberId == devicePort.phoneMemberId ||
				devicePortCkObj.phoneNum == devicePort.phoneNum){
			flag = false;
			$(this).focus();
			return false;
		}else{
			devicePortCkObj.phoneMemberId = devicePort.phoneMemberId;
			devicePortCkObj.phoneNum = devicePort.phoneNum;
		}
		
		devicePortArr.push(devicePort);
	});
	if(!msgflag){
		return false;
	}
	if(devicePortArr.length<1){
		art.dialog.tips("没有要保存的数据!");
		return false;
	} 
	if(!flag){
		art.dialog.tips("不能分配重复的号码!");
		return false;
	} 
	
	$("#devicePortJson").val(JSON.stringify(devicePortArr));
	return true;
}
 
//保存编辑数据
function saveEdit(dlg){
	//增加前置函数,用于保存时逻辑检测和赋值
	if(typeof(beforesave) == "function"){
		if(!beforesave(dlg)){
			return false;
		}
	} 
	currentDialog = dlg; 
	$('form').submit();
	return false;
}

function submitForm(){
	 var bottuns;
  if(currentDialog){
	   bottuns=currentDialog.config.button;
	   $(bottuns).each(function(){
		  var name=this.name; 
		  currentDialog.button({name:name,disabled:true});
	   });
	}
	$.ajax({
		url:$('form').attr('action'),
		dataType: "json",
		type:"POST",
		data: $('form').serialize(),
		success: function(res) {
			if(res.STATE == "SUCCESS"){
				if(res.MSG){
					art.dialog({
						icon: 'succeed',
					    time: 1,
					    content: res.MSG
					});
					searchData();
					//setTimeout(function(){art.dialog.close();},1000);	
					$(bottuns).each(function(){
						  var name=this.name; 
						  currentDialog.button({name:name,disabled:false});
					   });
				}else{
					//art.dialog.close();
				}
			}else{
				if(currentDialog){
					$(bottuns).each(function(){
					  var name=this.name; 
					  currentDialog.button({name:name,disabled:false});
				    });
					if(currentDialog.iframe.contentWindow && currentDialog.iframe.contentWindow.saveFail){
						currentDialog.iframe.contentWindow.saveFail(res);
					}
				}
				
				art.dialog.alert(res.MSG);
				if(res.dpError && res.dpError.phoneNum){
					var iptError = $("input[value='"+res.dpError.phoneNum+"'");
					iptError.attr("phoneMemberId",'');
					$("span",iptError.parent("td").get(0)).text(" *不存在该电话号或者已分配给其它端口TT号!");
					$("span",iptError.parent("td").get(0)).show();
					iptError.focus();
				}
			}
		},
		error:function(){
			if(currentDialog){
				$(bottuns).each(function(){
				  var name=this.name; 
				  currentDialog.button({name:name,disabled:false});
			    });
			}
		}
	});
	
}
 