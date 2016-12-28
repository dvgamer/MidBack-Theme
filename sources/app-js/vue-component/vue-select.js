window.getVue.Select = {
	template: ['<div class="dropdown v-select" :class="dropdownClasses">',
			'<div ref="toggle" @mousedown.prevent="toggleDropdown" class="dropdown-toggle clearfix" type="button">',
	        '<span class="form-control" v-if="!searchable && isValueEmpty">',
	          '{{ placeholder }}',
	        '</span>',
	        '<span class="selected-tag" v-for="option in valueAsArray" track-by="1">',
	          '{{ getOptionLabel(option) }}',
	          '<button v-if="multiple" @click="select(option)" type="button" class="close">',
	            '<span aria-hidden="true">&times;</span>',
	          '</button>',
	        '</span>',
				'<input',
								'ref="search"',
								// ':debounce="debounce"',
								'v-model="search"',
								'v-show="searchable"',
								'@keydown.delete="maybeDeleteValue"',
								'@keyup.esc="onEscape"',
								'@keydown.up.prevent="typeAheadUp"',
								'@keydown.down.prevent="typeAheadDown"',
								'@keyup.enter.prevent="typeAheadSelect"',
								'@blur="open = false"',
								'@focus="open = true"',
								'type="search"',
								'class="form-control"',
								':placeholder="searchPlaceholder"',
								':style="{ width: isValueEmpty ? \'100%\' : \'auto\' }"',
				'>',
				'<i ref="openIndicator" role="presentation" class="open-indicator"></i>',
				// '<slot name="spinner">',
				// 	'<div class="spinner" v-show="loading">Loading...</div>',
				// '</slot>',
			'</div>',
			'<ul ref="dropdownMenu" v-show="open" :transition="transition" class="dropdown-menu" :style="{ \'max-height\': maxHeight }">',
				'<li v-for="option in filteredOptions" track-by="1" :class="{ active: isOptionSelected(option), highlight: 1 === typeAheadPointer }" @mouseover="typeAheadPointer = 1">',
					'<a @mousedown.prevent="select(option)">',
						'{{ getOptionLabel(option) }}',
					'</a>',
				'</li>',
				'<li transition="fade" v-if="!filteredOptions.length" class="divider"></li>',
				'<li transition="fade" v-if="!filteredOptions.length" class="text-center">',
					'<slot name="no-options">Sorry, no matching options.</slot>',
				'</li>',
			'</ul>',
	'</div>'].join(' '),
		mixins: [{
  watch: {
    typeAheadPointer:function() {
      this.maybeAdjustScroll()
    }
  },

  methods: {
    /**
     * Adjust the scroll position of the dropdown list
     * if the current pointer is outside of the
     * overflow bounds.
     * @returns {*}
     */
    maybeAdjustScroll:function() {
      var pixelsToPointerTop = this.pixelsToPointerTop()
      var pixelsToPointerBottom = this.pixelsToPointerBottom()

      if ( pixelsToPointerTop <= this.viewport().top) {
        return this.scrollTo( pixelsToPointerTop )
      } else if (pixelsToPointerBottom >= this.viewport().bottom) {
        return this.scrollTo( this.viewport().top + this.pointerHeight() )
      }
    },

    /**
     * The distance in pixels from the top of the dropdown
     * list to the top of the current pointer element.
     * @returns {number}
     */
    pixelsToPointerTop:function() {
      var pixelsToPointerTop = 0
      for (var i = 0; i < this.typeAheadPointer; i++) {
        pixelsToPointerTop += this.$refs.dropdownMenu.children[i].offsetHeight
      }
      return pixelsToPointerTop
    },

    /**
     * The distance in pixels from the top of the dropdown
     * list to the bottom of the current pointer element.
     * @returns {*}
     */
    pixelsToPointerBottom:function() {
      return this.pixelsToPointerTop() + this.pointerHeight()
    },

    /**
     * The offsetHeight of the current pointer element.
     * @returns {number}
     */
    pointerHeight:function() {
      var element = this.$refs.dropdownMenu.children[this.typeAheadPointer]
      return element ? element.offsetHeight : 0
    },

    /**
     * The currently viewable portion of the dropdownMenu.
     * @returns {{top: (string|*|number), bottom: *}}
     */
    viewport:function() {
      return {
        top: this.$refs.dropdownMenu.scrollTop,
        bottom: this.$refs.dropdownMenu.offsetHeight + this.$refs.dropdownMenu.scrollTop
      }
    },

    /**
     * Scroll the dropdownMenu to a given position.
     * @param position
     * @returns {*}
     */
    scrollTo:function(position) {
      return this.$refs.dropdownMenu.scrollTop = position
    },
  }
},{
  data: function() {
    return {
      typeAheadPointer: -1
    }
  },

  watch: {
    filteredOptions: function() {
      this.typeAheadPointer = 0
    }
  },

  methods: {
    /**
     * Move the typeAheadPointer visually up the list by
     * subtracting the current index by one.
     * @return {void}
     */
    typeAheadUp: function() {
      if (this.typeAheadPointer > 0) {
        this.typeAheadPointer--
        if( this.maybeAdjustScroll ) {
          this.maybeAdjustScroll()
        }
      }
    },

    /**
     * Move the typeAheadPointer visually down the list by
     * adding the current index by one.
     * @return {void}
     */
    typeAheadDown: function() {
      if (this.typeAheadPointer < this.filteredOptions.length - 1) {
        this.typeAheadPointer++
        if( this.maybeAdjustScroll ) {
          this.maybeAdjustScroll()
        }
      }
    },

    /**
     * Select the option at the current typeAheadPointer position.
     * Optionally clear the search input on selection.
     * @return {void}
     */
    typeAheadSelect: function() {
      if( this.filteredOptions[ this.typeAheadPointer ] ) {
        this.select( this.filteredOptions[ this.typeAheadPointer ] );
      } else if (this.taggable && this.search.length){
        this.select(this.search)
      }

      if( this.clearSearchOnSelect ) {
        this.search = "";
      }
    },
  }
}],
		props: {
			/**
			 * Contains the currently selected value. Very similar to a
			 * `value` attribute on an <input>. In most cases, you'll want
			 * to set this as a two-way binding, using :value.sync. However,
			 * this will not work with Vuex, in which case you'll need to use
			 * the onChange callback property.
			 * @type {Object||String||null}
			 */
			value: {
				default: null
			},

			/**
			 * An array of strings or objects to be used as dropdown choices.
			 * If you are using an array of objects, vue-select will look for
			 * a `label` key (ex. [{label: 'This is Foo', value: 'foo'}]). A
			 * custom label key can be set with the `label` prop.
			 * @type {Object}
			 */
			options: {
				type: Array,
				default: function() {
					return []
				},
			},

			/**
			 * Sets the max-height property on the dropdown list.
			 * @deprecated
			 * @type {String}
			 */
			maxHeight: {
				type: String,
				default: '400px'
			},

			/**
			 * Enable/disable filtering the options.
			 * @type {Boolean}
			 */
			searchable: {
				type: Boolean,
				default: true
			},

			/**
			 * Equivalent to the `multiple` attribute on a `<select>` input.
			 * @type {Object}
			 */
			multiple: {
				type: Boolean,
				default: false
			},

			/**
			 * Equivalent to the `placeholder` attribute on an `<input>`.
			 * @type {Object}
			 */
			placeholder: {
				type: String,
				default: ''
			},

			/**
			 * Sets a Vue transition property on the `.dropdown-menu`. vue-select
			 * does not include CSS for transitions, you'll need to add them yourself.
			 * @type {String}
			 */
			transition: {
				type: String,
				default: 'expand'
			},

			/**
			 * Enables/disables clearing the search text when an option is selected.
			 * @type {Boolean}
			 */
			clearSearchOnSelect: {
				type: Boolean,
				default: true
			},

			/**
			 * Tells vue-select what key to use when generating option
			 * labels when each `option` is an object.
			 * @type {String}
			 */
			label: {
				type: String,
				default: 'label'
			},

			/**
			 * Callback to generate the label text. If {option}
			 * is an object, returns option[this.label] by default.
			 * @param  {Object || String} option
			 * @return {String}
			 */
			getOptionLabel: {
				type: Function,
				default:function(option) {
					if (typeof option === 'object') {
						if (this.label && option[this.label]) {
							return option[this.label]
						}
					}
					return option;
				}
			},

			/**
			 * An optional callback function that is called each time the selected
			 * value(s) change. When integrating with Vuex, use this callback to trigger
			 * an action, rather than using :value.sync to retreive the selected value.
			 * @type {Function}
			 * @default {null}
			 */
			onChange: Function,

			/**
			 * Enable/disable creating options from searchInput.
			 * @type {Boolean}
			 */
			taggable: {
				type: Boolean,
				default: false
			},


			disabled: {
				type: Boolean,
				default: false
			},

			/**
			 * When true, newly created tags will be added to
			 * the options list.
			 * @type {Boolean}
			 */
			pushTags: {
				type: Boolean,
				default: false
			},

			/**
			 * User defined function for adding Options
			 * @type {Function}
			 */
			createOption: {
				type: Function,
				default: function (newOption) {
					if (typeof this.options[0] === 'object') {
						return this.label? [this.label]: newOption;
					}
					return newOption
				}
			},

			/**
			 * When false, updating the options will not reset the select value
			 * @type {Boolean}
			 */
			resetOnOptionsChange: {
				type: Boolean,
				default: false
			},
		},

		data: function() {
			return {
				search: '',
				open: false
			}
		},

		watch: {
			value:function(val, old) {
				if (this.multiple) {
					this.onChange ? this.onChange(val) : null
				} else {
					this.onChange && val !== old ? this.onChange(val) : null
				}
			},
			options: function() {
				if (!this.taggable && this.resetOnOptionsChange) {
					this.$set('value', this.multiple ? [] : null)
				}
			},
			multiple: function(val) {
				this.$set('value', val ? [] : null)
			}
		},

		methods: {

			/**
			 * Select a given option.
			 * @param  {Object||String} option
			 * @return {void}
			 */
			select:function(option) {
				if (this.isOptionSelected(option) && this.searchable) {
					this.deselect(option)
				} else {
					if (this.taggable && !this.optionExists(option)) {
						option = this.createOption(option)

						if (this.pushTags) {
							this.options.push(option)
						}
					}

					if (this.multiple) {
						if (!this.value) {
							this.$set('value', [option])
						} else {
							this.value.push(option)
						}
					} else {
						this.value = option
					}
				}

				this.onAfterSelect(option)
			},

			/**
			 * De-select a given option.
			 * @param  {Object||String} option
			 * @return {void}
			 */
			deselect:function(option) {
				if (this.multiple) {
					var ref = -1
					this.value.forEach(function(val) {
						if (val === option || typeof val === 'object' && val[this.label] === option[this.label]) {
							ref = val
						}
					})
					this.value.$remove(ref)
				} else {
					this.value = null
				}
			},

			/**
			 * Called from this.select after each selection.
			 * @param  {Object||String} option
			 * @return {void}
			 */
			onAfterSelect:function(option) {
				if (!this.multiple) {
					this.open = !this.open
					this.$refs.search.blur()
				}

				if (this.clearSearchOnSelect) {
					this.search = ''
				}
			},

			/**
			 * Toggle the visibility of the dropdown menu.
			 * @param  {Event} e
			 * @return {void}
			 */
			toggleDropdown:function(e) {
				// console.log(e.target);
				// if (e.target === this.$refs.openIndicator || e.target === this.$refs.search || e.target === this.$refs.toggle || e.target === this.$el) {
					if (this.open) {
						this.$refs.search.blur() // dropdown will close on blur
					} else {
						this.open = true
						this.$refs.search.focus()
					}
				// }
			},

			/**
			 * Check if the given option is currently selected.
			 * @param  {Object||String}  option
			 * @return {Boolean}         True when selected || False otherwise
			 */
			isOptionSelected:function(option) {
				if (this.multiple && this.value) {
					var selected = false
					this.value.forEach(function(opt) {
						if (typeof opt === 'object' && opt[this.label] === option[this.label]) {
							selected = true
						} else if (opt === option) {
							selected = true
						}
					})
					return selected
				}

				return this.value === option
			},

			/**
			 * If there is any text in the search input, remove it.
			 * Otherwise, blur the search input to close the dropdown.
			 * @return {[type]} [description]
			 */
			onEscape: function() {
				if (!this.search.length) {
					this.$refs.search.blur()
				} else {
					this.search = ''
				}
			},

			/**
			 * Delete the value on Delete keypress when there is no
			 * text in the search input, & there's tags to delete
			 * @return {this.value}
			 */
			maybeDeleteValue: function() {
				if (!this.$refs.search.value.length && this.value) {
					return this.multiple ? this.value.pop() : this.$set('value', null)
				}
			},

			/**
			 * Determine if an option exists
			 * within this.options array.
			 *
			 * @param  {Object || String} option
			 * @return {boolean}
			 */
			optionExists:function(option) {
				var exists = false

				this.options.forEach(function(opt) {
					if (typeof opt === 'object' && opt[this.label] === option) {
						exists = true
					} else if (opt === option) {
						exists = true
					}
				})

				return exists
			}
		},

		computed: {

			/**
			 * Classes to be output on .dropdown
			 * @return {Object}
			 */
			dropdownClasses: function() {
				return {
					open: this.open,
					searchable: this.searchable,
					loading: this.loading,
					disabled: this.disabled
				}
			},

			/**
			 * Return the placeholder string if it's set
			 * & there is no value selected.
			 * @return {String} Placeholder text
			 */
			searchPlaceholder: function() {
				if (this.isValueEmpty && this.placeholder) {
					return this.placeholder;
				}
			},

			/**
			 * The currently displayed options, filtered
			 * by the search elements value. If tagging
			 * true, the search text will be prepended
			 * if it doesn't already exist.
			 *
			 * @return {array}
			 */
			filteredOptions: function() {
				//
				var options = (function(options, search){
					return options;
				})(this.options, this.search);

				if (this.taggable && this.search.length && !this.optionExists(this.search)) {
					this.options.unshift(this.search)
				}
				return this.options
			},

			/**
			 * Check if there aren't any options selected.
			 * @return {Boolean}
			 */
			isValueEmpty: function() {
				if (this.value) {
					if (typeof this.value === 'object') {
						return !Object.keys(this.value).length
					}
					return !this.value.length
				}

				return true;
			},

			/**
			 * Return the current value in array format.
			 * @return {Array}
			 */
			valueAsArray: function() {
				if (this.multiple) {
					return this.value
				} else if (this.value) {
					return [this.value]
				}

				return []
			}
		}

	}