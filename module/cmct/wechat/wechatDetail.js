$(document).ready(function(){
	Autocomplete.init({
		$em:$("#mateName"),
		$obj:$("#mateId"),
		url:getPath()+"/cmct/wechatCommunication/getPersons",
		maxRows:10,
		afterSelect: function(){
			addMate();
		}
	});
	addPhotoButton("uploadImage","wechatPhotonames","image");
	
});
function submitTheForm(){
	if(checkForm()){
		submitForm();
	}else{
		$("#submitBtn").attr("disabled",false);
		$("#submitBtn").attr("class","smsbtn");
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



/**
 ***************************
 ** 提交验证处理
 ***************************
 */
function submitForm(){
		$.post($('form').attr('action'),$('form').serialize(),function(res){
			if(res.STATE == "SUCCESS"){
				alert(res.MSG);
				setTimeout(function(){
					parent.parent.closeWxMessage();
				},1000);
			}else{
				alert(res.MSG);
				setTimeout(function(){
					$("#submitBtn").attr("disabled",false);
					$("#submitBtn").attr("class","smsbtn");
				},3000);
			}
	    },'json');
}

checkForm = function(){
	$("#submitBtn").attr("class","smsbtn_fail");
	$("#submitBtn").attr("disabled",true);
	$("#personIds").val(getAllSpanMate());
	 var type=$("input[name='type']:checked").val();
	 var title = $("input[name='title']").val();
	 if(!isNotNull(title) && type=='PICT'){
		 alert("发送标题不能为空！");
		 return false;
	 }
	 
	 if(!isNotNull($("#personIds").val())){
		 alert("请选择同事!");
		 return false;
	 }
	 
//	 var content = $("textarea[name='content']").val();
//	 if(!isNotNull(content)){
//		 alert("发送内容不能为空！");
//		 return false;
//	 }
	 
	 if(!contentEditor.hasContents()){
			$("#contentStr").show();
			$("#contentStr").text("内容不能为空");
			art.dialog.tips("内容不能为空");
			return false;
	}else{
		$("#contentStr").hide();
	}
	 
	 var flag=true;
	
	 if(type=="PICT"){
		 if(!$("#picUrl").val()){
			 flag=false;
			 alert("请选择图片!");
		 }
		 return flag;
	 }
	 
	 return true;
}

successMsg = function(){
	 alert("发送成功!");
	 parent.closeWxMessage();
}

faildMsg = function(){
	 alert("发送失败");
}

function deleteMate(obj){
	$(obj).parent().remove();
	setSelectNum();
}

function addMate(){
	var mateVal=getAllSpanMate();
	var mateId=$("#mateId").val();
	var addr=mateId.split(",");
	var mateName=$("#mateName").val();
	if(mateVal.indexOf(addr[0])!=-1){
		$("#selectedSpan").show();
		setTimeout(function(){
			$("#selectedSpan").hide();
		},1500);
	}else{
		var li="<li id='"+addr[0]+"'>"
	        +mateName+":<input type='text' id='customerPhone' value='"+addr[1]+"'/><a href='javascript:void(0)' onclick='deleteMate(this)'><img src='"+getPath()+"/default/style/images/fastsale/send_message.gif'/></a>"
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
		var oneVal=$(this).attr("id");
		mateVal=oneVal+";"+mateVal;
	});
	return mateVal;
}

/**
 * 同步 选择 同事 数
 */
function setSelectNum(){
	var len=$("#mateLi li").length;
	$("#selectNum").html(len);
}

addPhotoButton=function(id,parentdiv,type){
	var url = "/basedata/photo/upload?direct=wechat";
	new AjaxUpload($("#"+id), {
    	action: getPath()+url,
        autoSubmit: true,
        name: "image",
        responseType: "json",
        onSubmit: function(file, extension){
        	//图片上传时做类型判断
        	if(type=='image'){
        	if (extension && /^(jpg|png|jpeg|gif)$/.test(extension)) {
            }
            else {
                alert("只允许上传jpg|png|jpeg|gif图片");
                return false;
            }
        	
        	var length = $("#"+parentdiv).find("div").length;
        	if(length>=1){
        		alert("最多只允许上传1张照片");
        		return false;
        	}
        	}
        },
        onComplete: function(file, json){  
        	if(json.STATE=='FAIL'){
        		alert(json.MSG);
        		return;
        	}else{
            // 在输入框显示url，并触发url文本框的onchange事件，以便预览图片
           var url=json.path;
           var id = json.id;
           var name = json.fileName;
           var pdiv = $("<div style='float:left;margin-left:10px;' imgDiv id='"+json.id+"div' imgid='"+json.id+"'><span>"+name+"</span>&nbsp;<a href='javascript:void(0)' onclick=delphoto('"+json.id+"','"+type+"','"+parentdiv+"')>删除</a></div>");
           $("#picUrl").val(url);
           $("#"+parentdiv).append(pdiv);
        }
        }
    });
}

function delphoto(id,type,parentdiv){
	$("#"+id+"div").remove();
	var url = "/basedata/photo/delete";
	$.post(getPath()+url,{id:id},function(json){
		json = eval("("+json+")");
		if(json.STATE=='FAIL'){
    		alert(json.MSG);
    		return;
    	}else{
    		 $("#picUrl").val('');
    	}
	});
}

function typeChange(obj){
	if($(obj).val()=="TEXT"){
		//$("#picUrl").val('');
		//$('imgDiv').remove();
		$('#uploadImageTr').hide();
		$('#titleTr').hide();
	}else{
		$('#uploadImageTr').show();
		$('#titleTr').show();
	}
}
