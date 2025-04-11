// src/app/app.routes.ts

import { Routes } from '@angular/router';

import { VehicleListComponent } from './components/vehicle-list/vehicle-list.component';
import { VehicleFormComponent } from './components/vehicle-form/vehicle-form.component';

export const routes: Routes = [
    // Ruta para mostrar la lista de vehículos
    {
        path: 'vehiculos',  // /vehiculos
        component: VehicleListComponent
    },
    // Ruta para mostrar el formulario de creación de un nuevo vehículo
    {
    path: 'vehiculos/nuevo', // /vehiculos/nuevo
    component: VehicleFormComponent
    },
    // Ruta para mostrar el formulario de edición de un vehículo existente
    {
    path: 'vehiculos/editar/:placa',
    component: VehicleFormComponent
    },
    // Ruta por defecto
    {
        path: '',
        redirectTo: '/vehiculos',
        pathMatch: 'full'
    },
    // Ruta comodín
    {
        path: '**',
        redirectTo: '/vehiculos'
    }
];
