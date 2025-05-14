<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'title',
        'description',
        'slug',
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
        'pivot',
    ];
    public function owner()
    {
        return $this->belongsToMany(User::class)
            ->withPivot('access_level')
            ->wherePivot('access_level', 'owner')
            ->limit(1);
    }
    public function getOwner()
    {
        return $this->owner()->select('users.id', 'users.name', 'users.email')->first()?->makeHidden('pivot');
    }
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
    public function users()
    {
        return $this->belongsToMany(User::class)->withPivot('access_level');
    }
    public function nonOwnerUsers()
    {
        return $this->users()->wherePivotIn('access_level', ['read', 'write', 'admin']);
    }
    public function getRouteKeyName()
    {
        return 'slug';
    }
}
