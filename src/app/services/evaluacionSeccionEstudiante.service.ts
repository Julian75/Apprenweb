import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../shared.service';
import { EvaluacionSeccionEstudiante } from '../models/evaluacionSeccionEstudiante';

@Injectable({
  providedIn: 'root'
})
export class EvaluacionSeccionEstudianteService {

  private path = this.sharedService.APIUrl+'/EvaluacionSeccionEstudiante';

  constructor(private http:HttpClient,
    private sharedService:SharedService
     )
   { }

  public listarTodos(){
    return this.http.get<EvaluacionSeccionEstudiante[]>(this.path+'/Obtener');
  }

 public listarPorId(id: number){
    return this.http.get<EvaluacionSeccionEstudiante>(this.path+'/ObtenerId/'+id);
  }

  public registrar(evaluacionSeccionEstudiante: EvaluacionSeccionEstudiante){
    return this.http.post<void>(this.path+'/Guardar',evaluacionSeccionEstudiante);
  }

  public actualizar(evaluacionSeccionEstudiante: EvaluacionSeccionEstudiante){
    return this.http.put<void>(this.path+'/Modificar/'+ evaluacionSeccionEstudiante.id, evaluacionSeccionEstudiante);
  }

  public eliminar(id: number){
    return this.http.delete<void>(this.path+'/Eliminar/'+id);
  }
}


