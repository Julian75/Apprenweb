import { Curso } from "./curso";
import { Estado } from "./estado";
import { Usuario } from "./usuario";

export class CursoEstudiante{
  public id: number=0;
  idUsuario !: Usuario;
  idCurso !: Curso;
  idEstado !: Estado;
  public fecha: string = "";
}
