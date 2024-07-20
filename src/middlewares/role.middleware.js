const verificarRol = (roles) => {
    return (req, res) => {
        const usuario = req.usuario;

        if (!roles.includes(usuario.roleId)) {
            return res.status(401).send({
                message: "usuario no autorizado",
                error: err.message
            });
        }

        next();
    }
}

module.expors = {
    verificarRol
}