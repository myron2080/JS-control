$(document).on("mobileinit", function() {
  $.mobile.selectmenu.prototype.options.nativeMenu = false;//select 弹出层选择
}).ready(function(){
	addPhotoButton("uploadImage","wxQphotonames");
	 $("#saveBtn").bind("click",function(){
		  saveWxQuestion();
	  });
});


function loading(txt){
	$.mobile.loading( 'show', {
		  text: txt+"...",
		  textVisible: true,
		  theme: "b",
		  textonly: false
		  });
}

function saveWxQuestion(){
	if(checkSave()){
		loading('保存中');
		submitForm();
	}
}

function checkSave(){
	var comPanyName=$.trim($('#companyName').val());
	if(comPanyName=='' || comPanyName==null || comPanyName==$("#companyName").attr("dValue")){
		msgDialog("请输入公司名称!");
		return false;
	}
	
	
	var phone=$.trim($("#telNumber").val());

	if(phone=='' || phone==null || phone==$("#telNumber").attr("dValue")){
		msgDialog("请填写你的联系方式!");
		return false;
	}

	if(!(/^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/).test(phone)){
		msgDialog("请填写正确的手机号码!");
		return false;
	}
	
	var content=$.trim($("#content").val());
	if(content=='' || content==null){
		msgDialog("请输入内容!");
		return false;
	}else if(content.length>200){
		$('#content').val(content.substr(0,200)+'...');	
	}else{
		$('#content').val(content);	
	}
	return true;
}


function submitForm(){
	var dary = $("#wxQphotonames").find("dl");
	var imgstr = "";
	for(var i=0;i<dary.length;i++){
		var imgid = $(dary[i]).attr("id");
		if(imgid) imgstr += imgid+",";
	}
	$("#wxQphotoids").val(imgstr);

	$.post($('form').attr('action'),$('form').serialize(),function(res){
		if(res.STATE == "SUCCESS"){
			msgDialog('反馈成功,请点左上角退出编辑界面');
			clearWxQuestion();
			$.mobile.loading( "hide" );
		}else{
			msgDialog(res.MSG);
		}
    },'json');
}

function clearWxQuestion(){
	$('#companyName').val('');
	$("#telNumber").val('');
	$("#content").val('');
	var dary =$("#wxQphotonames").find("dl");
	if(dary.length>0){
		$("#wxQphotonames").find("dl").remove();
	}
}
function ltrim(str){ //删除空格
    str=str.replace(/<[^>]+>/g,"");//去掉所有的html标记
    str=str.replace(/&nbsp;/g,"");
    str=str.replace(/\s+/g,"");//去除所有空格
   return str;
}

/**
 * textarea自适应
 */
$.fn.extend({
    textareaAutoHeight: function(options) {
        this._options = {
            minHeight: 0,
            maxHeight: 1000
        }
 
        this.init = function() {
            for (var p in options) {
                this._options[p] = options[p];
            }
            if (this._options.minHeight == 0) {
                this._options.minHeight = parseFloat($(this).height());
            }
            for (var p in this._options) {
                if ($(this).attr(p) == null) {
                    $(this).attr(p, this._options[p]);
                }
            }
            $(this).keyup(this.resetHeight).change(this.resetHeight)
                .focus(this.resetHeight);
        }
        this.resetHeight = function() {
            var _minHeight = parseFloat($(this).attr("minHeight"));
            var _maxHeight = parseFloat($(this).attr("maxHeight"));
 
            if (!$.browser.msie) {
                $(this).height(0);
            }
            var h = parseFloat(this.scrollHeight);
            h = h < _minHeight ? _minHeight :
                h > _maxHeight ? _maxHeight : h;
            $(this).height(h).scrollTop(h);
            if (h >= _maxHeight) {
                $(this).css("overflow-y", "scroll");
            } else {
                $(this).css("overflow-y", "hidden");
            }
        }
        this.init();
    }
});

addPhotoButton=function(id,parentdiv){
	var url = '/interflow/wxQuestion/upload?direct=wxQuestion';
	
	new AjaxUpload($("#"+id), {
    	action: getPath()+url,
        autoSubmit: true,
        name: "image",
        responseType: "json",
        onSubmit: function(file, extension){
        	loading('上传中');    	
        	//图片上传时做类型判断
        	 
        	if (extension && /^(jpg|png|jpeg|gif)$/.test(extension)) {
            }
            else {
                alert("只允许上传 jpg | png | jpeg | gif图片");
                $.mobile.loading( "hide" );
                return false;
            }
        	
        	var length = $("#wxQphotonames").find("dl").length;

        	if(length>=2){
        		alert("最多只允许上传2张照片");
        		$.mobile.loading( "hide" );
        		return false;
        	}
        	
        },
        onComplete: function(file, json){  
        	$.mobile.loading( "hide" );
        	if(json.STATE=='FAIL'){
        		msgDialog(json.MSG);
        		return;
        	}else{
            // 在输入框显示url，并触发url文本框的onchange事件，以便预览图片
           var url=json.path;
           var id = json.id;
           var name = json.fileName;
            
   			$('<dl id="'+json.id+'"><dt><img id="img'+json.id+'" key="'+imgBase+'/'+url.replace("size","origin")+'" src="'+getPath()+'/default/style/images/loading.gif" /></dt>'+
   					'<dd><a href="javascript:delphoto(\''+json.id+'\')">删除</a></dd></dl>').appendTo($("#"+parentdiv));
   			setTimeout(function(){
   				var url=$('#img'+json.id).attr("key");
   				$('#img'+json.id).attr("src",url);
   			},2000);
   			msgDialog(json.MSG);
   		 
        }
        }
    });
}

function delphoto(id){
	var url = "/interflow/wxQuestion/deleteWxPhoto";
	$.post(getPath()+url,{id:id},function(json){	
		json = eval("("+json+")");
		msgDialog(json.MSG);
		if(json.STATE=='FAIL'){
    		return;
    	}else{
    		$("#"+id).remove();
    	}
	});
	
}


/**
 * 弹出 提示信息
 * @param txt
 */
function msgDialog(txt){
	$("#msgStr").text(txt);
	$( "#popupSystemMsg" ).popup( "open" );
	setTimeout("$( '#popupSystemMsg' ).popup( 'close') ", 1500 )
}
