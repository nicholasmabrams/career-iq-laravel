<?php

namespace CareerIQ\Helpers\RouteHandlers;

use Illuminate\Support\Facades\Route;

function handleRoute(string $routeName, bool $protected = false)
{
    if ($protected == false || auth('sanctum')->check())
    {
        return redirect("/$routeName", 201);
    }

    return redirect('/login', 401);
}
