/*publish time:2011-07-21 13:31:33*/
var G , Q , U ;
var O = 0;
var B = 0;
var J = B;
var C;
var M={};
var HH={};
var D = function(W) {
	var V = Q.width(W)+6;
	var X = Q.offset(W).left - Q.offset(W.parentNode).left-4;
	G.Anim(".views-block", {
		left : X + 11 + "px",
		width : V + "px"
	}, 0.3, G.Easing.easeNone).run();
	var S = W.className.substr(W.className.length - 1, 1);
	Q.css("#J_View360", "backgroundImage", "url(" + M[S] + ")");
	Q.css("#J_View360","height",$("#imagea").height());
	var h11 = $("#imagea").height();
	if(h-h11>0){
		$("#J_View360").css("margin-top",(h-h11)/2+"px");
		$("body").css("overflow-y","hidden");
		$("#J_View360").css("height",h11);
	}
	$("#imagea").attr("url",M[S]);
	$("#imageid").val(HH[S]);
	$(".floatbox").css("display","none");
	$(".floatbox[ref='"+ HH[S]+"']").css("display","block");
	O = -10;
	J = B + 50;
	R = true
};
function setbody(){
	var h11 = $("#imagea").height();
	if(h-h11>0){
		$("#J_View360").css("margin-top",(h-h11)/2+"px");
		$("body").css("overflow-y","hidden");
		$("#J_View360").css("height",h11);
	}
}
$(document).ready(function() {
	$(".w910").height(h-0);
	$(".khl-top-gd").height(h-260);
	$(".big-pic").height(h-0);
	$(".big-picin").height(h-20);
	$(".floatbox").each(function(){
		var floatboxleft = $(this).offset().left
		$(this).find("input[name='left']").val(floatboxleft);
		$(this).find("input[name='right']").val(parseFloat($("#imagea").width()) - floatboxleft);
	});
	 G = KISSY; Q = G.DOM; U = G.Event;
	Q.css("#J_View360","height",$("#imagea").height());
	var T = "";
	var I = 0;
	var L = false;
	var R = false;
	var K = false;
	var E = 0;
	var F = 0;
	var P = 0;
	var N = [ 0, 0, 0, 0 ];
	$(".allImage").each(function(i){
		var b=i+1;
		M[b]=$(this).attr("src");
	});
	$(".imageid").each(function(i){
		var b=i+1;
		HH[b]=$(this).val();
	});
	var A = 0;
	var H = function() {
		$("#mouseMoveId").html(J);
		movefloatbox(J);
		Q.css("#J_View360", "backgroundPosition", J + "px " + I + "px")
	};
	//Q.css("#J_View360", "backgroundImage", "url(" + M[1] + ")");
	
    C = Q.query("a", Q.get(".views-trigger"));
	D(C[A]);
	U.on(C, "click", function(S) {
		D(this)
	});
	O = -10;
	J = B + 50;
	R = true;
	H();
	setInterval(function() {
/*		if((R || K || L==false)){
			return;
		}*/
		if (R) {
			if (Math.abs(J - B) < 5) {
				R = false;
				return
			}
			O = (B - J) * 0.0485;
			J += O;
			H();
			return
		}
		if (K) {
			P = F - E;
			N.push(P);
			N.shift();
			P = 0;
			for ( var S = 0; S < N.length; S++) {
				P += N[S]
			}
			P = P / N.length;
			O = P * 0.485;
			J += O;
			H();
			E = F;
			return
		}
		if (L) {
			if (T == "right") {
				O -= 0.05
			} else {
				if (T == "left") {
					O += 0.05
				}
			}
		}
		if (!L) {
			O = O * 0.97
		}
		J += O;
		H()
	}, 10);
	document.body.onkeydown = function(S) {
		var S = window.event || S;
		L = true;
		if (S.keyCode == 37) {
			T = "left"
		} else {
			if (S.keyCode == 39) {
				T = "right"
			}
		}
	};
	document.body.onkeyup = function() {
		L = false
	};
	U.on("#J_Left", "mousedown", function() {
		T = "left";
		L = true
	});
	U.on("#J_Right", "mousedown", function() {
		T = "right";
		L = true
	});
	U.on([ "#J_Left", "#J_Right" ], "mouseup", function() {
		L = false
	});
	U.on("#J_Back", "mousedown", function() {
		R = true
	});
	U.on("#J_View360", "mousedown", function(S) {
		O = 0;
		E = F;
		K = true
	});
	U.on(document, "mouseup", function() {
		K = false
	});
	U.on(document, "mousemove", function(S) {
		var S = window.event || S;
		F = document.all ? S.clientX : S.pageX
	});
	U.on(document, "dragstart", function(S) {
		return false
	})
});
(function() {
	var A = KISSY, C = A.DOM, B = A.Event;
	B.on(".j_CloseMap", "click", function(D) {
		C.css(".j_Map", "display", "none");
		D.preventDefault()
	});
	B.on(".j_Way", "click", function(D) {
		C.css(".j_Map", "display", "block");
		D.preventDefault()
	})
})();