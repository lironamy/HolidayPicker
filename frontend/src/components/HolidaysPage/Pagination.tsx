import React from 'react';
import Pagination from '@mui/material/Pagination';
import './Pagination.css';

interface PaginationProps {
  itemsPerPage: number;
  totalItems: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}

const CustomPagination: React.FC<PaginationProps> = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1 || totalItems <= itemsPerPage) {
    return null;
  }

  const handlePageChange = (event: React.ChangeEvent<unknown>, pageNumber: number) => {
    paginate(pageNumber);
    window.scrollTo(0, 0);
  };

  return (
    <nav className='navPagination'>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="secondary"
        showFirstButton
        showLastButton
        classes={{ ul: 'pagination' }}
      />
    </nav>
  );
};

export default CustomPagination;
