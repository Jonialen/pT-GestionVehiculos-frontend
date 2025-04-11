import { Component, OnInit, inject } from '@angular/core'; // Importa OnInit y inject
import { CommonModule } from '@angular/common'; // Necesario para *ngFor, etc.
import { Router, RouterModule } from '@angular/router'; // Necesario para routerLink y navegación
import { VehicleService } from '../../services/vehicle.service'; // Importa tu servicio
import { Vehiculo } from '../../models/vehiculo.model';

@Component({
  selector: 'app-vehicle-list',
  standalone: true, // Importante: componente standalone
  imports: [CommonModule, RouterModule],
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {
  vehiculos: Vehiculo[] = []; // Array para almacenar los vehículos

  // Inyecta los servicios necesarios usando inject() o el constructor
  private vehicleService = inject(VehicleService);
  private router = inject(Router);

  ngOnInit(): void {
    // Llama al método para cargar los vehículos cuando el componente se inicializa
    this.cargarVehiculos();
  }

  cargarVehiculos(): void {
    console.log('VehicleListComponent: Cargando vehículos...');
    this.vehicleService.getVehiculos().subscribe({
      next: (data) => {
        this.vehiculos = data;
        console.log('Vehículos cargados:', this.vehiculos);
      },
      error: (error) => {
        console.error('Error al cargar vehículos:', error);
      }
    });
  }

  editarVehiculo(placa: string): void {
    // Navega a la ruta de edición pasando la placa
    this.router.navigate(['/vehiculos/editar', placa]);
  }

  eliminarVehiculo(placa: string): void {
    // Pide confirmación antes de eliminar
    if (confirm(`¿Está seguro de que desea eliminar el vehículo con placa ${placa}?`)) {
      console.log(`VehicleListComponent: Eliminando vehículo ${placa}...`);
      this.vehicleService.deleteVehiculo(placa).subscribe({
        next: () => {
          console.log(`Vehículo ${placa} eliminado con éxito.`);
          // Vuelve a cargar la lista para reflejar la eliminación
          this.cargarVehiculos();
        },
        error: (error) => {
          console.error(`Error al eliminar vehículo ${placa}:`, error);
          // Mostrar mensaje de error al usuario
        }
      });
    }
  }

   irANuevoVehiculo(): void {
     this.router.navigate(['/vehiculos/nuevo']);
   }
}
