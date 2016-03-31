// 注明：此文件代码由 by zhangxixnu 提供，下载自站点：http://www.zhangxinxu.com/ 
// 不论何种情况，务必保留原作者署名和来源。 
// 在原作者上集合本项目修改：1.取消搜索后弹出提示 2.增加屏蔽渲染属性shield
// demo : $("body").textSearch("世界杯");$(".test").textSearch("空姐 凤姐 芙蓉姐",{markColor: "blue"});
(function($){
	$.fn.textSearch = function(str,options){
		var defaults = {
			divFlag: true,//布尔型，true表示对字符串进行多关键字处理，false表示不处理，整个字符串看成1个关键字
			divStr: " ",//字符串，表示分割多个关键字的字符，默认为空格，如果divFlag为false，此参数将失效
			markClass: "",//代码高亮的class类，默认为没有样式，如果设置样式，将覆盖默认的红色高亮颜色值
			markColor: "red",//字符串，指高亮文字的颜色值，默认红色。markClass不为空，则此参数失效。
			nullReport: true,//布尔型，表示当搜索结果为空时，是否弹出提示信息。默认弹出。（已取消）
			shieldTag:"shield",//自定义扩展：标签使用屏蔽属性，用此标签包围的文本（不支持标签套标签）将不渲染
			callback: function(){//回调函数，默认无效果。当存在搜索结果时执行。
				return false;	
			}
		};
		var sets = $.extend({}, defaults, options || {}), clStr;
		if(sets.markClass){
			clStr = "class='"+sets.markClass+"'";	
		}else{
			clStr = "style='color:"+sets.markColor+";'";
		}
		
		//对前一次高亮处理的文字还原		
		$("span[rel='mark']").each(function() {
			var text = document.createTextNode($(this).text());	
			$(this).replaceWith($(text));
		});
		
		
		//字符串正则表达式关键字转化
		$.regTrim = function(s){
			var imp = /[\^\.\\\|\(\)\*\+\-\$\[\]\?]/g;
			var imp_c = {};
			imp_c["^"] = "\\^";
			imp_c["."] = "\\.";
			imp_c["\\"] = "\\\\";
			imp_c["|"] = "\\|";
			imp_c["("] = "\\(";
			imp_c[")"] = "\\)";
			imp_c["*"] = "\\*";
			imp_c["+"] = "\\+";
			imp_c["-"] = "\\-";
			imp_c["$"] = "\$";
			imp_c["["] = "\\[";
			imp_c["]"] = "\\]";
			imp_c["?"] = "\\?";
			s = s.replace(imp,function(o){
				return imp_c[o];					   
			});	
			return s;
		};
		$(this).each(function(){
			var t = $(this);
			str = $.trim(str);
			if(str === ""){
				//alert("关键字为空");	
				return false;
			}else{
				//将关键字push到数组之中
				var arr = [];
				if(sets.divFlag){
					arr = str.split(sets.divStr);	
				}else{
					arr.push(str);	
				}
			}
			var v_html = t.html();
			//删除注释
			v_html = v_html.replace(/<!--(?:.*)\-->/g,"");
			
			//将HTML代码支离为HTML片段和文字片段，其中文字片段用于正则替换处理，而HTML片段置之不理
			var tags = /[^<>]+|<(\/?)([A-Za-z]+)([^<>]*)>/g;
			var a = v_html.match(tags), test = 0;
			
			//屏蔽不标记
			var shieldIndex = 0 ;
			var shieldTag = sets.shieldTag.toLowerCase();
			
			$.each(a, function(i, c){
				//是标签 并且出现屏蔽属性，则下一次不渲染
				if(/<(?:.|\s)*?>/.test(c) && $(c).attr(""+shieldTag+"")!=null){
					shieldIndex = i + 1 ;
				}
				if(shieldIndex == i){
					shieldIndex = 0 ;
					//本次不做处理
				}else{
					if(!/<(?:.|\s)*?>/.test(c)){//非标签
						//开始执行替换
						$.each(arr,function(index, con){
							if(con === ""){return;}
							var reg = new RegExp($.regTrim(con), "g");
							if(reg.test(c)){
								//正则替换
								c = c.replace(reg,"♂"+con+"♀");
								test = 1;
							}
						});
						c = c.replace(/♂/g,"<span rel='mark' "+clStr+">").replace(/♀/g,"</span>");
						a[i] = c;
					}
				}
			});
			//将支离数组重新组成字符串
			var new_html = a.join("");
			
			$(this).html(new_html);
			
			if(test === 0 && sets.nullReport){
				//alert("没有搜索结果");	
				return false;
			}
			
			//执行回调函数
			sets.callback();
		});
	};
})(jQuery);