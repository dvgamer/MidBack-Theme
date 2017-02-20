window.getVue.Model = {
	template: [
		'<div>',
			'<transition name="dialog">',
		    '<div v-if="show" class="modal" tabindex="-1" role="dialog" style="display: block;">',
		      '<div class="modal-dialog" role="document">',
		      	'<div class="modal-content">',
			        '<div class="modal-header">',
			          '<slot name="header">',
			            '<button type="button" class="close" v-on:click="show = false" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
			            '<h4 class="modal-title">Travox Midback Office™</h4>',
			          '</slot>',
			        '</div>',
			        '<div class="modal-body">',
			          '<slot name="body">',
			            '<p v-text="Message"></p>',
			          '</slot>',
			        '</div>',
			        '<div class="modal-footer">',
			          '<slot name="footer">',
			            // '<button type="button" class="btn btn-primary" v-html="Yes" v-on:click="$emit(\'show\')"></button>',
			            '<button type="button" class="btn btn-default" v-text="No" v-on:click="$emit(\'hide\')" data-dismiss="modal"></button>',
			          '</slot>',
			        '</div>',
		        '</div>',
		      '</div>',
		    '</div>',
			'</transition>',
			'<transition name="dialog">',
	    	'<div v-if="show" class="modal-backdrop in"></div>',
			'</transition>',
  	'</div>',
	].join(' '),
	props:{
		show: {
			type: Boolean,
			default: false
		},
		Message: {
			type: String,
			default: 'Message'
		},
		Yes: {
			type: String,
			default: 'OK'
		},
		No: {
			type: String,
			default: 'OK'
		},
	},
	data: function() {
		return {}
	},
	watch: { },
	methods: { 
		alert: function(){
			this.show = !this.show;
		}
	},
	created: function(){
		var vm = this;
		vm.$on('show', function(){

		});
		vm.$on('hide', function(){
			vm.show = false;
		});
	}
}