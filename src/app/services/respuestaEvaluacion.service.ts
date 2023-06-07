import { Injectable } from '@angular/core';
import { SharedService } from '../shared.service';
import { HttpClient } from '@angular/common/http';
import { RespuestaEvaluacion } from '../models/respuestaEvalucion';

@Injectable({
  providedIn: 'root'
})
export class RespuestaEvaluacionService {

  private path = this.sharedService.APIUrl+'/RespuestaEvaluacion';

  constructor(private http:HttpClient,
    private sharedService:SharedService
     )
   { }

  public listarTodos(){
    return this.http.get<RespuestaEvaluacion[]>(this.path+'/Obtener');
  }

 public listarPorId(id: number){
    return this.http.get<RespuestaEvaluacion>(this.path+'/ObtenerId/'+id);
  }

  public registrar(respuestaEvaluacion: RespuestaEvaluacion){
    return this.http.post<void>(this.path+'/Guardar', respuestaEvaluacion);
  }

  public actualizar(respuestaEvaluacion: RespuestaEvaluacion){
    return this.http.put<void>(this.path+'/Modificar/'+ respuestaEvaluacion.id, respuestaEvaluacion);
  }

  public eliminar(id: number){
    return this.http.delete<void>(this.path+'/Eliminar/'+id);
  }
}

