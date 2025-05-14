import React, { FormEvent } from "react";
import AppLayout from "@/layouts/app-layout";
import { Link, router, useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
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
import { Trash2 } from "lucide-react";

export default function ShowProject({ project, tasks, userAccessLevel }: React.PropsWithChildren<{
    project: { title: string; description: string; slug: string },
    tasks: Array<{ id: number; title: string; description: string; due_date: string, slug: string, is_completed: boolean }>,
    userAccessLevel: string;
}>) {

    const breadcrumbs = [
        {
            title: 'Projects',
            href: '/projects',
        },
        {
            title: project.title,
            href: `/projects/${project.slug}`,
        },
    ];

    const handleDelete = () => {
        router.delete(`/projects/${project.slug}`, {
            onSuccess: () => {
                alert('Project deleted successfully!');
            },
        });
    };

    const {
        data: taskData,
        setData: setTaskData,
        post,
        processing: taskProcessing,
        errors: taskErrors,
        reset,
    } = useForm({
        title: '',
        description: '',
        due_date: new Date(),
    });

    const handleCreateTask = (e: React.FormEvent) => {
        e.preventDefault();

        router.post(`/projects/${project.slug}/tasks`, {
            title: taskData.title,
            description: taskData.description,
            due_date: taskData.due_date instanceof Date
                ? taskData.due_date.toISOString()
                : null,
        }, {
            onSuccess: () => {
                alert('Task created successfully!');
                reset();
            },
        });
    };

    const handleClickTasks = (isCompleted: boolean, slug: string) => {
        if (isCompleted) {
            alert("cannot open completed task");
            return;
        }
        router.visit(`/projects/${project.slug}/tasks/${slug}`);
    }



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <section className="p-6 border mt-4 border-slate-400 max-w-4xl w-full mx-auto shadow rounded-md">
                <div className="w-full flex justify-between items-center gap-2 pb-4">
                    <h1 className="text-2xl font-bold">{project.title}</h1>

                    <span className={`text-sm font-semibold px-2 py-1 rounded-md ${userAccessLevel === 'admin' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                        {userAccessLevel}
                    </span>
                </div>
                <div className="w-full h-[1px] bg-slate-400 rounded-full" />
                <p className="text-gray-700 mt-4">{project.description}</p>
                <div className="mt-6 flex justify-end gap-2">
                    <Link href={`/projects/${project.slug}/edit`} className="text-neutral-800 bg-white rounded-md py-2 px-4 hover:underline">
                        edit project
                    </Link>
                    <button onClick={handleDelete} className="text-neutral-800 bg-white rounded-md py-2 px-4 hover:underline cursor-pointer">
                        delete project
                    </button>
                </div>
            </section>

            <section className="p-6 border mt-4 border-slate-400 max-w-4xl w-full mx-auto shadow rounded-md">
                <div className="flex justify-between items-center pb-4">
                    <h2 className="text-2xl font-bold">Tasks</h2>
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="text-neutral-800 bg-white rounded-md py-2 px-4 hover:underline cursor-pointer transition hover:bg-neutral-300">
                                create task
                            </button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Task</DialogTitle>
                                <DialogDescription>
                                    Fill out the fields below to create a new task.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateTask} className="space-y-4">
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
                                <DialogFooter>
                                    <button
                                        type="submit"
                                        disabled={taskProcessing}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                    >
                                        {taskProcessing ? "Creating..." : "Create Task"}
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
                <div className="w-full h-[1px] bg-slate-400 rounded-full " />
                {tasks.length > 0 ? (
                    <ul className="mt-4 w-full flex flex-col gap-4">
                        {tasks.map((task) => {
                            const isOverdue = new Date(task.due_date) < new Date();

                            return (
                                <li
                                    onClick={() => handleClickTasks(task.is_completed, task.slug)}
                                    key={task.id}
                                    className="border p-4 rounded-md cursor-pointer hover:bg-neutral-900 transition group"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className={`text-lg font-semibold ${isOverdue || task.is_completed ? 'line-through text-gray-500' : ''}`}>
                                            {task.title}
                                        </h3>
                                        <p className={`text-sm text-gray-500 ${isOverdue || task.is_completed ? 'line-through text-gray-400' : ''}`}>
                                            Due: {new Date(task.due_date).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-start gap-2">
                                        <p className={`text-gray-600 flex-1 ${isOverdue || task.is_completed ? 'line-through text-gray-400' : ''}`}>
                                            {task.description}
                                        </p>
                                        {isOverdue || task.is_completed && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.delete(`/projects/${project.slug}/tasks/${task.slug}`, {
                                                        onSuccess: () => alert("Task deleted successfully!"),
                                                    });
                                                }}
                                                className="text-red-500 hover:text-red-700 cursor-pointer"
                                                title="Delete task"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        )}
                                    </div>
                                </li>
                            );
                        })}

                    </ul>
                ) : (
                    <p className="text-gray-500 text-center mt-4">No tasks available for this project.</p>
                )}

            </section>
        </AppLayout>
    );
}
