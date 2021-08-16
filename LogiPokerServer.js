const express = require('express')
const app = express()
const http = require('http')

// ポート設定
const Port = 12800

// サーバ作成
const HttpServer = http.createServer(app)
const { Server } = require("socket.io");

const io = new Server(HttpServer)

// 静的リソース使用
app.use(express.static("public"));
app.use(express.static("game"));

// ルーティング設定
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/game/index.html')
})
/*
app.get('/game', (req, res) => {
    res.sendFile(__dirname + '/game/index.html')
})
*/
HttpServer.listen(Port)

// ユーザーデータ
const UserData = require('./src/UserData')
// ルームデータ
const RoomData = require('./src/RoomData')
// API 操作クラス
const APIController = require('./src/APIController')
const APINames = require('./src/APINames')
// ログ
const { Log, LogCategories } = require('./src/Log')

let UserList = []
let RoomIDList = []
let RoomList = []

const GetUserData = (UserID) => {
    const Users = UserList.filter(x => x.GetUserID() === UserID)
    if (Users.length > 0) {
        return Users[0]
    }
    return null
}

// 接続時イベント
io.on('connection', (socket) => {
    const Controller = new APIController(io, socket)

    // 接続開始処理
    const ResUserEnter = Controller.CreateAPI(APINames.UserEnter, (UserID) => {
        Log(LogCategories.DEBUG, APINames.UserEnter, UserID)
        ResUserEnter(Controller.GetSendType().ONLY, RoomList)
    })

    const ResCreateRoom = Controller.CreateAPI(APINames.CreateRoom, (UserID, UserName, Passward) => {
        const Room = new RoomData(UserID, Passward)
        const User = new UserData(UserID, Room.GetRoomID(), UserName)
        Room.AddUser(User)
        RoomList.push(Room)
        ResCreateRoom(Controller.GetSendType().ONLY, Room)
    })

    // 特定のルームの人数を送る
    socket.on('RequestUserNumInRoomID', (RoomID) => {
        const UsersInRoom = UserList.filter(x => x.GetRoomID() === RoomID).map(x => x.GetUserName())
        io.emit('ResponseUserNumInRoomID', UsersInRoom)
    })

    // クライアントから名前を登録
    socket.on('EnterUserIntoRoom', (UserID, RoomID, UserName) => {
        if (RoomID == "") return

        // すでに同じユーザーが存在するか
        const AlreadyUser = GetUserData()
        if (AlreadyUser) {
            // ルーム内に通知
            io.to(RoomID).emit('EnterPlayer', AlreadyUser.GetUserName())
            return
        }

        // 新規ユーザーデータ作成
        const User = new UserData(UserID, RoomID, UserName)
        User.SetSocketID(socket.id)
        // すでにルームが存在する
        if (RoomIDList.includes(RoomID)) {
            // ルーム内のユーザーを取得
            const UsersInRoom = UserList.filter(x => x.GetRoomID() === RoomID)
            // 同じ名前が存在するか確認
            const SameNameUser = UsersInRoom.find(x => x.GetUserName() === UserName)
            // すでに同名が存在する
            if (SameNameUser) {
                // 登録失敗を新規ユーザーに通知
                io.to(socket.id).emit('CannotEnterUser', UserName)
                Log(LogCategories.DEBUG, 'CannotEnterUser', UserName)
            } else {
                // ユーザーリストに追加
                UserList.push(User)
                // ルーム内に登録を通知
                io.to(RoomID).emit('EnterPlayer', UserName)
            }
        } else {
            // ルームがなければ作成
            socket.join(RoomID)
            Log(LogCategories.DEBUG, 'CreateRoom', RoomID)
            // ユーザー配列を作成
            RoomIDList.push(RoomID)
            // ユーザーリストに追加
            UserList.push(User)
            // ルーム内に登録を通知
            io.to(RoomID).emit('EnterPlayer', UserName)
        }
    })
    
    // ユーザーデータ取得
    socket.on('RequestUserData', (UserID) => {
        const User = GetUserData(UserID)
        io.to(User.GetSocketID()).emit('ResponseUserData', User.GetUserName(), User.GetRoomID())
    })

    socket.on('disconnect', () => {
        // マップから削除
        /*const User = UserList.find(x => x.GetSocketID() === socket.id)
        if (User)
        {
            // ユーザーリストから削除
            UserList = UserList.filter(x => x.GetUserID() !== socket.id)
            // 切断を通知
            io.to(User.GetRoomID()).emit('disconnect_user', User.GetUserName())
            console.log('disconnect user: ' + socket.id)
            
            // ルーム内のユーザーを取得
            const UsersInRoom = UserList.filter(x => x.GetRoomID() === User.GetRoomID())
            if (UsersInRoom.length == 0)
            {
                // ルーム削除
                RoomIDList = RoomIDList.filter(x => x !== User.GetRoomID())
                console.log('remove room: ' + User.GetRoomID())
            }
        }*/
    })
});
