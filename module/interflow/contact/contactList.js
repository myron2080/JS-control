function addcontact(){
	var flag = false;
	var dlg = art.dialog
	.open(getPath() +"/interflow/contact/add",
			{
				id : "addcontact",
				title : '新增联系人',
				background : '#333',
				width : 400,
				height : 400,
				lock : true,
				button:[{name:'确定',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
							dlg.iframe.contentWindow.saveAdd(this);
						}
						flag = true;
						return false;
					}},{name:'取消',callback:function(){
						flag = false;
						return true;
					}}],
				close:function(){
					if(flag){
						initData();
						}
					
				}
			});			
}

function viewcontact(id){
	art.dialog.open(getPath() +"/interflow/contact/view?id="+id,
			{
				id : "view",
				title : '知识详情',
				background : '#333',
				width : 830,
				height : 550,
				lock : true	,
				close:function(){					
						refreshSearch();				
					
				}
				});
}

function doedit(id){
	var flag = false;
	var dlg = art.dialog
	.open(getPath() +"/interflow/contact/edit?id="+id,
			{
				id : "edit",
				title : '修改联系人',
				background : '#333',
				width : 400,
				height : 400,
				lock : true,
				button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
						dlg.iframe.contentWindow.saveAdd(this);
					}
						flag = true;
						return false;
					}},{name:'取消',callback:function(){
						flag = false;
						return true;
					}}],
				close:function(){
					if(flag){
					updatecontact(id);
					}
				}
			});			
}

function dodel(id){
	$.post(getPath()+"/interflow/contact/delete",{id:id},function(res){
		if(res.STATE == "SUCCESS"){
			if(res.MSG){
				
				art.dialog.tips(res.MSG);
			}else{
				art.dialog.tips('操作成功');
			}
			var obj = $("div.minibox-list[cid='"+id+"']");
			$(obj).remove();
		}else{
			art.dialog.tips(res.MSG);
		}
	},'json');
}

function searchcontact(){
	initData();
}

function initData(){
	$("#alletterdiv").html("");
	
	var selletter = ($(".searchbox-zm").find("a.selected").length>0)?$(".searchbox-zm").find("a.selected").html().toLowerCase():'';
	if(selletter=='全部') selletter = '';
	var keyword = $("#keyword").val();
	if(keyword=='姓名/手机')keyword='';
	$.post(getPath()+"/interflow/contact/listAllData",{personId:currentId,letter:selletter,keyword:keyword},function(data){
		if(data.length>0){
		$.each(data,function(i,item){
			if(item.simplePinyin){
				var c = item.simplePinyin.charAt(0);
				if($("div[letter='"+c+"']").length>0){
					
				}else{
					var head = "<div key='letterdiv' letter='"+c+"'><div class='dashedline'><span>"+c.toUpperCase()+"</span></div><div class='minibox'></div>";
					$("#alletterdiv").append($(head));
				}
				
				//var html = $("#templetterdiv").html();
				
				$("#templetterdiv").find("input[name='cid']").val(item.id);
				$("#templetterdiv").find("span[name='name']").html(item.name);
				$("#templetterdiv").find("span[name='mobile']").html(item.mobile);
				$("#templetterdiv").find("span[name='tel']").html(item.tel);
				$("#templetterdiv").find("span[name='shortnum']").html(item.shortnum);
				$("#templetterdiv").find("span[name='qq']").html(item.qq);
				$("#templetterdiv").find("span[name='email']").html(item.email);
				$("#templetterdiv").find("span[name='remark']").html(item.remark);
				$("#templetterdiv").find("a[cid]").attr("cid",item.id);
				$("#templetterdiv").find(".minibox-list").attr("cid",item.id);
				$("div[letter='"+c+"']").find('div.minibox').append($($("#templetterdiv").html()));
				
			}
		});
		}else{
			$("#alletterdiv").html('<p style="font-size:16px; display:inline-block; width:100%; border-top:1px dashed #ccc; padding-top:10px; margin-top:50px; font-family:tahoma,arial,Microsoft YaHei; text-align:center;">无数据</p>');
			
		}
	},'json');
}

function editcontact(obj){
	var cid = $(obj).attr('cid');
	doedit(cid);
}

function delcontact(obj){
	var cid = $(obj).attr('cid');
	dodel(cid);
}

function updatecontact(cid){
	$.post(getPath()+"/interflow/contact/getById",{id:cid},function(item){
		var obj = $("div.minibox-list[cid='"+cid+"']");
		$(obj).find("input[name='cid']").val(item[0].id);
		$(obj).find("span[name='name']").html(item[0].name);
		$(obj).find("span[name='mobile']").html(item[0].mobile);
		$(obj).find("span[name='tel']").html(item[0].tel);
		$(obj).find("span[name='shortnum']").html(item[0].shortnum);
		$(obj).find("span[name='qq']").html(item[0].qq);
		$(obj).find("span[name='email']").html(item[0].email);
		$(obj).find("span[name='remark']").html(item[0].remark);
	},'json');
}

$(document).ready(function(){
	
	
	$("#alletterdiv").height($(window).height()-150);
	
	$('.searchbox-zm').find('a').click(function(){
		if($(this).hasClass('selected')){
			$(this).removeClass('selected');
		}else{
			$('.searchbox-zm').find('a.selected').removeClass('selected');
			$(this).addClass('selected');
		}
		initData();
	});
	
	initData();
	
	$("#keyword").bind("focus",function(){
		if($(this).val()=="姓名/手机") $(this).val("");
	});
	
	$("#keyword").bind("blur",function(){
		var name = $("#keyword").val();
		if(name==""){
			$(this).val("姓名/手机");
		}
	});
	
	$(document).keydown(function(e){
		var charCode= ($.browser.msie)?e.keyCode:e.which;  
		if(charCode==13){  
		searchcontact();
		}
	}
	);
	
	

});