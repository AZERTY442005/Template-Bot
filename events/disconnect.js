module.exports = {
    name: 'error',
    execute(event) {
        console.log(`The WebSocket has closed and will no longer attempt to reconnect`)
        console.log(event)
    }
}