const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post(
  '/signup',
  passport.authenticate('signup', { session: false }),
  async (req, res, next) => {
    res.json({
      message: 'Signup successful',
      user: req.user
    });
  }
);


router.post(
  '/login',
  async (req, res, next) => {
    passport.authenticate(
      'login',
      async (err, user, info) => {
        try {
          if (err || !user) {
            const error = new Error('An error occurred.');

            return next(error);
          }

          req.login(
            user,
            // You set { session: false } because you do not want to store the user details in a session.
            // You expect the user to send the token on each request to the secure routes.
            { session: false },
            async (error) => {
              if (error) return next(error);

              // You store the id and email in the payload of the JWT.
              const body = { _id: user._id, email: user.email };
              // You then sign the token with a secret or key (TOP_SECRET).
              const token = jwt.sign({ user: body }, 'TOP_SECRET');

              return res.json({ token });
            }
          );
        } catch (error) {
          return next(error);
        }
      }
    )(req, res, next);
  }
);

module.exports = router;