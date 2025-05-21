import React from 'react';
import TableBrandExample from './components/table-brand';

const Brand: React.FC = () => {
    return (
        <div className="container mx-auto p-2"> 
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="w-full lg:w-full">
                    <TableBrandExample />
                </div>
            </div>
        </div>
    );
};

export default Brand;