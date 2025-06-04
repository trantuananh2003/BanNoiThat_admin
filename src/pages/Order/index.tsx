import React from 'react';
import OrderPage from './components/tab-order-status';

const Order: React.FC = () => {
    return (
        <div className="mx-auto p-1 pr-8"> 
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="w-full lg:w-full">
                    <OrderPage />
                </div>
            </div>
        </div>
    );
};

export default Order;