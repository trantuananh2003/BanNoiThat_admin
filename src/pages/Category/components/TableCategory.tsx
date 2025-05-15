import React, { useState, useEffect } from 'react';
import clientAPI from '../../../client-api/rest-client';
import { title } from 'process';
import { render } from '@testing-library/react';
import { Table, Input, Button, Checkbox, Image } from 'antd';
import { DeleteOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';

interface Category {
    id: string;
    name: string;
    categoriesUrlImage: string | null;
    parent_Id: string | null;
    children: Category[];
}

const TableCategory: React.FC = () => {
    const [data, setData] = useState<Category[]>([]);
    const [editId, setEditId] = useState<string | null>(null);
    const [editCategoryName, setEditCategoryName] = useState<string>('');
    const [editCategoryImage, setEditCategoryImage] = useState<string>('');
    const [editParentId, setEditParentId] = useState<string | null>(null);
    const [newCategoryName, setNewCategoryName] = useState<string>('');
    const [newCategoryImage, setNewCategoryImage] = useState<string>('');
    const [newParentId, setNewParentId] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await clientAPI.service('Categories/admin').find() as { isSuccess: boolean, result: Category[], errorMessages?: string[] };
                console.log(response);
                if (response.isSuccess) {
                    setData(response.result);
                } else {
                    console.error('Error fetching categories:', response.errorMessages);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleEdit = (id: string, name: string, categoriesUrlImage: string | null, parent_Id: string | null) => {
        setEditId(id);
        setEditCategoryName(name);
        setEditCategoryImage(categoriesUrlImage ?? '');
        setEditParentId(parent_Id);
    };

    const handleSave = async (id: string) => {
        if (editCategoryName.trim() !== '' && editCategoryImage.trim() !== '') {
            try {
                const updatedCategory = { name: editCategoryName, categoriesUrlImage: editCategoryImage, parent_Id: editParentId };
                await clientAPI.service('Categories').patch(id, updatedCategory);
                setData((prevData) =>
                    prevData.map((item) =>
                        item.id === id ? { ...item, ...updatedCategory } : item
                    )
                );
                setEditId(null);
            } catch (error) {
                console.error('Error saving category:', error);
            }
        }
    };

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this category?');
        if (confirmDelete) {
            try {
                await clientAPI.service('Categories').remove(id);
                setData((prevData) => prevData.filter((item) => item.id !== id));
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        }
    };

    const handleAddNew = async () => {
        if (newCategoryName.trim() !== '' && newCategoryImage.trim() !== '') {
            try {
                const formData = new FormData();
                formData.append("name", newCategoryName);
                formData.append("categoriesUrlImage", newCategoryImage);
                formData.append("parent_Id", newParentId ?? '');
                const response = await clientAPI.service('Categories').create(formData) as Category;
                setData((prevData) => [...prevData, response]);
                setNewCategoryName('');
                setNewCategoryImage('');
                setNewParentId(null);
            } catch (error) {
                console.error('Error adding new category:', error);
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
            title: 'Category Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: any, record: any) => (
                editId === record.id ? (
                    <Input
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                    />
                ) : (
                    <span>{text}</span>
                )
            ),   
        },
        {
            title: 'Category Image',
            dataIndex: 'categoriesUrlImage',
            key: 'categoriesUrlImage',
        },
        {
            title: 'Parent ID',
            dataIndex: 'parent_Id',
            key: 'parent_Id',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
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
                            onClick={() => handleEdit(record.id, record.name, record.categoriesUrlImage, record.parent_Id)}
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
        <div className="container mx-auto">
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                pagination={{
                    pageSize: 6,
                    total: data.length,
                    showSizeChanger: false,
                }}
                expandable={{
                    expandedRowRender: (record) => (
                    <Table
                        columns={columns}
                        dataSource={record.children}
                        rowKey="id"
                        pagination={false}
                        footer={() => (
                        <tr className="border-b">
                            <td className="py-3 px-4 border">+</td>
                            <td className="py-3 px-4 border">
                            <Input
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="New Category Name"
                            />
                            </td>
                            <td className="py-3 px-4 border">
                            <Input
                                value={newCategoryImage}
                                onChange={(e) => setNewCategoryImage(e.target.value)}
                                placeholder="New Category Image"
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
                    ),
                }}
                footer={() => (
                    <tr className="border-b">
                    <td className="py-3 px-4 border">+</td>
                    <td className="py-3 px-4 border">
                        <Input
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="New Category Name"
                        />
                    </td>
                    <td className="py-3 px-4 border">
                        <Input
                        value={newCategoryImage}
                        onChange={(e) => setNewCategoryImage(e.target.value)}
                        placeholder="New Category Image"
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

export default TableCategory;