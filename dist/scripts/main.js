"use strict";var objectFitImages=function(){function e(e,r){if(!e[i].parsingSrcset){var a=c(e);if(a["object-fit"]=a["object-fit"]||"fill",!e[i].s){if("fill"===a["object-fit"])return;if(!e[i].skipTest&&o&&!a["object-position"])return}var n=e[i].ios7src||e.currentSrc||e.src;if(r)n=r;else if(e.srcset&&!l&&window.picturefill){var s=window.picturefill._.ns;e[i].parsingSrcset=!0,e[s]&&e[s].evaled||window.picturefill._.fillImg(e,{reselect:!0}),e[s].curSrc||(e[s].supported=!1,window.picturefill._.fillImg(e,{reselect:!0})),delete e[i].parsingSrcset,n=e[s].curSrc||n}if(e[i].s)e[i].s=n,r&&(e[i].srcAttr=r);else{e[i]={s:n,srcAttr:r||f.call(e,"src"),srcsetAttr:e.srcset},e.src=i;try{e.srcset&&(e.srcset="",Object.defineProperty(e,"srcset",{value:e[i].srcsetAttr})),t(e)}catch(c){e[i].ios7src=n}}e.style.backgroundImage='url("'+n+'")',e.style.backgroundPosition=a["object-position"]||"center",e.style.backgroundRepeat="no-repeat",/scale-down/.test(a["object-fit"])?(e[i].i||(e[i].i=new Image,e[i].i.src=n),function u(){return e[i].i.naturalWidth?void(e[i].i.naturalWidth>e.width||e[i].i.naturalHeight>e.height?e.style.backgroundSize="contain":e.style.backgroundSize="auto"):void setTimeout(u,100)}()):e.style.backgroundSize=a["object-fit"].replace("none","auto").replace("fill","100% 100%")}}function t(t){var r={get:function(){return t[i].s},set:function(r){return delete t[i].i,e(t,r),r}};Object.defineProperty(t,"src",r),Object.defineProperty(t,"currentSrc",{get:r.get})}function r(){c||(HTMLImageElement.prototype.getAttribute=function(e){return!this[i]||"src"!==e&&"srcset"!==e?f.call(this,e):this[i][e+"Attr"]},HTMLImageElement.prototype.setAttribute=function(e,t){!this[i]||"src"!==e&&"srcset"!==e?u.call(this,e,t):this["src"===e?"src":e+"Attr"]=String(t)})}function a(t,r){var n=!g&&!t;if(r=r||{},t=t||"img",c&&!r.skipTest)return!1;"string"==typeof t?t=document.querySelectorAll("img"):t.length||(t=[t]);for(var s=0;s<t.length;s++)t[s][i]=t[s][i]||r,e(t[s]);n&&(document.body.addEventListener("load",function(e){"IMG"===e.target.tagName&&a(e.target,{skipTest:r.skipTest})},!0),g=!0,t="img"),r.watchMQ&&window.addEventListener("resize",a.bind(null,t,{skipTest:r.skipTest}))}var i="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",n=/(object-fit|object-position)\s*:\s*([-\w\s%]+)/g,s=new Image,o="object-fit"in s.style,c="object-position"in s.style,l="string"==typeof s.currentSrc,f=s.getAttribute,u=s.setAttribute,g=!1;return a.supportsObjectFit=o,a.supportsObjectPosition=c,r(),a}();$(document).ready(function(){function e(){$("#cam").imagesLoaded(function(){$(".refresh-bg").css("background-image","url("+e+")"),m+=1});var e=v+"timed="+m;$("#nextframe").attr("src",e)}function t(){if(0==d){if(d=!0,$("#frame-even").hasClass("active"))var e="even",t="odd";if($("#frame-odd").hasClass("active"))var e="odd",t="even";var r=v+"timed="+u;$("#frame-"+t).attr("src",r).load(function(){$("#frame-"+t).addClass("active"),$("#frame-"+e).removeClass("active"),u+=1,d=!1})}}function r(){console.log("Initializing movie..."),a(i,0)}function a(e,t){console.log("Getting cameras..."),$.ajax({dataType:"json",url:"/camaras.json",success:function(r){f=r,console.log("Got cameras: ",f),e(t)}})}function i(e){s(),console.log("Loading camera: ",e),c=e,l=f[e],console.log("Loaded camera: ",l),n(l.type)}function n(e){if(console.log("Playing camera of type: ",e),"image"===e){if(console.log("Playing camera of type image: ",l),null==g&&(console.log("Setting up refresh interval."),g=setInterval(function(){n("image")},500)),v=l.url,0==d){if(!$("#frame-even").hasClass("active")&&!$("#frame-odd").hasClass("active")){console.log("No hay frame activo"),$("#frame-even").addClass("active");var t="even",r="odd"}if(d=!0,$("#frame-even").hasClass("active"))var t="even",r="odd";if($("#frame-odd").hasClass("active"))var t="odd",r="even";var a=v+"?timed="+u;$("#frame-"+r).attr("src",a).load(function(){$("#frame-"+r).addClass("active"),$("#frame-"+t).removeClass("active"),objectFitImages(".frame"),u+=1,d=!1})}}else"mjpg"===e?(console.log("Playing camera of type mjpg: ",l),$("#frame-mjpg").addClass("active").attr("src",l.url)):console.log("Camera type not recognized: ",e)}function s(){console.log("Resetting screen..."),$(".frame").attr("src","").removeClass("active"),$(".cam").data("cam","null"),null!=g&&(console.log("Clearing refresh interval."),clearInterval(g)),g=null,d=!1}function o(e){var t=f.length-1,r=null;"next"===e&&(r=c+1,r>t&&(console.log("Se llegó al final de la lista de camaras."),r=0),console.log("Loading next camera...",r),i(r)),"prev"===e&&(r=c-1,r<0&&(console.log("Se llegó al inicio de la lista de camaras."),r=t),console.log("Loading previous camera...",r),i(r))}var c=null,l=null,f=[],u=0,g=null,d=!1;if($(".refresh-bg").length>0){var m=0,v=$(".refresh-bg").data("cam");setInterval(function(){e()},1e3)}if($(".refresh-interlace").length>0){var d=!1,u=0,v=$(".refresh-interlace").data("cam"),g=setInterval(function(){t()},1e3);objectFitImages(".frame")}$(window).keyup(function(e){var t=e.which;return 13==t||39==t?(o("next"),!1):37==t?(o("prev"),!1):void 0}),$("#screen").on("click",function(){o("next")}),r()});