const {
  createUser,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  loginUser
} = require('../services/authService');

const refreshTokenList = [];

exports.signup = async (req, res, next) => {
    try {
      if(req.body.email == '' || req.body.password == '' || req.body.name == ''){
          return res.status(400).json({
              message: 'Please fill all the fields'
          });
      }
      
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
    } catch (err) {
      next(err);
      res.status(400).json({
          message: err.message
      });
    }
}

exports.login = async (req, res, next) => {
  try {
    if(req.body.email == '' || req.body.password == '') {
      return res.status(400).json({
        message: 'Please enter email and password'
      });
    }
      const emailData = req.body;
      console.log(emailData);
      const user = await loginUser(req.body);
      const { email } = user
      console.log(user);
      const accessToken = generateAccessToken({ email });
      const refreshToken = generateRefreshToken({ email });
      refreshTokenList.push(refreshToken);
      res.json({
          message : 'User has been logged in successfully',
          accessToken,
          refreshToken
      });
  } catch (err) {
    next(err);
    res.status(400).json({
      message: 'Invalid email or password'
    });
  }
  
}

exports.logout = async (req, res, next) => {
    try {
      const refreshToken = req.body.refreshToken;
      const index = refreshTokenList.indexOf(refreshToken);
      if (index > -1) {
          refreshTokenList.splice(index, 1);
      }
      res.json({
          message : 'User has been logged out successfully'
      });
    } catch (err) {
      next(err);
      res.status(400).json({
        message: err.message
      });
    }
}

exports.refreshToken = async (req, res, next) => {
    try {
      const refreshToken = req.body.refreshToken;
      const index = refreshTokenList.indexOf(refreshToken);
      if (index > -1) {
          const user = await verifyRefreshToken(refreshToken);
          const accessToken = generateAccessToken({ email: user.email });
          res.json({
              message : 'User has been refreshed successfully',
              accessToken
          });
      } else {
          res.status(401).json({
              message : 'Invalid refresh token'
          });
      }
    } catch (err) {
      next(err);
      res.status(401).json({
        message : 'Invalid refresh token'
      });
    }
}