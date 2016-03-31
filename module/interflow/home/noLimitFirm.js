initNoticeData = function(page){
	var condition = $("#condition").val();
	var part = $("#partsel").val();
	//录入时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["createTime"]){
		queryStartDate = MenuManager.menus["createTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["createTime"].getValue().timeEndValue;
	}
	if(condition=='搜索标题、内容、作者') condition = '';
	$.post(getPath()+"/interflow/notice/getAllNotice",{page:page,name:condition,part:part,startDate:queryStartDate,endDate:queryEndDate},function(map){
		var pag = map.pag;
		$("#loading2").hide();
		$("#noticeMessage").html("");
		var flag = map.setTopFlag;
		if(pag!=null){
			data = pag.items;
			
			for(var i = 0;i< data.length;i++){
				
				// href="'+getPath()+'/interflow/notice/selectById?id='+data[i].id+'" target="_blank"
			$('<li>'+
                    '<div class="h_gg">'+
			             '<div class="hot_l style01"><h1><a href="javascript:void(0)" onclick=viewNotice("'+data[i].id+'")>'+data[i].title+((data[i].hasPhoto==1)?"&nbsp;<img src=\'"+getPath()+"/default/style/images/pic.gif\'/>":"")+'&nbsp;&nbsp;'+(data[i].isTop==1?'<img src="'+getPath()+'/default/style/images/top.gif"/>':'')+'</a></h1></div>'+
			             '<div class="hot_r">'+
			                   '<dl>'+
			                   '<dt><a onclick=modify("'+data[i].id+'") href="javascript:void(0)">修改</a></dt>'+
				                  '<dt><a onclick=deletenotice("'+data[i].id+'") href="javascript:void(0)">删除</a></dt>'
				                  +(flag?'<dt><a href="javascript:void(0)" onclick="setTop(\''+data[i].id+'\','+data[i].isTop+')">'+(data[i].isTop==0?'置顶':'取消置顶')+'</a></dt>':'')+
	                           '</dl>'+
	                      '</div>'+
			        '</div>'+
                    '<div class="h_gg">'+
                         '<div class="hot_l">'+
                          
                          '<span>栏目：'+data[i].partName+'</span>'+
                          '<span><em>'+data[i].createDate+'</em></span>'+
                          '<span>作者：'+data[i].author.name+'</span>'+
                          '<span>可见组织：'+(data[i].faceOrg==null?'':data[i].faceOrg.name)+'</span>'+
                          '</div>'+
                         '<div class="hot_r">'+
	                         '<dl>'+ 
		                         '<dt>点击<span id="clickspan'+i+'">('+data[i].clickCount+')</span></dt>'+ 
		                         '<dt>评论('+data[i].replyCount+')</dt>'+ 
	                         '</dl>'+
                         '</div>'+
                    '</div>'+
                    
                    
                 '<div class="success_list" style="display: none" id="noticeReply'+i+'">'+
                 '<div class="aline02"><img src="'+getPath()+'/default/style/images/Announcement04.png"/></div>'+
                 '<div class="srbox01"><textarea name="noticeContent'+i+'" id="noticeContent'+i+'" cols="" rows=""></textarea></div>'+
                  '<div class="aline01">'+
                      '<div class="aline01_left"><img src="'+getPath()+'/default/style/images/Announcement02.png"/>'+ 
                      '<a href="javascript:void(0)" onclick="show(\'noticeContent'+i+'\')">表情</a> <img src="'+getPath()+'/default/style/images/Announcement01.png"/>'+ 
                      '<a href="javascript:void(0)" onclick="offenLang(this,\'noticeContent\','+i+',0)">常用语</a></div>'+
                      '<div class="aline01_right"><input class="pinglun_btn01" type="button" onclick="addNoticeFromList('+i+',\''+data[i].id+'\')" value="发表评论"></div>'+
             		 '</div>'+
                      '<div class="amessages01" id="noticeReplyContent'+i+'">'+
                       '</div>'+
         		'</div>'+
         		
              '</li>').appendTo("#noticeMessage");
			}
			
			var totalPage = pag.recordCount%pag.pageSize==0?(pag.recordCount/pag.pageSize):Math.floor(pag.recordCount/pag.pageSize)+1;
			var pagediv = "<div style='margin:5px 0x;'><font>当前第"+pag.currentPage+"页,共"+totalPage
			+"页</font><a href='javascript:void(0)' id='prev' onclick=pagGetData("+pag.currentPage+",'prev',"+totalPage+")>上一页</a>"		
			+"<a href='javascript:void(0)' id='next' onclick=pagGetData("+pag.currentPage+",'next',"+totalPage+")>下一页</a></div>";
			$("#Pagination2").html(pagediv);
		}
	},'json');
}

function setTop(id,istop){
	if(istop==0)istop=1;
	else istop=0;
	
	art.dialog.confirm(istop==0?"是否取消置顶？":"是否置顶？",function(){
		$.post(getPath()+"/interflow/notice/setTop",{id:id,istop:istop},function(res){
			if(res.STATE=="SUCCESS"){
				initNoticeData();	
			}
			
		},'json');
	});

	
}
function pagGetData(page,id,count){
	if(id=="prev"){
		if(page==1){
			art.dialog.tips('已经是第一页');
			return
		}else{
			initNoticeData(page-1);
		}
	}else{
		if(page==count){
			art.dialog.tips('已经是最后一页');
			return
		}else{
			initNoticeData(page+1);
		}
	}
}
init= function(){
//	CKEDITOR.replace('content', config);
//	addUploadButton(CKEDITOR.instances.editor1);
	
	//var marketContent = $("#marketContent").val();
//	CKEDITOR.instances.noticecontent.setData($("#noticecontent").val());

	
	addPhotoButton("uploadImage","noticephotonames","image");
	addPhotoButton("uploadAttach","noticeattachnames","file");
	
	getBaseData("gglm");
}


addUploadButton= function(editor){
	
//    CKEDITOR.on('dialogDefinition', function(ev){
//        var dialogName = ev.data.name;
//        var dialogDefinition = ev.data.definition;
//        if (dialogName == 'image') {
//            var infoTab = dialogDefinition.getContents('info');
//            var browseButton = infoTab.get('browse');
//            browseButton.hidden = false;
//            dialogDefinition.onLoad = function(){                
//                new AjaxUpload($(".cke_dialog_body .cke_dialog_page_contents:first .cke_dialog_ui_button:first"), {
//                	action: getPath()+'/framework/images/upload?direct=news',
//                    autoSubmit: true,
//                    name: "image",
//                    responseType: "json",
//                    onSubmit: function(file, extension){
//                        if (extension && /^(jpg|png|jpeg|gif)$/.test(extension)) {
//                        }
//                        else {
//                            alert("只允许上传jpg|png|jpeg|gif图片");
//                            return false;
//                        }
//                    },
//                    onComplete: function(file, json){   
//                    	if(json.STATE=='FAIL'){
//                    		alert('新闻图片要求宽大于320，或者高大于240');
//                    		return;
//                    	}
//                        // 在输入框显示url，并触发url文本框的onchange事件，以便预览图片
//                        var urlInputText = $(".cke_dialog_body .cke_dialog_page_contents:first input.cke_dialog_ui_input_text:first");
//                    	var url=json.PATH;
//						//url=url.replace("{size}","original");
//                        var url = getPath()+'/images/'+url;
//                        urlInputText.val(url);
//                        if (document.all) {//IE
//                            urlInputText[0].fireEvent("onchange");
//                        }
//                        else { //FireFox
//                            var evt = document.createEvent('HTMLEvents');
//                            evt.initEvent('change', true, true);
//                            urlInputText[0].dispatchEvent(evt);
//                        }
//                    }
//                });
//            }
//        }
//    });
}
var config={
	 toolbar: [['Bold', 'Italic', 'Underline', 'Strike', '-', 'Subscript', 'Superscript'],
               ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent'], 
               ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'], 
               ['Link', 'Unlink'], 
               ['Image', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar'],
               '/', ['Styles', 'Format', 'Font', 'FontSize'],
               ['TextColor', 'BGColor'], 
               ['Maximize', 'ShowBlocks', '-', '-', 'Undo', 'Redo']],
     width: "660", //文本域宽度
     height: "200"//文本域高度     
}
function addNotice(){
	art.dialog.data("result",null);
	var dlg = art.dialog.open(getPath()+"/interflow/notice/addNotice",{
			title:'发布公告',
			 lock:true,
			 width:'750px',
			 height:'425px',
			 id:"addBill",
			 close:function(){
				 return true;
				
			 },
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.valiNoticeForm){
						dlg.iframe.contentWindow.valiNoticeForm(dlg);
					}
					
					return false;
				}},{name:'取消',callback:function(){
					
					return true;
				}}]
		});
}

initNoticeCommentData = function(){
	var noticeId = $("#noticeId").val();
	backCommentData(noticeId,"commentMessage","reContent");
}

/**
 * 公告ID
 * 评论列表ID
 * 评论内容控件ID
 */
backCommentData = function(noticeId,depcom,contcomp,index){
	$.post(getPath()+"/interflow/noticeComment/getComment",{noticeId:noticeId},function(res){
		var data = res.comment;
		//var clickCount = res.clickCount;
		//增加点击数
		//if(index)
		//	$("#clickspan"+index).html("("+clickCount+")");
		if(data!=null){
			$("#"+depcom).html("");
			
			if(data.length==0){
				$(".aline01").hide();
				$("#noticeMessage").hide();
			}else{
			
			for(var i=0;i<data.length;i++){
				var photo = (data[i].reCreator.photo)?("/images/"+data[i].reCreator.photo):"/default/style/images/home/man_head.gif";
			$('<dl>'+
	                '<dt person-pop='+data[i].reCreator.number+' pop-name='+data[i].reCreator.name+' >'+
	                '<img src="'+getPath()+photo+'"/></dt>'+
	                '<dd>'+
	                '  <p><span class="btleft">'+data[i].belongOrg.name+'：'+data[i].reCreator.name+'&nbsp;&nbsp;&nbsp;'+
	                  ''+data[i].dateStr+''+
	                 ' </span>  '+
	                  '<span class="btright"><a href="javascript:void(0)" onclick="toReplayNotice(\''+data[i].reCreator.name+'\',\''+contcomp+'\',\''+data[i].reCreator.id+'\',\''+data[i].belongOrg.id+'\')">回复</a>&nbsp;&nbsp;'+
	                  ((currentId==data[i].reCreator.id?'<a style="color:#8c6c1d;cursor: pointer;" href="javascript:void(0)" onclick="delNoticeComment(\''+data[i].id+'\',\''+noticeId+'\',\''+depcom+'\')">删除</a></span></p>':"</span></p>"))+
	                 '<p class="afont">'+convertImg(data[i].reContent)+'</p>'+
	                '</dd>'+
	             '</dl>').appendTo("#"+depcom);
			}
			personPop.init();
			
			$(".aline01").show();
			$("#noticeMessage").show();
			
			}
		}
	});
}

toReplayNotice = function(name,comp,creatorById,orgById,noticeId){
	$("#creatorById").val(creatorById);
	$("#orgById").val(orgById);
	$("#"+comp).val("回复"+name+":");
}
addNoticeComment = function(){
	var noticeId = $("#noticeId").val();
	addNoticeCommentData(noticeId,"reContent","commentMessage");
	
}

addNoticeFromList = function(index,noticeId){
	addNoticeCommentData(noticeId,"noticeContent"+index,"noticeReplyContent"+index);
}
/**
 * noticeId 公告ID
 * depcom  评论区内容控件ID
 * comlistcomp  评论列表所在控件
 */
addNoticeCommentData = function(noticeId,depcom,comlistcomp){
	var content  = $("#"+depcom).val();
	
	if(content==""){
		art.dialog.tips('评论内容不能为空！');
		return
	}else{
		
	$.post(getPath()+"/interflow/noticeComment/insertComment",{reContent:content,noticeId:noticeId,creatorBy:$("#creatorById").val(),orgBy:$("#orgById").val()},function(data){
		if(data==1){
			art.dialog.tips("评论成功!",null,"succeed");
			$("#"+depcom).val("");
			backCommentData(noticeId,comlistcomp,depcom);
		}else{
			art.dialog.alert('评论失败！');
		}
	});
	}
}

/**
 * 删除公告评论
 */
delNoticeComment = function(id,noticeId,depcom,contcomp){
	$.post(getPath()+"/interflow/noticeComment/delComment",{id:id},function(data){
		if(data==1){
			art.dialog.tips('删除成功！',null,"succeed");
			backCommentData(noticeId,depcom,contcomp);
		}else{
			art.dialog.alert('删除失败！');
		}
	});
}

viewNotice = function(id){
	art.dialog.open(getPath()+'/interflow/notice/selectById?id='+id,
			{title:"查看公告",
			lock:true,
			width:810,
			height:600,
			id:'NOTICE-VIEW',
			button:[{name:'关闭'}]}
	);
}
viewParentNotice = function(id){
	parent.art.dialog.open(getPath()+'/interflow/notice/selectById?id='+id,
			{title:"查看公告",
			lock:true,
			width:800,
			height:500,
			id:'NOTICE-VIEW',
			button:[{name:'关闭'}],
			close:function(){
				parent.getOtherMsgCount();
			}}
	);
}
/**
 * 页面评论函数
 */
toNoticeReply = function(billId,index){
	if($("#noticeReply"+index).css("display")=="none"){
	$("#noticeReply"+index).show();
	
	backCommentData(billId,"noticeReplyContent"+index,"noticeContent"+index,index);
	}else{
		$("#noticeReply"+index).hide();
	}
}

/**
 * id 点击触发上传时间的按钮ID
 * parentdiv 图片名字上传后显示所在的div
 */
addPhotoButton=function(id,parentdiv,type){
	
	var url = "";
	if(type=='image'){url = '/basedata/photo/upload?direct=news';}
	else if(type=='file'){url = '/basedata/attach/upload?direct=news';}
	new AjaxUpload($("#"+id), {
    	action: getPath()+url,
        autoSubmit: true,
        name: "image",
        responseType: "json",
        onSubmit: function(file, extension){
        	showload();    	
        	//图片上传时做类型判断
        	if(type=='image'){
        	if (extension && /^(jpg|png|jpeg|gif)$/.test(extension)) {
            }
            else {
                alert("只允许上传jpg|png|jpeg|gif图片");
                return false;
            }
        	}
        },
        onComplete: function(file, json){  
        	hideload();
        	//$("#loading").hide();
        	if(json.STATE=='FAIL'){
        		alert(json.MSG);
        		return;
        	}else{
            // 在输入框显示url，并触发url文本框的onchange事件，以便预览图片
           var url=json.path;
           var id = json.id;
           var name = json.fileName;
           var pdiv = $("<div style='float:left;margin-left:10px;' id='"+json.id+"div' imgid='"+json.id+"'><span>"+name+"</span><a href='javascript:void(0)' onclick=delphoto('"+json.id+"','"+type+"')>删除</a></div>");
           $("#"+parentdiv).append(pdiv);
          
          
           art.dialog({
        	   content:json.MSG,
        	   time:1,
        	   close:function(){
        	   return true;
        	   },
        	   width:200
        	   });

           
        }
        }
    });
}

function delphoto(id,type){
	$("#"+id+"div").remove();
	var url = "";
	if(type=="image") url = "/basedata/photo/delete";
	else if(type=="file") url = "/basedata/attach/delete";
	$.post(getPath()+url,{id:id},function(json){
		json = eval("("+json+")");
		if(json.STATE=='FAIL'){
    		alert(json.MSG);
    		return;
    	}else{
    		  art.dialog({
           	   content:json.MSG,
           	   time:1,
           	   close:function(){
           	   return true;
           	   },
           	   width:200
           	   });
    	}
	});
	
}

function modify(id){
	art.dialog.data("result",null);
	var dlg = art.dialog.open(getPath()+"/interflow/notice/editNotice?id="+id,{
			title:'修改公告',
			 lock:true,
			 width:'800px',
			 height:'500px',
			 id:"editBill",
			 close:function(){
				 return true;
			 },
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.valiNoticeForm){
						dlg.iframe.contentWindow.valiNoticeForm(dlg);
					}
					
					return false;
				}},{name:'取消',callback:function(){
					
					return true;
				}}]
		});
}


function clearCon(obj){
	var v = $(obj).val();
	if(v=='搜索标题、内容、作者') $(obj).val('');
}

function lostCon(obj){
	var v = $(obj).val();
	if(v.trim()=='') $(obj).val('搜索标题、内容、作者');
}

function deletenotice(id){
	artDialog.confirm("确定删除该条公告吗?",function(){
		$.post(getPath()+"/interflow/notice/deteleById",{id:id},function(data){
			data = eval('('+data+')');
			art.dialog({
				content:data.MSG,
				time:2,
				close:function(){
					initNoticeData();
				},
				width:200
			});
		});
	},function(){})
}

