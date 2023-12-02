import React, { useState } from 'react';
import '../Stylesheets/Search.css';

const Search = ({ handleSearch, handleDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchClick = () => {
        handleSearch(searchTerm);
    };

    const handleDeleteClick = () => {
        handleDelete();
    };

    return (
        <div className='searchContainer'>
            <div>
            <input className="searchInput"
                type="text"
                placeholder="Enter value..."
                value={searchTerm}
                onChange={handleInputChange}
            />
            </div>

            <br />
            
            <div>
            <button className="searchButton" onClick={handleSearchClick}>Search</button>
            <button className="deleteButton" onClick={handleDeleteClick}>Delete</button>
            </div>
        </div>
    );
};

export default Search;
