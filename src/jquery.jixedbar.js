/*
 * jixedbar - a jQuery fixed bar plugin.
 * http://code.google.com/p/jixedbar/
 *
 * Version 0.0.5 (Development)
 *
 * Copyright (c) 2009-2010 Ryan Yonzon, http://ryan.rawswift.com/
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Last update - September 21, 2010
 */

(function($) { // start jixedbar's anonymous function

	$.extend({

		// jixedbar plugin method
		jixedbar: new function(options) {
			var constants = { // constant variables, magic variables that'll make the bar stick on the bottom or the top portion of any browser
					constOverflow: "hidden",
					constBottom: "0px"
				};
			var defaults = { // default options
					showOnTop: false, // show bar on top, instead of default bottom
					transparent: false, // enable/disable bar's transparent effect
					opacity: 0.9, // default bar opacity
					opaqueSpeed: "fast", // default opacity speed effect
					slideSpeed: "fast", // default slide effect
					roundedCorners: true, // rounded corners only works on FF, Chrome, Latest Opera and Safari
					roundedButtons: true, // only works on FF, Chrome, Latest Opera and Safari
					menuFadeSpeed: 250, // menu fade effect
					tooltipFadeSpeed: "slow", // tooltip fade effect
					tooltipFadeOpacity: 0.8 // tooltip fade opacity effect
				};
			var options = $.extend(defaults, options), // merge defaults and options object
                /* IE6 detection method */
                ie6 = $.browser.msie && parseInt($.browser.version, 10) == 6,
                /* var ie7 = window.XMLHttpRequest; // simple way to detect IE7 (see variable below) */
                ie7 = $.browser.msie && parseInt($.browser.version, 10) == 7, // ...but I guess this is a much more accurate method
                button_active = false, // active button flag
                active_button_name = "", // name of current active button
                $elem_obj; // reference to bar's element

			/**
			 * public methods
			 */

			// jixedbar constructor
			this.construct = function() {

				return this.each(function() {
					var $obj = $(this), // reference to selected element
                        screen = jQuery(this), // reference to client screen size
                        fullScreen = screen.width(), // get screen width
                        centerScreen = (fullScreen/2) * (1), // get screen center
                        hideBar = false, // default bar hide/show status
                        /* check what position method to use */
                        pos = $.browser.msie && (ie6 || ie7) ? "absolute" : "fixed",
                        /* check what position should be the arrow indicator will be */
                        hideIndicator = defaults.showOnTop ? "jx-hide-top" : "jx-hide",
                        // do we need to show this on top
						unhideIndicator = defaults.showOnTop ? "jx-show-button-top" : "jx-show-button";

					$elem_obj = $obj; // set bar's element object for public method use

					if ($obj.checkCookie("JXID")) { // check if cookie already exists
						if ($obj.readCookie("JXHID") == "true") {
							this.hideBar = true; // hide bar
						}
					} else { // else drop cookie
						$obj.createCookie("JXID", $obj.genRandID()); // set random ID and create cookie
						$obj.createCookie("JXHID", false); // set bar hide to false then create cookie
					}

					// set html and body style for jixedbar to work
					if ($.browser.msie && ( ie6 || ie7)) { // check if we have an IE client browser
		                $("html").css({"overflow" : "hidden", "height" : "100%"});
		                $("body").css({"margin": "0px", "overflow": "auto", "height": "100%"});
					} else { // else for FF, Chrome, Opera, Safari and other browser
						$("html").css({"height" : "100%"});
						$("body").css({"margin": "0px", "height": "100%"});
					}


					// create hide container and button
					if ($(".jx-bar-button-right", this).exists()) { // check if there are currently an item on the right side portion of the bar
						$("<ul />", {id: "jx-hid-con-id"}).insertBefore($obj.find(".jx-bar-button-right:first")); // insert hide/show button "before" the existing item and let the "float right" do its magic
					} else { // else just append it and it'll automatically set to the right side of the bar
						$("<ul />", {id: "jx-hid-con-id"}).appendTo(this);
					}

                    if ($.browser.msie) {
                        if(ie6) $("#jx-hid-con-id").css({"width": "1px", "float": "right"}); // fix hide container width to prevent float drop issue on IE6 (any width other than "auto" or none specified)
                        else if(ie7) $("#jx-hid-con-id").css({"width": "40px", "float": "right"}); // fix hide container width to prevent float drop issue on IE7
                    }

					// insert the hide button indicator and add appropriate CSS class
					$("#jx-hid-con-id").html('<li alt="Hide toolbar"><a id="jx-hid-btn-id" class="' + hideIndicator + '"></a></li>')
                        .addClass("jx-bar-button-right");

					// insert hide button separator and CSS class
					$("<span />", {id: "jx-hid-sep-id", "class": "jx-hide-separator"}).insertAfter("#jx-hid-con-id");

					// add click event on hide button
					$("#jx-hid-btn-id").parent().click(function() {
						$("#jx-menu-con-id").fadeOut();
						$obj.slideToggle(defaults.slideSpeed, function() {
							$obj.createCookie("JXHID", true); // set bar hide to true
							if (!$obj.checkCookie("JXID")) { // check if cookie JXID exists, if not create one
								$obj.createCookie("JXID", $obj.genRandID()); // set random ID and drop cookie
							}
							$("#jx-uhid-con-id").slideToggle(defaults.slideSpeed);
						});
						return false;
					});

					// initialize bar
					$obj.css({
						"overflow": constants["constOverflow"],
						"position": pos
					});

					// set location: top or bottom
					if (defaults.showOnTop) {
						$obj.css({
							"top": constants["constBottom"]
						});
					} else {
						$obj.css({
							"bottom": constants["constBottom"]
						});
					}

					// add bar style (theme)
					$obj.addClass("jx-bar");

					// rounded corner style (theme)
					if (defaults.roundedCorners) {
						if (defaults.showOnTop) {
							$obj.addClass("jx-bar-rounded-bl jx-bar-rounded-br");
						} else {
							$obj.addClass("jx-bar-rounded-tl jx-bar-rounded-tr");
						}
					}

					// button style (theme)
					$obj.addClass("jx-bar-button");

					// rounded button corner style (theme)
					if (defaults.roundedButtons) {
						$obj.addClass("jx-bar-button-rounded");
					}

					// calculate and adjust bar to the center
					marginLeft = centerScreen-($obj.width()/2);
					$obj.css({"margin-left": marginLeft});

					// fix image vertical alignment and border
					$("img", $obj).css({
						"vertical-align": "bottom",
						"border": "#fff solid 0px" // no border
					});

					// check for alt attribute and set it as button text
					$obj.find("img").each(function() {
						if ($obj.attr("alt") != "") { // if image's ALT attribute is not empty then do the code below
							altName = "&nbsp;" + $obj.attr("alt"); // set button text using the image's ALT attribute
							$obj.parent().append(altName); // append it
						}
					});

					// check of transparency is enabled
					if (defaults.transparent) {
						$obj.fadeTo(defaults.opaqueSpeed, defaults.opacity); // do transparent effect
					}

					// create menu container first before creating the tooltip container, so tooltip will be on foreground
					$("<div />", {id: "jx-menu-con-id"}).appendTo("body");

					// add transparency effect on menu container if "transparent" is true
					if (defaults.transparent) {
						$("#jx-menu-con-id").fadeTo(defaults.opaqueSpeed, defaults.opacity);
					}

					/*
					 * create show/unhide container and button
					 */
					$("<div />", {
                        id: "jx-uhid-con-id",
                        "class": "jx-show",
                        css:{
                            "overflow": constants["constOverflow"],
                            "position": pos,
                            "margin-left": ($obj.offset().left + $obj.width()) - $("#jx-uhid-con-id").width() // calculate the show/unhide left margin/position
						}
					}).appendTo("body"); // create div element and append in html body

					// set show/unhide location: top or bottom
					if (defaults.showOnTop) {
						$("#jx-uhid-con-id").css({
							"top": constants["constBottom"]
						});
					} else {
						$("#jx-uhid-con-id").css({
							"bottom": constants["constBottom"]
						});
					}

					// check if we need to add transparency to menu container
					if (defaults.transparent) {
						$("#jx-uhid-con-id").fadeTo(defaults.opaqueSpeed, defaults.opacity);
					}

					// check if we need to hide the bar (based on cookie)
					if (this.hideBar) {
						$obj.css({
							"display": "none" // do not display the main bar
						});
					}

					// check if we need to hide the show/unhide button (based on cookie)
					if (!this.hideBar) {
						$("#jx-uhid-con-id").css({
							"display": "none" // do not display the show/unhide button
						});
					}

					// create/append the show/unhide button item
					$("<ul />", {id: "jx-uhid-itm-id"}).appendTo($("#jx-uhid-con-id"));

					// add the show/unhide item ("Show toolbar" button)
					$("#jx-uhid-itm-id").html('<li alt="Show toolbar"><a id="jx-uhid-btn-id" class="' + unhideIndicator + '"></a></li>');

					// show/unhide container and button style
					if (defaults.roundedCorners) {
						if (defaults.showOnTop) { // rounded corner CSS for top positioned bar
							$("#jx-uhid-con-id").addClass("jx-bar-rounded-bl jx-bar-rounded-br");
						} else { // rounded corner CSS for bottom positioned bar
							$("#jx-uhid-con-id").addClass("jx-bar-rounded-tl jx-bar-rounded-tr");
						}
					}
					$("#jx-uhid-con-id").addClass("jx-bar-button"); // add CSS style on show/unhide button based on the current theme
					if (defaults.roundedButtons) { // additional CSS style for rounded buttons
						$("#jx-uhid-con-id").addClass("jx-bar-button-rounded");
					}

					// add click event on show/unhide button
					$("#jx-uhid-con-id").click(function() {
						$(this).slideToggle(defaults.slideSpeed, function() {
							$obj.createCookie("JXHID", false); // set bar hide to false
							if (!$obj.checkCookie("JXID")) { // check if cookie JXID exists, if not create one
								$obj.createCookie("JXID", $obj.genRandID()); // set random ID and drop cookie
							}
							$obj.slideToggle(defaults.slideSpeed); // slide toggle effect
							if (active_button_name != "") { // check if we have an active button (menu button)
								$("#jx-menu-con-id").fadeIn(); // if we have then do fade in effect
							}

							// re-set unhide/show button position
							$("#jx-uhid-con-id").css({
								"margin-left": ($obj.offset().left + $obj.width()) - $("#jx-uhid-con-id").width() // calculate the show/unhide left margin/position
							});

							// re-set menu container position
							if (button_active) {
								$("#jx-menu-con-id").css({
									"margin-left": $("#" + active_button_name).parent().offset().left // calculate menu container position by setting its left margin
								});
							}

						});

						return false; // return false to prevent any unnecessary click action
					});

					// create tooltip container
					$("<div />", {id: "jx-ttip-con-id"}).appendTo("body"); // create div element and append in html body
					$("#jx-ttip-con-id").css({ // CSS for tooltip container (invisible to viewer(s))
						"height": "auto",
						"margin-left": "0px",
						"width": "100%", // use entire width
						"overflow": constants["constOverflow"],
						"position": pos
					});

					// set tooltip container: top or bottom
					if (defaults.showOnTop) { // show on top?
						$("#jx-ttip-con-id").css({
							"margin-top": $obj.height() + 6, // put spacing between tooltip container and fixed bar
							"top": constants["constBottom"]
						});
					} else { // else bottom
						$("#jx-ttip-con-id").css({
							"margin-bottom": $obj.height() + 6, // put spacing between tooltip container and fixed bar
							"bottom": constants["constBottom"]
						});
					}

					// prevent browser from showing tooltip; replace title tag with alt tag; comply with w3c standard
					$("li", $obj).each(function() { // iterate through LI element
						var _title = $(this).attr("title");
						if (_title) {
							$(this).removeAttr("title") // remove TITLE attribute
                                .attr("alt", _title); // add (replace with) ALT attribute
						}
					});

					// bar container hover in and out event handler
					$("li", $obj).hover(
						function () { // hover in method event
							var elem = $(this), // get ID (w/ or w/o ID, get it anyway)
                                barTooltipID = elem.attr("id") + "jx-ttip-id", // set a tooltip ID
                                tooltipTitle = elem.attr("title");

							if ( ! tooltipTitle) { // if no 'title' attribute then try 'alt' attribute
								tooltipTitle = elem.attr("alt"); // this prevents IE from showing its own tooltip
							}

							if (tooltipTitle != "") { // show a tooltip if it's not empty
								// create tooltip wrapper; fix IE6's float double-margin bug
								barTooltipWrapperID = barTooltipID + "_wrapper";
								$("<div />", {id: barTooltipWrapperID}).appendTo("#jx-ttip-con-id");
								// create tooltip div element and put it inside the wrapper
								$("<div />", {id: barTooltipID}).appendTo("#" + barTooltipWrapperID);

								// tooltip default style
								$("#" + barTooltipID).css({
									"float": "left"
								});

								// theme for tooltip (theme)
								if ((defaults.showOnTop) && !($.browser.msie && ie6)) { // IE6 workaround; Don't add tooltip pointer if IE6
									$("<div />", {"class": "jx-tool-point-dir-up"}).appendTo("#" + barTooltipID);
								}

                                $("<div />", {html: tooltipTitle, "class": "jx-bar-button-tooltip"}).appendTo("#" + barTooltipID);

								if ((!defaults.showOnTop) && !($.browser.msie && ie6)) { // IE6 workaround; Don't add tooltip pointer if IE6
									$("<div />", {"class": "jx-tool-point-dir-down"}).appendTo("#" + barTooltipID);
								}

								// fix tooltip wrapper relative to the associated button
								lft_pad = parseInt(elem.css("padding-left"));
								$("#" + barTooltipWrapperID).css({
									"margin-left": (elem.offset().left - ($("#" + barTooltipID).width() / 2)) + (elem.width()/2) + lft_pad // calculate position (left margin)
								});

								/* check for active buttons; tooltip behavior */
								if (((elem.find("a:first").prop("name") == "") || (button_active == false))) {
									$("#" + barTooltipID).fadeTo(defaults.tooltipFadeSpeed, defaults.tooltipFadeOpacity);
								} else if (active_button_name != elem.find("a:first").prop("name")) {
									$("#" + barTooltipID).fadeTo(defaults.tooltipFadeSpeed, defaults.tooltipFadeOpacity);
								} else { // we got an active button here! (clicked state)
									$("#" + barTooltipID).css({ // prevent the tooltip from showing; if button if currently on-clicked state
										"display": "none"
									});
								}

							}
						},
						function () { // hover out method event
							var elemID = $(this).attr("id"), // get ID (whether there is an ID or none)
                                barTooltipID = elemID + "jx-ttip-id", // set a tooltip ID
                                barTooltipWrapperID = barTooltipID + "_wrapper";
							$("#" + barTooltipID).remove(); // remove tooltip element
							$("#" + barTooltipWrapperID).remove(); // remove tooltip's element DIV wrapper
						}
					);

					// show/unhide container hover in and out event handler
					$("li", $("#jx-uhid-con-id")).hover(
						function () { // in/over event
							var elem = $(this), // get ID (w/ or w/o ID, get it anyway)
                                barTooltipID = elem.prop("id") + "jx-ttip-id", // set a tooltip ID
                                tooltipTitle = elem.attr("title"),
                                barTooltipWrapperID;

							if ( ! tooltipTitle) { // if no 'title' attribute then try 'alt' attribute
								tooltipTitle = elem.attr("alt"); // this prevents IE from showing its own tooltip
							}

							if (tooltipTitle != "") { // show a tooltip if it is not empty
								// create tooltip wrapper; fix IE6's float double-margin bug
								barTooltipWrapperID = barTooltipID + "_wrapper";
								$("<div />", {id: barTooltipWrapperID})
                                    .appendTo("#jx-ttip-con-id");
								// create tooltip div element and put it inside the wrapper
								$("<div />", {id: barTooltipID, style:"float:left"})
                                    .appendTo("#" + barTooltipWrapperID);

								// theme for show/unhide tooltip
								if ((defaults.showOnTop) && !($.browser.msie && ie6)) {
									$("<div />", {"class": "jx-tool-point-dir-up"}).appendTo("#" + barTooltipID);
								}

                                $("<div />", {html: tooltipTitle, "class": "jx-bar-button-tooltip"}).appendTo("#" + barTooltipID);

								if ((!defaults.showOnTop) && !($.browser.msie && ie6)) {
									$("<div />", {"class": "jx-tool-point-dir-down"}).appendTo("#" + barTooltipID);
								}

								// fix tooltip wrapper relative to the associated button
								ulft_pad = parseInt(elem.css("padding-left"));
								$("#" + barTooltipWrapperID).css({
									"margin-left": (elem.offset().left - ($("#" + barTooltipID).width() / 2)) + (elem.width()/2) + ulft_pad // calculate tooltip position
								});

								/* check for active buttons; tooltip behavior */
								if (((elem.find("a:first").prop("name") == "") || (button_active == false))) {
									$("#" + barTooltipID).fadeTo(defaults.tooltipFadeSpeed, defaults.tooltipFadeOpacity);
								} else if (active_button_name != elem.find("a:first").prop("name")) {
									$("#" + barTooltipID).fadeTo(defaults.tooltipFadeSpeed, defaults.tooltipFadeOpacity);
								} else {
									$("#" + barTooltipID).css({ // prevent the tooltip from showing; if button if currently on-clicked state
										"display": "none"
									});
								}

							}
						},
						function () { // out event
							var elemID = $(this).attr("id"), // get ID (whether there is an ID or none)
                                barTooltipID = elemID + "jx-ttip-id", // set a tooltip ID
                                barTooltipWrapperID = barTooltipID + "_wrapper";
							$("#" + barTooltipID).remove(); // remove tooltip element
							$("#" + barTooltipWrapperID).remove(); // remove tooltip's element DIV wrapper
						}
					);

					// fix PNG transparency problem on IE6
					if ($.browser.msie && ie6) {
						$(this).find("li").each(function() {
							$(this).find("img").each(function() {
                                var elem = $(this),
								imgPath = elem.prop("src"),
								altName = elem.prop("alt"),
								srcText = elem.parent();
								if (altName == "") { // workaround for IE6 bug: Menu item text does not show up on the popup menu
									altName = "&nbsp;&nbsp;" + elem.prop("title");
								}
								srcText.html( // wrap with span element
									'<span style="cursor:pointer;display:inline-block;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + imgPath + '\');">' + srcText.html() + '</span>&nbsp;' + altName
								);
								elem.attr("style", "filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);"); // show image
							});
						});
					}

					// adjust bar on window resize event
					$(window).resize(
						function(){
							var screen = jQuery(this), // reference to client/viewers screen
                                screenWidth = screen.width(), // get current screen width
                                centerScreen = (screenWidth / 2) * (1), // get current screen center
                                marginLeft = centerScreen - $obj.width() / 2; // re-calculate and adjust bar's position
							$obj.css({"margin-left": marginLeft}); // do it!

							// set unhide/show button
							$("#jx-uhid-con-id").css({
								"margin-left": ($obj.offset().left + $obj.width()) - $("#jx-uhid-con-id").width()
							});

							if (button_active) { // check if we have an active button
								$("#jx-menu-con-id").css({
									"margin-left": $("#" + active_button_name).parent().offset().left // fix menu position on resize
								});
							}

						}
					);

					/**
					 * Element click events
					 */

					// hide first level menu
					$("li", $obj).find("ul").each(function() {
						$(this).css({"display": "none"}); // hide it! but we're listening to any click event
					});

					// create menu ID
					i = 1;
					$("li", $obj).find("ul").each(function() {
                        var elem = $(this),
                            part = elem.parent(),
                            // check what position to use
                            buttonIndicator = defaults.showOnTop ? "jx-arrow-down" : "jx-arrow-up";

						elem.prop("id", "nav" + i);
						part.find("a:first").prop({"href":"#", "name": "nav" + i}); // replace href attribute

						/* IE6/IE7 arrow indicator float drop fix: user replaced insertAfter with insertBefore */
						if ($.browser.msie && (ie6 || ie7)) {
							$("<div />", {"class": buttonIndicator, style:"background-position:top"}).insertBefore(part.find("a")); // IE6 and IE7 fix background position
						} else { // else any other browser
							$("<div />", {"class": buttonIndicator}).insertAfter(part.find("a")); // prevent Chrome from wrapping button text
						}

						// add click event (button)
						part.find("a:first").click(function() {
							var elem = $(this), // get ID (whether there is an ID or none)
                                parent = $(this).parent(),
                                barTooltipID = elem.prop("id") + "jx-ttip-id", // set a tooltip ID
                                barTooltipWrapperID = barTooltipID + "_wrapper";

							$("#" + barTooltipID).remove(); // remove tooltip element
							$("#" + barTooltipWrapperID).remove(); // remove tooltip's element DIV wrapper

							if ((button_active) && (active_button_name == elem.prop("name"))) { // is this an active button?
								if (defaults.showOnTop) { // check bar position
									buttonIndicator = "jx-arrow-down"; // top
								} else {
									buttonIndicator = "jx-arrow-up"; // bottom
								}
								parent.find("div").prop("class", buttonIndicator); // change button indicator

								$("#jx-menu-con-id").fadeOut(defaults.menuFadeSpeed); // remove/hide menu using fade effect
								parent.removeClass("jx-nav-menu-active"); // remove active state for this button (style)

								if (defaults.roundedButtons) { // remove additional CSS style if rounded corner button
									parent.removeClass("jx-nav-menu-active-rounded");
								}

								button_active = false; // remove button's active state
								active_button_name = "";

								elem.blur(); // unfocus link/href

							} else {
								if (defaults.showOnTop) { // is bar's on the top position?
									buttonIndicator = "jx-arrow-up";
								} else {
									buttonIndicator = "jx-arrow-down";
								}
								parent.find("div").prop("class", buttonIndicator); // change button indicator

								// hide menu container
								$("#jx-menu-con-id").html("<ul>" + parent.find("ul").html() + "</ul>").css({
                                    "display": "none",
                                    "overflow": constants["constOverflow"],
                                    "position": pos,
                                    "margin-left": parent.offset().left // calculate menu container position by setting its left margin
                                });

								// set menu container location: top or bottom
								if (defaults.showOnTop) { // top
									$("#jx-menu-con-id").css({
										"top": constants["constBottom"],
										"margin-top": $obj.height() + 6
									});
								} else { // bottom
									$("#jx-menu-con-id").css({
										"bottom": constants["constBottom"],
										"margin-bottom": $obj.height() + 6
									});
								}

								$("#jx-menu-con-id").addClass("jx-nav-menu");

									if ($.browser.msie && ie6) {
										$("#jx-menu-con-id ul li a").css({"width": "100%"}); // IE6 and IE7 right padding/margin fix
									}

								if (defaults.roundedButtons) { // additional CSS style for rounded corner button
									$("#jx-menu-con-id").addClass("jx-nav-menu-rounded");
								}

								parent.addClass("jx-nav-menu-active"); // add active state CSS style

								if (defaults.roundedButtons) {
									parent.addClass("jx-nav-menu-active-rounded");
								}

								if (active_button_name != "") { // remove/hide any active button (on-clicked state)
									$("a[name='" + active_button_name + "']").parent().removeClass("jx-nav-menu-active");
									$("a[name='" + active_button_name + "']").parent().removeClass("jx-nav-menu-active-rounded");

									if (defaults.showOnTop) { // change button indicator (depends on the current bar's position)
										buttonIndicator = "jx-arrow-down";
									} else {
										buttonIndicator = "jx-arrow-up";
									}
									$("a[name='" + active_button_name + "']").parent().find("div").prop("class", buttonIndicator);
								}

								button_active = true; // change button's active state
								active_button_name = elem.prop("name"); // save button name for future reference (e.g. remove active state)

								elem.blur(); // unfocus link/href

								$("#jx-menu-con-id").fadeIn(defaults.menuFadeSpeed); // show menu container and its item(s)
							}
							return false; // prevent normal click action
						});

						i = i + 1;
					});

					// nav items click event
					$("li", $obj).click(function () {
						if ($("ul", this).exists()) {
							$(this).find("a:first").click();
							return false;
						} else if ($(this).parent().prop("id") == "jx-hid-con-id") {
							return false; // do nothing
						}

						if ($("a", this).exists()) { // check if there are A tag (href) to follow
							window.location = $(this).find("a:first").prop("href"); // emulate normal click event action (e.g. follow link)
						}
						return false;
					});

				});

			}; // end method construct

			/**
			 * additional public methods
			 */

			// get jixedbar's options (variables)
			this.getOptions = function() {
				return options;
			};

			// check if IE6
			this.isIE6 = function() {
				return ie6;
			};

			// check if IE7
			this.isIE7 = function() {
				return ie7;
			};

			// check if there are active button
			this.hasActiveButton = function() {
				return button_active;
			};

			// return active button name
			this.getActiveButtonName = function() {
				return active_button_name;
			};

			// get tooltip container object
			this.getTooltipObject = function() {
				return $("#jx-ttip-con-id");
			};

			// create object container
			this.createObjectContainer = function(name) {
				name = typeof(name) != 'undefined' ? name : "jx-obj-con-id"; // default object container name
				// create custom object container
				var obj = $("<div />", {id: name})
				.css({ // CSS for tooltip container (invisible to viewer(s))
					"height": "auto",
					"margin-left": "0px",
					"width": "100%", // use entire width
					"overflow": constants["constOverflow"],
					"position": pos
				}).appendTo("body"); // create div element and append in html body

				// set custom object container: top or bottom
				if (defaults.showOnTop) { // show on top?
					obj.css({
						"margin-top": $elem_obj.height() + 6, // put spacing between tooltip container and fixed bar
						"top": constants["constBottom"]
					});
				} else { // else bottom
					obj.css({
						"margin-bottom": $elem_obj.height() + 6, // put spacing between tooltip container and fixed bar
						"bottom": constants["constBottom"]
					});
				}
				return obj; // return object reference
			};


		} // end jixedbar plugin method

	}); // end jquery extend method

$.fn.extend({ // extend jQuery.fn object
    jixedbar: $.jixedbar.construct
});

})(jQuery); // end of anonymous function

/**
 * Element/selector checker - check if element/selector exists
 */
jQuery.fn.exists = function(){return jQuery(this).length>0;};

/**
 * Create a cookie
 */
jQuery.fn.createCookie = function(cookie_name, value) {
	var expiry_date = new Date(2037, 01, 01); // virtually, never expire!
	document.cookie = cookie_name + "=" + escape(value) + ";expires=" + expiry_date.toUTCString();
};

/**
 * Check cookie
 */
jQuery.fn.checkCookie = function(cookie_name) {
	if (document.cookie.length > 0) {
  		cookie_start = document.cookie.indexOf(cookie_name + "=");
  			if (cookie_start != -1) {
    			cookie_start = cookie_start + cookie_name.length + 1;
    			cookie_end = document.cookie.indexOf(";", cookie_start);
    			if (cookie_end == -1) {
    				cookie_end = document.cookie.length;
    				return true;
    			}
			}
  	}
	return false;
};

/**
 * Extract cookie value
 */
jQuery.fn.extractCookieValue = function(value) {
	  if ((endOfCookie = document.cookie.indexOf(";", value)) == -1) {
	     endOfCookie = document.cookie.length;
	  }
	  return unescape(document.cookie.substring(value, endOfCookie));
};

/**
 * Read cookie
 */
jQuery.fn.readCookie = function(cookie_name) {
	  var numOfCookies = document.cookie.length;
	  var nameOfCookie = cookie_name + "=";
	  var cookieLen = nameOfCookie.length;
	  var x = 0;
	  while (x <= numOfCookies) {
	        var y = (x + cookieLen);
	        if (document.cookie.substring(x, y) == nameOfCookie)
	           return (this.extractCookieValue(y));
	           x = document.cookie.indexOf(" ", x) + 1;
	           if (x == 0){
	              break;
	           }
	  }
	  return (null);
};

/**
 * Generate random ID
 */
jQuery.fn.genRandID = function() {
	var id = "";
	var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for(var i=0; i < 24; i++) {
		id += str.charAt(Math.floor(Math.random() * str.length));
	}
    return id;
};

// end jixedbar jquery plugin