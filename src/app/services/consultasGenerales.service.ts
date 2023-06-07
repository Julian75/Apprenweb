import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../shared.service';
import { EstadoModificar } from '../models-actualizar/estadoModificar';
import { RolesConsulta } from '../models-actualizar/rolesConsulta';
import { AccesoConsulta } from '../models-actualizar/accesoConsulta';
import { EstadoConsulta } from '../models-actualizar/estadoConsulta';
import { TipoDocumentoConsulta } from '../models-actualizar/tipoDocumentoConsulta';
import { UsuarioModificar } from '../models-actualizar/usuarioModificar';
import { CategoriaModificar } from '../models-actualizar/categoriaModificar';
import { CursoConsulta } from '../model-consulta/cursoConsulta';
import { SeccionCursoModificar } from '../models-actualizar/seccionCursoModificar';
import { CursoEstudianteConsulta } from '../model-consulta/cursoEstudianteConsulta';
import { PreguntaEvaluacionConsulta } from '../model-consulta/preguntaEvaluacionConsulta';
import { RespuestaEvaluacionConsulta } from '../model-consulta/respuestaEvaluacionConsulta';
import { ContenidoCursoConsulta } from '../model-consulta/contenidoCursoConsulta';
import { CursoEstudianteModificar } from '../models-actualizar/cursoEstudianteModificar';
import { CursoModificar } from '../models-actualizar/cursoModificar';
import { TemaCursoModificar } from '../models-actualizar/temaCursoModificar';
import { EvaluacionSeccionEstudianteModificar } from '../models-actualizar/evaluacionSeccionEstudianteModificar';
import { EvaluacionesResueltasConsulta } from '../model-consulta/evaluacionesResueltasConsulta';

@Injectable({
  providedIn: 'root'
})
export class ConsultasGeneralesService {


  private path = this.sharedService.APIUrl+'/ConsultasGenerales';

  constructor(private http:HttpClient,
    private sharedService:SharedService
     )
   { }

  // Lista todos los estados dependiendo del id modulo que le pasen
  public listarEstadosIdModulo(idModulo: number){
      return this.http.get<EstadoModificar[]>(this.path+'/ObtenerEstadosIdModulo?idModulo='+idModulo);
  }

  // Lista todos los roles activos si es la opcion 1, con la 2 lista todos sin depender del estado
  public listarRoles(opcion: number){
      return this.http.get<RolesConsulta[]>(this.path+'/ObtenerRoles?opcion='+opcion);
  }

  // Lista todos los accesos sin importar el estado
  public listarAccesos(){
      return this.http.get<AccesoConsulta[]>(this.path+'/ObtenerAccesos');
  }

  // Lista todos los estados existentes
  public listarEstados(){
      return this.http.get<EstadoConsulta[]>(this.path+'/ObtenerEstados');
  }

  // Lista todos los tipos documentos activos
  public listarTipoDocumentoActivos(){
      return this.http.get<TipoDocumentoConsulta[]>(this.path+'/ObtenerTipoDocumentoActivos');
  }

  // Lista todos los usuario activos
  public listarUsuariosActivos(){
      return this.http.get<UsuarioModificar[]>(this.path+'/ObtenerUsuariosActivos');
  }

  // Lista todas las categorias activas
  public listarCategoriasActivas(){
      return this.http.get<CategoriaModificar[]>(this.path+'/ObtenerCategoriasActivas');
  }

  // Lista los cursos de acuerdo al rol
  public listarMisCursos(idRol: number, idUsuario: number){
    return this.http.get<CursoConsulta[]>(this.path+'/ObtenerMisCursos?decision='+idRol+'&idUsuario='+idUsuario);
  }

  // Lista secciones curso con id curos
  public listarSeccionesCurso(idCurso: number){
    return this.http.get<CursoConsulta[]>(this.path+'/ObtenerSeccionesCurso?idCurso='+idCurso);
  }

  // Lista secciones curso activas con el id del curso
  public listarSeccionesCursoActivas(idCurso: number){
    return this.http.get<SeccionCursoModificar[]>(this.path+'/ObtenerSeccionCursoActivos?idCurso='+idCurso);
  }

  // Lista todos los cursos de estudiante por el id del curso
  public listarCursoEstudianteIdCurso(idCurso: number){
    return this.http.get<CursoEstudianteConsulta[]>(this.path+'/ObtenerCursoEstudianteIdCurso?idCurso='+idCurso);
  }

  // Lista todas las preguntas por el id del curso
  public listarPreguntaIdCurso(idCurso: number){
    return this.http.get<PreguntaEvaluacionConsulta[]>(this.path+'/ObtenerPreguntasIdCurso?idCurso='+idCurso);
  }

  // Lista todas las respuestas por el id de la pregunta
  public listarRespuestaIdPregunta(idPregunta: number){
    return this.http.get<RespuestaEvaluacionConsulta[]>(this.path+'/ObtenerRespuestaIdPregunta?idPregunta='+idPregunta);
  }

  // Lista toda la informacion de los cursos por el id de la categooria
  public listarContenidoCursoIdCategoria(idCategoria: number, opcion: number, idUsuario: number){
    return this.http.get<ContenidoCursoConsulta[]>(this.path+'/ObtenerContenidoCursoIdCategoria?idCategoria='+idCategoria+'&opcion='+opcion+'&idUsuario='+idUsuario);
  }

  // Lista el curso registrado
  public listarCursoRegistrado(tituloCurso: string, idCategoriaCurso: number, descripcion: string, idUsuario: number, idEstado: number){
    return this.http.get<CursoConsulta[]>(this.path+'/ObtenerCursoRegistrado?tituloCurso='+tituloCurso+'&idCategoriaCurso='+idCategoriaCurso+'&descripcion='+descripcion+'&idUsuario='+idUsuario+'&idEstado='+idEstado);
  }

  // Lista todo el contenido del curso de acuerdo al id de curso
  public listarContenidoCursoIdCurso(idCurso: number){
    return this.http.get<ContenidoCursoConsulta[]>(this.path+'/ObtenerContenidoCursoIdCurso?idCurso='+idCurso);
  }

  // Lista el curso de estudiante por el id del usuario y si el estado es diferente a suscripcion cancelada
  public listarCursoEstudianteExistente(idUsuario: number, idCategoria: number){
    return this.http.get<CursoEstudianteModificar[]>(this.path+'/ObtenerCursoEstudianteExistente?idUsuario='+idUsuario+"&idCategoria="+idCategoria);
  }

  // Lista todos los temas del curso activos y me indica si cada tema contiene algun contenido
  public listarTemasCursoContenido(){
    return this.http.get<ContenidoCursoConsulta[]>(this.path+'/ObtenerTemasYContenidoCurso');
  }

  // Lista todos los temas del curso activos de acuerdo al id de la seccion
  public listarTemasCursoActivas(idSeccion: number){
    return this.http.get<TemaCursoModificar[]>(this.path+'/ObtenerTemasActivos?idSeccion='+idSeccion);
  }

  // Lista todos los cursos activos por id de la categoria
  public listarCursoActivosCategoria(idCategoria: number){
    return this.http.get<CursoModificar[]>(this.path+'/ObtenerCursosActivosCategoria?idCategoria='+idCategoria);
  }

  // Lista todas las evaluaciones resultas del curso, indicando los temas cursos evaluacion que respondio
  public listarTemasCursosEvaluacionRealizados(idCurso: number, idUsuario: number){
    return this.http.get<TemaCursoModificar[]>(this.path+'/ObtenerTemasCursosEvaluacionRealizados?idCurso='+idCurso+'&idUsuario='+idUsuario);
  }

  // Lista todos los temas de un curso
  public listarTemasCursosIdCurso(idCurso: number){
    return this.http.get<TemaCursoModificar[]>(this.path+'/ObtenerTodosTemasCurso?idCurso='+idCurso);
  }

  // Lista todas las preguntas de acuerdo a un id de tema curso
  public listarPreguntasidTemaCurso(idTemaCurso: number){
    return this.http.get<PreguntaEvaluacionConsulta[]>(this.path+'/ObtenerPreguntasIdTemaCurso?idTemaCurso='+idTemaCurso);
  }

  // Lista respuestas de acuerdo a un id de tema curso
  public listarRespuestasidTemaCurso(idTemaCurso: number){
    return this.http.get<RespuestaEvaluacionConsulta[]>(this.path+'/ObtenerRespuestasIdTemaCurso?idTemaCurso='+idTemaCurso);
  }

  // Lista todo el contenido del curso de acurdo al id del tema
  public listarContenidoCursoidTema(idTema: number){
    return this.http.get<ContenidoCursoConsulta[]>(this.path+'/ObtenerContenidoCursoIdTema?idTema='+idTema);
  }

  // Lista todas las evaluaciones que esten resueltas correctamente por el id del tema y del usuario
  public listarEvaluacionesResueltasUsuTema(idUsuario: number, idTema: number){
    return this.http.get<EvaluacionSeccionEstudianteModificar[]>(this.path+'/ObtenerEvaluacionResueltaUsuTema?idUsuario='+idUsuario+'&idTema='+idTema);
  }

  // Lista todas los temas resueltos de la evaluacion y los temas de cada pregunta del profesor
  public listarTemasEvaluacionCurso(idCurso: number, idUsuario: number){
    return this.http.get<PreguntaEvaluacionConsulta[]>(this.path+'/ObtenerTemasEvaluacionCurso?idCurso='+idCurso+'&idUsuario='+idUsuario);
  }

  // Lista todos los temas y su demas informacion de las evaluaciones contestadas por el usuario
  public listarTrazabilidadEvaluacion(idUsuario: number){
    return this.http.get<EvaluacionesResueltasConsulta[]>(this.path+'/ObtenerTrazabilidadTemasEvaluacion?idUsuario='+idUsuario);
  }
}
