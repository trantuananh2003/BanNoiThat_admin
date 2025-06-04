import React from 'react';
import TableCategoryExample from './components/table-category';


const Category: React.FC = () => {
    return (
        <div className="mx-auto p-1 pr-8"> 
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="w-full lg:w-full">
                    <TableCategoryExample />
                </div>
            </div>
        </div>
    );
};

export default Category;