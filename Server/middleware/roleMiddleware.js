const ensureRole = (requiredRole) => {
    return (req, res, next) => {
      if (req.user?.role !== requiredRole) {
        return res.status(403).json({ message: `Access denied. ${requiredRole} role required.` });
      }
      next();
    };
  };
  
  module.exports = ensureRole;
  