import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../shared.service';
import { Curso } from '../models/curso';

@Injectable({
  providedIn: 'root'
})
export class CursoService {


  private path = this.sharedService.APIUrl+'/Curso';

  constructor(private http:HttpClient,
    private sharedService:SharedService
     )
   { }

  public listarTodos(){
    return this.http.get<Curso[]>(this.path+'/Obtener');
  }

 public listarPorId(id: number){
    return this.http.get<Curso>(this.path+'/ObtenerId/'+id);
  }

  public registrar(curso: Curso){
    return this.http.post<void>(this.path+'/Guardar',curso);
  }

  public actualizar(curso: Curso){
    return this.http.put<void>(this.path+'/Modificar/'+ curso.id, curso);
  }

  public eliminar(id: number){
    return this.http.delete<void>(this.path+'/Eliminar/'+id);
  }
}
