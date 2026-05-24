import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {

    const token = req.cookies?.token;

    // CHECK TOKEN
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed. No token found.",
      });
    }

    // VERIFY TOKEN
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // CHECK DECODED USER
    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    // SAVE USER ID
    req.userId = decoded.userId;

    next();

  } catch (error) {

    console.log("isAuth Middleware Error:", error);

    return res.status(401).json({
      success: false,
      message: "Authentication failed.",
      error: error.message,
    });

  }
};

export default isAuth;