// 二、declare是干嘛的

// .d.ts 文件中的顶级声明必须以 “declare” 或 “export” 修饰符开头。

// 通过declare声明的类型或者变量或者模块，在include包含的文件范围内，都可以直接引用而不用去import或者import type相应的变量或者类型。
// 1.declare声明一个类型

// declare type Asd {
//     name: string;
// }

// 在include包含的文件范围内可以直接使用Asd这个type
// ————————————————
// 原文链接：https://blog.csdn.net/m0_67401761/article/details/123352229
declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const componentOptions: ComponentOptions
  export default componentOptions
}

