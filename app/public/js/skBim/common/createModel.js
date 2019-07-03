const username = 'test',
    projectId
const webApi = new BIMVIZ.WebApi({
    ip: "180.169.145.53",
    port: 7004,   
    restport: 7005,  
    key: "e21266c6-7879-4517-a2a4-c53b490bacee"   
})
const modelPrjMgr = webApi.getModelProjectManager()
const projectBuildMgr = webApi.getProjectBuildManager()

$('.login-content button').on('click', function () {
    let proName = $('#proName').val()
    if (!proName) alert('项目名称不能为空!')
    let proDesc = $('#proDesc').val() || ''
    var project = new BIMVIZ.ModelProject(proName, proDesc, BIMVIZ.ProjectState.Processing,
        '')
    //场景设置也可以在创建的时候指定为空
    var settings = new BIMVIZ.ProjectSettings('')
    let projectInfo = new BIMVIZ.ProjectInfo(project, settings)
    modelPrjMgr.addProject(username, projectInfo, function (result) {
        projectId = result.IsSuccess && result.ProjectId
        if (projectId) {
            const html = `
    <div class="form-group m-b-20">
        <input type="file" class="form-control form-control-lg" id="chooseFile">
    </div>
    <div class="login-buttons form-group m-b-20">
        <button id="uploadModelBtn" type="button" class="btn btn-success btn-block btn-lg">上传模型</button>
    </div>
    <div id="progress" style="display:none;" class="progress rounded-corner progress-striped">
<div class="progress-bar bg-success" style="width: 0%;"> </div></div></div>`
            $('.login-content').html(html)
        }
    })
})
$('.login-content').on('click', '#uploadModelBtn', function () {
    var formData = new FormData()
    var files = $('#chooseFile').get(0).files
    if (files.length < 1) return
    formData.append(files[0].name, files[0])
    modelPrjMgr.uploadProjectFiles(username, projectId, formData, function (result) {
        if (result.IsSuccess) {
            const html = `
    <div class="login-buttons form-group m-b-20">
        <button id="rebuildSceneBtn" type="button" class="btn btn-success btn-block btn-lg">生成场景</button>
    </div>
    `
            $('.login-content').html(html)
        }
    }, function (e, prjid) {
        if ($("#progress").is(":hidden")) {
            $("#progress").show()
        }
        let done = e.position || e.loaded
        let total = e.totalSize || e.total
        $('#progress .progress-bar').css('width', Math.round(done / total * 100) + '%')
        $('#progress .progress-bar').text(Math.round(done / total * 100) + '%')
    })
})
$('.login-content').on('click', '#rebuildSceneBtn', function () {
    projectBuildMgr.rebuildScene(username, projectId, BIMVIZ.ProjectSceneBuildCmd.RebuildAll, function (result) {
        if (result.IsSuccess) {
            const html = `<div class="login-buttons">
        <button id="sceneInfoBtn" type="button" class="btn btn-success btn-block btn-lg">获取场景信息</button></div>`
            $('.login-content').append(html)
        }
    })
})
$('.login-content').on('click', '#sceneInfoBtn', function () {
    projectBuildMgr.getRebuildSceneState(username, projectId, function (result) {
        alert(result.Messages)
    })
})