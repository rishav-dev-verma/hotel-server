const isAdmin= async(req:any,res:any,next) => {
    try {
    if(req.currentUser.role && req.currentUser.role === 'Admin'){
        next();
    }else {
        throw new Error('This route can only be accessed by admin role');
    }
    }catch (e) {
        next(e)
    }
}

export default isAdmin;