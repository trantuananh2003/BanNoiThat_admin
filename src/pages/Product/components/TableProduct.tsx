import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Checkbox, Image } from 'antd';
import { DeleteOutlined, EditOutlined, SaveOutlined, ToolOutlined } from '@ant-design/icons';
import clientAPI from '../../../client-api/rest-client';
import CreateProduct from './CreateProduct';
import Modal from 'react-modal';

const { Search } = Input;

interface Product {
    id: string;
    name: string;
    slug: string;
    image: string;
    featured: boolean;
    visible: boolean;
}

const TableProduct: React.FC = () => {
    const [data, setData] = useState<Product[]>([]);
    const [editId, setEditId] = useState<string | null>(null);
    const [editProduct, setEditProduct] = useState<Partial<Product>>({});
    const [newProduct, setNewProduct] = useState<Partial<Product>>({});
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response: { result: Product[] } = await clientAPI.service('Products').find(`PageSize=${20}&PageCurrent=${currentPage}`);
                setData(response.result);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleEdit = (record: Product) => {
        setEditId(record.id);
        setEditProduct(record);
    };

    const handleSave = async (key: string) => {
        if (editProduct.name?.trim()) {
            try {
                await clientAPI.service('Products').put(key, editProduct);
                setData((prevData) =>
                    prevData.map((item) =>
                        item.id === key ? { ...item, ...editProduct } : item
                    )
                );
                setEditId(null);
            } catch (error) {
                console.error('Error saving product:', error);
            }
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
            title: 'Hình ảnh',
            dataIndex: 'thumbnailUrl',
            key: 'thumbnailUrl',
            render: (text: string) => (
                text ? <Image width={50} src={text} /> : 'No Image Available'
            ),
        },
        // {
        //     title: 'Giá gốc',
        //     dataIndex: 'price',
        //     key: 'price',
        //     render: (price: number) => price.toLocaleString() + ' VND',
        // },
        // {
        //     title: 'Giá giảm',
        //     dataIndex: 'salePrice',
        //     key: 'salePrice',
        //     render: (salePrice: number) => salePrice.toLocaleString() + ' VND',
        // },
        {
            title: 'Từ khóa',
            dataIndex: 'keyword',
            key: 'keyword',
        },
        {
            title: 'Tiêu biểu',
            dataIndex: 'featured',
            key: 'featured',
            render: (featured: boolean, record: Product) => (
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
            render: (visible: boolean, record: Product) => (
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
                            <Button type="primary" icon={<ToolOutlined />}> Variations</Button>
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
            <Modal isOpen={isModalVisible} onRequestClose={handleModalCancel}>
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
        </div>
    );
};

export default TableProduct;