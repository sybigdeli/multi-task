<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    /**
     * Determine if the user can view the task.
     */
    public function view(User $user, Task $task): bool
    {
        return $this->hasAccess($user, $task, ['read', 'write', 'admin', 'owner']);
    }

    /**
     * Determine if the user can create a task in the project.
     */
    public function create(User $user, Project $project): bool
    {
        return $this->hasProjectAccess($user, $project, ['write', 'admin', 'owner']);
    }

    /**
     * Determine if the user can delete the task.
     */
    public function delete(User $user, Task $task): bool
    {
        return $this->hasAccess($user, $task, ['admin', 'owner']);
    }

    public function update(User $user, Task $task): bool
    {
        return $this->hasAccess($user, $task, ['write', 'admin', 'owner']);
    }

    /**
     * Check access to the task based on access level.
     */
    private function hasAccess(User $user, Task $task, array $allowed): bool
    {
        $project = $task->project;

        return $this->hasProjectAccess($user, $project, $allowed);
    }

    /**
     * Check access to the project based on access level.
     */
    private function hasProjectAccess(User $user, Project $project, array $allowed): bool
    {
        return $project->users()
            ->where('user_id', $user->id)
            ->whereIn('project_user.access_level', $allowed)
            ->exists();
    }
}
