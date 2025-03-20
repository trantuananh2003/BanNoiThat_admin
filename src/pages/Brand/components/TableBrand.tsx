import React, { useState, useEffect } from 'react';
import clientAPI from '../../../client-api/rest-client';
import { Table, Input, Button, Checkbox, Image } from 'antd';
import { DeleteOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';

interface Brand {
    id: number;
    brandName: string;
}

const TableBrand: React.FC = () => {
    const [data, setData] = useState<Brand[]>([]);
    const [editId, setEditId] = useState<number | null>(null);
    const [editBrandName, setEditBrandName] = useState<string>('');
    const [newBrandName, setNewBrandName] = useState<string>('');

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response: { result: Brand[] } = await clientAPI.service('Brands').find();
                setData(response.result);
            } catch (error) {
                console.error('Error fetching brands:', error);
            }
        };

        fetchBrands();
    }, []);

    const handleEdit = (id: any, brandName: string) => {
        setEditId(id);
        setEditBrandName(brandName);
    };

    const handleSave = (id: any) => {
        if (editBrandName.trim() !== '') {
            setData((prevData) =>
                prevData.map((item) =>
                    item.id === id ? { ...item, brandName: editBrandName } : item
                )
            );
            setEditId(null);
        }
    };

    const handleDelete = async (id: any) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this brand?');
        if (confirmDelete) {
            try {
                await clientAPI.service('Brands').remove(id.toString());
                setData((prevData) => prevData.filter((item) => item.id !== id));
            } catch (error) {
                console.error('Error deleting brand:', error);
            }
        }
    };

    const handleAddNew = async () => {
        if (newBrandName.trim() !== '') {
            try {
                const formData = new FormData();
                formData.append("BrandName", newBrandName);
                const response: Brand = await clientAPI.service('Brands').create(formData);
                setData((prevData) => [...prevData, response]);
                setNewBrandName('');
            } catch (error) {
                console.error('Error adding new brand:', error);
            }
        }
    };
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Brand Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: any, record: any) => (
            editId === record.id ? (
                <Input
                value={editBrandName}
                onChange={(e) => setEditBrandName(e.target.value)}
                />
            ) : (
                <span>{text}</span>
            )
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text: any, record: any) => (
        <div>
            {editId === record.id ? (
                <Button
                    className="mr-2"
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={() => handleSave(record.id)}
                >
                    
                </Button>
            ) : (
                <Button
                    className="mr-2"
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(record.id, record.brandName)}
                >
                </Button>
            )}
            <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.id)}
            >
            </Button>
        </div>
            ),
        },
    ];
    return (
        <div className="container mx-auto p-4">
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                pagination={
                    {
                        pageSize:6,
                        total: data.length,
                        showSizeChanger: false,
                    }
                }
                footer={() => (
                    <tr className="border-b">
                        <td className="py-3 px-4 border">+</td>
                        <td className="py-3 px-4 border">
                            <Input
                                value={newBrandName}
                                onChange={(e) => setNewBrandName(e.target.value)}
                                placeholder="New Brand Name"
                            />
                        </td>
                        <td className="py-3 px-4 border">
                            <Button
                                type="primary"
                                onClick={handleAddNew}
                                icon={<SaveOutlined />}
                            >
                            </Button>
                        </td>
                    </tr>
                )}
            />
        </div>
    );
};

export default TableBrand;
