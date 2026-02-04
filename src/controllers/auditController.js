const AuditLog = require('../models/AuditLog');

const getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, userId, action } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (userId) query.userId = userId;
    if (action) query.action = action;

    const logs = await AuditLog.find(query)
      .populate('userId', 'name email')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await AuditLog.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Audit logs retrieved successfully',
      data: {
        logs,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: logs.length,
          overall: total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve audit logs',
      error: error.message
    });
  }
};

module.exports = {
  getAuditLogs
};
