$(document).ready(function(){
	$("#leftSelectedData").find("li[key='portlet']").ligerDrag({ proxy: 'clone', revert: true, receive: '.layoutdiv',
        onStartDrag: function ()
        {
            this.set({ cursor: "not-allowed" });
        },
        onDragEnter: function (receive, source, e)
        {
            this.set({ cursor: "pointer" });
            
        },
        onDragLeave: function (receive, source, e)
        {
            this.set({ cursor: "not-allowed" });
            
        },
        onDrop: function (receive, source, e)
        {
            if (!this.proxy) return;
            this.proxy.hide();
            var t =  getCurTimeStr();
            var objhtml = "<li key='portlet' ptime='"+t+"' portletid='"+this.target.attr("portletid")+"'>"+this.proxy.html()
            +"<a href='javascript:void(0)' onclick='removeli(this)' style='float:right;cursor:pointer;'>"
            +"<img src='"+getPath()+"/default/styleBlue/images/delete.png'></a></li>";
            
            $(receive).append(objhtml);
            $.each($(receive).find("li[ptime='"+t+"']"),function(i,item){
            	initDrag($(item));
            });
            //this.target.remove();
        }
	});

	init(portlaystr);
	
	setLeftSelectedData();
	
});

function setLeftSelectedData(){
	var layout=$("#layout").val();
	$("#leftSelectedData").find("li").each(function(idx,el){
		if($(el).attr("layout")==layout){
			$(el).show();
		}else{
			$(el).hide();
		}
	});
}

function removeli(obj){
	$(obj).html('');
	$(obj).parent().remove();
	
}

function getCurTimeStr(){
	return (new Date()).getTime(); 
}

function initDrag(obj){
	$(obj).ligerDrag({ proxy: 'clone', revert: true, receive: '.layoutdiv',
        onStartDrag: function ()
        {
            this.set({ cursor: "not-allowed" });
        },
        onDragEnter: function (receive, source, e)
        {
            this.set({ cursor: "pointer" });
            
        },
        onDragLeave: function (receive, source, e)
        {
            this.set({ cursor: "not-allowed" });
            
        },
        onDrop: function (receive, source, e)
        {
            if (!this.proxy) return;
            this.proxy.hide();
            this.target.remove();
            
            var t =  getCurTimeStr();
            var objhtml = "<li key='portlet' ptime='"+t+"' portletid='"+this.proxy.attr("portletid")+"'>"+this.proxy.html()
            +"</li>";        
            $(receive).append($(objhtml));
            $.each($(receive).find("li[ptime='"+t+"']"),function(i,item){
            	initDrag($(item));
            });
        }
	});
}

function beforesave(dlg){
	var htmlstr = "[";
	var onestr = "";
	var twostr = "";
	$.each($("#layoutone").find("li[key='portlet']"),function(i,item){
		var dataStr = "";
		if(i>0){
			dataStr+=",";
		}
		dataStr += "{"; 
		dataStr += "'portletid':'"+$(item).attr("portletid")+"',";
		dataStr += "'x':'1',";
		dataStr += "'y':'"+(i+1)+"'";
		dataStr += "}";
		onestr+=dataStr;
	});
	$.each($("#layoutwo").find("li[key='portlet']"),function(i,item){
		var dataStr = "";
		if(i>0){
			dataStr+=",";
		}
		dataStr += "{"; 
		dataStr += "'portletid':'"+$(item).attr("portletid")+"',";
		dataStr += "'x':'2',";
		dataStr += "'y':'"+(i+1)+"'";
		dataStr += "}";
		twostr+=dataStr;
	});
	htmlstr = htmlstr+onestr+((onestr&&twostr)?",":"")+twostr+"]";
	$("#portletlist").val(htmlstr);
	
}

function init(str){
	if(str){
		var lary = eval(str);
		for(var i=0;i<lary.length;i++){
			var t = lary[i];
			var objhtml = '';
			if(t.x=='1'){
	            objhtml = "<li key='portlet' portletid='"+t.portletid+"'>"+t.portletname
	            +"<a href='javascript:void(0)'  onclick='removeli(this)' style='float:right;cursor:pointer;'>"
	            +"<img src='"+getPath()+"/default/styleBlue/images/delete.png'></a></li>";
	            $("#layoutone").append($(objhtml));
			}
			if(t.x=='2'){
	            objhtml = "<li key='portlet' portletid='"+t.portletid+"'>"+t.portletname
	            +"<a href='javascript:void(0)'  onclick='removeli(this)' style='float:right;cursor:pointer;'>"
	            +"<img src='"+getPath()+"/default/styleBlue/images/delete.png'></a></li>";
	            $("#layoutwo").append($(objhtml));
			}
		}
		$.each($("#layoutone,#layoutwo").find("li[key='portlet']"),function(i,item){
        	initDrag(item);
        });
	}
}