import { Injectable } from '@angular/core';
import { SharedService } from '../shared.service';
import { HttpClient } from '@angular/common/http';
import { TipoDocumento } from '../models/tipoDocumento';
import { TipoDocumentoModificar } from '../models-actualizar/tipoDocumentoModificar';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {

  private path = this.sharedService.APIUrl+'/TipoDocumento';

  constructor(private http:HttpClient,
    private sharedService:SharedService
     )
   { }

  public listarTodos(){
    return this.http.get<TipoDocumento[]>(this.path+'/Obtener');
  }

 public listarPorId(id: number){
    return this.http.get<TipoDocumento>(this.path+'/ObtenerId/'+id);
  }

  public registrar(tipoDocumento: TipoDocumento){
    return this.http.post<void>(this.path+'/Guardar',tipoDocumento);
  }

  public actualizar(tipoDocumento: TipoDocumentoModificar){
    return this.http.put<void>(this.path+'/Modificar/'+ tipoDocumento.id,tipoDocumento);
  }

  public eliminar(id: number){
    return this.http.delete<void>(this.path+'/Eliminar/'+id);
  }
}

