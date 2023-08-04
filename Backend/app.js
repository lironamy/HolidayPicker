"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mysql_1 = __importDefault(require("mysql"));
const fs_1 = __importDefault(require("fs"));
const fastcsv = __importStar(require("fast-csv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware_1 = __importDefault(require("./authMiddleware"));
const multer_1 = __importStar(require("multer"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const conn = mysql_1.default.createConnection({
    host: '185.249.224.52',
    user: 'u836564938_root',
    password: 'Ladygaga2',
    database: 'u836564938_vacationdb',
});
conn.connect(error => {
    if (error)
        throw error;
    console.log('Successfully connected to the database.');
});
app.use('/vacation_images', express_1.default.static('./vacation_images'));
const storage = (0, multer_1.diskStorage)({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, './vacation_images'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
app.post('/api/vacations/upload', upload.single('image'), (req, res) => {
    console.log('Received request to upload');
    const file = req.file;
    if (!file) {
        console.log('No file received');
        return res.status(400).json({ error: 'No file received' });
    }
    console.log('File uploaded successfully');
    res.status(200).json({ filename: file.filename });
});
app.post('/api/vacations/upload/update', upload.single('image'), (req, res) => {
    console.log('Received request to /api/vacations/upload');
    const file = req.file;
    if (!file) {
        console.log('No file received');
        return res.status(200).json({ message: 'No file received, but the request was successful' });
    }
    console.log('File uploaded successfully');
    res.status(200).json({ filename: file.filename });
});
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.post('/register', (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ error: "All input fields are required" });
    }
    if (password.length < 4) {
        return res.status(400).json({ error: "Password must be at least 4 characters" });
    }
    let emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email" });
    }
    conn.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
        console.log(results);
        if (error) {
            console.error(error);
            return res.status(500).json({ error: "An error occurred while registering." });
        }
        if (results.length > 0) {
            return res.status(409).json({ error: "A user with this email already exists" });
        }
        const sql = "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)";
        conn.query(sql, [first_name, last_name, email, password], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: "An error occurred while registering." });
            }
            res.status(201).json({ message: "User registered successfully." });
        });
    });
});
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const emailRegex = /\S+@\S+\.\S+/;
    if (!email || !password) {
        return res.status(400).json({ error: "Both email and password are required." });
    }
    else if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email." });
    }
    else if (password.length < 4) {
        return res.status(400).json({ error: "Password must be at least 4 characters long." });
    }
    const sql = "SELECT * FROM users WHERE email = ?";
    conn.query(sql, [email], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: "An error occurred while logging in." });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: "Email not exist." });
        }
        const user = results[0];
        if (user.password !== password) {
            return res.status(401).json({ error: "The password is incorrect." });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.user_id, email: user.email, first_name: user.first_name, last_name: user.last_name, userRole: user.role }, 'mostSecureSecretinTheWorld!!!');
        const role = user.role;
        res.json({ token, role });
    });
});
app.get('/user', authMiddleware_1.default, (req, res) => {
    const userData = req.user;
    res.json(userData);
});
app.get('/vacations', (req, res) => {
    const sql = "SELECT * FROM vacations";
    conn.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "An error occurred while retrieving data." });
        }
        else {
            res.status(200).json(results);
        }
    });
});
app.post('/api/vacations', (req, res) => {
    const { destination, description, startDate, endDate, price, imageFileName } = req.body;
    if (!destination || !description || !startDate || !endDate || !price || !imageFileName) {
        return res.status(400).json({ error: "All fields are required" });
    }
    if (price < 0 || price > 10000 || isNaN(price)) {
        return res.status(400).json({ error: "Price must be between 0 and 10000" });
    }
    if (new Date(startDate) >= new Date(endDate)) {
        return res.status(400).json({ error: "End date should be after start date" });
    }
    if (new Date(startDate) < new Date()) {
        return res.status(400).json({ error: "Start date should be after today" });
    }
    const sql = `
        INSERT INTO vacations (vacation_destination, vacation_description, vacation_start, vacation_end, price, vacation_image_file_name) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    conn.query(sql, [destination, description, startDate, endDate, price, imageFileName], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "An error occurred while inserting data." });
        }
        else {
            res.status(201).json({ message: "Vacation successfully created", id: result.insertId });
        }
    });
});
app.put('/vacations/:id', upload.single('imageFileName'), (req, res) => {
    const id = req.params.id;
    const { destination, description, startDate, endDate, price } = req.body;
    const imageFileName = req.file ? req.file.filename : undefined;
    if (!destination || !description || !startDate || !endDate || !price) {
        return res.status(400).json({ error: "All fields are required except for image" });
    }
    if (price < 0 || price > 10000) {
        return res.status(400).json({ error: "Price must be between 0 and 10000" });
    }
    if (new Date(startDate) >= new Date(endDate)) {
        return res.status(400).json({ error: "End date should be after start date" });
    }
    conn.query('SELECT * FROM vacations WHERE vacation_id = ?', [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "An error occurred while updating data." });
        }
        if (result.length > 0) {
            const currentImageFileName = result[0].vacation_image_file_name;
            const newImageFileName = imageFileName != null ? imageFileName : currentImageFileName;
            const sql = `
                UPDATE vacations 
                SET vacation_destination = ?, vacation_description = ?, vacation_start = ?, vacation_end = ?, price = ?, vacation_image_file_name = ?
                WHERE vacation_id = ?
            `;
            conn.query(sql, [destination, description, startDate, endDate, price, newImageFileName, id], (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: "An error occurred while updating data." });
                }
                else {
                    if (result.affectedRows > 0) {
                        res.status(200).json({ message: "Vacation successfully updated" });
                    }
                    else {
                        res.status(404).json({ error: "No vacation found with the provided ID" });
                    }
                }
            });
        }
        else {
            res.status(404).json({ error: "No vacation found with the provided ID" });
        }
    });
});
app.delete('/vacations/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM vacations WHERE vacation_id = ?";
    conn.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "An error occurred while deleting data." });
        }
        else {
            if (result.affectedRows > 0) {
                res.status(200).json({ message: "Vacation successfully deleted" });
            }
            else {
                res.status(404).json({ error: "No vacation found with the provided ID" });
            }
        }
    });
});
app.get('/vacations/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM vacations WHERE vacation_id = ?";
    conn.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "An error occurred while fetching data." });
        }
        else {
            if (results.length > 0) {
                res.status(200).json(results[0]);
            }
            else {
                res.status(404).json({ error: "No vacation found with the provided ID" });
            }
        }
    });
});
app.post('/follow', (req, res) => {
    const { user_id, vacation_id } = req.body;
    if (!user_id || !vacation_id) {
        res.status(400).json({ error: "User ID and Vacation ID are required" });
        return;
    }
    const sql = "INSERT INTO followers (user_id, vacation_id) VALUES (?, ?)";
    conn.query(sql, [user_id, vacation_id], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "An error occurred while following the vacation." });
        }
        else {
            res.status(201).json({ message: "Successfully followed the vacation" });
        }
    });
});
app.get('/user/:user_id/followed', (req, res) => {
    const userId = req.params.user_id;
    const sql = `
      SELECT v.vacation_id, v.vacation_destination, v.vacation_description, v.vacation_start, v.vacation_end, v.price, v.vacation_image_file_name
      FROM vacations v
      JOIN followers f ON v.vacation_id = f.vacation_id
      WHERE f.user_id = ?;
    `;
    conn.query(sql, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "An error occurred while fetching followed vacations.", mysql_error: err.message });
        }
        res.status(200).json(results);
    });
});
app.delete('/unfollow', (req, res) => {
    const { user_id, vacation_id } = req.body;
    if (!user_id || !vacation_id) {
        res.status(400).json({ error: "User ID and Vacation ID are required" });
        return;
    }
    const sql = "DELETE FROM followers WHERE user_id = ? AND vacation_id = ?";
    conn.query(sql, [user_id, vacation_id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "An error occurred while unfollowing the vacation." });
        }
        else {
            if ((result === null || result === void 0 ? void 0 : result.affectedRows) === 0) {
                res.status(404).json({ error: "No such follow found to delete." });
            }
            else {
                res.status(200).json({ message: "Successfully unfollowed the vacation" });
            }
        }
    });
});
app.get('/reportcsv', (req, res) => {
    const sql = `
    SELECT Vacations.*, COUNT(Followers.user_id) AS follower_count
    FROM Vacations
    LEFT JOIN Followers ON Vacations.vacation_id = Followers.vacation_id
    GROUP BY Vacations.vacation_id
    ORDER BY follower_count DESC
    `;
    conn.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "An error occurred while generating the report." });
        }
        else {
            const ws = fs_1.default.createWriteStream("Report.csv");
            fastcsv
                .write(results, { headers: true })
                .on("finish", function () {
                console.log("Report.csv is created successfully.");
            })
                .pipe(ws);
            res.status(200).json({ message: "CSV report generated successfully." });
        }
    });
});
app.get('/report', (req, res) => {
    const sql = `
    SELECT Vacations.*, COUNT(Followers.user_id) AS follower_count
    FROM Vacations
    LEFT JOIN Followers ON Vacations.vacation_id = Followers.vacation_id
    GROUP BY Vacations.vacation_id
    ORDER BY follower_count DESC
    
    `;
    conn.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "An error occurred while generating the report." });
        }
        else {
            res.status(200).json(results);
        }
    });
});
app.listen(3000, () => console.log('Server listening on http://localhost:3000'));
