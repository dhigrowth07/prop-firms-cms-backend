const { Asset, AccountType, EvaluationStage, sequelize } = require("../config/connectDB");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const { QueryTypes } = require("sequelize");

// Combined prop config
const listPropConfig = async (req, res) => {
  try {
    const [assets, accountTypes, evaluationStages] = await Promise.all([Asset.findAll(), AccountType.findAll(), EvaluationStage.findAll()]);

    return successResponse(res, "Prop config fetched successfully", 200, {
      assets,
      accountTypes,
      evaluationStages,
    });
  } catch (err) {
    return errorResponse(res, "Failed to fetch prop config", 500, err);
  }
};

// Assets
const listAssets = async (req, res) => {
  try {
    const assets = await Asset.findAll();
    return successResponse(res, "Assets fetched successfully", 200, { assets });
  } catch (err) {
    return errorResponse(res, "Failed to fetch assets", 500, err);
  }
};

const createAsset = async (req, res) => {
  try {
    const asset = await Asset.create(req.body);
    return successResponse(res, "Asset created successfully", 201, { asset });
  } catch (err) {
    return errorResponse(res, "Failed to create asset", 500, err);
  }
};

const updateAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await Asset.findByPk(id);
    if (!asset) {
      return errorResponse(res, "Asset not found", 404);
    }
    await asset.update(req.body);
    return successResponse(res, "Asset updated successfully", 200, { asset });
  } catch (err) {
    return errorResponse(res, "Failed to update asset", 500, err);
  }
};

const toggleAssetActive = async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await Asset.findByPk(id);
    if (!asset) {
      return errorResponse(res, "Asset not found", 404);
    }

    asset.is_active = !asset.is_active;
    await asset.save();

    return successResponse(res, "Asset status updated successfully", 200, { asset });
  } catch (err) {
    return errorResponse(res, "Failed to update asset status", 500, err);
  }
};

// Account Types
const listAccountTypes = async (req, res) => {
  try {
    const accountTypes = await AccountType.findAll();
    return successResponse(res, "Account types fetched successfully", 200, { accountTypes });
  } catch (err) {
    return errorResponse(res, "Failed to fetch account types", 500, err);
  }
};

const createAccountType = async (req, res) => {
  try {
    const accountType = await AccountType.create(req.body);
    return successResponse(res, "Account type created successfully", 201, { accountType });
  } catch (err) {
    return errorResponse(res, "Failed to create account type", 500, err);
  }
};

const updateAccountType = async (req, res) => {
  try {
    const { id } = req.params;
    const accountType = await AccountType.findByPk(id);
    if (!accountType) {
      return errorResponse(res, "Account type not found", 404);
    }
    await accountType.update(req.body);
    return successResponse(res, "Account type updated successfully", 200, { accountType });
  } catch (err) {
    return errorResponse(res, "Failed to update account type", 500, err);
  }
};

// Evaluation Stages
const listEvaluationStages = async (req, res) => {
  try {
    const evaluationStages = await EvaluationStage.findAll();
    return successResponse(res, "Evaluation stages fetched successfully", 200, { evaluationStages });
  } catch (err) {
    return errorResponse(res, "Failed to fetch evaluation stages", 500, err);
  }
};

const createEvaluationStage = async (req, res) => {
  try {
    const evaluationStage = await EvaluationStage.create(req.body);
    return successResponse(res, "Evaluation stage created successfully", 201, { evaluationStage });
  } catch (err) {
    return errorResponse(res, "Failed to create evaluation stage", 500, err);
  }
};

const updateEvaluationStage = async (req, res) => {
  try {
    const { id } = req.params;
    const evaluationStage = await EvaluationStage.findByPk(id);
    if (!evaluationStage) {
      return errorResponse(res, "Evaluation stage not found", 404);
    }
    await evaluationStage.update(req.body);
    return successResponse(res, "Evaluation stage updated successfully", 200, { evaluationStage });
  } catch (err) {
    return errorResponse(res, "Failed to update evaluation stage", 500, err);
  }
};

const deleteAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await Asset.findByPk(id);

    if (!asset) {
      return errorResponse(res, "Asset not found", 404);
    }

    // Check if any firms are using this asset
    const firmsCountRows = await sequelize.query(`SELECT COUNT(*)::int as count FROM firm_assets WHERE asset_id = :assetId`, { replacements: { assetId: id }, type: QueryTypes.SELECT });

    const firmsCountValue = Array.isArray(firmsCountRows) && firmsCountRows[0] && typeof firmsCountRows[0].count === "number" ? firmsCountRows[0].count : 0;

    if (firmsCountValue > 0) {
      return errorResponse(res, `Cannot delete asset: It is associated with ${firmsCountValue} firm(s). Please remove associations first.`, 400);
    }

    await asset.destroy();
    return successResponse(res, "Asset deleted successfully", 200);
  } catch (err) {
    return errorResponse(res, "Failed to delete asset", 500, err);
  }
};

const deleteAccountType = async (req, res) => {
  try {
    const { id } = req.params;
    const accountType = await AccountType.findByPk(id);

    if (!accountType) {
      return errorResponse(res, "Account type not found", 404);
    }

    // Check if it has evaluation stages or coupon associations
    const evaluationStagesRows = await sequelize.query(`SELECT COUNT(*)::int as count FROM evaluation_stages WHERE account_type_id = :accountTypeId`, {
      replacements: { accountTypeId: id },
      type: QueryTypes.SELECT,
    });

    const couponsRows = await sequelize.query(`SELECT COUNT(*)::int as count FROM coupon_account_types WHERE account_type_id = :accountTypeId`, {
      replacements: { accountTypeId: id },
      type: QueryTypes.SELECT,
    });

    const evaluationStagesCount =
      Array.isArray(evaluationStagesRows) && evaluationStagesRows[0] && Object.prototype.hasOwnProperty.call(evaluationStagesRows[0], "count") ? evaluationStagesRows[0].count : 0;

    const couponsCount = Array.isArray(couponsRows) && couponsRows[0] && Object.prototype.hasOwnProperty.call(couponsRows[0], "count") ? couponsRows[0].count : 0;

    const totalAssociations = evaluationStagesCount + couponsCount;

    if (totalAssociations > 0) {
      return errorResponse(res, `Cannot delete account type: It has ${evaluationStagesCount} evaluation stage(s) and ${couponsCount} coupon association(s). Please remove associations first.`, 400);
    }

    await accountType.destroy();
    return successResponse(res, "Account type deleted successfully", 200);
  } catch (err) {
    return errorResponse(res, "Failed to delete account type", 500, err);
  }
};

const deleteEvaluationStage = async (req, res) => {
  try {
    const { id } = req.params;
    const evaluationStage = await EvaluationStage.findByPk(id);

    if (!evaluationStage) {
      return errorResponse(res, "Evaluation stage not found", 404);
    }

    await evaluationStage.destroy();
    return successResponse(res, "Evaluation stage deleted successfully", 200);
  } catch (err) {
    return errorResponse(res, "Failed to delete evaluation stage", 500, err);
  }
};

module.exports = {
  listPropConfig,
  listAssets,
  createAsset,
  updateAsset,
  toggleAssetActive,
  listAccountTypes,
  createAccountType,
  updateAccountType,
  listEvaluationStages,
  createEvaluationStage,
  updateEvaluationStage,
  deleteAsset,
  deleteAccountType,
  deleteEvaluationStage,
};
