import React, { useState, useEffect } from 'react';
import clientAPI from '../../../client-api/rest-client';
import { Table, Input, Button } from 'antd';
import { DeleteOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';

interface User {
    id: string;
    fullName: string;
    email: string;
    isMale: string;
    birthday: string;
}

const TableUser: React.FC = () => {
    const [data, setData] = useState<User[]>([]);
    const [editId, setEditId] = useState<string | null>(null);
    const [editFullName, setEditFullName] = useState<string>('');
    const [editEmail, setEditEmail] = useState<string>('');
    const [newFullName, setNewFullName] = useState<string>('');
    const [newEmail, setNewEmail] = useState<string>('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response: { result: User[] } = await clientAPI.service('users').find(`pageCurrent=${2}&pageSize=${3}`);
                setData(response.result);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, [editId]);

    const handleEdit = (id: string, fullName: string, email: string) => {
        setEditId(id);
        setEditFullName(fullName);
        setEditEmail(email);
    };

    const handleSave = async (id: string) => {
        if (editFullName.trim() !== '' && editEmail.trim() !== '' && editId) {
            await clientAPI.service('Users').patch(`${editId}/Role`, {});
            setEditId(null);
        }
    };

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (confirmDelete) {
            try {
                await clientAPI.service('Users').remove(id);
                setData(prevData => prevData.filter(item => item.id !== id));
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const handleAddNew = async () => {
        if (newFullName.trim() !== '' && newEmail.trim() !== '') {
            try {
                const formData = new FormData();
                formData.append('FullName', newFullName);
                formData.append('Email', newEmail);
                const response: User = await clientAPI.service('Users').create(formData);
                setData(prevData => [...prevData, response]);
                setNewFullName('');
                setNewEmail('');
            } catch (error) {
                console.error('Error adding new user:', error);
            }
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text: string, record: User) =>
                editId === record.id ? (
                    <Input value={editFullName} onChange={e => setEditFullName(e.target.value)} />
                ) : (
                    <span>{text}</span>
                )
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (text: string, record: User) =>
                editId === record.id ? (
                    <Input value={editEmail} onChange={e => setEditEmail(e.target.value)} />
                ) : (
                    <span>{text}</span>
                )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: User) => (
                <div>
                    {editId === record.id ? (
                        <Button type="primary" icon={<SaveOutlined />} onClick={() => handleSave(record.id)} />
                    ) : (
                        //<Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record.id, record.fullName, record.email)} />
                        <Button type="primary" icon={<SaveOutlined />} onClick={() => handleSave(record.id)} />
                    )}
                    <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
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
                pagination={{ pageSize: 6, total: data.length, showSizeChanger: false }}
            />
        </div>
    );
};

export default TableUser;
