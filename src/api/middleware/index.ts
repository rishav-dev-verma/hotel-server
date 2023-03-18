
import auth from '../middleware/auth';
import currentUser from '../middleware/attachCurrentUser';
import isAdmin from './isAdmin';


export default {
    auth,
    currentUser,
    isAdmin
}