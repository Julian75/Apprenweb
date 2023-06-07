import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../shared.service';
import { ContenidoCurso } from '../models/contenidoCurso';

@Injectable({
  providedIn: 'root'
})
export class ContenidoCursoService {


  private path = this.sharedService.APIUrl+'/ContenidoCurso';

  constructor(private http:HttpClient,
    private sharedService:SharedService
     )
   { }

  public listarTodos(){
    return this.http.get<ContenidoCurso[]>(this.path+'/Obtener');
  }

 public listarPorId(id: number){
    return this.http.get<ContenidoCurso>(this.path+'/ObtenerId/'+id);
  }

  public registrar(contenidoCurso: ContenidoCurso){
    return this.http.post<void>(this.path+'/Guardar',contenidoCurso);
  }

  public actualizar(contenidoCurso: ContenidoCurso){
    return this.http.put<void>(this.path+'/Modificar/'+ contenidoCurso.id, contenidoCurso);
  }

  public eliminar(id: number){
    return this.http.delete<void>(this.path+'/Eliminar/'+id);
  }
}
