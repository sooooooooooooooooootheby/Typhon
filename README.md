<p align="center">
<img style="text-align:center;" src="https://raw.githubusercontent.com/sooooooooooooooooootheby/Typhon/main/logo.png" />
</p>
<h1 align="center" style="color: #1B1B1B">🐭 Typhon 🐹</h1>

## 项目介绍 🌕
这是模仿X（Twitter）UI制作的留言板网站。

logo是一个纸飞机，请不要在意它和Telegram有什么关系，我只是单纯的懒，不想做新logo。另外名字来自游戏《重返未来:1999》中苏芙比大小姐的挂饰（提丰-typhon）。

本项目旨在学习前后端交互，以及[后端](https://github.com/sooooooooooooooooootheby/Typhon-back-end)搭建。虽然项目以学习为主，但也会挂到服务器上去正式运行。

## 技术栈 📦
- vue3 (我用的选项式api比较多，因为我喜欢他，所以看完我的代码请不要认为我是用的vue2 谢谢)
- vueRouter (小网站就做单页面了)
- pinia (状态管理，就是数据不是持久化比较麻烦，一刷新就没了，但是持久化了又会变成小而美)
- scss (变量和mixin真的不错)
- gsap (很好的动画库，无需多言，用过都说好)
- iconfont (页面的svg图标都是用它打包的)

## 项目待办 📓
- [x] 查看帖子
- [x] 发布帖子
- [x] 帖子点赞
- [x] 帖子评论
- [x] 用户基本操作（登录/注册/退出/修改个人信息）
- [x] 查看用户信息（本人）(个人的信息&发布的帖子&点赞的帖子)
- [x] 用户订阅Pro (这个是免费的，没有添加付款功能)
- [x] 查看其他用户的信息 (个人的信息&发布的帖子&点赞的帖子)
- [x] 用户找回密码
- [x] 用户修改邮箱
- [x] 用户注销
- [x] i18n国际化
- [X] 动态title
- [ ] 用户语言显示

### Beta 2.0
- [ ] 响应式布局（手机&平板）
- [ ] 明暗主题

## 记事本 📖
```
├─ 2024年4月20日 ─ 项目新建文件夹
├─ 2024年4月30日 ─ 第一版UI太丑就把页面重构了，顺便正式确定按照X（twitter）的页面UI做并正式命名项目为Typhon，logo是纸飞机。
├─ 2024年5月14日 ─ 大部分功能都做完了，但是因为我发现史山越堆越高了，看着有点头痛，用Lighthouse测试一瞧，嘿，您猜怎么着，性能高达37分（笑），所以准备再次重构把功能梳理一下，顺便在Github把库给建了（虽然我很想写完了再重构优化但是我已经写不下去了）。
├─ 2024年5月29日 ─ 随着后端的重构，优化了前端请求方法，发布了beta 1.0版本。
├─ 2024年5月29日 ─ 添加了用户设置，可以修改邮箱密码注销账户了，算是完成所有的基础功能了，顺便优化了一下页面样式，发布了beta 1.1版本。
```

- 我在发布帖子的功能加入了MD编辑器，就很高级，还带预览，用的是[v-md-editor]（https://www.npmjs.com/package/@kangc/v-md-editor）

- 比亚迪emoji，本来好不容易解决了`mysql`储存四字节emoji的问题（直接从7降到5，那个7我改了一个下午字符集和校对规则都存不上，干脆换到5，问题就解决了（笑）），结果`node.js`从数据库查询回来又变成`?`了，我滴妈，就多了一个字节怎么这么多问题啊，整了两天还没解决我已经不想管了，等个大佬看见了帮帮我。

## 食用指南 🍬
从Github拉取
```
git clone https://github.com/sooooooooooooooooootheby/Typhon.git
```

进入目录
```
cd Typhon
```

安装依赖
```
pnpm i
```

运行开发服务器
```
pnpm run dev
```

