let socket = null
function socketInit() {
    if (monitorPort) {
        socket = io('/', {
            query: {
                room: 'shensui',
                userId: `client_${Math.random()}`,
            },
            transports: ['websocket']
        })
    }
}