import React, { useEffect, useState } from 'react'
import Pagination from './Pagination';
import Search from './Search';
import "../Stylesheets/Table.css";

function Table() {

    const [members, setMembers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [editMemberId, setEditMemberId] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [editedRole, setEditedRole] = useState('');
    //for checkbox selection
    const [selectedRows, setSelectedRows] = useState([]);
    // for seach
    const [searchTerm, setSearchTerm] = useState('');
    const membersPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'
                );
                const data = await response.json();
                setMembers(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    // Calculate the indexes for the members to display on the current page
    const indexOfLastMember = currentPage * membersPerPage;  // the last number member to display
    const indexOfFirstMember = indexOfLastMember - membersPerPage; // the first number member to display
    // Filter members based on search term
    const filteredMembers = members.filter((member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) || member.email.toLowerCase().includes(searchTerm.toLowerCase()) || member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if(filteredMembers.length===0)
    {
        var currentMembers=[{"id":"-","name":"-","email":"-","role":"-"}];
    }
    else
    {
        currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
    }
    //currentMembers is again a sliced array

    // for implementing the edit and delete functionality
    const handleEdit = (memberId, currentName, currentEmail, currentRole) => {
        setEditMemberId(memberId);
        setEditedName(currentName);
        setEditedEmail(currentEmail);
        setEditedRole(currentRole);
    };

    const handleSave = (memberId) => {
        // Update the member's name and reset the edit state
        setMembers((prevMembers) =>
            prevMembers.map((member) =>
                member.id === memberId ? { ...member, name: editedName, email: editedEmail, role: editedRole } : member
            )
        );
        setEditMemberId(null);
    };

    const handleDelete = () => {
        // Filter out the member with the given ID
        const updatedMembers = members.filter((member) => !selectedRows.includes(member.id));
        setMembers(updatedMembers);
        // Clear the selected rows
        setSelectedRows([]);

        // Adjust pagination if needed
        const lastPage = Math.ceil(updatedMembers.length / membersPerPage);
        if (currentPage > lastPage) {
            setCurrentPage(lastPage);
        }
    };

    const handleDeleteID = (memberId) => {
        // Filter out the member with the given ID
        const updatedMembers = members.filter((member) => member.id !== memberId);
        setMembers(updatedMembers);
        // Clear the selected rows
        setSelectedRows([]);

        // Adjust pagination if needed
        const lastPage = Math.ceil(updatedMembers.length / membersPerPage);
        if (currentPage > lastPage) {
            setCurrentPage(lastPage);
        }
    };


    

    // for implementing the checkboxes
    const handleRowCheckboxChange = (memberId) => {
        setSelectedRows((prevSelectedRows) => {
            if (prevSelectedRows.includes(memberId)) {
                // If the row is already selected, remove it
                return prevSelectedRows.filter((id) => id !== memberId);
            } else {
                // If the row is not selected, add it
                return [...prevSelectedRows, memberId];
            }
        });
    };

    const handleSelectAllRows = () => {
        // If all rows are already selected, clear the selection; otherwise, select all
        if (selectedRows.length === currentMembers.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(currentMembers.map((member) => member.id));
        }
    };

    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
        setCurrentPage(1); // Reset to the first page when performing a new search
        setSelectedRows([]); // Clear selected rows when initiating a new search
    };

    return (
        <div>
            <Search handleSearch={handleSearch} handleDelete={handleDelete} />

            <table>
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                checked={selectedRows.length === currentMembers.length}
                                onChange={handleSelectAllRows}
                            />
                        </th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentMembers.map((member) => (
                        <tr key={member.id} className={selectedRows.includes(member.id) ? 'selected-row' : ''}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedRows.includes(member.id)}
                                    onChange={() => handleRowCheckboxChange(member.id)}
                                />
                            </td>
                            <td>
                                {editMemberId === member.id ? (
                                    <input
                                        type="text"
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                    />
                                ) : (
                                    member.name
                                )}
                            </td>
                            <td>
                                {editMemberId === member.id ? (
                                    <input
                                        type="text"
                                        value={editedEmail}
                                        onChange={(e) => setEditedEmail(e.target.value)}
                                    />
                                ) : (
                                    member.email
                                )}
                            </td>
                            <td>
                                {editMemberId === member.id ? (
                                    <input
                                        type="text"
                                        value={editedRole}
                                        onChange={(e) => setEditedRole(e.target.value)}
                                    />
                                ) : (
                                    member.role
                                )}
                            </td>
                            <td className='editOrSaveColumn'>
                            {member.id!=='-'? (
                                <div>
                                {editMemberId === member.id ? (
                                    <button className='editOrSave' onClick={() => handleSave(member.id)}>Save</button>
                                ) : (
                                    <button className='editOrSave' onClick={() => handleEdit(member.id, member.name, member.email, member.role)}>Edit</button>
                                )}
                            
                                <button className='delete' onClick={() => handleDeleteID (member.id)}>Delete</button>
                                </div>
                            ):(<div> <p>-</p> </div>)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <br />
            {/* The props for pagination are: no. of users to be displayed, total length of response, which page we are currently on,  */}
            <Pagination
                membersPerPage={membersPerPage}
                totalMembers={filteredMembers.length}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    )
}

export default Table