  class AppBootHook {

    constructor(app) {
      this.app = app;
    }
  
    async didReady() {
      // 请将你的应用项目中 app.beforeStart 中的代码置于此处。
      // const ctx = await this.app.createAnonymousContext()
      // const admin = await ctx.model.User.findOne({name: 'admin'}).exec()
      // if (!admin) {
      //   const newAdmin = this.app.model.user()
      //   newAdmin.name = 'admin'
      //   newAdmin.pass = 'skgeoinfo'
      //   await newAdmin.save()
      // } 
    }
  }
  
  module.exports = AppBootHook;
