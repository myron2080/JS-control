
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "//hm.baidu.com/hm.js?e963a365983f04f4675a94016b1002c5";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();

function TrackWeb(act){

    if(typeof(_hmt)!="undefined"){
        _hmt.push(['_trackEvent', "wapevent", act]);
    }
}
