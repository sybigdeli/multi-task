<?php

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('projects.index');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('projects', ProjectController::class);

    Route::post('/projects/{project}/attach-user', [ProjectController::class, 'attachUser'])
        ->name('projects.attachUser');

    Route::delete('/projects/{project}/detach-user', [ProjectController::class, 'detachUser'])
        ->name('projects.detachUser');

    Route::patch('/projects/{project}/change-access-level', [ProjectController::class, 'changeAccessLevel'])
        ->name('projects.changeAccessLevel');

    Route::get('/projects/{project:slug}/tasks/{task:slug}', [TaskController::class, 'show'])
        ->name('projects.showTask');

    Route::post('/projects/{project:slug}/tasks', [TaskController::class, 'store'])
        ->name('projects.storeTask');

    Route::get('/projects/{project:slug}/tasks/{task:slug}/edit', [TaskController::class, 'edit'])
        ->name('projects.editTask');

    Route::patch('/projects/{project:slug}/tasks/{task:slug}', [TaskController::class, 'update'])
        ->name('projects.updateTask');

    Route::delete('/projects/{project:slug}/tasks/{task:slug}', [TaskController::class, 'destroy'])
        ->name('projects.destroyTask');

    Route::post('/projects/{project:slug}/tasks/{task:slug}/complete', [TaskController::class, 'complete'])
        ->name('projects.completeTask');

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});



require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
