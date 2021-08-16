class APIController {
    constructor(Server, Socket) {
        this._Server = Server
        this._Socket = Socket
    }

    GetSendType() {
        return {
            ALL: 'ALL',
            ONLY: this._Socket.id
        }
    }

    CreateAPI(APIName, Callback) {
        if (!this._Server || !this._Socket) return
        
        // リクエストイベント
        this._Socket.on('Request' + APIName, Callback)

        // レスポンスイベント関数を返す
        return (SendTo, ...args) => {
            if (SendTo === this.GetSendType().ALL) {
                this._Server.emit('Response' + APIName, ...args)
            } else {
                this._Server.to(SendTo).emit('Response' + APIName, ...args)
            }
        }
    }
}

module.exports = APIController