import React, { useState, useEffect } from 'react';
import clientAPI from '../../../client-api/rest-client';

interface ProductItem {
    id: string | null;
    quantity: number;
    nameOption: string;
    price: number;
    salePrice: number;
    sku: string;
    imageProductItem: any;
    imageProductItemUrl?: string;
    isDelete?: boolean;
}

interface Props {
    productId?: string;
}

const ProductItemForm: React.FC<Props> = ({ productId }) => {
    const [productItems, setProductItems] = useState<ProductItem[]>([]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Nếu có ảnh, dùng FormData để gửi file
        const formData = new FormData();
        productItems.forEach((items, index) => {
            formData.append(`items[${index}].id`, items.id ? items.id.toString() : "")
            formData.append(`items[${index}].nameOption`, items.nameOption);
            formData.append(`items[${index}].quantity`, items.quantity.toString());
            formData.append(`items[${index}].price`, items.price.toString());
            formData.append(`items[${index}].salePrice`, items.salePrice.toString());
            formData.append(`items[${index}].sku`, items.sku);
            formData.append(`items[${index}].isDelete`, items.isDelete ? items.isDelete.toString() : "false");

            if (items.imageProductItem) {
                formData.append(`items[${index}].imageProductItem`, items.imageProductItem);
            }
        });
        try {
            const response = await clientAPI.service('products').put(`${productId}/product-items`, formData);
            console.log('Response:', response);
        } catch (error) {
            console.error('Error submitting:', error);
        }
    };

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProductItems((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [name]: name.includes("price") || name === "quantity" ? Number(value) : value } : item
            )
        );
    };

    const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {

            const reader = new FileReader();
            reader.readAsDataURL(file);
            setProductItems((prev) =>
                prev.map((item, i) => (i === index ? { ...item, imageProductItem: file } : item))
            );

            reader.onload = (e) => {
                const imgUrl = e.target?.result as string;
                setProductItems((prev) => {
                    return prev.map((item, i) => (i === index ? { ...item, imageProductItemUrl: imgUrl } : item))
                });
            };
        }
    };

    const addProductItem = () => {
        setProductItems((prev) => [...prev, { id: null, quantity: 1, nameOption: '', price: 0, salePrice: 0, sku: '', imageProductItem: null }]);
    };

    const deleteProductItem = (index: number) => {
        setProductItems(prevItems => prevItems.map((item, i) => i === index ? { ...item, isDelete: true } : item));
    }

    return (
        <div className="w-full h-full">
            <h2 className="text-2xl font-bold mb-6">{productId ? `Chỉnh sửa sản phẩm ID: ${productId}` : 'Tạo sản phẩm mới'}</h2>
            <form onSubmit={handleSubmit} >
                <div className="flex gap-4 overflow-x-scroll ">
                    {productItems.map((item, index) => (
                        <div key={index} className="flex flex-col min-w-[300px] p-4 border rounded-lg shadow-sm">

                            {item.isDelete ? <div className="text-red-400 font-bold text-end">Đã xóa</div> : <div onClick={() => deleteProductItem(index)} className="text-red-400 font-bold text-end hover: cursor-pointer">X</div>}
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
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(index, e)}
                                className="mt-1 block w-full max-w-xs"
                            />
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