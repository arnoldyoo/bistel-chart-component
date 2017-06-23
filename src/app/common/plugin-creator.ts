/**
 * Created by airnold on 2017. 6. 23..
 */

import { ChartException } from './error/index';

export class PluginCreator {
    plugins: any;

    constructor() {
        this._settingPlugins();
    }

    _settingPlugins() {
        this.plugins = {
            // PieSet: PieSet
        };
    }

    _getPlugin( name: string ): any {
        const plugin: any = this.plugins[name];
        if (!plugin) {
            return null;
        } else {
            return plugin;
        }
    }

    // name: string ,config: any, target: any, width: number, height: number, margin: Array<any>, domain: any
    pluginFactory(name: string, pluginConfiguration: any): any {
        const plugin: any = this._getPlugin(name);
        let classInstance: any;
        if (!plugin) {
            throw new ChartException(404, {message: `not found ${name} plugin `});
        }
        classInstance = new plugin(pluginConfiguration);
        return classInstance;
    }

}


