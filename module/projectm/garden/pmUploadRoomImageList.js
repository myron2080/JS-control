function deletePhoto(id){
	art.dialog.confirm('确定删除?',function(){
		$.post(getPath() + '/projectm/pmRoom/deleteGardenImage?imageType=ROOMFIGURE',{id:id},function(res){
			if(res.STATE=="SUCCESS"){
				$('#'+id).remove();
				art.dialog.tips("删除成功!",null,"succeed");
				
			}else if(res.STATE=="ERROR"){
				art.dialog.tips("户型图已经被设置,不能删除!");
			}else{
				//art.dialog.tips("删除失败!");
				art.dialog({
					icon: 'succeed',
				    time: 2,
				    content: "删除失败"
				});
			}
		},'json');
	});
}
//显示原图
function viewLargePhoto(path){
	window.open(path,'_blank','top=0,left=0,scrollbars=yes,resizable=true,toolbar=no,location=no');//,height='+screen.height+',width='+screen.width);
}