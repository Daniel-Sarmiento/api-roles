const mongoose = require('mongoose');

const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    imagenPerfil: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    updatedAt: {
        type: Date,
        default: null,
    },
    deleted: {
        type: Boolean,
        required: false,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
});

module.exports = mongoose.model('Usuario', usuarioSchema);