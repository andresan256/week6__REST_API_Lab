const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Load the Week 4 MongoDB CRUD functions if Week4Lab.js is in this folder.
let dbFunctions = {};
try {
  dbFunctions = require('./Week4Lab');
} catch (err) {
  console.warn('Week4Lab.js not found. JSON/form exercises will work; MongoDB routes need Week4Lab.js.');
}

// Exercise 1: basic route
app.get('/', (req, res) => {
  res.send('Hello! This is my first Express application.');
});

// Exercise 2: additional routes and URL parameters
app.get('/about', (req, res) => {
  res.send('This is a basic Express application');
});

app.get('/users/:userId/books/:bookId', (req, res) => {
  res.json(req.params);
});

// Exercise 3: read all students from Students.json
app.get('/GetStudents', (req, res) => {
  fs.readFile(path.join(__dirname, 'Students.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ status: false, statusCode: 500, message: 'Error reading Students.json' });
    }
    try {
      res.status(200).json({
        status: true,
        statusCode: 200,
        requestedAt: new Date().toISOString(),
        requestUrl: req.originalUrl,
        requestMethod: req.method,
        studentData: JSON.parse(data)
      });
    } catch (parseErr) {
      res.status(500).json({ status: false, message: 'Students.json contains invalid JSON.' });
    }
  });
});

// Find one student by ID: /GetStudent/1, /GetStudent/2, etc.
app.get('/GetStudent/:id', (req, res) => {
  fs.readFile(path.join(__dirname, 'Students.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).json({ status: false, statusCode: 500, message: 'Error reading Students.json' });
    try {
      const students = JSON.parse(data);
      const student = students[`Student${req.params.id}`];
      if (student) return res.status(200).json(student);
      return res.status(404).json({
        status: false,
        statusCode: 404,
        message: 'Student Not Found',
        requestedAt: new Date().toISOString(),
        requestUrl: req.originalUrl,
        requestMethod: req.method
      });
    } catch (parseErr) {
      return res.status(500).json({ status: false, message: 'Students.json contains invalid JSON.' });
    }
  });
});

// Student HTML form and POST handler
app.get('/studentinfo', (req, res) => {
  res.sendFile(path.join(__dirname, 'StudentInfo.html'));
});

app.post('/submit-data', (req, res) => {
  const qualifications = req.body.Qual;
  res.status(200).json({
    status: true,
    message: 'Form Details',
    data: {
      name: `${req.body.firstName || ''} ${req.body.lastName || ''}`.trim(),
      age: req.body.myAge || '',
      gender: req.body.gender || 'Not specified',
      qualification: Array.isArray(qualifications) ? qualifications : (qualifications ? [qualifications] : [])
    }
  });
});

// Show employee form (MongoDB exercise)
app.get('/Showform', (req, res) => {
  res.sendFile(path.join(__dirname, 'PersonForm.html'));
});

// POST: insert one employee into MongoDB via Week4Lab.js
app.post('/insertOne', async (req, res) => {
  if (typeof dbFunctions.insertOne !== 'function') {
    return res.status(501).json({ status: false, message: 'Add your Week4Lab.js file with an exported insertOne function.' });
  }
  try {
    const result = await dbFunctions.insertOne(req.body.name, req.body.age, req.body.gender, req.body.salary);
    res.status(201).json({ status: true, message: 'Person inserted successfully', data: result });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
});

// GET: retrieve all employees
app.get('/persons', async (req, res) => {
  if (typeof dbFunctions.findAll !== 'function') {
    return res.status(501).json({ status: false, message: 'Add your Week4Lab.js file with an exported findAll function.' });
  }
  try {
    const result = await dbFunctions.findAll();
    res.json(result);
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
});

// Portfolio endpoint: count all employee documents
app.get('/persons/count', async (req, res) => {
  if (typeof dbFunctions.countDocuments !== 'function') {
    return res.status(501).json({ status: false, message: 'countDocuments function is not available in Week4Lab.js.' });
  }
  try {
    const result = await dbFunctions.countDocuments();
    res.json({ status: true, result });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
});

// Portfolio endpoint: female employees aged 30 or above
app.get('/persons/females-over-30', async (req, res) => {
  if (typeof dbFunctions.findFemalesOver30 !== 'function') {
    return res.status(501).json({ status: false, message: 'findFemalesOver30 function is not available in Week4Lab.js.' });
  }
  try {
    const result = await dbFunctions.findFemalesOver30();
    res.json(result);
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
});

// Connect to Atlas only when MONGO_URI is set in the environment.
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err.message));
} else {
  console.warn('MONGO_URI is not set. MongoDB routes will not work until you configure it.');
}

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
