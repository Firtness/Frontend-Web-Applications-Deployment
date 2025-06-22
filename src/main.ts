import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import { importProvidersFrom } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';


bootstrapApplication(AppComponent, {
    ...appConfig,
    providers: [
        ...appConfig.providers || [],
        importProvidersFrom(MatNativeDateModule)  // <-- Añadir esto soluciona tu error
    ]
}).catch(err => console.error(err));