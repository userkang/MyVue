/**
 * 监听者
 */
class Observer {
  constructor(data) {
    this.data = data
    this.walk(data)
  }

  walk(data) {
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }

  defineReactive(data, key, val) {
    const dep = new Dep()
    observe(val)
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 如果当前有缓存订阅者，就添加一个新订阅者
        if (Dep.target) {
          // 添加一个订阅者
          dep.addSub(Dep.target)
        }
        return val
      },
      set(newVal) {
        if (newVal === val) {
          return
        }
        val = newVal
        // 如果数据有变化，通知所有订阅者
        dep.notify()
      }
    })
  }
}

// 消息订阅器
export class Dep {
  constructor() {
    this.subs = []
  }

  addSub(sub) {
    this.subs.push(sub)
  }

  notify() {
    this.subs.forEach(sub => {
      // 调用订阅者的 update 方法
      sub.update()
    })
  }
}
Dep.target = null

export const observe = value => {
  if (!value || typeof value !== 'object') {
    return
  }
  return new Observer(value)
}
