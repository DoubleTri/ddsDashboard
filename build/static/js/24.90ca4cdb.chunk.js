(this["webpackJsonpmy-ap"]=this["webpackJsonpmy-ap"]||[]).push([[24],{279:function(e,t,o){"use strict";var a=o(5),n=o(4),r=o(3),i=o(0),s=o(436),l=o(257),c=o(10),f=o.n(c),p=o(288),u={adjustX:1,adjustY:1},b={adjustX:0,adjustY:0},d=[0,0];function m(e){return"boolean"===typeof e?e?u:b:Object(r.a)(Object(r.a)({},b),e)}var v=o(67),O=o(45),j=o(333),g=o(47),h=function(e,t){var o={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(o[a]=e[a]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var n=0;for(a=Object.getOwnPropertySymbols(e);n<a.length;n++)t.indexOf(a[n])<0&&Object.prototype.propertyIsEnumerable.call(e,a[n])&&(o[a[n]]=e[a[n]])}return o},y=new RegExp("^(".concat(j.a.join("|"),")(-inverse)?$"));function w(e,t){var o=e.type;if((!0===o.__ANT_BUTTON||!0===o.__ANT_SWITCH||!0===o.__ANT_CHECKBOX||"button"===e.type)&&e.props.disabled){var a=function(e,t){var o={},a=Object(r.a)({},e);return t.forEach((function(t){e&&t in e&&(o[t]=e[t],delete a[t])})),{picked:o,omitted:a}}(e.props.style,["position","left","right","top","bottom","float","display","zIndex"]),n=a.picked,s=a.omitted,l=Object(r.a)(Object(r.a)({display:"inline-block"},n),{cursor:"not-allowed",width:e.props.block?"100%":null}),c=Object(r.a)(Object(r.a)({},s),{pointerEvents:"none"}),p=Object(v.a)(e,{style:c,className:null});return i.createElement("span",{style:l,className:f()(e.props.className,"".concat(t,"-disabled-compatible-wrapper"))},p)}return e}var x=i.forwardRef((function(e,t){var o,c=i.useContext(O.b),u=c.getPopupContainer,b=c.getPrefixCls,j=c.direction,x=Object(l.a)(!1,{value:e.visible,defaultValue:e.defaultVisible}),C=Object(n.a)(x,2),P=C[0],N=C[1],E=function(){var t=e.title,o=e.overlay;return!t&&!o&&0!==t},k=function(){var t=e.builtinPlacements,o=e.arrowPointAtCenter,a=e.autoAdjustOverflow;return t||function(e){var t=e.arrowWidth,o=void 0===t?4:t,a=e.horizontalArrowShift,n=void 0===a?16:a,i=e.verticalArrowShift,s=void 0===i?8:i,l=e.autoAdjustOverflow,c={left:{points:["cr","cl"],offset:[-4,0]},right:{points:["cl","cr"],offset:[4,0]},top:{points:["bc","tc"],offset:[0,-4]},bottom:{points:["tc","bc"],offset:[0,4]},topLeft:{points:["bl","tc"],offset:[-(n+o),-4]},leftTop:{points:["tr","cl"],offset:[-4,-(s+o)]},topRight:{points:["br","tc"],offset:[n+o,-4]},rightTop:{points:["tl","cr"],offset:[4,-(s+o)]},bottomRight:{points:["tr","bc"],offset:[n+o,4]},rightBottom:{points:["bl","cr"],offset:[4,s+o]},bottomLeft:{points:["tl","bc"],offset:[-(n+o),4]},leftBottom:{points:["br","cl"],offset:[-4,s+o]}};return Object.keys(c).forEach((function(t){c[t]=e.arrowPointAtCenter?Object(r.a)(Object(r.a)({},c[t]),{overflow:m(l),targetOffset:d}):Object(r.a)(Object(r.a)({},p.a[t]),{overflow:m(l)}),c[t].ignoreShake=!0})),c}({arrowPointAtCenter:o,autoAdjustOverflow:a})},T=e.getPopupContainer,V=h(e,["getPopupContainer"]),S=e.prefixCls,A=e.openClassName,D=e.getTooltipContainer,R=e.overlayClassName,I=e.color,L=e.overlayInnerStyle,H=e.children,z=b("tooltip",S),B=b(),_=P;!("visible"in e)&&E()&&(_=!1);var M,F=w(Object(v.b)(H)?H:i.createElement("span",null,H),z),W=F.props,X=f()(W.className,Object(a.a)({},A||"".concat(z,"-open"),!0)),Y=f()(R,(o={},Object(a.a)(o,"".concat(z,"-rtl"),"rtl"===j),Object(a.a)(o,"".concat(z,"-").concat(I),I&&y.test(I)),o)),q=L;return I&&!y.test(I)&&(q=Object(r.a)(Object(r.a)({},L),{background:I}),M={background:I}),i.createElement(s.a,Object(r.a)({},V,{prefixCls:z,overlayClassName:Y,getTooltipContainer:T||D||u,ref:t,builtinPlacements:k(),overlay:function(){var t=e.title,o=e.overlay;return 0===t?t:o||t||""}(),visible:_,onVisibleChange:function(t){var o;N(!E()&&t),E()||null===(o=e.onVisibleChange)||void 0===o||o.call(e,t)},onPopupAlign:function(e,t){var o=k(),a=Object.keys(o).filter((function(e){return o[e].points[0]===t.points[0]&&o[e].points[1]===t.points[1]}))[0];if(a){var n=e.getBoundingClientRect(),r={top:"50%",left:"50%"};a.indexOf("top")>=0||a.indexOf("Bottom")>=0?r.top="".concat(n.height-t.offset[1],"px"):(a.indexOf("Top")>=0||a.indexOf("bottom")>=0)&&(r.top="".concat(-t.offset[1],"px")),a.indexOf("left")>=0||a.indexOf("Right")>=0?r.left="".concat(n.width-t.offset[0],"px"):(a.indexOf("right")>=0||a.indexOf("Left")>=0)&&(r.left="".concat(-t.offset[0],"px")),e.style.transformOrigin="".concat(r.left," ").concat(r.top)}},overlayInnerStyle:q,arrowContent:i.createElement("span",{className:"".concat(z,"-arrow-content"),style:M}),motion:{motionName:Object(g.b)(B,"zoom-big-fast",e.transitionName),motionDeadline:1e3}}),_?Object(v.a)(F,{className:X}):F)}));x.displayName="Tooltip",x.defaultProps={placement:"top",mouseEnterDelay:.1,mouseLeaveDelay:.1,arrowPointAtCenter:!1,autoAdjustOverflow:!0};t.a=x},288:function(e,t,o){"use strict";o.d(t,"a",(function(){return r}));var a={adjustX:1,adjustY:1},n=[0,0],r={left:{points:["cr","cl"],overflow:a,offset:[-4,0],targetOffset:n},right:{points:["cl","cr"],overflow:a,offset:[4,0],targetOffset:n},top:{points:["bc","tc"],overflow:a,offset:[0,-4],targetOffset:n},bottom:{points:["tc","bc"],overflow:a,offset:[0,4],targetOffset:n},topLeft:{points:["bl","tl"],overflow:a,offset:[0,-4],targetOffset:n},leftTop:{points:["tr","tl"],overflow:a,offset:[-4,0],targetOffset:n},topRight:{points:["br","tr"],overflow:a,offset:[0,-4],targetOffset:n},rightTop:{points:["tl","tr"],overflow:a,offset:[4,0],targetOffset:n},bottomRight:{points:["tr","br"],overflow:a,offset:[0,4],targetOffset:n},rightBottom:{points:["bl","br"],overflow:a,offset:[4,0],targetOffset:n},bottomLeft:{points:["tl","bl"],overflow:a,offset:[0,4],targetOffset:n},leftBottom:{points:["br","bl"],overflow:a,offset:[-4,0],targetOffset:n}}},333:function(e,t,o){"use strict";o.d(t,"b",(function(){return n})),o.d(t,"a",(function(){return r}));var a=o(69),n=Object(a.a)("success","processing","error","default","warning"),r=Object(a.a)("pink","red","yellow","orange","cyan","green","blue","purple","geekblue","magenta","volcano","gold","lime")},436:function(e,t,o){"use strict";var a=o(3),n=o(11),r=o(2),i=o(18),s=o(0),l=o(439),c=o(288),f=function(e){var t=e.overlay,o=e.prefixCls,a=e.id,n=e.overlayInnerStyle;return s.createElement("div",{className:"".concat(o,"-inner"),id:a,role:"tooltip",style:n},"function"===typeof t?t():t)},p=function(e,t){var o=e.overlayClassName,p=e.trigger,u=void 0===p?["hover"]:p,b=e.mouseEnterDelay,d=void 0===b?0:b,m=e.mouseLeaveDelay,v=void 0===m?.1:m,O=e.overlayStyle,j=e.prefixCls,g=void 0===j?"rc-tooltip":j,h=e.children,y=e.onVisibleChange,w=e.afterVisibleChange,x=e.transitionName,C=e.animation,P=e.motion,N=e.placement,E=void 0===N?"right":N,k=e.align,T=void 0===k?{}:k,V=e.destroyTooltipOnHide,S=void 0!==V&&V,A=e.defaultVisible,D=e.getTooltipContainer,R=e.overlayInnerStyle,I=Object(i.a)(e,["overlayClassName","trigger","mouseEnterDelay","mouseLeaveDelay","overlayStyle","prefixCls","children","onVisibleChange","afterVisibleChange","transitionName","animation","motion","placement","align","destroyTooltipOnHide","defaultVisible","getTooltipContainer","overlayInnerStyle"]),L=Object(s.useRef)(null);Object(s.useImperativeHandle)(t,(function(){return L.current}));var H=Object(r.a)({},I);"visible"in e&&(H.popupVisible=e.visible);var z=!1,B=!1;if("boolean"===typeof S)z=S;else if(S&&"object"===Object(n.a)(S)){var _=S.keepParent;z=!0===_,B=!1===_}return s.createElement(l.a,Object(a.a)({popupClassName:o,prefixCls:g,popup:function(){var t=e.arrowContent,o=void 0===t?null:t,a=e.overlay,n=e.id;return[s.createElement("div",{className:"".concat(g,"-arrow"),key:"arrow"},o),s.createElement(f,{key:"content",prefixCls:g,id:n,overlay:a,overlayInnerStyle:R})]},action:u,builtinPlacements:c.a,popupPlacement:E,ref:L,popupAlign:T,getPopupContainer:D,onPopupVisibleChange:y,afterPopupVisibleChange:w,popupTransitionName:x,popupAnimation:C,popupMotion:P,defaultPopupVisible:A,destroyPopupOnHide:z,autoDestroy:B,mouseLeaveDelay:v,popupStyle:O,mouseEnterDelay:d},H),h)},u=Object(s.forwardRef)(p);t.a=u},532:function(e,t,o){"use strict";var a=o(544);t.a=a.a},795:function(e,t,o){"use strict";o.r(t);var a=o(4),n=o(0),r=o(20),i=o(532),s=o(218),l=o(570),c=o(789),f=o(60),p=o(219),u=o(2),b={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 110.8V792H136V270.8l-27.6-21.5 39.3-50.5 42.8 33.3h643.1l42.8-33.3 39.3 50.5-27.7 21.5zM833.6 232L512 482 190.4 232l-42.8-33.3-39.3 50.5 27.6 21.5 341.6 265.6a55.99 55.99 0 0068.7 0L888 270.8l27.6-21.5-39.3-50.5-42.7 33.2z"}}]},name:"mail",theme:"outlined"},d=o(15),m=function(e,t){return n.createElement(d.a,Object(u.a)(Object(u.a)({},e),{},{ref:t,icon:b}))};m.displayName="MailOutlined";var v=n.forwardRef(m),O={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M832 464h-68V240c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zM332 240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v224H332V240zm460 600H232V536h560v304zM484 701v53c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-53a48.01 48.01 0 10-56 0z"}}]},name:"lock",theme:"outlined"},j=function(e,t){return n.createElement(d.a,Object(u.a)(Object(u.a)({},e),{},{ref:t,icon:O}))};j.displayName="LockOutlined";var g=n.forwardRef(j),h=o(6);t.default=function(){var e=Object(n.useState)({email:null,password:null}),t=Object(a.a)(e,2),o=t[0],u=t[1],b=Object(n.useState)(!1),d=Object(a.a)(b,2),m=d[0],O=d[1],j=function(e){var t=Object.assign({},o);t[e.target.id]=e.target.value,u(t)};return Object(h.jsxs)(i.a,{className:"hatWriteUp",justify:"center",align:"middle",style:{marginTop:"3em"},children:[Object(h.jsx)(s.a,{span:16,offset:4,style:{backgroundColor:"#DDDDDD",borderRadius:"5px",padding:"1em",margin:"2em"},children:Object(h.jsx)(l.a,{onFinish:function(e){r.a.signInWithEmailAndPassword(e.email,e.password).catch((function(e){return alert(e.message)}))},onFinishFailed:function(e){console.log(e)},className:"login-form",children:Object(h.jsxs)(s.a,{xs:{span:20,offset:2},sm:{span:12,offset:6},style:{marginTop:"5em"},children:[Object(h.jsx)(l.a.Item,{label:"Email",name:"email",rules:[{required:!0,message:"Please input your email"}],children:Object(h.jsx)(c.a,{prefix:Object(h.jsx)(v,{}),onChange:j,placeholder:"Email"})}),Object(h.jsx)(l.a.Item,{label:"Password",name:"password",rules:[{required:!0,message:"Please input your password"}],children:Object(h.jsx)(c.a,{prefix:Object(h.jsx)(g,{}),onChange:j,type:"password",placeholder:"Password"})}),Object(h.jsxs)(l.a.Item,{children:[Object(h.jsx)(f.a,{type:"primary",htmlType:"submit",children:"Log in"}),Object(h.jsx)("br",{}),Object(h.jsx)("div",{onClick:function(){return O(!0)},children:"Forgot password"})]})]})})}),Object(h.jsxs)(p.a,{title:"Password Recovery",visible:m,onCancel:function(){return O(!1)},footer:null,children:[Object(h.jsx)("p",{children:"Please enter the email address associated with this account"}),Object(h.jsx)(c.a,{id:"passwordChange",placeholder:"Enter Your Email",type:"email",onChange:j}),Object(h.jsx)("br",{}),Object(h.jsx)("br",{}),Object(h.jsx)(f.a,{onClick:function(){var e=o.passwordChange;r.a.sendPasswordResetEmail(e).then((function(){O(!1),alert("Please check your email for password reset instructions")})).catch((function(t){"auth/user-not-found"===t.code?alert(e+" is not on file"):alert(t.message)}))},children:"Submit"}),Object(h.jsx)(f.a,{onClick:function(){return O(!1)},children:"Close"})]})]})}}}]);
//# sourceMappingURL=24.90ca4cdb.chunk.js.map