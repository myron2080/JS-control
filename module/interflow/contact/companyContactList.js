$tree_container = "leftTree";
$tree_async_url = getPath()+"/basedata/org/simpleTreeData";
$(document).ready(function(){
	var w = $(window).width();
	if(w>1024){
		$("#templetterdiv").find("div[key='childiv']").attr('class','minibox-list');
	}
	
	initSimpleDataTree();
	
	$("#keyword").bind("focus",function(){
		if($(this).val()=="姓名/电话/短号/职位/部门") $(this).val("");
	});
	
	$("#keyword").bind("blur",function(){
		var name = $("#keyword").val();
		if(name==""){
			$(this).val("姓名/电话/短号/职位/部门");
		}
	});
	
	$(document).keydown(function(e){
		var charCode= ($.browser.msie)?e.keyCode:e.which;  
		if(charCode==13){  
			$("#searchBtn").click();
	    }}); 
	
	var h = $(window).height()-130;
	$(".cd-leftin").height(h);
	$(".cd-rightbox").height(h-30);
	
	
});

function onTreeNodeClick(event, treeId, treeNode){
	//$('#keyword').val($('#searchKeyWord').attr('defaultValue'));
	searchData(1);
}

function pagesearch(cur){
	initData(cur);
}

function searchData(cur){
	initData(cur);
}

function initData(cur){
	$("#cd-rightboxin").html("");
	var para = {};
	var keyword = $("#keyword").val();
	if(keyword == "姓名/电话/短号/职位/部门")keyword='';
	para.addresskey = keyword;
	para.currentPage = cur;
	var tree = $.fn.zTree.getZTreeObj("leftTree");
	var selectNodes = tree.getSelectedNodes();
	if(selectNodes.length>0){
		para.orgLongNumber = selectNodes[0].longNumber;		
	}
	para.pageSize = 9;
	para.online=$("#onStatus").val();
	$("#loading").show();
	
	var phoneSafe=$('#phoneSafe').val();
	
	$.post(getPath()+"/interflow/addressBook/listDataByonline",para,function(data){
		var datalist = data.items;
		$.each(datalist,function(i,item){
				$("#templetterdiv").find("input[name='cid']").val(item.id);
				$("#templetterdiv").find("span[name='name']").html(item.name);
				$("#templetterdiv").find("span[name='sex']").html(item.sex?item.sex.name:'');
				if(item.online=="1"){//1 :在线  0 :离线
					$("#templetterdiv").find("span[name='offline']").hide();
					$("#templetterdiv").find("span[name='online']").show();
				}else if(item.online=="0"){
					$("#templetterdiv").find("span[name='offline']").show();
					$("#templetterdiv").find("span[name='online']").hide();
				}
				$("#templetterdiv").find(".company-address01").find('img').attr('src',getPath()+'/images/'+item.photo);
				$("#templetterdiv").find("#div_person_pop").attr("pop-name",item.name);
				$("#templetterdiv").find("#div_person_pop").attr("person-pop",item.number);
				$("#templetterdiv").find("span[name='orgname']").html(item.personPosition.position.belongOrg.name+"-"+item.personPosition.position.name);
				$("#templetterdiv").find("span[name='mobile']").html(item.phone);
				if(phoneSafe!='YES'){
					$("#templetterdiv").find("span[name='mobile']").show();
					$("#templetterdiv").find("span[name='viewMobile']").hide();
				}else{
					$("#templetterdiv").find("span[name='mobile']").hide();
					$("#templetterdiv").find("span[name='viewMobile']").show();
					$("#templetterdiv").find("span[name='mobile'] a").attr("phone",item.phone) ;
				}
				
				$("#templetterdiv").find("span[name='viewMobile']").attr("showType",item.showType);
				
				if(item.showType==null || item.showType=='SHORTNUMBER' || item.showType=='NO_SHOW'){
					$("#templetterdiv").find("span[name='mobile']").hide();
					$("#templetterdiv").find("span[name='viewMobile']").hide();
					$("#templetterdiv").find("span[name='viewMobile']").hide();
					$("#templetterdiv").find(".dh-ico").hide();
					$("#templetterdiv").find(".dx-ico").hide();
					
				}else{
					$("#templetterdiv").find(".dh-ico").show();
					$("#templetterdiv").find(".dx-ico").show();
				}
				$("#templetterdiv").find("span[name='tel']").html(item.workPhone);
				
				 if(item.showType==null || item.showType=='NO_SHOW'){
					 $("#templetterdiv").find("span[name='shortnum']").html("");
				 }else{
					$("#templetterdiv").find("span[name='shortnum']").html(item.shortNumber);
				 } 
				
				$("#templetterdiv").find("span[name='qq']").html(item.qq);
				$("#templetterdiv").find("span[name='email']").html(item.email);
				$("#templetterdiv").find("span[name='remark']").html(item.description);
				$("#templetterdiv").find("a[cid]").attr("cid",item.id);
				$("#templetterdiv").find("div[key='childiv']").attr("cid",item.id);
				$("#cd-rightboxin").append($($("#templetterdiv").html()));
		});
		var curpage = data.currentPage;
		var totalrecord = data.recordCount;
		var pagesize  = data.pageSize;
		
		var totalpage = (totalrecord%pagesize==0)?(Math.floor(totalrecord/pagesize)):(Math.floor(totalrecord/pagesize)+1);
		$("#pagelist").html('');
		$("#pagelist").html(initpagelist(curpage,totalpage));
		
		$("#loading").hide();
		
		//人员头像悬浮
		personPop.init() ;
		
	},'json');
}

function viewPhone(obj){
	var pt = $(obj).text();
	if(pt=="点击查看"){
		$("#cd-rightboxin div[key='childiv'] span[name='mobile']").hide();
		$("#cd-rightboxin div[key='childiv'] span[name='viewMobile'][showType='ALL']").show();
		$("#cd-rightboxin div[key='childiv'] span[name='viewMobile'][showType='PHONE']").show();
		$(obj).parent().prev().show();//text($(obj).attr("phone")); 
		$(obj).parent().hide();
	}else{
		$(obj).parent().prev().hide();
		$(obj).parent().show();
		$(obj).text("点击查看");
	}	
}








