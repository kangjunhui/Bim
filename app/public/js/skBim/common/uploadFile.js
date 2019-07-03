function uploadInit() {
    $('#uploadFile').draggable()
    $('#riskBtn').on('click', function () {
        $('#uploadFile').toggle()
    })
    $('#sendFile').on('click', function () {
        const file = document.getElementById('fileId').files[0]
        const fileReader = new FileReader()
        fileReader.onload = function () {
            const worker = new Worker('/public/js/skBim/common/worker.js')
            const msgObj = {
                ename: 'receiveFile',
                file: fileReader.result,
                modelId: projId
            }
            worker.postMessage(msgObj)
            worker.onmessage = ev => {
                swal({
                    title: ev.data.msg,
                    icon: "success",
                    buttons: {
                        confirm: {
                            text: "确定",
                            className: "btn btn-success"
                        }
                    }
                })
                if (ev.data.success) worker.terminate()
            }
            worker.onerror = () => {
                console.log('worker线程出错!')
            }
        }
        fileReader.readAsArrayBuffer(file)
    })
}