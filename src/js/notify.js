"use strict";

let Notifier = function () {
    var a = {
        container: null,
        default_time: 4500,
        vanish_time: 300,
        fps: 30,
        success: {
            classes: "alert-success",
            header: "Yay! Everything worked!",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><title>Checkmark Circle</title><path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm108.25 138.29l-134.4 160a16 16 0 01-12 5.71h-.27a16 16 0 01-11.89-5.3l-57.6-64a16 16 0 1123.78-21.4l45.29 50.32 122.59-145.91a16 16 0 0124.5 20.58z"/></svg>'
        },
        error: {
            classes: "alert-danger",
            header: "Uh oh, something went wrong",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><title>Alert Circle</title><path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm0 319.91a20 20 0 1120-20 20 20 0 01-20 20zm21.72-201.15l-5.74 122a16 16 0 01-32 0l-5.74-121.94v-.05a21.74 21.74 0 1143.44 0z"/></svg>'
        },
        warning: {
            classes: "alert-warning",
            header: "Be careful!",
            icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"8\" height=\"8\" viewBox=\"0 0 8 8\"><path d=\"M3.09 0c-.06 0-.1.04-.13.09l-2.94 6.81c-.02.05-.03.13-.03.19v.81c0 .05.04.09.09.09h6.81c.05 0 .09-.04.09-.09v-.81c0-.05-.01-.14-.03-.19l-2.94-6.81c-.02-.05-.07-.09-.13-.09h-.81zm-.09 3h1v2h-1v-2zm0 3h1v1h-1v-1z\" /></svg>"
        },
        info: {
            classes: "alert-info",
            header: "Did you know?",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><title>Information Circle</title><path d="M256 56C145.72 56 56 145.72 56 256s89.72 200 200 200 200-89.72 200-200S366.28 56 256 56zm0 82a26 26 0 11-26 26 26 26 0 0126-26zm48 226h-88a16 16 0 010-32h28v-88h-16a16 16 0 010-32h32a16 16 0 0116 16v104h28a16 16 0 010 32z"/></svg>'
        }
    }
        , b = function (a, b, c, d, e, f, g) { // The Root Function which creates notification
            /**
             * a - the root 'div.notifyjs-container'
             * b - custom message
             * c - type of notification
             * d - default_time for display of notification
             * e - vanish_time of notification
             * f - fps of notification
             * g - optional callback argument
             */

            var customMessage = `<div class="notifyjs-message"><p class="header">${c.header}</p><p class="message">${b}</p></div>`;
            this.pushed = !1,
                this.element = document.createElement("div"),
                this.element.className = "notifyjs-notification " + c.classes,
                this.element.innerHTML = "<div class='notifyjs-icon'>" + c.icon + "</div>" + customMessage,
                a.appendChild(this.element);
            // Notification progress
            this.callback = g;
            var j = this;
            this.push = function () {
                if (!j.pushed) {
                    j.pushed = !0;
                    var a = 0
                        , b = 1e3 / f;
                    j.element.style.display = "flex",
                        j.element.classList.add("slideIn"),
                        j.interval = setInterval(function () {
                            a++;
                            var c = 100 * (1 - b * a / d);
                            0 >= c && ("function" == typeof g && g(),
                                j.element.classList.remove("slideIn"), j.clear())
                        }, b)
                }
            }
                ,
                this.clear = function () {
                    if (j.pushed) {
                        var a = 1e3 / f
                            , b = 1;
                        "undefined" != typeof j.interval && clearInterval(j.interval),
                            j.interval = setInterval(function () {
                                b -= 1 / (e / a),
                                    j.element.style.opacity = b,
                                    0 >= b && (clearInterval(j.interval),
                                        j.destroy())
                            }, a)
                    }
                }
                ,
                this.destroy = function () {
                    j.pushed && (j.pushed = !1,
                        "undefined" != typeof j.interval && clearInterval(j.interval),
                        a.removeChild(j.element))
                }
        };

    // Constructor to create Notification component...
    return function Notifier(c) {
        this.options = Object.assign({}, a),
            this.options = Object.assign(this.options, c),
            null === this.options.container && (this.options.container = document.createElement("div"),
                document.getElementsByTagName("body")[0].appendChild(this.options.container)) // This creates a container for all Notifications...,
        this.options.container.className += " notifyjs-container",
            // The 'notify' function creates a notification whenever click event occurs and displays the notification to user...
            this.notify = function (a, c, d, e) {
                return "undefined" == typeof this.options[a] ? void console.error("Notify.js: Error, undefined '" + a + "' notification type") : ("undefined" == typeof d && (d = this.options.default_time),
                    new b(this.options.container, c, this.options[a], d, this.options.vanish_time, this.options.fps, e))
            }
    }
}();

export default Notifier;