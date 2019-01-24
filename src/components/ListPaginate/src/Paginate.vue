<script>
	import paginate from 'jw-paginate';

	export default {

		name: 'CtrlListPaginate',

		model: {
			prop: "page",
			event: "update"
		},

		props: {
			page: {
				required: true,
                type: Number
            },
			totalItems: {
				required: true,
				type: Number
            },
            perPage: {
				type: Number,
                default: 10
            },
			maxPages: {
				type: Number,
				default: 8
			}
        },

        computed:{
            paginationLinks(){
				return paginate(this.totalItems, this.page, this.perPage, this.maxPages)
            },
			pageTotal(){
				return Math.ceil(this.totalItems / this.perPage);
			},
        },

        methods:{
			updatePage(number){
				this.$emit("update", number)
            }
        },

		render() {
			return this.$scopedSlots.default({
                // Data props
				page: this.page,
				pageTotal: this.pageTotal,
				paginationLinks: this.paginationLinks,

                // Action props
				paginationBtnEvents: (number) => ({
					click: () => {
						this.updatePage(number)
					}
				}),

				// Binding props
				nextBtnBindings:{
					disabled: (this.loading || this.page === this.pageTotal)
				},
				prevBtnBindings:{
					disabled: (this.loading || this.page === 1)
				},
			})
		}

	}
</script>