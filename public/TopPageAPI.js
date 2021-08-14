const CallEnterAPI = (socket, UserID) => {
    socket.emit('RequestEnter', UserID)
}

const CallRoomUserNumAPI = (socket, Callback) => {
    socket.emit('RequestRoomUserNum')
    socket.on('ResponseRoomUserNum', Callback)
}

const CallLoginAPI = (socket, UserID, RoomID, UserName) => {
    if (UserName) {
        localStorage.setItem('LogiPokerUserID', UserID)
        socket.emit('EnterUserIntoRoom', UserID, RoomID, UserName)
        document.location.href = '/game'
    }
}
