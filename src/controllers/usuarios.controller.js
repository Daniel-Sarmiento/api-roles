const bcrypt = require('bcrypt');
const saltosBcrypt = parseInt(process.env.SALTOS_BCRYPT);
const Usuario = require('../models/usuario.model');
const uploadsHelper = require('../helpers/uploads.helper');

const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page); // número de página
        const limit = parseInt(req.query.limit); // documentos por página
        const skip = (page - 1) * limit; // documentos a omitir para llegar a la página solicitada

        const usuarios = await Usuario.find({ deleted: false }).skip(skip).limit(limit);

        let response = {
            message: "se obtuvieron los usuarios correctamente",
            data: usuarios
        };

        if (page && limit) {
            const totalUsuarios = await Usuario.countDocuments();
            response = {
                ...response,
                total: totalUsuarios,
                totalPages: Math.ceil(totalUsuarios / limit),
                currentPage: page
            };
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener los usuarios"
        });
    }
};

const getById = async (req, res) => {
    try {
        const usuarioId = req.params.id;
        const usuario = await Usuario.findById(usuarioId);

        if (!usuario) {
            return res.status(404).json({
                message: "usuario no encontrado"
            })
        }

        return res.status(200).json({
            message: "usuario encontrado exitosamente",
            usuario
        })

    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener el usuario",
            error: error.message
        })
    }
};

const create = async (req, res) => {
    try {
        let usuario = new Usuario({
            nombre: req.body.nombre,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, saltosBcrypt)
        });

        await usuario.save()

        return res.status(201).json({
            message: "usuario creado exitosamente",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al crear el usuario",
            error: error.message
        });
    }
};

const updateCompleto = async (req, res) => {
    try {
        const usuarioId = req.params.id;
        const datosActualizar = {
            nombre: req.body.nombre || null,
            email: req.body.email || null,
            password: req.body.password || null,
            updatedAt: new Date()
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(usuarioId, datosActualizar);
        if (!usuarioActualizado) {
            return res.status(404).json({
                message: "usuario no encontrado",
            });
        }

        return res.status(200).json({
            message: "usuario actualizado exitosamente",
            datosActualizar
        })

    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al actualizar el usuario"
        });
    }
};

const updateParcial = async (req, res) => {
    try {
        const usuarioId = req.params.id;
        const datosActualizar = {
            ...req.body,
            updatedAt: new Date()
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(usuarioId, datosActualizar);
        if (!usuarioActualizado) {
            return res.status(404).json({
                message: "usuario no encontrado"
            });
        }

        return res.status(200).json({
            message: "usuario actualizado exitosamente",
        })

    } catch (error) {
        return res.status(500).json({
            message: "error al actualizar usuario",
            error: error.message
        });
    }
};

const updateImagenPerfil = async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length == 0 || !req.files.imagen) {
            return res.status(400).json({
                message: "la imagen es requerida"
            });
        }

        const idUsuario = req.params.id;
        const usuarioEncontrado = await Usuario.findById(idUsuario);

        if (!usuarioEncontrado) {
            return res.status(404).json({
                message: "usuario no encontrado"
            });
        }

        const imagen = req.files.imagen;
        const extension = imagen.name.split(".").reverse()[0];
        const nombreImagen = `${idUsuario}${Date.now()}.${extension}`;

        await uploadsHelper.guardarArchivo(imagen, nombreImagen);
        
        usuarioEncontrado.imagenPerfil = nombreImagen;
        await usuarioEncontrado.save();

        return res.status(200).json({
            message: "imagen de perfil actualizada",
            nombre: nombreImagen
        });

    } catch (error) {
        return res.status(500).json({
            message: "error al actualizar foto de perfil del usuario",
            error: error.message
        });
    }
}

const updateImagenPerfilB64 = async (req, res) => {
    try {
        const { b64, extension } = req.body;

        if (!b64 || !extension) {
            return res.status(400).json({
                message: "b64 y extensión son requeridos"
            });
        }

        const idUsuario = req.params.id;
        const usuarioEncontrado = await Usuario.findById(idUsuario);

        if (!usuarioEncontrado) {
            return res.status(404).json({
                message: "usuario no encontrado"
            });
        }

        const nombreImagen = `${idUsuario}${Date.now()}.${extension}`;
        uploadsHelper.guardarArchivoB64(b64, nombreImagen);

        usuarioEncontrado.imagenPerfil = nombreImagen;
        await usuarioEncontrado.save();

        return res.status(200).json({
            message: "imagen de perfil actualizada",
            nombre: nombreImagen
        });

    } catch (error) {
        return res.status(500).json({
            message: "error al actualizar foto de perfil del usuario",
            error: error.message
        });
    }
}

const deleteLogico = async (req, res) => {
    try {
        const usuarioId = req.params.id;
        const usuarioEliminado = await Usuario.findByIdAndUpdate(usuarioId, { deleted: true, deletedAt: new Date(), deletedBy: req.usuario._id });

        if (!usuarioEliminado) {
            return res.status(404).json({
                message: "usuario no encontrado"
            });
        }

        return res.status(200).json({
            message: "usuario eliminado exitosamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al eliminar el usuario",
            error: error.message
        });
    }

};

const deleteFisico = async (req, res) => {
    try {
        const usuarioId = req.params.id;
        const usuarioEliminado = await Usuario.findByIdAndDelete(usuarioId)

        if (!usuarioEliminado) {
            return res.status(404).json({
                message: "usuario no encontrado"
            });
        }

        return res.status(200).json({
            message: "usuario eliminado fisicamente exitosamente",
        })

    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al eliminar el usuario",
            error: error.message
        })
    }
};

module.exports = {
    index,
    getById,
    create,
    updateCompleto,
    updateParcial,
    delete: deleteLogico,
    updateImagenPerfil,
    updateImagenPerfilB64,
};