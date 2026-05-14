import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import St from 'gi://St';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';

export default class HostnameIndicatorExtension {
    enable() {
        const hostname = GLib.get_host_name();
        if (!hostname) {
            return;
        }

        this._hostnameLabel = new St.Label({
            text: `${hostname[0].toUpperCase()}${hostname.slice(1)}`,
            y_align: Clutter.ActorAlign.CENTER
        });

        this._hostnameLabel.visible = false;
        Main.panel._centerBox.insert_child_at_index(this._hostnameLabel, 0);

        this._controller = global.backend.get_remote_access_controller();
        if (this._controller) {
            this._signalId = this._controller.connect('new-handle', (o, handle) => {
                if (!handle.isRecording) {
                    this._hostnameLabel.visible = true;
                }
            });
        }
    }

    disable() {
        if (this._controller && this._signalId) {
            this._controller.disconnect(this._signalId);
            this._signalId = null;
        }
        this._hostnameLabel?.destroy();
        this._hostnameLabel = null;
    }
}
