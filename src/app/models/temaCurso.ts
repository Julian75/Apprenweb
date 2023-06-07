import { Estado } from "./estado";
import { SeccionCurso } from "./seccionCurso";

export class TemaCurso {
  public id: number=0;
  public descripcion: string="";
  public evaluacion: string="";
  idEstado !: Estado;
  idSeccionCurso !: SeccionCurso;
}
