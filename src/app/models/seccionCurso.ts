import { Curso } from "./curso";
import { Estado } from "./estado";

export class SeccionCurso {
  public id: number=0;
  public descripcion: string="";
  public fase: number=0;
  idEstado !: Estado;
  idCurso !: Curso;
}
