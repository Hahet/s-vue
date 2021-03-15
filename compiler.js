'use strict';

class Compiler {
  constructor($el, vm) {
    this.fragment = null;
    this.$vm = vm;
    this.init($el);
  }

  isTextNode(node) {
    return node.nodeType === 3;
  }

  isElementNode(node) {
    return node.nodeType === 1;
  }

  isDirective(attrName) {
    return attrName.indexOf('v-') >= -1;
  }

  curlyReg() {
    const reg = /\{\{(.+)\}\}/;
    return reg;
  }

  toArray(o) {
    return [].slice.call(o);
  }

  init($el) {
    const node = document.querySelector($el);
    this.$el = node;
    this.fragment = this.fragmentFromNode(node);
    // 编译
    this.compile(this.fragment);
    // 放回去
    node.appendChild(this.fragment);
  }

  compile(fragment) {
    const { childNodes } = fragment;
    childNodes.forEach(c => {
      console.log('c', c);
      // 文本节点
      if (this.isTextNode(c)) {
        this.compileTextNode(c);
      }
      // 元素节点
      if (this.isElementNode(c)) {
        this.compileElementNode(c);
      }
      // 如果当前节点有子节点 那需要对当前节点继续做 compile
      if (c.childNodes && c.childNodes.length > 0) {
        this.compile(c);
      }
    });

  }

  compileElementNode(node) {
    // v-text  v-model
    const attributes = this.toArray(node.attributes);
    attributes.forEach(attr => {
      const { name, value: key } = attr;
      if (this.isDirective(name)) {
        const value = this.$vm.$data[key];
        if (name === 'v-text') {
          node.textContent = value;
          new Watcher(this.$vm, key, next => {
            // 更新
            node.textContent = next;
          });
        } else {
          node.value = value;
          new Watcher(this.$vm, key, next => {
            // 更新
            node.value = next;
          });
        }
        if (name === 'v-model') {
          node.addEventListener('input', e => {
            const value = e.target.value;
            this.$vm.$data[key] = value;
          });
        }
      }

    });
  }

  compileTextNode(node) {
    console.log('text', node);
    const { textContent } = node;
    const reg = this.curlyReg();

    if (reg.test(textContent)) {
      const key = RegExp.$1.trim();
      const value = this.$vm.$data[key];
      // 初始化
      node.textContent = node.textContent.replace(reg, value);
      // watcher 监听当前绑定
      new Watcher(this.$vm, key, (next, old) => {
        // 更新
        node.textContent = node.textContent.replace(old, next);
      });
    }

  }

  fragmentFromNode(node) {
    const fragment = document.createDocumentFragment();
    while (node.firstChild) {
      fragment.appendChild(node.firstChild);
    }
    return fragment;
  }
}
