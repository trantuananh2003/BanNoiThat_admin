import React, { useState } from 'react';

interface ProductItem {
    quantity: number;
    nameOption: string;
    price: number;
    salePrice: number;
    sku: string;
    image: File | null;
}

const CreateProductItem: React.FC = () => {
    const [productItem, setProductItem] = useState<ProductItem>({
        quantity: 0,
        nameOption: '',
        price: 0,
        salePrice: 0,
        sku: '',
        image: null,
    });

    const [isVisible, setIsVisible] = useState(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProductItem({
            ...productItem,
            [name]: name === 'quantity' || name === 'price' || name === 'salePrice' ? Number(value) : value
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setProductItem({ ...productItem, image: e.target.files[0] });
        }
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <button
                onClick={handleClose}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            >
                &times;
            </button>
            <h2 className="text-2xl font-bold mb-6">Create Product Item</h2>
            <form>
                <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label className="block text-gray-700">Quantity:</label>
                        <input
                            type="number"
                            name="quantity"
                            value={productItem.quantity}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Name Option:</label>
                        <input
                            type="text"
                            name="nameOption"
                            value={productItem.nameOption}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Price:</label>
                        <input
                            type="number"
                            name="price"
                            value={productItem.price}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Sale Price:</label>
                        <input
                            type="number"
                            name="salePrice"
                            value={productItem.salePrice}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">SKU:</label>
                        <input
                            type="text"
                            name="sku"
                            value={productItem.sku}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Image:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-1 block w-full"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateProductItem;