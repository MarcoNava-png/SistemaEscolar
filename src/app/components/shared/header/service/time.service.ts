import { Injectable } from '@angular/core';
import * as moment from 'moment-timezone';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import 'moment/locale/es';  // Importa el idioma español

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  constructor() {
    moment.locale('es');  // Establece el idioma por defecto en español
  }

  getMexicoCurrentDate(): Observable<string> {
    return interval(1000).pipe(
      map(() => moment.tz('America/Mexico_City').format('dddd, D [de] MMMM [de] YYYY'))
    );
  }

  getMexicoCurrentTime(): Observable<string> {
    return interval(1000).pipe(
      map(() => moment.tz('America/Mexico_City').format('h:mm:ss a'))
    );
  }
}
