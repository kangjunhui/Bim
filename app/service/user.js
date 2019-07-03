'use strict';

const Service = require('egg').Service

class UserService extends Service {
    /**
     * 根据用户登录名,查找用户
     * @param {string} username 登陆名
     * return 查询用户的结果 promise
     */
  getUserByLoginName(username) {
    const query = {name: username}
    return this.ctx.model.User.findOne(query).exec()
  }

    /*
   * 根据用户ID，查找用户
   * @param {String} id 用户ID
   * @return {Promise[user]} 承载用户的 Promise 对象
   */
  getUserById(id) {
    if (!id) {
      return null
    }
    return this.ctx.model.User.findById(id).exec()
  }
}

module.exports = UserService
