const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');


router.get('/', authMiddleware.verificarJWT, roleMiddleware.verificarRol([1, 2]), usuariosController.index);
router.get('/:id', authMiddleware.verificarJWT, roleMiddleware.verificarRol([1, 2]), usuariosController.getById)
router.post('/', authMiddleware.verificarJWT, roleMiddleware.verificarRol([1]), usuariosController.create);
router.put('/:id', authMiddleware.verificarJWT, usuariosController.updateCompleto);
router.put('/:id/imagen-perfil', usuariosController.updateImagenPerfil);
router.put('/:id/imagen-perfil-b64', usuariosController.updateImagenPerfilB64);
router.patch('/:id', authMiddleware.verificarJWT, usuariosController.updateParcial);
router.delete('/:id', authMiddleware.verificarJWT, usuariosController.delete);

module.exports = router;