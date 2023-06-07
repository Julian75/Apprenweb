import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../shared.service';
import { Acceso } from '../models/acceso';
import { AccesoModificar } from '../models-actualizar/accesoModificar';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {


  private path = this.sharedService.APIUrl+'/Accesos';

  constructor(private http:HttpClient,
    private sharedService:SharedService
     )
   { }

  public listarTodos(){
    return this.http.get<Acceso[]>(this.path+'/Obtener');
  }

 public listarPorId(id: number){
    return this.http.get<Acceso>(this.path+'/ObtenerId/'+id);
  }

  public registrar(acceso: Acceso){
    return this.http.post<void>(this.path+'/Guardar',acceso);
  }

  public actualizar(acceso: AccesoModificar){
    return this.http.put<void>(this.path+'/Modificar/'+ acceso.id, acceso);
  }

  public eliminar(id: number){
    return this.http.delete<void>(this.path+'/Eliminar/'+id);
  }
}
