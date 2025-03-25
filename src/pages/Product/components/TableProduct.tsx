import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Checkbox, Image, Select } from 'antd';
import { DeleteOutlined, EditOutlined, SaveOutlined, ToolOutlined } from '@ant-design/icons';
import clientAPI from '../../../client-api/rest-client';
import CreateProduct from './CreateProduct';
import Modal from 'react-modal';
import EditProductItem from './EditProductItem';

const { Search } = Input;

interface Category {
    id: string;
    name: string;
    slug: string;
    children: Category[];
}

interface Product {
    id: string;
    name: string;
    slug: string;
    thumbnailUrl: string;
    thumbnailFile?: File;
    keyword: string;
    featured: boolean;
    visible: boolean;
    categoryId: string;
    brandId: string;
    description: string;
    category?: Category; // Thêm category vào đây
    brand?: Brand;
}


interface Brand {
    id: string;
    name: string;
    slug: string;
}
const TableProduct: React.FC = () => {
    const [data, setData] = useState<Product[]>([]);
    const [editId, setEditId] = useState<string | null>(null);
    const [editProductItemId, setEditProductItemId] = useState<string | null>(null);
    const [editProduct, setEditProduct] = useState<Partial<Product>>({});
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response: { result: Product[] } = await clientAPI.service('Products').find(`PageSize=${20}&PageCurrent=${currentPage}`);
                setData(response.result);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
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
        fetchProducts();
    }, []);

    const handleEdit = (record: Product) => {
        setEditId(record.id);
        setEditProduct(record);
    };

    const handleSave = async (key: string) => {
        const formData = new FormData();
        formData.append('Name', editProduct.name ?? '');
        if (editProduct.thumbnailFile) {
            formData.append('Image', editProduct.thumbnailFile);
        }
        formData.append('Category_Id', editProduct.categoryId ?? '');
        formData.append('Brand_Id', editProduct.brandId ?? '');
        formData.append('Description', editProduct.description ?? '');
        formData.append('Slug', editProduct.slug ?? '');
        console.log(editProduct)
        try {
            await clientAPI.service('products').put(key, formData);
            setData(prevData =>
                prevData.map(item => (item.id === key ? { ...item, ...editProduct } : item))
            );
            setEditId(null);
            // window.location.reload(); // Reload lại toàn bộ trang
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const handleDelete = async (key: string) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this product?');
        if (confirmDelete) {
            try {
                await clientAPI.service('Products').remove(key);
                setData((prevData) => prevData.filter((item) => item.id !== key));
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    const handleAddNew = () => {
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        // Handle the logic for adding a new product here
        setIsModalVisible(false);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const handleEditProductItem = (id: string) => {
        setEditProductItemId(id);
        setIsEditModalVisible(true);
    };

    const handleEditModalOk = () => {
        // Handle the logic for adding a new product here
        setIsEditModalVisible(false);
    };

    const handleEditModalCancel = () => {
        setIsEditModalVisible(false);
    };

    const columns = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (_: any, record: Product) => (
                editId === record.id ? (
                    <Input
                        value={editProduct.name}
                        onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                    />
                ) : (
                    record.name
                )
            ),
        },
        {
            title: "Danh mục sản phẩm",
            dataIndex: 'category',
            key: 'category',
            render: (_: any, record: Product) => (
                editId === record.id ? (
                    <Select
                        value={editProduct.categoryId ?? record.category?.id}
                        onFocus={() => {
                            // Thiết lập giá trị ban đầu nếu chưa có
                            if (!editProduct.id) {
                                setEditProduct({
                                    ...record,  // Giữ nguyên dữ liệu của record
                                    id: record.id,
                                    categoryId: record.category?.id
                                });
                            }
                        }}
                        onChange={(value) => {
                            if (value !== editProduct.categoryId) {
                                setEditProduct(prev => ({
                                    ...prev,
                                    categoryId: value
                                }));
                            }
                        }}
                        style={{ width: '100%' }}
                    >
                        {categories.map((cat) => (
                            <Select.Option key={cat.id} value={cat.id}>
                                {cat.name}
                            </Select.Option>
                        ))}
                    </Select>
                ) : (
                    record.category?.name || 'Không có danh mục'
                )
            ),
        },
        {
            title: "Thương hiệu",
            dataIndex: 'brand',
            key: 'brand',
            render: (_: any, record: Product) => (
                editId === record.id ? (
                    <Select
                        value={editProduct.brandId ?? record.brand?.id}
                        onFocus={() => {
                            if (!editProduct.id) {
                                setEditProduct({
                                    ...record,  // Giữ nguyên dữ liệu của record
                                    id: record.id,
                                    brandId: record.brand?.id
                                });
                            }
                        }}
                        onChange={(value) => {
                            if (value !== editProduct.brandId) {
                                setEditProduct(prev => ({
                                    ...prev,
                                    brandId: value
                                }));
                            }
                        }}
                        style={{ width: '100%' }}
                    >
                        {brands.map((brand) => (
                            <Select.Option key={brand.id} value={brand.id}>
                                {brand.name}
                            </Select.Option>
                        ))}
                    </Select>
                ) : (
                    record.brand?.name || 'Không có thương hiệu'
                )
            ),
        },


        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
            render: (_: any, record: Product) => (
                editId === record.id ? (
                    <Input
                        value={editProduct.slug}
                        onChange={(e) => setEditProduct({ ...editProduct, slug: e.target.value })}
                    />
                ) : (
                    record.slug
                )
            ),
        },
        {
            title: "Hình ảnh",
            dataIndex: "image",
            key: "image",
            render: (_: any, record: Product) => (
                editId === record.id ? (
                    <div>
                        {editProduct.thumbnailUrl && (
                            <img
                                src={editProduct.thumbnailUrl}
                                alt="Preview"
                                style={{ width: 50, height: 50, marginRight: 10, objectFit: "cover" }}
                            />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = event => {
                                        setEditProduct(prev => ({
                                            ...prev,
                                            thumbnailFile: file,
                                            thumbnailUrl: event.target?.result as string,
                                        }));
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                    </div>
                ) : (
                    <img
                        src={record.thumbnailUrl || editProduct.thumbnailUrl || ''}
                        alt="Product"
                        style={{ width: 50, height: 50, objectFit: "cover" }}
                    />
                )
            ),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            render: (_: any, record: Product) => (
                editId === record.id ? (
                    <Input
                        value={editProduct.description}
                        onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                    />
                ) : (
                    record.description
                )
            ),
        },
        {
            title: 'Từ khóa',
            dataIndex: 'keyword',
            key: 'keyword',
        },
        {
            title: 'Tiêu biểu',
            dataIndex: 'featured',
            key: 'featured',
            render: (featured: boolean) => (
                <Checkbox
                    checked={featured}
                    onChange={(e) => setEditProduct({ ...editProduct, featured: e.target.checked })}
                />
            ),
        },
        {
            title: 'Hiển thị',
            dataIndex: 'visible',
            key: 'visible',
            render: (visible: boolean) => (
                <Checkbox
                    checked={visible}
                    onChange={(e) => setEditProduct({ ...editProduct, visible: e.target.checked })}
                />
            ),
        },
        {
            title: 'Tác vụ',
            dataIndex: 'actions',
            key: 'actions',
            render: (_: any, record: Product) => (
                <div className="flex space-x-2">
                    {editId === record.id ? (
                        <div className='flex gap-3'>
                            <Button type="primary" icon={<SaveOutlined />} onClick={() => handleSave(record.id)} />
                            <Button onClick={() => setEditId(null)}>Cancel</Button>
                        </div>
                    ) : (
                        <div className='flex space-x-2'>
                            <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                            <Button type="primary" icon={<ToolOutlined />} onClick={() => handleEditProductItem(record.id)}> Variations</Button>
                            <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
                        </div>
                    )}
                </div>
            ),
        },
    ];



    return (
        <div className="p-4">
            <Search placeholder="Nhập từ khóa tìm kiếm" className="mb-4" />
            <Button type="primary" className="mb-4" onClick={handleAddNew}>Thêm mới</Button>
            <Modal isOpen={isModalVisible} ariaHideApp={false}
                onRequestClose={handleModalCancel}>
                <CreateProduct />
                <div className="flex justify-end mt-4">
                    <Button type="primary" onClick={handleModalOk}>OK</Button>
                    <Button onClick={handleModalCancel} className="ml-2">Cancel</Button>
                </div>
            </Modal>

            <Table
                dataSource={data}
                columns={columns}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    onChange: (page, pageSize) => {
                        setCurrentPage(page);
                        setPageSize(pageSize);
                    },
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '15', '20'],
                }}
            />

            <Modal isOpen={isEditModalVisible} onRequestClose={handleEditModalCancel} ariaHideApp={false}>
                {editProductItemId && <EditProductItem productId={editProductItemId} />}
                <div className="flex justify-end mt-4">
                    <Button type="primary" onClick={handleEditModalOk}>OK</Button>
                    <Button onClick={handleEditModalCancel} className="ml-2">Cancel</Button>
                </div>
            </Modal>
        </div>
    );
};

export default TableProduct;