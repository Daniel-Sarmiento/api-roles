require('dotenv').config()
require('./src/configs/db.config');

const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const PORT = process.env.PORT;

// middlewares
app.use(express.json());
app.use(fileUpload());

// rutas
const usuariosRouter = require('./src/routes/usuarios.route');
const uploadsRouter = require('./src/routes/uploads.route');
const authRouter = require('./src/routes/auth.route');

app.use('/usuarios', usuariosRouter);
app.use('/uploads', uploadsRouter);
app.use('/auth', authRouter);

// escuchar conexiones
app.listen(PORT, () => {
    console.log(`API escuchando en el puerto ${PORT}`);
});