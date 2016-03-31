$(document).ready(function(){
		initCommonEvent();
		$('#editBtn').bind("click",function(){
			$(this).hide();
			$('em[e]').each(function(){
				var e = $(this).attr('e');
				$('em[for="'+e+'"]').show();
				$(this).hide();
			});
			$('#saveBtn').show();
			$('#cancelBtn').show();
			$('#changePwd').hide();
		});
		$('#saveBtn').bind('click',function(){
			$('form').submit();
		});
		
		$('#cancelBtn').bind("click",function(){
			art.dialog.confirm("确定取消吗？",function(){
				window.location = window.location;
			});
		});
		$('#changePwd').bind('click',function(){
			var d = art.dialog({
				title:'修改密码',
			    content: document.getElementById('pwdArea'),
			    id: 'EF893L',
			    lock:true,
			    button:[{name:"确定",callback:function(){
			    	var p1 = $('#pwd1').val();
			    	var p2 = $('#pwd2').val();
			    	if(p1==null || $.trim(p1)==''){
			    		art.dialog.tips('密码不能为空');
			    	}else if(p1!=p2){
			    		art.dialog.tips('前后密码不一致');
			    	}else{
			    		$.post(getPath()+"/permission/user/resetPassword",{pwd1:p1,pwd2:p2},function(res){
			    			if(res.STATE=='SUCCESS'){
			    				art.dialog.tips('修改成功',null,"succeed");
			    				d.close();
			    			}else{
			    				art.dialog.alert(res.MSG);
			    			}
			    		},'json');
			    	}
			    	return false;
			    }},{name:"取消"}
			    ]
			});
		});
	});
	function submitForm(){
		$.post($('form').attr('action'),$('form').serialize(),function(res){
			if(res.STATE == "SUCCESS"){
				art.dialog.alert("保存成功",function(){
					var photoUrl = $("#photo").val();
					if(photoUrl && (photoUrl != '')){
						$(top.window.document).find(".head_photo").find("img").attr("src",imgBase+"/"+photoUrl);
					}
					window.location = window.location;
				},function(){});
			}else{
				art.dialog.alert(res.MSG);
			}
	    },'json');
	}