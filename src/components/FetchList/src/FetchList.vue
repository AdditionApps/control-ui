<script>
    import axios from 'axios';

	export default {

		name: 'CtrlFetchList',

		data() {
			return {
				loading: true,
				items: [],
                totalItems: 0,
                filters: this.defaultFilters
			}
		},

		props: {
			url: {
				required: true,
				type: String,
				default: null
			},
			dataKey:{ // TODO: allow dot notation?
				type: String,
				default: null
			},
            totalHeader:{
				type: String,
				default: null
            },
            totalKey:{
				type: String,
				default: null
            },
			defaultFilters: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},

		computed: {
			resourceUrl() {
				let queryString = Object.keys(this.filters)
					.filter(key => {
						let value = this.filters[key];
                        return (! (
                            value === null || value === undefined || value === ''
                        ));
					})
					.map(key => {
						return `${key}=${this.filters[key]}`;
                    })
					.join('&');

				return `${this.url}?${queryString}`
			}
		},

        methods:{
			getTotalPageCount(headers, data){
				if(this.totalHeader){
					return parseInt(headers[this.totalHeader.toLowerCase()]);
                }
                else if(this.totalKey){
					return parseInt(data[this.totalKey]);
                }
            },
			getResources(){
				this.loading = true;
				axios.get(this.resourceUrl)
					.then(({ headers, data }) => {
						this.totalItems = this.getTotalPageCount(headers, data);
						this.items = (this.dataKey) ? data[this.dataKey] : data;
						this.loading = false;
					});
			},
            updateFilters(filters){
				Object.keys(filters)
                    .forEach(key => this.filters[key] = filters[key]);
			}
        },

		mounted() {
			this.getResources()
		},

        watch:{
			resourceUrl: function(){
				this.getResources()
            }
        },

		render() {
			return this.$scopedSlots.default({
                // Data props
				items: this.items,
				filters: this.filters,
				totalItems: this.totalItems,

                // Action props
				updateFilters: this.updateFilters
			})
		}
	}
</script>