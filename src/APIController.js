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
                this._Server.to(SendID).emit('Response' + APIName, ...args)
            }
        }
    }

    CallAPI(APIName, ...args) {
        if (!this._Server) return

        if (args.length > 0) {
            // 最後の引数をコールバックとする
            const Callback = args[args.length - 1]
            // それ以外をレスポンスパラメータにする
            args = args.slice(0, args.length - 1)
            // リクエストを送信する
            if (args.length > 0) {
                this._Server.emit('Request' + APIName, ...args)
            } else {
                this._Server.emit('Request' + APIName)
            }
            // レスポンスのコールバック
            this._Server.on('Response' + APIName, Callback)
        }
    }
}

module.exports = APIController