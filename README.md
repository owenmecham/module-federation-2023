# Module Federation Tutorial using @angular-architects/module-federation

# Starting Points

main branch - Starting point
feature/exercise-1 - Starting point for exercise 2, working example of exercise 1
feature/exercise-2 - Starting point for exercise 3, working example of exercise 2
feature/exercise-3 - Starting point for bonus exercise, working example of exercise 3

The Micro Frontend playbook powerpoint is available at the root of the repo

Reference Architectures for Module Federation: https://github.com/module-federation/module-federation-examples


Exercise notes:

Exercise 1

git clone https://github.com/owenmecham/ngconf-2022-module-federation-crypto.git {pickname}
cd {pickname}
Yarn install
code . 
git checkout -b "feature/v14-1"


ng serve shell -o

Click on cryptos
	See that the market is closed. Let's look at the code
	Shell/src/app/app.routes.ts


Adding Module Federation WITH A MANIFEST
ng add @angular-architects/module-federation@14.3.10 --project shell --port 5001 --type dynamic-host
Take a look at the files it created
	
The combination of singleton: true and strictVersion: true makes webpack emit a runtime error when the shell and the micro frontend(s) need different incompatible versions (e. g. two different major versions). If we skipped strictVersion or set it to false, webpack would only emit a warning at runtime. More information²⁴ about dealing with version mismatches can be found in one of the subsequent chapters. 
The setting requiredVersion: 'auto' is a little extra provided by the @angular-architects/module-federation plugin. It looks up the used version in your package.json. This prevents several issues. 
	The helper function share used in this generated configuration replaces the value 'auto' with the version found in your package.json. 
	
Commit the changes

ng g @angular-architects/module-federation:init --project mfe1 --port 3000 --type remote

Review the file changes

Commit the changes
Git add *
Git commit -m "feat: added module fed to mfe1"

Switch into the project mfe1 and open the generated configuration file projects\mfe1\webpack.config.js. It contains the module federation configuration for mfe1. Adjust it as follows:

Switch from component to a module and expose the cryptos modules



const { share, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');
module.exports = withModuleFederationPlugin({
  name: 'mfe1',
  exposes: {
    './Module': './projects/mfe1/src/app/cryptos/cryptos.module.ts',
  },
  shared:
  share({
    "@angular/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/common": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/router": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/material": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  }),
});


	
	
Switch to webpack config in shell project and adjust as follows
	Make the same changes
	Notice in remotes, the named remote no longer has the named parameter in front of the http, since we're using real javascript modules
	
	
	
	
	const {
	  share,
	  withModuleFederationPlugin,
	} = require("@angular-architects/module-federation/webpack");
	module.exports = withModuleFederationPlugin({
	  shared: share({
	    "@angular/core": {
	      singleton: true,
	      strictVersion: true,
	      requiredVersion: "auto",
	    },
	    "@angular/common": {
	      singleton: true,
	      strictVersion: true,
	      requiredVersion: "auto",
	    },
	    "@angular/router": {
	      singleton: true,
	      strictVersion: true,
	      requiredVersion: "auto",
	    },
	    "@angular/material": {
	      singleton: true,
	      strictVersion: true,
	      requiredVersion: "auto",
	    },
	  }),
	});
	
	
Update the mf.manifest.json to point to port 3000

Open the shell's router config (projects\shell\src\app\app.routes.ts) and add a route loading the microfrontend:
Paste this section to commented route - talk about using a decl file if you kept it the old way

{
    path: 'cryptos',
    loadChildren: () => loadRemoteModule({ type: 'manifest', remoteName: 'mfe1', exposedModule: './Module'}).then(m => m.CryptosModule)
  },


Point out that the /Module comes from the webpack config in the mfe1 project. Using dynamic import to lazy load

Notice that the import isn't known by typescript as this is dynamic. 

DECL NOT NEEDED USING MANIFEST

Open two terminals

yarn start:mfe1 {G4}

yarn start:shell {G3}


Add --configuration production to the commands to see this in prod mode

Click on cryptos
	The javascript modules loaded are coming from port 3000
	Includes parts of the angular material library not yet loaded by the shell. But the shared modules already loaded by the shell aren't loaded again
		
		
Update the Manifest and add some additional metadata to make this super dynamic

Create folder "utilities" under shell/src/app
Create file remoteConfig.ts



import { Manifest, RemoteConfig } from '@angular-architects/module-federation';
export type CustomRemoteConfig = RemoteConfig & {
  exposedModule: string;
  displayName: string;
  routePath: string;
  ngModuleName: string;
};
export type CustomManifest = Manifest<CustomRemoteConfig>;


Update mf.manifest.ts to


{
  "mfe1": {
    "remoteEntry": "http://localhost:3000/remoteEntry.js",
    "exposedModule": "./Module",
    "displayName": "Buy Crypto",
    "routePath": "cryptos",
    "ngModuleName": "CryptosModule"
  }
}


Create file routes in utilities folder


import { loadRemoteModule } from '@angular-architects/module-federation';
import { Routes } from '@angular/router';
import { APP_ROUTES } from '../app.routes';
import { CustomManifest } from './remoteConfig';
export function buildRoutes(options: CustomManifest): Routes {
  const lazyRoutes: Routes = Object.keys(options).map((key) => {
    const entry = options[key];
    return {
      path: entry.routePath,
      loadChildren: () =>
        loadRemoteModule({
          type: 'manifest',
          remoteName: key,
          exposedModule: entry.exposedModule,
        }).then((m) => m[entry.ngModuleName]),
    };
  });
  return [ ...lazyRoutes, ...APP_ROUTES];
}


Update app.component.ts in the shell



import { getManifest } from '@angular-architects/module-federation';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomManifest, CustomRemoteConfig } from './utilities/remoteConfig';
import { buildRoutes } from './utilities/routes';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'shell';
  remotes: CustomRemoteConfig[] = [];
  constructor(private router: Router) {}
  async ngOnInit(): Promise<void> {
    const manifest = getManifest<CustomManifest>();
    const routes = buildRoutes(manifest);
    this.router.resetConfig(routes);
    this.remotes = Object.values(manifest);
  }
}


Remove the mfe route from app.routes.ts in the shell

Update app.component.html in the shell


<ng-container *ngFor="let remote of remotes">
        <a mat-list-item (click)="sidenav.toggle()" [routerLink]="remote.routePath">{{
          remote.displayName
        }}</a>
      </ng-container>


Try it all out!!!
		
QUIZ TIME


Exercise 2

Beginning with version 1.2, the boilerplate for using SharedMappings is generated for you. You only need to add your lib's name here.
This generated code includes providing the metadata for these libraries for the ModuleFederationPlugin and adding a plugin making sure that even source code generated by the Angular Compiler uses the shared version of the library.
Commit these changes and then branch off of this branch
Git checkout -b "feature/exercise-2wal"
******************************NEXT STARTING PLACE*********************************************
Step 5: Share a Library of Your Monorepo
	1. Add a library to your monorepo:
ng g lib wallet-lib
	2. In your tsconfig.json in the project's root, adjust the path mapping for wallet-lib so that it points to the libs entry point:
"wallet-lib": [
 "projects/wallet-lib/src/public-api"
]
	3. As most IDEs only read global configuration files like the tsconfig.json once, restart your IDE (Alternatively, your IDE might also provide an option for reloading these settings).
	4. Add this after the shared section of the shell webpack.config.js
Here, we can register the monorepo internal libs we want to share at runtime: 

		  sharedMappings: ['wallet-lib'],

	
	1. Also open the micro frontends (mfe1) webpack.config.js and do the same.
	2. Switch to your wallet-lib project and open the file wallet-lib.service.ts. Adjust it as follows:
	
	import { Injectable } from "@angular/core";
	@Injectable({
	  providedIn: 'root',
	})
	export class WalletLibService {
	  private balanceAmount = 1000;
	  public get balance(): number {
	    return this.balanceAmount;
	  }
	  constructor() {}
	  public purchase(purchaseAmount: number): void {
	    this.balanceAmount = this.balanceAmount - purchaseAmount;
	  }
	}
	3. Switch to your shell project and open its home.component.ts. Use the shared WalletLibService to display the current wallet balance:
	
	import { Component } from '@angular/core';
	import { WalletLibService } from 'wallet-lib';
	@Component({
	  selector: 'app-home',
	  templateUrl: './home.component.html',
	})
	export class HomeComponent {
	  balance = 0;
	  constructor(private walletService: WalletLibService) {
	    this.balance = this.walletService.balance;
	  }
	}
	4. Bind the balance in the home.component.html in the shell
	<h1>Wallet Balance: {{ balance | currency}}</h1>
	

	5. Switch to your mfe1 project and open its cryptos-search.component.ts. Use the shared service to retrieve the current wallet balance:
	export class CryptosSearchComponent {
	  active = false;
	  balance: number;
	  constructor(private walletService: WalletLibService) {
	    this.balance = this.walletService.balance;
	  }
	  search(): void {
	    this.active = true;
	  }
	  reset(): void {
	    this.active = false;
	  }
	  purchase(): void {
	    this.walletService.purchase(100);
	    this.balance = this.walletService.balance;
	
	}
	}
	6. Open this component's template(cryptos-search.component.html) and data bind the property user:
	<p>
	      Ready to take your investments <em>to the moon?</em> Look no further than this coin guaranteed to increase in value by 10,000% by the end of the week.
	    </p>
	    <p>
	      Available Balance: {{ balance | currency }}
	    </p>

		<button *ngIf='balance' (click)="purchase()" mat-button>Purchase</button>
		
	1. Restart both, the shell and the micro frontend (mfe1).
	2. In the shell, navigate to the micro frontend. If it shows the same balance, the library is shared.
	3. Click on purchase until you get to 0
Be sure to inspect the source to show that lib is loaded once. Look at the source code




Plugins

Create a new application in our repo
ng g application mfe2 --prefix=mfe2 --routing=false --style=css
Update app.component.html with just a simple h1 tag
		<h1>mfe2</h1>
	
Create a chart component
ng g component chart1 --project=mfe2 --module=app --skip-tests --selector=mfe2-chart1 


Paste in images or graphs from shell project assets

Update html in chart1 to

<img src="http://localhost:3001/assets/graph1.jpg" class="widget"/>

<img src="http://localhost:3001/assets/graph2.png" class="widget"/>
<img src="http://localhost:3001/assets/graph3.png" class="widget"/>
<img src="http://localhost:3001/assets/graph4.png" class="widget"/>

Update css to
.widget { height: 200px; width: 400px; }

Add reference to the component in app.component.html
<h1>mfe2</h1>	
	<mfe2-chart1></mfe2-chart1>
	<mfe2-chart2></mfe2-chart2>
	<mfe2-chart3></mfe2-chart3>
	<mfe2-chart4></mfe2-chart4>

From <https://github.com/owenmecham/ngconf-2021-module-federation-crypto/blob/feature/demo4/projects/mfe2/src/app/app.component.html> 



Repeat this 3 more times until you have 4 chart components. Make them all visible in the app.component

ng g component chart2 --project=mfe2 --module=app --skip-tests --selector=mfe2-chart2
ng g component chart3 --project=mfe2 --module=app --skip-tests --selector=mfe2-chart3
ng g component chart4 --project=mfe2 --module=app --skip-tests --selector=mfe2-chart4

View the component
	ng serve mfe2 --port=3001 -o
	
Now, let's prep this for module federation
	ng add @angular-architects/module-federation@12.5.3 --project mfe2 --port 3001
	
	ng g @angular-architects/module-federation:init --project mfe2 --port 3001 --type remote
	
	
Modify webpack.config.js

const { share, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');
module.exports = withModuleFederationPlugin({
  name: 'mfe2',
  exposes: {
    './Chart1': './projects/mfe2/src/app/chart1/chart1.component.ts',
          './Chart2': './projects/mfe2/src/app/chart2/chart2.component.ts',
          './Chart3': './projects/mfe2/src/app/chart3/chart3.component.ts',
        './Chart4': './projects/mfe2/src/app/chart4/chart4.component.ts',
  },
  shared:
  share({
    "@angular/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/common": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  }),
});

	

Serve the project to confirm settings
ng serve mfe2 -o




Now let's pull these components into our shell application

Create a "plugins" folder below the "app" folder
Create plugin.ts and create the plugin type


import { LoadRemoteModuleOptions } from '@angular-architects/module-federation';
export type PluginOptions = LoadRemoteModuleOptions & {
    displayName: string;
    componentName: string;
};




Cd into plugin folder
	Projects/shell/src/app/plugins/
ng g component plugin-proxy --selector=plugin-proxy --module=app --project=shell --inline-template=true --flat=true --skip-tests=true

Set the value of the component to be


import {Component,Input,OnChanges,ViewChild,ViewContainerRef} from '@angular/core';
import {loadRemoteModule} from '@angular-architects/module-federation';
import {PluginOptions} from'./plugin';
@Component({
    standalone: true,
    selector: 'plugin-proxy',
    template: `
        <ng-container #placeHolder></ng-container>
    `
})
export class PluginProxyComponent implements OnChanges{
    @ViewChild('placeHolder',{read: ViewContainerRef,static: true})
    viewContainer: ViewContainerRef;
    constructor(){}
    @Input() options: PluginOptions;
    async ngOnChanges(){
        this.viewContainer.clear();
        const Component=await loadRemoteModule(this.options)
            .then(m=>m[this.options.componentName]);
        this.viewContainer.createComponent(Component);
    }
}


Still in the plugins folder, execute
ng g service lookup --flat=true --project=shell --skip-tests=true


import { Injectable } from '@angular/core';
import { PluginOptions } from './plugin';
@Injectable({ providedIn: 'root' })
export class LookupService {
    lookup(): Promise<PluginOptions[]> {
        return Promise.resolve([
            {
                type: 'module',
                remoteEntry: 'http://localhost:3001/remoteEntry.js',
                exposedModule: './Chart1',
                displayName: 'Pricing Trends',
                componentName: 'Chart1Component'
            },
            {
              type: 'module',
              remoteEntry: 'http://localhost:3001/remoteEntry.js',
              exposedModule: './Chart2',
              displayName: 'Watch List',
              componentName: 'Chart2Component'
          },
          {
            type: 'module',
            remoteEntry: 'http://localhost:3001/remoteEntry.js',
            exposedModule: './Chart3',
            displayName: 'Current Value',
            componentName: 'Chart3Component'
        },
        {
          type: 'module',
          remoteEntry: 'http://localhost:3001/remoteEntry.js',
          exposedModule: './Chart4',
          displayName: 'Bitcoin Tracker',
          componentName: 'Chart4Component'
      }
        ] as PluginOptions[]);
    }
}

CD back to the project root

In home.component.ts in the shell, add the following below balance = 0;
plugins: PluginOptions[] = [];
  graphs: PluginOptions[] = [];

Make the entire file look like this


import { Component, OnInit } from '@angular/core';
import { WalletLibService } from 'wallet-lib';
import { LookupService } from '../plugins/lookup.service';
import { PluginOptions } from '../plugins/plugin';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  balance = 0;
  plugins: PluginOptions[] = [];
  graphs: PluginOptions[] = [];
  constructor(private walletService: WalletLibService, private lookupService: LookupService) {
    this.balance = this.walletService.balance;
  }
  async ngOnInit(): Promise<void> {
    this.plugins = await this.lookupService.lookup();
  }
  handleClick(graph: PluginOptions): void {
    this.graphs.push(graph);
  }
}


Home.component.html

<h1>Welcome!</h1>
<h1>Wallet Balance: {{ balance | currency}}</h1>
<mat-selection-list #charts [multiple]="false">
  <mat-list-option *ngFor="let p of plugins" [value]="p" (click)="handleClick(p)">
    {{p.displayName}}
  </mat-list-option>
</mat-selection-list>
<ng-container *ngFor="let p of graphs">
    <plugin-proxy [options]="p"></plugin-proxy>
</ng-container>


Check import of PluginProxyComponent in app.module.ts in shell project

import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { APP_ROUTES } from './app.routes';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PluginProxyComponent } from './plugins/plugin-proxy.component';
@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(APP_ROUTES),
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    PluginProxyComponent
  ],
  declarations: [AppComponent, HomeComponent, NotFoundComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}


To test, run all applications	
	Ng serve mfe2
	yarn start:mfe1
	yarn start:shell
