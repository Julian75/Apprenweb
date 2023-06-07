import { Injectable } from '@angular/core';
import { SharedService } from '../shared.service';
import { HttpClient } from '@angular/common/http';
import { PreguntaEvaluacion } from '../models/preguntaEvaluacion';

@Injectable({
  providedIn: 'root'
})
export class PreguntaEvaluacionService {

  private path = this.sharedService.APIUrl+'/PreguntaEvaluacion';

  constructor(private http:HttpClient,
    private sharedService:SharedService
     )
   { }

  public listarTodos(){
    return this.http.get<PreguntaEvaluacion[]>(this.path+'/Obtener');
  }

 public listarPorId(id: number){
    return this.http.get<PreguntaEvaluacion>(this.path+'/ObtenerId/'+id);
  }

  public registrar(preguntaEvaluacion: PreguntaEvaluacion){
    return this.http.post<void>(this.path+'/Guardar',preguntaEvaluacion);
  }

  public actualizar(preguntaEvaluacion: PreguntaEvaluacion){
    return this.http.put<void>(this.path+'/Modificar/'+ preguntaEvaluacion.id,preguntaEvaluacion);
  }

  public eliminar(id: number){
    return this.http.delete<void>(this.path+'/Eliminar/'+id);
  }
}

