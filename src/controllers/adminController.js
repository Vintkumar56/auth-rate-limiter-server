const getDashboard = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Admin dashboard accessed successfully',
      data: {
        admin: req.user,
        dashboard: {
          totalUsers: 0,
          activeSessions: 0,
          systemStatus: 'operational'
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard',
      error: error.message
    });
  }
};

module.exports = {
  getDashboard
};
