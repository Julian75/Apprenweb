import { Injectable } from '@angular/core';
import { SharedService } from '../shared.service';
import { Rol } from '../models/rol';
import { HttpClient } from '@angular/common/http';
import { RolModificar } from '../models-actualizar/rolModificar';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private path = this.sharedService.APIUrl+'/Rol';

  constructor(private http:HttpClient,
    private sharedService:SharedService
     )
   { }

  public listarTodos(){
    return this.http.get<Rol[]>(this.path+'/Obtener');
  }

 public listarPorId(id: number){
    return this.http.get<Rol>(this.path+'/ObtenerId/'+id);
  }

  public registrar(rol: Rol){
    return this.http.post<void>(this.path+'/Guardar',rol);
  }

  public actualizar(rol: RolModificar){
    return this.http.put<void>(this.path+'/Modificar/'+ rol.id,rol);
  }

  public eliminar(id: number){
    return this.http.delete<void>(this.path+'/Eliminar/'+id);
  }
}

