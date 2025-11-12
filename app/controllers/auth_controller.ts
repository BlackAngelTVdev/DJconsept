import type { HttpContext } from "@adonisjs/core/http"

export default class AuthController
{
    login( {view} : HttpContext){
        return view.render('pages/home')
    }
}