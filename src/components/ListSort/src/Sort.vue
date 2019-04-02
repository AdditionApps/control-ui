<script>

	export default {

		name: 'CtrlListSort',

		data() {
			return {
				direction: null
            }
		},

		props: {
			sortAttribute: {
				required: true
            },
			sortingBy: {
				required: true
            },
			asc: {
				required: false,
                default: 'asc'
            },
            desc: {
				required: false,
                default: 'desc'
            }
        },

		computed: {
			isActive(){
				return (this.sortAttribute === this.sortingBy)
                    && this.direction !== null;
            },
            isAscending(){
				return this.direction === this.asc;
            },
			isDescending(){
				return this.direction === this.desc;
			},
			nextDirection(){
				switch(this.direction){
					case this.asc :
						return this.desc;
					case this.desc :
						return null;
					case null :
						return this.asc;
					default:
						return null;
				}
			}
        },

        watch:{
			sortingBy: function(){
				this.direction = null
            }
        },

		methods: {
			setSorting(){
				this.$emit('update-attribute', this.sortAttribute);
				this.$emit('update-direction', this.nextDirection);
				this.$nextTick(() => {
					this.direction = this.nextDirection;
				});
			},
			setSortAttribute(){
				this.$emit('update-attribute', this.sortAttribute);
			},
			setSortDirection(){
				this.$emit('update-direction', this.nextDirection);
				this.$nextTick(() => {
					this.direction = this.nextDirection;
				});
			},
        },

		render() {
			return this.$scopedSlots.default({
				// Data props
				isActive: this.isActive,
				direction: this.direction,
                isAscending: this.isAscending,
                isDescending: this.isDescending,

				// Action props
				setSorting: this.setSorting,
				setSortAttribute: this.setSortAttribute,
				setSortDirection: this.setSortDirection
			})
		}

	}
</script>