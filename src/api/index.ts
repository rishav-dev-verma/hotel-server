import {Router} from 'express';
import auth from './routes/auth';
import comment from './routes/comment';
import feed from './routes/feed';

export default (): Router => {
    const app=Router();

    auth(app);
    feed(app);
    comment(app)
    
    return app;
};