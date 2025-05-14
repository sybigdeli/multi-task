<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();

        $ownedProjects = $user->projects()->with('owner')->get();

        $sharedProjects = Project::whereHas('users', function ($query) use ($user) {
            $query->where('users.id', $user->id)
                ->where('access_level', '!=', 'owner');
        })->get();

        $projects = $ownedProjects->merge($sharedProjects);

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Projects/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . uniqid();

        $project = Project::create($validated);

        $project->users()->attach(Auth::id(), ['access_level' => 'owner']);

        return redirect()->route('projects.index')
            ->with('success', 'Project created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        Gate::authorize('view', $project);

        $user = Auth::id();
        $userAccessLevel = $project->users()->where('user_id', $user)->first()->pivot->access_level;

        return Inertia::render('Projects/Show', [
            'project' => $project->load('owner'),
            'tasks' => $project->tasks()->get(),
            'userAccessLevel' => $userAccessLevel,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        Gate::authorize('update', $project);
        
        return Inertia::render('Projects/Edit', [
            'project' => $project,
            'owner' => $project->getOwner(),
            'users' => $project->nonOwnerUsers()->select('users.id', 'users.name', 'users.email')->get()->map(fn($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'access_level' => $project->users()->where('users.id', $user->id)->first()->pivot->access_level,
            ]),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        Gate::authorize('update', $project);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . uniqid();

        $project->update($validated);

        return redirect()->route('projects.index')
            ->with('success', 'Project updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        Gate::authorize('delete', $project);

        $project->delete();

        return redirect()->route('projects.index')
            ->with('success', 'Project deleted successfully.');
    }
    public function attachUser(Request $request, Project $project)
    {
        Gate::authorize('update', $project);

        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
            'access_level' => 'required|in:read,write,admin',
        ]);

        $user = \App\Models\User::where('email', $validated['email'])->first();

        if (!$user) {
            return redirect()->route('projects.edit', $project)
                ->with('error', 'User not found.');
        }

        $project->users()->attach($user->id, ['access_level' => $validated['access_level']]);

        return redirect()->route('projects.edit', $project)
            ->with('success', 'User attached successfully.');
    }

    public function detachUser(Request $request, Project $project)
    {
        Gate::authorize('update', $project);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $project->users()->detach($validated['user_id']);

        return redirect()->route('projects.edit', $project)
            ->with('success', 'User detached successfully.');
    }

    public function changeAccessLevel(Request $request, Project $project)
    {
        Gate::authorize('update', $project);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'access_level' => 'required|in:read,write,admin',
        ]);

        $project->users()->updateExistingPivot($validated['user_id'], ['access_level' => $validated['access_level']]);

        return redirect()->route('projects.edit', $project)
            ->with('success', 'Access level changed successfully.');
    }
}
