import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../modules/user';
import { Password } from '../services/password';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        throw new BadRequestError('Invalid Credentials');
      }
      const isMatch = await Password.compare(existingUser.password, password);
      if (!isMatch) {
        throw new BadRequestError('Invalid Credentials');
      }
      const userJwt = jwt.sign(
        {
          id: existingUser.id,
          email: existingUser.email,
        },
        process.env.JWT_KEY!
      );
      req.session = {
        jwt: userJwt,
      };
      res.status(200).send(existingUser);
    } catch (error) {
      console.log(error);
    }
  }
);

export { router as signinRouter };
