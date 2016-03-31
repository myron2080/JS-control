$(document).ready(function(){
		initCommonEvent();
		$('#editBtn').bind("click",function(){
			$(this).parent().hide();
			$('em[e]').each(function(){
				var e = $(this).attr('e');
				$('em[for="'+e+'"]').show();
				$(this).hide();
			});
			$('#saveBtn').parent().show();
			$('#cancelBtn').parent().show();
			$('#changePwd').parent().hide();
//			$('#secPassBtn').parent().hide();
//			$('#newPassBtn').parent().hide();
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
			    	var oriPassword = $("#oriPassword").val();
			    	$.post(getPath()+"/permission/user/judge/password",{oriPassword:oriPassword},function(result){
			    		if(result.STATE=='SUCCESS'){
					    	var p1 = $('#pwd1').val();
					    	var p2 = $('#pwd2').val();
					    	if(p1==null || $.trim(p1)==''){
					    		art.dialog.tips('新密码不能为空');
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
			    		} else {
			    			art.dialog.tips(result.MSG);
			    		}
			    	},"json");
				    	
			    	return false;
			    }},{name:"取消"}
			    ]
			});
		});
		
//		$("#secPassBtn").bind("click",function(){
//			setPass('second');
//		});
//		$("#newPassBtn").bind("click",function(){
//			setPass('new');
//		});
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
	
	function setPass(type){
		var secPass=$("#secPass").val();
		var url="/broker/customerManager/setPasswork";
		var deleteUrl="/broker/customerManager/deletePasswork";
		if(type == 'new'){//新房客密码
			secPass=$("#newPass").val();
			url="/fastsale/intention/setPasswork";
			deleteUrl="/fastsale/intention/deletePasswork";
		}
		if(secPass == '0'){//设置密码
			art.dialog.confirm("确定要设置密码吗?",function(){
				$.ajax({
					type:"post",
					url:base+url,
					data:{},
					dataType:"json",
					success:function(data){		
						art.dialog.tips(data.MSG);
							if(type == 'new'){//新房客密码
								$("#newPassBtn").text("新房私客密码删除");
								$("#newPass").val(1);
							}else{
								$("#secPassBtn").text("二手房私客密码删除");
								$("#secPass").val(1);
							}
					}
				});
			});
		}else{//取消密码
			var d = art.dialog({
				title:'取消密码',
			    content: document.getElementById('cusRightBtn'),
			    id: 'EF893L',
			    width:180,
			    height:80,
			    lock:true,
			    button:[{name:"确定",callback:function(){
			    	var password=$("#cusRightPassword").val();
			    	$.ajax({
			    		type:"post",
			    		url:base+deleteUrl,
			    		data:{password:password,isPass:"N"},
			    		dataType:"json",
			    		success:function(data){
			    			d.close();
			    			art.dialog.tips(data.MSG);
			    			$("#cusRightPassword").val("");
			    			if(data.MSG == '操作成功!'){
			    				if(type == 'new'){//新房客密码
									$("#newPassBtn").text("新房私客密码");
									$("#newPass").val(0);
								}else{
									$("#secPassBtn").text("二手房私客密码");
									$("#secPass").val(0);
								}
			    			}
			    		}
			    	});
			    	return false;
			    }},{name:"取消"}
			    ]
			});
		}
	}
