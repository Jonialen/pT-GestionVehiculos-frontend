import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {

  vehicleForm!: FormGroup;
  esEdicion = false;
  placaActual: string | null = null;
  isLoading = false;
  mensajeError: string | null = null;

  // Inyectar dependencias
  private fb = inject(FormBuilder);
  private vehicleService = inject(VehicleService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    this.inicializarFormulario();

    // Revisar si hay un parámetro 'placa' en la ruta
    this.route.paramMap.subscribe(params => {
      const placa = params.get('placa');
      if (placa) {
        this.esEdicion = true;
        this.placaActual = placa;
        console.log('Modo Edición - Placa:', this.placaActual);
        this.cargarVehiculo(placa);
        // Deshabilitar el campo placa en modo edición
        this.vehicleForm.controls['placa'].disable();
      } else {
        console.log('Modo Creación');
        this.vehicleForm.controls['placa'].enable();
      }
    });
  }

  inicializarFormulario(): void {
    // Define la estructura del formulario y las validaciones
    this.vehicleForm = this.fb.group({
      placa: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      serie: ['', Validators.required],
      color: ['', Validators.required]
    });
  }

  cargarVehiculo(placa: string): void {
    this.isLoading = true;
    this.mensajeError = null;
    console.log(`VehicleFormComponent: Cargando datos para placa ${placa}`);
    this.vehicleService.getVehiculo(placa)
      .pipe(finalize(() => this.isLoading = false)) // Asegura que isLoading se ponga a false al terminar
      .subscribe({
        next: (vehiculo) => {
          console.log('Datos recibidos para edición:', vehiculo);
          this.vehicleForm.patchValue(vehiculo);
        },
        error: (error) => {
          console.error(`Error al cargar vehículo ${placa}:`, error);
          this.mensajeError = `No se pudieron cargar los datos del vehículo (${placa}). Error: ${error.message || error.statusText}`;
          this.router.navigate(['/vehiculos']);
        }
      });
  }

  onSubmit(): void {
    // Marcar todos los campos como 'touched' para mostrar errores si es necesario
    this.vehicleForm.markAllAsTouched();

    if (this.vehicleForm.invalid) {
      console.log('Formulario inválido');
      return; // Si el formulario no es válido, no hacer nada más
    }

    this.isLoading = true;
    this.mensajeError = null;
    const vehiculoData = this.vehicleForm.getRawValue();

    console.log('Datos a guardar:', vehiculoData);

    if (this.esEdicion && this.placaActual) {
      // --- Modo Edición ---
      console.log(`VehicleFormComponent: Actualizando vehículo ${this.placaActual}`);
      this.vehicleService.updateVehiculo(this.placaActual, vehiculoData)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: () => {
            console.log('Vehículo actualizado con éxito');
            this.router.navigate(['/vehiculos']); // Navegar de vuelta a la lista
          },
          error: (error) => {
            console.error('Error al actualizar vehículo:', error);
            this.mensajeError = `Error al actualizar: ${error.message || error.statusText}`;
          }
        });
    } else {
      console.log('VehicleFormComponent: Creando nuevo vehículo');
      this.vehicleService.addVehiculo(vehiculoData)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (nuevoVehiculo) => {
            console.log('Vehículo creado con éxito:', nuevoVehiculo);
            this.router.navigate(['/vehiculos']); // Navegar de vuelta a la lista
          },
          error: (error) => {
            console.error('Error al crear vehículo:', error);
            if (error.status === 409) {
               this.mensajeError = `Error: La placa '${vehiculoData.placa}' ya existe.`;
            } else {
               this.mensajeError = `Error al crear: ${error.message || error.statusText}`;
            }
          }
        });
    }
  }

  // Método para volver a la lista
  cancelar(): void {
    this.router.navigate(['/vehiculos']);
  }

  get placa() { return this.vehicleForm.get('placa'); }
  get marca() { return this.vehicleForm.get('marca'); }
  get modelo() { return this.vehicleForm.get('modelo'); }
  get serie() { return this.vehicleForm.get('serie'); }
  get color() { return this.vehicleForm.get('color'); }
}
