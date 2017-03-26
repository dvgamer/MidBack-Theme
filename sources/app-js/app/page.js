window.Page = function(getComponent) {
  var permission = {
    admin: __.permission === 'ADMIN' || __.permission === 'SYSTEM',
    system: __.permission === 'SYSTEM'
  }

	Vue.component('container', getComponent);
	Vue.component('master', {
	  template: '#master',
	  data: function(){
	  	return {
	      duedate: false,
	      duedate_at: '',
	      maintenace: false,
	      message: '',
	    }
	  },
    components: {
      'v-messages': {
        template: '#template-alert-message',
        props: [ 'duedate','maintenace','message', 'duedate_at' ]
      }
    }
	});

	Vue.component('navigation', {
    template: '#navigation',
    data: function(){
    	return {
        sign: !/\/Contact\-us/g.test(location.href),
        expired: MBOS.Expired(),
	      pathname: location.pathname,
	      projects: 'admin',
	      mainmenu: {
	        logout: false,
	        admin: [ 
	          { id:'dashboard', icon:'', name:'Dashboard', href:'/Administrators/' },
	          { 
	            id:'services', 
	            icon:'',
	            name:'Services', 
	            dropdown: [
	              { id:'customer', icon:'fa-users', name:'Customer', href:'/Administrators/Customer/', 
	                disabled: !permission.system },
	              { id:'document', icon:'fa-file-text-o', name:'Documents', href:'/Administrators/Document/' },
	              { id:'archive', icon:'fa-archive', name:'Archive', href:'/Administrators/Archive/' },
	            ] 
	          },
	          { 
	            id:'setting', 
	            icon:'',
	            name:'Setting', 
	            dropdown: [
	              { id:'config', icon:'fa-cogs', name:'Configuration', href:'/Administrators/Configuration/' },
	              { id:'database', icon:'fa-database', name:'Database', href:'/Administrators/Database/', 
	                disabled: !permission.system },
	            ] 
	          },
	          { id:'tool',  icon:'', name:'Tools',  href:'/Administrators/Tools/' },
	        ],
	        operation: [],
	        account: [],
	      },
	      selected: null,
	      permission: 0,
	      options: ['foo','bar','baz'],
	      company: [],
	      fullname: MBOS.Name(),
	      customercode: MBOS.Code()
	    }
	  },
    methods: {
      filterBy:function(){

      },
      doEvent: function(event){ (this[event] || function(){})(); },
      doLogout: function(){
        var vm = this;
        Dialog.confirm({
          title: 'Confirm Logout',
          className:'btn-danger',
          message: 'Are you sure you want to logout of your account?',
          yes: '<i class="fa fa-sign-out" aria-hidden="true"></i> Yes.', no: 'No, I also work unfinished.',
          submit: function(){
            if(!vm.mainmenu.logout) {
              vm.mainmenu.logout = true;
              var last = vm.pathname;
              vm.pathname = '';
              request({
                url: '/SignIn/',
                data: { event: 'logout' },
                exception: true,
                callback: function(data, cb){
                  if(!cb.exError) {
                    MBOS.setItem('session.permission', {}).then(function(){
                      Storage('Permission', {});
                      redirect('/');
                    });
                  } else {
                    vm.pathname = last;
                    vm.mainmenu.logout = false;
                    console.warn(cb);
                  }
                }
              });
            }
          }
        });


      }
    },
    computed: {
      administrator: function() { return permission.admin; },
      system: function() { return permission.system; }
    },
    created: function(){
      var vm = this;

      vm.$on('init', function(){
        request({
          api: true,
          url: '/api-health/check/',
          callback: function(data, cb){ 
            if(cb.exError) { 
              console.warn(cb); 
            } else {

              // data.maintenance
              if(data.maintenance) {
                msgbar.maintenace = true;
                msgbar.message = data.maintenance;
              }

              if(!data.register) {

              } else if(data.expired) {
                MBOS.getItem('session.login').then(function(data){
                  if(data) {
                    Dialog.model({ 
                      component: 'dialog-relogin', 
                      data: data, 
                      onshow: function(){ 
                        Dialog.$children[0].$refs.txtPassword.focus() 
                      } 
                    });
                  } else {
                    redirect('/');
                  }
                });
              }
            }
          }  
        });
      });
      // vm.$emit('init');
    }
	});




	return new Vue({ el: '#app' });
}


// <body>


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
//               <a href="/Contact-us/") %>">Contact us</a>
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