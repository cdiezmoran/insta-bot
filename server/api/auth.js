import { Router } from 'express';
import jwt from 'jsonwebtoken';

import User from '../models/user';

const router = Router();

router.post('/login', ({ body: { email, password } }, res) => {
  User.findOne({ email }, (err, user) => {
    if (!user) return res.status(401).send({ message: 'There is no user with that email.' });
    user.comparePassword(password, (err2, isMatch) => {
      if (!isMatch) return res.status(401).send({ message: 'Password is incorrect.' });
      const { _id, username, email: usrEmail } = user;
      const token = jwt.sign({ id: _id, username, email: usrEmail }, process.env.JWT_SECRET);
      res.status(200).send({ token });
    })
  });
});

router.post('/sign-up', ({ body }, res) => {
  User.findOne({ email: body.email }, (err, user) => {
    const newUser = new User(body);

    if (user) return res.status(401).send({ message: 'Email already in use.' });

    newUser.save((err2) => {
      if (err2) { return res.status(400).send({ message: err }) }
      const { _id, username, email } = newUser;
      const token = jwt.sign({ id: _id, username, email }, process.env.JWT_SECRET);
      res.status(200).send({ token });
    });
  });
});

export default router;
