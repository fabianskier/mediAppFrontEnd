import { Component, OnInit, ViewChild } from '@angular/core';
import { Signos } from '../../_model/signos';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { SignosService } from '../../_service/signos.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signos',
  templateUrl: './signos.component.html',
  styleUrls: ['./signos.component.css']
})
export class SignosComponent implements OnInit {

  lista: Signos[] = [];
  displayedColumns = ['idSignos', 'fecha', 'temperatura', 'pulso', 'ritmo', 'acciones'];
  dataSource: MatTableDataSource<Signos>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  cantidad: number;

  constructor(private signosService:SignosService, /*private snackBar: MatSnackBar,*/ public route: ActivatedRoute) { }

  ngOnInit() {

    this.signosService.getListarSignos(0, 10).subscribe(data => {
      console.log(data);
      let signos = JSON.parse(JSON.stringify(data)).content;
      this.cantidad = JSON.parse(JSON.stringify(data)).totalElements;

      this.dataSource = new MatTableDataSource(signos);
      this.dataSource.sort = this.sort;
    });

    this.signosService.signosCambio.subscribe(data => {
      let signos = JSON.parse(JSON.stringify(data)).content;
      this.cantidad = JSON.parse(JSON.stringify(data)).totalElements;

      this.dataSource = new MatTableDataSource(signos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    /*this.signosService.mensaje.subscribe(data => {
      this.snackBar.open(data, null, { duration: 2000 });
    });*/
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

    mostrarMas(e) {
      this.signosService.getListarSignos(e.pageIndex, e.pageSize).subscribe(data => {
        let signos = JSON.parse(JSON.stringify(data)).content;
        this.cantidad = JSON.parse(JSON.stringify(data)).totalElements;

        this.dataSource= new MatTableDataSource(signos);
        this.dataSource.sort = this.sort;

      });
    }

    eliminar(signos: Signos): void {
    this.signosService.eliminar(signos).subscribe(data => {
      if (data === 1) {
        this.signosService.getListarSignos(0, 10).subscribe(signos => {
        this.signosService.signosCambio.next(signos);
            this.signosService.mensaje.next("Se elimino correctamente");
          });
        } else {
          this.signosService.mensaje.next("No se pudo eliminar");
        }
      });
    }
}
