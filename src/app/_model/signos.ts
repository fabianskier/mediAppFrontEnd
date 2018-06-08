import { Paciente } from "./paciente";

export class Signos {
    public idSignos:number;
    public paciente:Paciente;
    public fecha:Date;
    public temperatura:string;
    public pulso:string;
    public ritmo:string;
}
