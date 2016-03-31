$(document).ready(function(){
	getBaseData("0071");
	initajaxupload('uploadImage','ebhouse/images/compressUpload?direct=notice',afterupload,submitupload);

});

genehtml = function(a){
	var html = "";
	for(var i=0;i<a.length;i++){
		html +="<option value='"+a[i].id+"'"+((selpart==a[i].id)?"selected":"")+">"+a[i].name+"</option>";
	}
	$("#partsel").html(html);
	
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
	
		var imageStrVal="";
		$("img[imageKey='srcKey']").each(function(i){
			imageStrVal+=$(this).attr("flag")+",";  
		});
		if(imageStrVal) imageStrVal = imageStrVal.substring(0, imageStrVal.length-1);
		//图片字符串
		$("#photostr").val(imageStrVal);	
		
	$("#dataForm").submit();
};

function saveEdit(dlg){
	currentDialog = dlg;
	valiData();
}

afterupload = function(json){
	hideload();
	if(json.STATE=='FAIL'){
		art.dialog.alert(json.MSG);
		return;
	}else{
	 var url=json.PATH;
     var name = json.FILENAME;
     var imgid = "imag"+(new Date()).getTime();
     var h = $('<dl style="width:120px;float:left;margin-left:20px;" id="'+imgid+'">'+
				              '<dt style="width:120px"><img  style="width:120px;height:120px;" flag="'+url+'" imageKey="srcKey" src="'+getPath()+'/images/'+url.replace("size","300X200")+'"/></dt>'+
		 		              '<dd style="width:120px">'+
					          '<a href="javascript:void(0)"  escape="true" enlarger="'+getPath()+'/images/'+url.replace("size","300X200")+'">'+
					          '<img src="'+getPath()+'/default/style/images/photo02.gif"/>原图</a> '+
					          '<a href=javascript:deletePhoto("'+imgid+'")><img src="'+getPath()+'/default/style/images/photo03.gif"/>删除</a>'+
		 		              '</dd></dl>');
     $("#noticephotodiv").append(h);
     
     EnlargerImg.init();	
     
     art.dialog.tips(json.MSG);
	}
}

submitupload = function(){
	showload();
}

function deletePhoto(id){
	art.dialog.confirm('确定删除?',function(){
			$('#'+id).remove();
	});
}