<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'title',
        'description',
        'is_completed',
        'due_date',
        'project_id',
        'slug',
    ];
    protected $casts = [
        'is_completed' => 'boolean',
        'due_date' => 'datetime',
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
        'project'
    ];
    public function project()
    {
        return $this->belongsTo(Project::class);
    }
    public function isEditable()
    {
        return !$this->is_completed && now()->lessThanOrEqualTo($this->due_date);
    }
    public function getRouteKeyName()
    {
        return 'slug';
    }
}
