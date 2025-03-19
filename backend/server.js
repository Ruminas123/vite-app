import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Get all employees
app.get("/employees", (req, res) => {
  db.query("SELECT * FROM employees", (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});
app.get("/positions", (req, res) => {
  db.query("SELECT * FROM positions", (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

// Add a new employee (POST /employees)
app.post("/createEmployee", (req, res) => {
  console.log(req.body)
  const { fullname, username, password, position_id } = req.body;

  if (!fullname || !username || !password || !position_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = `INSERT INTO employees (
                  employee_permission_id, 
                  employee_department_id,
                  employee_position_id,
                  employee_fullname,
                  employee_username,
                  employee_password,
                  employee_status,
                  employee_date
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [2, 1, position_id, fullname, username, password, true, new Date()];

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      message: "Employee added successfully",
      values: {
        "employee_id": result.insertId,
        "employee_permission_id": 2,
        "employee_department_id": 1,
        "employee_position_id": values[2],
        "employee_fullname": values[3],
        "employee_username": values[4],
        "employee_password": values[5],
        "employee_status": true,
        "employee_date": values[7]
      }
    });
  });
});

app.post("/createPosition", (req, res) => {
  const { name, status = true } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Position name is required" });
  }

  // Check for duplicate position name
  db.query("SELECT * FROM positions WHERE position_name = ?", [name], (err, results) => {
    if (err) { return res.status(500).send(err); }

    if (results.length > 0) {
      return res.status(400).json({ error: "Position name already exists" });
    }

    // Insert new position if not duplicate
    db.query("INSERT INTO positions (position_name, position_status) VALUES (?, ?)",
      [name, status], (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.json({ position_id: result.insertId, position_name: name, position_status: status });
      });
  });
});

app.delete("/deleteEmployee/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM employees WHERE employee_id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json({ message: "Employee deleted successfully" });
  });
});

app.delete("/deletePosition/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM positions WHERE position_id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Position not found" });
    }

    res.json({ message: "Position deleted successfully" });
  });
});

app.put("/editPosition/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {return res.status(400).json({ message: "Position name is required" })}
  db.query("UPDATE positions SET position_name = ? WHERE position_id = ?", [name, id], (err, result) => {
      if (err) {return res.status(500).json({ error: err.message })}
      if (result.affectedRows === 0) {return res.status(404).json({ message: "Position not found" })}
      res.json({position_id: id, position_name: name, position_status: true});
  });
});


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
