import { Dep } from './observer.js'

// 订阅者
export class Watcher {
  constructor(vm, exp, cb) {
    this.cb = cb
    this.vm = vm
    this.exp = exp
    this.value = this.get()
  }

  update() {
    this.run()
  }

  run() {
    let value = this.vm.data[this.exp]
    let oldVal = this.value
    if (value !== oldVal) {
      this.value = value
      this.cb.call(this.vm, value, oldVal)
    }
  }

  get() {
    // 缓存订阅者自己
    Dep.target = this
    // 强制执行监听器里的 get 函数，这里的执行顺序不能变
    let value = this.vm.data[this.exp]
    // 清除自己
    Dep.target = null
    return value
  }
}
