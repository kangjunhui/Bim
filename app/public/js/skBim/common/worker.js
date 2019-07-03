self.onmessage = function (event) {
    const data = event.data
    importScripts('https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.slim.js')
    const socket = io('/', {
        transports: ['websocket']
    })
    socket.on('connect', () => {
        const id = socket.id
        console.log(`worker线程: id为${id}连接成功`)
        socket.on(id, msg => {
            postMessage(msg)
        })
        socket.emit(data.ename, {
            target: socket.id,
            payload: {
                file: data.file,
                modelId: data.modelId
            }
        })
    })
}