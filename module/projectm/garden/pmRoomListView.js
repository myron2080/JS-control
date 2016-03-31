/**
 * 房间列表
 */
$(document).ready(function(){
	//楼层设置
	$("#roomList").delegate("td","click","",function(event){
		  if (event.ctrlKey) { //  ctrl
		      	//设置元素的class
			  
			      	if("undefined" != typeof $(this).attr('title')){
			      		//如果样式已经设置，则取消
			      		if($(this).hasClass("selected")){
			      			$(this).removeClass("selected");
			      		}else{
			      			$(this).addClass("selected");
			      		}
			      	}else{
			      		if($(this).hasClass("seleTD")){
			      			$(this).siblings("td").removeClass("selected");
			      			$(this).removeClass("seleTD");
			      		}else{
			      			$(this).siblings("td").addClass("selected");
			      			$(this).addClass("seleTD");
			      		}
			      		
			      	}
		      } else {
		      	//移除元素class
		      	$('#roomList td').removeClass("selected");
			      	if("undefined" != typeof $(this).attr('title')){
			      		$(this).addClass("selected");
			      	}else{
			      		$(this).parent().find('td').addClass("selected");
			      		$(this).removeClass("selected");
			      	}
			  }
	 });
	
	$('#roomList th:eq(0)').click(function(event) {
		if($(this).hasClass("allselected")){
			$('#roomList td').removeClass("selected");
			$(this).removeClass("allselected");
		}else{
			$("#roomList td").each(function(){
				if("undefined" != typeof $(this).attr('title')){
					$(this).addClass("selected");
				}
			});
			$(this).addClass("allselected");
		}
	});
	$('#roomList th:gt(0)').click(function(event) {
		if (!event.ctrlKey) {
			$('#roomList td').removeClass("selected");
		}
		var seq = $(this).text();
		if($(this).hasClass("selectTH")){
			$("#roomList td").each(function(){
				if(seq==$(this).attr('seq')){
					$(this).removeClass("selected");
				}
			} 
			);
			$(this).removeClass("selectTH");
		}else{
				$("#roomList td").each(function(){
					if(seq==$(this).attr('seq')){
						$(this).addClass("selected");
					}
				} 
				);
				$(this).addClass("selectTH");
		}
		
	});
	
});

/**
 ***************************
 ** 查看房间
 ***************************
 */

function viewRoomInfo(id,roomType,roomListingId){
	if(isNotNull(id)){
		if(!isNotNull(roomType)){
			var dlg = parent.parent.art.dialog.open(base+"/projectm/pmRoom/viewRoomInfo?id="+id+"&cityId="+cityId,{
				id:"viewRoomInfo",
				title:'查看房间',
				lock:true,
				width : 700,
	//		height : 350,
				/*ok: function () {
		    	this.title('3秒后自动关闭').time(3);
		        return false;
				parent.parent.art.dialog.list['viewRoomInfo'].size(10,10);
				 return false;
			},*/
				lock : true
			});
		}else{
			var dlg = parent.parent.art.dialog.open(getPath() +"/broker/roomDetail/view?roomListingId="+roomListingId+"&cityId="+cityId,
					{
						id : "roomDetailPage",
						title : '楼盘详情',
						background : '#333',
						width : 830,
						height : 550,
						lock : true	 
						});
			art.dialog.data('curdlg',dlg);
		}
	}
	//art.dialog.list['viewRoomInfo'].size(1000,10);
}


function roomView(fid){
	$.post(getPath()+"/projectm/pmRoom/getRoomInfoById",{fid:fid,cityId:cityId},function(data){
		if(data.result){
			var room = data.result;
			$("#addForm #roomId").val(room.id);
			$("#addForm #legalNumber").val(room.legalNumber);
			$("#addForm #roomNumber").val(room.roomNumber);
			$("#addForm #seq").val(room.seq);
			$("#addForm #propertyType").val(room.propertyTypeDesc);	
			$("#addForm #roomStructural").val(room.roomStructuralName);
			$("#addForm #buildArea").val(room.buildArea);
			$("#addForm #roomArea").val(room.roomArea);
			$("#addForm #direction").val(room.directionName);
			$("#addForm #floorId_sel").val(room.floor.id);		
			$("#addForm #floorId").val($("#addForm #floorId_sel option:selected").html());
			$("#addForm #bedRoom").val(room.bedRoom);
			$("#addForm #livingRoom").val(room.livingRoom);
			$("#addForm #bathRoom").val(room.bathRoom);
			$("#addForm #balcony").val(room.balcony);
			$("#addForm #kitchen").val(room.kitchen);
			if(room.propertyType=="SHOP"){
				$("#roomst").css("display","none");
				$("#prof").css("display","none");
				$("#proshop").css("display","");
				$("#addForm #shopType").html(room.roomPatternName);
			}else if(room.propertyType=="FACTORY"){
				$("#roomst").css("display","none");
				$("#prof").css("display","");
				$("#proshop").css("display","none");
				$("#addForm #factoryType").html(room.roomPatternName);
			}else{
				$("#roomst").css("display","");
				$("#prof").css("display","none");
				$("#proshop").css("display","none");
			}
			$("#addForm input").css("border","0px").attr("readonly","readonly");
			$("#addForm input").css("border","0px").attr("readonly","readonly");
			var imgUrl='';
			if(room.unitFigureUrl){
				imgUrl+=','+room.unitFigureUrl
			}
			$.each(data.roomImageList,function(){
				imgUrl+=','+this.url;
			});
			//处理图片
			if(room.unitFigureUrl){	//户型图
				$("#unitfigure_img").html("<img src='"+imgBase+"/"+room.unitFigureUrl.replace("size","100X75")
						+"' style='max-width:120px; max-height:75px;' enlarger='"+imgBase+"/"+room.unitFigureUrl.replace("size","origin")+"'/>");
			}else{
				$("#unitfigure_img").html("<img src='"+base+"/default/style/images/garden/no_picture_big.gif' style='max-width:120px; max-height:75px;'/>");
			} 
			
			var img_li="";	
			if(data.roomImageList && data.roomImageList.length>0){		//房间图片
				for(var i=0;i<data.roomImageList.length;i++){
					img_li=img_li+"<li enlarger='"+imgBase+"/"+data.roomImageList[i].url.replace("size","origin")+"'><img src='"+imgBase+"/"+data.roomImageList[i].url.replace("size","100X75")+"'/></li>";
					if(i==2)break;
				}
				$(".room_img ul").html(img_li);
				if(data.roomImageList.length>3){
					$("#next_imgPage a").html("<img src='"+base+"/default/style/images/garden/loupan06.gif'/>");
				}
				
				/** 处理图片翻页 **/
				var pageCount=4;
				var page=1;
				var totalPage=Math.ceil(parseInt(data.roomImageList.length)/pageCount);
				$("#last_imgPage").click(function(){	//上一页
					if(page==1){
						return;
					}else{
						page=page-1;		
						img_li="";
						for(var i=pageCount*(page-1);i<data.roomImageList.length;i++){
							img_li=img_li+"<li enlarger='"+imgBase+"/"+data.roomImageList[i].url.replace("size","origin")+"'><img src='"+imgBase+"/"+data.roomImageList[i].url.replace("size","100X75")+"'/></li>";
							if(i==pageCount*page-1)break;
						}
						$(".room_img ul").html(img_li);
						$("#next_imgPage img").attr("src",base+"/default/style/images/garden/loupan06.gif");
						if(page==1){
							$("#last_imgPage img").attr("src",base+"/default/style/images/garden/loupan03.gif");
						}else{
							$("#last_imgPage img").attr("src",base+"/default/style/images/garden/loupan05.gif");
						}
						EnlargerImg.init({
							type:'str',
							imgUrlStr:imgUrl?imgUrl.substring(1):imgUrl
						});	//放大图片
					}
				});
				$("#next_imgPage").click(function(){	//下一页
					if(page==totalPage){
						return;
					}else{
						page=page+1;		
						img_li="";
						for(var i=pageCount*(page-1);i<data.roomImageList.length;i++){
							img_li=img_li+"<li enlarger='"+imgBase+"/"+data.roomImageList[i].url.replace("size","origin")+"'><img src='"+imgBase+"/"+data.roomImageList[i].url.replace("size","100X75")+"'/></li>";
							if(i==pageCount*page-1)break;
						}
						$(".room_img ul").html(img_li);
						$("#last_imgPage img").attr("src",base+"/default/style/images/garden/loupan05.gif");
						if(page==totalPage){
							$("#next_imgPage img").attr("src",base+"/default/style/images/garden/loupan04.gif");
						}else{
							$("#next_imgPage img").attr("src",base+"/default/style/images/garden/loupan06.gif");
						}
						EnlargerImg.init({
							type:'str',
							imgUrlStr:imgUrl?imgUrl.substring(1):imgUrl
						});	//放大图片
					}
				});
			}else{
				img_li="<li><img src='"+base+"/default/style/images/garden/no_picture_small.gif'/></li>"
	                  +"<li><img src='"+base+"/default/style/images/garden/no_picture_small.gif'/></li>"
	                  +"<li><img src='"+base+"/default/style/images/garden/no_picture_small.gif'/></li>"
	                  +"<li><img src='"+base+"/default/style/images/garden/no_picture_small.gif'/></li>";
				$(".room_img ul").html(img_li);
				$("#last_imgPage img").attr("src",base+"/default/style/images/garden/loupan03.gif");
				$("#next_imgPage img").attr("src",base+"/default/style/images/garden/loupan04.gif");
				$("#last_imgPage").unbind("click");
				$("#next_imgPage").unbind("click");
			}
			
			EnlargerImg.init({
				type:'str',
				imgUrlStr:imgUrl?imgUrl.substring(1):imgUrl
			});	//放大图片
			
			art.dialog({
				title:"查看房间",
				content: $("#addRoomPannel").get(0),
				width:450,
				height:250,
				id: 'EF893L',
	   			cancelVal: '关闭',
	   		    cancel: true 
			});
		}else{
			art.dialog.alert("房间可能已经被删除！");
		}
	});
}




