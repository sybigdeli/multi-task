import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { useForm } from '@inertiajs/react';
import React from 'react';

const CreateProject: React.FC = () => {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
    });
    

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/projects', {
            onSuccess: () => {
                alert('Project created successfully!');
            },
        });
    };

    const breadcrumbs = [
        {
            title: 'Projects',
            href: '/projects',
        },
        {
            title: 'Create Project',
            href: '/projects/create',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Create Project</h1>
                <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
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
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            {processing ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default CreateProject;
