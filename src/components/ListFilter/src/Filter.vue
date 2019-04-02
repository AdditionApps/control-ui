<script>

	export default {

		name: 'CtrlListFilter',

		props: {
			value: {
				required: true,
			}
        },

        methods:{
			filterUpdated(value){
				this.$emit("update", value)
            }
        },

		render() {
			return this.$scopedSlots.default({
                // Data props
				value: this.value,

				filterProps: {
					value: this.value
				},

                // Action props
				filterUpdated: this.filterUpdated,

                filterEvents: {
					input: (e) =>  {
						this.filterUpdated(e.target.value)
					}
                }
			})
		}

	}
</script>