import { observe } from './observer.js'
import { Compile } from './compile.js'

class MyVue {
  constructor(options) {
    this.data = options.data
    this.methods = options.methods

    Object.keys(this.data).forEach(key => {
      this.proxyKeys(key)
    })

    observe(this.data)
    new Compile(options.el, this)
    options.mounted.call(this)
  }

  proxyKeys(key) {
    Object.defineProperty(this, key, {
      enumerabel: true,
      configurable: true,
      get() {
        return this.data[key]
      },
      set(newVal) {
        this.data[key] = newVal
      }
    })
  }
}

window.MyVue = MyVue
