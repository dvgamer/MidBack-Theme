/*!
 * vue-html-editor v1.0.0
 * (c) 2016 Haixing Hu
 * Released under the MIT License.
 */
;(function () {

  var vEditor = {
	  replace: true,
	  inherit: false,
	  template: "<textarea class='form-control' :tabindex='tabindex' :name='name'></textarea>",
	  props: {
	    html: {
	      required: true
	    },
	    language: {
	      type: String,
	      required: false,
	      default: "en-US"
	    },
	    height: {
	      type: Number,
	      required: false,
	      default: 160
	    },
	    minHeight: {
	      type: Number,
	      required: false,
	      default: 160
	    },
	    maxHeight: {
	      type: Number,
	      required: false,
	      default: 800
	    },
	    name: {
	      type: String,
	      required: false,
	      default: ""
	    },
	    tabindex: {
	      type: Number,
	      required: false,
	      default: 0
	    },
	    toolbar: {
	      type: Array,
	      required: false,
	      default: function() {
	        return [
	          ["font", ["bold", "italic", "underline", "clear"]],
	          ["fontsize", ["fontsize"]],
	          ["para", ["ul", "ol", "paragraph"]],
	          ["color", ["color"]],
	          ["insert", ["link", "picture", "hr"]]
	        ];
	      }
	    }
	  },
	  beforeCreate: function() {
	    this.isChanging = false;
	    this.control = null;
	  },
	  mounted: function() {
	    //  initialize the summernote
	    if (this.minHeight > this.height) {
	      this.minHeight = this.height;
	    }
	    if (this.maxHeight < this.height) {
	      this.maxHeight = this.height;
	    }
	    var me = this;
	    this.control = $(this.$el);
	    this.control.summernote({
	      lang: this.language,
	      height: this.height,
	      minHeight: this.minHeight,
	      maxHeight: this.maxHeight,
	      toolbar: this.toolbar,
	      callbacks: {
	        onInit: function() {
	          me.control.summernote("code", me.html);
	        }
	      }
	    }).on("summernote.change", function(e) {
	      // Note that we do not use the "onChange" options of the summernote
	      // constructor. Instead, we use a event handler of "summernote.change"
	      // event because that I don't know how to trigger the "onChange" event
	      // handler after changing the code of summernote via ".summernote('code')" function.
	      if (! this.isChanging) {
	        this.isChanging = true;
	        var code = this.control.summernote("code");
	        this.html = (code === null || code.length === 0 ? null : code);
	        this.$parent.html = this.html;
	        this.$nextTick(function () {
	          this.isChanging = false;
	        });
	      }
	    }.bind(this));
	  },
	  watch: {
	    "code": function (val, oldVal) {
	      if (! this.isChanging) {
	        this.isChanging = true;
	        var code = (val === null ? "" : val);
	        this.$parent.html = code;
	        this.control.summernote("code", code);
	        this.isChanging = false;
	      }
	    }
	  }
	}

  if (window.Vue) {
    window.vEditor = vEditor
    // Vue.use(vEditor)
  }

})()