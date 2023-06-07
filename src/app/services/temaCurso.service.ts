import { Injectable } from '@angular/core';
import { SharedService } from '../shared.service';
import { HttpClient } from '@angular/common/http';
import { TemaCurso } from '../models/temaCurso';

@Injectable({
  providedIn: 'root'
})
export class TemaCursoService {

  private path = this.sharedService.APIUrl+'/TemaCurso';

  constructor(private http:HttpClient,
    private sharedService:SharedService
     )
   { }

  public listarTodos(){
    return this.http.get<TemaCurso[]>(this.path+'/Obtener');
  }

 public listarPorId(id: number){
    return this.http.get<TemaCurso>(this.path+'/ObtenerId/'+id);
  }

  public registrar(temaCurso: TemaCurso){
    return this.http.post<void>(this.path+'/Guardar',temaCurso);
  }

  public actualizar(temaCurso: TemaCurso){
    return this.http.put<void>(this.path+'/Modificar/'+ temaCurso.id,temaCurso);
  }

  public eliminar(id: number){
    return this.http.delete<void>(this.path+'/Eliminar/'+id);
  }
}
