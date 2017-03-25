Vue.component('v-model', {
	template: [
		'<div>',
			'<transition name="dialog">',
		    '<div v-if="show" class="modal" tabindex="-1" role="dialog" style="display: block;">',
		      '<div class="modal-dialog" role="document" :style="{ width: width }">',
		      	'<div class="modal-content">',
			        '<div class="modal-header">',
			          '<slot name="header">',
			            '<button type="button" class="close" @click="cancel" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
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
			            '<button v-if="yes" type="button" class="btn" :class="yesClass" v-html="yes" @click="onYes"></button>',
			            '<button v-if="no" type="button" class="btn" :class="noClass" v-html="no" @click="onNo"></button>',
			            '<button v-if="cancel"  type="button" class="btn" :class="cancelClass" v-html="cancel" @click="onCancel" data-dismiss="modal"></button>',
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
		yesClass: {
			type: String,
			default: 'btn-primary'
		},
		noClass: {
			type: String,
			default: 'btn-primary'
		},
		cancelClass: {
			type: String,
			default: 'btn-default'
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
			default: null
		},
		cancel: {
			type: String,
			default: null
		},
		onYes: {
			type: Function,
			default: function(){
				this.show = false;
			}
		},
		onNo: {
			type: Function,
			default: function(){
				this.show = false;
			}
		},
		onCancel: {
			type: Function,
			default: function(){
				this.show = false;
			}
		}
	}
});
