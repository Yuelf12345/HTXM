const Koa = require("koa");
import type { Context, Next } from "koa";
const Router = require("koa-router");
const { koaBody } = require("koa-body");
const cors = require("koa2-cors");

declare module "koa" {
  interface Request {
    body?: any;
  }
}

const app = new Koa();
const router = new Router();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(koaBody());
app.use(router.routes());

router.get("/getJoke", (ctx: Context, next: Next) => {
  const { contains } = ctx.query;
  const jokes = [
    "小明在 playground 玩，突然发现 playground 有个笑话。",
    "为什么程序员不喜欢在户外工作？因为那里有太多的 bugs。",
    "为什么电脑经常生病？因为它有很多病毒。",
    "为什么书总是觉得冷？因为它总是有封面。",
    "为什么键盘总是很忙？因为它有很多键。",
  ];
  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
  ctx.body = `<pre>下面是一个关于‘${contains}’的笑话：\n\n${randomJoke}</pre>`;
});

router.get("/delayedData", (ctx: Context, next: Next) => {
  // 等待2秒返回数据
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve((ctx.body = "这是延时返回的数据"));
    }, 2000);
  });
});

router.post("/postName", async (ctx: Context, next: Next) => {
  const name = ctx.request.body.name;
  ctx.body = `<pre>你好，${name}！欢迎。</pre>`;
});

// 任务列表
let tasks: { id: number; text: string; completed: boolean }[] = [];

// 添加任务
router.post("/addTask", (ctx: Context, next: Next) => {
  const newTask = ctx.request.body.newTask;
  if (newTask) {
    const id = tasks.length + 1;
    tasks.push({ id, text: newTask, completed: false });
    ctx.body = tasks
    .map(
      (task) => `
      <li class="task-item">
          <span>${task.text}</span>
      </li>
    `
    )
    .join("");
  }
});

app.listen(3000, () => {
  console.log("server is running at http://localhost:3000");
});
