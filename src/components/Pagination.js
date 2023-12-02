import React from 'react';
import '../Stylesheets/Pagination.css';

const Pagination = ({ membersPerPage, totalMembers, currentPage, setCurrentPage }) => {
    const pageNumbers = [];

    const lastPage = Math.ceil(totalMembers / membersPerPage);

    for (let i = 1; i <= lastPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="paginationDiv">
            <p className="para"> <b> Page {(totalMembers!==0)?currentPage:0} of {Math.ceil(totalMembers / membersPerPage)} </b> </p>
            <ul className="list">
                <li>
                    <button className='pageButton' onClick={() => setCurrentPage(1)}>{"<<"}</button>
                </li>
                <li>
                    <button className='pageButton' onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}>
                        {"<"}
                    </button>
                </li>
                {pageNumbers.map((number) => (
                    <li key={number}>
                        <button className='pageButton' onClick={() => setCurrentPage(number)}>{number}</button>
                    </li>
                ))}
                <li>
                    <button className='pageButton' onClick={() => setCurrentPage(currentPage < lastPage ? currentPage + 1 : currentPage)}>
                        {">"}
                    </button>
                </li>
                <li>
                    <button className='pageButton' onClick={() => setCurrentPage(lastPage)}>{">>"}</button>
                </li>
            </ul>
        </div>
    );
};

export default Pagination;
