<script>
	import _get from 'lodash.get';
    import axios from 'axios';

	export default {

		name: 'CtrlFetchList',

		data() {
			return {
				loading: true,
				items: [],
                totalItems: 0,
                params: this.defaultParams
			}
		},

		props: {
			url: {
				required: true,
				type: String,
				default: null
			},
			dataKey:{
				type: String,
				default: null
			},
			searchQueryKey:{
				type: String,
				default: 'q'
			},
			pageKey:{
				type: String,
				default: 'page'
			},
			perPageKey:{
				type: String,
				default: 'per_page'
			},
			sortByKey:{
				type: String,
				default: 'sort_by'
			},
			sortDirectionKey:{
				type: String,
				default: 'sort_direction'
			},
            totalHeader:{
				type: String,
				default: null
            },
            totalKey:{
				type: String,
				default: null
            },
			defaultParams: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},

		computed: {
			resourceUrl() {
				let queryString = Object.keys(this.params)
					.filter(key => {
						let value = this.params[key];
                        return (! (
                            value === null || value === undefined || value === ''
                        ));
					})
					.map(key => {
						return `${key}=${this.params[key]}`;
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
					return parseInt(_get(data, this.totalKey));
                }
            },
			getResources(){
				this.loading = true;
				axios.get(this.resourceUrl)
					.then(({ headers, data }) => {
						this.totalItems = this.getTotalPageCount(headers, data);
						this.items = (this.dataKey) ? _get(data, this.dataKey) : data;
						this.loading = false;
						this.$emit('resources-updated');
					});
			},
			updateSearchQuery(query){
				this.$set(this.params, this.pageKey, 1);
				this.$set(this.params, this.searchQueryKey, query);
			},
			updateSortBy(attribute){
				this.$set(this.params, this.sortByKey, attribute);
			},
			updateSortDirection(direction){
				this.$set(this.params, this.sortDirectionKey, direction);
			},
			updateSortAttribute(attribute){
				this.$set(this.params, this.sortByKey, attribute);
			},
			updatePage(number){
				this.$set(this.params, this.pageKey, number);
			},
			updatePerPage(number){
				this.$set(this.params, this.pageKey, 1);
				this.$set(this.params, this.perPageKey, parseInt(number));
			},
			updateFilters(...filters){
				filters.forEach(filter => {
					Object.keys(filter).forEach(key => {
						let value = (Array.isArray(filter[key]))
							? filter[key].join()
							: filter[key];
						this.$set(this.params, key, value);
					});
				})
			}
		},

		mounted() {
			this.getResources();
		},

        watch:{
			resourceUrl: function(){
				this.getResources();
            }
        },

		render() {
			return this.$scopedSlots.default({

                // Data props
				items: this.items,
				params: this.params,
				totalItems: this.totalItems,
				page: this.params[this.pageKey] || 1,
				perPage: this.params[this.perPageKey] || 10,
				sortBy: this.params[this.sortByKey] || null,
				searchQuery: this.params[this.searchQueryKey] || '',

				// Binding props
				paginationProps: {
					page: this.params[this.pageKey] || 1,
					perPage: this.params[this.perPageKey] || 10,
					totalItems: this.totalItems,
				},

                // Action props
				updateSearchQuery: this.updateSearchQuery,
				updatePerPage: this.updatePerPage,
				updatePage: this.updatePage,
				updateSortBy: this.updateSortBy,
				updateSortDirection: this.updateSortDirection,

				sortingEvents: {
					'update-attribute' :  this.updateSortBy,
					'update-direction' :  this.updateSortDirection
				}

			})
		}
	}
</script>