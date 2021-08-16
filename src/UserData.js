class UserData
{
    constructor(UserID, RoomID, UserName)
    {
        this._UserID = UserID
        this._RoomID = RoomID
        this._UserName = UserName
        this._IsEscape = false
    }

    Escape() { this._IsEscape = true }

    GetUserID() { return this._UserID }
    GetRoomID() { return this._RoomID }
    GetUserName() { return this._UserName }
    IsEscape() { return this._IsEscape }
}

module.exports = UserData