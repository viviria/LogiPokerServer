class UserData
{
    constructor(UserID, RoomID, UserName)
    {
        this._UserID = UserID
        this._RoomID = RoomID
        this._UserName = UserName
    }

    GetUserID() { return this._UserID }
    GetRoomID() { return this._RoomID }
    GetUserName() { return this._UserName }
}

module.exports = UserData