init= function(){
	//CKEDITOR.replace('schedulecontent', config);
	addUploadButton(CKEDITOR.instances.editor1);
	
	//var marketContent = $("#marketContent").val();
	//CKEDITOR.instances.schedulecontent.setData($("#schedulecontent").val());
}
/*
var config={
	 toolbar: [['Bold', 'Italic', 'Underline', 'Strike', '-', 'Subscript', 'Superscript'],
               ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent'], 
               ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'], 
               ['Link', 'Unlink'], 
               ['Image', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar'],
               '/', ['Styles', 'Format', 'Font', 'FontSize'],
               ['TextColor', 'BGColor'], 
               ['Maximize', 'ShowBlocks', '-', '-', 'Undo', 'Redo']],
     width: "660", //文本域宽度
     height: "250"//文本域高度     
}
*/