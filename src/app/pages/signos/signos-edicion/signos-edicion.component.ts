import { Paciente } from './../../../_model/paciente';
import { PacienteService } from './../../../_service/paciente.service';
import { SignosService } from './../../../_service/signos.service';
import { Signos } from './../../../_model/signos';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-signos-edicion',
  templateUrl: './signos-edicion.component.html',
  styleUrls: ['./signos-edicion.component.css']
})
export class SignosEdicionComponent implements OnInit {

  id: number;
  signos: Signos;
  form: FormGroup;
  edicion: boolean = false;
  pacientes: Paciente[] = [];

  constructor(private signosService:SignosService, private route: ActivatedRoute, private router: Router, private pacienteService:PacienteService) {
    this.signos = new Signos();

    this.form = new FormGroup({
      'id': new FormControl(0),
      'fecha': new FormControl(new Date()),
      'temperatura': new FormControl(''),
      'pulso': new FormControl(''),
      'ritmo': new FormControl('')
    });
  }

  ngOnInit() {
    this.listarPacientes();
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.initForm();
    });
  }

  private initForm() {
    if (this.edicion) {
      this.signosService.getSignosPorId(this.id).subscribe(data => {
        let id = data.idSignos;
        let fecha = data.fecha;
        let temperatura = data.temperatura;
        let pulso = data.pulso;
        let ritmo = data.ritmo;

        this.form = new FormGroup({
          'id': new FormControl(id),
          'fecha': new FormControl(fecha),
          'temperatura': new FormControl(temperatura),
          'pulso': new FormControl(pulso),
          'ritmo': new FormControl(ritmo)
        });
      });
    }
  }

  listarPacientes() {
    this.pacienteService.getlistar().subscribe(data => {
      this.pacientes = data;
    });
  }

  operar() {
    this.signos.idSignos = this.form.value['id'];
    this.signos.fecha = this.form.value['fecha'];
    this.signos.temperatura = this.form.value['temperatura'];
    this.signos.pulso = this.form.value['pulso'];
    this.signos.ritmo = this.form.value['ritmo'];

    if (this.edicion) {
      //update
      this.signosService.modificar(this.signos).subscribe(data => {
        console.log(data);
        if (data === 1) {
          this.signosService.getListarSignos(0, 100).subscribe(signos => {
            this.signosService.signosCambio.next(signos);
            this.signosService.mensaje.next('Se modificó');
          });
        } else {
          this.signosService.mensaje.next('No se modificó');
        }
      });
    } else {
      //insert
      this.signosService.registrar(this.signos).subscribe(data => {
        console.log(data);
        if (data === 1) {
          this.signosService.getListarSignos(0, 100).subscribe(signos => {
            this.signosService.signosCambio.next(signos);
            this.signosService.mensaje.next('Se registró');
          });
        } else {
          this.signosService.mensaje.next('No se registró');
        }
      });
    }

    this.router.navigate(['signos'])
  }
}
