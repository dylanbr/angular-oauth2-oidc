import { OAuthStorage } from './types';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import { OAuthService } from './oauth-service';
import { UrlHelperService } from './url-helper.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/publish';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/race';

export * from './oauth-service';
export * from './token-validation/jwks-validation-handler';
export * from './token-validation/null-validation-handler';
export * from './token-validation/validation-handler';
export * from './url-helper.service';
export * from './auth.config';
export * from './types';
export * from './tokens';
export * from './events';
export * from './interceptors/default-oauth.interceptor';
export * from './interceptors/resource-server-error-handler';
export * from './oauth-module.config';

import { OAuthModuleConfig } from "./oauth-module.config";
import { OAuthResourceServerErrorHandler, OAuthNoopResourceServerErrorHandler } from "./interceptors/resource-server-error-handler";
import { DefaultOAuthInterceptor } from "./interceptors/default-oauth.interceptor";

export function createDefaultStorage(config: OAuthModuleConfig) { 
	if(!config.storage) {
		config.storage = (typeof sessionStorage !== 'undefined') ? sessionStorage : null;
	}
	return config.storage;
}

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
  ],
  exports: [
  ]
})
export class OAuthModule {

  static forRoot(config: OAuthModuleConfig = null): ModuleWithProviders {

    //const setupInterceptor = config && config.resourceServer && config.resourceServer.allowedUrls;
    
    return {
      ngModule: OAuthModule,
      providers: [
        OAuthService,
        UrlHelperService,
        { provide: OAuthModuleConfig, useValue: config},
		{ provide: OAuthStorage, useFactory: createDefaultStorage, deps: [OAuthModuleConfig] },
        { provide: OAuthResourceServerErrorHandler, useClass: OAuthNoopResourceServerErrorHandler},
        { provide: HTTP_INTERCEPTORS, useClass: DefaultOAuthInterceptor, multi: true}
      ]

    };
  }
}


