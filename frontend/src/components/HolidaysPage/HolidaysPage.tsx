import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HolidayCard from './HolidayCard';
import CustomPagination from './Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import Nav from '../Nav/Nav';


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

const HolidayPage: FC = () => {
    const navigate = useNavigate();
    const [vacations, setVacations] = useState<Vacation[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortByStartDate, setSortByStartDate] = useState(true);
    const [loggedInUser, setLoggedInUser] = useState<UserData | null>(null);
    const [followedVacations, setFollowedVacations] = useState<Vacation[]>([]);
    const [filter, setFilter] = useState<string | null>(null);
    const [report, setReport] = useState<number>(0);


    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
      
        if (token && role === 'regular') {
          fetchUserData()
            .then((userData) => {
              if (userData) {
                setLoggedInUser(userData);
                fetchFollowedVacations(userData.userId);
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
        fetchFollowedVacations(loggedInUser.userId);
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

  const fetchFollowedVacations = async (userId: number) => {
  try {
    const token = localStorage.getItem('token');
    if (!userId) {
      return;
    }

    const response = await fetch(`http://localhost:3000/user/${userId}/followed`, {
        headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Fetch failed: ${error}`);
        }

        const data = await response.json();
        setFollowedVacations(data);
      } catch (error) {
        console.error('Failed to fetch followed vacations', error);
      }
    };

    const userFollowVacation = async (userId: number, vacationId: number) => {
        try {
          const token = localStorage.getItem('token');
        
          const response = await fetch('http://localhost:3000/follow', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ user_id: userId, vacation_id: vacationId }),
          });
      
          if (!response.ok) {
            throw new Error('Failed to follow vacation');
          }
      
          fetchReport();
          fetchFollowedVacations(userId);
        } catch (error) {
          console.error('Failed to follow vacation', error);
        }
      };
      
      const unfollowVacation = async (userId: number, vacationId: number) => {
        try {
          const token = localStorage.getItem('token');
        
          const response = await fetch('http://localhost:3000/unfollow', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ user_id: userId, vacation_id: vacationId }),
          });
      
          if (!response.ok) {
            throw new Error('Failed to unfollow vacation');
          }
          fetchReport();
          fetchFollowedVacations(userId);
        } catch (error) {
          console.error('Failed to unfollow vacation', error);
        }
      };

      const openFilterDialog = async () => {
        const { value } = await Swal.fire({
          title: 'Filter options',
          input: 'select',
          inputOptions: {
            showAll: 'Show All',
            showFollowed: 'Show Followed',
            showNotStarted: 'Show Not Started',
            showActive: 'Show Active'
          },
          inputPlaceholder: 'Select a filter',
          showCancelButton: true,
        });
      
        if (value) {
          setFilter(value);
        } else {
          setFilter(null);
        }
      };
      

    const updatedVacations = vacations.map(vacation => ({
        ...vacation,
        isFollowed: followedVacations.some(followedVacation => followedVacation.vacation_id === vacation.vacation_id),
    }));

    const filteredVacations = updatedVacations.filter(vacation => {
        switch (filter) {
          case 'showFollowed':
            return vacation.isFollowed;
          case 'showNotStarted':
            return new Date(vacation.vacation_start) > new Date();
          case 'showActive':
            return new Date(vacation.vacation_start) <= new Date() && new Date() <= new Date(vacation.vacation_end);
          case 'showAll':
          default:
            return true;
        }
      });
      

    vacations.sort((a: Vacation, b: Vacation) => {
        if (sortByStartDate) {
            return new Date(a.vacation_start).getTime() - new Date(b.vacation_start).getTime();
        } else {
            return new Date(a.vacation_end).getTime() - new Date(b.vacation_end).getTime();
        }
    });

    
      const totalFilteredItems = filteredVacations.length; 
      const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);
      const adjustedCurrentPage = Math.min(currentPage, totalPages);
      const indexOfLastItem = adjustedCurrentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = filteredVacations.slice(indexOfFirstItem, indexOfLastItem);
      const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    
      return (
        <>
        <Nav />
        <div>
            <div className="filter">
            <h3 onClick={openFilterDialog}>Filter <FontAwesomeIcon icon={faFilterCircleXmark} /></h3>

            </div>

            <div className="card-area">
                {currentItems.map((vacation, index) => (
                    <HolidayCard
                        key={index}
                        holiday={vacation}
                        followedVacations={followedVacations}
                        userFollowVacation={userFollowVacation}
                        unfollowVacation={unfollowVacation}
                        loggedInUserId={loggedInUser ? loggedInUser.userId : 0}
                    />
                ))}
            </div>

            <CustomPagination itemsPerPage={itemsPerPage} totalItems={totalFilteredItems} paginate={paginate} currentPage={adjustedCurrentPage} />
        </div>
        </>
    );
    
};

export default HolidayPage;
