import React, { FC, useState, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddVacation.css';
import Swal from 'sweetalert2';

interface UserData {
  userId: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

interface Credentials {
    destination: string;
    description: string;
    startDate: string;
    endDate: string;
    price: string;
    imageFileName?: File | null;
}

const AddVacation: FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<UserData | null>(null);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<Credentials>({
    destination: '',
    description: '',
    startDate: '',
    endDate: '',
    price: '',
    imageFileName: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        setCredentials({
            ...credentials,
            imageFileName: e.target.files[0],
        });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role === 'admin') {
      fetchUserData()
        .then((userData) => {
          if (userData) {
            setLoggedInUser(userData);
          } else {
            console.error('User data is null');
            navigate('/');
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          navigate('/');
        });
    } else {
      navigate('/');
    }
  }, [navigate]);

  const fetchUserData = async (): Promise<UserData | null> => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:3000/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch user data', error);
      return null;
    }
  };

  const handleFileUpload = async () => {
    
    if (!credentials.imageFileName) {
      throw new Error('File is not selected');
    }
  
    const formData = new FormData();
    formData.append('image', credentials.imageFileName);
    console.log('File selected:', credentials.imageFileName.name);
  
    console.log('Sending request to upload the file...');
    const response = await fetch('http://localhost:3000/api/vacations/upload', {
        method: 'POST',
        body: formData,
    });
    console.log('Got response from the server' + response);
    console.log(formData);

    
    const data = await response.json();
    console.log(data);
    if (response.ok) {
        console.log('File was uploaded successfully');
        return data.filename;  // return the filename
    } else {
        console.log('File upload failed');
        throw new Error(data.error || 'Network response was not ok');
    }
  }
  

  const handleAddVacation = async (e: React.FormEvent) => {
    e.preventDefault();
    try { 
        const filename = await handleFileUpload();   // get the filename from file upload

        // replace imageFileName in the credentials with the returned filename
        const credentialsWithFilename = { ...credentials, imageFileName: filename };
        
        const response = await fetch('http://localhost:3000/api/vacations', {
            method: 'POST',
            body: JSON.stringify(credentialsWithFilename),   // use the new credentials object
            headers: {
                'Content-Type': 'application/json',
            },
        });
  
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Network response was not ok');
        }
    
        if (data.error) {
          Swal.fire({
              title: 'Error!',
              text: data.error,
              icon: 'error',
              confirmButtonText: 'Ok',
            });
          console.log(data.error);
        } else {
          Swal.fire({
            title: 'Success!',
            text: data.message,
            icon: 'success',
            confirmButtonText: 'Ok',
          });
          setCredentials({ destination:'', description: '', startDate: '', endDate: '', price: '', imageFileName: null });
        }
      } catch (error) {
        if (error instanceof Error) {
          Swal.fire({
            title: 'Error!',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        }
      }
  };

  return (
<>
    <div className="wrap">
        
        <div className="mainAdd">
            <label>Add Vacation</label>

            <form>
            <div className="form-group">
                <input
                type="text"
                placeholder="Destination"
                name="destination"
                value={credentials.destination}
                onChange={handleInputChange}/>
            </div>
            <div className="form-group">
                <input
                type="text"
                placeholder="Description"
                name="description"
                value={credentials.description}
                onChange={handleInputChange}/>
            </div>
            <div className="form-group">
                <input
                type="date"
                placeholder="Start Date"
                name="startDate"
                value={credentials.startDate}
                onChange={handleInputChange}/>
            </div>

            <div className="form-group">
                <input
                type="date"
                placeholder="End Date"
                name="endDate"
                value={credentials.endDate}
                onChange={handleInputChange}/>
            </div>
            <div className="form-group">
                <input
                type="text"
                placeholder="Price"
                name="price"
                value={credentials.price}
                onChange={handleInputChange}/>
            </div>
            <div className="form-group">
                <input
                className='input__file'
                type="file"
                name="imageFileName"
                accept="image/*"
                onChange={handleFileChange}/>
            </div>
                <button onClick={handleAddVacation}>Add Vacation</button>
                <button className="return-btn" onClick={() => navigate('/admin')}>
              Return
            </button>
            </form>
        </div>
    </div>
</>
  );
  
}

export default AddVacation;
