class RoomData {
    constructor(RoomID, Owner, Passward) {
        this._RoomID = RoomID
        this._Owner = Owner
        this._Passward = Passward
        this._UserList = []
    }

    AddUser(UserData) {
        this._UserList.push(UserData)
    }

    GetRoomID() { return this._RoomID }
}

module.exports = RoomData