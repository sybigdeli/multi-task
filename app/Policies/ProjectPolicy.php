<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    /**
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     */
    public function view(User $user, Project $project): bool
    {
        return $this->isOwner($user, $project) || $this->hasAccess($user, $project, ['read', 'write', 'admin']);
    }

    /**
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     */
    public function update(User $user, Project $project): bool
    {
        return $this->isOwner($user, $project);
    }

    /**
     */
    public function delete(User $user, Project $project): bool
    {
        return $this->isOwner($user, $project);
    }

    /**
     */
    public function restore(User $user, Project $project): bool
    {
        return false;
    }

    /**

     */
    public function forceDelete(User $user, Project $project): bool
    {
        return false;
    }

    /**

     */
    private function isOwner(User $user, Project $project): bool
    {
        return $project->users()
            ->wherePivot('access_level', 'owner')
            ->where('user_id', $user->id)
            ->exists();
    }

    /**
     */
    private function hasAccess(User $user, Project $project, array $allowedLevels): bool
    {
        return $project->users()
            ->where('user_id', $user->id)
            ->whereIn('project_user.access_level', $allowedLevels)
            ->exists();
    }
}
