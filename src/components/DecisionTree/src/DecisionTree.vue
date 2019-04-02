<script>
	export default {

		name: 'CtrlDecisionTree',

		data() {
			return {
				pathIds: []
			};
		},

		props: {
			choices: {
				required: true
			}
		},

		computed: {
			ancestors() {
				if (this.pathIds.length) {
					return this.pathIds.reduce((ancestors, id) => {
                        // for each path id, get the choice for that ID from the
                        // parent in the previous iteration and push it into the
                        // ancestors array
                        ancestors.push(this.getChild(ancestors.slice(-1)[0], id));
                        return ancestors;
                    }, [this.choices]);
				}
				return null;
			},
			currentChoice() {
				let choice = this.ancestors ? this.ancestors.slice(-1)[0] : null;
				this.$emit('choice-updated', choice);
				return choice;
			},
			availableChoices() {
				if (this.currentChoice) {
					return "children" in this.currentChoice
						? this.currentChoice.children
						: [];
				}
				return this.choices;
			},
			hasAvailableChoices() {
				return !!this.availableChoices.length;
			}
		},

		methods: {
			selectChoice(id) {
				this.pathIds.push(id);
			},
			goBack() {
				this.pathIds.pop();
			},
			getChild(parent, id) {
				// Find given child in sub parent
				if ("children" in parent) {
					return parent.children.find(child => child.id === id);
				}
				// Find given child in top level choices
				return parent.find(child => child.id === id);
			}
		},

		render() {
			return this.$scopedSlots.default({
				// Data props
				availableChoices: this.availableChoices,
				hasAvailableChoices: this.hasAvailableChoices,
				currentChoice: this.currentChoice,
				ancestors: this.ancestors,
				// Action props
				selectChoice: this.selectChoice,
				goBack: this.goBack
			});
		}
	};
</script>
