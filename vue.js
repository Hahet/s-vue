'use strict';

class Vue {
  constructor(options) {
    const { el, data } = options;
    this.$vm = this;
    this.$el = el;
    this.init(data);
    this.tag = 22222;
  }
  init(data) {
    // 数据劫持
    this.$data = observe(data);
    // 模板编译
    new Compiler(this.$el, this.$vm);
  }
}

// 数据劫持
function observe(object) {
  if (!object || typeof object !== 'object') {
    return;
  }
  const dep = new Dep();
  const proxy = new Proxy(object, {
    get(target, propKey, receiver) {
      console.log(`getting ${propKey}!`);
      if (Dep.target) {
        dep.depend();
      }
      return Reflect.get(target, propKey, receiver);
    },
    set(target, propKey, value, receiver) {
      console.log(`setting ${propKey}!`);
      const r = Reflect.set(target, propKey, value, receiver);
      dep.notify();
      return r;
    },
  });
  return proxy;
}

// Dep
class Dep {
  constructor() {
    this.watchers = [];
  }
  depend() {
    this.watchers.push(Dep.target);
  }
  notify() {
    this.watchers.forEach(w => w.update());
  }
}
