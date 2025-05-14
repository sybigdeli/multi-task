import React from 'react';
import { router, useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


const EditTask: React.FC<{ project: { title: string, slug: string, description: string }, task: { title: string, slug: string, description: string, due_date: string } }> = ({ project, task }) => {
    const {
        data: taskData,
        setData: setTaskData,
        patch,
        processing: taskProcessing,
        errors: taskErrors,
        reset,
    } = useForm({
        title: task.title,
        description: task.description,
        due_date: task.due_date ? new Date(task.due_date) : new Date(),
    });

    const handleEditTask = (e: React.FormEvent) => {
        e.preventDefault();

        router.patch(`/projects/${project.slug}/tasks/${task.slug}`, {
            title: taskData.title,
            description: taskData.description,
            due_date: taskData.due_date instanceof Date
                ? taskData.due_date.toISOString()
                : null,
        }, {
            onSuccess: () => {
                alert('Task Updated successfully!');
                reset();
            },
        });
    };
    const breadcrumbs = [
        {
            title: 'Projects',
            href: '/projects',
        },
        {
            title: project.title,
            href: `/projects/${project.slug}`,
        },
        {
            title: task.title,
            href: `/projects/${project.slug}/tasks/${task.slug}`,
        },
        {
            title: `Edit ${task.title}`,
            href: `/projects/${project.slug}/tasks/${task.slug}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className=" container mx-auto p-4 flex flex-col justify-center items-center">
                <h1 className="w-full text-2xl font-bold mb-4">Edit {project.title}</h1>

                <form onSubmit={handleEditTask} className="max-w-xl w-full space-y-4">
                    <div>
                        <Label htmlFor="title">Task Title</Label>
                        <Input
                            id="title"
                            value={taskData.title}
                            onChange={(e) => setTaskData("title", e.target.value)}
                        />
                        {taskErrors.title && (
                            <div className="text-sm text-red-500">{taskErrors.title}</div>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            value={taskData.description}
                            onChange={(e) => setTaskData("description", e.target.value)}
                            className="w-full p-2 border rounded-md"
                        />
                        {taskErrors.description && (
                            <div className="text-sm text-red-500">{taskErrors.description}</div>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="due_date">Due Date & Time</Label>
                        <DatePicker
                            selected={taskData.due_date}
                            onChange={(date: Date | null) => {
                                if (date) {
                                    setTaskData("due_date", date);
                                }
                            }}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="yyyy-MM-dd HH:mm"
                            className="w-full p-2 border rounded-md"
                        />
                        {taskErrors.due_date && (
                            <div className="text-sm text-red-500">{taskErrors.due_date}</div>
                        )}
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={taskProcessing}
                            className={`w-full max-w-40 px-4 py-2 text-white bg-blue-600 rounded-md ${taskProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {taskProcessing ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>

            </div>
        </AppLayout>
    );
};

export default EditTask;
