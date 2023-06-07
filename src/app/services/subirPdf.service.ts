import { Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from '../shared.service';

@Injectable({
  providedIn: 'root'
})
export class SubirPdfService {

  private path = this.sharedService.APIUrl+'/Pdf';

  constructor(private http:HttpClient,
    private sharedService:SharedService
     )
   { }

  //----------------------- Contenido Curso Carpeta - Primera --------------------------------
  public listarTodoContenidoCurso(){
    return this.http.get(`${this.path}/listarTodoContenidoCurso`);
  }

  public listarUnContenidoCurso(nombreArchivo: String){
    return this.http.get(this.path+'/listarUnContenidoCurso/'+nombreArchivo);
  }

  public subirContenidoCurso(file: File): Observable<HttpEvent<any>>{
    const formData: FormData = new FormData();
    formData.append('files', file);
    const  req = new HttpRequest('POST', `${this.path}/subirContenidoCurso`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  public eliminarContenidoCurso(filename: string){
    return this.http.get(`${this.path}/eliminarContenidoCurso/${filename}`);
  }

}
