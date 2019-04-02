<script>
	import Fuse from 'fuse.js';
    import _cloneDeep from 'lodash.clonedeep';

	export default {

		name: 'CtrlDataList',

		data() {
			return {
				loading: true,
				page: this.defaultPage,
				perPage: this.defaultPerPage,
				sortBy: this.defaultSortBy,
				sortDirection: this.defaultSortDirection,
				searchQuery: '',
                filters: [],
                fuse: null
			}
		},

		props: {
			allItems: {
				required: true,
				type: Array
			},
			defaultPage: {
				type: Number,
				default: 1
			},
			defaultPerPage:{
				type: Number,
				default: 10
			},
			defaultSortBy: {
				type: String,
				default: null
			},
			defaultSortDirection: {
				type: String,
				default: null
			},
			asc: {
                default: 'asc'
            },
            desc: {
                default: 'desc'
            },
			searchKeys:{
				type: Array,
				default: () => {
					return []
				}
			},
			searchConfig:{
				type: Object,
				default: () => {
					return {}
				},
				validator: function (value) {
					if(Object.keys(value).length){
						return value.hasOwnProperty('keys');
					}
					return true
				}
			}
		},

		computed:{
			searchOptions(){
				if(Object.keys(this.searchConfig).length){
					return this.searchConfig
				}
				if(this.searchKeys.length){
					return {
						shouldSort: true,
						tokenize: true,
						matchAllTokens: true,
						threshold: 0.6,
						location: 0,
						distance: 100,
						maxPatternLength: 32,
						minMatchCharLength: 1,
						keys: this.searchKeys
					}
				}
				return {};
			},
			implementSearch(){
				return !! Object.keys(this.searchOptions).length
			},
			cloneItems(){
				return _cloneDeep(this.allItems);
			},
			searchedItems(){
				if(this.implementSearch && this.searchQuery){
					return new Fuse(this.cloneItems, this.searchOptions).search(this.searchQuery);
				}

				return this.cloneItems;
			},
			totalItems(){
				return this.searchedItems.length;
			},
			sortedItems(){
				if(! this.sortBy){
					return this.searchedItems;
				}
					
				let items = (this.searchedItems.every(item => isNaN(item[this.sortBy])))
					? this._sortAlphabetical()
					: this._sortNumerical();
					
				if(this.sortDirection === this.desc){
					return items = items.reverse();
				}

				return items;
			},
			paginatedItems(){
				return this.sortedItems.slice(this.sliceStart, this.sliceEnd);
			},
			sliceStart(){
				return (this.page * this.perPage) - this.perPage;
			},
			sliceEnd(){
				return (this.page * this.perPage);
			}
		},

		methods:{
			updateSearchQuery(query){
				this.page = 1;
				this.searchQuery = query;
			},
			updatePage(page){
				this.page = page;
			},
			updatePerPage(number){
				this.perPage = number;
			},
			updateSortBy(attribute){
				this.sortBy = attribute;
			},
			updateSortDirection(direction){
				this.sortDirection = direction;
			},
			updateFilters(){
				if(this.implementSearch){
					this.fuse = new Fuse(this.allItems, this.searchOptions);
				}
			},
			_sortNumerical(){
				return this.searchedItems.sort((a, b) => {
					return a[this.sortBy] - b[this.sortBy];
				});
			},
			_sortAlphabetical(){
				return this.searchedItems.sort((a, b) => {
					return a[this.sortBy].localeCompare(b[this.sortBy]);
				});
			}
		},

		mounted(){
			if(this.implementSearch){
				this.fuse = new Fuse(this.allItems, this.searchOptions);
			}
		},

		render() {
			return this.$scopedSlots.default({
				// Data props
				items: this.paginatedItems,
				allItems: this.allItems,
				totalItems: this.totalItems,
				page: this.page,
				perPage: this.perPage,
				sortBy: this.sortBy,
				searchQuery: this.searchQuery,

				// Binding props
				paginationProps: {
					page: this.page,
					perPage: this.perPage,
					totalItems: this.totalItems,
				},

                // Action props
                updateSearchQuery: this.updateSearchQuery,
                updatePerPage: this.updatePerPage,
                updatePage: this.updatePage,
				updateSortBy: this.updateSortBy,
				updateSortDirection: this.updateSortDirection,

				sortingEvents:{
					'update-attribute' :  this.updateSortBy,
					'update-direction' :  this.updateSortDirection
				}

			})
		}
	}
</script>