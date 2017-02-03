window.getVue.Model = {
	template: [
		'<div>',
			'<transition name="modal">',
		    '<div v-if="show" class="modal confirm-dialog" tabindex="-1" role="dialog" style="display: block; padding-right: 17px;">',
		      '<div class="modal-dialog" role="document">',
		      	'<div class="modal-content">',
			        '<div class="modal-header">',
			          '<slot name="header">',
			            '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
			            '<h4 class="modal-title"></h4>',
			          '</slot>',
			        '</div>',
			        '<div class="modal-body">',
			          '<slot name="body">',
			            '<p v-text="Message"></p>',
			          '</slot>',
			        '</div>',
			        '<div class="modal-footer">',
			          '<slot name="footer">',
			            '<button type="button" class="btn btn-primary" v-html="Yes" v-on:click="$emit(\'submit\')"></button>',
			            '<button type="button" class="btn btn-default" v-text="No" v-on:click="$emit(\'close\')" data-dismiss="modal"></button>',
			          '</slot>',
			        '</div>',
		        '</div>',
		      '</div>',
		    '</div>',
				'</transition>',
	    '<div v-if="show" class="modal-backdrop fade in"></div>',
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
			default: 'Cancel'
		},
	},
	data: function() {
		return {}
	},
	watch: { },
	methods: { }
}