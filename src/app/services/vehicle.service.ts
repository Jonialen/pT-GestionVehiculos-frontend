// src/app/services/vehicle.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient
import { Observable } from 'rxjs'; // Importa Observable
import { Vehiculo } from '../models/vehiculo.model'; // Importa la interfaz

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  // URL API
  private apiUrl = 'http://localhost:3000/vehiculos';

  // Inyecta HttpClient en el constructor
  constructor(private http: HttpClient) { }

  // Obtener todos los vehiculos
  getVehiculos(): Observable<Vehiculo[]> {
    console.log('Servicio: Obteniendo vehículos desde API');
    return this.http.get<Vehiculo[]>(this.apiUrl); // Llama a GET /vehiculos
  }

  // Obtener un vehículo por su placa desde la API
  getVehiculo(placa: string): Observable<Vehiculo> {
     console.log(`Servicio: Obteniendo vehículo ${placa} desde API`);
     const url = `${this.apiUrl}/${placa}`;
     return this.http.get<Vehiculo>(url); // Llama a GET /vehiculos/:placa
  }

  // Nuevo vehículo a la API
  addVehiculo(vehiculo: Vehiculo): Observable<Vehiculo> {
    console.log('Servicio: Añadiendo vehículo vía API', vehiculo);
    return this.http.post<Vehiculo>(this.apiUrl, vehiculo); // Llama a POST /vehiculos
  }

  // Actualizar un vehículo existente en la API
  updateVehiculo(placa: string, vehiculo: Vehiculo): Observable<any> {
    console.log(`Servicio: Actualizando vehículo ${placa} vía API`, vehiculo);
    const url = `${this.apiUrl}/${placa}`;
    return this.http.put(url, vehiculo); // Llama a PUT /vehiculos/:placa
  }

  // Método para eliminar un vehículo de la API
  deleteVehiculo(placa: string): Observable<any> {
     console.log(`Servicio: Eliminando vehículo ${placa} vía API`);
     const url = `${this.apiUrl}/${placa}`;
     return this.http.delete(url); // Llama a DELETE /vehiculos/:placa
  }
}
