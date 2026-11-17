const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Initial in-memory data
let students = [
  {
    id: 201,
    rollNumber: "CSE2401",
    name: "Aarav Sharma",
    branch: "CSE",
    semester: 3,
    email: "aarav@example.com"
  },
  {
    id: 202,
    rollNumber: "ECE2402",
    name: "Diya Verma",
    branch: "ECE",
    semester: 3,
    email: "diya@example.com"
  },
  {
    id: 203,
    rollNumber: "CSE2403",
    name: "Kabir Singh",
    branch: "CSE",
    semester: 3,
    email: "kabir@example.com"
  }
];

// Helper function for input validation
function validateStudent(data) {
  const { rollNumber, name, branch, semester, email } = data;
  if (
    typeof rollNumber !== 'string' || rollNumber.trim() === '' ||
    typeof name !== 'string' || name.trim() === '' ||
    typeof branch !== 'string' || branch.trim() === '' ||
    typeof semester !== 'number' || Number.isNaN(semester) ||
    typeof email !== 'string' || email.trim() === ''
  ) {
    return false;
  }
  return true;
}

// 1. GET all records
app.get('/api/students', (req, res) => {
  res.status(200).json(students);
});

// 6. Filter records by branch (Placed BEFORE /:id route)
app.get('/api/students/filter', (req, res) => {
  const { branch } = req.query;
  if (!branch) {
    return res.status(400).json({ message: "Query parameter 'branch' is required." });
  }
  const filtered = students.filter(
    (s) => s.branch.toLowerCase() === branch.toLowerCase()
  );
  res.status(200).json(filtered);
});

// 3. GET record by ID
app.get('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({ message: `Student with ID ${id} not found.` });
  }
  res.status(200).json(student);
});

// 2. POST a new record
app.post('/api/students', (req, res) => {
  if (!validateStudent(req.body)) {
    return res.status(400).json({
      message: "Invalid input. Ensure rollNumber, name, branch, email (strings) and semester (number) are provided."
    });
  }

  const { rollNumber, name, branch, semester, email } = req.body;

  // Check for duplicate rollNumber
  const exists = students.some(
    (s) => s.rollNumber.toLowerCase() === rollNumber.trim().toLowerCase()
  );
  if (exists) {
    return res.status(400).json({ message: "Student with this rollNumber already exists." });
  }

  const nextId = students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 201;

  const newStudent = {
    id: nextId,
    rollNumber: rollNumber.trim(),
    name: name.trim(),
    branch: branch.trim(),
    semester,
    email: email.trim()
  };

  students.push(newStudent);
  res.status(201).json(newStudent);
});

// 4. PUT / update a record
app.put('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ message: `Student with ID ${id} not found.` });
  }

  if (!validateStudent(req.body)) {
    return res.status(400).json({
      message: "Invalid input. Ensure rollNumber, name, branch, email (strings) and semester (number) are provided."
    });
  }

  const { rollNumber, name, branch, semester, email } = req.body;

  students[index] = {
    id,
    rollNumber: rollNumber.trim(),
    name: name.trim(),
    branch: branch.trim(),
    semester,
    email: email.trim()
  };

  res.status(200).json(students[index]);
});

// 5. DELETE a record
app.delete('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ message: `Student with ID ${id} not found.` });
  }

  students.splice(index, 1);
  res.status(200).json({ message: `Student with ID ${id} deleted successfully.` });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});