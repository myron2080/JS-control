var secondPassCommon = {
		declare:{
			module:'',
			modulename:'',
			container:'',
			success:''
		},
		init:function(param){
			jQuery.extend(secondPassCommon.declare,param);
			if(secondPassCommon.declare.container){
				$("#"+secondPassCommon.declare.container).click(function(){
					secondPassCommon.opensecond();
				});
			}
			$.post(getPath()+"/basedata/secondPassword/initPass",param,function(data){
				if(data.STATE == 'SUCCESS'){
					secondPassCommon.enterpass();
				}
			},'json');
		},
		opensecond:function(){
			if(!secondPassCommon.declare.module){
				art.dialog.alert("请传入功能标志");
				return;
			}
			var dlg =art.dialog.open(getPath()+"/basedata/secondPassword/editPage?module="+secondPassCommon.declare.module,
					{id : "editsecondpass",
					title : secondPassCommon.declare.modulename+"二级密码设定",
					background : '#333',
					width : 350,
					height : 150,
					lock : true	,
					 button:[{name:'确定',callback:function(){
							if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
								dlg.iframe.contentWindow.saveEdit();
							}
							return false;
						}},{name:'取消',callback:function(){
							flag = false;
							return true;
						}}]});
		},
		enterpass:function(){
			var dlg =art.dialog(
					{id : "editsecondpass",
					title : secondPassCommon.declare.modulename+"输入二级密码",
					background : '#fff',
					opacity:1,
					content:"<span>请输入密码</span><input id='passdialog' type='password'/>",
					width : 250,
					height : 100,
					lock : true	,
					cancel:false,
					 button:[{name:'确定',callback:function(){
							$.post(getPath()+"/basedata/secondPassword/validatePass",{
								passinp:$("#passdialog").val(),
								module:secondPassCommon.declare.module
								},function(data){
									if(data.STATE == 'SUCCESS'){
										if(secondPassCommon.declare.success){
											window[secondPassCommon.declare.success].call(null);
										}
										setTimeout(function(){dlg.close()},1000);																		
									}else{
										art.dialog.tips("密码错误");
									}
							},'json');
							return false;
						}}]});
		}
}

