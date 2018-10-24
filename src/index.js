import { observe } from './observer.js'
import { Compile } from './compile.js'

class MyVue {
  constructor(options) {
    this.data = options.data
    this.methods = options.methods

    // 添加属性代理
    Object.keys(this.data).forEach(key => {
      this.proxyKeys(key)
    })

    // 注册监听
    observe(this.data)

    // 解析和初始化模版，并注册订阅者
    new Compile(options.el, this)

    // 执行 mounted 函数
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
