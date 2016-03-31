//页面打开加载时自动生成编号
 $(document).ready(function(){
	 var number = $("#pNumber").val();
   if (null == number || "" == number) {
	 //先查询已经存在的编号
		$.ajax({
		    type: 'POST',
		    url: base+"/ebsite/weixin/participants/getParticipants",
		    dataType: 'text',
		    success:function(pNumber)
		    {
		    	$("#pNumber").val(pNumber);
		    }
		});
   }
});

/*function saveAdd(dlg){
	var playerName = $(document).find('input[name="playerName"]').val();
	if(!isNotNull(playerName)){
		art.dialog.tips('请填写参与人姓名！');
		flag = false;
		return;
	}
    //提交
	$("form").submit();
	saveEdit(dlg);
}*/