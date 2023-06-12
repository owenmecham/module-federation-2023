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
