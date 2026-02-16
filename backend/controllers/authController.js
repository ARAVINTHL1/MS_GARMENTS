import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Buyer from '../models/Buyer.js';
import Employee from '../models/Employee.js';

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Login user (admin or buyer)
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Please provide email, password, and role' });
    }

    let user;
    
    if (role === 'admin') {
      user = await Admin.findOne({ email });
    } else if (role === 'buyer') {
      user = await Buyer.findOne({ email });
    } else if (role === 'employee') {
      user = await Employee.findOne({ email });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (user && (await user.matchPassword(password))) {
      const response = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      };
      
      // Add employee-specific fields
      if (role === 'employee') {
        response.employeeId = user.employeeId;
        response.department = user.department;
      }
      
      res.json(response);
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register buyer
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    // Check if buyer already exists
    const buyerExists = await Buyer.findOne({ email });

    if (buyerExists) {
      return res.status(400).json({ message: 'Buyer already exists' });
    }

    // Create buyer
    const buyer = await Buyer.create({
      name,
      email,
      password,
      phone,
      address,
    });

    if (buyer) {
      res.status(201).json({
        _id: buyer._id,
        name: buyer.name,
        email: buyer.email,
        role: buyer.role,
        token: generateToken(buyer._id, buyer.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid buyer data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const admin = await Admin.findById(req.user.id).select('-password');
      res.json(admin);
    } else if (req.user.role === 'employee') {
      const employee = await Employee.findById(req.user.id).select('-password');
      res.json(employee);
    } else {
      const buyer = await Buyer.findById(req.user.id).select('-password');
      res.json(buyer);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register employee
// @route   POST /api/auth/employee-signup
// @access  Public
export const employeeSignup = async (req, res) => {
  try {
    const { name, email, password, phone, employeeId, department } = req.body;

    if (!name || !email || !password || !employeeId) {
      return res.status(400).json({ message: 'Please provide name, email, password, and employee ID' });
    }

    // Check if employee already exists
    const employeeExists = await Employee.findOne({ $or: [{ email }, { employeeId }] });

    if (employeeExists) {
      return res.status(400).json({ message: 'Employee already exists with this email or employee ID' });
    }

    // Create employee
    const employee = await Employee.create({
      name,
      email,
      password,
      phone,
      employeeId,
      department: department || 'sales',
    });

    if (employee) {
      res.status(201).json({
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        employeeId: employee.employeeId,
        department: employee.department,
        role: employee.role,
        token: generateToken(employee._id, employee.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid employee data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
