const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const proxyRouter = require("./routers/proxyRouter");
const helmet = require("helmet");
const rateLimitAndTimeout = require("./middleware/sessionLimiter");
const app = express();
const PORT = process.env.PORT;

app.use(morgan('dev'));

app.use(cors({
    origin: ['http://localhost:3000', 'http://172.27.96.1:3000', 'http://192.168.1.3:3000'],
    credentials: true,
}));

app.use(rateLimitAndTimeout);
app.use(helmet());
app.disable("x-powered-by");
app.use(proxyRouter);

app.listen(PORT, () => {
    console.log(`API Gateway listening on http://localhost:${PORT}`);
});
