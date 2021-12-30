import express from 'express';
import http from 'http';
import routes from './routes';
import cors from 'cors';
import { CLIENT_DOMAIN } from './config';

const PORT = process.env.PORT || 9000;

const app = express();
const server = http.createServer(app);
server.listen(PORT, () => console.log(`server started at http://localhost:${PORT}`));
app.use(express.json());

app.use(cors({
  origin(origin, callback) {
    let allow: boolean;
    if (process.env.NODE_ENV === 'production') {
      allow = origin === CLIENT_DOMAIN;
    } else {
      allow = true;
    }
    if (allow) {
      callback(null, true);
    } else {
      callback(new Error(`${origin} not allowed by CORS`));
    }
  },
  optionsSuccessStatus: 200,
}));

app.get("/", (req, res) => {
  res.send( "Hello world!" );
});

routes(app, server);
