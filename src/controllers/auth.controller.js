const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const usuarioEncontrado = await Usuario.findOne({email, deleted: false});
        
        if (!usuarioEncontrado) {
            return res.status(400).json({
                message: "email o contraseña incorrecta"
            });
        }
       
        const passwordCorrecto = bcrypt.compareSync(password, usuarioEncontrado.password)
        
        if (!passwordCorrecto) {
            return res.status(400).json({
                message: "email o contraseña incorrecta"
            });
        }

        const payload = {
            usuario: {
                _id: usuarioEncontrado.id,
                nombre: usuarioEncontrado.nombre,
                email: usuarioEncontrado.email,
                //roleId: usuarioEncontrado.roleId
            }
        }
        const token = jwt.sign(payload, jwtSecret, {expiresIn: '1h'});

        return res.status(200).json({
            message: "acceso correcto",
            token
        });


    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al intentar loguearse",
            error: error.message
        })
    }
};

module.exports = {
    login
}