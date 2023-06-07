import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Estado } from '../models/estado';
import { SharedService } from '../shared.service';
import { EstadoModificar } from '../models-actualizar/estadoModificar';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {


  private path = this.sharedService.APIUrl+'/Estado';

  constructor(private http:HttpClient,
    private sharedService:SharedService
     )
   { }

  public listarTodos(){
    return this.http.get<Estado[]>(this.path+'/Obtener');
  }

 public listarPorId(id: number){
    return this.http.get<Estado>(this.path+'/ObtenerId/'+id);
  }

  public registrar(modulo: Estado){
    return this.http.post<void>(this.path+'/Guardar',modulo);
  }

  public actualizar(modulo: EstadoModificar){
    return this.http.put<void>(this.path+'/Modificar/'+ modulo.id, modulo);
  }

  public eliminar(id: number){
    return this.http.delete<void>(this.path+'/Eliminar/'+id);
  }
}


