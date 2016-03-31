
function initCommonEvent(){
	
	//选择系统默认头像
	$("#chooseSystemImage").bind("click",function(){
		popDialog("/hr/person");
	});
	
	//uploadImage();
	
	//绑定招聘渠道change事件
	$("#recruitmethod").bind("change",function(){
		if($(this).val() == "COMPANY"){
			$("#companyIntroducerComp").show();
		} else {
			$("#companyIntroducerComp").hide();
		}
	});
	$("#uploadImage").bind("click",function(){
		personPhotCut();
	});
	
}

//选择默认头像的回调函数,名字必须为这个
function chooseImgFun(selectedValue){
	if(selectedValue){
		$("#personPhoto").attr("src",getPath() + '/images/'+selectedValue);
		$("#photo").val(selectedValue);
	}
}
//头像裁剪
function personPhotCut(){
	var dataId = $('#dataId').val();
	var dlg = art.dialog.open(base+"/hr/person/personPhotoCut?personId="+dataId,{
		id : 'edit',
		title:"头像裁剪",
		width : 700,
		height : 450,
		lock:true,
		ok: function () {
			if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.save){
				dlg.iframe.contentWindow.save(dlg);
			}
			return false;
		},
		cancelVal: '关闭',
	    cancel: true,
	    close:function(){	
	    	//window.location = window.location;
	    }
	});
}

//更新头像
function uploadImage(){
	var belong = $('#dataId').val();
	new AjaxUpload($("#uploadImage"), {
    	action: getPath()+'/basedata/photo/upload?direct=person/head'+(belong?('&belong='+belong):''),
        autoSubmit: true,
        name: "image",
        responseType: "json",
        onSubmit: function(file, extension){
            if (extension && /^(jpg|png|gif)$/.test(extension)) {
            }
            else {
                alert("只允许上传jpg|png|gif图片");
                return false;
            }
        },
        onComplete: function(file, json){   
        	if(json.error){
        		alert('图片要求宽大于320，或者高大于240');
        		return;
        	}
            // 在输入框显示url，并触发url文本框的onchange事件，以便预览图片
        	var url=json.path;
			if(json.STATE == "SUCCESS"){
				$("#personPhoto").attr("src",getPath() + '/images/'+url);
				$("#photo").val(url);
			} else {
				art.dialog.alert(json.MSG);
			}
        }
	 });
}