import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.model.js';

/**
 * Sign up
 * 
 * @name 	signup
 * @param 	{Request} req - Express request object
 * @param 	{Response} res - Express response object
 * @return	{Object} -Json object that contains token
 */
export const signup = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { Name, Email, Password, Contact_no, Is_verified } = req.body;

	try {
		let user = await User.findOne({ Email });
		if (user) {
			return res.status(400).json({ msg: 'User with the same email address already exists!' });
		}
		user = await User.findOne({ Contact_no });
		if (user) {
			return res.status(400).json({ msg: 'User with the same phone number already exists!' });
		}

		user = new User({ Name, Email, Password, Contact_no });

		// pwd crypt
		const salt = await bcrypt.genSalt(10);
		user.Password = await bcrypt.hash(Password, salt);

		await user.save();

		// create and send JWT token

		const payload = { user: { id: user.id }};
		jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
			if (err) throw err;
			res.json({ token });
		});
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
}

/**
 * Login
 * 
 * @name 	login
 * @param 	{Request} req - Express request object
 * @param 	{Response} res - Express response object
 * @return	{Object} -Json object that contains token
 */
export const login = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { Email, Password } = req.body;

	try {
		let user = await User.findOne({ Email });
		if (!user) {
			return res.status(400).json({ msg: 'Invalid Credentials' });
		}
		
		// verify password
		const isMatch = await bcrypt.compare(Password, user.Password);
		if (!isMatch) {
			return res.status(400).json({ msg: 'Invalid Credentials' });
		}

		const payload = { user: { id: user.id } };
		jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
			if (err) throw err;
			res.json({ token });
		})
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
}
