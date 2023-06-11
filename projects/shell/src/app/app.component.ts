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
