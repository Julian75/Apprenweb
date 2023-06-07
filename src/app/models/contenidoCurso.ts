import { Curso } from "./curso";
import { Estado } from "./estado";

export class ContenidoCurso{
  public id: number=0;
  public descripcionArchivo: string="";
  public observacion: string="";
  public idTemaCurso: number=0;
  idCurso !: Curso;
  idEstado !: Estado;
}
