const allowPosition = (positions) => {
  return (req, res, next) => {
    if (!req.employees) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const employeesPosition = req.employees.position.position_name

    if (!positions.includes(employeesPosition)) {
      return res.status(403).json({
        message: "Forbidden",
        yourPosition: employeesPosition,
        allowed: positions,
      });
    }

    next();
  };
};

export default allowPosition;