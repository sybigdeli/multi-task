import React, { FormEvent } from "react";
import AppLayout from "@/layouts/app-layout";
import { Link, router, useForm } from "@inertiajs/react";
import "react-datepicker/dist/react-datepicker.css";

export default function ShowTask({ project, task }: React.PropsWithChildren<{
    project: { title: string; description: string; slug: string },
    task: { id: number; title: string; description: string; slug: string, due_date: string },
}>) {
    console.log("task", task);

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
    ];

    const handleDelete = () => {
        router.delete(`/projects/${project.slug}/tasks/${task.slug}`, {
            onSuccess: () => {
                alert('Project deleted successfully!');
            },
        });
    };

    const handleComplete = () => {
        router.post(
            `/projects/${project.slug}/tasks/${task.slug}/complete`,
            {},
            {
                onSuccess: () => {
                    alert('Task completed successfully!');
                },
            }
        );
    }



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <section className="p-6 border mt-4 border-slate-400 max-w-4xl w-full mx-auto shadow rounded-md">
                <div className="w-full flex justify-between items-center gap-2 pb-4">
                    <h1 className="text-2xl font-bold">{task.title}</h1>
                    <p className="text-sm text-gray-500">Due: {new Date(task.due_date).toLocaleString()}</p>
                </div>
                <div className="w-full h-[1px] bg-slate-400 rounded-full" />
                <p className="text-gray-700 mt-4">{task.description}</p>
                <div className="mt-6 flex justify-end gap-2">
                    <button onClick={handleDelete} className="text-neutral-800 bg-white rounded-md py-2 px-4 hover:underline cursor-pointer">
                        delete task
                    </button>
                    <Link href={`/projects/${project.slug}/tasks/${task.slug}/edit`} className="text-neutral-800 bg-white rounded-md py-2 px-4 hover:underline">
                        edit task
                    </Link>
                    <button onClick={handleComplete} className="text-neutral-800 bg-white rounded-md py-2 px-4 hover:underline cursor-pointer">
                        complete task
                    </button>
                </div>
            </section>

        </AppLayout>
    );
}
