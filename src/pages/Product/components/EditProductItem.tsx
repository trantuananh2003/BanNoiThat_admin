import React, { useState, useEffect } from 'react';
import clientAPI from '../../../client-api/rest-client';

interface ProductItem {
    id: string | null;
    quantity: number;
    nameOption: string;
    price: number;
    salePrice: number;
    sku: string;
    image: File | null;
}

interface Props {
    productId?: string;
}

const ProductItemForm: React.FC<Props> = ({ productId }) => {
    const [productItems, setProductItems] = useState<ProductItem[]>([]);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            if (productId) {
                try {
                    const response = await clientAPI.service("products").get(productId.toString());
                    const productData = response as { result: { productItems: ProductItem[] } };
                    if (productData.result.productItems) {
                        setProductItems(productData.result.productItems);
                    }
                } catch (error) {
                    console.error("Error fetching product:", error);
                }
            }
        };

        fetchProduct();
    }, [productId]);

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProductItems((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [name]: name.includes("price") || name === "quantity" ? Number(value) : value } : item
            )
        );
    };

    const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return; // Kiểm tra nếu files là null hoặc rỗng
        setProductItems((prev) =>
            prev.map((item, i) => (i === index ? { ...item, image: files[0] } : item))
        );
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        // Nếu có ảnh, dùng FormData để gửi file
        const formData = new FormData();
        productItems.forEach((items, index) => {
            formData.append(`items[${index}][id]`, items.id ? items.id.toString() : "")
            formData.append(`items[${index}][nameOption]`, items.nameOption);
            formData.append(`items[${index}][quantity]`, items.quantity.toString());
            formData.append(`items[${index}][price]`, items.price.toString());
            formData.append(`items[${index}][salePrice]`, items.salePrice.toString());
            formData.append(`items[${index}][sku]`, items.sku);
            if (items.image) {
                formData.append(`productItems[${index}][imageUrl]`, items.image);
            }
        });
    
        try {
            const response = await clientAPI.service('products').put(`${productId}/product-items`, formData);
            console.log('Response:', response);
        } catch (error) {
            console.error('Error submitting:', error);
        }
    };
    

    const addProductItem = () => {
        setProductItems((prev) => [...prev, { id: null, quantity: 1, nameOption: '', price: 0, salePrice: 0, sku: '', image: null }]);
    };

    if (!isVisible) return null;

    return (
        <div className="relative max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <button onClick={handleClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            <h2 className="text-2xl font-bold mb-6">{productId ? `Chỉnh sửa sản phẩm ID: ${productId}` : 'Tạo sản phẩm mới'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-wrap gap-4">
                    {productItems.map((item, index) => (
                        <div key={index} className="flex flex-col p-4 border rounded-lg shadow-sm w-1/3">
                            <label className="block text-gray-700">Số lượng:</label>
                            <input type="number" name="quantity" value={item.quantity} onChange={(e) => handleChange(index, e)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                            <label className="block text-gray-700">Tên Option:</label>
                            <input type="text" name="nameOption" value={item.nameOption} onChange={(e) => handleChange(index, e)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                            <label className="block text-gray-700">Giá:</label>
                            <input type="number" name="price" value={item.price} onChange={(e) => handleChange(index, e)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                            <label className="block text-gray-700">Giá KM:</label>
                            <input type="number" name="salePrice" value={item.salePrice} onChange={(e) => handleChange(index, e)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                            <label className="block text-gray-700">SKU:</label>
                            <input type="text" name="sku" value={item.sku} onChange={(e) => handleChange(index, e)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                            <label className="block text-gray-700">Hình ảnh:</label>
                            <input type="file" accept="image/*" onChange={(e) => handleImageChange(index, e)} className="mt-1 block w-full" />
                        </div>
                    ))}
                </div>
                <button type="button" onClick={addProductItem} className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">+ Thêm sản phẩm</button>
                <button type="submit" className="mt-4 ml-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Lưu</button>
            </form>
        </div>
    );
};

export default ProductItemForm;