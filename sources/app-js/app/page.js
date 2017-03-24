window.Page = function(getComponent) {
	if (getComponent) Vue.component('panel-component', getComponent);
	Vue.component('master', {
	  template: '#master',
	  data: {

	  },
	  created: function() {
	  	console.log('created master.');
	  }
	});

	return new Vue({
	  el: '#app',
	  data: {

	  },
	  created: function() {
	  	console.log('created app.');
	  }
	});
}


// <body>
//   <!--[if IE]>
//     <script src="<%If(MBOSEngine.UI.VuePage.V2)Then%>/mos_v2/<%Else%>/mos_demo/<%End If%>operation/dist/js/ie-fixed.js"></script>
//   <![endif]-->

//   <!-- Components.-->
//   <script src="<%If(MBOSEngine.UI.VuePage.V2)Then%>/mos_v2/<%Else%>/mos_demo/<%End If%>operation/dist/vendor.min.js"></script>
//   <script src="<%If(MBOSEngine.UI.VuePage.V2)Then%>/mos_v2/<%Else%>/mos_demo/<%End If%>operation/dist/app.min.js"></script>

//   <script type="text/x-template" id="template-nav">
//     <div class="collapse navbar-collapse navbar-right" id="bs-navbar-collapse">
//       <div v-if="sign">
//         <div class="navbar-text" style="color: #828282;margin: 0px;">
//           <div><b>Phone:</b><span style="margin-left: 5px;">+662 674 4555</span></div>
//           <div><b>Fax:</b><span style="margin-left: 20px;">+662 675 4900</span></div>
//           <div><b>Email:</b><span style="margin-left: 7px;"><a href="mailto:sales@ns.co.th">sales@ns.co.th</a></span></div>
//         </div>
//       </div>
//       <div v-else>
//         <button v-on:click="doSignIn" type="button" class="btn btn-lg btn-warning navbar-btn" style="margin:6px 0 0 10px;">Sign-In</button>
//       </div>
//     </div>
//   </script>
//   <script type="text/javascript" language="javascript">

//   $(function(){

//     // VueJs Main DOM.
//     var menu = new Vue({
//       el: '.app-menu',
//       components: {
//         'nav-menu': {
//           template: '#template-nav',
//           data: function() {
//             return {
//               sign: !/\/Contact\-us/g.test(location.href)
//             }
//           },
//           methods: {
//             doSignIn : function(e){ redirect('/SignIn'); }
//           }
//         }
//       }
//     });

//     window.Exception = new Vue({
//       el: '#component-exception',
//       data: {
//         exError: false,
//         exTitle: 'System Exception',
//         exMessage: 'crystalreport file lost.',
//         exFooter: 'Please contact <a href="mailto:teamproject@ns.co.th">Travox Midback Office™ TEAM</a> .',
//         options: { request: {}, response: {} },
//         btnReload: 'Try again!',
//         btnReport: 'Report'
//       },
//       methods: {
//         doReload: function(e){
//           e.preventDefault();
//           location.reload();
//         },
//         doReport: function(e){
//           e.preventDefault();
//           console.log('request', window.Exception.options.request)
//           console.log('response', window.Exception.options.response)
//         }
//       }
//     });

//   });


//     // Vue.component('nav-menu', {
//     //   template: '#template-nav',
//     //   data: function() {
//     //     return {
//     //       sign: !/\/Contact\-us/g.test(location.href)
//     //     }
//     //   },
//     //   methods: {
//     //     doContact: function(e){ redirect('/Contact-us'); },
//     //     doSignIn : function(e){ redirect('/SignIn'); }
//     //   }
//     // });

//     // var socket = io('http://db.touno-k.com:8220/');
//     // socket.on('connect', function(){ console.log('connect'); });
//     // socket.on('disconnect', function(){ console.log('disconnect');});
//   </script>
   
//   <div class="container">
//     <div class="app-menu row" style="margin-top: 32px;">
//       <div class="col-md-36">
//         <nav  class="navbar navbar-travox" role="navigation">
//           <div class="container-fluid">
//             <div class="navbar-header">
//               <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-navbar-collapse">
//                 <span class="sr-only">Toggle navigation</span>
//                 <span class="icon-bar"></span>
//                 <span class="icon-bar"></span>
//                 <span class="icon-bar"></span>
//               </button>
//               <a class="navbar-brand logo travox" style="margin-left: 16px;" href="/mos_demo/operation/"></a>
//             </div>  
//             <nav-menu></nav-menu>
//           </div>
//         </nav>
//       </div>
//     </div>
//     <div class="row">
//       <div class= "col-md-36">
//         <hr class="dashed" style="margin: 15px 0 10px 0">
//       </div>
//     </div>
//     <asp:contentplaceholder id="PageView" runat="server"></asp:contentplaceholder>
//     <div class="row">
//       <div class= "col-md-36">
//         <hr class="dashed" style="margin: 35px 0 15px 0">
//       </div>
//     </div> 
//     <div class="row">
//       <div class= "col-md-36">
//       <div class="text-center mos-footer">
//           <p>
//           <div>
//             <b>
//               <a href="http://mbos.travox.co.th/">MBOS</a> |
//               <a href="<%=MBOSEngine.MBOS.URL("Contact-us/") %>">Contact us</a>
//             </b>
//           </div>
//             Travox is a registered trademark of <a href="http://ns.co.th/">Nippon Sysits Co.,Ltd</a><br>
//             <b>Copyright 2009 <i class="fa fa-copyright" aria-hidden="true"></i> Nippon Sysits Co.,Ltd</b>
//           </p>
//       </div>
//       </div>
//     </div>
//   </div>
//   <!-- Throws Exception in Request response. -->
//   <div id="component-exception">
//     <div v-bind:class="['exception', { 'hidden': !exError }]">
//       <div class="throw overlay"></div>
//       <div class="throw model">
//         <div class="container">
//           <div class="row">
//             <div class="col-md-offset-9 col-md-18 title-bar">
//               <h4 v-html="exTitle"></h4>
//               <div class="message">
//                 <p class="ex-text" v-html="exMessage"></p>
//                 <p class="ex-status" v-html="exFooter"></p>
//               </div>
//               <p>
//                 <a v-on:click="doReload" v-bind:class="['btn','btn-link']" href="#" v-html="btnReload"></a>
//                 <a v-on:click="doReport" v-bind:class="['btn','btn-danger']" href="#" v-html="btnReport"></a> 
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// </body>
// </html>