module.exports = app => {
  const {
    router,
    controller,
    io
  } = app
  const {
    sign,
    site,
    model,
    project,
    chart,
    risk,
    water
  } = controller
  router.get('/', sign.showLogin)
  // 登录请求会由passportLocal策略验证
  const localStrategy = app.passport.authenticate('local', {
    successRedirect: '/index',
    failureRedirect: '/',
  })
  router.post('/passport/local', localStrategy)

  // index page
  router.get('/index', site.index)
  // 注销
  router.get('/signout', sign.signout)
  // model页面
  router.get('/model', model.model)
  // 项目页面
  router.get('/project', project.project)
  // model展示页面
  router.get('/showmodel/:projId', model.showmodel)
  // socket.io exchange事件
  io.of('/').route('exchange', io.controller.nsp.exchange)
  io.of('/').route('receiveFile', io.controller.nsp.receiveFile)
  // 上传模型到7004上
  router.get('/createModel', model.createModel)
  // 查询一般测点曲线
  router.get('/getCommonPoint', chart.getCommonPoint)
  // 查询单个项目所有报警点的信息
  router.get('/getProjectPointStatus', chart.getProjectPointStatus)
  // 查询地层风险相关数据
  router.get('/getRiskInfo', risk.getRiskInfo)
  // 保存地层的颜色(承压水的颜色)
  router.post('/saveWaterColor', water.saveWaterColor)
  // 查询所有的承压水信息
  router.get('/getWaterColor', water.getWaterColor)
}