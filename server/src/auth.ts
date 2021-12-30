import fs from 'fs';
import csvParser from 'csv-parser';
import { cwd } from 'process';
import passport from 'passport';
import passportJWT from 'passport-jwt';
import { JWT_SECRET } from './config';

const ExtractJwt = passportJWT.ExtractJwt;

const JwtStrategy = passportJWT.Strategy;

export const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

const strategy = new JwtStrategy(jwtOptions, (jwtPayload, next) => {
	let found = false;
	fs.createReadStream(cwd() + '/credentials.csv')
		.pipe(csvParser())
		.on('data', (data) => {
			if (!found && jwtPayload.username === data.username) {
        found = true;
        next(null, jwtPayload.username);
      }
    })
    .on('end', () => {
      if (!found) {
        next(null, null);
      }
    });
});

passport.use(strategy);
export { passport };