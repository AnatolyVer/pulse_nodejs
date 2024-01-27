export class userDto{
    nickname
    username
    avatar_url
    bio
    chats
    _id
    online
    last_seen
    constructor(user) {
        this._id = user._id
        this.nickname = user.nickname
        this.username = user.username
        this.avatar_url = user.avatar_url
        this.bio = user.bio
        this.chats = user.chats
        this.online = user.online
        this.last_seen = user.last_seen
    }
}

export class PublicUserDto{
    nickname
    username
    avatar_url
    bio
    _id
    online
    last_seen
    constructor(user) {
        this._id = user._id
        this.nickname = user.nickname
        this.username = user.username
        this.avatar_url = user.avatar_url
        this.bio = user.bio
        this.online = user.online
        this.last_seen = user.last_seen
    }
}

