const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: req.user
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
      error: error.message
    });
  }
};

module.exports = {
  getProfile
};
