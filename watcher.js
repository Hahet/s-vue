'use strict';

class Watcher {
  constructor(vm, key, callback) {
    this.$vm = vm;
    this.key = key;
    this.callback = callback;
    this.value = this.get();
  }

  get() {
    // 将 watcehr 实例挂到 Dep 上
    Dep.target = this;
    // 访问属性
    const value = this.$vm.$data[this.key];
    // 置空
    Dep.target = null;
    return value;
  }

  update() {
    // this.callback();
    const old = this.value;
    const next = this.$vm.$data[this.key];
    if (next === old) {
      return;
    }
    this.callback(next, old);
    this.value = next;
  }
}
