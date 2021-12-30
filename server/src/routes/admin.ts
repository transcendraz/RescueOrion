import express from 'express';
import csvParser from 'csv-parser';
import fs from 'fs';
import { cwd } from 'process';
import jwt from 'jsonwebtoken';
import { jwtOptions } from '../auth';

export default (router: express.Router) => {
	router.post('/login', (req, res) => {
		const username=req.body.username;
		const password=req.body.password;
		let found = false;

		// compare username, password with csv file
		fs.createReadStream(cwd() + '/credentials.csv')
		.pipe(csvParser())
		.on('data', (data) => {
			if(username === data.username){
				found=true;
				if(password === data.password){
					const token = jwt.sign({
						username,
					}, jwtOptions.secretOrKey);
					res.status(200).send({ token });
				}else{
					res.status(401).send('Wrong password for user: ' + username);
					console.log('Wrong password for user: ' + username);
				}
			}
		})
		.on('end', () => {
			if(!found){
				res.status(401).send('Unauthorized user: '+ username);
				console.log('Unauthorized user: '+ username);
			}
		});
	});

}