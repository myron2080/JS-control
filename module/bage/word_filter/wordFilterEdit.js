$(function(){
	
});

function initForm(){
//	$.metadata.setType("attr", "validate");
	var v = $("form").validate({
		rules : {
			word : {
				required : true,
				remote : {
					type:'POST',
					url:getPath()+'/bage/wordFilter/wordIsExist',
					data:{
						id:function(){
							return $("#id").val();
						},
						word:function(){
							return $("#word").val();
						}
					}
				}
			},
			replaceWord : {
				required : true
			}
		},
		messages:{
			word:{required:"词语不能为空",remote:"词语已经存在"},
			replaceWord:{required:"替换的词语不能为空"}
		},
        //调试状态，不会提交数据的
        debug: true,
        onkeyup:false,
        errorPlacement: function (lable, element)
        {

            if (element.is("textarea"))
            {
                element.addClass("l-textarea-invalid");
            }
            else if (element.is("input"))
            {
                element.parent().addClass("l-text-invalid");
            }
            $(element).attr("title", lable.html());
            $(element).poshytip();
            
            
        },
        success: function (lable)
        {
            var element = $("#" + lable.attr("for"));
            if (element.hasClass("l-textarea"))
            {
                element.removeClass("l-textarea-invalid");
            }
            else if (element.hasClass("l-text-field"))
            {
                element.parent().removeClass("l-text-invalid");
            }
            //$(element).removeAttr("title").ligerHideTip();
            $(element).poshytip("destroy");
            $(element).removeAttr("title");
        },
        submitHandler: function ()
        {
        	submitForm();
        }
    });
	$("form:not(.noLiger)").ligerForm();
}