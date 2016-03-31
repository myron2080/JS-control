$(document).ready(function(){
	Autocomplete.init({
		$em:$("#mateName"),
		$obj:$("#mateId"),
		url:getPath()+"/cmct/note/getPersons",
		maxRows:10,
//		position: {
//			my: "left top",
//			at: "left top",
//			collision: "none"
//		},
		afterSelect: function(){
			addMate();
		}
	});
//	addOther();
	/**
	 * 初始化 选择同事个数
	 */
	setSelectNum();
	lenEvent();
	/**
	 * 默认选择 页签
	 */
	var defaultTabs=$("#defaultTabs").val();
	if(null != defaultTabs && defaultTabs != ''){
		$("#"+defaultTabs).click();
	}
});
function submitTheForm(){
	if(checkForm()){
		submitForm();
	}else{
		$("#submitBtn").attr("disabled",false);
		$("#submitBtn").attr("class","smsbtn");
	}
}

/**
 * 导入其他号码
 */
function excelOther(){
	art.dialog.data("importDataDialog","returnData");
	art.dialog.data("loadClose",Loading.close);
	var dlg = art.dialog.open(getPath()+'/cmct/note/excelOther',{
		 title:"号码导入",
		 lock:true,
		 width:'380px',
		 height:'90px',
		 id:"importDataDialog",
		 ok:function(){
			 Loading.init();
			 if(dlg.iframe.contentWindow){
				 dlg.iframe.contentWindow.selectData();
			 }
			 return false ;
		 },
		 okVal:'确定'
	});
}

/**
 * 导入号码 返回
 */
function returnData(data){
	if(null != data && data.length>0){
		for(var i=0;i<data.length;i++){
			var li="<li>"
		         +"<input type='text' id='customerPhone' onkeyup='validatePhone(this)' value='"+data[i]+"'/><a href='javascript:void(0)' onclick='closeCustomer(this)'><img src='"+getPath()+"/default/style/images/fastsale/send_message.gif'/></a>"
		         +"</li>";
		$("#otherLi").append(li);
		}
	}
}

/**
 * 验证手机号码 
 * @param obj
 */
function validatePhoneTemp(obj){
	var value = $(obj).val();
	var mobile = /^\d{11}$/; 
	if(mobile.test(value)){
		return true;
	}else{
		return false;
	}
}

function submitCheck(){
	var flag=true;
	$("#phoneUl li").each(function(){
		if($(this).attr("class") == 'phoneInput'){
			flag=false;
		}
	});
	return flag;
}


function lenEvent(){
	var content=$("#content").val()+$("#companySign").text();
	if($("#addSign").attr("checked") && $("#selectType").val() != 'self'){//选中 附加签名
		content=content+$("#signVal").val();
	}
	var theLen=parseInt(content.length,10);
//	if(theLen>70){
//		$("#content").val(content.substr(0,70));
//	}else{
	   var result=theLen/70;
	   var r = /^\+?[1-9][0-9]*$/;　　//正整数 
       if(result >=0){
    	   if(!r.test(result)){
    		   result = Math.floor(result)+1;
    	    }
       }else{
           result = Math.ceil(result);
       }
       if(result>1){
    	   $("#chartLen").html("<span style='color:red;font-size:26px;font-weight:bold;'>"+result+"</span>");
       }else{
    	   $("#chartLen").html("<span style='font-size:24px;'>"+result+"&nbsp;</span>");
       }
		$("#chartNum").html(theLen);
//	}
}

/**
 ***************************
 ** 提交验证处理
 ***************************
 */
function submitForm(){
		$.post($('form').attr('action'),$('form').serialize(),function(res){
			if(res.STATE == "SUCCESS"){
				if(res.MSG){
					alert(res.MSG);
					setTimeout(function(){
						/**
						 * 从 子页面点击进入 执行关闭 操作
						 */
						if(closeFlag == 'oneStep'){
							if(null != transferId && transferId != ''){//过户单 发送短信 回调函数
								parent.saveOperationHistroy(transferId,$("#tranferType").val());
							}
							parent.closeDetailMessage();
						}else{
							parent.parent.closeDetailMessage();
						}
					},1000);
					
				}else{
					if(closeFlag == 'oneStep'){
						parent.closeDetailMessage();
					}else{
						parent.parent.closeDetailMessage();
					}
				}
			}else{
				alert(res.MSG);
				$("#submitBtn").attr("disabled",false);
			}
	    },'json');
}
/**
 * 赋值  客户 / 业主  接收信息
 * @returns
 */
function setCusOwnerVal(){
	var value="";
	$("#phoneUl li").each(function(){
		var name=$(this).attr("id");
		var phone=$(this).find("#customerPhone").val();
		value=name+","+phone+";"+value;
	});
	$("#cusOwnerVal").val(value);
}

checkForm = function(){
	$("#submitBtn").attr("class","smsbtn_fail");
	$("#submitBtn").attr("disabled",true);
	setOtherPhone();
	$("#mateVal").val(getAllSpanMate());
	setCusOwnerVal();
	 var content = $("textarea[name='content']").val();
	 if(!isNotNull(content)){
		 alert("发送内容不能为空！");
		 return false;
	 }
	 var cusOwnerVal=$("#cusOwnerVal").val();
	 var selectType=$("#selectType").val();//类型  自己 /同事/外界
	 var mateVal=$("#mateVal").val();//选择  同事 时  同事电话号码
	 var otherVal=$("#otherVal").val();//选择外界是 输入的电话
	 var sendTime=$("#sendTime").val();//发送时间  (选择 定时发送 时为必选项)
	 if(selectType == 'self'){//发送给自己
		 if(!isNotNull($("#selfPhone").val())){
			 alert("请输入电话号码!");
			 return false;
		 }
		 if(!validatePhoneTemp($("#selfPhone"))){
		      alert("请输入正确的电话号码!");
		      return false;
		 }
	 }
	 if(selectType == 'mate'){//选择同事
		 /**
		  * 验证同事电话号码
		  */
		 var flag=true;
    	 $("#mateLi li").each(function(){
    			var one=$(this).find("#customerPhone");
     			if(!validatePhoneTemp(one)){
     				flag = false;
     			}
    	 });
    	 if(!flag){
    		 alert("请输入正确的手机号码!");
    		 return false;
    	 }
		 if(!isNotNull(mateVal)){
			 alert("请选择同事!");
			 return false;
		 }
	 }
     if(selectType == 'out'){//选择外界
    	 /**
    	  * 外界 自己输入的电话号码 需要 验证
    	  */
    	 var flag=true;
    	 $("#otherLi li").each(function(){
    			var one=$(this).find("#customerPhone");
     			if(!validatePhoneTemp(one)){
     				flag = false;
     			}
    	 });
    	 if(!flag){
    		 alert("请输入正确的手机号码!");
    		 return false;
    	 }
    	 if(!isNotNull(otherVal)){
			 alert("请输入电话号码!");
			 return false;
		 }
	 }
     /**
      * 客户 或者 业主
      */
     if(selectType == 'customer' || selectType == 'owner'){
    	 validataAll();
    	 if(!isNotNull(cusOwnerVal)){
			 alert("没有收信人!");
			 return false;
		 }
    	 if(!submitCheck()){
    		 alert("请输入准确的手机号码!");
    		 return false;
    	 }
     }
     
     var val;
 	$("input[name='dataType']").each(function(){
 		if($(this).attr("checked")){
 			val=$(this).val();
 		}
 	});
 	if(val == 'time'){//选择 定时短信
 		if(!isNotNull(sendTime)){
			 alert("请选择发送时间!");
			 return false;
		 }
 	}
	 
	 return true;
}

successMsg = function(){
	 alert("发送成功!");
	 parent.closeDetailMessage();
}
faildMsg = function(){
	 alert("发送失败");
}

/**
 * 发送之前  处理 发送外界 的所有的电话号码
 */
function setOtherPhone(){
	var oval="";
	$("#otherLi li").each(function(){
		var one=$(this).find("#customerPhone").val();
		if(null != one && one != ''){
			oval=one+","+oval;
		}
	});
	$("#otherVal").val(oval);
}

function typeChange(){
	var val;
	$("input[name='dataType']").each(function(){
		if($(this).attr("checked")){
			val=$(this).val();
		}
	});
	if(val == 'now'){
		$("#sendTimeLi").hide();
	}else{
		$("#sendTimeLi").show();
	}
}

function signChange(obj){
	if($(obj).attr("checked")){//选中
		$("#signVal").attr("readonly",false);
	}else{
		$("#signVal").attr("readonly",true);
	}
	lenEvent();
}
/**
 * 客户 业主类型 选择 电话
 * @param obj
 * @returns
 */
function clickOwner(obj){
	var val=$(obj).val();
	var phone=$("#acceptPhone").val();//接收人电话
	if($(obj).attr("checked")){//选中
		phone=val+","+phone;
	}else{
		phone=phone.replace(val+",","");
	}
	$("#acceptPhone").val(phone);
}

function validatePhone(obj){
	var value = $(obj).val();
	var mobile = /^\d{11}$/; 
	if(mobile.test(value)){
		$(obj).parent().removeClass("phoneInput");
	}else{
		$(obj).attr("title","请正确填写手机号码");
		$(obj).parent().addClass("phoneInput");
	}
}

/**
 * 删除 一个
 */
function closeCustomer(obj){
	$(obj).parent().remove();
}

/**
 * 验证所有的电话
 */
function validataAll(){
	$("#phoneUl li").each(function(){
		validatePhone($(this).find("#customerPhone"));
	});
}

/**
 * 删除 其他号码
 * @param obj
 * @returns
 */
function deleteOther(obj){
	$(obj).parent().remove();
}


/**
 * 删除 同事
 * @param obj
 * @returns
 */
function deleteMate(obj){
	/**
	 * 先找到 要删除的 内容
	 */
	$(obj).parent().remove();
	setSelectNum();
}

function setTab(obj){
	$(".system_tab li").each(function(){
		$(this).attr("class","");
	});
	$(obj).attr("class","hover");
	var val=$(obj).attr("id");
	if(val == 'self'){//自己
		$("#selfDiv").show();
		$("#cusOwner").hide();
		$("#mateDiv").hide();
		$("#otherDiv").hide();
		$("#signUl").hide();
	}else if(val == 'mate'){//同事
		$("#selfDiv").hide();
		$("#cusOwner").hide();
		$("#mateDiv").show();
		$("#otherDiv").hide();
		$("#signUl").show();
	}else if(val == 'out'){//外界
		$("#selfDiv").hide();
		$("#cusOwner").hide();
		$("#signUl").show();
		$("#mateDiv").hide();
		$("#otherDiv").show();
	}else if(val == 'customer' || val == 'owner'){//客户
		$("#selfDiv").hide();
		$("#cusOwner").show();
		$("#signUl").show();
		$("#mateDiv").hide();
		$("#otherDiv").hide();
	}
	$("#selectType").val(val);
	lenEvent();
}

/**
 * 增加 同事号码  (修改为 增加 一个同事  不同步mateVal的值 最后保存时 统一赋值)
 */
function addMate(){
	
	var mateVal=getAllSpanMate();
	var mateId=$("#mateId").val();
	/**
	 * 判断 该 同事 是否已经选择
	 */
	if(mateVal.indexOf(mateId)!=-1){
		$("#selectedSpan").show();
		setTimeout(function(){
			$("#selectedSpan").hide();
		},1500);
	}else{
		var mateId=$("#mateId").val();//val  形式为人员ID+","+电话号码
		var addr=mateId.split(",");
		var li="<li id='"+addr[0]+"'>"
	        +addr[0]+":<input type='text' id='customerPhone' onkeyup='validatePhone(this)' value='"+addr[1]+"'/><a href='javascript:void(0)' onclick='deleteMate(this)'><img src='"+getPath()+"/default/style/images/fastsale/send_message.gif'/></a>"
	        +"</li>";
	   $("#mateLi").append(li);
	   setSelectNum();
	}
	$("#mateName").val("");
	$("#mateId").val("");
}


/**
 * 获取 已经选择的所有同事的 信息
 * @returns
 */
function getAllSpanMate(){
	var mateVal="";
	$("#mateLi li").each(function(){
		var oneVal=$(this).attr("id")+","+$(this).find("#customerPhone").val();
		mateVal=oneVal+";"+mateVal;
	});
	return mateVal;
}
/**
 * 增加 其他号码
 */
function addOther(){
	 var li="<li>"
	         +"<input type='text' id='customerPhone' onkeyup='validatePhone(this)' value=''/><a href='javascript:void(0)' onclick='closeCustomer(this)'><img src='"+getPath()+"/default/style/images/fastsale/send_message.gif'/></a>"
	         +"</li>";
	$("#otherLi").append(li);
}

/**
 * 同步 选择 同事 数
 */
function setSelectNum(){
	var len=$("#mateLi li").length;
	$("#selectNum").html(len);
}