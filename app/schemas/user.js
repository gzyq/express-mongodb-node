var mongoose = require('mongoose')
//var bcrypt = require('bcrypt')
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10

var UserSchema = new mongoose.Schema({
  name: {
    unique: true,
    type: String
  },
  password: String,
  // 0: nomal user 普通用户
  // 1: verified user
  // 2: professonal user 高级用户
  // >10: admin 管理员
  // >50: super admin 超级用户
  role: {
    type: Number,
    default: 0
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

UserSchema.pre('save', function(next) {
  var user = this

  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }

  //bcrypt.genSalt生产一个随机的盐（计算强度（强度越大越难破解），回调方法（拿到回调后的盐））
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err)

    //明文密码，上面生成的盐，回调（）
    //bcrypt.hash(user.password, salt, function(err, hash) {
    bcrypt.hash(user.password, salt,null, function(err, hash) {
      if (err) return next(err)

      user.password = hash
      next()
    })
  })
})

UserSchema.methods = {
  //密码比对
  comparePassword: function(_password, cb) {
    //（用户输入密码，数据库中密码，回调）
    bcrypt.compare(_password, this.password, function(err, isMatch) {
      if (err) return cb(err);

      cb(null, isMatch);//没有错误
    })
  }
}

UserSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function(id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}

module.exports = UserSchema