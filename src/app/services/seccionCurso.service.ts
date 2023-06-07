import { Injectable } from '@angular/core';
import { SharedService } from '../shared.service';
import { HttpClient } from '@angular/common/http';
import { SeccionCurso } from '../models/seccionCurso';

@Injectable({
  providedIn: 'root'
})
export class SeccionCursoService {

  private path = this.sharedService.APIUrl+'/SeccionCurso';

  constructor(private http:HttpClient,
    private sharedService:SharedService
     )
   { }

  public listarTodos(){
    return this.http.get<SeccionCurso[]>(this.path+'/Obtener');
  }

 public listarPorId(id: number){
    return this.http.get<SeccionCurso>(this.path+'/ObtenerId/'+id);
  }

  public registrar(seccionCurso: SeccionCurso){
    return this.http.post<void>(this.path+'/Guardar',seccionCurso);
  }

  public actualizar(seccionCurso: SeccionCurso){
    return this.http.put<void>(this.path+'/Modificar/'+ seccionCurso.id,seccionCurso);
  }

  public eliminar(id: number){
    return this.http.delete<void>(this.path+'/Eliminar/'+id);
  }
}

