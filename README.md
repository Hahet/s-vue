## 实现 Vue 双向绑定
[vue](https://cn.vuejs.org/v2/guide/index.html)
  简单说一下 vue 的功能
  [原理图](https://whimsical.com/vue-PQL14dktu8m6hHdcGYxpZn)
### 我们要实现的指令

  - `v-text`
  - `{{}}`
  - `v-modal`
### Vue 构造函数
    ```html
<div id="app">
  {{ message }}
</div>
```


    ```javascript
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})
```
### 数据劫持：observe
####[Proxy](https://es6.ruanyifeng.com/?search=proxy&x=0&y=0#docs/proxy)
      使用 P`roxy` 完成数据的劫持，这样每次`data` 变动我们都可以感知
#### Dep
每个属性对应一个`dep`， `dep` 收集所有依赖当前属性的`watcher`， 并在数据变动时通知所有`watcher` 去 update
### 模板编译：Compiler
####[fragment](https://developer.mozilla.org/zh-CN/docs/Web/API/DocumentFragment)
        将`dom` 转换成`fragment`, 在内存中操作，不访问`dom`， 性能好一点

#### 分析依赖
遍历`fragment`，找到我们要处理的指令
#### 初始化
取 data 中的默认值，去更新对应指令绑定的视图
#### 添加监听器（watcher），收集依赖
如果`node` 动态绑定了`data` 中的数据，就需要 添加`watcher` 进行监听，当数据更新时，通过`watcher` 更新视图
#### 视图 -> data 处理
给表单绑定`input` 事件， 当用户输入时，触发`data` 变动, 进一步通过`watcher` 触发依赖该数据的视图更新
