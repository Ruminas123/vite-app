import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

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

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.query("SELECT * FROM employees WHERE employee_username = ? AND employee_password = ?",
    [username, password], (err, result) => {
      if (err) { return res.status(500).json({ error: err.message }) }
      if (result.length > 0) {
        const user = result[0];
        delete user.employee_password;
        res.json({ success: true, message: "Login successful", user })
      }
      else { res.json({ success: false, message: "Invalid username or password" }) }
    }
  );
});

app.get("/getEmployees", (req, res) => {
  db.query("SELECT * FROM employees", (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

app.get("/getEmployees/:employee_id", (req, res) => {
  const { employee_id } = req.params;
  if (isNaN(employee_id)) {
    return res.status(400).json({ error: "Invalid employee_id" });
  }
  db.query("SELECT * FROM employees WHERE employee_id = ?", [employee_id], (err, result) => {
    if (err)  {return res.status(500).json({ error: err.message }) }
    if (result.length === 0) { return res.status(404).json({ error: "Employee not found" }) }
    res.json(result[0]);
  });
});

app.get("/getHenchman/:employee_key", (req, res) => {
  const employee_key = req.params.employee_key;
  const query = `
    SELECT e.employee_id, e.employee_permission_id, e.employee_department_id, e.employee_position_id,
          e.employee_key, e.employee_fullname, e.employee_username, e.employee_status, e.employee_date,
          IF(MONTH(a.awat_date) = MONTH(CURDATE()) AND e.employee_id = a.employee_id, TRUE, FALSE) AS awat_month_status
    FROM employees e
    LEFT JOIN awats a ON e.employee_id = a.employee_id
    WHERE e.employee_key LIKE ? AND e.employee_key != ?
    ORDER BY e.employee_id ASC
  `;
  const values = [`${employee_key}-%`, employee_key];

  db.query(query, values, (err, result) => {
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

  db.query("SELECT * FROM positions WHERE position_name = ?", [name], (err, results) => {
    if (err) { return res.status(500).send(err); }

    if (results.length > 0) {
      return res.status(400).json({ error: "Position name already exists" });
    }

    db.query("INSERT INTO positions (position_name, position_status) VALUES (?, ?)",
      [name, status], (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.json({ position_id: result.insertId, position_name: name, position_status: status });
      });
  });
});

app.get("/getAwat/:employee_id", (req, res) => {
  const { employee_id } = req.params;
  const query = `SELECT * FROM awats WHERE employee_id = ? ORDER BY YEAR(awat_date) ASC, MONTH(awat_date) ASC`;
  db.query(query, [employee_id], (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ message: "Error fetching data" });
    }
    if (results.length > 0) {
      res.status(200).json(results);
    } else {
      res.status(200).json(false);
    }
  });
});

app.get("/getAwatMonth/:employee_id", (req, res) => {
  const { employee_id } = req.params;
  const query = `SELECT * FROM awats WHERE employee_id = ? AND MONTH(awat_date) = MONTH(CURRENT_DATE) AND YEAR(awat_date) = YEAR(CURRENT_DATE) LIMIT 1`;
  db.query(query, [employee_id], (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ message: "Error fetching data" });
    }
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(200).json(false);
    }
  });
});



app.get("/getAwatManager/:manager_id/:henchman_id", (req, res) => {
  const { manager_id, henchman_id } = req.params;

  const query = `SELECT * FROM awats_manager WHERE manager_id = ? AND henchman_id = ? 
    AND MONTH(awat_date) = MONTH(CURRENT_DATE) AND YEAR(awat_date) = YEAR(CURRENT_DATE) LIMIT 1`;

  db.query(query, [manager_id, henchman_id], (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ status: 500, message: "Error fetching data" });
    }

    if (results.length > 0) {
      res.status(200).json({ status: 1, data: results[0] });
    } else {
      res.status(200).json({ status: 0, message: "No data found" });
    }
  });
});

app.post("/createAwat", (req, res) => {
  const { field1, field2, field3, field4, field5, field6, field7, field8, field9, field10, employee_id } = req.body;

  if (!employee_id) { return res.status(400).json({ message: "employee_id is required" }) }

  const insertQuery = `INSERT INTO awats (awat_one, awat_two, awat_three, awat_four, awat_five, awat_six, awat_seven, awat_eight, awat_nine, awat_ten, employee_id, awat_date, awat_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(insertQuery, [field1, field2, field3, field4, field5, field6, field7, field8, field9, field10, employee_id, new Date(), 1], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      res.status(500).json({ message: "Error inserting data" });
    } else {
      res.status(200).json({ message: "Data inserted successfully", values: req.body });
    }
  });
});

app.put("/updateAwat", (req, res) => {
  const { employee_id, field1, field2, field3, field4, field5, field6, field7, field8, field9, field10 } = req.body;

  const query = `
      UPDATE awats
      SET awat_one = ?, awat_two = ?, awat_three = ?, awat_four = ?, awat_five = ?, 
          awat_six = ?, awat_seven = ?, awat_eight = ?, awat_nine = ?, awat_ten = ?
      WHERE employee_id = ? 
      AND MONTH(awat_date) = MONTH(CURRENT_DATE) 
      AND YEAR(awat_date) = YEAR(CURRENT_DATE)
  `;

  db.query(query, [field1, field2, field3, field4, field5, field6, field7, field8, field9, field10, employee_id], (err, results) => {
    if (err) {
      console.error("Error updating data:", err);
      return res.status(500).json({ message: "Error updating data" });
    }
    res.status(200).json({ message: "Data updated successfully" });
  });
});

app.post("/createAwatManager", (req, res) => {
  const { field1, field2, field3, field4, field5, field6, field7, field8, field9, field10, manager_id, henchman_id } = req.body;
  if ((!manager_id) && (!henchman_id)) { return res.status(400).json({ message: "employee_id is required" }) }
  const insertQuery = `INSERT INTO awats_manager (awat_one, awat_two, awat_three, awat_four, awat_five, awat_six, awat_seven, awat_eight, awat_nine, awat_ten, manager_id, henchman_id, awat_date, awat_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(insertQuery, [field1, field2, field3, field4, field5, field6, field7, field8, field9, field10, manager_id, henchman_id, new Date(), 1], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      res.status(500).json({ message: "Error inserting data" });
    } else {
      res.status(200).json({ message: "Data inserted successfully", values: req.body });
    }
  });
})

app.put("/updateAwatManager", (req, res) => {
  const { manager_id, henchman_id, field1, field2, field3, field4, field5, field6, field7, field8, field9, field10 } = req.body;
  if (!manager_id || !henchman_id) { return res.status(400).json({ message: "manager_id and henchman_id are required" })}
  const query = `
      UPDATE awats_manager
      SET awat_one = ?, awat_two = ?, awat_three = ?, awat_four = ?, awat_five = ?, 
          awat_six = ?, awat_seven = ?, awat_eight = ?, awat_nine = ?, awat_ten = ?
      WHERE manager_id = ? 
      AND henchman_id = ?
      AND MONTH(awat_date) = MONTH(CURRENT_DATE) 
      AND YEAR(awat_date) = YEAR(CURRENT_DATE)
  `;

  db.query(query, [field1, field2, field3, field4, field5, field6, field7, field8, field9, field10, manager_id, henchman_id], (err, results) => {
    if (err) {
      console.error("Error updating data:", err);
      return res.status(500).json({ message: "Error updating data" });
    }
    
    if (results.affectedRows > 0) {
      res.status(200).json({ message: "Data updated successfully" });
    } else {
      res.status(404).json({ message: "No matching record found to update" });
    }
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
  if (!name) { return res.status(400).json({ message: "Position name is required" }) }
  db.query("UPDATE positions SET position_name = ? WHERE position_id = ?", [name, id], (err, result) => {
    if (err) { return res.status(500).json({ error: err.message }) }
    if (result.affectedRows === 0) { return res.status(404).json({ message: "Position not found" }) }
    res.json({ position_id: id, position_name: name, position_status: true });
  });
});

app.post("/updatekeyfromID", async (req, res) => {
  const updatedEmployees = req.body;
  function loopEmployees(employees) {
    employees.forEach(employee => {
      const updatedKey = employee.key;  // Use the 'key' provided in the request body
      const query = 'UPDATE employees SET employee_key = ? WHERE employee_id = ?';
      db.query(query, [updatedKey, employee.id], (err, results) => {
        if (err) { return err; }
      });
      if (employee.children && employee.children.length > 0) { loopEmployees(employee.children) }
    });
  }

  try {
    loopEmployees(updatedEmployees);
    res.status(200).send({ message: "Keys updated successfully!" });
  } catch (error) {
    console.error("Error during update:", error);
    res.status(500).send({ message: "Error updating keys" });
  }
});



app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});


