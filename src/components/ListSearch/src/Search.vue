<script>

    import _debounce from 'lodash.debounce';

    const debouncedUpdate = function (e) {
		this.$emit('update', e.target.value)
	}

	export default {

		name: 'CtrlListSearch',

		model: {
			prop: "query",
			event: "update"
		},

        props: {
			query: {
				required: true,
                type: String
            },
            wait: {
				type: Number,
                default: 500
            }
        },

        computed: {
			inputCaptured () {
				return _debounce(debouncedUpdate, this.wait).bind(this);
			}
		},

		render() {
			return this.$scopedSlots.default({
				// Data props
				query: this.query,

				// Action props
				inputCaptured: this.inputCaptured
			})
		}

	}
</script>