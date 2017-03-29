window.getVue.Model = {
	template: [
		'<div>',
			'<transition name="dialog">',
		    '<div v-if="show" class="modal" tabindex="-1" role="dialog" style="display: block;">',
		      '<div class="modal-dialog" role="document" :style="{ width: width }">',
		      	'<div class="modal-content">',
			        '<div class="modal-header">',
			          '<slot name="header">',
			            '<button type="button" class="close" @click="on_no" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
			            '<h4 class="modal-title" v-text="title"></h4>',
			          '</slot>',
			        '</div>',
			        '<div class="modal-body">',
			          '<slot name="body">',
			            '<p v-html="message"></p>',
			          '</slot>',
			        '</div>',
			        '<div class="modal-footer">',
			          '<slot name="footer">',
			            '<button v-if="yes" type="button" class="btn" :class="className" v-html="yes" @click="on_yes"></button>',
			            '<button v-if="no"  type="button" class="btn btn-default" v-html="no" @click="on_no" data-dismiss="modal"></button>',
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
		width: {
			type: String,
			default: null
		},
		title: {
			type: String,
			default: 'Travox Midback Office™'
		},
		className: {
			type: String,
			default: 'btn-primary'
		},
		message: {
			type: String,
			default: 'message'
		},
		yes: {
			type: String,
			default: null
		},
		no: {
			type: String,
			default: 'OK'
		},
		on_yes: {
			type: Function,
			default: function(){
				this.show = false;
			}
		},
		on_no: {
			type: Function,
			default: function(){
				this.show = false;
			}
		}
	}
}