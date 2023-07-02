const mongoose  = require('mongoose');
const db_link = require('../secrets/secret').db_link;
mongoose.connect(db_link)
    .then((db)=>{
        console.log('user database connected');
    })
    .catch((err)=>{
        console.log("user database connection error: ",err);
    })

const userSchema = mongoose.Schema({
    userId:{
        type:String,
        unique:true,
        required:[true,"Please Enter Your Name"]
    },
    password:{
        type:String,
        required:[true,"Please enter your password"],
        minLength:[8,"Password length must be eight"]
    },
    confirmPassword:{
        type:String,
        require:[true,"Please confirm the password"],
        validate:{
            validator: function(){
                return this.confirmPassword == this.password;
            },
            message:"Passwords not similar"
        }
    }
})

userSchema.pre('save',function(){
    this.confirmPassword = undefined;
});

userSchema.post('save',function(error,doc,next){
    if (error && error.name==="MongoServerError" && error.code === 11000) next(new Error('User id is already taken'));
    else next(error);
});

// userSchema.pre(/^find/,function(next){
//     this.populate("my_complaints")
//     next();
// })


const userModel = mongoose.model('userModel',userSchema);
module.exports = userModel;