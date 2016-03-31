initInstitutionData = function(page){
	var condition = $("#conditionInst").val();
	var part = $("#instType").val();
	//录入时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["createTimeInst"]){
		queryStartDate = MenuManager.menus["createTimeInst"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["createTimeInst"].getValue().timeEndValue;
	}
	if(condition=='搜索标题、内容、作者') condition = '';
	$.post(getPath()+"/interflow/institution/getAllInstitution",{page:page,name:condition,part:part,startDate:queryStartDate,endDate:queryEndDate},function(map){
		var pag = map.pag;
		$("#loadingInst").hide();
		$("#institutionMessage").html("");
		var flag = map.setTopFlag;
		if(pag!=null){
			data = pag.items;
			
			for(var i = 0;i< data.length;i++){
				
				// href="'+getPath()+'/interflow/institution/selectById?id='+data[i].id+'" target="_blank"
			$('<li>'+
                    '<div class="h_gg">'+
			             '<div class="hot_l style01"><h1><a href="javascript:void(0)" onclick=viewInstitution("'+data[i].id+'")>'+data[i].title+((data[i].hasPhoto==1)?"&nbsp;<img src=\'"+getPath()+"/default/style/images/pic.gif\'/>":"")+'&nbsp;&nbsp;'+(data[i].isTop==1?'<img src="'+getPath()+'/default/style/images/top.gif"/>':'')+'</a></h1></div>'+
			             '<div class="hot_r">'+
			                   '<dl>'+
			                   (((hasfbzd=='true'||hasfbzd==true)&&(data[i].author.id==currentId||usertype=='T01'))?('<dt><a onclick=modifyInst("'+data[i].id+'") href="javascript:void(0)">修改</a></dt>'+
				                  '<dt><a onclick=deleteinstitution("'+data[i].id+'") href="javascript:void(0)">&nbsp;删除</a></dt>'):'')
				                  +(flag?'<dt><a href="javascript:void(0)" onclick="setTopInst(\''+data[i].id+'\','+data[i].isTop+')">'+(data[i].isTop==0?'&nbsp;置顶':'&nbsp;取消置顶')+'</a></dt>':'')+
				                  ('<dt><a href="javascript:void(0)" onclick="sendWxMessage(\''+data[i].id+'\')">&nbsp;发送</a></dt>')+
	                           '</dl>'+
	                      '</div>'+
			        '</div>'+
                    '<div class="h_gg">'+
                         '<div class="hot_l">'+
                          
                          '<span>类别：'+data[i].partName+'</span>'+
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
                    
                    
                 '<div class="success_list" style="display: none" id="institutionReply'+i+'">'+
                 '<div class="aline02"><img src="'+getPath()+'/default/style/images/Announcement04.png"/></div>'+
                 '<div class="srbox01"><textarea name="institutionContent'+i+'" id="institutionContent'+i+'" cols="" rows=""></textarea></div>'+
                  '<div class="aline01">'+
                      '<div class="aline01_left"><img src="'+getPath()+'/default/style/images/Announcement02.png"/>'+ 
                      '<a href="javascript:void(0)" onclick="show(\'institutionContent'+i+'\')">表情</a> <img src="'+getPath()+'/default/style/images/Announcement01.png"/>'+ 
                      '<a href="javascript:void(0)" onclick="offenLang(this,\'institutionContent\','+i+',0)">常用语</a></div>'+
                      '<div class="aline01_right"><input class="pinglun_btn01" type="button" onclick="addInstitutionFromList('+i+',\''+data[i].id+'\')" value="发表评论"></div>'+
             		 '</div>'+
                      '<div class="amessages01" id="institutionReplyContent'+i+'">'+
                       '</div>'+
         		'</div>'+
         		
              '</li>').appendTo($("#institutionMessage"));
			}
			
			/*var totalPage = pag.recordCount%pag.pageSize==0?(pag.recordCount/pag.pageSize):Math.floor(pag.recordCount/pag.pageSize)+1;
			var pagediv = "<div style='margin:5px 0x;'><font>当前第"+pag.currentPage+"页,共"+totalPage
			+"页</font><a href='javascript:void(0)' id='prev' onclick=pagGetDataInst("+pag.currentPage+",'prev',"+totalPage+")>上一页</a>"		
			+"<a href='javascript:void(0)' id='next' onclick=pagGetDataInst("+pag.currentPage+",'next',"+totalPage+")>下一页</a></div>";
			$("#PaginationInst").html(pagediv);*/
			$("#pagelist").html('');
			var total = pag.recordCount%pag.pageSize==0?(pag.recordCount/pag.pageSize):Math.floor(pag.recordCount/pag.pageSize)+1;
			$("#pagelist").html(initpagelist(pag.currentPage,total));
		}
	},'json');
}

function sendWxMessage(id){
	art.dialog.confirm("是否确定发送？",function(){
		$.post(getPath()+"/interflow/institution/sendWxMessage",{id:id},function(res){
			if(res.STATE=="SUCCESS"){
				art.dialog.tips('发送成功');
				initInstitutionData();	
			}else{
				art.dialog.alert(res.MSG);
			}
		},'json');
	});
}

function setTopInst(id,istop){
	if(istop==0)istop=1;
	else istop=0;
	
	art.dialog.confirm(istop==0?"是否取消置顶？":"是否置顶？",function(){
		$.post(getPath()+"/interflow/institution/setTop",{id:id,istop:istop},function(res){
			if(res.STATE=="SUCCESS"){
				initInstitutionData();	
			}
			
		},'json');
	});

	
}
function pagGetDataInst(page,id,count){
	if(id=="prev"){
		if(page==1){
			art.dialog.tips('已经是第一页');
			return
		}else{
			initInstitutionData(page-1);
		}
	}else{
		if(page==count){
			art.dialog.tips('已经是最后一页');
			return
		}else{
			initInstitutionData(page+1);
		}
	}
}
function pagesearch(num){
	initInstitutionData(num);
}
init= function(){
	/*CKEDITOR.replace('content', config);*/
	addUploadButton(CKEDITOR.instances.editor1);
	
	//var marketContent = $("#marketContent").val();
	/*CKEDITOR.instances.institutioncontent.setData($("#institutioncontent").val());*/

	
	addPhotoButton("uploadImage","institutionphotonames","image");
	addPhotoButton("uploadAttach","institutionattachnames","file");
	
	getBaseData("ZDFFLB");
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
                	action: getPath()+'/framework/images/upload?direct=news',
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
function addInstitution(){
	art.dialog.data("result",null);
	var dlg = art.dialog.open(getPath()+"/interflow/institution/addInstitution",{
			title:'发布制度发文',
			 lock:true,
			 width:'750px',
			 height:'425px',
			 id:"addBill",
			 close:function(){
				 return true;
				
			 },
			 button:[{name:'保存',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.valiInstitutionForm){
						dlg.iframe.contentWindow.valiInstitutionForm(dlg);
					}
					return false;
				}},{name:'保存并发送',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.valiInstitutionSendForm){
						dlg.iframe.contentWindow.valiInstitutionSendForm(dlg);
					}
					return false;
				}},{name:'取消',callback:function(){
					return true;
				}}]
		});
}

initInstitutionCommentData = function(){
	var institutionId = $("#institutionId").val();
	backCommentData(institutionId,"commentMessage","reContent");
}

/**
 * 制度发文ID
 * 评论列表ID
 * 评论内容控件ID
 */
backCommentData = function(institutionId,depcom,contcomp,index){
	$.post(getPath()+"/interflow/institutionComment/getComment",{institutionId:institutionId},function(res){
		var data = res.comment;
		//var clickCount = res.clickCount;
		//增加点击数
		//if(index)
		//	$("#clickspan"+index).html("("+clickCount+")");
		if(data!=null){
			$("#"+depcom).html("");
			
			if(data.length==0){
				$(".aline01").hide();
				$("#institutionMessage").hide();
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
	                  '<span class="btright"><a href="javascript:void(0)" onclick="toReplayInstitution(\''+data[i].reCreator.name+'\',\''+contcomp+'\',\''+data[i].reCreator.id+'\',\''+data[i].belongOrg.id+'\')">回复</a>&nbsp;&nbsp;'+
	                  ((currentId==data[i].reCreator.id?'<a style="color:#8c6c1d;cursor: pointer;" href="javascript:void(0)" onclick="delInstitutionComment(\''+data[i].id+'\',\''+institutionId+'\',\''+depcom+'\')">删除</a></span></p>':"</span></p>"))+
	                 '<p class="afont">'+convertImg(data[i].reContent)+'</p>'+
	                '</dd>'+
	             '</dl>').appendTo("#"+depcom);
			}
			personPop.init();
			
			$(".aline01").show();
			$("#institutionMessage").show();
			
			}
		}
	});
}

toReplayInstitution = function(name,comp,creatorById,orgById,institutionId){
	$("#creatorById").val(creatorById);
	$("#orgById").val(orgById);
	$("#"+comp).val("回复"+name+":");
}
addInstitutionComment = function(){
	var institutionId = $("#institutionId").val();
	addInstitutionCommentData(institutionId,"reContent","commentMessage");
	
}

addInstitutionFromList = function(index,institutionId){
	addInstitutionCommentData(institutionId,"institutionContent"+index,"institutionReplyContent"+index);
}
/**
 * institutionId 制度发文ID
 * depcom  评论区内容控件ID
 * comlistcomp  评论列表所在控件
 */
addInstitutionCommentData = function(institutionId,depcom,comlistcomp){
	var content  = $("#"+depcom).val();
	
	if(content==""){
		art.dialog.tips('评论内容不能为空！');
		return
	}else{
		
	$.post(getPath()+"/interflow/institutionComment/insertComment",{reContent:content,institutionId:institutionId,creatorBy:$("#creatorById").val(),orgBy:$("#orgById").val()},function(data){
		if(data==1){
			art.dialog.tips("评论成功!",null,"succeed");
			$("#"+depcom).val("");
			backCommentData(institutionId,comlistcomp,depcom);
		}else{
			art.dialog.alert('评论失败！');
		}
	});
	}
}

/**
 * 删除制度发文评论
 */
delInstitutionComment = function(id,institutionId,depcom,contcomp){
	$.post(getPath()+"/interflow/institutionComment/delComment",{id:id},function(data){
		if(data==1){
			art.dialog.tips('删除成功！',null,"succeed");
			backCommentData(institutionId,depcom,contcomp);
		}else{
			art.dialog.alert('删除失败！');
		}
	});
}

viewInstitution = function(id){
	art.dialog.open(getPath()+'/interflow/institution/selectById?id='+id,
			{title:"查看制度发文",
			lock:true,
			width:830,
			height:450,
			id:'NOTICE-VIEW',
			button:[{name:'关闭'}]}
	);
}
viewParentInstitution = function(id){
	parent.art.dialog.open(getPath()+'/interflow/institution/selectById?id='+id,
			{title:"查看制度发文",
			lock:true,
			width:830,
			height:450,
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
toInstitutionReply = function(billId,index){
	if($("#institutionReply"+index).css("display")=="none"){
	$("#institutionReply"+index).show();
	
	backCommentData(billId,"institutionReplyContent"+index,"institutionContent"+index,index);
	}else{
		$("#institutionReply"+index).hide();
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

function modifyInst(id){
	art.dialog.data("result",null);
	var dlg = art.dialog.open(getPath()+"/interflow/institution/editInstitution?id="+id,{
			title:'修改制度发文',
			 lock:true,
			 width:'800px',
			 height:'500px',
			 id:"editBill",
			 close:function(){
				 return true;
			 },
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.valiInstitutionForm){
						dlg.iframe.contentWindow.valiInstitutionForm(dlg);
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

function deleteinstitution(id){
	artDialog.confirm("确定删除该条制度发文吗?",function(){
		$.post(getPath()+"/interflow/institution/deteleById",{id:id},function(data){
			data = eval('('+data+')');
			art.dialog({
				content:data.MSG,
				time:2,
				close:function(){
					initInstitutionData();
				},
				width:200
			});
		});
	},function(){})
}


function getInstType(typeNumber){
	var clary = new Array();
	$.post(getPath()+"/basedata/basic/basicSupply/listAllData",{enableflag:'1',typenumber:typeNumber},function(data){
		for(var i=0;i<data.length;i++){
			clary.push(data[i]);
		}
		geneInstTypehtml(clary);
	},'json');
}

//function geneInstTypehtml(a){
//	var html = "";
//	html+="<option value=''>请选择栏目</option>";
//	for(var i=0;i<a.length;i++){
//		
//		html +="<option value='"+a[i].id+"'>"+a[i].name+"</option>";
//	}
//	$("#leftMenu").html(html);
//}

function geneInstTypehtml(a){
	var html = "";
	for(var i=0;i<a.length;i++){
		html+="<li><a href=javascript:void(0); onclick=changeData('"+a[i].id+"',this);><b class='arrow02'></b><span  style='color: #000000;'>"+a[i].name+"</span></a></li>";
	}
	$('#leftMenu').html(html);
}
