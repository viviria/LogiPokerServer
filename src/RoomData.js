class RoomData {
    constructor(Owner, Passward) {
        this._RoomID = RoomData.CreateRoomID()
        this._Owner = Owner
        this._Passward = Passward
        this._UserList = []
    }

    static CreateRoomID() {
        return Math.random().toString(32).substring(2) + Date.now()
    }

    AddUser(UserData) {
        this._UserList.push(UserData)
    }

    GetRoomID() { return this._RoomID }
}

module.exports = RoomData