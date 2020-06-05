import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TokenizeService implements HttpInterceptor {
  intercept(req, next) {
    const interceptApis = ['eventRegister', 'addEvent', 'events'];
    const parts = req.url.split('/');
    if (
      interceptApis.indexOf(parts[parts.length - 1]) > -1 ||
      interceptApis.indexOf(parts[parts.length - 2]) > -1 ||
      interceptApis.indexOf(parts[parts.length - 3]) > -1)
    {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return next.handle(authReq);
    }
    else
    {
      return next.handle(req);
    }
  }

  constructor() { }
}
