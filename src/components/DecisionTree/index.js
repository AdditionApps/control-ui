import ControlDecisionTree from './src/DecisionTree'

ControlDecisionTree.install = function (Vue) {
  Vue.component(ControlDecisionTree.name, ControlDecisionTree)
}

export default ControlDecisionTree