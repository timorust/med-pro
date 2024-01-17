/**@route POST/api/user/login */
/**@desc login */
/**@access Public */

const { prisma } = require("../prisma/prisma-client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Required field" });
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    const isPasswordCorrect =
      user && (await bcrypt.compare(password, user.password));
    const secret = process.env.JWT_SECRET;
    if (user && isPasswordCorrect && secret) {
      res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.name,
        token: jwt.sign({ id: user.id }, secret, { expiresIn: "1h" }),
      });
    } else {
      return res.status(400).json({ message: "login or password incorrect" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

/**@route POST/api/user/register */
/**@desc registration */
/**@access Public */

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Required field" });
    }

    const registerUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (registerUser) {
      return res
        .status(400)
        .json({ message: "a user with this EMAIL already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const secret = process.env.JWT_SECRET;
    if (user && secret) {
      res.status(200).json({
        id: user.id,
        email: user.email,
        name,
        token: jwt.sign({ id: user.id }, secret, { expiresIn: "1h" }),
      });
    } else {
      return res.status(400).json({ message: "User not created" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

/**@route POST/api/user/current */
/**@desc current User */
/**@access Privet */
const current = async (req, res) => {
  return res.status(200).json(req.user);
};

module.exports = {
  login,
  register,
  current,
};
