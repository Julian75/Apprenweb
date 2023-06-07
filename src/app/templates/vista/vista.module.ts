import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VistaRoutingModule } from './vista-routing.module';
import { InicioComponent } from './inicio/inicio.component';
import { MaterialModule } from '../material/material/material.module';
import { NavbarComponent } from './navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccesoComponent } from './modulos-administracion/acceso/acceso.component';
import { ModuloComponent } from './modulos-administracion/modulo/modulo.component';
import { EstadoComponent } from './modulos-administracion/estado/estado.component';
import { RolComponent } from './modulos-administracion/rol/rol.component';
import { AgregarEstadoComponent } from './modulos-administracion/estado/agregar-estado/agregar-estado.component';
import { ModificarEstadoComponent } from './modulos-administracion/estado/modificar-estado/modificar-estado.component';
import { AgregarModuloComponent } from './modulos-administracion/modulo/agregar-modulo/agregar-modulo.component';
import { ModificarModuloComponent } from './modulos-administracion/modulo/modificar-modulo/modificar-modulo.component';
import { AgregarRolComponent } from './modulos-administracion/rol/agregar-rol/agregar-rol.component';
import { ModificarRolComponent } from './modulos-administracion/rol/modificar-rol/modificar-rol.component';
import { AgregarAccesoComponent } from './modulos-administracion/acceso/agregar-acceso/agregar-acceso.component';
import { ModificarAccesoComponent } from './modulos-administracion/acceso/modificar-acceso/modificar-acceso.component';
import { TipoDocumentoComponent } from './modulos-administracion/tipo-documento/tipo-documento.component';
import { UsuarioComponent } from './modulos-administracion/usuario/usuario.component';
import { AgregarTipoDocumentoComponent } from './modulos-administracion/tipo-documento/agregar-tipo-documento/agregar-tipo-documento.component';
import { ModificarTipoDocumentoComponent } from './modulos-administracion/tipo-documento/modificar-tipo-documento/modificar-tipo-documento.component';
import { ModificarUsuarioComponent } from './modulos-administracion/usuario/modificar-usuario/modificar-usuario.component';
import { AgregarUsuarioComponent } from './modulos-administracion/usuario/agregar-usuario/agregar-usuario.component';
import { CategoriaComponent } from './modulos-administracion/categoria/categoria.component';
import { AgregarCategoriaComponent } from './modulos-administracion/categoria/agregar-categoria/agregar-categoria.component';
import { ModificarCategoriaComponent } from './modulos-administracion/categoria/modificar-categoria/modificar-categoria.component';
import { CursoComponent } from './modulos-curso/curso/curso.component';
import { MisCursosComponent } from './modulos-curso/mis-cursos/mis-cursos.component';
import { AgregarCursoComponent } from './modulos-curso/curso/agregar-curso/agregar-curso.component';
import { ModificarCursoComponent } from './modulos-curso/curso/modificar-curso/modificar-curso.component';
import { ListaSeccionesCursoComponent } from './modulos-curso/mis-cursos/lista-secciones-curso/lista-secciones-curso.component';
import { AgregarSeccionCursoComponent } from './modulos-curso/mis-cursos/lista-secciones-curso/agregar-seccion-curso/agregar-seccion-curso.component';
import { ModificarSeccionCursoComponent } from './modulos-curso/mis-cursos/lista-secciones-curso/modificar-seccion-curso/modificar-seccion-curso.component';
import { ListaCursoEstudiantesComponent } from './modulos-curso/mis-cursos/lista-curso-estudiantes/lista-curso-estudiantes.component';
import { AgregarCursoEstudianteComponent } from './modulos-curso/mis-cursos/lista-curso-estudiantes/agregar-curso-estudiante/agregar-curso-estudiante.component';
import { ModificarCursoEstudianteComponent } from './modulos-curso/mis-cursos/lista-curso-estudiantes/modificar-curso-estudiante/modificar-curso-estudiante.component';
import { ListaPreguntasEvaluacionComponent } from './modulos-curso/mis-cursos/lista-preguntas-evaluacion/lista-preguntas-evaluacion.component';
import { AgregarPreguntaEvaluacionComponent } from './modulos-curso/mis-cursos/lista-preguntas-evaluacion/agregar-pregunta-evaluacion/agregar-pregunta-evaluacion.component';
import { ModificarPreguntaEvaluacionComponent } from './modulos-curso/mis-cursos/lista-preguntas-evaluacion/modificar-pregunta-evaluacion/modificar-pregunta-evaluacion.component';
import { ListaRespuestaEvaluacionComponent } from './modulos-curso/mis-cursos/lista-preguntas-evaluacion/lista-respuesta-evaluacion/lista-respuesta-evaluacion.component';
import { AgregarRespuestaEvaluacionComponent } from './modulos-curso/mis-cursos/lista-preguntas-evaluacion/lista-respuesta-evaluacion/agregar-respuesta-evaluacion/agregar-respuesta-evaluacion.component';
import { ModificarRespuestaEvaluacionComponent } from './modulos-curso/mis-cursos/lista-preguntas-evaluacion/lista-respuesta-evaluacion/modificar-respuesta-evaluacion/modificar-respuesta-evaluacion.component';
import { InicioGeneralComponent } from './navbar/inicio-general/inicio-general.component';
import { VisualizarCategoriasComponent } from './vista-estudiantes/visualizar-categorias/visualizar-categorias.component';
import { VisualizarCursosComponent } from './vista-estudiantes/visualizar-cursos/visualizar-cursos.component';
import { ImageViewerModule } from "ngx-image-viewer";
import { TemasCursoComponent } from './modulos-curso/temas-curso/temas-curso.component';
import { AgregarTemaCursoComponent } from './modulos-curso/temas-curso/agregar-tema-curso/agregar-tema-curso.component';
import { ModificarTemaCursoComponent } from './modulos-curso/temas-curso/modificar-tema-curso/modificar-tema-curso.component';
import { ContenidoCursoComponent } from './modulos-curso/contenido-curso/contenido-curso.component';
import { AgregarContenidoCursoComponent } from './modulos-curso/contenido-curso/agregar-contenido-curso/agregar-contenido-curso.component';
import { VisualizarSeccionesCursoComponent } from './vista-estudiantes/visualizar-secciones-curso/visualizar-secciones-curso.component';
import { VisualizarTemasComponent } from './vista-estudiantes/visualizar-temas/visualizar-temas.component';
import { FormularioSeccionEvaluacionComponent } from './vista-estudiantes/formulario-seccion-evaluacion/formulario-seccion-evaluacion.component';
import { VisualizarEvaluacionesComponent } from './vista-estudiantes/visualizar-evaluaciones/visualizar-evaluaciones.component';
import { DescargarArchivosComponent } from './modulos-curso/contenido-curso/descargar-archivos/descargar-archivos.component';

@NgModule({
  declarations: [
    InicioComponent,
    NavbarComponent,
    AccesoComponent,
    EstadoComponent,
    AgregarEstadoComponent,
    ModificarEstadoComponent,
    ModuloComponent,
    AgregarModuloComponent,
    ModificarModuloComponent,
    RolComponent,
    AgregarRolComponent,
    ModificarRolComponent,
    AgregarAccesoComponent,
    ModificarAccesoComponent,
    TipoDocumentoComponent,
    UsuarioComponent,
    AgregarTipoDocumentoComponent,
    ModificarTipoDocumentoComponent,
    ModificarUsuarioComponent,
    AgregarUsuarioComponent,
    CategoriaComponent,
    AgregarCategoriaComponent,
    ModificarCategoriaComponent,
    CursoComponent,
    MisCursosComponent,
    AgregarCursoComponent,
    ModificarCursoComponent,
    ListaSeccionesCursoComponent,
    AgregarSeccionCursoComponent,
    ModificarSeccionCursoComponent,
    ListaCursoEstudiantesComponent,
    AgregarCursoEstudianteComponent,
    ModificarCursoEstudianteComponent,
    ListaPreguntasEvaluacionComponent,
    AgregarPreguntaEvaluacionComponent,
    ModificarPreguntaEvaluacionComponent,
    ListaRespuestaEvaluacionComponent,
    AgregarRespuestaEvaluacionComponent,
    ModificarRespuestaEvaluacionComponent,
    InicioGeneralComponent,
    VisualizarCategoriasComponent,
    VisualizarCursosComponent,
    TemasCursoComponent,
    AgregarTemaCursoComponent,
    ModificarTemaCursoComponent,
    ContenidoCursoComponent,
    AgregarContenidoCursoComponent,
    VisualizarSeccionesCursoComponent,
    VisualizarTemasComponent,
    FormularioSeccionEvaluacionComponent,
    VisualizarEvaluacionesComponent,
    DescargarArchivosComponent
  ],
  imports: [
    CommonModule,
    VistaRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ImageViewerModule,
  ],exports:[
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ImageViewerModule,
  ]
})
export class VistaModule { }
