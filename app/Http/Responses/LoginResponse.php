<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function toResponse($request)
    {
        $role = auth()->user()->role;

        if ($role === 'admin_gudang') {
            return redirect()->intended('/gudang/dashboard');
        }

        if ($role === 'pemilik') {
            return redirect()->intended('/pemilik/dashboard');
        }

        return redirect()->intended(config('fortify.home'));
    }
}
