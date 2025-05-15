import React from 'react';
import TableCategory from './components/TableCategory';
import TableCategoryExample from './components/TableCategoryExample';


const Category: React.FC = () => {
    return (
        <div className="container mx-auto p-2">
            <h1 className="text-2xl font-bold mb-6">Category Management</h1>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="w-full lg:w-full">
                    <TableCategoryExample />
                </div>
            </div>
        </div>
    );
};

export default Category;