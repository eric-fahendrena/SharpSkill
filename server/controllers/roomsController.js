/**
 * @module 	roomsController
 */

import Room from '../models/Room.model.js';

/**
 * Add room data to database.
 * 
 * @name 	createRoom
 * @param 	{Request} req - Express request object
 * @param 	{Response} res - Express response object
 * @return	{Object} - Json object of created room
 */
export const createRoom = async (req, res) => {
	try {
		const newRoom = await Room.create(req.body);
		res.status(201).json(newRoom);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
}

/**
 * Remove room from database
 * 
 * @name	deleteRoom
 * @param 	{Request} req - Express request object
 * @param 	{Response} res - Express response object
 * @return	{Object} - Json object of message
 */
export const deleteRoom = async (req, res) => {
	try {
		const roomId = req.params.id;
		const deleteRoom = await Room.findByIdAndDelete(roomId);

		if (!deleteRoom) {
			return res.status(404).json({ message: 'Room not found' });
		}

		res.status(200).json({ message: 'Room deleted successfully' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
}

/**
 * Get room
 * 
 * @name	getRoom
 * @param 	{Request} req - Express request object
 * @param 	{Response} res - Express response object
 * @return 	{Object} - Json object of the room
 */
export const getRoom = async (req, res) => {
	try {
		const roomId = req.params.id;
		const room = await Room.findById(roomId);

		if (!room) {
			return res.status(404).json({ message: 'Room not found' });
		}

		res.status(200).json(room);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
}

/**
 * Get all rooms from database
 * 
 * @name	getRooms
 * @param 	{Request} req - Express request object
 * @param 	{Response} res - Express response object
 * @return	{Object} -Json object of all rooms
 */
export const getRooms = async (req, res) => {
	try {
		const rooms = await Room.find({});
		res.status(200).json(rooms);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
}
