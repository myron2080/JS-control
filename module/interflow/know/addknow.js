init= function(){
	//CKEDITOR.replace('content', config);
	addUploadButton(CKEDITOR.instances.editor1);
	
	//var marketContent = $("#marketContent").val();
	//CKEDITOR.instances.noticecontent.setData($("#noticecontent").val());

	
	addPhotoButton("uploadImage","noticephotonames","image");
	addPhotoButton("uploadAttach","noticeattachnames","file");
	
	getBaseData("zslm");
}


addUploadButton= function(editor){
	
    CKEDITOR.on('dialogDefinition', function(ev){
        var dialogName = ev.data.name;
        var dialogDefinition = ev.data.definition;
        if (dialogName == 'image') {
            var infoTab = dialogDefinition.getContents('info');
            var browseButton = infoTab.get('browse');
            browseButton.hidden = false;
            dialogDefinition.onLoad = function(){                
                new AjaxUpload($(".cke_dialog_body .cke_dialog_page_contents:first .cke_dialog_ui_button:first"), {
                	action: getPath()+'/framework/images/upload?direct=know',
                    autoSubmit: true,
                    name: "image",
                    responseType: "json",
                    onSubmit: function(file, extension){
                        if (extension && /^(jpg|png|jpeg|gif)$/.test(extension)) {
                        }
                        else {
                            alert("只允许上传jpg|png|jpeg|gif图片");
                            return false;
                        }
                    },
                    onComplete: function(file, json){   
                    	if(json.STATE=='FAIL'){
                    		alert('新闻图片要求宽大于320，或者高大于240');
                    		return;
                    	}
                        // 在输入框显示url，并触发url文本框的onchange事件，以便预览图片
                        var urlInputText = $(".cke_dialog_body .cke_dialog_page_contents:first input.cke_dialog_ui_input_text:first");
                    	var url=json.PATH;
						//url=url.replace("{size}","original");
                        var url = getPath()+'/images/'+url;
                        urlInputText.val(url);
                        if (document.all) {//IE
                            urlInputText[0].fireEvent("onchange");
                        }
                        else { //FireFox
                            var evt = document.createEvent('HTMLEvents');
                            evt.initEvent('change', true, true);
                            urlInputText[0].dispatchEvent(evt);
                        }
                    }
                });
            }
        }
    });
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

initNoticeCommentData = function(){
	var noticeId = $("#knowId").val();
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
	var noticeId = $("#knowId").val();
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
		
	$.post(getPath()+"/interflow/noticeComment/insertKnowComment",{reContent:content,noticeId:noticeId,creatorBy:$("#creatorById").val(),orgBy:$("#orgById").val()},function(data){
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
	if(type=='image'){url = '/basedata/photo/upload?direct=know';}
	else if(type=='file'){url = '/basedata/attach/upload?direct=know';}
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
	var dlg = art.dialog.open(getPath()+"/interflow/know/edit?id="+id,{
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

function savescore(){
	$.post(getPath()+"/interflow/knowEdit/save",{
		'objId':$("#knowId").val(),
		'score':$(".knowledge-fj-r a.star01").length 
		
	},function(res){
		if(res.STATE == "SUCCESS"){
			if(res.MSG){
				
				art.dialog.tips(res.MSG);
			}else{
				art.dialog.close();
			}
		}else{
			art.dialog.tips(res.MSG);
		}
	},'json');
}
