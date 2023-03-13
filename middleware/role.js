exports.roleAccess = (req, res, next) => {
    try {
        if(req.body.role == 'user'){
            res.send("You cannot access this route.")
        }else{
            return next();
        }
    }catch(error){
        console.log(error);
    }
}
