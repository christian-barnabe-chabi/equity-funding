const Lending = require("../models/Lending");

const createLending = async (req, res, next) => {
  const lendingData = { ...req.body, userId: req.user.id };
  const lending = await Lending.create(lendingData).catch((error) => {
    res.status(500).send({ error: error.name });
    throw new Error(error);
  });

  return res.json(lending);
};

const updateLending = async (req, res, next) => {
  const lending = await Lending.update(req.body, {
    where: { id: req.params.lendingId },
  }).catch((error) => {
    res.status(500).send({ error: error.name });
    throw new Error(error);
  });

  return res.json(lending);
};

const deleteLending = async (req, res, next) => {
  const lending = await Lending.destroy({
    where: { id: req.params.lendingId },
  }).catch((error) => {
    res.status(500).send({ error: error.name });
    throw new Error(error);
  });

  return res.json(lending);
};

const getLendings = async (req, res, next) => {
  const lendings = await Lending.findAll({
    include: ["backer", "validator"],
  }).catch((error) => {
    res.status(500).send({ error: error.name });
    throw new Error(error);
  });

  return res.json(lendings);
};

const getLending = async (req, res, next) => {
  const lendings = await Lending.findOne({
    where: { id: req.params.lendingId },
    order: [["updatedAt", "DESC"]],
    include: ["backer", "validator"],
  }).catch((error) => {
    res.status(500).send({ error: error.name });
    throw new Error(error);
  });

  return res.json(lendings);
};

const getMyLendings = async (req, res, next) => {
  const lendings = await Lending.findAll({
    where: { userId: req.user.id },
    order: [["updatedAt", "DESC"]],
    include: ["backer", "validator"],
  }).catch((error) => {
    res.status(500).send({ error: error.name });
    throw new Error(error);
  });

  return res.json(lendings);
};

module.exports = {
  createLending,
  updateLending,
  getLendings,
  getLending,
  getMyLendings,
  deleteLending,
};
