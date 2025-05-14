<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Project $project)
    {
        Gate::authorize('create', [Task::class, $project]);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'due_date' => 'required|date|after_or_equal:now',
        ]);

        $validated['is_completed'] = false;
        $validated['project_id'] = $project->id;
        $validated['slug'] = Str::slug($validated['title']) . '-' . uniqid();

        $task = Task::create($validated);

        return redirect()->route('projects.show', $request->project)->with('success', 'Task created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project, Task $task)
    {
        Gate::authorize('view', $task);

        if (now()->greaterThan($task->due_date)) {
            return redirect()->back()->withErrors([
                'due_date' => 'You cannot update a task that is already overdue.',
            ]);
        }

        if ($task->is_completed) {
            return redirect()->back()->withErrors([
                'is_completed' => 'You cannot edit a completed task.',
            ]);
        }

        return inertia('Tasks/Show', [
            'task' => $task->load('project'),
            'project' => $task->project,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project, Task $task)
    {
        Gate::authorize('update', $task);

        if (now()->greaterThan($task->due_date)) {
            return redirect()->back()->withErrors([
                'due_date' => 'You cannot update a task that is already overdue.',
            ]);
        }

        if ($task->is_completed) {
            return redirect()->back()->withErrors([
                'is_completed' => 'You cannot edit a completed task.',
            ]);
        }

        return inertia('Tasks/Edit', [
            'task' => $task->load('project'),
            'project' => $task->project,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project, Task $task)
    {
        Gate::authorize('update', $task);

        if (now()->greaterThan($task->due_date)) {
            return redirect()->back()->withErrors([
                'due_date' => 'You cannot update a task that is already overdue.',
            ]);
        }

        if ($task->is_completed) {
            return redirect()->back()->withErrors([
                'is_completed' => 'You cannot edit a completed task.',
            ]);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'due_date' => 'required|date|after_or_equal:now',
        ]);

        $task->update($validated);

        return redirect()->route('projects.show', $task->project)->with('success', 'Task updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project, Task $task)
    {
        Gate::authorize('delete', $task);

        $task->delete();

        return redirect()->route('projects.show', $task->project)->with('success', 'Task deleted successfully.');
    }
    /**
     * Mark the task as completed.
     */
    public function complete(Request $request, Project $project, Task $task)
    {
        Gate::authorize('update', $task);

        if (now()->greaterThan($task->due_date)) {
            return redirect()->back()->withErrors([
                'due_date' => 'You cannot complete a task that is already overdue.',
            ]);
        }

        if ($task->is_completed) {
            return redirect()->back()->withErrors([
                'is_completed' => 'You cannot edit a completed task.',
            ]);
        }

        $task->update(['is_completed' => true]);

        return redirect()->route('projects.show', $task->project)->with('success', 'Task completed successfully.');
    }
}
