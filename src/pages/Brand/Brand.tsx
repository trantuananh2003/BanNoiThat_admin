import React from 'react';
import TableBrand from './components/TableBrand';

const Brand: React.FC = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Brand Management</h1>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="w-full lg:w-3/4">
                    <TableBrand />
                </div>
            </div>
        </div>
    );
};

export default Brand;