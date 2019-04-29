import mongoose from '/src/db/mongoose'
import validator from 'validator'
import jwt from 'jsonwebtoken'
import config from '/config'
import security from '/src/utils/security'
import Cloth from '/src/models/cloth'

var UserSchema = new mongoose.Schema({
  disabled: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: 'user'
  },
  name: {
    type: String,
    minlength: 1,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    validate: {
      isAsync: true,
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  salt: {
    type: String
  },
  facebookID: {
    type: String
  },
  facebookUserID: {
    type: String
  },
  facebookPicture: {
    type: Object
  },
  facebookAccessToken: {
    type: String
  },
  facebookSignedRequest: {
    type: String
  },
  closet: [{
    type: mongoose.Schema.Types.Mixed,
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    folderName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    products: [{
      type: mongoose.Schema.Types.ObjectId
    }],
    description: {
      type: String
    }
  }],
  newsletter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Newsletter'
  },
  likedLooks: {
    type: [String],
  },
  dislikedLooks: {
    type: [String],
  },
  likedProducts: {
    type: [String],
  },
  dislikedProducts: {
    type: [String],
  },
  myCloset: {
    type: mongoose.Schema.Types.Mixed
  },
  sizes: {
    type: mongoose.Schema.Types.Mixed
  },
  budget: {
    type: mongoose.Schema.Types.Mixed
  },
  appearence: {
    type: mongoose.Schema.Types.Mixed
  },
  recommendations: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
})

UserSchema.pre('save', function (next) {
  var user = this

  if (user.isModified('password')) {
    const { passwordHashed, salt } = security.encrypt(user.password)
    user.password = passwordHashed
    user.salt = salt
    next()
  } else {
    next()
  }
})

UserSchema.statics.findByToken = function (token) {
  var User = this
  let decoded

  try {
    decoded = jwt.verify(token, config.tokenSecret)
  } catch (e) {
    return Promise.reject()
  }
  return User.findOne({
    '_id': decoded._id
  }, '_id email name closet role')
}

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this

  return User.findOne({ email }).then((user) => {
    if (!user) {
      const error = new Error('User not found')
      error.name = 'UserNotFound'
      return Promise.reject(error)
    }

    return new Promise((resolve, reject) => {
      if (!user.password || !user.salt) {
        const error = new Error('Authentication failed. Please log with facebook.')
        error.name = 'AuthFailedFacebookUser'
        reject(error)
      }

      if (security.validate(password, user.password, user.salt)) {
        resolve(user)
      } else {
        const error = new Error('Wrong password')
        error.name = 'WrongPassword'
        reject(error)
      }
    })
  })
}

UserSchema.methods.generateAuthToken = function () {
  var user = this
  const token = security.generateToken({ _id: user._id.toString(), email: user.email })

  return Promise.resolve(token)
}

UserSchema.methods.fetchCloset = async function () {
  var user = this

  const closet = user.closet
  for(let i = 0; i < closet.length; i++) {
    const products = closet[i].products
    const result = await Cloth.find({ '_id': { '$in': products } })
    user.closet[i].products = result
  }
}

UserSchema.index({ email: 1 }, { unique: true, name: 'email' })

const User = mongoose.model('User', UserSchema, 'users')

module.exports = User
