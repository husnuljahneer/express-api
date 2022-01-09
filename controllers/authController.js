const {
  createUser,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  loginUser
} = require('../services/authService');

const refreshTokenList = [];

exports.signup = async (req, res, next) => {
    const user = await createUser(req.body);
    const { id } = user;
    const accessToken = generateAccessToken({ id });
    const refreshToken = generateRefreshToken({ id });
    refreshTokenList.push(refreshToken);
    res.json({
        message : 'User has been created successfully',
        accessToken,
        refreshToken
    });
}

exports.login = async (req, res, next) => {
    const user = await loginUser(req.body);
    const { id } = user;
    const accessToken = generateAccessToken({ id });
    const refreshToken = generateRefreshToken({ id });
    refreshTokenList.push(refreshToken);
    res.json({
        message : 'User has been logged in successfully',
        accessToken,
        refreshToken
    });
}

exports.logout = async (req, res, next) => {
    const refreshToken = req.body.refreshToken;
    const index = refreshTokenList.indexOf(refreshToken);
    if (index > -1) {
        refreshTokenList.splice(index, 1);
    }
    res.json({
        message : 'User has been logged out successfully'
    });
}

exports.refreshToken = async (req, res, next) => {
    const refreshToken = req.body.refreshToken;
    const index = refreshTokenList.indexOf(refreshToken);
    if (index > -1) {
        const user = await verifyRefreshToken(refreshToken);
        const accessToken = generateAccessToken({ id: user.id });
        res.json({
            message : 'User has been refreshed successfully',
            accessToken
        });
    } else {
        res.status(401).json({
            message : 'Invalid refresh token'
        });
    }
}