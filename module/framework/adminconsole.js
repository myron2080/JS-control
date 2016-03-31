function loadConfig(){
	var curdata = $("#dataCenter").val();

		if(curdata) resetInput();
		
		$.post(getPath()+"/manager/loadConfig",{dataCenter:curdata},function(data){
			if(data.STATE&&data.STATE=='FAIL'){
				art.dialog.alert(data.MSG);
			}else{
			for(var i=0;i<data.length;i++){
				var temp = data[i];
				$("#"+temp.number).val(temp.paramValue);
			}
			
			if($("#controlmode").val()) $("#controlchk").attr("checked",true);
			if($("#browerrestrict").val()) $("#browerchk").attr("checked",true);
			
			loadlicensedesc();
			}
		},'json');
}

function setTab(name,cursel){
		var curdata = $("#dataCenter").val();
		var objId = "con_"+name+"_"+cursel;
		$(".ds_title").find(".hover").removeClass("hover");
		$(".ds_title").find("#"+name+cursel).addClass("hover");
		$(".sort_box").find("div[id^='con_one']").hide();
		$("#"+objId).show();
		if(cursel==2){
			var url = getPath()+"/cmct/smsControl/toSmsConfig?dc="+curdata;
			$("#smsiframe").attr("src",url);
		}
		if(cursel==3){
			var url = getPath()+"/cmct/phoneconfig/index?dc="+curdata;
			$("#calliframe").attr("src",url);
		}
}

addUploadButton=function(id){
	
	var url = '/manager/upload?direct=license';
	var upajax = new AjaxUpload($("#"+id), {
    	action: getPath()+url,
        autoSubmit: true,
        name: "license",
        responseType: "json",
        onSubmit: function(file, extension){
        	showload();    	
        	//图片上传时做类型判断
        	
        	if (extension && /^(lic)$/.test(extension)) {
            }
            else {
            	art.dialog.tips("只允许上传lic后缀的文件");
                hideload();
                return false;
            }
        	upajax.setData({dataCenter:$("#dataCenter").val()});
        },
        onComplete: function(file, json){  
        	hideload();
        	
        	if(json.STATE=='FAIL'){
        		art.dialog.tips(json.MSG);
        		return;
        	}else{
            // 在输入框显示url，并触发url文本框的onchange事件，以便预览图片    
        		 var url=json.PATH;           
                 var name = json.fileName;
                
                 $("#licensedesc").html("电脑数:"+json.allowcount+" 有效日期至:"+json.enddate);
                 $("#licensepath").val(url);
                 //$("#licensespan").html(name);
		           art.dialog({
		        	   content:json.MSG,
		        	   time:1,
		        	   close:function(){
		        	   return true;
		        	   },
		        	   width:200
		        	   });

           
        }
        }
    });
}

function save(){
	
	$("#savebtn").attr("disabled",true);
	var curli = $(".ds_title").find(".hover").attr("key");
	var curdata = $("#dataCenter").val();
	
	//初始化单选框
	if($("#controlchk").attr("checked")=='checked'){
		$("#controlmode").val("MAC");
	}else{
		$("#controlmode").val("");
	}	
	
	if($("#browerchk").attr("checked")=='checked'){
		$("#browerrestrict").val("1");
	}else{
		$("#browerrestrict").val("");
	}	
	
	$.post(getPath()+"/manager/admin-save?curpanel="+curli+"&dataCenter="+curdata,$('form').serialize(),function(json){
		
		art.dialog.tips(json.MSG);
		$("#savebtn").attr("disabled",false);
	},'json');
}

function check(){
	if(!$("#licensepath").val()){
		art.dialog.tips("请上传");
		return false;
	}
}

function loadlicensedesc(){
	//if(!$("#licensepath").val()) return;
	
	 $.post(getPath()+"/manager/loadLicense",{licensepath:$("#licensepath").val()},function(json){
		 $("#licensedesc").html("电脑数:"+json.allowcount+" 有效日期至:"+json.enddate);
		// $("#licensespan").html(" "+$("#licensepath").val().substr($("#licensepath").val().lastIndexOf("/")+1));
	 },'json');
}

function resetInput(){
	$("form")[0].reset();
	$("#licensedesc").html("");
    $("#licensepath").val("");
   // $("#licensespan").html("");
}

function init(){
	$("#refreshbtn").click(function(){
		var curdata = $("#dataCenter").val();
		if(!curdata) return;
		$.post(getPath()+"/manager/refreshBaseConfig",{dataCenter:curdata},function(json){
			if(json.STATE=='FAIL'){
        		art.dialog.tips(json.MSG);
        		return;
        	}else{
        		art.dialog.tips(json.MSG);
        	}
		},'json');
	});
	
	
	
}

$(document).ready(function(){
	//addUploadButton('uploadbtn');
	loadConfig();
	init();
});
