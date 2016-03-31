$tree_container = "leftTree";
$tree_async_url = getPath()+"/basedata/helpInfo/simpleTreeData";
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:170,allowLeftCollapse:true,allowLeftResize:true});
	$("#leftToolBar").ligerToolBar({
		items:[{id:'locate',text:'定位',click:function(){
			var name = $('#locate').val();
			treeLocate('leftTree','name',name);
			},icon:'locate'}
		]
	});
	initSimpleDataTree();
});


function onTreeNodeClick(event, treeId, treeNode){
	$('#searchKeyWord').val($('#searchKeyWord').attr('defaultValue'));
//	if(treeNode.children!=undefined){
//		art.dialog.alert("请选择具体的菜单查询帮助！");
//	}else{
		searchData();
//	}
}

function searchData(){
	$("#tableContainer").html("");
	var tree = $.fn.zTree.getZTreeObj("leftTree");
	var selectNodes = tree.getSelectedNodes();
	var menuId = "";
	if(selectNodes.length>0){
		menuId = selectNodes[0].id;
	}
	$.post(base+"/basedata/helpInfo/listData",{menuId:menuId},function(res){
		var items = res.items;
		if(items.length!=0 && items.length !=""){
			var html = "<div class='pagebody'>";
			for(var i=0;i<items.length;i++){
				var content = items[i].content;
				content = items[i].content.replace(/<img/g,"<img style='max-width:100%;' ");
				html += '<div class="page">'
				html += ' <div class="pagetitle djico">'
				html += '   <dl>'
					if(items[i].url!=''){
						html += '     <dd><a class="dico1 Videoan" target="_blank" href="'+items[i].url+'">查看帮助视频</a>'
					}else{
						html += '     <dd>'
					}
				html += '     <h3>'+items[i].name+'</h3>'
				html += '    </dd>'
				html += '    <dt>功能：</dt>'
				html += '    </dl>'
				html += '  </div>'
				html += '  <div class="pageinfo">'
				html += content
				html += '</div></div>';
			}
			$("#tableContainer").html(html+"</div>");
		}else{
			$("#tableContainer").html("<div style='margin:30px;'><img src='"+base+"/default/style/images/roomlisting/approveblank.png'/></div>");
		}
	},"json");
	
}
