import React, { useState, useEffect } from 'react';
import clientAPI from '../../../client-api/rest-client';
import { Table, Input, Button } from 'antd';
import { DeleteOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';

interface Brand {
    id: string;
    name: string;
    slug: string;
}

const TableBrand: React.FC = () => {
    const [data, setData] = useState<Brand[]>([]);
    const [editId, setEditId] = useState<string | null>(null);
    const [editBrandName, setEditBrandName] = useState<string>('');
    const [editSlug, setEditSlug] = useState<string>('');
    const [newBrandName, setNewBrandName] = useState<string>('');
    const [newSlug, setNewSlug] = useState<string>('');

    const fetchBrands = async () => {
        try {
            const response: { result: Brand[] } = await clientAPI.service('Brands').find();
            setData(response.result);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, [editId]);

    const handleEdit = (id: string, brandName: string, slug: string) => {
        setEditId(id.toString());
        setEditBrandName(brandName);
        setEditSlug(slug);
    };

    const handleSave = async (id: string) => {
        if (editBrandName.trim() !== '' && editSlug.trim() !== '' && editId) {
            const formData = new FormData();
            formData.append('Name', editBrandName);
            formData.append('Slug', editSlug);
            await clientAPI.service('Brands').put(editId, formData);
            setEditId(null);
        }
        fetchBrands();
    };

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this brand?');
        if (confirmDelete) {
            try {
                await clientAPI.service('Brands').remove(id.toString());
                setData(prevData => prevData.filter(item => item.id !== id));
            } catch (error) {
                console.error('Error deleting brand:', error);
            }
        }
    };

    const handleAddNew = async () => {
        if (newBrandName.trim() !== '' && newSlug.trim() !== '') {
            try {
                const formData = new FormData();
                formData.append('Name', newBrandName);
                formData.append('Slug', newSlug);
                const response: Brand = await clientAPI.service('Brands').create(formData);
                setData(prevData => [...prevData, response]);
                setNewBrandName('');
                setNewSlug('');
            } catch (error) {
                console.error('Error adding new brand:', error);
            }
        }
    };

    const columns = [
        {
            title: 'Brand Name',
            dataIndex: 'name',
            key: 'brandName',
            render: (text: string, record: Brand) =>
                editId === record.id.toString() ? (
                    <Input
                        value={editBrandName}
                        onChange={e => setEditBrandName(e.target.value)}
                    />
                ) : (
                    <span>{text}</span>
                )
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
            render: (text: string, record: Brand) =>
                editId === record.id.toString() ? (
                    <Input
                        value={editSlug}
                        onChange={e => setEditSlug(e.target.value)}
                    />
                ) : (
                    <span>{text}</span>
                )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Brand) => (
                <div>
                    {editId === record.id.toString() ? (
                        <Button
                            className="mr-2"
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={() => handleSave(record.id)}
                        />
                    ) : (
                        <Button
                            className="mr-2"
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record.id, record.name, record.slug)}
                        />
                    )}
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    />
                </div>
            )
        }
    ];

    return (
        <div className="container mx-auto p-4">
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                pagination={{
                    pageSize: 6,
                    total: data.length,
                    showSizeChanger: false
                }}
                footer={() => (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Input
                            style={{ width: '40%' }}
                            value={newBrandName}
                            onChange={e => setNewBrandName(e.target.value)}
                            placeholder="New Brand Name"
                        />
                        <Input
                            style={{ width: '40%' }}
                            value={newSlug}
                            onChange={e => setNewSlug(e.target.value)}
                            placeholder="New Slug"
                        />
                        <Button
                            type="primary"
                            onClick={handleAddNew}
                            icon={<SaveOutlined />}
                        />
                    </div>
                )}
            />
        </div>
    );
};

export default TableBrand;
