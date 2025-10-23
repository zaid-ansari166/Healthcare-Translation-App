import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { importProvidersFrom } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HttpClientJsonpModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "./environments/environment";

// Import custom providers
import { provideRouter } from "@angular/router";
import { routes } from "./app/app.routes";

// Error handling
import { ErrorHandler, Injectable } from "@angular/core";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    console.error("Global error occurred:", error);

    // In production, you might want to send this to a logging service
    if (environment.production) {
      // Log to external service
    }
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    // Router
    provideRouter(routes),

    // Modules
    importProvidersFrom([
      BrowserAnimationsModule,
      HttpClientModule,
      HttpClientJsonpModule,
      ReactiveFormsModule,
      ServiceWorkerModule.register("ngsw-worker.js", {
        enabled: environment.production,
        registrationStrategy: "registerWhenStable:30000",
      }),
    ]),

    // Error handling
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
}).catch((err) => {
  console.error("Error starting app:", err);

  // Show user-friendly error message
  document.body.innerHTML = `
    <div style="text-align: center; padding: 2rem; font-family: Arial, sans-serif;">
      <h1>Application Error</h1>
      <p>We're sorry, but the application failed to start.</p>
      <p>Please refresh the page or contact support if the problem persists.</p>
      <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; margin-top: 1rem; background: #2563eb; color: white; border: none; border-radius: 0.25rem; cursor: pointer;">
        Refresh Page
      </button>
    </div>
  `;
});
