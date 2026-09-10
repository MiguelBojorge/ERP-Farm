/**
 * middleware/roleCheck.js
 * Control de acceso por rol (ADMIN, EMPLEADO, CLIENTE), equivalente a las
 * permission_classes de DRF pero explicito por ruta.
 * Uso: router.post('/', requireAuth, requireRole('ADMIN', 'EMPLEADO'), controller.crear)
 */
function requireRole(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ detail: 'Se requiere autenticacion.' });
    }
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ detail: 'No tiene permisos para realizar esta accion.' });
    }
    return next();
  };
}

module.exports = { requireRole };
