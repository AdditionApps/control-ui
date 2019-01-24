<script>

    import { debounce } from 'lodash';

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
            debounce: {
				type: Number,
                default: 500
            }
        },

		methods: {
			updateQuery: debounce((e) => {
				this.$emit('update', e.target.value)
			}, this.debounce)
        },

		render() {
			return this.$scopedSlots.default({
				// Data props
				query: this.query,

				// Action props
				updateQuery: this.updateQuery
			})
		}

	}
</script>