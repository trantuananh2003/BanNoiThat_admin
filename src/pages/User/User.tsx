import React from 'react';
import TableUser from './components/TableUser';
import TableUserExample from './components/TableUserExample';

const User: React.FC = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">User Management</h1>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="w-full lg:w-full">
                    <TableUserExample />
                </div>
            </div>
        </div>
    );
};

export default User;