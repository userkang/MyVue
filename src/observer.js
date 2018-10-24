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
        if (Dep.target) {
          dep.addSub(Dep.target)
        }
        return val
      },
      set(newVal) {
        if (newVal === val) {
          return
        }
        val = newVal
        dep.notify()
      }
    })
  }
}

export class Dep {
  constructor() {
    this.subs = []
  }

  addSub(sub) {
    this.subs.push(sub)
  }

  notify() {
    this.subs.forEach(sub => {
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
