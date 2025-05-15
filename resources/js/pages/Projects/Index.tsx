import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { Link } from "@inertiajs/react";
import React from "react";
export default function Projects({ projects }: React.PropsWithChildren<{ projects: [] }>) {
    console.log(projects);
    const breadcrumbs = [
        {
            title: "Projects",
            href: "/projects",
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs} >
            <section>
                <div className="absolute bottom-10 right-10 p-4">
                    <Link href="/projects/create" className="text-blue-600 underline"><Button>create new project</Button></Link>
                </div>
                <div className={`grid ${projects.length !== 0 ? "grid-cols-3" : "grid-cols-1"} gap-4 w-full justify-center p-5`}>
                    {projects.length !== 0 ?
                        projects.map((project: any, index: number) => (
                            <div key={index} className="backdrop-blur-md flex flex-col gap-2 p-4 border border-white rounded-lg shadow-md">
                                <h2 className="text-xl font-bold">{project.title}</h2>
                                <div className="w-full rounded-full h-[1px] bg-slate-400 mb-4" />
                                <p className="text-gray-700 border border-neutral-500 rounded-sm p-4 min-h-32">{project.description}</p>
                                <Link href={`projects/${project.slug}`} className="text-white hover:underline self-end py-2 px-4 bg-blue-600 rounded-md mt-4">
                                    View Project
                                </Link>
                            </div>
                        )) : <div className="w-full flex justify-center p-5 flex-col gap-4 items-center">There is no project!!!<Link href="projects/create" className="text-neutral-800 bg-white rounded-md hover:bg-neutral-200 transition px-4 py-2 underline">Create the first project</Link></div>
                    }
                </div>
            </section>
        </AppLayout>
    );
}