import React, { FC, useState } from 'react';
import './HomePage.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


interface Credentials {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

const HomePage: FC = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState<Credentials>({ 
        first_name: '', 
        last_name: '', 
        email: '', 
        password: '' 
    });  

    const NavigationHolidays = () => {
      navigate('/holidays');
    };
    const NavigationAdmin = () => {
      navigate('/admin');
    };
      
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
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
          confirmButtonText: 'Ok'
        });
      } else if (data.token && data.role === 'regular') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        NavigationHolidays();
        } else if (data.token && data.role === 'admin') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        NavigationAdmin();
      }

    } catch (error) {
      if (error instanceof Error) {
        Swal.fire({
          title: 'Error!',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
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
      } else {
        const loginResponse = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });
  
        const loginData = await loginResponse.json();
  
        if (!loginResponse.ok) {
          throw new Error(loginData.error || 'Network response was not ok');
        }
  
        if (loginData.error) {
          Swal.fire({
            title: 'Error!',
            text: loginData.error,
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        } else if (loginData.token && loginData.role === 'regular') {
          localStorage.setItem('token', loginData.token);
          localStorage.setItem('role', loginData.role);
          NavigationHolidays();
        }
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
      <div className="main">
        <input type="checkbox" id="chk" aria-hidden="true" />

        <div className="signup">
          <form>
            <label htmlFor="chk" aria-hidden="true">
              Sign up
            </label>
            <input type="text" name="first_name" placeholder="First Name" value={credentials.first_name} onChange={handleInputChange} />
            <input type="text" name="last_name" placeholder="Last Name" value={credentials.last_name} onChange={handleInputChange} />
            <input type="email" name="email" placeholder="Email" value={credentials.email} onChange={handleInputChange} />
            <input type="password" name="password" placeholder="Password" value={credentials.password} onChange={handleInputChange} />
            <button type="button" onClick={handleSignUp}>Sign up</button>
          </form>
        </div>
        
        <div className="login">
          <form>
            <label htmlFor="chk" aria-hidden="true">Login</label>
            <input type="email" name="email" placeholder="Email" required onChange={handleInputChange} />
            <input type="password" name="password" placeholder="Password" required onChange={handleInputChange} />
            <button type="button" onClick={handleLogin}>Login</button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default HomePage;
