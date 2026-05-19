import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RelatorioService {

  http = inject(HttpClient);
  url = environment;

  async exportarExcel(filtros:any): Promise<Blob>{
    const query = new URLSearchParams(filtros).toString;

    const url = `${this.url.apiUrl}/Reports/excel?{query}`

    return await firstValueFrom(this.http.get(url,{responseType: `blob`}))
  }

  async exportarCsv(filtros:any): Promise<Blob>{
    const query = new URLSearchParams(filtros).toString;

    const url = `${this.url.apiUrl}/Reports/csv?{query}`

    return await firstValueFrom(this.http.get(url,{responseType: `blob`}))
  }


}
