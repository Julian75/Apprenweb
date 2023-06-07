import { Estado } from "./estado";
import { TemaCurso } from "./temaCurso";

export class PreguntaEvaluacion{
  public id: number=0;
  public descripcion: string="";
  idTemaCurso !: TemaCurso;
  idEstado !: Estado;
}
