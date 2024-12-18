import cors from 'cors';

import express from 'express'
import helmet from "helmet";
import { expressjwt } from 'express-jwt';
import { env, corsOptions,setup } from './config.js';

const app = express();
app.use(helmet()); //generel security

app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));

const PORT = env.PORT;
const JWT_SECRET = env.JWT_SECRET;



import publicAuthRoutes from './routes/auth.route.js';
import secureUsersRoute from './routes/users.route.js';
import securePostsRoute from './routes/posts.route.js';
import { jwtErrorHandler } from './helpers/jwt-error-handler.js';


app.use('/api/auth', publicAuthRoutes);
app.use('/api/users', expressjwt({ secret: JWT_SECRET, algorithms: ['HS256'],requestProperty: "user"}), secureUsersRoute);
app.use('/api/posts', expressjwt({ secret: JWT_SECRET, algorithms: ['HS256'],requestProperty: "user"}), securePostsRoute);


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
  setup();
  jwtErrorHandler(app);
})