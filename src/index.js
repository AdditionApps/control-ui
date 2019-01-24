import * as ControlUIComponents from './components'

const ControlUI = {
  install (Vue) {
    Object.values(ControlUIComponents).forEach(component => {
      Vue.use(component)
    })
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(ControlUI)
}

export default ControlUI