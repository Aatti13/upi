// Imports
import mongoose from 'mongoose';

// User Schema Definition
// This schema defines the structure of the User document in MongoDB.
/**
 *  @file user.model.js
 *  @description This file defines the User schema for MongoDB using Mongoose.
 *  It includes fields for name, email, password, and phone number.
 *  The email field is unique and the password field is hashed before saving.
 * @field {String} name - The name of the user, required and trimmed.
 * @field {String} email - The email of the user, required, unique, lowercase, and trimmed.
 * @field {String} password - The password of the user, required and must be at least 6 characters long.
 * @field {String} phoneNo - The phone number of the user, required.
 * @returns {User} User model for interacting with the users collection in MongoDB.
 * @example
 * const User = require('./user.model');
 * const newUser = new User({ name: 'John Doe', email: '
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phoneNo: {
    type:String,
    required: true
  },
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;