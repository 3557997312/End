const express = require('express');
const app = express();
const cors = require('cors');

const port = 3000; // 设置服务器端口号

// 导入路由文件
const apiRoutes = require('./routes/api');

// 中间件
app.use(express.json()); // 解析请求体中的 JSON 数据

app.use(cors());

// 路由
app.use('/api', apiRoutes); // 将路由文件挂载到 '/api' 路径

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
