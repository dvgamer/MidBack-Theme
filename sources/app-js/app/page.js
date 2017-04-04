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
      expired: MBOS.Expired,
      sign: function() { return (State.URL.path == '/' || /\/SignIn|\/Contact/ig.test(State.URL.path)); },
      administrator: function() { return permission.admin; },
      system: function() { return permission.system; }
    },
    created: function(){
      var vm = this;

      console.log('expired', vm.expired, 'sign', vm.sign);
      vm.$on('init', function(){
        request({ api: true, url: '/api-health/check/' }).then(function(res){
          console.log('init', res);
          if(res.err) { 
            console.warn(cb); 
          } else {
            if(res.data.maintenance) {
              msgbar.maintenace = true;
              msgbar.message = res.data.maintenance;
            }

            if(!res.data.register) {

            } else if(res.data.expired) {
              MBOS.getItem('session.login').then(function(data){
                console.log('session.login', data)
                // if(data) {
                //   Dialog.model({ 
                //     component: 'dialog-relogin', 
                //     data: data, 
                //     onshow: function(){ 
                //       Dialog.$children[0].$refs.txtPassword.focus() 
                //     } 
                //   });
                // } else {
                //   redirect('/');
                // }
              });
            }
          }

        });
      });
      vm.$emit('init');
    }
	});

	return new Vue({ el: '#app' });
}


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

