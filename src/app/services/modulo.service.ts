import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Modulo } from '../models/modulo';
import { SharedService } from '../shared.service';
import { ModuloModificar } from '../models-actualizar/moduloModificar';

@Injectable({
  providedIn: 'root'
})

export class ModuloService {

  private path = this.sharedService.APIUrl+'/Modulo';

  constructor(private http:HttpClient,
    private sharedService:SharedService
     )
   { }

  public listarTodos(){
    return this.http.get<Modulo[]>(this.path+'/Obtener');
  }

 public listarPorId(id: number){
    return this.http.get<Modulo>(this.path+'/ObtenerId/'+id);
  }

  public registrar(modulo: Modulo){
    return this.http.post<void>(this.path+'/Guardar',modulo);
  }

  public actualizar(modulo: ModuloModificar){
    return this.http.put<void>(this.path+'/Modificar/'+ modulo.id, modulo);
  }

  public eliminar(id: number){
    return this.http.delete<void>(this.path+'/Eliminar/'+id);
  }
}

