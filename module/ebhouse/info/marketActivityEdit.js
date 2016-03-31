$(document).ready(function(){
	
	initajaxupload('uploadImage','ebhouse/images/compressUpload?direct=marketactivity',afterupload,submitupload);
	
	initajaxupload('uploadFrontImage','ebhouse/images/compressUpload?direct=marketactivity',afterFrontupload,submitupload);
});

afterFrontupload = function(json){
	hideload();
	if(json.STATE=='FAIL'){
		art.dialog.alert(json.MSG);
		return;
	}else{
	 var url=json.PATH;
     var name = json.FILENAME;
     $("#frontPhoto").val(url);
     $("#frontPhotoName").val(name);  
     art.dialog.tips(json.MSG);
	}
}

afterupload = function(json){
	hideload();
	if(json.STATE=='FAIL'){
		art.dialog.alert(json.MSG);
		return;
	}else{
	 var url=json.PATH;
     var name = json.FILENAME;
     $("#homePhoto").val(url);
     $("#homePhotoName").val(name);  
     art.dialog.tips(json.MSG);
	}
}

submitupload = function(){
	showload();
}
valiData = function(){
		
		if(!contentEditor.getContentTxt()){
			art.dialog.tips("内容不能为空");
			return;
		}else{
			var content = $.trim(contentEditor.getContentTxt());//获得编辑器的纯文本内容	
			var str = '';
			var ind = 1;
			while(str.length==0){
				if(100*(ind-1)>content.length){
					break;
				}else{
				var contemp = content.length>100*ind?content.substr(0,100*ind):content;
				if(contemp.lastIndexOf('&'))
				var andind = contemp.lastIndexOf('&');
				var fenind = contemp.lastIndexOf(';');
				if(andind>fenind) contemp+=';';
				andind = contemp.lastIndexOf('<');
				fenind = contemp.lastIndexOf('>');
				if(andind>fenind) contemp+='>';
				str = contemp.replace(/<.*>/g,'').replace(/&.*;/g,'').replace(/\s/g,'');
				}
				ind++;
			}
			$('#preview').val(str+'...');
		}
		
		if($("#regvisitchk").attr("checked")=='checked'){
			$("#registerVisit").val("1");
		}else{
			$("#registerVisit").val("0");
		}
		
	
	$("#dataForm").submit();
};

function saveEdit(dlg){
	currentDialog = dlg;
	valiData();
}