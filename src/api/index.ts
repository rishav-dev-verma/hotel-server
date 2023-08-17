import {Router} from 'express';
import auth from './routes/auth';
import comment from './routes/comment';
import feed from './routes/feed';
import permission from './routes/permission';
import role from './routes/role';
import user from './routes/user';

export default (): Router => {
    const app=Router();

    auth(app);
    feed(app);
    comment(app)
    permission(app);
    role(app);
    user(app);
    
    return app;
};