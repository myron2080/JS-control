var tab;
$(document).ready(function(){
	$('#main').ligerLayout({leftWidth:176,topHeight:59,space:0,allowLeftResize:false,allowTopResize:false,allowRightCollapse:false});
	tab = $('#menuTab').ligerTab({changeHeightOnResize:true});
	tab.setContentHeight();
	$(window).resize(function (){
		tab.setContentHeight();
	});
	$("a[pid]").each(function(){
		var p = $(this);
		p.attr('href','javascript:void(0);');
		$(p).bind('click',function(){
			$("ul[children]").each(function(){
				var c = $(this);
				if(c.attr("children") == p.attr('pid')){
					if(c.is(":visible")){
						c.hide();
					}else{
						c.fadeIn("slow");
					}
				}else{
					c.hide();
				}
			});
		});
	});
	$("a[name]").each(function(){
		var a = $(this);
		var url = a.attr('href');
		a.attr('href','javascript:void(0);');
		a.bind('click',function(){
			addTabItem(a.attr('name'),url,a.attr('title'));
		});
	});
});

function addTabItem(tabid,url,name){
	tab.addTabItem({
		tabid:tabid,
		url:url,
		text:name
	});
	tab.setContentHeight();
}

function ajaxLogin(){
	$.post($('#ajaxLoginForm').attr('action'),$('#ajaxLoginForm').serialize(),function(res){
		if(res.STATE == "SUCCESS"){
			$('#ajaxLogin').hide();
		}else{
			$('#ajaxMsg').html(res.MSG);
		}
    },'json');
	return false;
}
function showAjaxLogin(){
	$('#ajaxLogin').show();
}