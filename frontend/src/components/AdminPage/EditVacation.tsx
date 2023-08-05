import React, { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Nav from '../Nav/Nav';

interface VacationDetails {
  vacation_id: number;
  vacation_description: string;
  vacation_start: string;
  vacation_end: string;
  vacation_image_file_name: File | null;
  vacation_destination: string;
  price: number;
}

interface UserData {
  userId: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

type Params = {
    holidayId: string;
};

const EditVacation: FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageURL, setCurrentImageURL] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<UserData | null>(null);
  const navigate = useNavigate();
  const [vacation, setVacation] = useState<VacationDetails>({
    vacation_id: 0,
    vacation_description: '',
    vacation_start: '',
    vacation_end: '',
    vacation_image_file_name: null,
    vacation_destination: '',
    price: 0,
  });
    const { holidayId } = useParams<Params>();
    



  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role === 'admin') {
      fetchUserData()
        .then((userData) => {
          if (userData) {
            setLoggedInUser(userData);
            fetchVacationDetails(); // Fetch the vacation details after fetching user data
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

      const response = await fetch('https://holidaypicker.onrender.com/user', {
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

  useEffect(() => {
    if (!holidayId || isNaN(Number(holidayId))) {
      console.error('Invalid vacation ID');
      console.log(holidayId);
      navigate('/admin');
    } else {
      fetchVacationDetails();
    }
  }, [holidayId, navigate]);


  const fetchVacationDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://holidaypicker.onrender.com/vacations/${holidayId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.error('Vacation not found');
          navigate('/admin');
        } else {
          throw new Error('Failed to fetch vacation details');
        }
      }

      const data = await response.json();
      const startDate = new Date(data.vacation_start);
      startDate.setDate(startDate.getDate() + 1);
      const adjustedStartDate = startDate.toISOString().substring(0, 10);
    
      const endDate = new Date(data.vacation_end);
      endDate.setDate(endDate.getDate() + 1);
      const adjustedEndDate = endDate.toISOString().substring(0, 10);
    
      setVacation({
        vacation_id: data.vacation_id,
        vacation_description: data.vacation_description,
        vacation_start: adjustedStartDate,
        vacation_end: adjustedEndDate,
        vacation_image_file_name: data.vacation_image_file_name,
        vacation_destination: data.vacation_destination,
        price: data.price,
      });
      const imageUrl = data.vacation_image_file_name ? `https://holidaypicker.onrender.com/vacation_images/${data.vacation_image_file_name}` : null;
      setCurrentImageURL(imageUrl);
      console.log(data.vacation_image_file_name);
      
    } catch (error) {
      console.error('Failed to fetch vacation details', error);
    }
  };

  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVacation({
      ...vacation,
      [e.target.name]: e.target.value,
    });
    console.log(vacation);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedImage = e.target.files[0];
      setVacation({
        ...vacation,
        vacation_image_file_name: selectedImage,
      });
  
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
  
      reader.readAsDataURL(selectedImage);
    }
  };
  

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('image', vacation.vacation_image_file_name as File);
    console.log('File selected:', vacation.vacation_image_file_name);
  
    console.log('Sending request to upload the file...');
    const response = await fetch('https://holidaypicker.onrender.com/api/vacations/upload/update', {
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
  

  const handleUpdateVacation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      let filename;
      if (vacation.vacation_image_file_name) {
        filename = await handleFileUpload();  // Upload the file and get the filename
      }
  
      const formData = new FormData();
      formData.append('id', vacation.vacation_id.toString());
      formData.append('destination', vacation.vacation_destination);
      formData.append('description', vacation.vacation_description);
      formData.append('startDate', vacation.vacation_start);
      formData.append('endDate', vacation.vacation_end);
      formData.append('price', vacation.price.toString());
      if (vacation.vacation_image_file_name) {
        formData.append('imageFileName', vacation.vacation_image_file_name);
      }
  
      const response = await fetch(`https://holidaypicker.onrender.com/vacations/${holidayId}`, {
        method: 'PUT',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.error || 'Network response was not ok');
      }

      Swal.fire({
        title: 'Success!',
        text: data.message,
        icon: 'success',
        confirmButtonText: 'Ok',
      });

      // Navigate back to the admin page after successful update
      navigate('/admin');
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
          <label className='editLabel'>Edit Vacation</label>
          <form>
            <div className="form-group">
              <input
                type="text"
                placeholder="Destination"
                name="vacation_destination"
                value={vacation.vacation_destination}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Description"
                name="vacation_description"
                value={vacation.vacation_description}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <input
                type="date"
                placeholder="Start Date"
                name="vacation_start"
                value={vacation.vacation_start}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <input
                type="date"
                placeholder="End Date"
                name="vacation_end"
                value={vacation.vacation_end}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Price"
                name="price"
                value={vacation.price}
                onChange={handleInputChange}
              />
            </div>


            <div className="form-group">
              <label htmlFor="imageFileName" className="custom-file-upload">
                {imagePreview ? (
                  <img src={imagePreview} alt="Vacation Preview" />
                ) : currentImageURL ? (
                  <img src={currentImageURL} alt="Current Vacation Image" />
                ) : (
                  'Select or Change Image'
                )}
              </label>
              <input
                className="input__file_edit"
                type="file"
                name="imageFileName"
                id="imageFileName"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            
            <button onClick={handleUpdateVacation}>Update Vacation</button>
            <button className="return-btn" onClick={() => navigate('/admin')}>
              Return
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditVacation;
