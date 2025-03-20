import React, { useEffect, useState } from 'react';
import CreateProductItem from './CreateProductItem';
import clientAPI from '../../../client-api/rest-client';

interface Category {
    id: string;
    name: string;
    categoriesUrlImage: string | null;
    parent_Id: string | null;
    children: Category[];
}

interface Brand {
    id: number;
    name: string;
}
const CreateProduct: React.FC = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
    const [slug, setSlug] = useState('');
    const [productItems, setProductItems] = useState<string[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    useEffect(() => {
        // Fetch categories and brands here
        const fetchCategories = async () => {
            // Fetch categories
            const response1 = await clientAPI.service('Categories/admin').find();
            const categories = (response1 as { result: Category[] }).result;
            const childrenFilter = categories.filter(category => category.children && category.children.length > 0);
            const childrenCategories = childrenFilter.flatMap(category => category.children);
            setCategories(childrenCategories);
        };
        const fetchBrands = async () => {
            const response2 = await clientAPI.service('Brands').find();
            const brands = (response2 as { result: Brand[] }).result;
            setBrands(brands);
        }
        fetchCategories();
        fetchBrands();
    }, []);
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setThumbnailImage(e.target.files[0]);
        }
    };

    const handleAddProductItem = () => {
        setProductItems([...productItems, '']);
    };

    const handleProductItemChange = (index: number, value: string) => {
        const newProductItems = [...productItems];
        newProductItems[index] = value;
        setProductItems(newProductItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white shadow-md rounded">
                <div className="mb-4">
                    <label className="block text-gray-700">Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Category:</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Brand:</label>
                    <select
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Select Brand</option>
                        {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Thumbnail Image:</label>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="mt-1 block w-full text-gray-700"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Slug:</label>
                    <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Product Items:</label>
                    {productItems.map((item: string, index: number) => (
                        <div key={index} className="mb-2">
                            <CreateProductItem />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddProductItem}
                        className="mt-1 mb-2 px-4 py-2 bg-indigo-500 text-white rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Add Product Item
                    </button>
                </div>
                <div className="mb-4">
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-indigo-500 text-white rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Create Product
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateProduct;
