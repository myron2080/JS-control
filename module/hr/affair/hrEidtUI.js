//提交表单
function submitForm(){
	   var bottuns;
	   if(currentDialog){
		   bottuns=currentDialog.config.button;
		   $(bottuns).each(function(){
			  var name=this.name; 
			  currentDialog.button({name:name,disabled:true});
		   });
		}
		$.ajax({
			url:$('form').attr('action'),
			dataType: "json",
			type:"POST",
			data: $('form').serialize(),
			success: function(res) {
				if(res.STATE == "SUCCESS"){
					if(res.MSG){
						art.dialog({
							icon: 'succeed',
						    time: 1,
						    content: res.MSG
						});
						setTimeout(function(){art.dialog.close();},1000);				
					}else{
						art.dialog.close();
					}
				}else{
					if(currentDialog){
						$(bottuns).each(function(){
						  var name=this.name; 
						  currentDialog.button({name:name,disabled:false});
					    });
						if(currentDialog.iframe.contentWindow && currentDialog.iframe.contentWindow.saveFail){
							currentDialog.iframe.contentWindow.saveFail(res);
						}
					}
					art.dialog.alert(res.MSG);
				}
			},
			error:function(){
				if(currentDialog){
					$(bottuns).each(function(){
					  var name=this.name; 
					  currentDialog.button({name:name,disabled:false});
				    });
				}
			}
		});
		
	}