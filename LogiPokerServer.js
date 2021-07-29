const { createCipher } = require('crypto');
const express = require('express')
const app = express()
const http = require('http')

const HttpServer = http.createServer(app)
const { Server } = require("socket.io");

const io = new Server(HttpServer)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

HttpServer.listen(12800)

const UserData = require('./UserData')

let UserList = []
let RoomIDList = []

// 接続時イベント
io.on('connection', (socket) => {
    console.log('connected: ' + socket.id);

    // クライアントから名前を登録
    socket.on('enter-user', (RoomID, UserName) => {
        // 新規ユーザーデータ作成
        const User = new UserData(socket.id, RoomID, UserName)
        // すでにルームが存在する
        if (RoomIDList.includes(RoomID)) {
            // ルーム内のユーザーを取得
            const UsersInRoom = UserList.filter(x => x.GetRoomID() === RoomID)
            // 同じ名前が存在するか確認
            const SameNameUser = UsersInRoom.find(x => x.GetUserName() === UserName)
            // すでに同名が存在する
            if (SameNameUser) {
                // 登録失敗を新規ユーザーに通知
                io.to(socket.id).emit('cannot-enter-user', UserName)
                console.log('cannot enter user: ' + UserName)
            } else {
                // ユーザーリストに追加
                UserList.push(User)
                // ルーム内に登録を通知
                io.to(RoomID).emit('enter-player', UserName)
                console.log('enter user: ' + UserName)
            }
            console.log(UserList.filter(x => x.GetRoomID() === RoomID))
        } else {
            // ルームがなければ作成
            console.log('create room: ' + RoomID)
            // ユーザー配列を作成
            RoomIDList.push(RoomID)
            // ユーザーリストに追加
            UserList.push(User)
            // ルーム内に登録を通知
            io.to(RoomID).emit('enter-player', UserName)
            console.log('enter user: ' + UserName)
        }
    })

    socket.on('disconnect', () => {
        // マップから削除
        const User = UserList.find(x => x.GetUserID() === socket.id)
        if (User)
        {
            // ユーザーリストから削除
            UserList = UserList.filter(x => x.GetUserID() !== socket.id)
            // 切断を通知
            io.to(User.GetRoomID()).emit('disconnect-user', User.GetUserName())
            console.log('disconnect user: ' + socket.id)
            
            // ルーム内のユーザーを取得
            const UsersInRoom = UserList.filter(x => x.GetRoomID() === User.GetRoomID())
            if (UsersInRoom.length == 0)
            {
                // ルーム削除
                RoomIDList = RoomIDList.filter(x => x !== User.GetRoomID())
                console.log('remove room: ' + User.GetRoomID())
            }
        }
    })
});
