const io = require('socket.io')(12800)

const UsersMap = {}

// 接続時イベント
io.on('connection', (socket) => {
    // クライアントから入室のイベント
    socket.on('enter-room', (RoomID) => {
        // ルーム作成
        socket.join(RoomID)
        // ユーザーマップ作製
        if (!RoomID in UsersMap) { 
            UsersMap[RoomID] = []
        }
    })

    // クライアントから名前を登録
    socket.on('enter-user', (RoomID, UserName) => {
        // すでにルームが存在する
        if (RoomID in UsersMap) {
            // ルーム内のユーザーを取得
            const UsersInRoom = UsersMap[RoomID]
            // 同じ名前が存在するか確認
            const UserIndex = UsersInRoom.indexOf(UserName)
            if (UserIndex < 0) { // 存在しない
                // マップに追加
                UsersMap[RoomID].push(UserName)
                // ルーム内に登録を通知
                io.to(RoomID).emit('enter-player', UserName)
            } else {
                // 登録失敗を通知
                io.emit('cannot-enter-user', RoomID, UserName)
            }
        }
    })

    socket.on('disconnect', (RoomID, UserName) => {
        // マップから削除
        UsersMap[RoomID] = UsersMap[RoomID].filter(u => u !== UserName)
        // 切断を通知
        io.to(RoomID).emit('disconnect-user', UserName)
    })
});