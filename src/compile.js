import { Watcher } from './watcher.js'

/**
 * 解析器
 * 1、解析模版指令，并替换模版数据，初始化视图
 * 2、将模版指令对应的节点绑定对应的更新函数，初始化相应的订阅器
 */
export class Compile {
  constructor(el, vm) {
    this.vm = vm
    this.el = document.querySelector(el)
    this.fragment = null
    this.init()
  }

  init() {
    if (this.el) {
      this.fragment = this.nodeToFragment(this.el)
      this.compileElement(this.fragment)
      this.el.appendChild(this.fragment)
    } else {
      console.log('Dom 元素不存在')
    }
  }

  // 将节点转为文档片段
  nodeToFragment(el) {
    let fragment = document.createDocumentFragment()
    let child = el.firstChild
    while (child) {
      fragment.appendChild(child)
      child = el.firstChild
    }
    return fragment
  }

  // 编译节点
  compileElement(el) {
    const childNodes = el.childNodes

    Array.prototype.slice.call(childNodes).forEach(node => {
      const reg = /\{\{(.*)\}\}/
      const text = node.textContent

      if (this.isElementNode(node)) {
        this.compile(node)
      } else if (this.isTextNode(node) && reg.test(text)) {
        this.compileText(node, reg.exec(text)[1].trim())
      }

      // 如果有子节点，递归编译
      if (node.childNodes && node.childNodes.length) {
        this.compileElement(node)
      }
    })
  }

  // 编译指令
  compile(node) {
    const nodeAttrs = node.attributes

    Array.prototype.forEach.call(nodeAttrs, attr => {
      let attrName = attr.name

      // 是否是指令属性
      if (this.isDirective(attrName)) {
        const exp = attr.value
        const dir = attrName.substring(2)

        // 是否是事件指令属性
        if (this.isEventDirective(dir)) {
          this.compileEvent(node, exp, dir)
        } else {
          // v-model 指令
          this.compileModel(node, exp)
        }
        node.removeAttribute(attrName)
      }
    })
  }

  // 编译 {{}} 文本模版语法
  compileText(node, exp) {
    const initText = this.vm[exp]
    this.updateText(node, initText)
    new Watcher(this.vm, exp, value => {
      this.updateText(node, value)
    })
  }

  // 编译 v-on 事件指令
  compileEvent(node, exp, dir) {
    const eventType = dir.split(':')[1]
    const cb = this.vm.methods && this.vm.methods[exp]
    if (eventType && cb) {
      node.addEventListener(eventType, cb.bind(this.vm))
    }
  }

  // 编译 v-model 指令
  compileModel(node, exp) {
    let val = this.vm[exp]
    this.modelUpdater(node, val)
    new Watcher(this.vm, exp, value => {
      this.modelUpdater(node, value)
    })

    node.addEventListener('input', e => {
      const newValue = e.target.value
      if (val === newValue) {
        return
      }
      this.vm[exp] = newValue
      val = newValue
    })
  }

  // 更新文本数据
  updateText(node, value) {
    node.textContent = typeof value === 'undefined' ? '' : value
  }

  // 更新 model 数据
  modelUpdater(node, value) {
    node.value = typeof value === 'undefined' ? '' : value
  }

  // 判断是否是指令
  isDirective(attr) {
    return attr.indexOf('v-') === 0
  }

  // 判断是否是事件指令
  isEventDirective(dir) {
    return dir.indexOf('on:') === 0
  }

  // 判断是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }

  // 判断是否是文本节点
  isTextNode(node) {
    return node.nodeType === 3
  }
}
