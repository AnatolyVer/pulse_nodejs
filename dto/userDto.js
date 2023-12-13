export default class userDto{
    nickname
    username
    avatar_url
    bio
    chats
    _id
    constructor(user) {
        this._id = user._id
        this.nickname = user.nickname
        this.username = user.username
        this.avatar_url = user.avatar_url
        this.bio = user.bio
        this.chats = user.chats
    }
}