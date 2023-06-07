import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../shared.service';
import { CursoEstudiante } from '../models/cursoEstudiante';

@Injectable({
  providedIn: 'root'
})
export class CursoEstudianteService {


  private path = this.sharedService.APIUrl+'/CursoEstudiante';

  constructor(private http:HttpClient,
    private sharedService:SharedService
     )
   { }

  public listarTodos(){
    return this.http.get<CursoEstudiante[]>(this.path+'/Obtener');
  }

 public listarPorId(id: number){
    return this.http.get<CursoEstudiante>(this.path+'/ObtenerId/'+id);
  }

  public registrar(cursoEstudiante: CursoEstudiante){
    return this.http.post<void>(this.path+'/Guardar',cursoEstudiante);
  }

  public actualizar(cursoEstudiante: CursoEstudiante){
    return this.http.put<void>(this.path+'/Modificar/'+ cursoEstudiante.id, cursoEstudiante);
  }

  public eliminar(id: number){
    return this.http.delete<void>(this.path+'/Eliminar/'+id);
  }
}
