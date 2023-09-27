import { Component } from "@angular/core";
declare var Clappr: any;
declare var DashShakaPlayback: any;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "Clappr-Drm";
  // kccl
  // {
  // 		version:"1.0.0",
  // 		cxAuthenticationDataToken:"fa11552f-c8db-4705-a273-2bfd8963cefe",
  // 		cxClientInfo:{
  // 					CxDeviceId:"35955589-2f76-466a-a090-6f13391252b5",
  // 					DeviceType:"Browser",
  // 					DrmClientType:"Widevine-HTML5",
  // 					DrmClientVersion:"1.0.0"
  // 				}
  // }
  // chome
  customData = {
    version: "1.0.0",
    cxAuthenticationDataToken: "7d3d13ce-ebd6-4971-9065-805a234f077c",
    cxClientInfo: {
      CxDeviceId: "ca95aeca-dbb8-4091-ae33-33945fee6f5e",
      DeviceType: "Browser",
      DrmClientType: "Widevine-HTML5",
      DrmClientVersion: "1.0.0"
    }
  };

  ngOnInit() {
    this.shakaPlayer();
  }

  shakaPlayer() {
    let token = JSON.stringify(this.customData);
    var player = new Clappr.Player({
      // source: '//storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd',
      // source:'https://103.199.160.84/test/nagra-sd-single/index.mpd',//kccl
      source: "http://103.199.160.81/kccl-01/sonybbcearth/index.mpd", //chome
      plugins: [DashShakaPlayback],
      shakaConfiguration: {
        preferredAudioLanguage: "en-US",
        streaming: {
          rebufferingGoal: 15
        }
      },
      shakaOnBeforeLoad: function(shaka_player) {
        // var manifestUri ='https://storage.googleapis.com/shaka-demo-assets/sintel-widevine/dash.mpd';
        // var licenseServer = 'https://cwip-shaka-proxy.appspot.com/no_auth';
        var licenseServer = 'https://kccl-wvlic.cinesoft.live/license'; //kccl
        // var licenseServer =
        //   "https://viewway.ap-south-1.conax.cloud:443/widevine/license";

        shaka_player.configure({
          drm: {
            servers: { "com.widevine.alpha": licenseServer }
          }
        });

        shaka_player
          .getNetworkingEngine()
          .registerRequestFilter(function(type, request) {
            // Only add headers to license requests:
            if (request.licenseRequestType == "license-request") {
              // This is the specific header name and value the server wants:
              request.headers["Conax-Custom-Data"] = token;
              console.log("Token :", token);
            }
          });

        // // Try to load a manifest.
        // shaka_player.load(manifestUri).then(function() {
        //   // The video should now be playing!
        // }).catch(onerror);

        // shaka_player.getNetworkingEngine().registerRequestFilter() ...
      },
      parentId: "#player"
    });
  }
}
