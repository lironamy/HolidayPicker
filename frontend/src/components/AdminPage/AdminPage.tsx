import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminCard from './AdminCard';
import Pagination from '../HolidaysPage/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import Nav from '../Nav/Nav';

interface Holiday {
  vacation_id: number;
  vacation_description: string;
  vacation_start: string;
  vacation_end: string;
  vacation_image_file_name: string;
  vacation_destination: string;
  price: number;
  follower_count: number;
  isFollowed: boolean;
  
}

interface Vacation {
  vacation_id: number;
  vacation_description: string;
  vacation_start: string;
  vacation_end: string;
  price: number;
  vacation_image_file_name: string;
  vacation_image_url: string;
  isFollowed: boolean;
  startDate: string;
  endDate: string;
  vacation_destination: string;
  follower_count: number;
  userId: number;
}

interface UserData {
  userId: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

const AdminPage: FC = () => {
    const [vacations, setVacations] = useState<Vacation[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [loggedInUser, setLoggedInUser] = useState<UserData | null>(null);
    const navigate = useNavigate();
    const [followedVacations, setFollowedVacations] = useState<Vacation[]>([]);
    const [sortByStartDate, setSortByStartDate] = useState(true);
    const [report, setReport] = useState<number>(0);
    



    const addVacation = () => {
        navigate('/addvacation');
    }

    const editCard = (holidayId: number) => {
      console.log(holidayId);
      navigate(`/editvacation/${holidayId}`);
    };

    const reportPage = () => {
      navigate('/report');
    }


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
    
    useEffect(() => {
      if (loggedInUser) {
        fetchVacations();
        fetchReport();
      }
    }, [loggedInUser]);
      
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
  
  const fetchVacations = async () => {
    try {
      const token = localStorage.getItem('token');
  
      const response = await fetch('http://localhost:3000/vacations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Fetch failed: ${error}`);
      }
      let data = await response.json();
      setVacations(data);
    } catch (error) {
      console.error('Failed to fetch vacations', error);
    }
    };

    const deleteVacation = async (holidayId: number) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/vacations/${holidayId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Delete failed: ${error}`);
        }
        fetchVacations();      
        Swal.fire({
          title: 'Vacation deleted successfully',
          icon: 'success',
          showConfirmButton: false,
          timer: 2500,
        });
      } catch (error) {
        console.error('Delete failed', error);
      }
    };



    const deleteCard = (holiday : number) => {
      Swal.fire({
        title: 'Are you sure you want to delete this vacation?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff0000',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          deleteVacation(holiday);
        }
      });
    };


 

    const fetchReport = async () => {
      try {
        const token = localStorage.getItem('token');
  
        const response = await fetch('http://localhost:3000/report', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Fetch failed: ${error}`);
        }
        const data = await response.json();
        setVacations(data);
        const reportValue = data ? data : 0;
        setReport(reportValue);
      } catch (error) {
        console.error('Failed to fetch vacations', error);
      }
    };

    const openFilterDialog = async () => {
      const { value } = await Swal.fire({
        title: 'More options',
        input: 'select',
        inputOptions: {
          AddVacation: 'Add Vacation',
          reportPage: 'Report Page'
        },
        inputPlaceholder: 'Select Option',
        showCancelButton: true,
      });
      if (value === 'AddVacation') {
        addVacation();
      }
      if (value === 'reportPage') {
        reportPage();
      }
    };



    
    
    vacations.sort((a: Vacation, b: Vacation) => {
      if (sortByStartDate) {
          return new Date(a.vacation_start).getTime() - new Date(b.vacation_start).getTime();
      } else {
          return new Date(a.vacation_end).getTime() - new Date(b.vacation_end).getTime();
      }
  });

    
      const totalFilteredItems = vacations.length;
      const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);
      const adjustedCurrentPage = Math.min(currentPage, totalPages);
      const indexOfLastItem = adjustedCurrentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = vacations.slice(indexOfFirstItem, indexOfLastItem);
      const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    
      return (
        <>
          <Nav />
          <div className="filter">
          <h3 onClick={openFilterDialog}>More Options <FontAwesomeIcon icon={faCircleInfo} /></h3>   
          </div>       
          <div>
            <div className="card-area">
              {currentItems.map((vacation, index) => (
                <AdminCard
                  key={index}
                  holiday={vacation}
                  deleteCard={deleteCard}
                  editCard={editCard}
                />
              ))}
            </div>
            <Pagination
              itemsPerPage={itemsPerPage}
              totalItems={totalFilteredItems}
              paginate={paginate}
              currentPage={adjustedCurrentPage}
            />
          </div>
        </>
      );
    };
export default AdminPage;
