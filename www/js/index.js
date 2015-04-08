/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

g_CONVURI="http://smellof.tk/urlvextract/"

function customLog(f) {
		$(".app").html($(".app").html()+f+"</br>");
	
}

function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    m=text.match(urlRegex);
	if (m.length>0)
		return m[0];
	else
		return false;
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
       
		window.plugins.webintent.getExtra(window.plugins.webintent.EXTRA_TEXT,
			function(uri) {
				customLog("Received MSG:"+uri);
				url=urlify(uri)
				customLog("Received URL:"+url);
				customLog("Calling service...");
				$.ajax({
                        type: "POST",
                        url: g_CONVURI,
                        data: "ourl=" + url,
                        success: function(responsedata) {
                            customLog("Response received ");
                            console.log(responsedata);
                            if (responsedata.url != false) {
								customLog("Conv. URL:"+responsedata.url);
								console.log(responsedata.url);
								window.plugins.webintent.startActivity({
									action: window.plugins.webintent.ACTION_VIEW,
									url: responsedata.url,
									type: 'video/mp4'
									},
									function() {
										customLog("Activity started");
										navigator.app.exitApp();
									},
									function() {
										customLog("Activity NOT started");;
										console.log("Failed to open URL via Android Intent. URL: " + responsedata.url)
									}
								);
                            } else {
								customLog("NO URL received");
							}
                        },
                        error: function(e) {
                            console.log(e);
                            
                        },
                        dataType: "json"
					});

				
				//  the magic here
				
			}, function() {
			// There was no extra supplied.
			}
		);
			
		app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
  
    }
};

app.initialize();