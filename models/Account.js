const { model, Schema } = require('mongoose')

module.exports = model("TAccount", new Schema({
    UserID: String,
    Name: String,
    Password: String,
    Recovery: String
}))