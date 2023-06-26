const mongoose = require('mongoose')

const archivedUserSchema = new mongoose.Schema({

    username: {
        type: String,
    },
    deletedAt: {
        type: Date, default: Date.now
    },

    purchase: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'purchase'
    }
})

const archivedUsers = mongoose.model('ArchivedUser', archivedUserSchema)

module.exports = archivedUsers