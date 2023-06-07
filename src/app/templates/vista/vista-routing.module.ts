import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { ModuloComponent } from './modulos-administracion/modulo/modulo.component';
import { EstadoComponent } from './modulos-administracion/estado/estado.component';
import { RolComponent } from './modulos-administracion/rol/rol.component';
import { AccesoComponent } from './modulos-administracion/acceso/acceso.component';
import { TipoDocumentoComponent } from './modulos-administracion/tipo-documento/tipo-documento.component';
import { UsuarioComponent } from './modulos-administracion/usuario/usuario.component';
import { ModificarUsuarioComponent } from './modulos-administracion/usuario/modificar-usuario/modificar-usuario.component';
import { AgregarUsuarioComponent } from './modulos-administracion/usuario/agregar-usuario/agregar-usuario.component';
import { CategoriaComponent } from './modulos-administracion/categoria/categoria.component';
import { CursoComponent } from './modulos-curso/curso/curso.component';
import { MisCursosComponent } from './modulos-curso/mis-cursos/mis-cursos.component';
import { ListaSeccionesCursoComponent } from './modulos-curso/mis-cursos/lista-secciones-curso/lista-secciones-curso.component';
import { ListaCursoEstudiantesComponent } from './modulos-curso/mis-cursos/lista-curso-estudiantes/lista-curso-estudiantes.component';
import { ListaPreguntasEvaluacionComponent } from './modulos-curso/mis-cursos/lista-preguntas-evaluacion/lista-preguntas-evaluacion.component';
import { ListaRespuestaEvaluacionComponent } from './modulos-curso/mis-cursos/lista-preguntas-evaluacion/lista-respuesta-evaluacion/lista-respuesta-evaluacion.component';
import { InicioGeneralComponent } from './navbar/inicio-general/inicio-general.component';
import { VisualizarCategoriasComponent } from './vista-estudiantes/visualizar-categorias/visualizar-categorias.component';
import { VisualizarCursosComponent } from './vista-estudiantes/visualizar-cursos/visualizar-cursos.component';
import { TemasCursoComponent } from './modulos-curso/temas-curso/temas-curso.component';
import { ContenidoCursoComponent } from './modulos-curso/contenido-curso/contenido-curso.component';
import { VisualizarSeccionesCursoComponent } from './vista-estudiantes/visualizar-secciones-curso/visualizar-secciones-curso.component';
import { VisualizarTemasComponent } from './vista-estudiantes/visualizar-temas/visualizar-temas.component';
import { FormularioSeccionEvaluacionComponent } from './vista-estudiantes/formulario-seccion-evaluacion/formulario-seccion-evaluacion.component';
import { VisualizarEvaluacionesComponent } from './vista-estudiantes/visualizar-evaluaciones/visualizar-evaluaciones.component';

const routes: Routes = [
  {
    path: '',
    component: InicioComponent,
    children:[
      {
        path: 'inicio',
        component: InicioGeneralComponent
      },
      {
        path: 'modulo',
        component: ModuloComponent
      },
      {
        path: 'estado',
        component: EstadoComponent
      },
      {
        path: 'rol',
        component: RolComponent
      },
      {
        path: 'acceso',
        component: AccesoComponent
      },
      {
        path: 'tipoDocumento',
        component: TipoDocumentoComponent
      },
      {
        path: 'usuario',
        component: UsuarioComponent
      },
      {
        path: 'actualizarUsuario/:id',
        component: ModificarUsuarioComponent
      },
      {
        path: 'registrarUsuario',
        component: AgregarUsuarioComponent
      },
      {
        path: 'categoria',
        component: CategoriaComponent
      },
      {
        path: 'curso',
        component: CursoComponent
      },
      {
        path: 'misCursos',
        component: MisCursosComponent
      },
      {
        path: 'seccionesCurso/:id',
        component: ListaSeccionesCursoComponent
      },
      {
        path: 'cursoEstidiantes/:id',
        component: ListaCursoEstudiantesComponent
      },
      {
        path: 'preguntasEvaluacion/:id',
        component: ListaPreguntasEvaluacionComponent
      },
      {
        path: 'respuestasEvaluacion/:id',
        component: ListaRespuestaEvaluacionComponent
      },
      {
        path: 'categoriasEstudiante',
        component: VisualizarCategoriasComponent
      },
      {
        path: 'cursosEstudiante/:id',
        component: VisualizarCursosComponent
      },
      {
        path: 'temasCursos',
        component: TemasCursoComponent
      },
      {
        path: 'contenidoCurso',
        component: ContenidoCursoComponent
      },
      {
        path: 'evaluacionesAdministracion',
        component: ListaPreguntasEvaluacionComponent
      },
      {
        path: 'misCursosEstudianteV',
        component: VisualizarCursosComponent
      },
      {
        path: 'seccionCursoEstudiante/:id',
        component: VisualizarSeccionesCursoComponent
      },
      {
        path: 'temasCursoEstudiante/:id',
        component: VisualizarTemasComponent
      },
      {
        path: 'formularioSeccionEvaluacion/:id',
        component: FormularioSeccionEvaluacionComponent
      },
      {
        path: 'evaluacionesResueltas',
        component: VisualizarEvaluacionesComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VistaRoutingModule { }
