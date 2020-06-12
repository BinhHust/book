const mongoose = require('mongoose');
const validator = require('validator');

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
      default: false,
      select: false
    },
    photo: String,
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin', 'manager']
    }
  },
  {
    toJSON: { virtual: true },
    toObject: { virtual: true }
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
