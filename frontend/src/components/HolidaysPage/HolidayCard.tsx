import React, { FC, useEffect, useState } from 'react';
import './HolidayCard.css';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

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
  userId: number;
}

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

interface HolidayCardProps {
    holiday: Holiday;
    followedVacations: Vacation[];
    userFollowVacation: (userId: number, vacationId: number) => void;
    unfollowVacation: (userId: number, vacationId: number) => void;
    loggedInUserId: number;
}



const HolidayCard: FC<HolidayCardProps> = ({ holiday, followedVacations, userFollowVacation, unfollowVacation, loggedInUserId }) => {    
    const [isFollowed, setIsFollowed] = useState(holiday.isFollowed);
    const heartStyle = { color: "red", fontSize: "2em" }
    console.log("Holiday data in card:", holiday);

    
  useEffect(() => {
    const isVacationFollowed = followedVacations.some((vacation) => vacation.vacation_id === holiday.vacation_id);
    setIsFollowed(isVacationFollowed);
  }, [followedVacations, holiday.vacation_id]);

  const heartIcon = isFollowed 
    ? <AiFillHeart style={heartStyle} onClick={() => unfollowVacation(loggedInUserId, holiday.vacation_id)} /> 
    : <AiOutlineHeart style={heartStyle} onClick={() => userFollowVacation(loggedInUserId, holiday.vacation_id)} />;
  
    return (
        <div className="card">
        <div className="card__image-container">
          <img
            className="card__background"
            src={`http://localhost:3000/vacation_images/${holiday.vacation_image_file_name}`}
            alt={holiday.vacation_description}
          />
          
          <h2 className="card__title">{holiday.vacation_destination}</h2>
          <div className="card__heart">{heartIcon}</div>
        </div>
        <div className="card__content">

          <div className="card__hover-content">
            <div className="card__content-top">
                <p className="card__description">{holiday.vacation_description}</p>
                <p className="card__Followers">Followers: {holiday.follower_count}</p>

            </div>
            <div className="card__content-bottom">
                <p className="card__Price">Price: {holiday.price}$</p>

                <div className="card__date-container">
                <FontAwesomeIcon className='card__date' icon={faCalendar} />
                {new Date(holiday.vacation_start).toLocaleDateString()}-
                {new Date(holiday.vacation_end).toLocaleDateString()}
                </div>
            </div>
          </div>
        </div>
      </div>
      
      );
      

};

export default HolidayCard;
