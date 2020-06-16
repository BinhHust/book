const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name.']
    },
    email: {
      type: String,
      unique: [true, 'Please provide an email.'],
      lowercase: true,
      required: true,
      validate: [validator.isEmail, 'Please provide a valid email.']
    },
    password: {
      type: String,
      select: false,
      required: [true, 'Please provide a password.'],
      minlength: [8, 'Password must be at least 8 characters']
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please provide a password confirm.'],
      validate: {
        // this - current document when save() or create()
        validator: function(val) {
          return this.password === val;
        },
        message: 'Password confirm must be the same password.'
      }
    },
    active: {
      type: Boolean,
      default: false
    },
    photo: {
      type: String,
      default: 'default.jpg'
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin', 'manager']
    },
    changedPasswordAt: Date,
    verifyToken: String,
    shop: {
      type: mongoose.Schema.ObjectId,
      ref: 'Shop'
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// 1) document middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  // password dc update || 1 user moi dc tao ra
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre('save', function(next) {
  if (this.isNew || !this.isModified('password')) return next();

  this.changedPasswordAt = Date.now() - 1000;
  return next();
});

// 2) query middleware
// userSchema.pre('find', function(next) {
//   this.find({
//     active: true
//   });

//   next();
// });

// 3) instance methods
userSchema.methods.isCorrectPassword = async function(pwFromUser, pwInDB) {
  return await bcrypt.compare(pwFromUser, pwInDB);
};

userSchema.methods.isChangedPassword = function(createdTokenAt) {
  if (this.isChangedPasswordAt) {
    const changedPasswordAt = this.changedPasswordAt.getTime(); // ms

    return changedPasswordAt > createdTokenAt * 1000; // s
  }
  return false;
};

userSchema.methods.createVerifyToken = function() {
  const token = crypto.randomBytes(32).toString('hex');

  this.verifyToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
