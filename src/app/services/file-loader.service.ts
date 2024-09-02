import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators'; // Import map here

@Injectable({
  providedIn: 'root'
})
export class FileLoaderService {

  constructor(private http: HttpClient) {}

  loadFiles(): Observable<[string[], string[], string[], string[]]> {
    const actionsUrl = 'assets/actions.txt';
    const caracteresUrl = 'assets/caracteres.txt';
    const lieuxUrl = 'assets/lieux.txt';
    const professionsUrl = 'assets/professions.txt';

    const actions$ = this.http.get(actionsUrl, { responseType: 'text' });
    const caracteres$ = this.http.get(caracteresUrl, { responseType: 'text' });
    const lieux$ = this.http.get(lieuxUrl, { responseType: 'text' });
    const professions$ = this.http.get(professionsUrl, { responseType: 'text' });

    return forkJoin([actions$, caracteres$, lieux$, professions$]).pipe(
      map(([actionsContent, caracteresContent, lieuxContent, professionsContent]) => {
        const actionsArray = actionsContent.split('\n');
        const caracteresArray = caracteresContent.split('\n');
        const lieuxArray = lieuxContent.split('\n');
        const professionsArray = professionsContent.split('\n');
        return [actionsArray, caracteresArray, lieuxArray, professionsArray];
      })
    );
  }
}
