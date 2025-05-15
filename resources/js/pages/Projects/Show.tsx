import React, { useState, FormEvent } from "react";
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
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

export default function ShowProject({ project, tasks, userAccessLevel, errors}: React.PropsWithChildren<{
    project: { title: string; description: string; slug: string },
    tasks: Array<{ id: number; title: string; description: string; due_date: string, slug: string, is_completed: boolean }>,
    userAccessLevel: string;
    errors: {title : string , description : string , due_date : string};
}>) {
    const breadcrumbs = [
        { title: 'Projects', href: '/projects' },
        { title: project.title, href: `/projects/${project.slug}` },
    ];

    const [filters, setFilters] = useState({
        is_completed: "all",
        due: "all",
    });

    const {
        data: taskData,
        setData: setTaskData,
        post,
        processing: taskProcessing,
        // errors,
        reset,
    } = useForm({
        title: '',
        description: '',
        due_date: new Date(),
    });
    console.log("errors" , errors);
    

    const handleDelete = () => {
        router.delete(`/projects/${project.slug}`, {
            onSuccess: () => alert('Project deleted successfully!'),
        });
    };

    const filteredTasks = tasks.filter((task) => {
        let match = true;

        if (filters.is_completed !== "all") {
            match = match && task.is_completed === (filters.is_completed === "true");
        }

        if (filters.due === "overdue") {
            match = match && new Date(task.due_date) < new Date();
        } else if (filters.due === "upcoming") {
            match = match && new Date(task.due_date) >= new Date();
        }

        return match;
    });

    const handleCreateTask = (e: FormEvent) => {
        e.preventDefault();
        router.post(`/projects/${project.slug}/tasks`, {
            title: taskData.title,
            description: taskData.description,
            due_date: taskData.due_date instanceof Date ? taskData.due_date.toISOString() : null,
        }, {
            onSuccess: () => {
                alert('Task created successfully!');
                reset();
            },
        });
    };

    const handleClickTasks = (dueDate: string, isCompleted: boolean, slug: string) => {
        const isOverdue = new Date(dueDate) < new Date();
        if (isOverdue) return alert("cannot open overdue task");
        if (isCompleted) return alert("cannot open completed task");
        router.visit(`/projects/${project.slug}/tasks/${slug}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <section className="p-6 border mt-4 border-slate-400 max-w-4xl w-full mx-auto shadow rounded-md">
                <div className="w-full flex justify-between items-center gap-2 pb-4">
                    <h1 className="text-2xl font-bold">{project.title}</h1>
                    <span className={`text-sm font-semibold px-2 py-1 rounded-md ${userAccessLevel === 'admin' || userAccessLevel === 'owner' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
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
                    <div className="flex gap-2 items-center">
                        <Dialog>
                            <DialogTrigger asChild>
                                <button className="text-neutral-800 bg-white rounded-md py-2 px-4 hover:underline cursor-pointer transition hover:bg-neutral-300">
                                    filter tasks
                                </button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Filter Tasks</DialogTitle>
                                    <DialogDescription>Filter tasks by their status and deadline.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label>Completion Status</Label>
                                        <Select value={filters.is_completed} onValueChange={(value) => setFilters({ ...filters, is_completed: value })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select completion status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                <SelectItem value="true">Completed</SelectItem>
                                                <SelectItem value="false">Not Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Deadline</Label>
                                        <Select value={filters.due} onValueChange={(value) => setFilters({ ...filters, due: value })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select deadline status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                <SelectItem value="overdue">Overdue</SelectItem>
                                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <button type="button" className="text-gray-500 px-4 py-2 rounded-md hover:bg-gray-100">
                                            Close
                                        </button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog>
                            <DialogTrigger asChild>
                                <button className="text-neutral-800 bg-white rounded-md py-2 px-4 hover:underline cursor-pointer transition hover:bg-neutral-300">
                                    create task
                                </button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create Task</DialogTitle>
                                    <DialogDescription>Fill out the fields below to create a new task.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreateTask} className="space-y-4">
                                    <div>
                                        <Label htmlFor="title">Task Title</Label>
                                        <Input id="title" value={taskData.title} onChange={(e) => setTaskData("title", e.target.value)} />
                                        {errors.title && <div className="text-sm text-red-500">{errors.title}</div>}
                                    </div>
                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <textarea id="description" value={taskData.description} onChange={(e) => setTaskData("description", e.target.value)} className="w-full p-2 border rounded-md" />
                                        {errors.description && <div className="text-sm text-red-500">{errors.description}</div>}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="due_date">Due Date & Time</Label>
                                        <DatePicker
                                            selected={taskData.due_date}
                                            onChange={(date) => date && setTaskData("due_date", date)}
                                            showTimeSelect
                                            timeFormat="HH:mm"
                                            timeIntervals={15}
                                            dateFormat="yyyy-MM-dd HH:mm"
                                            className="w-full p-2 border rounded-md"
                                        />
                                        {errors.due_date && <div className="text-sm text-red-500">{errors.due_date}</div>}
                                    </div>
                                    <DialogFooter>
                                        <button type="submit" disabled={taskProcessing} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                            {taskProcessing ? "Creating..." : "Create Task"}
                                        </button>
                                        <DialogClose asChild>
                                            <button type="button" className="text-gray-500 px-4 py-2 rounded-md hover:bg-gray-100">
                                                Cancel
                                            </button>
                                        </DialogClose>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="w-full h-[1px] bg-slate-400 rounded-full" />

                {filteredTasks.length > 0 ? (
                    <ul className="mt-4 w-full flex flex-col gap-4">
                        {filteredTasks.map((task) => {
                            const isOverdue = new Date(task.due_date) < new Date();
                            return (
                                <li
                                    key={task.id}
                                    onClick={() => handleClickTasks(task.due_date, task.is_completed, task.slug)}
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
                                        {(isOverdue || task.is_completed) && (
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