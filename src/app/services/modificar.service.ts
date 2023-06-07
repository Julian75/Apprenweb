import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../shared.service';
import { AccesoModificar } from '../models-actualizar/accesoModificar';
import { CategoriaModificar } from '../models-actualizar/categoriaModificar';
import { ContenidoCursoModificar } from '../models-actualizar/contenidoCursoModificar';
import { CursoEstudianteModificar } from '../models-actualizar/cursoEstudianteModificar';
import { CursoModificar } from '../models-actualizar/cursoModificar';
import { EstadoModificar } from '../models-actualizar/estadoModificar';
import { EvaluacionSeccionEstudianteModificar } from '../models-actualizar/evaluacionSeccionEstudianteModificar';
import { ModuloModificar } from '../models-actualizar/moduloModificar';
import { PreguntaEvaluacionModificar } from '../models-actualizar/preguntaEvaluacionModificar';
import { RespuestaEvaluacionModificar } from '../models-actualizar/respuestaEvaluacionModificar';
import { RolModificar } from '../models-actualizar/rolModificar';
import { SeccionCursoModificar } from '../models-actualizar/seccionCursoModificar';
import { TipoDocumentoModificar } from '../models-actualizar/tipoDocumentoModificar';
import { UsuarioModificar } from '../models-actualizar/usuarioModificar';
import { TemaCursoModificar } from '../models-actualizar/temaCursoModificar';

@Injectable({
  providedIn: 'root'
})
export class ModificarService {

  private path = this.sharedService.APIUrl+'/Modificar';

  constructor(private http:HttpClient,
    private sharedService:SharedService
     )
   { }

  public actualizarAcceso(acceso: AccesoModificar){
    return this.http.put<void>(this.path+'/Acceso/'+ acceso.id, acceso);
  }

  public actualizarCategoria(categoria: CategoriaModificar){
    return this.http.put<void>(this.path+'/Categoria/'+ categoria.id, categoria);
  }

  public actualizarContenidoCurso(contenidoCurso: ContenidoCursoModificar){
    return this.http.put<void>(this.path+'/ContenidoCurso/'+ contenidoCurso.id, contenidoCurso);
  }

  public actualizarCursoEstudiante(cursoEstudiante: CursoEstudianteModificar){
    return this.http.put<void>(this.path+'/CursoEstudiante/'+ cursoEstudiante.id, cursoEstudiante);
  }

  public actualizarCurso(curso: CursoModificar){
    return this.http.put<void>(this.path+'/Curso/'+ curso.id, curso);
  }

  public actualizarEstado(estado: EstadoModificar){
    return this.http.put<void>(this.path+'/Estado/'+ estado.id, estado);
  }

  public actualizarEvaluacionSeccionEstudiante(evaluacionSeccionEstudiante: EvaluacionSeccionEstudianteModificar){
    return this.http.put<void>(this.path+'/EvaluacionSeccionEstudiante/'+ evaluacionSeccionEstudiante.id, evaluacionSeccionEstudiante);
  }

  public actualizarModulo(modulo: ModuloModificar){
    return this.http.put<void>(this.path+'/Modulo/'+ modulo.id, modulo);
  }

  public actualizarPreguntaEvaluacion(preguntaEvaluacion: PreguntaEvaluacionModificar){
    return this.http.put<void>(this.path+'/PreguntaEvaluacion/'+ preguntaEvaluacion.id, preguntaEvaluacion);
  }

  public actualizarRespuestaEvaluacion(respuestaEvaluacion: RespuestaEvaluacionModificar){
    return this.http.put<void>(this.path+'/RespuestaEvaluacion/'+ respuestaEvaluacion.id, respuestaEvaluacion);
  }

  public actualizarRol(rol: RolModificar){
    return this.http.put<void>(this.path+'/Rol/'+ rol.id, rol);
  }

  public actualizarSeccionCurso(seccionCurso: SeccionCursoModificar){
    return this.http.put<void>(this.path+'/SeccionCurso/'+ seccionCurso.id, seccionCurso);
  }

  public actualizarTipoDocumento(tipoDocumento: TipoDocumentoModificar){
    return this.http.put<void>(this.path+'/TipoDocumento/'+ tipoDocumento.id, tipoDocumento);
  }

  public actualizarUsuario(usuario: UsuarioModificar){
    return this.http.put<void>(this.path+'/Usuario/'+ usuario.id, usuario);
  }

  public actualizarTemaCurso(temaCurso: TemaCursoModificar){
    return this.http.put<void>(this.path+'/TemaCurso/'+ temaCurso.id, temaCurso);
  }
}
