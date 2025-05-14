import React from 'react';
import { router, useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

const EditProject: React.FC<{ project: { title: string, slug: string, description: string }, owner: { id: number | string, name: string, email: string }, users: [] }> = ({ project, owner, users }) => {
    const { data, setData, put, processing, errors } = useForm({
        title: project.title,
        description: project.description,
    });
    const [email, setEmail] = React.useState('');
    const [accessLevel, setAccessLevel] = React.useState<"read" | "write" | "admin" | "">('');

    console.log(users);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/projects/${project.slug}`, {
            onSuccess: () => {
                alert('Project updated successfully!');
            },
        });
    };

    const breadcrumbs = [
        {
            title: 'Projects',
            href: '/projects',
        },
        {
            title: 'Edit Project',
            href: `/projects/${project.slug}/edit`,
        },
    ];

    const handleSubmitAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/projects/${project.slug}/attach-user`, {
            email,
            access_level: accessLevel,
        }, {
            onSuccess: () => {
                alert('User added successfully!');
                setEmail('');
                setAccessLevel('');
            },
            onError: (errors) => {
                alert('Failed to add user: ' + errors);
            },
        });
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="container mx-auto p-4 flex flex-col justify-center items-center">
                <h1 className="w-full text-2xl font-bold mb-4">Edit {project.title}</h1>

                <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
                    <div>
                        <Label htmlFor="name">Project Name</Label>
                        <Input
                            type="text"
                            id="name"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        {errors.title && <div className="text-red-500 text-sm">{errors.title}</div>}
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full p-2 border rounded-md"
                        />
                        {errors.description && <div className="text-red-500 text-sm">{errors.description}</div>}
                    </div>
                    <div className='flex justify-end'>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
                        >
                            {processing ? 'Updating...' : 'Edit Project'}
                        </button>
                    </div>
                </form>

                {/* User Access Table + Add User Button */}
                <div className='w-full flex justify-between items-center max-w-4xl mt-6'>
                    <h2 className='max-w-4xl text-xl font-bold'>Users Access</h2>
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="text-neutral-800 bg-white rounded-md py-2 px-4 hover:bg-neutral-300 transition cursor-pointer">
                                Add Users to Project
                            </button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add User to Project</DialogTitle>
                                <DialogDescription>
                                    Add a user by entering their email and access level.
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleSubmitAddUser} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Access Level
                                    </label>
                                    <Select onValueChange={(value) => setAccessLevel(value as "read" | "write" | "admin")}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="read" >Viewer</SelectItem>
                                            <SelectItem value="write">Editor</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <DialogFooter>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"

                                    >
                                        Add User
                                    </button>
                                    <DialogClose asChild>
                                        <button
                                            type="button"
                                            className="text-gray-500 px-4 py-2 rounded-md hover:bg-gray-100"
                                        >
                                            Cancel
                                        </button>
                                    </DialogClose>
                                </DialogFooter>
                            </form>

                        </DialogContent>
                    </Dialog>
                </div>

                {/* جدول کاربران */}
                <div className="max-w-4xl w-full relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:border-gray-700 dark:border">
                            <tr>
                                <th scope="col" className="px-6 py-3">Username</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Access Level</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {owner.name}
                                </th>
                                <td className="px-6 py-4">{owner.email}</td>
                                <td className="px-6 py-4">Owner</td>
                                <td className="px-6 py-4 flex items-center gap-2">
                                    <Select disabled>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="read" >Viewer</SelectItem>
                                            <SelectItem value="write">Editor</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <button
                                        disabled
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline disabled:text-blue-900 disabled:opacity-40 disabled:cursor-no-drop"
                                    >
                                        remove
                                    </button>
                                </td>
                            </tr>
                            {users.map((user: { id: number, name: string, email: string, access_level: string }) => (
                                <tr key={user.id} className="border border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {user.name}
                                    </th>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">{user.access_level}</td>
                                    <td className="px-6 py-4 flex items-center gap-2">
                                        <Select onValueChange={(value => {
                                            router.patch(`/projects/${project.slug}/change-access-level`, {
                                                user_id: user.id,
                                                access_level: value,
                                            }, {
                                                onSuccess: () => {
                                                    alert('User updated successfully!');
                                                },
                                                onError: (errors) => {
                                                    alert('Failed to update user: ' + errors);
                                                },
                                            })
                                        })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="read" >Viewer</SelectItem>
                                                <SelectItem value="write">Editor</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <button
                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                                            onClick={() => {
                                                router.delete(`/projects/${project.slug}/detach-user`, {
                                                    data: { user_id: user.id },
                                                    onSuccess: () => {
                                                        alert('User removed successfully!');
                                                    },
                                                    onError: (errors) => {
                                                        alert('Failed to remove user: ' + errors);
                                                    },
                                                });
                                            }}
                                        >
                                            remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
};

export default EditProject;
