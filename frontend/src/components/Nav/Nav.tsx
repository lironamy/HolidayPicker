import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Nav.css";
import logo from "../../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHand } from "@fortawesome/free-solid-svg-icons";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';



interface UserData {
    first_name: string;
    last_name: string;
  }


const Nav = () => {
    const navigate = useNavigate();
    const Logout = () => {
        localStorage.clear();
        navigate('/');
      };

    const [loggedInUser, setLoggedInUser] = useState<UserData | null>(null);


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
        const token = localStorage.getItem('token');
      
        if (token) {
          fetchUserData()
            .then((userData) => {
              if (userData) {
                setLoggedInUser(userData);
              }
            })
            .catch((error) => {
              console.error('Error fetching user data:', error);
            });
        }
        }, []);

  return (
    <nav className="navbar">
      <ul>
        <li>
            {loggedInUser && <span>Hello {loggedInUser.first_name} {loggedInUser.last_name} <FontAwesomeIcon icon={faHand} /></span>}
        </li>
     
        <li>
           <span className="logOut" onClick={Logout}>Logout <FontAwesomeIcon icon={faRightFromBracket} /></span>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
