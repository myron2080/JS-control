var currentDialog ;
var saveFlag = true;
$(document).ready(function(){
	Autocomplete.init({
		$em:$("#mateName"),
		$obj:$("#mateId"),
		url:getPath()+"/bage/systemmsg/getUsers?random=" +  Math.round(Math.random()*100),
		maxRows:10,
		afterSelect: function(){
			//addMate();
		}
	});
	
});

function saveAddForm(preWinObj,operateType){
	currentDialog = preWinObj;
	if(checkForm()){
	submitForm(preWinObj,operateType);}
}

/**
 ***************************
 ** 提交验证处理
 ***************************
 */
function submitForm(dlg,operateType){
	if(operateType=="SAVE"){
		$("#publishStatus").val("SAVE");
	}else{
		$("#publishStatus").val("PUBLISH");
	}
	if(saveFlag){
		saveFlag = false;
		$.post($('form').attr('action'),$('form').serialize(),function(res){
			if(res.STATE == "SUCCESS"){
				art.dialog.tips(res.MSG);
				setTimeout(function(){
					dlg.close();
				},1000);
			}else{
				art.dialog.tips(res.MSG);
			}
	    },'json');
		}
}

checkForm = function(){
	$("#userIds").val(getAllSpanMate());
	 var receiveObject=$("input[name='receiveObject']:checked").val();
	 var title = $("input[name='title']").val();
	 if(!isNotNull(title)){
		 art.dialog.tips("标题不能为空");
		 return false;
	 }
	 if(receiveObject=="COMPANY"&&!isNotNull($("#companyId").val())){
			 art.dialog.tips("请选择公司");
			 $("#userIds").val("");
			 return false;
	 }else if(receiveObject=="SINGLE"&&!isNotNull($("#userIds").val())){
		 art.dialog.tips("请添加查看人");
		 return false;
	 }else if(receiveObject=="ALL"){
		 $("#userIds").val("");
		 $("#companyId").val("")
		 $("#companyName").val("");
	 }
	 
	 if(!contentEditor.hasContents()){
			$("#contentStr").show();
			$("#contentStr").text("内容不能为空");
			art.dialog.tips("内容不能为空");
			return false;
	}else{
		$("#contentStr").hide();
	}
	 
	 return true;
}

function deleteMate(obj){
	$(obj).parent().remove();
	setSelectNum();
}

function addMate(){
    if($("#mateId").val()==null||$("#mateId").val()==""){
    	spanMsg("请输入接收人");
    	return ;
    }
   	var mateVal=getAllSpanMate();
	var mateId=$("#mateId").val();
	var mateName=$("#mateName").val();
	if(mateVal.indexOf(mateId)!=-1){
		spanMsg("该接收人已经选择");
	}else{
		var li="<li id='"+mateId+"'>"
	        +mateName+"<a href='javascript:void(0)' onclick='deleteMate(this)'><img src='"+getPath()+"/default/style/images/fastsale/send_message.gif'/></a>"
	        +"</li>";
	   $("#mateLi").append(li);
	   setSelectNum();
	}
	$("#mateName").val("");
	$("#mateId").val("");
}
function spanMsg(msg){
	$("#selectedSpan").html(msg);
	$("#selectedSpan").show();
	setTimeout(function(){
		$("#selectedSpan").hide();
	},1500);
}
/**
 * 获取 已经选择的所有同事的 信息
 * @returns
 */
function getAllSpanMate(){
	var mateVal="";
	//debugger;
	$("#mateLi li").each(function(){
		//debugger;
		var oneVal=$(this).attr("id");
		mateVal+=oneVal+";";
	});
	if (mateVal.indexOf(";") != -1) {
		mateVal = mateVal.substring(0, mateVal.length - 1);
	}else{
		mateVal="";
	}
	return mateVal;
}

/**
 * 同步 选择 同事 数
 */
function setSelectNum(){
	var len=$("#mateLi li").length;
	$("#selectNum").html(len);
}

function typeChange(obj){
    var type=$(obj).val();
	if(type=="ALL"){
		$("#companyTr").hide();
		$("#singleTr").hide();
	}else if(type=="COMPANY"){
		$("#singleTr").hide();
		$("#companyTr").show();
	}else{
		$("#companyTr").hide();
		$("#singleTr").show();
	}
}


