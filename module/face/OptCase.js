var OptCase={
	init:function(o){
		var opParm={
			//AJAX调用后台代码URL
			url:'',
			//元素
			em:null,
			//URL传递 参数
			parm:{},
			//点击事件
			emClick:function($em,objEmId,objs){
				OptCase.emClick($em,objEmId,objs);
			},
			//点击XX事件
			clear:function($em,objEmId){
				OptCase.clear($em, objEmId);
			},
			//用于存放obj ID
			objEmId:'objEmId',
			//初始化时obj的ID存放在节点objEmId中
			objFid:'',
			base:'',
			ctx:'',
			//是否需要清除键
			isClear:false,
			//点击后选中文本框
			isFocus:true,
			//是否判断显示下来数据显示在上面还是下面；
			isAsset: true
		}
		
		$.extend(opParm,o);
		
		if(opParm.isClear){
			opParm.em.after('<img class="btn_xx" src="'+base+'/default/style/images/loading.gif" style="cursor: pointer;">');
			$('.btn_xx').click(function(){
				opParm.clear(opParm.em, opParm.objEmId);
				/*$(this).parent().find('#'+opParm.objEmId).val('');
				opParm.em.val('');*/
			});
		}

		opParm.em.unbind('click').click(function(){
			$('#outDiv').remove();
			var $t=$(this);
			var $parent=$t.parent();
			var oset=$t.offset();
			var outDiv; 
			//注意： 页面中一定要加此标签  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
			//出现滚动条
//		    if (document.documentElement.scrollHeight> document.documentElement.clientHeight){
//		    }else{
//		    }
			var left=oset.left-30;
			var top;
			if(opParm.isAsset){
		    	outDiv='<div id="outDiv" style="position:absolute;border:2px solid #ccc;background-color:#fff" show="no">'+
				'<div><input type="text" id="name" /></div>'+
				'<div id="inDiv" ><img src="'+base+'/default/style/images/loading.gif"/></div></div>';
			}else{
				outDiv='<div id="outDiv" style="position:absolute;border:2px solid #ccc;background-color:#fff" show="no">'+
				'<div id="inDiv" ><img src="'+base+'/default/style/images/loading.gif"/></div>'+
				'<div><input type="text" id="name" /></div></div>';
			}
		   
			$parent.append(outDiv);
			if(opParm.isAsset){
				//top=oset.top+$t.height()+ 10;
			}else{
				//top=$('#outDiv').position().top - $('#outDiv').height();
			}
			$('#outDiv').css({'left':left,'top':top,'z-index':'1','color':'#000'});
			$('#inDiv img').css({'position':'relative','left':'15px'});
			$parent.find('#name').css({'margin':'5px','width':'120px','border':'1px solid #888'});
			if(opParm.isFocus){
				$parent.find('#name').select();
			}
			var objEmId=opParm.objEmId;
			var objId=$('#'+objEmId).val();
			if(objId==''||objId==null){
				$parent.find('#'+objEmId).remove();
				$parent.append('<input type="hidden" value="" id="'+objEmId+'" value="'+opParm.objFid+'"/>');
			}
			setTimeout(function(){
				closeOutBorder($('#outDiv'));
			},80);
			oldName=null;
			loadIofo('');
			$parent.find('#name').keyup(function(){
				loadIofo($.trim($(this).val()));
				if(opParm.isAsset){
					if((document.documentElement.clientHeight - oset.top) <= 250){
						setTimeout(function(){
							top = oset.top - $("#outDiv").height() - $('#name').height();
							$('#outDiv').css({'left':left,'top':top,'z-index':'1'});
						},300);
					}
				}
			});
		});
		var oldName=null;
		var loadIofo=function(name){
			opParm.parm.name=name;
			if(oldName!=name){
				$('#inDiv [oid]').remove();
				$('#inDiv img').show();
				$.ajax({
					type:"post",
					url:opParm.url,
					data:opParm.parm,
					success:function(data){
						var objs=eval(data);
						$('[oid]').remove();
						$.each(objs,function(n,obj){
							oname=obj.name;
							if(oname.length>=8){
								oname=oname.substring(0,8)+'...';
							}
							if(obj.title){
								oname = oname + "(" + obj.title + ")"
							}
							$('#inDiv').append('<div id="objso" style="" title="'+obj.name+'" oid="'+obj.id+'" index="'+n+'">'+oname+'</div>');
						});
						$('[oid]').css({'border-top':'1px solid #CCC','cursor':'pointer','padding-left':'5px','width':'130px'});
						$('[oid]').hover(
							function(){
								$(this).css({'background-color':'#005EAC','color':'#fff'});
							},
							function(){
								$(this).css({'background-color':'#fff','color':'#000'});
							}
						)
						opParm.emClick(opParm.em,opParm.objEmId,objs);
						$('#inDiv img').hide();
						closeOutBorder($('#outDiv'));
					}
				});
			}
			oldName=name;
		}
	},

	emClick:function($em,objEmId,objs){
		$('[oid]').click(function(){
			$em.val($(this).attr('title'));
			$em.siblings('#'+objEmId).val($(this).attr('oid'));
			$('#outDiv').hide();
		});
	},
	clear:function($em,objEmId){
		$em.parent().find('#'+objEmId).val('');
		$em.val('');
	}
	
}