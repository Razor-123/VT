const userModel = require('../Models/userModel');
const jwt = require('jsonwebtoken');
const { figma_access_key } = require('../secrets/secret');
const JWT_KEY = require('../secrets/secret').JWT_KEY;
const figam_access_key = require('../secrets/secret').figma_access_key
const axios = require('axios');

module.exports.signup = async function signup(req,res){
    try{
        const tempdata = req.body;
        const user = await userModel.create(tempdata);
        if (user){
            res.json({
                status:"ok",
                message:"user signup success",
                data:user
            })
        }else{
            res.json({
                status:"error",
                message:"error while signup"
            })
        }
    }catch(err){
        //console.log("err ",err);
        res.json({
            status:"error",
            message:err.message
        })
    }
}


module.exports.login = async function login(req,res){
    try{
        let data = req.body;
        if (data.userId){
            let user = await userModel.findOne({userId:data.userId});
            if (user){
                if (user.password == data.password){
                    let uid = user['_id'];
                    let jwt_ = jwt.sign({payload:uid},JWT_KEY);
                    res.cookie('login',jwt_,{httpOnly:true});
                    res.json({
                        status:"ok",
                        "token":jwt_,
                        message:"User logged in",
                        data: user
                    })
                }else{
                    res.json({
                        status:"error",
                        message:"Credential do not match"
                    })
                }
            }else{
                res.json({
                    status:"error",
                    message:"Wrong Credentials"
                })
            }
        }else{
            res.json({
                status:"error",
                message:"Please enter valid user id"
            })
        }
    }catch(err){
        res.json({
            status:"error",
            message:err.message
        })
    }
}


// protect Route to check user is logged in or not
module.exports.protectRoute = async function protectRoute(req,res,next){
    try{
        console.log("in protect route")
        let token;
        //console.log(req.cookies);
        if (req.cookies && req.cookies.login){
            token = req.cookies.login;
            let payload = jwt.verify(token,JWT_KEY);
            if (payload){
                const user = await userModel.findById(payload.payload);
                req.id = user.id;
                next();
            }else{
                // browser - redirect to login
                const client = req.get('User-Agent');
                if (client.includes('Mozilla')==true){
                    return res.redirect('/login'); // please login
                }else{
                    res.json({
                        status:"error",
                        message:"Please retry"
                    })
                }
            }
        }else{
            res.json({
                status:"error",
                message:"please log in"
            })
        }
    }catch(err){
        res.json({
            status:"error",
            message:err.message
        })
    }
}


module.exports.user_profile = async function user_profile(req,res){
    try{
        let id = req.id;
        const user = await userModel.findById(id);
        if (user){
            res.json({
                status:"ok",
                message:"user retrived",
                data:user
            })
        }else{
            res.json({
                status:"error",
                message:"no if found"
            })
        }
    }catch(err){
        res.json({
            status:"error",
            message:err.message
        })
    }
}

module.exports.ui_info = async function ui_info(req,res){
    let fileId = req.params.id;
    try{
        let result = await axios.get('https://api.figma.com/v1/files/' + fileId, {
            method: 'GET',
            headers: {
            'X-Figma-Token': figma_access_key
            }
        });

        const final_result = result.data

        //res.json(final_result)
        res.json({
            status:"ok",
            message:"ui file fetched success",
            data:final_result
            
        })
    }catch(err){
        res.json({
            status:"error",
            messge:err.message
        })
    }
}


module.exports.logout = function logout(req,res){
    res.cookie('login','',{maxAge:1});
    res.json({
        status:"ok",
        message:"User log out success"
    })
}

