import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true }
});

userSchema.pre('save', function(next) {
    // get access to user model
    const user = this;
    //console.log({ user })
    // generate a salt then run callback
    bcrypt.genSalt(10, function(err, salt) {
        if(err) { return next(err)}

        //hash (encrypt) our passwprd using the salt
        bcrypt.hash(user.password, salt).then(hash => {
            user.password = hash;
            next();
        }).catch(err => next(err))
    })
})


userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if(err) { return callback(err)}
        callback(null, isMatch)
    })
}

const User = mongoose.model('User', userSchema);

export default User;