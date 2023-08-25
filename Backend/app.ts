import express, { Express, Request, Response } from "express";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import  config  from "./firebase.config"
import cors from "cors";
import mysql from "mysql";
import fs from 'fs';
import * as fastcsv from 'fast-csv';
import jsonwebtoken from "jsonwebtoken";
import authenticateJWT from './authMiddleware';
import multer, { diskStorage } from 'multer';
import path from 'path';


const app: Express = express();
app.use(cors());
app.use(express.json());

initializeApp(config.firebaseConfig);

const storage = getStorage();

const upload = multer({ storage: multer.memoryStorage() });

const conn = mysql.createConnection({
    host: 'db4free.net', 
    user: 'lironamy',
    password: '.#UPzpx9Y9jL.T_',   
    database: 'vacationdb',
});

conn.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});


// app.use('/vacation_images', express.static('./vacation_images'));


app.post('/api/vacations/upload', upload.single('image'), async (req: Request, res: Response) => {
    const file = req.file;

    if (!file) {
        console.log('No file received');
        return res.status(400).json({ error: 'No file received' });
    }

    try {
        console.log('Received request to upload');
        const storageRef = ref(storage, `${file.originalname}`);
        const metadata = {
            contentType: file.mimetype,
        };

        const uploadTask = uploadBytesResumable(storageRef, file.buffer, metadata);

        uploadTask.on('state_changed', (snapshot) => {
            // You can listen for upload progress here if needed
        }, (error) => {
            console.error('Error uploading file:', error);
            return res.status(500).json({ error: 'An error occurred while uploading the file' });
        }, () => {
            // Upload completed successfully
            getDownloadURL(storageRef).then((downloadURL) => {
                console.log('File uploaded successfully');
                res.status(200).json({ filename: file.filename, downloadURL });
            }).catch((error) => {
                console.error('Error getting download URL:', error);
                return res.status(500).json({ error: 'An error occurred while getting download URL' });
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'An error occurred while uploading the file' });
    }
});


app.post('/api/vacations/upload/update', upload.single('image'), async (req: Request, res: Response) => {
    const file = req.file;

    if (!file) {
        console.log('No file received');
        return res.status(400).json({ error: 'No file received' });
    }

    try {
        console.log('Received request to /api/vacations/upload');

        const storageRef = ref(storage, `${file.originalname}`);
        const metadata = {
            contentType: file.mimetype,
        };

        const uploadTask = uploadBytesResumable(storageRef, file.buffer, metadata);

        uploadTask.on('state_changed', (snapshot) => {
            // You can listen for upload progress here if needed
        }, (error) => {
            console.error('Error uploading file:', error);
            return res.status(500).json({ error: 'An error occurred while uploading the file' });
        }, () => {
            // Upload completed successfully
            getDownloadURL(storageRef).then((downloadURL) => {
                console.log('File uploaded successfully');
                res.status(200).json({ filename: file.filename, downloadURL });
            }).catch((error) => {
                console.error('Error getting download URL:', error);
                return res.status(500).json({ error: 'An error occurred while getting download URL' });
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'An error occurred while uploading the file' });
    }
});


app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.post('/register', (req: Request, res: Response) => {
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
        if (error) {
            console.error('Error querying MySQL:', error);
            return res.status(500).json({ error: 'An error occurred while registering.' });
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



app.post('/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    const emailRegex = /\S+@\S+\.\S+/;
    if (!email || !password) {
        return res.status(400).json({ error: "Both email and password are required." });
    } else if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email." });
    } else if (password.length < 4) {
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

        const token = jsonwebtoken.sign({ userId: user.user_id, email: user.email, first_name: user.first_name, last_name: user.last_name, userRole: user.role }, 'mostSecureSecretinTheWorld!!!');
        const role = user.role;
        res.json({ token, role });
    });
});


app.get('/user', authenticateJWT, (req: Request, res: Response) => {
    const userData = req.user;
    res.json(userData);
});

app.get('/vacations', (req: Request, res: Response) => {
    const sql = "SELECT * FROM vacations";
    conn.query(sql, async (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Failed to fetch vacations' });
        }

        const vacationsWithDownloadURLs = await Promise.all(results.map(async (vacation: { vacation_image_file_name: any; }) => {
            const storageRef = ref(storage, `${vacation.vacation_image_file_name}`);
            const downloadURL = await getDownloadURL(storageRef);
            return { ...vacation, vacation_image_download_url: downloadURL };
        }));

        res.status(200).json(vacationsWithDownloadURLs);
    });
});




app.post('/api/vacations', (req: Request, res: Response) => {
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
        } else {
            res.status(201).json({ message: "Vacation successfully created", id: result.insertId });
        }
    });
});


app.put('/vacations/:id', upload.single('imageFileName'), (req: Request, res: Response) => {
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
                } else {
                    if (result.affectedRows > 0) {
                        res.status(200).json({ message: "Vacation successfully updated" });
                    } else {
                        res.status(404).json({ error: "No vacation found with the provided ID" });
                    }
                }
            });
        } else {
            res.status(404).json({ error: "No vacation found with the provided ID" });
        }
    });
});


app.delete('/vacations/:id', (req: Request, res: Response) => {
    const id = req.params.id;

    const sql = "DELETE FROM vacations WHERE vacation_id = ?";

    conn.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "An error occurred while deleting data." });
        } else {
            if (result.affectedRows > 0) {
                res.status(200).json({ message: "Vacation successfully deleted" });
            } else {
                res.status(404).json({ error: "No vacation found with the provided ID" });
            }
        }
    });
});


app.get('/vacations/:id', (req: Request, res: Response) => {
    const id = req.params.id;

    const sql = "SELECT * FROM vacations WHERE vacation_id = ?";
    conn.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "An error occurred while fetching data." });
        }

        if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).json({ error: "No vacation found with the provided ID" });
        }
    });
});

app.post('/follow', (req: Request, res: Response) => {
    const { user_id, vacation_id } = req.body;

    if (!user_id || !vacation_id) {
        res.status(400).json({ error: "User ID and Vacation ID are required" });
        return;
    }

    const sql = "INSERT INTO followers (user_id, vacation_id) VALUES (?, ?)";

    conn.query(sql, [user_id, vacation_id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "An error occurred while following the vacation." });
        } else {
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

app.delete('/unfollow', (req: Request, res: Response) => {
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
        } else {
            if (result?.affectedRows === 0) {
                res.status(404).json({ error: "No such follow found to delete." });
            } else {
                res.status(200).json({ message: "Successfully unfollowed the vacation" });
            }
        }
    });
});

app.get('/reportcsv', (req: Request, res: Response) => {
    const sql = `
    SELECT vacations.*, COUNT(followers.user_id) AS follower_count
    FROM vacations
    LEFT JOIN followers ON vacations.vacation_id = followers.vacation_id
    GROUP BY vacations.vacation_id
    ORDER BY follower_count DESC    
    `;

    conn.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "An error occurred while generating the report." });
        } else {
            const ws = fs.createWriteStream("Report.csv");
            fastcsv
              .write(results, { headers: true })
              .on("finish", function() {
                console.log("Report.csv is created successfully.");
              })
              .pipe(ws);
            
            res.status(200).json({message: "CSV report generated successfully."});
        }
    });
});



app.get('/report', (req: Request, res: Response) => {
    const sql = `
    SELECT vacations.*, COUNT(followers.user_id) AS follower_count
    FROM vacations
    LEFT JOIN followers ON vacations.vacation_id = followers.vacation_id
    GROUP BY vacations.vacation_id    
    `;

    conn.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "An error occurred while generating the report." });
        } else {
            res.status(200).json(results);
        }
    });
});

app.listen(3000, () => console.log('Server listening on http://localhost:3000'));
