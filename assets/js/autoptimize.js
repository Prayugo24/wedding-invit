"use strict"
var avia_is_mobile = false;
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && 'ontouchstart' in document.documentElement) {
    avia_is_mobile = true;
    document.documentElement.className += ' avia_mobile ';
} else {
    document.documentElement.className += ' avia_desktop ';
}
document.documentElement.className += ' js_active ';
(function() {
    var prefix = ['-webkit-', '-moz-', '-ms-', ""],
        transform = "";
    for (var i in prefix) {
        if (prefix[i] + 'transform' in document.documentElement.style) {
            document.documentElement.className += " avia_transform ";
            transform = prefix[i] + 'transform'
        }
        if (prefix[i] + 'perspective' in document.documentElement.style) document.documentElement.className += " avia_transform3d ";
    }
    if (typeof document.getElementsByClassName == 'function' && typeof document.documentElement.getBoundingClientRect == "function" && avia_is_mobile == false) {
        if (transform && window.innerHeight > 0) {
            setTimeout(function() {
                var y = 0,
                    offsets = {},
                    transY = 0,
                    parallax = document.getElementsByClassName("av-parallax"),
                    winTop = window.pageYOffset || document.documentElement.scrollTop;
                for (y = 0; y < parallax.length; y++) {
                    parallax[y].style.top = "0px";
                    offsets = parallax[y].getBoundingClientRect();
                    transY = Math.ceil((window.innerHeight + winTop - offsets.top) * 0.3);
                    parallax[y].style[transform] = "translate(0px, " + transY + "px)";
                    parallax[y].style.top = "auto";
                    parallax[y].className += ' enabled-parallax ';
                }
            }, 50);
        }
    }
})();
(function($) {
    "use strict";
    $(document).ready(function() {
        var aviabodyclasses = AviaBrowserDetection('html');
        $.avia_utilities = $.avia_utilities || {};
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && 'ontouchstart' in document.documentElement) {
            $.avia_utilities.isMobile = true;
        } else {
            $.avia_utilities.isMobile = false;
        }
        avia_hamburger_menu();
        avia_scroll_top_fade();
        aviaCalcContentWidth();
        new $.AviaTooltip({
            "class": 'avia-search-tooltip',
            data: 'avia-search-tooltip',
            event: 'click',
            position: 'bottom',
            scope: "body",
            attach: 'element',
            within_screen: true
        });
        new $.AviaTooltip({
            "class": 'avia-related-tooltip',
            data: 'avia-related-tooltip',
            scope: ".related_posts, .av-share-box",
            attach: 'element',
            delay: 0
        });
        new $.AviaAjaxSearch({
            scope: '#header, .avia_search_element'
        });
        if ($.fn.avia_iso_sort)
            $('.grid-sort-container').avia_iso_sort();
        AviaSidebarShaowHelper();
        $.avia_utilities.avia_ajax_call();
    });
    $.avia_utilities = $.avia_utilities || {};
    $.avia_utilities.avia_ajax_call = function(container) {
        if (typeof container == 'undefined') {
            container = 'body';
        };
        $('a.avianolink').on('click', function(e) {
            e.preventDefault();
        });
        $('a.aviablank').attr('target', '_blank');
        if ($.fn.avia_activate_lightbox) {
            $(container).avia_activate_lightbox();
        }
        if ($.fn.avia_scrollspy) {
            if (container == 'body') {
                $('body').avia_scrollspy({
                    target: '.main_menu .menu li > a'
                });
            } else {
                $('body').avia_scrollspy('refresh');
            }
        }
        if ($.fn.avia_smoothscroll)
            $('a[href*="#"]', container).avia_smoothscroll(container);
        avia_small_fixes(container);
        avia_hover_effect(container);
        avia_iframe_fix(container);
        if ($.fn.avia_html5_activation && $.fn.mediaelementplayer)
            $(".avia_video, .avia_audio", container).avia_html5_activation({
                ratio: '16:9'
            });
    }
    $.avia_utilities.log = function(text, type, extra) {
        if (typeof console == 'undefined') {
            return;
        }
        if (typeof type == 'undefined') {
            type = "log"
        }
        type = "AVIA-" + type.toUpperCase();
        console.log("[" + type + "] " + text);
        if (typeof extra != 'undefined') console.log(extra);
    }

    function aviaCalcContentWidth() {
        var win = $(window),
            width_select = $('html').is('.html_header_sidebar') ? "#main" : "#header",
            outer = $(width_select),
            outerParent = outer.parents('div:eq(0)'),
            the_main = $(width_select + ' .container:first'),
            css_block = "",
            calc_dimensions = function() {
                var css = "",
                    w_12 = Math.round(the_main.width()),
                    w_outer = Math.round(outer.width()),
                    w_inner = Math.round(outerParent.width());
                css += " #header .three.units{width:" + (w_12 * 0.25) + "px;}";
                css += " #header .six.units{width:" + (w_12 * 0.50) + "px;}";
                css += " #header .nine.units{width:" + (w_12 * 0.75) + "px;}";
                css += " #header .twelve.units{width:" + (w_12) + "px;}";
                css += " .av-framed-box .av-layout-tab-inner .container{width:" + (w_inner) + "px;}";
                css += " .html_header_sidebar .av-layout-tab-inner .container{width:" + (w_outer) + "px;}";
                css += " .boxed .av-layout-tab-inner .container{width:" + (w_outer) + "px;}";
                css += " .av-framed-box#top .av-submenu-container{width:" + (w_inner) + "px;}";
                try {
                    css_block.text(css);
                } catch (err) {
                    css_block.remove();
                    css_block = $("<style type='text/css' id='av-browser-width-calc'>" + css + "</style>").appendTo('head:first');
                }
            };
        if ($('.avia_mega_div').length > 0 || $('.av-layout-tab-inner').length > 0 || $('.av-submenu-container').length > 0) {
            css_block = $("<style type='text/css' id='av-browser-width-calc'></style>").appendTo('head:first')
            win.on('debouncedresize', calc_dimensions);
            calc_dimensions();
        }
    }

    function AviaSidebarShaowHelper() {
        var $sidebar_container = $('.sidebar_shadow#top #main .sidebar');
        var $content_container = $('.sidebar_shadow .content');
        if ($sidebar_container.height() >= $content_container.height()) {
            $sidebar_container.addClass('av-enable-shadow');
        } else {
            $content_container.addClass('av-enable-shadow');
        }
    }

    function AviaScrollSpy(element, options) {
        var self = this;
        var process = $.proxy(self.process, self),
            refresh = $.proxy(self.refresh, self),
            $element = $(element).is('body') ? $(window) : $(element),
            href
        self.$body = $('body')
        self.$win = $(window)
        self.options = $.extend({}, $.fn.avia_scrollspy.defaults, options)
        self.selector = (self.options.target || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) || '')
        self.activation_true = false;
        if (self.$body.find(self.selector + "[href*='#']").length) {
            self.$scrollElement = $element.on('scroll.scroll-spy.data-api', process);
            self.$win.on('av-height-change', refresh);
            self.$body.on('av_resize_finished', refresh);
            self.activation_true = true;
            self.checkFirst();
            setTimeout(function() {
                self.refresh()
                self.process()
            }, 100);
        }
    }
    AviaScrollSpy.prototype = {
        constructor: AviaScrollSpy,
        checkFirst: function() {
            var current = window.location.href.split('#')[0],
                matching_link = this.$body.find(this.selector + "[href='" + current + "']").attr('href', current + '#top');
        },
        refresh: function() {
            if (!this.activation_true) return;
            var self = this,
                $targets
            this.offsets = $([])
            this.targets = $([])
            $targets = this.$body.find(this.selector).map(function() {
                var $el = $(this),
                    href = $el.data('target') || $el.attr('href'),
                    hash = this.hash,
                    hash = hash.replace(/\//g, ""),
                    $href = /^#\w/.test(hash) && $(hash)
                return ($href && $href.length && [
                    [$href.position().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href]
                ]) || null
            }).sort(function(a, b) {
                return a[0] - b[0]
            }).each(function() {
                self.offsets.push(this[0])
                self.targets.push(this[1])
            })
        },
        process: function() {
            if (!this.offsets) return;
            if (isNaN(this.options.offset)) this.options.offset = 0;
            var scrollTop = this.$scrollElement.scrollTop() + this.options.offset,
                scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight,
                maxScroll = scrollHeight - this.$scrollElement.height(),
                offsets = this.offsets,
                targets = this.targets,
                activeTarget = this.activeTarget,
                i
            if (scrollTop >= maxScroll) {
                return activeTarget != (i = targets.last()[0]) && this.activate(i)
            }
            for (i = offsets.length; i--;) {
                activeTarget != targets[i] && scrollTop >= offsets[i] && (!offsets[i + 1] || scrollTop <= offsets[i + 1]) && this.activate(targets[i])
            }
        },
        activate: function(target) {
            var active, selector
            this.activeTarget = target
            $(this.selector).parent('.' + this.options.applyClass).removeClass(this.options.applyClass)
            selector = this.selector +
                '[data-target="' + target + '"],' +
                this.selector + '[href="' + target + '"]'
            active = $(selector).parent('li').addClass(this.options.applyClass)
            if (active.parent('.sub-menu').length) {
                active = active.closest('li.dropdown_ul_available').addClass(this.options.applyClass)
            }
            active.trigger('activate')
        }
    }
    $.fn.avia_scrollspy = function(option) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data('scrollspy'),
                options = typeof option == 'object' && option
            if (!data) $this.data('scrollspy', (data = new AviaScrollSpy(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }
    $.fn.avia_scrollspy.Constructor = AviaScrollSpy
    $.fn.avia_scrollspy.calc_offset = function() {
        var offset_1 = (parseInt($('.html_header_sticky #main').data('scroll-offset'), 10)) || 0,
            offset_2 = ($(".html_header_sticky:not(.html_top_nav_header) #header_main_alternate").outerHeight()) || 0,
            offset_3 = ($(".html_header_sticky.html_header_unstick_top_disabled #header_meta").outerHeight()) || 0,
            offset_4 = 1,
            offset_5 = parseInt($('html').css('margin-top'), 10) || 0,
            offset_6 = parseInt($('.av-frame-top ').outerHeight(), 10) || 0;
        return offset_1 + offset_2 + offset_3 + offset_4 + offset_5 + offset_6;
    }
    $.fn.avia_scrollspy.defaults = {
        offset: $.fn.avia_scrollspy.calc_offset(),
        applyClass: 'current-menu-item'
    }

    function AviaBrowserDetection(outputClassElement) {
        var current_browser = {},
            uaMatch = function(ua) {
                ua = ua.toLowerCase();
                var match = /(edge)\/([\w.]+)/.exec(ua) || /(opr)[\/]([\w.]+)/.exec(ua) || /(chrome)[ \/]([\w.]+)/.exec(ua) || /(iemobile)[\/]([\w.]+)/.exec(ua) || /(version)(applewebkit)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+).*(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
                return {
                    browser: match[5] || match[3] || match[1] || "",
                    version: match[2] || match[4] || "0",
                    versionNumber: match[4] || match[2] || "0"
                };
            };
        var matched = uaMatch(navigator.userAgent);
        if (matched.browser) {
            current_browser.browser = matched.browser;
            current_browser[matched.browser] = true;
            current_browser.version = matched.version;
        }
        if (current_browser.chrome) {
            current_browser.webkit = true;
        } else if (current_browser.webkit) {
            current_browser.safari = true;
        }
        if (typeof(current_browser) !== 'undefined') {
            var bodyclass = '',
                version = current_browser.version ? parseInt(current_browser.version) : "";
            if (current_browser.msie || current_browser.rv || current_browser.iemobile) {
                bodyclass += 'avia-msie';
            } else if (current_browser.webkit) {
                bodyclass += 'avia-webkit';
            } else if (current_browser.mozilla) {
                bodyclass += 'avia-mozilla';
            }
            if (current_browser.version) bodyclass += ' ' + bodyclass + '-' + version + ' ';
            if (current_browser.browser) bodyclass += ' avia-' + current_browser.browser + ' avia-' + current_browser.browser + '-' + version + ' ';
        }
        if (outputClassElement) $(outputClassElement).addClass(bodyclass)
        return bodyclass;
    }
    $.fn.avia_html5_activation = function(options) {
        var defaults = {
            ratio: '16:9'
        };
        var options = $.extend(defaults, options),
            isMobile = $.avia_utilities.isMobile;
        this.each(function() {
            var fv = $(this),
                id_to_apply = '#' + fv.attr('id'),
                posterImg = fv.attr('poster');
            fv.mediaelementplayer({
                defaultVideoWidth: 480,
                defaultVideoHeight: 270,
                videoWidth: -1,
                videoHeight: -1,
                audioWidth: 400,
                audioHeight: 30,
                startVolume: 0.8,
                loop: false,
                enableAutosize: false,
                features: ['playpause', 'progress', 'current', 'duration', 'tracks', 'volume'],
                alwaysShowControls: false,
                iPadUseNativeControls: false,
                iPhoneUseNativeControls: false,
                AndroidUseNativeControls: false,
                alwaysShowHours: false,
                showTimecodeFrameCount: false,
                framesPerSecond: 25,
                enableKeyboard: true,
                pauseOtherPlayers: false,
                poster: posterImg,
                success: function(mediaElement, domObject, instance) {
                    $.AviaVideoAPI.players[fv.attr('id').replace(/_html5/, '')] = instance;
                    setTimeout(function() {
                        if (mediaElement.pluginType == 'flash') {
                            mediaElement.addEventListener('canplay', function() {
                                fv.trigger('av-mediajs-loaded');
                            }, false);
                        } else {
                            fv.trigger('av-mediajs-loaded').addClass('av-mediajs-loaded');
                        }
                        mediaElement.addEventListener('ended', function() {
                            fv.trigger('av-mediajs-ended');
                        }, false);
                    }, 10);
                },
                error: function() {},
                keyActions: []
            });
        });
    }

    function avia_hover_effect(container) {
        if ($.avia_utilities.isMobile) return;
        if ($('body').hasClass('av-disable-avia-hover-effect')) {
            return;
        }
        var overlay = "",
            cssTrans = $.avia_utilities.supports('transition');
        if (container == 'body') {
            var elements = $('#main a img').parents('a').not('.noLightbox, .noLightbox a, .avia-gallery-thumb a, .ls-wp-container a, .noHover, .noHover a, .av-logo-container .logo a').add('#main .avia-hover-fx');
        } else {
            var elements = $('a img', container).parents('a').not('.noLightbox, .noLightbox a, .avia-gallery-thumb a, .ls-wp-container a, .noHover, .noHover a, .av-logo-container .logo a').add('.avia-hover-fx', container);
        }
        elements.each(function(e) {
            var link = $(this),
                current = link.find('img:first');
            if (current.hasClass('alignleft')) link.addClass('alignleft').css({
                float: 'left',
                margin: 0,
                padding: 0
            });
            if (current.hasClass('alignright')) link.addClass('alignright').css({
                float: 'right',
                margin: 0,
                padding: 0
            });
            if (current.hasClass('aligncenter')) link.addClass('aligncenter').css({
                float: 'none',
                'text-align': 'center',
                margin: 0,
                padding: 0
            });
            if (current.hasClass('alignnone')) {
                link.addClass('alignnone').css({
                    margin: 0,
                    padding: 0
                });;
                if (!link.css('display') || link.css('display') == 'inline') {
                    link.css({
                        display: 'inline-block'
                    });
                }
            }
            if (!link.css('position') || link.css('position') == 'static') {
                link.css({
                    position: 'relative',
                    overflow: 'hidden'
                });
            }
            var url = link.attr('href'),
                span_class = "overlay-type-video",
                opa = link.data('opacity') || 0.7,
                overlay_offset = 5,
                overlay = link.find('.image-overlay');
            if (url) {
                if (url.match(/(jpg|gif|jpeg|png|tif)/)) span_class = "overlay-type-image";
                if (!url.match(/(jpg|gif|jpeg|png|\.tif|\.mov|\.swf|vimeo\.com|youtube\.com)/)) span_class = "overlay-type-extern";
            }
            if (!overlay.length) {
                overlay = $("<span class='image-overlay " + span_class + "'><span class='image-overlay-inside'></span></span>").appendTo(link);
            }
            link.on('mouseenter', function(e) {
                var current = link.find('img:first'),
                    _self = current.get(0),
                    outerH = current.outerHeight(),
                    outerW = current.outerWidth(),
                    pos = current.position(),
                    linkCss = link.css('display'),
                    overlay = link.find('.image-overlay');
                if (outerH > 100) {
                    if (!overlay.length) {
                        overlay = $("<span class='image-overlay " + span_class + "'><span class='image-overlay-inside'></span></span>").appendTo(link);
                    }
                    if (link.height() == 0) {
                        link.addClass(_self.className);
                        _self.className = "";
                    }
                    if (!linkCss || linkCss == 'inline') {
                        link.css({
                            display: 'block'
                        });
                    }
                    overlay.css({
                        left: (pos.left - overlay_offset) + parseInt(current.css("margin-left"), 10),
                        top: pos.top + parseInt(current.css("margin-top"), 10)
                    }).css({
                        overflow: 'hidden',
                        display: 'block',
                        'height': outerH,
                        'width': (outerW + (2 * overlay_offset))
                    });
                    if (cssTrans === false) overlay.stop().animate({
                        opacity: opa
                    }, 400);
                } else {
                    overlay.css({
                        display: "none"
                    });
                }
            }).on('mouseleave', elements, function() {
                if (overlay.length) {
                    if (cssTrans === false) overlay.stop().animate({
                        opacity: 0
                    }, 400);
                }
            });
        });
    }
    (function($) {
        $.fn.avia_smoothscroll = function(apply_to_container) {
            if (!this.length) return;
            var the_win = $(window),
                $header = $('#header'),
                $main = $('.html_header_top.html_header_sticky #main').not('.page-template-template-blank-php #main'),
                $meta = $('.html_header_top.html_header_unstick_top_disabled #header_meta'),
                $alt = $('.html_header_top:not(.html_top_nav_header) #header_main_alternate'),
                menu_above_logo = $('.html_header_top.html_top_nav_header'),
                shrink = $('.html_header_top.html_header_shrinking').length,
                frame = $('.av-frame-top'),
                fixedMainPadding = 0,
                isMobile = $.avia_utilities.isMobile,
                sticky_sub = $('.sticky_placeholder:first'),
                calc_main_padding = function() {
                    if ($header.css('position') == "fixed") {
                        var tempPadding = parseInt($main.data('scroll-offset'), 10) || 0,
                            non_shrinking = parseInt($meta.outerHeight(), 10) || 0,
                            non_shrinking2 = parseInt($alt.outerHeight(), 10) || 0;
                        if (tempPadding > 0 && shrink) {
                            tempPadding = (tempPadding / 2) + non_shrinking + non_shrinking2;
                        } else {
                            tempPadding = tempPadding + non_shrinking + non_shrinking2;
                        }
                        tempPadding += parseInt($('html').css('margin-top'), 10);
                        fixedMainPadding = tempPadding;
                    } else {
                        fixedMainPadding = parseInt($('html').css('margin-top'), 10);
                    }
                    if (frame.length) {
                        fixedMainPadding += frame.height();
                    }
                    if (menu_above_logo.length) {
                        fixedMainPadding = $('.html_header_sticky #header_main_alternate').height() + parseInt($('html').css('margin-top'), 10);
                    }
                    if (isMobile) {
                        fixedMainPadding = 0;
                    }
                };
            if (isMobile) shrink = false;
            calc_main_padding();
            the_win.on("debouncedresize av-height-change", calc_main_padding);
            var hash = window.location.hash.replace(/\//g, "");
            if (fixedMainPadding > 0 && hash && apply_to_container == 'body' && hash.charAt(1) != "!" && hash.indexOf("=") === -1) {
                var scroll_to_el = $(hash),
                    modifier = 0;
                if (scroll_to_el.length) {
                    the_win.on('scroll.avia_first_scroll', function() {
                        setTimeout(function() {
                            if (sticky_sub.length && scroll_to_el.offset().top > sticky_sub.offset().top) {
                                modifier = sticky_sub.outerHeight() - 3;
                            }
                            the_win.off('scroll.avia_first_scroll').scrollTop(scroll_to_el.offset().top - fixedMainPadding - modifier);
                        }, 10);
                    });
                }
            }
            return this.each(function() {
                $(this).click(function(e) {
                    var newHash = this.hash.replace(/\//g, ""),
                        clicked = $(this),
                        data = clicked.data();
                    if (newHash != '' && newHash != '#' && newHash != '#prev' && newHash != '#next' && !clicked.is('.comment-reply-link, #cancel-comment-reply-link, .no-scroll')) {
                        var container = "",
                            originHash = "";
                        if ("#next-section" == newHash) {
                            originHash = newHash;
                            container = clicked.parents('.container_wrap:eq(0)').nextAll('.container_wrap:eq(0)');
                            newHash = '#' + container.attr('id');
                        } else {
                            container = $(this.hash.replace(/\//g, ""));
                        }
                        if (container.length) {
                            var cur_offset = the_win.scrollTop(),
                                container_offset = container.offset().top,
                                target = container_offset - fixedMainPadding,
                                hash = window.location.hash,
                                hash = hash.replace(/\//g, ""),
                                oldLocation = window.location.href.replace(hash, ''),
                                newLocation = this,
                                duration = data.duration || 1200,
                                easing = data.easing || 'easeInOutQuint';
                            if (sticky_sub.length && container_offset > sticky_sub.offset().top) {
                                target -= sticky_sub.outerHeight() - 3;
                            }
                            if (oldLocation + newHash == newLocation || originHash) {
                                if (cur_offset != target) {
                                    if (!(cur_offset == 0 && target <= 0)) {
                                        the_win.trigger('avia_smooth_scroll_start');
                                        $('html:not(:animated),body:not(:animated)').animate({
                                            scrollTop: target
                                        }, duration, easing, function() {
                                            if (window.history.replaceState)
                                                window.history.replaceState("", "", newHash);
                                        });
                                    }
                                }
                                e.preventDefault();
                            }
                        }
                    }
                });
            });
        };
    })(jQuery);

    function avia_iframe_fix(container) {
        var iframe = jQuery('iframe[src*="youtube.com"]:not(.av_youtube_frame)', container),
            youtubeEmbed = jQuery('iframe[src*="youtube.com"]:not(.av_youtube_frame) object, iframe[src*="youtube.com"]:not(.av_youtube_frame) embed', container).attr('wmode', 'opaque');
        iframe.each(function() {
            var current = jQuery(this),
                src = current.attr('src');
            if (src) {
                if (src.indexOf('?') !== -1) {
                    src += "&wmode=opaque&rel=0";
                } else {
                    src += "?wmode=opaque&rel=0";
                }
                current.attr('src', src);
            }
        });
    }

    function avia_small_fixes(container) {
        if (!container) container = document;
        var win = jQuery(window),
            iframes = jQuery('.avia-iframe-wrap iframe:not(.avia-slideshow iframe):not( iframe.no_resize):not(.avia-video iframe)', container),
            adjust_iframes = function() {
                iframes.each(function() {
                    var iframe = jQuery(this),
                        parent = iframe.parent(),
                        proportions = 56.25;
                    if (this.width && this.height) {
                        proportions = (100 / this.width) * this.height;
                        parent.css({
                            "padding-bottom": proportions + "%"
                        });
                    }
                });
            };
        adjust_iframes();
    }

    function avia_scroll_top_fade() {
        var win = $(window),
            timeo = false,
            scroll_top = $('#scroll-top-link'),
            set_status = function() {
                var st = win.scrollTop();
                if (st < 500) {
                    scroll_top.removeClass('avia_pop_class');
                } else if (!scroll_top.is('.avia_pop_class')) {
                    scroll_top.addClass('avia_pop_class');
                }
            };
        win.on('scroll', function() {
            window.requestAnimationFrame(set_status)
        });
        set_status();
    }

    function avia_hamburger_menu() {
        var header = $('#header'),
            header_main = $('#main .av-logo-container'),
            menu = $('#avia-menu'),
            burger_wrap = $('.av-burger-menu-main a'),
            htmlEL = $('html').eq(0),
            overlay = $('<div class="av-burger-overlay"></div>'),
            overlay_scroll = $('<div class="av-burger-overlay-scroll"></div>').appendTo(overlay),
            inner_overlay = $('<div class="av-burger-overlay-inner"></div>').appendTo(overlay_scroll),
            bgColor = $('<div class="av-burger-overlay-bg"></div>').appendTo(overlay),
            animating = false,
            first_level = {},
            logo_container = $('.av-logo-container .inner-container'),
            menu_in_logo_container = logo_container.find('.main_menu'),
            cloneFirst = htmlEL.is('.html_av-submenu-display-click.html_av-submenu-clone, .html_av-submenu-display-hover.html_av-submenu-clone'),
            menu_generated = false;
        var alternate = $('#avia_alternate_menu');
        if (alternate.length > 0) {
            menu = alternate;
        }
        var set_list_container_height = function() {
                if ($.avia_utilities.isMobile) {
                    overlay_scroll.outerHeight(window.innerHeight);
                }
            },
            create_list = function(items, append_to) {
                if (!items) return;
                var list, link, current, subitems, megacolumns, sub_current, sub_current_list, new_li, new_ul;
                items.each(function() {
                    current = $(this);
                    subitems = current.find(' > .sub-menu > li');
                    if (subitems.length == 0) {
                        subitems = current.find(' > .children > li');
                    }
                    megacolumns = current.find('.avia_mega_div > .sub-menu > li.menu-item');
                    var cur_menu = current.find('>a');
                    var clone_events = true;
                    if (cur_menu.length) {
                        if (cur_menu.get(0).hash == '#' || 'undefined' == typeof cur_menu.attr('href') || cur_menu.attr('href') == '#') {
                            if (subitems.length > 0 || megacolumns.length > 0) {
                                clone_events = false;
                            }
                        }
                    }
                    link = cur_menu.clone(clone_events).attr('style', '');
                    if ('undefined' == typeof cur_menu.attr('href')) {
                        link.attr('href', '#');
                    }
                    new_li = $('<li>').append(link);
                    var cls = [];
                    if ('undefined' != typeof current.attr('class')) {
                        cls = current.attr('class').split(/\s+/);
                        $.each(cls, function(index, value) {
                            if ((value.indexOf('menu-item') != 0) && (value.indexOf('page-item') < 0) && (value.indexOf('page_item') != 0) && (value.indexOf('dropdown_ul') < 0)) {
                                new_li.addClass(value);
                            }
                            return true;
                        });
                    }
                    if ('undefined' != typeof current.attr('id') && '' != current.attr('id')) {
                        new_li.addClass(current.attr('id'));
                    } else {
                        $.each(cls, function(index, value) {
                            if (value.indexOf('page-item-') >= 0) {
                                new_li.addClass(value);
                                return false;
                            }
                        });
                    }
                    append_to.append(new_li);
                    if (subitems.length) {
                        new_ul = $('<ul class="sub-menu">').appendTo(new_li);
                        if (cloneFirst && (link.get(0).hash != '#' && link.attr('href') != '#')) {
                            new_li.clone(true).prependTo(new_ul);
                        }
                        new_li.addClass('av-width-submenu').find('>a').append('<span class="av-submenu-indicator">');
                        create_list(subitems, new_ul);
                    } else if (megacolumns.length) {
                        new_ul = $('<ul class="sub-menu">').appendTo(new_li);
                        if (cloneFirst && (link.get(0).hash != '#' && link.attr('href') != '#')) {
                            new_li.clone(true).prependTo(new_ul);
                        }
                        megacolumns.each(function(iteration) {
                            var megacolumn = $(this),
                                mega_current = megacolumn.find('> .sub-menu'),
                                mega_title = megacolumn.find('> .mega_menu_title'),
                                mega_title_link = mega_title.find('a').attr('href') || "#",
                                current_megas = mega_current.length > 0 ? mega_current.find('>li') : null,
                                mega_title_set = false,
                                mega_link = new_li.find('>a'),
                                hide_enty = '';
                            if ((current_megas === null) || (current_megas.length == 0)) {
                                if (mega_title_link == '#') {
                                    hide_enty = ' style="display: none;"';
                                }
                            }
                            if (iteration == 0) new_li.addClass('av-width-submenu').find('>a').append('<span class="av-submenu-indicator">');
                            if (mega_title.length && mega_title.text() != "") {
                                mega_title_set = true;
                                if (iteration > 0) {
                                    var check_li = new_li.parents('li').eq(0);
                                    if (check_li.length) new_li = check_li;
                                    new_ul = $('<ul class="sub-menu">').appendTo(new_li);
                                }
                                new_li = $('<li' + hide_enty + '>').appendTo(new_ul);
                                new_ul = $('<ul class="sub-menu">').appendTo(new_li);
                                $('<a href="' + mega_title_link + '"><span class="avia-bullet"></span><span class="avia-menu-text">' + mega_title.text() + '</span></a>').insertBefore(new_ul);
                                mega_link = new_li.find('>a');
                                if (cloneFirst && (mega_current.length > 0) && (mega_link.length && mega_link.get(0).hash != '#' && mega_link.attr('href') != '#')) {
                                    new_li.clone(true).addClass('av-cloned-title').prependTo(new_ul);
                                }
                            }
                            if (mega_title_set && (mega_current.length > 0)) new_li.addClass('av-width-submenu').find('>a').append('<span class="av-submenu-indicator">');
                            create_list(current_megas, new_ul);
                        });
                    }
                });
                burger_wrap.trigger('avia_burger_list_created');
                return list;
            };
        var burger_ul, burger;
        $('body').on('mousewheel DOMMouseScroll touchmove', '.av-burger-overlay-scroll', function(e) {
            var height = this.offsetHeight,
                scrollHeight = this.scrollHeight,
                direction = e.originalEvent.wheelDelta;
            if (scrollHeight != this.clientHeight) {
                if ((this.scrollTop >= (scrollHeight - height) && direction < 0) || (this.scrollTop <= 0 && direction > 0)) {
                    e.preventDefault();
                }
            } else {
                e.preventDefault();
            }
        });
        $(document).on('mousewheel DOMMouseScroll touchmove', '.av-burger-overlay-bg, .av-burger-overlay-active .av-burger-menu-main', function(e) {
            e.preventDefault();
        });
        var touchPos = {};
        $(document).on('touchstart', '.av-burger-overlay-scroll', function(e) {
            touchPos.Y = e.originalEvent.touches[0].clientY;
        });
        $(document).on('touchend', '.av-burger-overlay-scroll', function(e) {
            touchPos = {};
        });
        $(document).on('touchmove', '.av-burger-overlay-scroll', function(e) {
            if (!touchPos.Y) {
                touchPos.Y = e.originalEvent.touches[0].clientY;
            }
            var differenceY = e.originalEvent.touches[0].clientY - touchPos.Y,
                element = this,
                top = element.scrollTop,
                totalScroll = element.scrollHeight,
                currentScroll = top + element.offsetHeight,
                direction = differenceY > 0 ? "up" : "down";
            $('body').get(0).scrollTop = touchPos.body;
            if (top <= 0) {
                if (direction == "up") e.preventDefault();
            } else if (currentScroll >= totalScroll) {
                if (direction == "down") e.preventDefault();
            }
        });
        $(window).on('debouncedresize', function(e) {
            if (burger && burger.length) {
                if (!burger_wrap.is(':visible')) {
                    burger.filter(".is-active").parents('a').eq(0).trigger('click');
                }
            }
            set_list_container_height();
        });
        $('.html_av-overlay-side').on('click', '.av-burger-overlay-bg', function(e) {
            e.preventDefault();
            burger.parents('a').eq(0).trigger('click');
        });
        $(window).on('avia_smooth_scroll_start', function() {
            if (burger && burger.length) {
                burger.filter(".is-active").parents('a').eq(0).trigger('click');
            }
        });
        $('.html_av-submenu-display-hover').on('mouseenter', '.av-width-submenu', function(e) {
            $(this).children("ul.sub-menu").slideDown('fast');
        });
        $('.html_av-submenu-display-hover').on('mouseleave', '.av-width-submenu', function(e) {
            $(this).children("ul.sub-menu").slideUp('fast');
        });
        $('.html_av-submenu-display-hover').on('click', '.av-width-submenu > a', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
        });
        $('.html_av-submenu-display-hover').on('touchstart', '.av-width-submenu > a', function(e) {
            var menu = $(this);
            toggle_submenu(menu, e);
        });
        $('.html_av-submenu-display-click').on('click', '.av-width-submenu > a', function(e) {
            var menu = $(this);
            toggle_submenu(menu, e);
        });

        function toggle_submenu(menu, e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var parent = menu.parents('li').eq(0);
            parent.toggleClass('av-show-submenu');
            if (parent.is('.av-show-submenu')) {
                parent.children("ul.sub-menu").slideDown('fast');
            } else {
                parent.children("ul.sub-menu").slideUp('fast');
            }
        };
        (function normalize_layout() {
            if (menu_in_logo_container.length) return;
            var menu2 = $('#header .main_menu').clone(true);
            menu2.find('.menu-item:not(.menu-item-avia-special)').remove();
            menu2.insertAfter(logo_container.find('.logo').first());
            var social = $('#header .social_bookmarks').clone(true);
            if (!social.length) social = $('.av-logo-container .social_bookmarks').clone(true);
            if (social.length) {
                menu2.find('.avia-menu').addClass('av_menu_icon_beside');
                menu2.append(social);
            }
            burger_wrap = $('.av-burger-menu-main a');
        }());
        burger_wrap.click(function(e) {
            if (animating) return;
            burger = $(this).find('.av-hamburger'), animating = true;
            if (!menu_generated) {
                menu_generated = true;
                burger.addClass("av-inserted-main-menu");
                burger_ul = $('<ul>').attr({
                    id: 'av-burger-menu-ul',
                    class: ''
                });
                var first_level_items = menu.find('> li:not(.menu-item-avia-special)');
                var list = create_list(first_level_items, burger_ul);
                burger_ul.find('.noMobile').remove();
                burger_ul.appendTo(inner_overlay);
                first_level = inner_overlay.find('#av-burger-menu-ul > li');
                if ($.fn.avia_smoothscroll) {
                    $('a[href*="#"]', overlay).avia_smoothscroll(overlay);
                }
            }
            if (burger.is(".is-active")) {
                burger.removeClass("is-active");
                htmlEL.removeClass("av-burger-overlay-active-delayed");
                overlay.animate({
                    opacity: 0
                }, function() {
                    overlay.css({
                        display: 'none'
                    });
                    htmlEL.removeClass("av-burger-overlay-active");
                    animating = false;
                });
            } else {
                set_list_container_height();
                var offsetTop = header_main.length ? header_main.outerHeight() + header_main.position().top : header.outerHeight() + header.position().top;
                overlay.appendTo($(e.target).parents('.avia-menu'));
                burger_ul.css({
                    padding: (offsetTop) + "px 0px"
                });
                first_level.removeClass('av-active-burger-items');
                burger.addClass("is-active");
                htmlEL.addClass("av-burger-overlay-active");
                overlay.css({
                    display: 'block'
                }).animate({
                    opacity: 1
                }, function() {
                    animating = false;
                });
                setTimeout(function() {
                    htmlEL.addClass("av-burger-overlay-active-delayed");
                }, 100);
                first_level.each(function(i) {
                    var _self = $(this);
                    setTimeout(function() {
                        _self.addClass('av-active-burger-items');
                    }, (i + 1) * 125);
                });
            }
            e.preventDefault();
        });
    }
    $.AviaAjaxSearch = function(options) {
        var defaults = {
            delay: 300,
            minChars: 3,
            scope: 'body'
        };
        this.options = $.extend({}, defaults, options);
        this.scope = $(this.options.scope);
        this.timer = false;
        this.lastVal = "";
        this.bind_events();
    };
    $.AviaAjaxSearch.prototype = {
        bind_events: function() {
            this.scope.on('keyup', '#s:not(".av_disable_ajax_search #s")', $.proxy(this.try_search, this));
            this.scope.on('click', '#s.av-results-parked', $.proxy(this.reset, this));
        },
        try_search: function(e) {
            var form = $(e.currentTarget).parents('form:eq(0)'),
                resultscontainer = form.find('.ajax_search_response');
            clearTimeout(this.timer);
            if (e.currentTarget.value.length >= this.options.minChars && this.lastVal != $.trim(e.currentTarget.value)) {
                this.timer = setTimeout($.proxy(this.do_search, this, e), this.options.delay);
            } else if (e.currentTarget.value.length == 0) {
                this.timer = setTimeout($.proxy(this.reset, this, e), this.options.delay);
            }
            if (e.keyCode === 27) {
                this.reset(e);
            }
        },
        reset: function(e) {
            var form = $(e.currentTarget).parents('form:eq(0)'),
                resultscontainer = form.find('.ajax_search_response'),
                alternative_resultscontainer = $(form.attr('data-ajaxcontainer')).find('.ajax_search_response'),
                searchInput = $(e.currentTarget);
            if ($(e.currentTarget).hasClass('av-results-parked')) {
                resultscontainer.show();
                alternative_resultscontainer.show();
                $('body > .ajax_search_response').show();
            } else {
                resultscontainer.remove();
                alternative_resultscontainer.remove();
                searchInput.val('');
                $('body > .ajax_search_response').remove();
            }
        },
        do_search: function(e) {
            var obj = this,
                currentField = $(e.currentTarget).attr("autocomplete", "off"),
                currentFieldWrapper = $(e.currentTarget).parents('.av_searchform_wrapper:eq(0)'),
                currentField_position = currentFieldWrapper.offset(),
                currentField_width = currentFieldWrapper.outerWidth(),
                currentField_height = currentFieldWrapper.outerHeight(),
                form = currentField.parents('form:eq(0)'),
                submitbtn = form.find('#searchsubmit'),
                resultscontainer = form,
                results = resultscontainer.find('.ajax_search_response'),
                loading = $('<div class="ajax_load"><span class="ajax_load_inner"></span></div>'),
                action = form.attr('action'),
                values = form.serialize();
            values += '&action=avia_ajax_search';
            if (!results.length) {
                results = $('<div class="ajax_search_response" style="display:none;"></div>');
            }
            if (form.attr('id') == 'searchform_element') {
                results.addClass('av_searchform_element_results');
            }
            if (action.indexOf('?') != -1) {
                action = action.split('?');
                values += "&" + action[1];
            }
            if (form.attr('data-ajaxcontainer')) {
                var rescon = form.attr('data-ajaxcontainer');
                if ($(rescon).length) {
                    $(rescon).find('.ajax_search_response').remove();
                    resultscontainer = $(rescon);
                }
            }
            results_css = {};
            if (form.hasClass('av_results_container_fixed')) {
                $('body').find('.ajax_search_response').remove();
                resultscontainer = $('body');
                var results_css = {
                    top: currentField_position.top + currentField_height,
                    left: currentField_position.left,
                    width: currentField_width
                }
                results.addClass('main_color');
                $(window).resize(function() {
                    results.remove();
                    $.proxy(this.reset, this);
                    currentField.val('');
                });
            }
            if (form.attr('data-results_style')) {
                var results_style = JSON.parse(form.attr('data-results_style'));
                results_css = Object.assign(results_css, results_style);
                if ("color" in results_css) {
                    results.addClass('av_has_custom_color');
                }
            }
            results.css(results_css);
            if (resultscontainer.hasClass('avia-section')) {
                results.addClass('container');
            }
            results.appendTo(resultscontainer);
            if (results.find('.ajax_not_found').length && e.currentTarget.value.indexOf(this.lastVal) != -1) return;
            this.lastVal = e.currentTarget.value;
            $.ajax({
                url: avia_framework_globals.ajaxurl,
                type: "POST",
                data: values,
                beforeSend: function() {
                    loading.insertAfter(submitbtn);
                    form.addClass('ajax_loading_now');
                },
                success: function(response) {
                    if (response == 0) response = "";
                    results.html(response).show();
                },
                complete: function() {
                    loading.remove();
                    form.removeClass('ajax_loading_now');
                }
            });
            $(document).on('click', function(e) {
                if (!$(e.target).closest(form).length) {
                    if ($(results).is(":visible")) {
                        $(results).hide();
                        currentField.addClass('av-results-parked');
                    }
                }
            });
        }
    };
    $.AviaTooltip = function(options) {
        var defaults = {
            delay: 1500,
            delayOut: 300,
            delayHide: 0,
            "class": "avia-tooltip",
            scope: "body",
            data: "avia-tooltip",
            attach: "body",
            event: 'mouseenter',
            position: 'top',
            extraClass: 'avia-tooltip-class',
            permanent: false,
            within_screen: false
        };
        this.options = $.extend({}, defaults, options);
        this.body = $('body');
        this.scope = $(this.options.scope);
        this.tooltip = $('<div class="' + this.options['class'] + ' avia-tt"><span class="avia-arrow-wrap"><span class="avia-arrow"></span></span></div>');
        this.inner = $('<div class="inner_tooltip"></div>').prependTo(this.tooltip);
        this.open = false;
        this.timer = false;
        this.active = false;
        this.bind_events();
    };
    $.AviaTooltip.openTTs = [];
    $.AviaTooltip.prototype = {
        bind_events: function() {
            var perma_tooltips = '.av-permanent-tooltip [data-' + this.options.data + ']',
                default_tooltips = '[data-' + this.options.data + ']:not( .av-permanent-tooltip [data-' + this.options.data + '])';
            this.scope.on('av_permanent_show', perma_tooltips, $.proxy(this.display_tooltip, this));
            $(perma_tooltips).addClass('av-perma-tooltip').trigger('av_permanent_show');
            this.scope.on(this.options.event + ' mouseleave', default_tooltips, $.proxy(this.start_countdown, this));
            if (this.options.event != 'click') {
                this.scope.on('mouseleave', default_tooltips, $.proxy(this.hide_tooltip, this));
            } else {
                this.body.on('mousedown', $.proxy(this.hide_tooltip, this));
            }
        },
        start_countdown: function(e) {
            clearTimeout(this.timer);
            if (e.type == this.options.event) {
                var delay = this.options.event == 'click' ? 0 : this.open ? 0 : this.options.delay;
                this.timer = setTimeout($.proxy(this.display_tooltip, this, e), delay);
            } else if (e.type == 'mouseleave') {
                this.timer = setTimeout($.proxy(this.stop_instant_open, this, e), this.options.delayOut);
            }
            e.preventDefault();
        },
        reset_countdown: function(e) {
            clearTimeout(this.timer);
            this.timer = false;
        },
        display_tooltip: function(e) {
            var _self = this,
                target = this.options.event == "click" ? e.target : e.currentTarget,
                element = $(target),
                text = element.data(this.options.data),
                newTip = element.data('avia-created-tooltip'),
                extraClass = element.data('avia-tooltip-class'),
                attach = this.options.attach == 'element' ? element : this.body,
                offset = this.options.attach == 'element' ? element.position() : element.offset(),
                position = element.data('avia-tooltip-position'),
                align = element.data('avia-tooltip-alignment'),
                force_append = false;
            text = $.trim(text);
            if (element.is('.av-perma-tooltip')) {
                offset = {
                    top: 0,
                    left: 0
                };
                attach = element;
                force_append = true;
            }
            if (text == "") return;
            if (position == "" || typeof position == 'undefined') position = this.options.position;
            if (align == "" || typeof align == 'undefined') align = 'center';
            if (typeof newTip != 'undefined') {
                newTip = $.AviaTooltip.openTTs[newTip];
            } else {
                this.inner.html(text);
                newTip = this.tooltip.clone();
                if (this.options.attach == 'element' && force_append !== true) {
                    newTip.insertAfter(attach);
                } else {
                    newTip.appendTo(attach);
                }
                if (extraClass != "") newTip.addClass(extraClass);
            }
            this.open = true;
            this.active = newTip;
            if ((newTip.is(':animated:visible') && e.type == 'click') || element.is('.' + this.options['class']) || element.parents('.' + this.options['class']).length != 0) return;
            var animate1 = {},
                animate2 = {},
                pos1 = "",
                pos2 = "";
            if (position == "top" ||  position == "bottom") {
                switch (align) {
                    case "left":
                        pos2 = offset.left;
                        break;
                    case "right":
                        pos2 = offset.left + element.outerWidth() - newTip.outerWidth();
                        break;
                    default:
                        pos2 = (offset.left + (element.outerWidth() / 2)) - (newTip.outerWidth() / 2);
                        break;
                }
                if (_self.options.within_screen) {
                    var boundary = element.offset().left + (element.outerWidth() / 2) - (newTip.outerWidth() / 2) + parseInt(newTip.css('margin-left'), 10);
                    if (boundary < 0) {
                        pos2 = pos2 - boundary;
                    }
                }
            } else {
                switch (align) {
                    case "top":
                        pos1 = offset.top;
                        break;
                    case "bottom":
                        pos1 = offset.top + element.outerHeight() - newTip.outerHeight();
                        break;
                    default:
                        pos1 = (offset.top + (element.outerHeight() / 2)) - (newTip.outerHeight() / 2);
                        break;
                }
            }
            switch (position) {
                case "top":
                    pos1 = offset.top - newTip.outerHeight();
                    animate1 = {
                        top: pos1 - 10,
                        left: pos2
                    };
                    animate2 = {
                        top: pos1
                    };
                    break;
                case "bottom":
                    pos1 = offset.top + element.outerHeight();
                    animate1 = {
                        top: pos1 + 10,
                        left: pos2
                    };
                    animate2 = {
                        top: pos1
                    };
                    break;
                case "left":
                    pos2 = offset.left - newTip.outerWidth();
                    animate1 = {
                        top: pos1,
                        left: pos2 - 10
                    };
                    animate2 = {
                        left: pos2
                    };
                    break;
                case "right":
                    pos2 = offset.left + element.outerWidth();
                    animate1 = {
                        top: pos1,
                        left: pos2 + 10
                    };
                    animate2 = {
                        left: pos2
                    };
                    break;
            }
            animate1['display'] = "block";
            animate1['opacity'] = 0;
            animate2['opacity'] = 1;
            newTip.css(animate1).stop().animate(animate2, 200);
            newTip.find('input, textarea').focus();
            $.AviaTooltip.openTTs.push(newTip);
            element.data('avia-created-tooltip', $.AviaTooltip.openTTs.length - 1);
        },
        hide_tooltip: function(e) {
            var element = $(e.currentTarget),
                newTip, animateTo, position = element.data('avia-tooltip-position'),
                align = element.data('avia-tooltip-alignment');
            if (position == "" || typeof position == 'undefined') position = this.options.position;
            if (align == "" || typeof align == 'undefined') align = 'center';
            if (this.options.event == 'click') {
                element = $(e.target);
                if (!element.is('.' + this.options['class']) && element.parents('.' + this.options['class']).length == 0) {
                    if (this.active.length) {
                        newTip = this.active;
                        this.active = false;
                    }
                }
            } else {
                newTip = element.data('avia-created-tooltip');
                newTip = typeof newTip != 'undefined' ? $.AviaTooltip.openTTs[newTip] : false;
            }
            if (newTip) {
                var animate = {
                    opacity: 0
                };
                switch (position) {
                    case "top":
                        animate['top'] = parseInt(newTip.css('top'), 10) - 10;
                        break;
                    case "bottom":
                        animate['top'] = parseInt(newTip.css('top'), 10) + 10;
                        break;
                    case "left":
                        animate['left'] = parseInt(newTip.css('left'), 10) - 10;
                        break;
                    case "right":
                        animate['left'] = parseInt(newTip.css('left'), 10) + 10;
                        break;
                }
                newTip.animate(animate, 200, function() {
                    newTip.css({
                        display: 'none'
                    });
                });
            }
        },
        stop_instant_open: function(e) {
            this.open = false;
        }
    };
})(jQuery);
/*!
Waypoints - 3.1.1
Copyright Â© 2011-2015 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blog/master/licenses.txt
*/
! function() {
    "use strict";

    function t(o) {
        if (!o) throw new Error("No options passed to Waypoint constructor");
        if (!o.element) throw new Error("No element option passed to Waypoint constructor");
        if (!o.handler) throw new Error("No handler option passed to Waypoint constructor");
        this.key = "waypoint-" + e, this.options = t.Adapter.extend({}, t.defaults, o), this.element = this.options.element, this.adapter = new t.Adapter(this.element), this.callback = o.handler, this.axis = this.options.horizontal ? "horizontal" : "vertical", this.enabled = this.options.enabled, this.triggerPoint = null, this.group = t.Group.findOrCreate({
            name: this.options.group,
            axis: this.axis
        }), this.context = t.Context.findOrCreateByElement(this.options.context), t.offsetAliases[this.options.offset] && (this.options.offset = t.offsetAliases[this.options.offset]), this.group.add(this), this.context.add(this), i[this.key] = this, e += 1
    }
    var e = 0,
        i = {};
    t.prototype.queueTrigger = function(t) {
        this.group.queueTrigger(this, t)
    }, t.prototype.trigger = function(t) {
        this.enabled && this.callback && this.callback.apply(this, t)
    }, t.prototype.destroy = function() {
        this.context.remove(this), this.group.remove(this), delete i[this.key]
    }, t.prototype.disable = function() {
        return this.enabled = !1, this
    }, t.prototype.enable = function() {
        return this.context.refresh(), this.enabled = !0, this
    }, t.prototype.next = function() {
        return this.group.next(this)
    }, t.prototype.previous = function() {
        return this.group.previous(this)
    }, t.invokeAll = function(t) {
        var e = [];
        for (var o in i) e.push(i[o]);
        for (var n = 0, r = e.length; r > n; n++) e[n][t]()
    }, t.destroyAll = function() {
        t.invokeAll("destroy")
    }, t.disableAll = function() {
        t.invokeAll("disable")
    }, t.enableAll = function() {
        t.invokeAll("enable")
    }, t.refreshAll = function() {
        t.Context.refreshAll()
    }, t.viewportHeight = function() {
        return window.innerHeight || document.documentElement.clientHeight
    }, t.viewportWidth = function() {
        return document.documentElement.clientWidth
    }, t.adapters = [], t.defaults = {
        context: window,
        continuous: !0,
        enabled: !0,
        group: "default",
        horizontal: !1,
        offset: 0
    }, t.offsetAliases = {
        "bottom-in-view": function() {
            return this.context.innerHeight() - this.adapter.outerHeight()
        },
        "right-in-view": function() {
            return this.context.innerWidth() - this.adapter.outerWidth()
        }
    }, window.Waypoint = t
}(),
function() {
    "use strict";

    function t(t) {
        window.setTimeout(t, 1e3 / 60)
    }

    function e(t) {
        this.element = t, this.Adapter = n.Adapter, this.adapter = new this.Adapter(t), this.key = "waypoint-context-" + i, this.didScroll = !1, this.didResize = !1, this.oldScroll = {
            x: this.adapter.scrollLeft(),
            y: this.adapter.scrollTop()
        }, this.waypoints = {
            vertical: {},
            horizontal: {}
        }, t.waypointContextKey = this.key, o[t.waypointContextKey] = this, i += 1, this.createThrottledScrollHandler(), this.createThrottledResizeHandler()
    }
    var i = 0,
        o = {},
        n = window.Waypoint,
        r = window.onload;
    e.prototype.add = function(t) {
        var e = t.options.horizontal ? "horizontal" : "vertical";
        this.waypoints[e][t.key] = t, this.refresh()
    }, e.prototype.checkEmpty = function() {
        var t = this.Adapter.isEmptyObject(this.waypoints.horizontal),
            e = this.Adapter.isEmptyObject(this.waypoints.vertical);
        t && e && (this.adapter.off(".waypoints"), delete o[this.key])
    }, e.prototype.createThrottledResizeHandler = function() {
        function t() {
            e.handleResize(), e.didResize = !1
        }
        var e = this;
        this.adapter.on("resize.waypoints", function() {
            e.didResize || (e.didResize = !0, n.requestAnimationFrame(t))
        })
    }, e.prototype.createThrottledScrollHandler = function() {
        function t() {
            e.handleScroll(), e.didScroll = !1
        }
        var e = this;
        this.adapter.on("scroll.waypoints", function() {
            (!e.didScroll || n.isTouch) && (e.didScroll = !0, n.requestAnimationFrame(t))
        })
    }, e.prototype.handleResize = function() {
        n.Context.refreshAll()
    }, e.prototype.handleScroll = function() {
        var t = {},
            e = {
                horizontal: {
                    newScroll: this.adapter.scrollLeft(),
                    oldScroll: this.oldScroll.x,
                    forward: "right",
                    backward: "left"
                },
                vertical: {
                    newScroll: this.adapter.scrollTop(),
                    oldScroll: this.oldScroll.y,
                    forward: "down",
                    backward: "up"
                }
            };
        for (var i in e) {
            var o = e[i],
                n = o.newScroll > o.oldScroll,
                r = n ? o.forward : o.backward;
            for (var s in this.waypoints[i]) {
                var a = this.waypoints[i][s],
                    l = o.oldScroll < a.triggerPoint,
                    h = o.newScroll >= a.triggerPoint,
                    p = l && h,
                    u = !l && !h;
                (p || u) && (a.queueTrigger(r), t[a.group.id] = a.group)
            }
        }
        for (var c in t) t[c].flushTriggers();
        this.oldScroll = {
            x: e.horizontal.newScroll,
            y: e.vertical.newScroll
        }
    }, e.prototype.innerHeight = function() {
        return this.element == this.element.window ? n.viewportHeight() : this.adapter.innerHeight()
    }, e.prototype.remove = function(t) {
        delete this.waypoints[t.axis][t.key], this.checkEmpty()
    }, e.prototype.innerWidth = function() {
        return this.element == this.element.window ? n.viewportWidth() : this.adapter.innerWidth()
    }, e.prototype.destroy = function() {
        var t = [];
        for (var e in this.waypoints)
            for (var i in this.waypoints[e]) t.push(this.waypoints[e][i]);
        for (var o = 0, n = t.length; n > o; o++) t[o].destroy()
    }, e.prototype.refresh = function() {
        var t, e = this.element == this.element.window,
            i = this.adapter.offset(),
            o = {};
        this.handleScroll(), t = {
            horizontal: {
                contextOffset: e ? 0 : i.left,
                contextScroll: e ? 0 : this.oldScroll.x,
                contextDimension: this.innerWidth(),
                oldScroll: this.oldScroll.x,
                forward: "right",
                backward: "left",
                offsetProp: "left"
            },
            vertical: {
                contextOffset: e ? 0 : i.top,
                contextScroll: e ? 0 : this.oldScroll.y,
                contextDimension: this.innerHeight(),
                oldScroll: this.oldScroll.y,
                forward: "down",
                backward: "up",
                offsetProp: "top"
            }
        };
        for (var n in t) {
            var r = t[n];
            for (var s in this.waypoints[n]) {
                var a, l, h, p, u, c = this.waypoints[n][s],
                    d = c.options.offset,
                    f = c.triggerPoint,
                    w = 0,
                    y = null == f;
                c.element !== c.element.window && (w = c.adapter.offset()[r.offsetProp]), "function" == typeof d ? d = d.apply(c) : "string" == typeof d && (d = parseFloat(d), c.options.offset.indexOf("%") > -1 && (d = Math.ceil(r.contextDimension * d / 100))), a = r.contextScroll - r.contextOffset, c.triggerPoint = w + a - d, l = f < r.oldScroll, h = c.triggerPoint >= r.oldScroll, p = l && h, u = !l && !h, !y && p ? (c.queueTrigger(r.backward), o[c.group.id] = c.group) : !y && u ? (c.queueTrigger(r.forward), o[c.group.id] = c.group) : y && r.oldScroll >= c.triggerPoint && (c.queueTrigger(r.forward), o[c.group.id] = c.group)
            }
        }
        for (var g in o) o[g].flushTriggers();
        return this
    }, e.findOrCreateByElement = function(t) {
        return e.findByElement(t) || new e(t)
    }, e.refreshAll = function() {
        for (var t in o) o[t].refresh()
    }, e.findByElement = function(t) {
        return o[t.waypointContextKey]
    }, window.onload = function() {
        r && r(), e.refreshAll()
    }, n.requestAnimationFrame = function(e) {
        var i = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || t;
        i.call(window, e)
    }, n.Context = e
}(),
function() {
    "use strict";

    function t(t, e) {
        return t.triggerPoint - e.triggerPoint
    }

    function e(t, e) {
        return e.triggerPoint - t.triggerPoint
    }

    function i(t) {
        this.name = t.name, this.axis = t.axis, this.id = this.name + "-" + this.axis, this.waypoints = [], this.clearTriggerQueues(), o[this.axis][this.name] = this
    }
    var o = {
            vertical: {},
            horizontal: {}
        },
        n = window.Waypoint;
    i.prototype.add = function(t) {
        this.waypoints.push(t)
    }, i.prototype.clearTriggerQueues = function() {
        this.triggerQueues = {
            up: [],
            down: [],
            left: [],
            right: []
        }
    }, i.prototype.flushTriggers = function() {
        for (var i in this.triggerQueues) {
            var o = this.triggerQueues[i],
                n = "up" === i || "left" === i;
            o.sort(n ? e : t);
            for (var r = 0, s = o.length; s > r; r += 1) {
                var a = o[r];
                (a.options.continuous || r === o.length - 1) && a.trigger([i])
            }
        }
        this.clearTriggerQueues()
    }, i.prototype.next = function(e) {
        this.waypoints.sort(t);
        var i = n.Adapter.inArray(e, this.waypoints),
            o = i === this.waypoints.length - 1;
        return o ? null : this.waypoints[i + 1]
    }, i.prototype.previous = function(e) {
        this.waypoints.sort(t);
        var i = n.Adapter.inArray(e, this.waypoints);
        return i ? this.waypoints[i - 1] : null
    }, i.prototype.queueTrigger = function(t, e) {
        this.triggerQueues[e].push(t)
    }, i.prototype.remove = function(t) {
        var e = n.Adapter.inArray(t, this.waypoints);
        e > -1 && this.waypoints.splice(e, 1)
    }, i.prototype.first = function() {
        return this.waypoints[0]
    }, i.prototype.last = function() {
        return this.waypoints[this.waypoints.length - 1]
    }, i.findOrCreate = function(t) {
        return o[t.axis][t.name] || new i(t)
    }, n.Group = i
}(),
function() {
    "use strict";

    function t(t) {
        this.$element = e(t)
    }
    var e = window.jQuery,
        i = window.Waypoint;
    e.each(["innerHeight", "innerWidth", "off", "offset", "on", "outerHeight", "outerWidth", "scrollLeft", "scrollTop"], function(e, i) {
        t.prototype[i] = function() {
            var t = Array.prototype.slice.call(arguments);
            return this.$element[i].apply(this.$element, t)
        }
    }), e.each(["extend", "inArray", "isEmptyObject"], function(i, o) {
        t[o] = e[o]
    }), i.adapters.push({
        name: "jquery",
        Adapter: t
    }), i.Adapter = t
}(),
function() {
    "use strict";

    function t(t) {
        return function() {
            var i = [],
                o = arguments[0];
            return t.isFunction(arguments[0]) && (o = t.extend({}, arguments[1]), o.handler = arguments[0]), this.each(function() {
                var n = t.extend({}, o, {
                    element: this
                });
                "string" == typeof n.context && (n.context = t(this).closest(n.context)[0]), i.push(new e(n))
            }), i
        }
    }
    var e = window.Waypoint;
    window.jQuery && (window.jQuery.fn.waypoint = t(window.jQuery)), window.Zepto && (window.Zepto.fn.waypoint = t(window.Zepto))
}();
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame']
    }
    if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() {
            callback(currTime + timeToCall)
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id
    };
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
        clearTimeout(id)
    }
}());
jQuery.expr[':'].regex = function(elem, index, match) {
    var matchParams = match[3].split(','),
        validLabels = /^(data|css):/,
        attr = {
            method: matchParams[0].match(validLabels) ? matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels, '')
        },
        regexFlags = 'ig',
        regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g, ''), regexFlags);
    return regex.test(jQuery(elem)[attr.method](attr.property));
};
(function($) {
    "use strict";
    $(document).ready(function() {
        $.avia_utilities = $.avia_utilities || {};
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && 'ontouchstart' in document.documentElement) {
            $.avia_utilities.isMobile = true;
        } else {
            $.avia_utilities.isMobile = false;
        }
        if ($.fn.avia_mobile_fixed)
            $('.avia-bg-style-fixed').avia_mobile_fixed();
        if ($.fn.avia_parallax)
            $('.av-parallax').avia_parallax();
        if ($.fn.avia_browser_height)
            $('.av-minimum-height, .avia-fullscreen-slider, .av-cell-min-height').avia_browser_height();
        if ($.fn.avia_video_section)
            $('.av-section-with-video-bg').avia_video_section();
        new $.AviaTooltip({
            'class': "avia-tooltip",
            data: "avia-tooltip",
            delay: 0,
            scope: "body"
        });
        new $.AviaTooltip({
            'class': "avia-tooltip avia-icon-tooltip",
            data: "avia-icon-tooltip",
            delay: 0,
            scope: "body"
        });
        $.avia_utilities.activate_shortcode_scripts();
        if ($.fn.layer_slider_height_helper)
            $('.avia-layerslider').layer_slider_height_helper();
        if ($.fn.avia_portfolio_preview) {
            $('.grid-links-ajax').avia_portfolio_preview();
        }
        if ($.fn.avia_masonry)
            $('.av-masonry').avia_masonry();
        if ($.fn.aviaccordion)
            $('.aviaccordion').aviaccordion();
        if ($.fn.avia_textrotator)
            $('.av-rotator-container').avia_textrotator();
        if ($.fn.avia_sc_tab_section) {
            $('.av-tab-section-container').avia_sc_tab_section();
        }
        if ($.fn.avia_hor_gallery) {
            $('.av-horizontal-gallery').avia_hor_gallery();
        }
        if ($.fn.avia_link_column) {
            $('.avia-link-column').avia_link_column();
        }
        if ($.fn.avia_delayed_animation_in_container) {
            $('.av-animation-delay-container').avia_delayed_animation_in_container();
        }
    });
    $.avia_utilities = $.avia_utilities || {};
    $.avia_utilities.activate_shortcode_scripts = function(container) {
        if (typeof container == 'undefined') {
            container = 'body';
        }
        if ($.fn.avia_ajax_form) {
            $('.avia_ajax_form:not( .avia-disable-default-ajax )', container).avia_ajax_form();
        }
        activate_waypoints(container);
        if ($.fn.aviaVideoApi) {
            $('.avia-slideshow iframe[src*="youtube.com"], .av_youtube_frame, .av_vimeo_frame, .avia-slideshow video').aviaVideoApi({}, 'li');
        }
        if ($.fn.avia_sc_toggle) {
            $('.togglecontainer', container).avia_sc_toggle();
        }
        if ($.fn.avia_sc_tabs) {
            $('.top_tab', container).avia_sc_tabs();
            $('.sidebar_tab', container).avia_sc_tabs({
                sidebar: true
            });
        }
        if ($.fn.avia_sc_gallery) {
            $('.avia-gallery', container).avia_sc_gallery();
        }
        if ($.fn.avia_sc_animated_number) {
            $('.avia-animated-number', container).avia_sc_animated_number();
        }
        if ($.fn.avia_sc_animation_delayed) {
            $('.av_font_icon', container).avia_sc_animation_delayed({
                delay: 100
            });
            $('.avia-image-container', container).avia_sc_animation_delayed({
                delay: 100
            });
            $('.av-hotspot-image-container', container).avia_sc_animation_delayed({
                delay: 100
            });
            $('.av-animated-generic', container).avia_sc_animation_delayed({
                delay: 100
            });
        }
        if ($.fn.avia_sc_iconlist) {
            $('.avia-icon-list.av-iconlist-big.avia-iconlist-animate', container).avia_sc_iconlist();
        }
        if ($.fn.avia_sc_progressbar) {
            $('.avia-progress-bar-container', container).avia_sc_progressbar();
        }
        if ($.fn.avia_sc_testimonial) {
            $('.avia-testimonial-wrapper', container).avia_sc_testimonial();
        }
        if ($.fn.aviaFullscreenSlider) {
            $('.avia-slideshow.av_fullscreen', container).aviaFullscreenSlider();
        }
        if ($.fn.aviaSlider) {
            $('.avia-slideshow:not(.av_fullscreen)', container).aviaSlider();
            $('.avia-content-slider-active', container).aviaSlider({
                wrapElement: '.avia-content-slider-inner',
                slideElement: '.slide-entry-wrap',
                fullfade: true
            });
            $('.avia-slider-testimonials', container).aviaSlider({
                wrapElement: '.avia-testimonial-row',
                slideElement: '.avia-testimonial',
                fullfade: true
            });
        }
        if ($.fn.aviaMagazine) {
            $('.av-magazine-tabs-active', container).aviaMagazine();
        }
        if ($.fn.aviaHotspots) {
            $('.av-hotspot-image-container', container).aviaHotspots();
        }
        if ($.fn.aviaCountdown) {
            $('.av-countdown-timer', container).aviaCountdown();
        }
        if ($.fn.aviaPlayer) {
            $('.av-player', container).aviaPlayer();
        }
    }

    function activate_waypoints(container) {
        if ($.fn.avia_waypoints) {
            if (typeof container == 'undefined') {
                container = 'body';
            };
            $('.avia_animate_when_visible', container).avia_waypoints();
            $('.avia_animate_when_almost_visible', container).avia_waypoints({
                offset: '80%'
            });
            if (container == 'body') container = '.avia_desktop body';
            $('.av-animated-generic', container).avia_waypoints({
                offset: '95%'
            });
        }
    }
    $.AviaParallaxElement = function(options, element) {
        this.$el = $(element).addClass('active-parallax');
        this.$win = $(window);
        this.$body = $('body');
        this.$parent = this.$el.parent();
        this.property = {};
        this.isMobile = $.avia_utilities.isMobile;
        this.ratio = this.$el.data('avia-parallax-ratio') || 0.5;
        this.transform = document.documentElement.className.indexOf('avia_transform') !== -1 ? true : false;
        this.transform3d = document.documentElement.className.indexOf('avia_transform3d') !== -1 ? true : false;
        this.ticking = false;
        if ($.avia_utilities.supported.transition === undefined) {
            $.avia_utilities.supported.transition = $.avia_utilities.supports('transition');
        }
        this._init(options);
    }
    $.AviaParallaxElement.prototype = {
        _init: function(options) {
            var _self = this;
            if (_self.isMobile) {
                return;
            }
            setTimeout(function() {
                _self._fetch_properties();
            }, 30);
            this.$win.on("debouncedresize av-height-change", $.proxy(_self._fetch_properties, _self));
            this.$body.on("av_resize_finished", $.proxy(_self._fetch_properties, _self));
            setTimeout(function() {
                _self.$win.on('scroll', $.proxy(_self._on_scroll, _self));
            }, 100);
        },
        _fetch_properties: function() {
            this.property.offset = this.$parent.offset().top;
            this.property.wh = this.$win.height();
            this.property.height = this.$parent.outerHeight();
            this.$el.height(Math.ceil((this.property.wh * this.ratio) + this.property.height));
            this._parallax_scroll();
        },
        _on_scroll: function(e) {
            var _self = this;
            if (!_self.ticking) {
                _self.ticking = true;
                window.requestAnimationFrame($.proxy(_self._parallax_scroll, _self));
            }
        },
        _parallax_scroll: function(e) {
            var winTop = this.$win.scrollTop(),
                winBottom = winTop + this.property.wh,
                scrollPos = "0",
                prop = {};
            if (this.property.offset < winBottom && winTop <= this.property.offset + this.property.height) {
                scrollPos = Math.ceil((winBottom - this.property.offset) * this.ratio);
                if (this.transform3d) {
                    prop[$.avia_utilities.supported.transition + "transform"] = "translate3d(0px," + scrollPos + "px, 0px)";
                } else if (this.transform) {
                    prop[$.avia_utilities.supported.transition + "transform"] = "translate(0px," + scrollPos + "px)";
                } else {
                    prop["background-position"] = "0px " + scrollPos + "px";
                }
                this.$el.css(prop);
            }
            this.ticking = false;
        }
    };
    $.fn.avia_parallax = function(options) {
        return this.each(function() {
            var self = $.data(this, 'aviaParallax');
            if (!self) {
                self = $.data(this, 'aviaParallax', new $.AviaParallaxElement(options, this));
            }
        });
    }
    $.fn.avia_mobile_fixed = function(options) {
        var isMobile = $.avia_utilities.isMobile;
        if (!isMobile) return;
        return this.each(function() {
            var current = $(this).addClass('av-parallax-section'),
                $background = current.attr('style'),
                $attachment_class = current.data('section-bg-repeat'),
                template = "";
            if ($attachment_class == 'stretch' || $attachment_class == 'no-repeat') {
                $attachment_class = " avia-full-stretch";
            } else {
                $attachment_class = "";
            }
            template = "<div class='av-parallax " + $attachment_class + "' data-avia-parallax-ratio='0.0' style = '" + $background + "' ></div>";
            current.prepend(template);
            current.attr('style', '');
        });
    }
    $.fn.avia_sc_animation_delayed = function(options) {
        var global_timer = 0,
            delay = options.delay || 50,
            max_timer = 10,
            new_max = setTimeout(function() {
                max_timer = 20;
            }, 500);
        return this.each(function() {
            var elements = $(this);
            elements.on('avia_start_animation', function() {
                var element = $(this);
                if (global_timer < max_timer) global_timer++;
                setTimeout(function() {
                    element.addClass('avia_start_delayed_animation');
                    if (global_timer > 0) global_timer--;
                }, (global_timer * delay));
            });
        });
    }
    $.fn.avia_delayed_animation_in_container = function(options) {
        return this.each(function() {
            var elements = $(this);
            elements.on('avia_start_animation_if_current_slide_is_active', function() {
                var current = $(this),
                    animate = current.find('.avia_start_animation_when_active');
                animate.addClass('avia_start_animation').trigger('avia_start_animation');
            });
            elements.on('avia_remove_animation', function() {
                var current = $(this),
                    animate = current.find('.avia_start_animation_when_active, .avia_start_animation');
                animate.removeClass('avia_start_animation avia_start_delayed_animation');
            });
        });
    }
    $.fn.avia_browser_height = function() {
        if (!this.length) return;
        var win = $(window),
            html_el = $('html'),
            subtract = $('#wpadminbar, #header.av_header_top:not(.html_header_transparency #header), #main>.title_container'),
            css_block = $("<style type='text/css' id='av-browser-height'></style>").appendTo('head:first'),
            sidebar_menu = $('.html_header_sidebar #top #header_main'),
            full_slider = $('.html_header_sidebar .avia-fullscreen-slider.avia-builder-el-0.avia-builder-el-no-sibling').addClass('av-solo-full'),
            calc_height = function() {
                var css = "",
                    wh100 = win.height(),
                    ww100 = win.width(),
                    wh100_mod = wh100,
                    whCover = (wh100 / 9) * 16,
                    wwCover = (ww100 / 16) * 9,
                    wh75 = Math.round(wh100 * 0.75),
                    wh50 = Math.round(wh100 * 0.5),
                    wh25 = Math.round(wh100 * 0.25),
                    solo = 0;
                if (sidebar_menu.length) solo = sidebar_menu.height();
                subtract.each(function() {
                    wh100_mod -= this.offsetHeight - 1;
                });
                var whCoverMod = (wh100_mod / 9) * 16;
                css += ".avia-section.av-minimum-height .container{opacity: 1; }\n";
                css += ".av-minimum-height-100 .container, .avia-fullscreen-slider .avia-slideshow, #top.avia-blank .av-minimum-height-100 .container, .av-cell-min-height-100 > .flex_cell{height:" + wh100 + "px;}\n";
                css += ".av-minimum-height-75 .container, .av-cell-min-height-75 > .flex_cell {height:" + wh75 + "px;}\n";
                css += ".av-minimum-height-50 .container, .av-cell-min-height-50 > .flex_cell {height:" + wh50 + "px;}\n";
                css += ".av-minimum-height-25 .container, .av-cell-min-height-25 > .flex_cell {height:" + wh25 + "px;}\n";
                css += ".avia-builder-el-0.av-minimum-height-100 .container, .avia-builder-el-0.avia-fullscreen-slider .avia-slideshow, .avia-builder-el-0.av-cell-min-height-100 > .flex_cell{height:" + wh100_mod + "px;}\n";
                css += "#top .av-solo-full .avia-slideshow {min-height:" + solo + "px;}\n";
                if (ww100 / wh100 < 16 / 9) {
                    css += "#top .av-element-cover iframe, #top .av-element-cover embed, #top .av-element-cover object, #top .av-element-cover video{width:" + whCover + "px; left: -" + (whCover - ww100) / 2 + "px;}\n";
                } else {
                    css += "#top .av-element-cover iframe, #top .av-element-cover embed, #top .av-element-cover object, #top .av-element-cover video{height:" + wwCover + "px; top: -" + (wwCover - wh100) / 2 + "px;}\n";
                }
                if (ww100 / wh100_mod < 16 / 9) {
                    css += "#top .avia-builder-el-0 .av-element-cover iframe, #top .avia-builder-el-0 .av-element-cover embed, #top .avia-builder-el-0 .av-element-cover object, #top .avia-builder-el-0 .av-element-cover video{width:" + whCoverMod + "px; left: -" + (whCoverMod - ww100) / 2 + "px;}\n";
                } else {
                    css += "#top .avia-builder-el-0 .av-element-cover iframe, #top .avia-builder-el-0 .av-element-cover embed, #top .avia-builder-el-0 .av-element-cover object, #top .avia-builder-el-0 .av-element-cover video{height:" + wwCover + "px; top: -" + (wwCover - wh100_mod) / 2 + "px;}\n";
                }
                try {
                    css_block.text(css);
                } catch (err) {
                    css_block.remove();
                    css_block = $("<style type='text/css' id='av-browser-height'>" + css + "</style>").appendTo('head:first');
                }
                setTimeout(function() {
                    win.trigger('av-height-change');
                }, 100);
            };
        win.on('debouncedresize', calc_height);
        calc_height();
    }
    $.fn.avia_video_section = function() {
        if (!this.length) return;
        var elements = this.length,
            content = "",
            win = $(window),
            css_block = $("<style type='text/css' id='av-section-height'></style>").appendTo('head:first'),
            calc_height = function(section, counter) {
                if (counter === 0) {
                    content = "";
                }
                var css = "",
                    the_id = '#' + section.attr('id'),
                    wh100 = section.height(),
                    ww100 = section.width(),
                    aspect = section.data('sectionVideoRatio').split(':'),
                    video_w = aspect[0],
                    video_h = aspect[1],
                    whCover = (wh100 / video_h) * video_w,
                    wwCover = (ww100 / video_w) * video_h;
                if (ww100 / wh100 < video_w / video_h) {
                    css += "#top " + the_id + " .av-section-video-bg iframe, #top " + the_id + " .av-section-video-bg embed, #top " + the_id + " .av-section-video-bg object, #top " + the_id + " .av-section-video-bg video{width:" + whCover + "px; left: -" + (whCover - ww100) / 2 + "px;}\n";
                } else {
                    css += "#top " + the_id + " .av-section-video-bg iframe, #top " + the_id + " .av-section-video-bg embed, #top " + the_id + " .av-section-video-bg object, #top " + the_id + " .av-section-video-bg video{height:" + wwCover + "px; top: -" + (wwCover - wh100) / 2 + "px;}\n";
                }
                content = content + css;
                if (elements == counter + 1) {
                    try {
                        css_block.text(content);
                    } catch (err) {
                        css_block.remove();
                        css_block = $("<style type='text/css' id='av-section-height'>" + content + "</style>").appendTo('head:first');
                    }
                }
            };
        return this.each(function(i) {
            var self = $(this);
            win.on('debouncedresize', function() {
                calc_height(self, i);
            });
            calc_height(self, i);
        });
    }
    $.fn.avia_link_column = function() {
        return this.each(function() {
            $(this).on('click', function(e) {
                if ('undefined' !== typeof e.target && 'undefined' !== typeof e.target.href) {
                    return;
                }
                var column = $(this),
                    url = column.data('link-column-url'),
                    target = column.data('link-column-target'),
                    link = window.location.hostname + window.location.pathname;
                if ('undefined' === typeof url || 'string' !== typeof url) {
                    return;
                }
                if ('undefined' !== typeof target || '_blank' == target) {
                    window.open(url, '_blank');
                } else {
                    if (column.hasClass('av-cell-link') || column.hasClass('av-column-link')) {
                        var reader = column.hasClass('av-cell-link') ? column.prev('a.av-screen-reader-only').first() : column.find('a.av-screen-reader-only').first();
                        url = url.trim();
                        if ((0 == url.indexOf("#")) || ((url.indexOf(link) >= 0) && (url.indexOf("#") > 0))) {
                            reader.trigger('click');
                            return;
                        }
                    }
                    window.location.href = url;
                }
                e.preventDefault();
                return;
            });
        });
    };
    $.fn.avia_waypoints = function(options_passed) {
        if (!$('html').is('.avia_transform')) return;
        var defaults = {
                offset: 'bottom-in-view',
                triggerOnce: true
            },
            options = $.extend({}, defaults, options_passed),
            isMobile = $.avia_utilities.isMobile;
        return this.each(function() {
            var element = $(this);
            setTimeout(function() {
                if (isMobile) {
                    element.addClass('avia_start_animation').trigger('avia_start_animation');
                } else {
                    element.waypoint(function(direction) {
                        var current = $(this.element),
                            parent = current.parents('.av-animation-delay-container:eq(0)');
                        if (parent.length) {
                            current.addClass('avia_start_animation_when_active').trigger('avia_start_animation_when_active');
                        }
                        if (!parent.length || (parent.length && parent.is('.__av_init_open'))) {
                            current.addClass('avia_start_animation').trigger('avia_start_animation');
                        }
                    }, options);
                }
            }, 100)
        });
    };
    var $event = $.event,
        $special, resizeTimeout;
    $special = $event.special.debouncedresize = {
        setup: function() {
            $(this).on("resize", $special.handler);
        },
        teardown: function() {
            $(this).off("resize", $special.handler);
        },
        handler: function(event, execAsap) {
            var context = this,
                args = arguments,
                dispatch = function() {
                    event.type = "debouncedresize";
                    $event.dispatch.apply(context, args);
                };
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            execAsap ? dispatch() : resizeTimeout = setTimeout(dispatch, $special.threshold);
        },
        threshold: 150
    };
    $.easing['jswing'] = $.easing['swing'];
    $.extend($.easing, {
        def: 'easeOutQuad',
        swing: function(x, t, b, c, d) {
            return $.easing[$.easing.def](x, t, b, c, d);
        },
        easeInQuad: function(x, t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOutQuad: function(x, t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        easeInOutQuad: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        },
        easeInCubic: function(x, t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOutCubic: function(x, t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        easeInOutCubic: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        },
        easeInQuart: function(x, t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },
        easeOutQuart: function(x, t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        easeInOutQuart: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        },
        easeInQuint: function(x, t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOutQuint: function(x, t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        easeInOutQuint: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        },
        easeInSine: function(x, t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        easeOutSine: function(x, t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        easeInOutSine: function(x, t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        },
        easeInExpo: function(x, t, b, c, d) {
            return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        easeOutExpo: function(x, t, b, c, d) {
            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
        easeInOutExpo: function(x, t, b, c, d) {
            if (t == 0) return b;
            if (t == d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },
        easeInCirc: function(x, t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOutCirc: function(x, t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        easeInOutCirc: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        },
        easeInElastic: function(x, t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        easeOutElastic: function(x, t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
        },
        easeInOutElastic: function(x, t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d / 2) == 2) return b + c;
            if (!p) p = d * (.3 * 1.5);
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
        },
        easeInBack: function(x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOutBack: function(x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOutBack: function(x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        },
        easeInBounce: function(x, t, b, c, d) {
            return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
        },
        easeOutBounce: function(x, t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        },
        easeInOutBounce: function(x, t, b, c, d) {
            if (t < d / 2) return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
            return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
    });
})(jQuery);
(function($) {
    "use strict";
    $.avia_utilities = $.avia_utilities || {};
    $.avia_utilities.loading = function(attach_to, delay) {
        var loader = {
            active: false,
            show: function() {
                if (loader.active === false) {
                    loader.active = true;
                    loader.loading_item.css({
                        display: 'block',
                        opacity: 0
                    });
                }
                loader.loading_item.stop().animate({
                    opacity: 1
                });
            },
            hide: function() {
                if (typeof delay === 'undefined') {
                    delay = 600;
                }
                loader.loading_item.stop().delay(delay).animate({
                    opacity: 0
                }, function() {
                    loader.loading_item.css({
                        display: 'none'
                    });
                    loader.active = false;
                });
            },
            attach: function() {
                if (typeof attach_to === 'undefined') {
                    attach_to = 'body';
                }
                loader.loading_item = $('<div class="avia_loading_icon"><div class="av-siteloader"></div></div>').css({
                    display: "none"
                }).appendTo(attach_to);
            }
        }
        loader.attach();
        return loader;
    };
    $.avia_utilities.playpause = function(attach_to, delay) {
        var pp = {
            active: false,
            to1: "",
            to2: "",
            set: function(status) {
                pp.loading_item.removeClass('av-play av-pause');
                pp.to1 = setTimeout(function() {
                    pp.loading_item.addClass('av-' + status);
                }, 10);
                pp.to2 = setTimeout(function() {
                    pp.loading_item.removeClass('av-' + status);
                }, 1500);
            },
            attach: function() {
                if (typeof attach_to === 'undefined') {
                    attach_to = 'body';
                }
                pp.loading_item = $('<div class="avia_playpause_icon"></div>').css({
                    display: "none"
                }).appendTo(attach_to);
            }
        }
        pp.attach();
        return pp;
    };
    $.avia_utilities.preload = function(options_passed) {
        new $.AviaPreloader(options_passed);
    }
    $.AviaPreloader = function(options) {
        this.win = $(window);
        this.defaults = {
            container: 'body',
            maxLoops: 10,
            trigger_single: true,
            single_callback: function() {},
            global_callback: function() {}
        };
        this.options = $.extend({}, this.defaults, options);
        this.preload_images = 0;
        this.load_images();
    }
    $.AviaPreloader.prototype = {
        load_images: function() {
            var _self = this;
            if (typeof _self.options.container === 'string') {
                _self.options.container = $(_self.options.container);
            }
            _self.options.container.each(function() {
                var container = $(this);
                container.images = container.find('img');
                container.allImages = container.images;
                _self.preload_images += container.images.length;
                setTimeout(function() {
                    _self.checkImage(container);
                }, 10);
            });
        },
        checkImage: function(container) {
            var _self = this;
            container.images.each(function() {
                if (this.complete === true) {
                    container.images = container.images.not(this);
                    _self.preload_images -= 1;
                }
            });
            if (container.images.length && _self.options.maxLoops >= 0) {
                _self.options.maxLoops -= 1;
                setTimeout(function() {
                    _self.checkImage(container);
                }, 500);
            } else {
                _self.preload_images = _self.preload_images - container.images.length;
                _self.trigger_loaded(container);
            }
        },
        trigger_loaded: function(container) {
            var _self = this;
            if (_self.options.trigger_single !== false) {
                _self.win.trigger('avia_images_loaded_single', [container]);
                _self.options.single_callback.call(container);
            }
            if (_self.preload_images === 0) {
                _self.win.trigger('avia_images_loaded');
                _self.options.global_callback.call();
            }
        }
    }
    $.avia_utilities.css_easings = {
        linear: 'linear',
        swing: 'ease-in-out',
        bounce: 'cubic-bezier(0.0, 0.35, .5, 1.3)',
        easeInQuad: 'cubic-bezier(0.550, 0.085, 0.680, 0.530)',
        easeInCubic: 'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
        easeInQuart: 'cubic-bezier(0.895, 0.030, 0.685, 0.220)',
        easeInQuint: 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
        easeInSine: 'cubic-bezier(0.470, 0.000, 0.745, 0.715)',
        easeInExpo: 'cubic-bezier(0.950, 0.050, 0.795, 0.035)',
        easeInCirc: 'cubic-bezier(0.600, 0.040, 0.980, 0.335)',
        easeInBack: 'cubic-bezier(0.600, -0.280, 0.735, 0.04)',
        easeOutQuad: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
        easeOutCubic: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
        easeOutQuart: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
        easeOutQuint: 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
        easeOutSine: 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
        easeOutExpo: 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
        easeOutCirc: 'cubic-bezier(0.075, 0.820, 0.165, 1.000)',
        easeOutBack: 'cubic-bezier(0.175, 0.885, 0.320, 1.275)',
        easeInOutQuad: 'cubic-bezier(0.455, 0.030, 0.515, 0.955)',
        easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
        easeInOutQuart: 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
        easeInOutQuint: 'cubic-bezier(0.860, 0.000, 0.070, 1.000)',
        easeInOutSine: 'cubic-bezier(0.445, 0.050, 0.550, 0.950)',
        easeInOutExpo: 'cubic-bezier(1.000, 0.000, 0.000, 1.000)',
        easeInOutCirc: 'cubic-bezier(0.785, 0.135, 0.150, 0.860)',
        easeInOutBack: 'cubic-bezier(0.680, -0.550, 0.265, 1.55)',
        easeInOutBounce: 'cubic-bezier(0.580, -0.365, 0.490, 1.365)',
        easeOutBounce: 'cubic-bezier(0.760, 0.085, 0.490, 1.365)'
    };
    $.avia_utilities.supported = {};
    $.avia_utilities.supports = (function() {
        var div = document.createElement('div'),
            vendors = ['Khtml', 'Ms', 'Moz', 'Webkit'];
        return function(prop, vendor_overwrite) {
            if (div.style[prop] !== undefined) {
                return "";
            }
            if (vendor_overwrite !== undefined) {
                vendors = vendor_overwrite;
            }
            prop = prop.replace(/^[a-z]/, function(val) {
                return val.toUpperCase();
            });
            var len = vendors.length;
            while (len--) {
                if (div.style[vendors[len] + prop] !== undefined) {
                    return "-" + vendors[len].toLowerCase() + "-";
                }
            }
            return false;
        };
    }());
    $.fn.avia_animate = function(prop, speed, easing, callback) {
        if (typeof speed === 'function') {
            callback = speed;
            speed = false;
        }
        if (typeof easing === 'function') {
            callback = easing;
            easing = false;
        }
        if (typeof speed === 'string') {
            easing = speed;
            speed = false;
        }
        if (callback === undefined || callback === false) {
            callback = function() {};
        }
        if (easing === undefined || easing === false) {
            easing = 'easeInQuad';
        }
        if (speed === undefined || speed === false) {
            speed = 400;
        }
        if ($.avia_utilities.supported.transition === undefined) {
            $.avia_utilities.supported.transition = $.avia_utilities.supports('transition');
        }
        if ($.avia_utilities.supported.transition !== false) {
            var prefix = $.avia_utilities.supported.transition + 'transition',
                cssRule = {},
                cssProp = {},
                thisStyle = document.body.style,
                end = (thisStyle.WebkitTransition !== undefined) ? 'webkitTransitionEnd' : (thisStyle.OTransition !== undefined) ? 'oTransitionEnd' : 'transitionend';
            easing = $.avia_utilities.css_easings[easing];
            cssRule[prefix] = 'all ' + (speed / 1000) + 's ' + easing;
            end = end + ".avia_animate";
            for (var rule in prop) {
                if (prop.hasOwnProperty(rule)) {
                    cssProp[rule] = prop[rule];
                }
            }
            prop = cssProp;
            this.each(function() {
                var element = $(this),
                    css_difference = false,
                    rule, current_css;
                for (rule in prop) {
                    if (prop.hasOwnProperty(rule)) {
                        current_css = element.css(rule);
                        if (prop[rule] != current_css && prop[rule] != current_css.replace(/px|%/g, "")) {
                            css_difference = true;
                            break;
                        }
                    }
                }
                if (css_difference) {
                    if (!($.avia_utilities.supported.transition + "transform" in prop)) {
                        prop[$.avia_utilities.supported.transition + "transform"] = "translateZ(0)";
                    }
                    var endTriggered = false;
                    element.on(end, function(event) {
                        if (event.target != event.currentTarget) return false;
                        if (endTriggered == true) return false;
                        endTriggered = true;
                        cssRule[prefix] = "none";
                        element.off(end);
                        element.css(cssRule);
                        setTimeout(function() {
                            callback.call(element);
                        });
                    });
                    setTimeout(function() {
                        if (!endTriggered && !avia_is_mobile && $('html').is('.avia-safari')) {
                            element.trigger(end);
                            $.avia_utilities.log('Safari Fallback ' + end + ' trigger');
                        }
                    }, speed + 100);
                    setTimeout(function() {
                        element.css(cssRule);
                    }, 10);
                    setTimeout(function() {
                        element.css(prop);
                    }, 20);
                } else {
                    setTimeout(function() {
                        callback.call(element);
                    });
                }
            });
        } else {
            this.animate(prop, speed, easing, callback);
        }
        return this;
    };
})(jQuery);
(function($) {
    "use strict";
    $.fn.avia_keyboard_controls = function(options_passed) {
        var defaults = {
                37: '.prev-slide',
                39: '.next-slide'
            },
            methods = {
                mousebind: function(slider) {
                    slider.hover(function() {
                        slider.mouseover = true;
                    }, function() {
                        slider.mouseover = false;
                    });
                },
                keybind: function(slider) {
                    $(document).keydown(function(e) {
                        if (slider.mouseover && typeof slider.options[e.keyCode] !== 'undefined') {
                            var item;
                            if (typeof slider.options[e.keyCode] === 'string') {
                                item = slider.find(slider.options[e.keyCode]);
                            } else {
                                item = slider.options[e.keyCode];
                            }
                            if (item.length) {
                                item.trigger('click', ['keypress']);
                                return false;
                            }
                        }
                    });
                }
            };
        return this.each(function() {
            var slider = $(this);
            slider.options = $.extend({}, defaults, options_passed);
            slider.mouseover = false;
            methods.mousebind(slider);
            methods.keybind(slider);
        });
    };
    $.fn.avia_swipe_trigger = function(passed_options) {
        var win = $(window),
            isMobile = $.avia_utilities.isMobile,
            defaults = {
                prev: '.prev-slide',
                next: '.next-slide',
                event: {
                    prev: 'click',
                    next: 'click'
                }
            },
            methods = {
                activate_touch_control: function(slider) {
                    var i, differenceX, differenceY;
                    slider.touchPos = {};
                    slider.hasMoved = false;
                    slider.on('touchstart', function(event) {
                        slider.touchPos.X = event.originalEvent.touches[0].clientX;
                        slider.touchPos.Y = event.originalEvent.touches[0].clientY;
                    });
                    slider.on('touchend', function(event) {
                        slider.touchPos = {};
                        if (slider.hasMoved) {
                            event.preventDefault();
                        }
                        slider.hasMoved = false;
                    });
                    slider.on('touchmove', function(event) {
                        if (!slider.touchPos.X) {
                            slider.touchPos.X = event.originalEvent.touches[0].clientX;
                            slider.touchPos.Y = event.originalEvent.touches[0].clientY;
                        } else {
                            differenceX = event.originalEvent.touches[0].clientX - slider.touchPos.X;
                            differenceY = event.originalEvent.touches[0].clientY - slider.touchPos.Y;
                            if (Math.abs(differenceX) > Math.abs(differenceY)) {
                                event.preventDefault();
                                if (slider.touchPos !== event.originalEvent.touches[0].clientX) {
                                    if (Math.abs(differenceX) > 50) {
                                        i = differenceX > 0 ? 'prev' : 'next';
                                        if (typeof slider.options[i] === 'string') {
                                            slider.find(slider.options[i]).trigger(slider.options.event[i], ['swipe']);
                                        } else {
                                            slider.options[i].trigger(slider.options.event[i], ['swipe']);
                                        }
                                        slider.hasMoved = true;
                                        slider.touchPos = {};
                                        return false;
                                    }
                                }
                            }
                        }
                    });
                }
            };
        return this.each(function() {
            if (isMobile) {
                var slider = $(this);
                slider.options = $.extend({}, defaults, passed_options);
                methods.activate_touch_control(slider);
            }
        });
    };
}(jQuery));
(function($) {
    "use strict";
    var autostarted = false,
        container = null,
        monitorStart = function(container) {
            var play_pause = container.find('.av-player-player-container .mejs-playpause-button');
            if (play_pause.length == 0) {
                setTimeout(function() {
                    monitorStart(container);
                }, 200);
            }
            if (!play_pause.hasClass('mejs-pause')) {
                play_pause.trigger('click');
            }
        };
    $.fn.aviaPlayer = function(options) {
        if (!this.length) return;
        return this.each(function() {
            var _self = {};
            _self.container = $(this);
            _self.stopLoop = false;
            _self.container.find('audio').on('play', function() {
                if (_self.stopLoop) {
                    this.pause();
                    _self.stopLoop = false;
                }
            });
            if (_self.container.hasClass('avia-playlist-no-loop')) {
                _self.container.find('audio').on('ended', function() {
                    var lastTrack = _self.container.find('.wp-playlist-tracks .wp-playlist-item:last a');
                    if (this.currentSrc === lastTrack.attr('href')) {
                        _self.stopLoop = true;
                    }
                });
            }
            if (_self.container.hasClass('avia-playlist-autoplay') && !autostarted) {
                if ((_self.container.css('display') == 'none') || (_self.container.css("visibility") == "hidden")) {
                    return;
                }
                autostarted = true;
                setTimeout(function() {
                    monitorStart(_self.container, _self);
                }, 200);
            }
        });
    };
}(jQuery));
(function($) {
    $.fn.avia_ajax_form = function(variables) {
        var defaults = {
            sendPath: 'send.php',
            responseContainer: '.ajaxresponse'
        };
        var options = $.extend(defaults, variables);
        return this.each(function() {
            var form = $(this),
                form_sent = false,
                send = {
                    formElements: form.find('textarea, select, input[type=text], input[type=checkbox], input[type=hidden]'),
                    validationError: false,
                    button: form.find('input:submit'),
                    dataObj: {}
                },
                responseContainer = form.next(options.responseContainer + ":eq(0)");
            send.button.on('click', checkElements);
            if ($.avia_utilities.isMobile) {
                send.formElements.each(function(i) {
                    var currentElement = $(this),
                        is_email = currentElement.hasClass('is_email');
                    if (is_email) currentElement.attr('type', 'email');
                });
            }

            function checkElements(e) {
                send.validationError = false;
                send.datastring = 'ajax=true';
                send.formElements.each(function(i) {
                    var currentElement = $(this),
                        surroundingElement = currentElement.parent(),
                        value = currentElement.val(),
                        name = currentElement.attr('name'),
                        classes = currentElement.attr('class'),
                        nomatch = true;
                    if (currentElement.is(':checkbox')) {
                        if (currentElement.is(':checked')) {
                            value = true
                        } else {
                            value = ''
                        }
                    }
                    send.dataObj[name] = encodeURIComponent(value);
                    if (classes && classes.match(/is_empty/)) {
                        if (value == '' || value == null) {
                            surroundingElement.removeClass("valid error ajax_alert").addClass("error");
                            send.validationError = true;
                        } else {
                            surroundingElement.removeClass("valid error ajax_alert").addClass("valid");
                        }
                        nomatch = false;
                    }
                    if (classes && classes.match(/is_email/)) {
                        if (!value.match(/^[\w|\.|\-]+@\w[\w|\.|\-]*\.[a-zA-Z]{2,20}$/)) {
                            surroundingElement.removeClass("valid error ajax_alert").addClass("error");
                            send.validationError = true;
                        } else {
                            surroundingElement.removeClass("valid error ajax_alert").addClass("valid");
                        }
                        nomatch = false;
                    }
                    if (classes && classes.match(/is_ext_email/)) {
                        if (!value.match(/^[\w|\.|\-|Ã„Ã–ÃœÃ¤Ã¶Ã¼]+@\w[\w|\.|\-|Ã„Ã–ÃœÃ¤Ã¶Ã¼]*\.[a-zA-Z]{2,20}$/)) {
                            surroundingElement.removeClass("valid error ajax_alert").addClass("error");
                            send.validationError = true;
                        } else {
                            surroundingElement.removeClass("valid error ajax_alert").addClass("valid");
                        }
                        nomatch = false;
                    }
                    if (classes && classes.match(/is_phone/)) {
                        if (!value.match(/^(\d|\s|\-|\/|\(|\)|\[|\]|e|x|t|ension|\.|\+|\_|\,|\:|\;){3,}$/)) {
                            surroundingElement.removeClass("valid error ajax_alert").addClass("error");
                            send.validationError = true;
                        } else {
                            surroundingElement.removeClass("valid error ajax_alert").addClass("valid");
                        }
                        nomatch = false;
                    }
                    if (classes && classes.match(/is_number/)) {
                        if (!($.isNumeric(value)) || value == "") {
                            surroundingElement.removeClass("valid error ajax_alert").addClass("error");
                            send.validationError = true;
                        } else {
                            surroundingElement.removeClass("valid error ajax_alert").addClass("valid");
                        }
                        nomatch = false;
                    }
                    if (classes && classes.match(/captcha/)) {
                        var verifier = form.find("#" + name + "_verifier").val(),
                            lastVer = verifier.charAt(verifier.length - 1),
                            finalVer = verifier.charAt(lastVer);
                        if (value != finalVer) {
                            surroundingElement.removeClass("valid error ajax_alert").addClass("error");
                            send.validationError = true;
                        } else {
                            surroundingElement.removeClass("valid error ajax_alert").addClass("valid");
                        }
                        nomatch = false;
                    }
                    if (nomatch && value != '') {
                        surroundingElement.removeClass("valid error ajax_alert").addClass("valid");
                    }
                });
                if (send.validationError == false) {
                    if (form.data('av-custom-send')) {
                        mailchimp_send();
                    } else {
                        send_ajax_form();
                    }
                }
                return false;
            }

            function send_ajax_form() {
                if (form_sent) {
                    return false;
                }
                form_sent = true;
                send.button.addClass('av-sending-button');
                send.button.val(send.button.data('sending-label'));
                var redirect_to = form.data('avia-redirect') || false,
                    action = form.attr('action');
                responseContainer.load(action + ' ' + options.responseContainer, send.dataObj, function() {
                    if (redirect_to && action != redirect_to) {
                        form.attr('action', redirect_to);
                        location.href = redirect_to;
                    } else {
                        responseContainer.removeClass('hidden').css({
                            display: "block"
                        });
                        form.slideUp(400, function() {
                            responseContainer.slideDown(400, function() {
                                $('body').trigger('av_resize_finished');
                            });
                            send.formElements.val('');
                        });
                    }
                });
            }

            function mailchimp_send() {
                if (form_sent) {
                    return false;
                }
                form_sent = true;
                var original_label = send.button.val();
                send.button.addClass('av-sending-button');
                send.button.val(send.button.data('sending-label'));
                send.dataObj.ajax_mailchimp = true;
                var redirect_to = form.data('avia-redirect') || false,
                    action = form.attr('action'),
                    error_msg_container = form.find('.av-form-error-container'),
                    form_id = form.data('avia-form-id');
                $.ajax({
                    url: action,
                    type: "POST",
                    data: send.dataObj,
                    beforeSend: function() {
                        if (error_msg_container.length) {
                            error_msg_container.slideUp(400, function() {
                                error_msg_container.remove();
                                $('body').trigger('av_resize_finished');
                            });
                        }
                    },
                    success: function(responseText) {
                        var response = jQuery("<div>").append(jQuery.parseHTML(responseText)),
                            error = response.find('.av-form-error-container');
                        if (error.length) {
                            form_sent = false;
                            form.prepend(error);
                            error.css({
                                display: "none"
                            }).slideDown(400, function() {
                                $('body').trigger('av_resize_finished');
                            });
                            send.button.removeClass('av-sending-button');
                            send.button.val(original_label);
                        } else {
                            if (redirect_to && action != redirect_to) {
                                form.attr('action', redirect_to);
                                location.href = redirect_to;
                            } else {
                                var success_text = response.find(options.responseContainer + "_" + form_id);
                                responseContainer.html(success_text).removeClass('hidden').css({
                                    display: "block"
                                });
                                form.slideUp(400, function() {
                                    responseContainer.slideDown(400, function() {
                                        $('body').trigger('av_resize_finished');
                                    });
                                    send.formElements.val('');
                                });
                            }
                        }
                    },
                    error: function() {},
                    complete: function() {}
                });
            }
        });
    };
})(jQuery);
(function($) {
    "use strict";
    $.AviaSlider = function(options, slider) {
        var self = this;
        this.$win = $(window);
        this.$slider = $(slider);
        this.isMobile = $.avia_utilities.isMobile;
        this._prepareSlides(options);
        $.avia_utilities.preload({
            container: this.$slider,
            single_callback: function() {
                self._init(options);
            }
        });
    }
    $.AviaSlider.defaults = {
        interval: 5,
        autoplay: false,
        stopinfiniteloop: false,
        animation: 'slide',
        transitionSpeed: 900,
        easing: 'easeInOutQuart',
        wrapElement: '>ul',
        slideElement: '>li',
        hoverpause: false,
        bg_slider: false,
        show_slide_delay: 0,
        fullfade: false,
        carousel: 'no',
        carouselSlidesToShow: 3,
        carouselSlidesToScroll: 1,
        carouselResponsive: new Array(),
    };
    $.AviaSlider.prototype = {
        _init: function(options) {
            this.options = this._setOptions(options);
            this.$sliderUl = this.$slider.find(this.options.wrapElement);
            this.$slides = this.$sliderUl.find(this.options.slideElement);
            this.gotoButtons = this.$slider.find('.avia-slideshow-dots a');
            this.permaCaption = this.$slider.find('>.av-slideshow-caption');
            this.itemsCount = this.$slides.length;
            this.current = 0;
            this.currentCarousel = 0;
            this.slideWidthCarousel = '240';
            this.loopCount = 0;
            this.isAnimating = false;
            this.browserPrefix = $.avia_utilities.supports('transition');
            this.cssActive = this.browserPrefix !== false ? true : false;
            this.css3DActive = document.documentElement.className.indexOf('avia_transform3d') !== -1 ? true : false;
            if (this.options.bg_slider == true) {
                this.imageUrls = [];
                this.loader = $.avia_utilities.loading(this.$slider);
                this._bgPreloadImages();
            } else {
                this._kickOff();
            }
            if (this.options.carousel === 'yes') {
                this.options.animation = 'carouselslide';
            }
        },
        _setOptions: function(options) {
            var newOptions = $.extend(true, {}, $.AviaSlider.defaults, options),
                htmlData = this.$slider.data(),
                i = "";
            for (i in htmlData) {
                if (htmlData.hasOwnProperty(i)) {
                    if (typeof htmlData[i] === "string" || typeof htmlData[i] === "number" || typeof htmlData[i] === "boolean") {
                        newOptions[i] = htmlData[i];
                    }
                }
            }
            return newOptions;
        },
        _prepareSlides: function(options) {
            if (this.isMobile) {
                var alter = this.$slider.find('.av-mobile-fallback-image');
                alter.each(function() {
                    var current = $(this).removeClass('av-video-slide').data({
                            'avia_video_events': true,
                            'video-ratio': 0
                        }),
                        fallback = current.data('mobile-img'),
                        fallback_link = current.data('fallback-link'),
                        appendTo = current.find('.avia-slide-wrap');
                    current.find('.av-click-overlay, .mejs-mediaelement, .mejs-container').remove();
                    if (!fallback) {
                        $('<p class="av-fallback-message"><span>Please set a mobile device fallback image for this video in your wordpress backend</span></p>').appendTo(appendTo);
                    }
                    if (options && options.bg_slider) {
                        current.data('img-url', fallback);
                        if (fallback_link != "") {
                            if (appendTo.is('a')) {
                                appendTo.attr('href', fallback_link);
                            } else {
                                appendTo.find('a').remove();
                                appendTo.replaceWith(function() {
                                    var cur_slide = $(this);
                                    return $("<a>").attr({
                                        'data-rel': cur_slide.data('rel'),
                                        'class': cur_slide.attr('class'),
                                        'href': fallback_link
                                    }).append($(this).contents());
                                });
                                appendTo = current.find('.avia-slide-wrap');
                            }
                            if ($.fn.avia_activate_lightbox) {
                                current.parents('#main').avia_activate_lightbox();
                            }
                        }
                    } else {
                        var image = '<img src="' + fallback + '" alt="" title="" />';
                        var lightbox = false;
                        if ('string' == typeof fallback_link && fallback_link.trim() != '') {
                            if (appendTo.is('a')) {
                                appendTo.attr('href', fallback_link);
                            } else {
                                var rel = fallback_link.match(/\.(jpg|jpeg|gif|png)$/i) != null ? ' rel="lightbox" ' : '';
                                image = '<a href="' + fallback_link.trim() + '"' + rel + '>' + image + '</a>';
                            }
                            lightbox = true;
                        }
                        current.find('.avia-slide-wrap').append(image);
                        if (lightbox && $.fn.avia_activate_lightbox) {
                            current.parents('#main').avia_activate_lightbox();
                        }
                    }
                });
            }
        },
        _bgPreloadImages: function(callback) {
            this._getImageURLS();
            this._preloadSingle(0, function() {
                this._kickOff();
                this._preloadNext(1);
            });
        },
        _getImageURLS: function() {
            var _self = this;
            this.$slides.each(function(i) {
                _self.imageUrls[i] = [];
                _self.imageUrls[i]['url'] = $(this).data("img-url");
                if (typeof _self.imageUrls[i]['url'] == 'string') {
                    _self.imageUrls[i]['status'] = false;
                } else {
                    _self.imageUrls[i]['status'] = true;
                }
            });
        },
        _preloadSingle: function(key, callback) {
            var _self = this,
                objImage = new Image();
            if (typeof _self.imageUrls[key]['url'] == 'string') {
                $(objImage).bind('load error', function() {
                    _self.imageUrls[key]['status'] = true;
                    _self.$slides.eq(key).css('background-image', 'url(' + _self.imageUrls[key]['url'] + ')');
                    if (typeof callback == 'function') callback.apply(_self, [objImage, key]);
                });
                if (_self.imageUrls[key]['url'] != "") {
                    objImage.src = _self.imageUrls[key]['url'];
                } else {
                    $(objImage).trigger('error');
                }
            } else {
                if (typeof callback == 'function') callback.apply(_self, [objImage, key]);
            }
        },
        _preloadNext: function(key) {
            if (typeof this.imageUrls[key] != "undefined") {
                this._preloadSingle(key, function() {
                    this._preloadNext(key + 1);
                });
            }
        },
        _bindEvents: function() {
            var self = this,
                win = $(window);
            this.$slider.on('click', '.next-slide', $.proxy(this.next, this));
            this.$slider.on('click', '.prev-slide', $.proxy(this.previous, this));
            this.$slider.on('click', '.goto-slide', $.proxy(this.go2, this));
            if (this.options.hoverpause) {
                this.$slider.on('mouseenter', $.proxy(this.pause, this));
                this.$slider.on('mouseleave', $.proxy(this.resume, this));
            }
            if (this.options.stopinfiniteloop && this.options.autoplay) {
                if (this.options.stopinfiniteloop == 'last') {
                    this.$slider.on('avia_slider_last_slide', $.proxy(this._stopSlideshow, this));
                } else if (this.options.stopinfiniteloop == 'first') {
                    this.$slider.on('avia_slider_first_slide', $.proxy(this._stopSlideshow, this));
                }
            }
            if (this.options.carousel === 'yes') {
                win.on('debouncedresize', $.proxy(this._buildCarousel, this));
            } else {
                win.on('debouncedresize.aviaSlider', $.proxy(this._setSize, this));
            }
            if (!this.isMobile) {
                this.$slider.avia_keyboard_controls();
            } else {
                this.$slider.avia_swipe_trigger();
            }
            self._attach_video_events();
        },
        _kickOff: function() {
            var self = this,
                first_slide = self.$slides.eq(0),
                video = first_slide.data('video-ratio');
            self._bindEvents();
            this.$slider.removeClass('av-default-height-applied');
            if (video) {
                self._setSize(true);
            } else {
                if (this.options.keep_pading != true) {
                    self.$sliderUl.css('padding', 0);
                    self.$win.trigger('av-height-change');
                }
            }
            self._setCenter();
            if (this.options.carousel === 'no') {
                first_slide.css({
                    visibility: 'visible',
                    opacity: 0
                }).avia_animate({
                    opacity: 1
                }, function() {
                    var current = $(this).addClass('active-slide');
                    if (self.permaCaption.length) {
                        self.permaCaption.addClass('active-slide');
                    }
                });
            }
            if (self.options.autoplay) {
                self._startSlideshow();
            }
            if (self.options.carousel === 'yes') {
                self._buildCarousel();
            }
            self.$slider.trigger('_kickOff');
        },
        _buildCarousel: function() {
            var self = this,
                stageWidth = this.$slider.outerWidth(),
                slidesWidth = parseInt(stageWidth / this.options.carouselSlidesToShow),
                windowWidth = window.innerWidth || $(window).width();
            if (this.options.carouselResponsive && this.options.carouselResponsive.length && this.options.carouselResponsive !== null) {
                for (var breakpoint in this.options.carouselResponsive) {
                    var breakpointValue = this.options.carouselResponsive[breakpoint]['breakpoint'];
                    var newSlidesToShow = this.options.carouselResponsive[breakpoint]['settings']['carouselSlidesToShow'];
                    if (breakpointValue >= windowWidth) {
                        slidesWidth = parseInt(stageWidth / newSlidesToShow);
                        this.options.carouselSlidesToShow = newSlidesToShow;
                    }
                }
            }
            this.slideWidthCarousel = slidesWidth;
            this.$slides.each(function(i) {
                $(this).width(slidesWidth);
            });
            var slideTrackWidth = slidesWidth * this.itemsCount;
            this.$sliderUl.width(slideTrackWidth).css('transform', 'translateX(0px)');
            if (this.options.carouselSlidesToShow >= this.itemsCount) {
                this.$slider.find('.av-timeline-nav').hide();
            }
        },
        _navigate: function(dir, pos) {
            if (this.isAnimating || this.itemsCount < 2 || !this.$slider.is(":visible")) {
                return false;
            }
            this.isAnimating = true;
            this.prev = this.current;
            if (pos !== undefined) {
                this.current = pos;
                dir = this.current > this.prev ? 'next' : 'prev';
            } else if (dir === 'next') {
                this.current = this.current < this.itemsCount - 1 ? this.current + 1 : 0;
                if (this.current === 0 && this.options.autoplay_stopper == 1 && this.options.autoplay) {
                    this.isAnimating = false;
                    this.current = this.prev;
                    this._stopSlideshow();
                    return false;
                }
            } else if (dir === 'prev') {
                this.current = this.current > 0 ? this.current - 1 : this.itemsCount - 1;
            }
            this.gotoButtons.removeClass('active').eq(this.current).addClass('active');
            if (this.options.carousel === 'no') {
                this._setSize();
            }
            if (this.options.bg_slider == true) {
                if (this.imageUrls[this.current]['status'] == true) {
                    this['_' + this.options.animation].call(this, dir);
                } else {
                    this.loader.show();
                    this._preloadSingle(this.current, function() {
                        this['_' + this.options.animation].call(this, dir);
                        this.loader.hide();
                    });
                }
            } else {
                this['_' + this.options.animation].call(this, dir);
            }
            if (this.current == 0) {
                this.loopCount++;
                this.$slider.trigger('avia_slider_first_slide');
            } else if (this.current == this.itemsCount - 1) {
                this.$slider.trigger('avia_slider_last_slide');
            } else {
                this.$slider.trigger('avia_slider_navigate_slide');
            }
        },
        _setSize: function(instant) {
            if (this.options.bg_slider == true) return;
            var self = this,
                slide = this.$slides.eq(this.current),
                img = slide.find('img'),
                current = Math.floor(this.$sliderUl.height()),
                ratio = slide.data('video-ratio'),
                setTo = ratio ? this.$sliderUl.width() / ratio : Math.floor(slide.height()),
                video_height = slide.data('video-height'),
                video_toppos = slide.data('video-toppos');
            this.$sliderUl.height(current).css('padding', 0);
            if (setTo != current) {
                if (instant == true) {
                    this.$sliderUl.css({
                        height: setTo
                    });
                    this.$win.trigger('av-height-change');
                } else {
                    this.$sliderUl.avia_animate({
                        height: setTo
                    }, function() {
                        self.$win.trigger('av-height-change');
                    });
                }
            }
            this._setCenter();
            if (video_height && video_height != "set") {
                slide.find('iframe, embed, video, object, .av_youtube_frame').css({
                    height: video_height + '%',
                    top: video_toppos + '%'
                });
                slide.data('video-height', 'set');
            }
        },
        _setCenter: function() {
            var slide = this.$slides.eq(this.current),
                img = slide.find('img'),
                min_width = parseInt(img.css('min-width'), 10),
                slide_width = slide.width(),
                caption = slide.find('.av-slideshow-caption'),
                css_left = ((slide_width - min_width) / 2);
            if (caption.length) {
                if (caption.is('.caption_left')) {
                    css_left = ((slide_width - min_width) / 1.5);
                } else if (caption.is('.caption_right')) {
                    css_left = ((slide_width - min_width) / 2.5);
                }
            }
            if (slide_width >= min_width) {
                css_left = 0;
            }
            img.css({
                left: css_left
            });
        },
        _carouselmove: function() {
            var offset = this.slideWidthCarousel * this.currentCarousel;
            this.$sliderUl.css('transform', 'translateX(-' + offset + 'px)');
        },
        _carouselslide: function(dir) {
            if (dir === 'next') {
                if (this.options.carouselSlidesToShow + this.currentCarousel < this.itemsCount) {
                    this.currentCarousel++;
                    this._carouselmove();
                }
            } else if (dir === 'prev') {
                if (this.currentCarousel > 0) {
                    this.currentCarousel--;
                    this._carouselmove();
                }
            }
            this.isAnimating = false;
        },
        _slide: function(dir) {
            var dynamic = false,
                modifier = dynamic == true ? 2 : 1,
                sliderWidth = this.$slider.width(),
                direction = dir === 'next' ? -1 : 1,
                property = this.browserPrefix + 'transform',
                reset = {},
                transition = {},
                transition2 = {},
                trans_val = (sliderWidth * direction * -1),
                trans_val2 = (sliderWidth * direction) / modifier;
            if (this.cssActive) {
                property = this.browserPrefix + 'transform';
                if (this.css3DActive) {
                    reset[property] = "translate3d(" + trans_val + "px, 0, 0)";
                    transition[property] = "translate3d(" + trans_val2 + "px, 0, 0)";
                    transition2[property] = "translate3d(0,0,0)";
                } else {
                    reset[property] = "translate(" + trans_val + "px,0)";
                    transition[property] = "translate(" + trans_val2 + "px,0)";
                    transition2[property] = "translate(0,0)";
                }
            } else {
                reset.left = trans_val;
                transition.left = trans_val2;
                transition2.left = 0;
            }
            if (dynamic) {
                transition['z-index'] = "1";
                transition2['z-index'] = "2";
            }
            this._slide_animate(reset, transition, transition2);
        },
        _slide_up: function(dir) {
            var dynamic = true,
                modifier = dynamic == true ? 2 : 1,
                sliderHeight = this.$slider.height(),
                direction = dir === 'next' ? -1 : 1,
                property = this.browserPrefix + 'transform',
                reset = {},
                transition = {},
                transition2 = {},
                trans_val = (sliderHeight * direction * -1),
                trans_val2 = (sliderHeight * direction) / modifier;
            if (this.cssActive) {
                property = this.browserPrefix + 'transform';
                if (this.css3DActive) {
                    reset[property] = "translate3d( 0," + trans_val + "px, 0)";
                    transition[property] = "translate3d( 0," + trans_val2 + "px, 0)";
                    transition2[property] = "translate3d(0,0,0)";
                } else {
                    reset[property] = "translate( 0," + trans_val + "px)";
                    transition[property] = "translate( 0," + trans_val2 + "px)";
                    transition2[property] = "translate(0,0)";
                }
            } else {
                reset.top = trans_val;
                transition.top = trans_val2;
                transition2.top = 0;
            }
            if (dynamic) {
                transition['z-index'] = "1";
                transition2['z-index'] = "2";
            }
            this._slide_animate(reset, transition, transition2);
        },
        _slide_animate: function(reset, transition, transition2) {
            var self = this,
                displaySlide = this.$slides.eq(this.current),
                hideSlide = this.$slides.eq(this.prev);
            hideSlide.trigger('pause');
            if (!displaySlide.data('disableAutoplay')) {
                if (displaySlide.hasClass('av-video-lazyload') && !displaySlide.hasClass('av-video-lazyload-complete')) {
                    displaySlide.find('.av-click-to-play-overlay').trigger('click');
                } else {
                    displaySlide.trigger('play');
                }
            }
            displaySlide.css({
                visibility: 'visible',
                zIndex: 4,
                opacity: 1,
                left: 0,
                top: 0
            });
            displaySlide.css(reset);
            hideSlide.avia_animate(transition, this.options.transitionSpeed, this.options.easing);
            var after_slide = function() {
                self.isAnimating = false;
                displaySlide.addClass('active-slide');
                hideSlide.css({
                    visibility: 'hidden'
                }).removeClass('active-slide');
                self.$slider.trigger('avia-transition-done');
            }
            if (self.options.show_slide_delay > 0) {
                setTimeout(function() {
                    displaySlide.avia_animate(transition2, self.options.transitionSpeed, self.options.easing, after_slide);
                }, self.options.show_slide_delay);
            } else {
                displaySlide.avia_animate(transition2, self.options.transitionSpeed, self.options.easing, after_slide);
            }
        },
        _fade: function() {
            var self = this,
                displaySlide = this.$slides.eq(this.current),
                hideSlide = this.$slides.eq(this.prev),
                properties = {
                    visibility: 'visible',
                    zIndex: 3,
                    opacity: 0
                },
                fadeCallback = function() {
                    self.isAnimating = false;
                    displaySlide.addClass('active-slide');
                    hideSlide.css({
                        visibility: 'hidden',
                        zIndex: 2
                    }).removeClass('active-slide');
                    self.$slider.trigger('avia-transition-done');
                };
            hideSlide.trigger('pause');
            if (!displaySlide.data('disableAutoplay')) {
                if (displaySlide.hasClass('av-video-lazyload') && !displaySlide.hasClass('av-video-lazyload-complete')) {
                    displaySlide.find('.av-click-to-play-overlay').trigger('click');
                } else {
                    displaySlide.trigger('play');
                }
            }
            if (self.options.fullfade == true) {
                hideSlide.avia_animate({
                    opacity: 0
                }, 200, 'linear', function() {
                    displaySlide.css(properties).avia_animate({
                        opacity: 1
                    }, self.options.transitionSpeed, 'linear', fadeCallback);
                });
            } else {
                displaySlide.css(properties).avia_animate({
                    opacity: 1
                }, self.options.transitionSpeed / 2, 'linear', function() {
                    hideSlide.avia_animate({
                        opacity: 0
                    }, 200, 'linear', fadeCallback);
                });
            }
        },
        _attach_video_events: function() {
            var self = this,
                $html = $('html');
            self.$slides.each(function(i) {
                var currentSlide = $(this),
                    caption = currentSlide.find('.caption_fullwidth, .av-click-overlay'),
                    mejs = currentSlide.find('.mejs-mediaelement'),
                    lazyload = currentSlide.hasClass('av-video-lazyload') ? true : false;
                if (currentSlide.data('avia_video_events') != true) {
                    currentSlide.data('avia_video_events', true);
                    currentSlide.on('av-video-events-bound', {
                        slide: currentSlide,
                        wrap: mejs,
                        iteration: i,
                        self: self,
                        lazyload: lazyload
                    }, onReady);
                    currentSlide.on('av-video-ended', {
                        slide: currentSlide,
                        self: self
                    }, onFinish);
                    currentSlide.on('av-video-play-executed', function() {
                        setTimeout(function() {
                            self.pause()
                        }, 100);
                    });
                    caption.on('click', {
                        slide: currentSlide
                    }, toggle);
                    if (currentSlide.is('.av-video-events-bound')) currentSlide.trigger('av-video-events-bound');
                    if (lazyload && i === 0 && !currentSlide.data('disableAutoplay')) {
                        currentSlide.find('.av-click-to-play-overlay').trigger('click');
                    }
                }
            });

            function onReady(event) {
                if (event.data.iteration === 0) {
                    event.data.wrap.css('opacity', 0);
                    if (!event.data.self.isMobile && !event.data.slide.data('disableAutoplay')) {
                        event.data.slide.trigger('play');
                    }
                    Â
                    setTimeout(function() {
                        event.data.wrap.avia_animate({
                            opacity: 1
                        }, 400);
                    }, 50);
                } else if ($html.is('.avia-msie') && !event.data.slide.is('.av-video-service-html5')) {
                    if (!event.data.slide.data('disableAutoplay')) event.data.slide.trigger('play');
                }
                if (event.data.slide.is('.av-video-service-html5') && event.data.iteration !== 0) {
                    event.data.slide.trigger('pause');
                }
                if (event.data.lazyload) {
                    event.data.slide.addClass('av-video-lazyload-complete');
                    event.data.slide.trigger('play');
                }
            }

            function onFinish(event) {
                if (!event.data.slide.is('.av-single-slide') && !event.data.slide.is('.av-loop-video')) {
                    event.data.slide.trigger('reset');
                    self._navigate('next');
                    self.resume();
                }
                if (event.data.slide.is('.av-loop-video') && event.data.slide.is('.av-video-service-html5')) {
                    if ($html.is('.avia-safari-8')) {
                        setTimeout(function() {
                            event.data.slide.trigger('play');
                        }, 1);
                    }
                }
            }

            function toggle(event) {
                if (event.target.tagName != "A") {
                    event.data.slide.trigger('toggle');
                }
            }
        },
        _timer: function(callback, delay, first) {
            var self = this,
                start, remaining = delay;
            self.timerId = 0;
            this.pause = function() {
                window.clearTimeout(self.timerId);
                remaining -= new Date() - start;
            };
            this.resume = function() {
                start = new Date();
                self.timerId = window.setTimeout(callback, remaining);
            };
            this.destroy = function() {
                window.clearTimeout(self.timerId);
            };
            this.resume(true);
        },
        _startSlideshow: function() {
            var self = this;
            this.isPlaying = true;
            this.slideshow = new this._timer(function() {
                self._navigate('next');
                if (self.options.autoplay) {
                    self._startSlideshow();
                }
            }, (this.options.interval * 1000));
        },
        _stopSlideshow: function() {
            if (this.options.autoplay) {
                this.slideshow.destroy();
                this.isPlaying = false;
                this.options.autoplay = false;
            }
        },
        next: function(e) {
            e.preventDefault();
            this._stopSlideshow();
            this._navigate('next');
        },
        previous: function(e) {
            e.preventDefault();
            this._stopSlideshow();
            this._navigate('prev');
        },
        go2: function(pos) {
            if (isNaN(pos)) {
                pos.preventDefault();
                pos = pos.currentTarget.hash.replace('#', '');
            }
            pos -= 1;
            if (pos === this.current || pos >= this.itemsCount || pos < 0) {
                return false;
            }
            this._stopSlideshow();
            this._navigate(false, pos);
        },
        play: function() {
            if (!this.isPlaying) {
                this.isPlaying = true;
                this._navigate('next');
                this.options.autoplay = true;
                this._startSlideshow();
            }
        },
        pause: function() {
            if (this.isPlaying) {
                this.slideshow.pause();
            }
        },
        resume: function() {
            if (this.isPlaying) {
                this.slideshow.resume();
            }
        },
        destroy: function(callback) {
            this.slideshow.destroy(callback);
        }
    }
    $.fn.aviaSlider = function(options) {
        return this.each(function() {
            var self = $.data(this, 'aviaSlider');
            if (!self) {
                self = $.data(this, 'aviaSlider', new $.AviaSlider(options, this));
            }
        });
    }
})(jQuery);
(function($) {
    "use strict";
    var _units = ['weeks', 'days', 'hours', 'minutes', 'seconds'],
        _second = 1000,
        _minute = _second * 60,
        _hour = _minute * 60,
        _day = _hour * 24,
        _week = _day * 7,
        ticker = function(_self) {
            var _time = {},
                _now = new Date(),
                _timestamp = _self.end - _now;
            if (_timestamp <= 0) {
                clearInterval(_self.countdown);
                return;
            }
            _self.time.weeks = Math.floor(_timestamp / _week);
            _self.time.days = Math.floor((_timestamp % _week) / _day);
            _self.time.hours = Math.floor((_timestamp % _day) / _hour);
            _self.time.minutes = Math.floor((_timestamp % _hour) / _minute);
            _self.time.seconds = Math.floor((_timestamp % _minute) / _second);
            switch (_self.data.maximum) {
                case 1:
                    _self.time.seconds = Math.floor(_timestamp / _second);
                    break;
                case 2:
                    _self.time.minutes = Math.floor(_timestamp / _minute);
                    break;
                case 3:
                    _self.time.hours = Math.floor(_timestamp / _hour);
                    break;
                case 4:
                    _self.time.days = Math.floor(_timestamp / _day);
                    break;
            }
            for (var i in _self.time) {
                if (typeof _self.update[i] == "object") {
                    if (_self.firstrun || _self.oldtime[i] != _self.time[i]) {
                        var labelkey = (_self.time[i] === 1) ? "single" : "multi";
                        _self.update[i].time_container.text(_self.time[i]);
                        _self.update[i].label_container.text(_self.update[i][labelkey]);
                    }
                }
            }
            if (_self.firstrun) _self.container.addClass('av-countdown-active');
            _self.oldtime = $.extend({}, _self.time);
            _self.firstrun = false;
        };
    $.fn.aviaCountdown = function(options) {
        if (!this.length) return;
        return this.each(function() {
            var _self = {};
            _self.update = {};
            _self.time = {};
            _self.oldtime = {};
            _self.firstrun = true;
            _self.container = $(this);
            _self.data = _self.container.data();
            _self.end = new Date(_self.data.year, _self.data.month, _self.data.day, _self.data.hour, _self.data.minute);
            for (var i in _units) {
                _self.update[_units[i]] = {
                    time_container: _self.container.find('.av-countdown-' + _units[i] + ' .av-countdown-time'),
                    label_container: _self.container.find('.av-countdown-' + _units[i] + ' .av-countdown-time-label')
                };
                if (_self.update[_units[i]].label_container.length) {
                    _self.update[_units[i]].single = _self.update[_units[i]].label_container.data('label');
                    _self.update[_units[i]].multi = _self.update[_units[i]].label_container.data('label-multi');
                }
            }
            ticker(_self);
            _self.countdown = setInterval(function() {
                ticker(_self);
            }, 1000);
        });
    };
}(jQuery));
(function($) {
    "use strict";
    $.fn.avia_sc_gallery = function(options) {
        return this.each(function() {
            var gallery = $(this),
                images = gallery.find('img'),
                big_prev = gallery.find('.avia-gallery-big');
            gallery.on('avia_start_animation', function() {
                images.each(function(i) {
                    var image = $(this);
                    setTimeout(function() {
                        image.addClass('avia_start_animation')
                    }, (i * 110));
                });
            });
            if (gallery.hasClass('deactivate_avia_lazyload')) gallery.trigger('avia_start_animation');
            if (big_prev.length) {
                gallery.on('mouseenter', '.avia-gallery-thumb a', function() {
                    var _self = this;
                    big_prev.attr('data-onclick', _self.getAttribute("data-onclick"));
                    big_prev.height(big_prev.height());
                    big_prev.attr('href', _self.href)
                    var newImg = _self.getAttribute("data-prev-img"),
                        oldImg = big_prev.find('img'),
                        oldImgSrc = oldImg.attr('src');
                    if (newImg != oldImgSrc) {
                        var next_img = new Image();
                        next_img.src = newImg;
                        var $next = $(next_img);
                        if (big_prev.hasClass('avia-gallery-big-no-crop-thumb')) {
                            $next.css({
                                'height': big_prev.height(),
                                'width': 'auto'
                            });
                        }
                        big_prev.stop().animate({
                            opacity: 0
                        }, function() {
                            $next.insertAfter(oldImg);
                            oldImg.remove();
                            big_prev.animate({
                                opacity: 1
                            });
                            big_prev.attr('title', $(_self).attr('title'));
                        });
                    }
                });
                big_prev.on('click', function() {
                    var imagelink = gallery.find('.avia-gallery-thumb a').eq(this.getAttribute("data-onclick") - 1);
                    if (imagelink && !imagelink.hasClass('aviaopeninbrowser')) {
                        imagelink.trigger('click');
                    } else if (imagelink) {
                        var imgurl = imagelink.attr("href");
                        if (imagelink.hasClass('aviablank') && imgurl != '') {
                            window.open(imgurl, '_blank');
                        } else if (imgurl != '') {
                            window.open(imgurl, '_self');
                        }
                    }
                    return false;
                });
                $(window).on("debouncedresize", function() {
                    big_prev.height('auto');
                });
            }
        });
    }
}(jQuery));
(function($) {
    "use strict";
    $.fn.avia_hor_gallery = function(options) {
        var defaults = {
            slide_container: '.av-horizontal-gallery-inner',
            slide_element: '.av-horizontal-gallery-slider',
            slide_content: '.av-horizontal-gallery-wrap',
            active: 'av-active-gal-item',
            prev: '.av-horizontal-gallery-prev',
            next: '.av-horizontal-gallery-next'
        };
        var options = $.extend(defaults, options);
        var win = $(window),
            browserPrefix = $.avia_utilities.supports('transition'),
            cssActive = this.browserPrefix !== false ? true : false,
            isMobile = $.avia_utilities.isMobile,
            transform3d = document.documentElement.className.indexOf('avia_transform3d') !== -1 ? true : false,
            transition = {};
        return this.each(function() {
            var container = $(this),
                slide_container = container.find(options.slide_container),
                slide_element = container.find(options.slide_element),
                slide_content = container.find(options.slide_content),
                prev = container.find(options.prev),
                next = container.find(options.next),
                imgs = container.find('img'),
                all_elements_width = 0,
                currentIndex = false,
                initial = container.data('av-initial'),
                set_up = function(init) {
                    var sl_height = (slide_container.width() / 100) * slide_container.data('av-height');
                    slide_container.css({
                        'padding': 0
                    }).height(sl_height);
                    imgs.css('display', 'inline-block');
                    setTimeout(function() {
                        imgs.css('display', 'block');
                    }, 10);
                    all_elements_width = 0;
                    slide_content.each(function() {
                        all_elements_width += $(this).outerWidth(true);
                    });
                    slide_element.css('min-width', all_elements_width);
                    if (currentIndex !== false) {
                        change_active(currentIndex);
                    }
                },
                change_active = function(index) {
                    var current = slide_element.find(options.slide_content).eq(index),
                        viewport = slide_container.width(),
                        modifier = container.data('av-enlarge') > 1 && currentIndex == index ? container.data('av-enlarge') : 1,
                        outerWidth = current.outerWidth(true) * modifier,
                        margin_right = parseInt(current.css('margin-right'), 10) / 2,
                        left_pos = viewport < all_elements_width ? (current.position().left * -1) - (outerWidth / 2) + (viewport / 2) : 0;
                    left_pos = left_pos + margin_right;
                    if (left_pos + all_elements_width < viewport) left_pos = (all_elements_width - viewport - parseInt(current.css('margin-right'), 10)) * -1;
                    if (left_pos > 0) left_pos = 0;
                    slide_element.css('left', left_pos);
                    slide_container.find("." + options.active).removeClass(options.active);
                    current.addClass(options.active);
                    currentIndex = index;
                };
            $.avia_utilities.preload({
                container: container,
                global_callback: function() {
                    set_up('init');
                    win.on('debouncedresize', set_up);
                    if (initial) change_active(initial - 1);
                    setTimeout(function() {
                        container.addClass('av-horizontal-gallery-animated');
                    }, 10);
                }
            });
            slide_element.avia_swipe_trigger({
                prev: options.prev,
                next: options.next
            });
            slide_content.on('click', function(e) {
                var current = $(this);
                var index = slide_content.index(current);
                if (currentIndex === index) {
                    if (container.data('av-enlarge') > 1 && !$(e.target).is('a')) {}
                    return;
                }
                change_active(index);
            });
            prev.on('click', function(e) {
                if (currentIndex === false) currentIndex = 1;
                var index = currentIndex - 1;
                if (index < 0) index = 0;
                change_active(index);
            });
            next.on('click', function(e) {
                if (currentIndex === false) currentIndex = -1;
                var index = currentIndex + 1;
                if (index > slide_content.length - 1) index = slide_content.length - 1;
                change_active(index);
            });
            if (!isMobile) {
                container.avia_keyboard_controls({
                    37: options.prev,
                    39: options.next
                });
            } else {
                container.avia_swipe_trigger({
                    next: options.next,
                    prev: options.prev
                });
            }
        });
    };
}(jQuery));
(function($) {
    "use strict";
    $.AviaTextRotator = function(options, slider) {
        this.$win = $(window);
        this.$slider = $(slider);
        this.$inner = this.$slider.find('.av-rotator-text');
        this.$slides = this.$inner.find('.av-rotator-text-single');
        this.$current = this.$slides.eq(0);
        this.open = 0;
        this.count = this.$slides.length;
        if ($.avia_utilities.supported.transition === undefined) {
            $.avia_utilities.supported.transition = $.avia_utilities.supports('transition');
        }
        this.browserPrefix = $.avia_utilities.supported.transition;
        this.cssActive = this.browserPrefix !== false ? true : false;
        this.property = this.browserPrefix + 'transform', this._init(options);
    }
    $.AviaTextRotator.prototype = {
        _init: function(options) {
            var _self = this;
            if (this.count <= 1) return;
            _self.options = $.extend({}, options, this.$slider.data());
            _self.$inner.addClass('av-rotation-active');
            _self._autoplay();
            if (_self.options.animation == "typewriter") {
                _self.$slider.addClass('av-caret av-blinking-caret');
            }
        },
        _autoplay: function() {
            var _self = this;
            _self.autoplay = setTimeout(function() {
                _self.open = _self.open === false ? 0 : _self.open + 1;
                if (_self.open >= _self.count) _self.open = 0;
                if (_self.options.animation != "typewriter") {
                    _self._move({}, _self.open);
                    _self._autoplay();
                } else {
                    _self._typewriter();
                }
            }, _self.options.interval * 1000)
        },
        _typewriter: function(event) {
            var _self = this;
            _self.$current.css('background-color', _self.$current.css('color'));
            _self.$slider.removeClass('av-caret av-blinking-caret').addClass('av-marked-text');
            setTimeout(function() {
                _self.$slider.addClass('av-caret av-blinking-caret').removeClass('av-marked-text');
                _self.$current.data('av_typewriter_text', _self.$current.html());
                _self.$current.css('background-color', 'transparent');
                _self.$current.html("");
            }, 800);
            setTimeout(function() {
                _self.$slider.removeClass('av-blinking-caret');
                _self.$next = _self.$slides.eq(_self.open);
                var content = _self.$next.data('av_typewriter_text') || _self.$next.html();
                _self.$current.css({
                    display: 'none'
                });
                _self.$next.css({
                    display: 'inline'
                });
                _self.$next.html("");
                var i = 0;
                var speed = 50;

                function typeWriter() {
                    if (i < content.length) {
                        _self.$next[0].innerHTML += content.charAt(i);
                        i++;
                        setTimeout(typeWriter, speed + Math.floor(Math.random() * 100));
                    } else {
                        _self.$slider.addClass('av-caret av-blinking-caret');
                        _self.$current = _self.$slides.eq(_self.open);
                        _self._autoplay();
                    }
                }
                typeWriter();
            }, 1500);
        },
        _move: function(event) {
            var _self = this,
                modifier = 30 * _self.options.animation,
                fade_out = {
                    opacity: 0
                },
                fade_start = {
                    display: 'inline-block',
                    opacity: 0
                },
                fade_in = {
                    opacity: 1
                };
            this.$next = _self.$slides.eq(this.open);
            if (this.cssActive) {
                fade_out[_self.property] = "translate(0px," + modifier + "px)";
                fade_start[_self.property] = "translate(0px," + (modifier * -1) + "px)";
                fade_in[_self.property] = "translate(0px,0px)";
            } else {
                fade_out['top'] = modifier;
                fade_start['top'] = (modifier * -1);
                fade_in['top'] = 0;
            }
            _self.$current.avia_animate(fade_out, function() {
                _self.$current.css({
                    display: 'none'
                });
                _self.$next.css(fade_start).avia_animate(fade_in, function() {
                    _self.$current = _self.$slides.eq(_self.open);
                });
            });
        }
    };
    $.fn.avia_textrotator = function(options) {
        return this.each(function() {
            var active = $.data(this, 'AviaTextRotator');
            if (!active) {
                $.data(this, 'AviaTextRotator', 1);
                new $.AviaTextRotator(options, this);
            }
        });
    }
}(jQuery));
(function($) {
    "use strict";
    $(window).on('load', function(e) {
        $('.avia-icongrid-flipbox').avia_sc_icongrid();
    });
    $.fn.avia_sc_icongrid = function(options) {
        return this.each(function() {
            var container = $(this),
                icongrid_id = '#' + $(this).attr('id'),
                methods;
            methods = {
                buildIconGrid: function() {
                    this.setMinHeight($(icongrid_id + ' li article'));
                    this.createFlipBackground($(icongrid_id + ' li'));
                },
                setMinHeight: function(els) {
                    if (els.length < 2) return;
                    var elsHeights = new Array();
                    els.css('min-height', '0').each(function(i) {
                        var current = $(this);
                        var currentHeight = current.outerHeight(true);
                        elsHeights.push(currentHeight);
                    });
                    var largest = Math.max.apply(null, elsHeights);
                    els.css('min-height', largest);
                },
                createFlipBackground: function(els) {
                    els.each(function(index, element) {
                        var back = $(this).find('.avia-icongrid-content');
                        if (back.length > 0) {
                            if ($(this).find('.avia-icongrid-flipback').length <= 0) {
                                var flipback = back.clone().addClass('avia-icongrid-flipback').removeClass('avia-icongrid-content');
                                back.after(flipback);
                            }
                        }
                    });
                }
            };
            methods.buildIconGrid();
            $(window).on('resize', function() {
                methods.buildIconGrid();
            });
        });
    }
}(jQuery));
(function($) {
    "use strict";
    $.fn.avia_sc_iconlist = function(options) {
        return this.each(function() {
            var iconlist = $(this),
                elements = iconlist.find('>li');
            iconlist.on('avia_start_animation', function() {
                elements.each(function(i) {
                    var element = $(this);
                    setTimeout(function() {
                        element.addClass('avia_start_animation')
                    }, (i * 350));
                });
            });
        });
    }
}(jQuery));
(function($) {
    "use strict";
    $.fn.aviaHotspots = function(options) {
        if (!this.length) return;
        return this.each(function() {
            var _self = {};
            _self.container = $(this);
            _self.hotspots = _self.container.find('.av-image-hotspot');
            _self.container.on('avia_start_animation', function() {
                setTimeout(function() {
                    _self.hotspots.each(function(i) {
                        var current = $(this);
                        setTimeout(function() {
                            current.addClass('av-display-hotspot');
                        }, 300 * i);
                    });
                }, 400);
            });
        });
    };
}(jQuery));
(function($) {
    "use strict";
    var animating = false,
        methods = {
            switchMag: function(clicked, _self) {
                var current = $(clicked)
                if (current.is('.active_sort') || animating) return;
                var filter = current.data('filter'),
                    oldContainer = _self.container.filter(':visible'),
                    newContainer = _self.container.filter('.' + filter);
                animating = true;
                _self.sort_buttons.removeClass('active_sort');
                current.addClass('active_sort');
                _self.magazine.height(_self.magazine.outerHeight());
                oldContainer.avia_animate({
                    opacity: 0
                }, 200, function() {
                    oldContainer.css({
                        display: 'none'
                    });
                    newContainer.css({
                        opacity: 0,
                        display: 'block'
                    }).avia_animate({
                        opacity: 1
                    }, 150, function() {
                        _self.magazine.avia_animate({
                            height: (newContainer.outerHeight() + _self.sort_bar.outerHeight())
                        }, 150, function() {
                            _self.magazine.height('auto');
                            animating = false;
                        });
                    });
                });
            }
        };
    $.fn.aviaMagazine = function(options) {
        if (!this.length) return;
        return this.each(function() {
            var _self = {};
            _self.magazine = $(this), _self.sort_buttons = _self.magazine.find('.av-magazine-sort a');
            _self.container = _self.magazine.find('.av-magazine-group');
            _self.sort_bar = _self.magazine.find('.av-magazine-top-bar');
            _self.sort_buttons.on('click', function(e) {
                e.preventDefault();
                methods.switchMag(this, _self);
            });
        });
    }
}(jQuery));
/*!
 * Isotope PACKAGED v3.0.5
 *
 * Licensed GPLv3 for open source use
 * or Isotope Commercial License for commercial use
 *
 * https://isotope.metafizzy.co
 * Copyright 2017 Metafizzy
 */
! function(t, e) {
    "function" == typeof define && define.amd ? define("jquery-bridget/jquery-bridget", ["jquery"], function(i) {
        return e(t, i)
    }) : "object" == typeof module && module.exports ? module.exports = e(t, require("jquery")) : t.jQueryBridget = e(t, t.jQuery)
}(window, function(t, e) {
    "use strict";

    function i(i, s, a) {
        function u(t, e, o) {
            var n, s = "$()." + i + '("' + e + '")';
            return t.each(function(t, u) {
                var h = a.data(u, i);
                if (!h) return void r(i + " not initialized. Cannot call methods, i.e. " + s);
                var d = h[e];
                if (!d || "_" == e.charAt(0)) return void r(s + " is not a valid method");
                var l = d.apply(h, o);
                n = void 0 === n ? l : n
            }), void 0 !== n ? n : t
        }

        function h(t, e) {
            t.each(function(t, o) {
                var n = a.data(o, i);
                n ? (n.option(e), n._init()) : (n = new s(o, e), a.data(o, i, n))
            })
        }
        a = a || e || t.jQuery, a && (s.prototype.option || (s.prototype.option = function(t) {
            a.isPlainObject(t) && (this.options = a.extend(!0, this.options, t))
        }), a.fn[i] = function(t) {
            if ("string" == typeof t) {
                var e = n.call(arguments, 1);
                return u(this, t, e)
            }
            return h(this, t), this
        }, o(a))
    }

    function o(t) {
        !t || t && t.bridget || (t.bridget = i)
    }
    var n = Array.prototype.slice,
        s = t.console,
        r = "undefined" == typeof s ? function() {} : function(t) {
            s.error(t)
        };
    return o(e || t.jQuery), i
}),
function(t, e) {
    "function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", e) : "object" == typeof module && module.exports ? module.exports = e() : t.EvEmitter = e()
}("undefined" != typeof window ? window : this, function() {
    function t() {}
    var e = t.prototype;
    return e.on = function(t, e) {
        if (t && e) {
            var i = this._events = this._events || {},
                o = i[t] = i[t] || [];
            return o.indexOf(e) == -1 && o.push(e), this
        }
    }, e.once = function(t, e) {
        if (t && e) {
            this.on(t, e);
            var i = this._onceEvents = this._onceEvents || {},
                o = i[t] = i[t] || {};
            return o[e] = !0, this
        }
    }, e.off = function(t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
            var o = i.indexOf(e);
            return o != -1 && i.splice(o, 1), this
        }
    }, e.emitEvent = function(t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
            i = i.slice(0), e = e || [];
            for (var o = this._onceEvents && this._onceEvents[t], n = 0; n < i.length; n++) {
                var s = i[n],
                    r = o && o[s];
                r && (this.off(t, s), delete o[s]), s.apply(this, e)
            }
            return this
        }
    }, e.allOff = function() {
        delete this._events, delete this._onceEvents
    }, t
}),
function(t, e) {
    "use strict";
    "function" == typeof define && define.amd ? define("get-size/get-size", [], function() {
        return e()
    }) : "object" == typeof module && module.exports ? module.exports = e() : t.getSize = e()
}(window, function() {
    "use strict";

    function t(t) {
        var e = parseFloat(t),
            i = t.indexOf("%") == -1 && !isNaN(e);
        return i && e
    }

    function e() {}

    function i() {
        for (var t = {
                width: 0,
                height: 0,
                innerWidth: 0,
                innerHeight: 0,
                outerWidth: 0,
                outerHeight: 0
            }, e = 0; e < h; e++) {
            var i = u[e];
            t[i] = 0
        }
        return t
    }

    function o(t) {
        var e = getComputedStyle(t);
        return e || a("Style returned " + e + ". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"), e
    }

    function n() {
        if (!d) {
            d = !0;
            var e = document.createElement("div");
            e.style.width = "200px", e.style.padding = "1px 2px 3px 4px", e.style.borderStyle = "solid", e.style.borderWidth = "1px 2px 3px 4px", e.style.boxSizing = "border-box";
            var i = document.body || document.documentElement;
            i.appendChild(e);
            var n = o(e);
            s.isBoxSizeOuter = r = 200 == t(n.width), i.removeChild(e)
        }
    }

    function s(e) {
        if (n(), "string" == typeof e && (e = document.querySelector(e)), e && "object" == typeof e && e.nodeType) {
            var s = o(e);
            if ("none" == s.display) return i();
            var a = {};
            a.width = e.offsetWidth, a.height = e.offsetHeight;
            for (var d = a.isBorderBox = "border-box" == s.boxSizing, l = 0; l < h; l++) {
                var f = u[l],
                    c = s[f],
                    m = parseFloat(c);
                a[f] = isNaN(m) ? 0 : m
            }
            var p = a.paddingLeft + a.paddingRight,
                y = a.paddingTop + a.paddingBottom,
                g = a.marginLeft + a.marginRight,
                v = a.marginTop + a.marginBottom,
                _ = a.borderLeftWidth + a.borderRightWidth,
                I = a.borderTopWidth + a.borderBottomWidth,
                z = d && r,
                x = t(s.width);
            x !== !1 && (a.width = x + (z ? 0 : p + _));
            var S = t(s.height);
            return S !== !1 && (a.height = S + (z ? 0 : y + I)), a.innerWidth = a.width - (p + _), a.innerHeight = a.height - (y + I), a.outerWidth = a.width + g, a.outerHeight = a.height + v, a
        }
    }
    var r, a = "undefined" == typeof console ? e : function(t) {
            console.error(t)
        },
        u = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"],
        h = u.length,
        d = !1;
    return s
}),
function(t, e) {
    "use strict";
    "function" == typeof define && define.amd ? define("desandro-matches-selector/matches-selector", e) : "object" == typeof module && module.exports ? module.exports = e() : t.matchesSelector = e()
}(window, function() {
    "use strict";
    var t = function() {
        var t = window.Element.prototype;
        if (t.matches) return "matches";
        if (t.matchesSelector) return "matchesSelector";
        for (var e = ["webkit", "moz", "ms", "o"], i = 0; i < e.length; i++) {
            var o = e[i],
                n = o + "MatchesSelector";
            if (t[n]) return n
        }
    }();
    return function(e, i) {
        return e[t](i)
    }
}),
function(t, e) {
    "function" == typeof define && define.amd ? define("fizzy-ui-utils/utils", ["desandro-matches-selector/matches-selector"], function(i) {
        return e(t, i)
    }) : "object" == typeof module && module.exports ? module.exports = e(t, require("desandro-matches-selector")) : t.fizzyUIUtils = e(t, t.matchesSelector)
}(window, function(t, e) {
    var i = {};
    i.extend = function(t, e) {
        for (var i in e) t[i] = e[i];
        return t
    }, i.modulo = function(t, e) {
        return (t % e + e) % e
    }, i.makeArray = function(t) {
        var e = [];
        if (Array.isArray(t)) e = t;
        else if (t && "object" == typeof t && "number" == typeof t.length)
            for (var i = 0; i < t.length; i++) e.push(t[i]);
        else e.push(t);
        return e
    }, i.removeFrom = function(t, e) {
        var i = t.indexOf(e);
        i != -1 && t.splice(i, 1)
    }, i.getParent = function(t, i) {
        for (; t.parentNode && t != document.body;)
            if (t = t.parentNode, e(t, i)) return t
    }, i.getQueryElement = function(t) {
        return "string" == typeof t ? document.querySelector(t) : t
    }, i.handleEvent = function(t) {
        var e = "on" + t.type;
        this[e] && this[e](t)
    }, i.filterFindElements = function(t, o) {
        t = i.makeArray(t);
        var n = [];
        return t.forEach(function(t) {
            if (t instanceof HTMLElement) {
                if (!o) return void n.push(t);
                e(t, o) && n.push(t);
                for (var i = t.querySelectorAll(o), s = 0; s < i.length; s++) n.push(i[s])
            }
        }), n
    }, i.debounceMethod = function(t, e, i) {
        var o = t.prototype[e],
            n = e + "Timeout";
        t.prototype[e] = function() {
            var t = this[n];
            t && clearTimeout(t);
            var e = arguments,
                s = this;
            this[n] = setTimeout(function() {
                o.apply(s, e), delete s[n]
            }, i || 100)
        }
    }, i.docReady = function(t) {
        var e = document.readyState;
        "complete" == e || "interactive" == e ? setTimeout(t) : document.addEventListener("DOMContentLoaded", t)
    }, i.toDashed = function(t) {
        return t.replace(/(.)([A-Z])/g, function(t, e, i) {
            return e + "-" + i
        }).toLowerCase()
    };
    var o = t.console;
    return i.htmlInit = function(e, n) {
        i.docReady(function() {
            var s = i.toDashed(n),
                r = "data-" + s,
                a = document.querySelectorAll("[" + r + "]"),
                u = document.querySelectorAll(".js-" + s),
                h = i.makeArray(a).concat(i.makeArray(u)),
                d = r + "-options",
                l = t.jQuery;
            h.forEach(function(t) {
                var i, s = t.getAttribute(r) || t.getAttribute(d);
                try {
                    i = s && JSON.parse(s)
                } catch (a) {
                    return void(o && o.error("Error parsing " + r + " on " + t.className + ": " + a))
                }
                var u = new e(t, i);
                l && l.data(t, n, u)
            })
        })
    }, i
}),
function(t, e) {
    "function" == typeof define && define.amd ? define("outlayer/item", ["ev-emitter/ev-emitter", "get-size/get-size"], e) : "object" == typeof module && module.exports ? module.exports = e(require("ev-emitter"), require("get-size")) : (t.Outlayer = {}, t.Outlayer.Item = e(t.EvEmitter, t.getSize))
}(window, function(t, e) {
    "use strict";

    function i(t) {
        for (var e in t) return !1;
        return e = null, !0
    }

    function o(t, e) {
        t && (this.element = t, this.layout = e, this.position = {
            x: 0,
            y: 0
        }, this._create())
    }

    function n(t) {
        return t.replace(/([A-Z])/g, function(t) {
            return "-" + t.toLowerCase()
        })
    }
    var s = document.documentElement.style,
        r = "string" == typeof s.transition ? "transition" : "WebkitTransition",
        a = "string" == typeof s.transform ? "transform" : "WebkitTransform",
        u = {
            WebkitTransition: "webkitTransitionEnd",
            transition: "transitionend"
        } [r],
        h = {
            transform: a,
            transition: r,
            transitionDuration: r + "Duration",
            transitionProperty: r + "Property",
            transitionDelay: r + "Delay"
        },
        d = o.prototype = Object.create(t.prototype);
    d.constructor = o, d._create = function() {
        this._transn = {
            ingProperties: {},
            clean: {},
            onEnd: {}
        }, this.css({
            position: "absolute"
        })
    }, d.handleEvent = function(t) {
        var e = "on" + t.type;
        this[e] && this[e](t)
    }, d.getSize = function() {
        this.size = e(this.element)
    }, d.css = function(t) {
        var e = this.element.style;
        for (var i in t) {
            var o = h[i] || i;
            e[o] = t[i]
        }
    }, d.getPosition = function() {
        var t = getComputedStyle(this.element),
            e = this.layout._getOption("originLeft"),
            i = this.layout._getOption("originTop"),
            o = t[e ? "left" : "right"],
            n = t[i ? "top" : "bottom"],
            s = this.layout.size,
            r = o.indexOf("%") != -1 ? parseFloat(o) / 100 * s.width : parseInt(o, 10),
            a = n.indexOf("%") != -1 ? parseFloat(n) / 100 * s.height : parseInt(n, 10);
        r = isNaN(r) ? 0 : r, a = isNaN(a) ? 0 : a, r -= e ? s.paddingLeft : s.paddingRight, a -= i ? s.paddingTop : s.paddingBottom, this.position.x = r, this.position.y = a
    }, d.layoutPosition = function() {
        var t = this.layout.size,
            e = {},
            i = this.layout._getOption("originLeft"),
            o = this.layout._getOption("originTop"),
            n = i ? "paddingLeft" : "paddingRight",
            s = i ? "left" : "right",
            r = i ? "right" : "left",
            a = this.position.x + t[n];
        e[s] = this.getXValue(a), e[r] = "";
        var u = o ? "paddingTop" : "paddingBottom",
            h = o ? "top" : "bottom",
            d = o ? "bottom" : "top",
            l = this.position.y + t[u];
        e[h] = this.getYValue(l), e[d] = "", this.css(e), this.emitEvent("layout", [this])
    }, d.getXValue = function(t) {
        var e = this.layout._getOption("horizontal");
        return this.layout.options.percentPosition && !e ? t / this.layout.size.width * 100 + "%" : t + "px"
    }, d.getYValue = function(t) {
        var e = this.layout._getOption("horizontal");
        return this.layout.options.percentPosition && e ? t / this.layout.size.height * 100 + "%" : t + "px"
    }, d._transitionTo = function(t, e) {
        this.getPosition();
        var i = this.position.x,
            o = this.position.y,
            n = parseInt(t, 10),
            s = parseInt(e, 10),
            r = n === this.position.x && s === this.position.y;
        if (this.setPosition(t, e), r && !this.isTransitioning) return void this.layoutPosition();
        var a = t - i,
            u = e - o,
            h = {};
        h.transform = this.getTranslate(a, u), this.transition({
            to: h,
            onTransitionEnd: {
                transform: this.layoutPosition
            },
            isCleaning: !0
        })
    }, d.getTranslate = function(t, e) {
        var i = this.layout._getOption("originLeft"),
            o = this.layout._getOption("originTop");
        return t = i ? t : -t, e = o ? e : -e, "translate3d(" + t + "px, " + e + "px, 0)"
    }, d.goTo = function(t, e) {
        this.setPosition(t, e), this.layoutPosition()
    }, d.moveTo = d._transitionTo, d.setPosition = function(t, e) {
        this.position.x = parseInt(t, 10), this.position.y = parseInt(e, 10)
    }, d._nonTransition = function(t) {
        this.css(t.to), t.isCleaning && this._removeStyles(t.to);
        for (var e in t.onTransitionEnd) t.onTransitionEnd[e].call(this)
    }, d.transition = function(t) {
        if (!parseFloat(this.layout.options.transitionDuration)) return void this._nonTransition(t);
        var e = this._transn;
        for (var i in t.onTransitionEnd) e.onEnd[i] = t.onTransitionEnd[i];
        for (i in t.to) e.ingProperties[i] = !0, t.isCleaning && (e.clean[i] = !0);
        if (t.from) {
            this.css(t.from);
            var o = this.element.offsetHeight;
            o = null
        }
        this.enableTransition(t.to), this.css(t.to), this.isTransitioning = !0
    };
    var l = "opacity," + n(a);
    d.enableTransition = function() {
        if (!this.isTransitioning) {
            var t = this.layout.options.transitionDuration;
            t = "number" == typeof t ? t + "ms" : t, this.css({
                transitionProperty: l,
                transitionDuration: t,
                transitionDelay: this.staggerDelay || 0
            }), this.element.addEventListener(u, this, !1)
        }
    }, d.onwebkitTransitionEnd = function(t) {
        this.ontransitionend(t)
    }, d.onotransitionend = function(t) {
        this.ontransitionend(t)
    };
    var f = {
        "-webkit-transform": "transform"
    };
    d.ontransitionend = function(t) {
        if (t.target === this.element) {
            var e = this._transn,
                o = f[t.propertyName] || t.propertyName;
            if (delete e.ingProperties[o], i(e.ingProperties) && this.disableTransition(), o in e.clean && (this.element.style[t.propertyName] = "", delete e.clean[o]), o in e.onEnd) {
                var n = e.onEnd[o];
                n.call(this), delete e.onEnd[o]
            }
            this.emitEvent("transitionEnd", [this])
        }
    }, d.disableTransition = function() {
        this.removeTransitionStyles(), this.element.removeEventListener(u, this, !1), this.isTransitioning = !1
    }, d._removeStyles = function(t) {
        var e = {};
        for (var i in t) e[i] = "";
        this.css(e)
    };
    var c = {
        transitionProperty: "",
        transitionDuration: "",
        transitionDelay: ""
    };
    return d.removeTransitionStyles = function() {
        this.css(c)
    }, d.stagger = function(t) {
        t = isNaN(t) ? 0 : t, this.staggerDelay = t + "ms"
    }, d.removeElem = function() {
        this.element.parentNode.removeChild(this.element), this.css({
            display: ""
        }), this.emitEvent("remove", [this])
    }, d.remove = function() {
        return r && parseFloat(this.layout.options.transitionDuration) ? (this.once("transitionEnd", function() {
            this.removeElem()
        }), void this.hide()) : void this.removeElem()
    }, d.reveal = function() {
        delete this.isHidden, this.css({
            display: ""
        });
        var t = this.layout.options,
            e = {},
            i = this.getHideRevealTransitionEndProperty("visibleStyle");
        e[i] = this.onRevealTransitionEnd, this.transition({
            from: t.hiddenStyle,
            to: t.visibleStyle,
            isCleaning: !0,
            onTransitionEnd: e
        })
    }, d.onRevealTransitionEnd = function() {
        this.isHidden || this.emitEvent("reveal")
    }, d.getHideRevealTransitionEndProperty = function(t) {
        var e = this.layout.options[t];
        if (e.opacity) return "opacity";
        for (var i in e) return i
    }, d.hide = function() {
        this.isHidden = !0, this.css({
            display: ""
        });
        var t = this.layout.options,
            e = {},
            i = this.getHideRevealTransitionEndProperty("hiddenStyle");
        e[i] = this.onHideTransitionEnd, this.transition({
            from: t.visibleStyle,
            to: t.hiddenStyle,
            isCleaning: !0,
            onTransitionEnd: e
        })
    }, d.onHideTransitionEnd = function() {
        this.isHidden && (this.css({
            display: "none"
        }), this.emitEvent("hide"))
    }, d.destroy = function() {
        this.css({
            position: "",
            left: "",
            right: "",
            top: "",
            bottom: "",
            transition: "",
            transform: ""
        })
    }, o
}),
function(t, e) {
    "use strict";
    "function" == typeof define && define.amd ? define("outlayer/outlayer", ["ev-emitter/ev-emitter", "get-size/get-size", "fizzy-ui-utils/utils", "./item"], function(i, o, n, s) {
        return e(t, i, o, n, s)
    }) : "object" == typeof module && module.exports ? module.exports = e(t, require("ev-emitter"), require("get-size"), require("fizzy-ui-utils"), require("./item")) : t.Outlayer = e(t, t.EvEmitter, t.getSize, t.fizzyUIUtils, t.Outlayer.Item)
}(window, function(t, e, i, o, n) {
    "use strict";

    function s(t, e) {
        var i = o.getQueryElement(t);
        if (!i) return void(u && u.error("Bad element for " + this.constructor.namespace + ": " + (i || t)));
        this.element = i, h && (this.$element = h(this.element)), this.options = o.extend({}, this.constructor.defaults), this.option(e);
        var n = ++l;
        this.element.outlayerGUID = n, f[n] = this, this._create();
        var s = this._getOption("initLayout");
        s && this.layout()
    }

    function r(t) {
        function e() {
            t.apply(this, arguments)
        }
        return e.prototype = Object.create(t.prototype), e.prototype.constructor = e, e
    }

    function a(t) {
        if ("number" == typeof t) return t;
        var e = t.match(/(^\d*\.?\d*)(\w*)/),
            i = e && e[1],
            o = e && e[2];
        if (!i.length) return 0;
        i = parseFloat(i);
        var n = m[o] || 1;
        return i * n
    }
    var u = t.console,
        h = t.jQuery,
        d = function() {},
        l = 0,
        f = {};
    s.namespace = "outlayer", s.Item = n, s.defaults = {
        containerStyle: {
            position: "relative"
        },
        initLayout: !0,
        originLeft: !0,
        originTop: !0,
        resize: !0,
        resizeContainer: !0,
        transitionDuration: "0.4s",
        hiddenStyle: {
            opacity: 0,
            transform: "scale(0.001)"
        },
        visibleStyle: {
            opacity: 1,
            transform: "scale(1)"
        }
    };
    var c = s.prototype;
    o.extend(c, e.prototype), c.option = function(t) {
        o.extend(this.options, t)
    }, c._getOption = function(t) {
        var e = this.constructor.compatOptions[t];
        return e && void 0 !== this.options[e] ? this.options[e] : this.options[t]
    }, s.compatOptions = {
        initLayout: "isInitLayout",
        horizontal: "isHorizontal",
        layoutInstant: "isLayoutInstant",
        originLeft: "isOriginLeft",
        originTop: "isOriginTop",
        resize: "isResizeBound",
        resizeContainer: "isResizingContainer"
    }, c._create = function() {
        this.reloadItems(), this.stamps = [], this.stamp(this.options.stamp), o.extend(this.element.style, this.options.containerStyle);
        var t = this._getOption("resize");
        t && this.bindResize()
    }, c.reloadItems = function() {
        this.items = this._itemize(this.element.children)
    }, c._itemize = function(t) {
        for (var e = this._filterFindItemElements(t), i = this.constructor.Item, o = [], n = 0; n < e.length; n++) {
            var s = e[n],
                r = new i(s, this);
            o.push(r)
        }
        return o
    }, c._filterFindItemElements = function(t) {
        return o.filterFindElements(t, this.options.itemSelector)
    }, c.getItemElements = function() {
        return this.items.map(function(t) {
            return t.element
        })
    }, c.layout = function() {
        this._resetLayout(), this._manageStamps();
        var t = this._getOption("layoutInstant"),
            e = void 0 !== t ? t : !this._isLayoutInited;
        this.layoutItems(this.items, e), this._isLayoutInited = !0
    }, c._init = c.layout, c._resetLayout = function() {
        this.getSize()
    }, c.getSize = function() {
        this.size = i(this.element)
    }, c._getMeasurement = function(t, e) {
        var o, n = this.options[t];
        n ? ("string" == typeof n ? o = this.element.querySelector(n) : n instanceof HTMLElement && (o = n), this[t] = o ? i(o)[e] : n) : this[t] = 0
    }, c.layoutItems = function(t, e) {
        t = this._getItemsForLayout(t), this._layoutItems(t, e), this._postLayout()
    }, c._getItemsForLayout = function(t) {
        return t.filter(function(t) {
            return !t.isIgnored
        })
    }, c._layoutItems = function(t, e) {
        if (this._emitCompleteOnItems("layout", t), t && t.length) {
            var i = [];
            t.forEach(function(t) {
                var o = this._getItemLayoutPosition(t);
                o.item = t, o.isInstant = e || t.isLayoutInstant, i.push(o)
            }, this), this._processLayoutQueue(i)
        }
    }, c._getItemLayoutPosition = function() {
        return {
            x: 0,
            y: 0
        }
    }, c._processLayoutQueue = function(t) {
        this.updateStagger(), t.forEach(function(t, e) {
            this._positionItem(t.item, t.x, t.y, t.isInstant, e)
        }, this)
    }, c.updateStagger = function() {
        var t = this.options.stagger;
        return null === t || void 0 === t ? void(this.stagger = 0) : (this.stagger = a(t), this.stagger)
    }, c._positionItem = function(t, e, i, o, n) {
        o ? t.goTo(e, i) : (t.stagger(n * this.stagger), t.moveTo(e, i))
    }, c._postLayout = function() {
        this.resizeContainer()
    }, c.resizeContainer = function() {
        var t = this._getOption("resizeContainer");
        if (t) {
            var e = this._getContainerSize();
            e && (this._setContainerMeasure(e.width, !0), this._setContainerMeasure(e.height, !1))
        }
    }, c._getContainerSize = d, c._setContainerMeasure = function(t, e) {
        if (void 0 !== t) {
            var i = this.size;
            i.isBorderBox && (t += e ? i.paddingLeft + i.paddingRight + i.borderLeftWidth + i.borderRightWidth : i.paddingBottom + i.paddingTop + i.borderTopWidth + i.borderBottomWidth), t = Math.max(t, 0), this.element.style[e ? "width" : "height"] = t + "px"
        }
    }, c._emitCompleteOnItems = function(t, e) {
        function i() {
            n.dispatchEvent(t + "Complete", null, [e])
        }

        function o() {
            r++, r == s && i()
        }
        var n = this,
            s = e.length;
        if (!e || !s) return void i();
        var r = 0;
        e.forEach(function(e) {
            e.once(t, o)
        })
    }, c.dispatchEvent = function(t, e, i) {
        var o = e ? [e].concat(i) : i;
        if (this.emitEvent(t, o), h)
            if (this.$element = this.$element || h(this.element), e) {
                var n = h.Event(e);
                n.type = t, this.$element.trigger(n, i)
            } else this.$element.trigger(t, i)
    }, c.ignore = function(t) {
        var e = this.getItem(t);
        e && (e.isIgnored = !0)
    }, c.unignore = function(t) {
        var e = this.getItem(t);
        e && delete e.isIgnored
    }, c.stamp = function(t) {
        t = this._find(t), t && (this.stamps = this.stamps.concat(t), t.forEach(this.ignore, this))
    }, c.unstamp = function(t) {
        t = this._find(t), t && t.forEach(function(t) {
            o.removeFrom(this.stamps, t), this.unignore(t)
        }, this)
    }, c._find = function(t) {
        if (t) return "string" == typeof t && (t = this.element.querySelectorAll(t)), t = o.makeArray(t)
    }, c._manageStamps = function() {
        this.stamps && this.stamps.length && (this._getBoundingRect(), this.stamps.forEach(this._manageStamp, this))
    }, c._getBoundingRect = function() {
        var t = this.element.getBoundingClientRect(),
            e = this.size;
        this._boundingRect = {
            left: t.left + e.paddingLeft + e.borderLeftWidth,
            top: t.top + e.paddingTop + e.borderTopWidth,
            right: t.right - (e.paddingRight + e.borderRightWidth),
            bottom: t.bottom - (e.paddingBottom + e.borderBottomWidth)
        }
    }, c._manageStamp = d, c._getElementOffset = function(t) {
        var e = t.getBoundingClientRect(),
            o = this._boundingRect,
            n = i(t),
            s = {
                left: e.left - o.left - n.marginLeft,
                top: e.top - o.top - n.marginTop,
                right: o.right - e.right - n.marginRight,
                bottom: o.bottom - e.bottom - n.marginBottom
            };
        return s
    }, c.handleEvent = o.handleEvent, c.bindResize = function() {
        t.addEventListener("resize", this), this.isResizeBound = !0
    }, c.unbindResize = function() {
        t.removeEventListener("resize", this), this.isResizeBound = !1
    }, c.onresize = function() {
        this.resize()
    }, o.debounceMethod(s, "onresize", 100), c.resize = function() {
        this.isResizeBound && this.needsResizeLayout() && this.layout()
    }, c.needsResizeLayout = function() {
        var t = i(this.element),
            e = this.size && t;
        return e && t.innerWidth !== this.size.innerWidth
    }, c.addItems = function(t) {
        var e = this._itemize(t);
        return e.length && (this.items = this.items.concat(e)), e
    }, c.appended = function(t) {
        var e = this.addItems(t);
        e.length && (this.layoutItems(e, !0), this.reveal(e))
    }, c.prepended = function(t) {
        var e = this._itemize(t);
        if (e.length) {
            var i = this.items.slice(0);
            this.items = e.concat(i), this._resetLayout(), this._manageStamps(), this.layoutItems(e, !0), this.reveal(e), this.layoutItems(i)
        }
    }, c.reveal = function(t) {
        if (this._emitCompleteOnItems("reveal", t), t && t.length) {
            var e = this.updateStagger();
            t.forEach(function(t, i) {
                t.stagger(i * e), t.reveal()
            })
        }
    }, c.hide = function(t) {
        if (this._emitCompleteOnItems("hide", t), t && t.length) {
            var e = this.updateStagger();
            t.forEach(function(t, i) {
                t.stagger(i * e), t.hide()
            })
        }
    }, c.revealItemElements = function(t) {
        var e = this.getItems(t);
        this.reveal(e)
    }, c.hideItemElements = function(t) {
        var e = this.getItems(t);
        this.hide(e)
    }, c.getItem = function(t) {
        for (var e = 0; e < this.items.length; e++) {
            var i = this.items[e];
            if (i.element == t) return i
        }
    }, c.getItems = function(t) {
        t = o.makeArray(t);
        var e = [];
        return t.forEach(function(t) {
            var i = this.getItem(t);
            i && e.push(i)
        }, this), e
    }, c.remove = function(t) {
        var e = this.getItems(t);
        this._emitCompleteOnItems("remove", e), e && e.length && e.forEach(function(t) {
            t.remove(), o.removeFrom(this.items, t)
        }, this)
    }, c.destroy = function() {
        var t = this.element.style;
        t.height = "", t.position = "", t.width = "", this.items.forEach(function(t) {
            t.destroy()
        }), this.unbindResize();
        var e = this.element.outlayerGUID;
        delete f[e], delete this.element.outlayerGUID, h && h.removeData(this.element, this.constructor.namespace)
    }, s.data = function(t) {
        t = o.getQueryElement(t);
        var e = t && t.outlayerGUID;
        return e && f[e]
    }, s.create = function(t, e) {
        var i = r(s);
        return i.defaults = o.extend({}, s.defaults), o.extend(i.defaults, e), i.compatOptions = o.extend({}, s.compatOptions), i.namespace = t, i.data = s.data, i.Item = r(n), o.htmlInit(i, t), h && h.bridget && h.bridget(t, i), i
    };
    var m = {
        ms: 1,
        s: 1e3
    };
    return s.Item = n, s
}),
function(t, e) {
    "function" == typeof define && define.amd ? define("isotope-layout/js/item", ["outlayer/outlayer"], e) : "object" == typeof module && module.exports ? module.exports = e(require("outlayer")) : (t.Isotope = t.Isotope || {}, t.Isotope.Item = e(t.Outlayer))
}(window, function(t) {
    "use strict";

    function e() {
        t.Item.apply(this, arguments)
    }
    var i = e.prototype = Object.create(t.Item.prototype),
        o = i._create;
    i._create = function() {
        this.id = this.layout.itemGUID++, o.call(this), this.sortData = {}
    }, i.updateSortData = function() {
        if (!this.isIgnored) {
            this.sortData.id = this.id, this.sortData["original-order"] = this.id, this.sortData.random = Math.random();
            var t = this.layout.options.getSortData,
                e = this.layout._sorters;
            for (var i in t) {
                var o = e[i];
                this.sortData[i] = o(this.element, this)
            }
        }
    };
    var n = i.destroy;
    return i.destroy = function() {
        n.apply(this, arguments), this.css({
            display: ""
        })
    }, e
}),
function(t, e) {
    "function" == typeof define && define.amd ? define("isotope-layout/js/layout-mode", ["get-size/get-size", "outlayer/outlayer"], e) : "object" == typeof module && module.exports ? module.exports = e(require("get-size"), require("outlayer")) : (t.Isotope = t.Isotope || {}, t.Isotope.LayoutMode = e(t.getSize, t.Outlayer))
}(window, function(t, e) {
    "use strict";

    function i(t) {
        this.isotope = t, t && (this.options = t.options[this.namespace], this.element = t.element, this.items = t.filteredItems, this.size = t.size)
    }
    var o = i.prototype,
        n = ["_resetLayout", "_getItemLayoutPosition", "_manageStamp", "_getContainerSize", "_getElementOffset", "needsResizeLayout", "_getOption"];
    return n.forEach(function(t) {
        o[t] = function() {
            return e.prototype[t].apply(this.isotope, arguments)
        }
    }), o.needsVerticalResizeLayout = function() {
        var e = t(this.isotope.element),
            i = this.isotope.size && e;
        return i && e.innerHeight != this.isotope.size.innerHeight
    }, o._getMeasurement = function() {
        this.isotope._getMeasurement.apply(this, arguments)
    }, o.getColumnWidth = function() {
        this.getSegmentSize("column", "Width")
    }, o.getRowHeight = function() {
        this.getSegmentSize("row", "Height")
    }, o.getSegmentSize = function(t, e) {
        var i = t + e,
            o = "outer" + e;
        if (this._getMeasurement(i, o), !this[i]) {
            var n = this.getFirstItemSize();
            this[i] = n && n[o] || this.isotope.size["inner" + e]
        }
    }, o.getFirstItemSize = function() {
        var e = this.isotope.filteredItems[0];
        return e && e.element && t(e.element)
    }, o.layout = function() {
        this.isotope.layout.apply(this.isotope, arguments)
    }, o.getSize = function() {
        this.isotope.getSize(), this.size = this.isotope.size
    }, i.modes = {}, i.create = function(t, e) {
        function n() {
            i.apply(this, arguments)
        }
        return n.prototype = Object.create(o), n.prototype.constructor = n, e && (n.options = e), n.prototype.namespace = t, i.modes[t] = n, n
    }, i
}),
function(t, e) {
    "function" == typeof define && define.amd ? define("masonry-layout/masonry", ["outlayer/outlayer", "get-size/get-size"], e) : "object" == typeof module && module.exports ? module.exports = e(require("outlayer"), require("get-size")) : t.Masonry = e(t.Outlayer, t.getSize)
}(window, function(t, e) {
    var i = t.create("masonry");
    i.compatOptions.fitWidth = "isFitWidth";
    var o = i.prototype;
    return o._resetLayout = function() {
        this.getSize(), this._getMeasurement("columnWidth", "outerWidth"), this._getMeasurement("gutter", "outerWidth"), this.measureColumns(), this.colYs = [];
        for (var t = 0; t < this.cols; t++) this.colYs.push(0);
        this.maxY = 0, this.horizontalColIndex = 0
    }, o.measureColumns = function() {
        if (this.getContainerWidth(), !this.columnWidth) {
            var t = this.items[0],
                i = t && t.element;
            this.columnWidth = i && e(i).outerWidth || this.containerWidth
        }
        var o = this.columnWidth += this.gutter,
            n = this.containerWidth + this.gutter,
            s = n / o,
            r = o - n % o,
            a = r && r < 1 ? "round" : "floor";
        s = Math[a](s), this.cols = Math.max(s, 1)
    }, o.getContainerWidth = function() {
        var t = this._getOption("fitWidth"),
            i = t ? this.element.parentNode : this.element,
            o = e(i);
        this.containerWidth = o && o.innerWidth
    }, o._getItemLayoutPosition = function(t) {
        t.getSize();
        var e = t.size.outerWidth % this.columnWidth,
            i = e && e < 1 ? "round" : "ceil",
            o = Math[i](t.size.outerWidth / this.columnWidth);
        o = Math.min(o, this.cols);
        for (var n = this.options.horizontalOrder ? "_getHorizontalColPosition" : "_getTopColPosition", s = this[n](o, t), r = {
                x: this.columnWidth * s.col,
                y: s.y
            }, a = s.y + t.size.outerHeight, u = o + s.col, h = s.col; h < u; h++) this.colYs[h] = a;
        return r
    }, o._getTopColPosition = function(t) {
        var e = this._getTopColGroup(t),
            i = Math.min.apply(Math, e);
        return {
            col: e.indexOf(i),
            y: i
        }
    }, o._getTopColGroup = function(t) {
        if (t < 2) return this.colYs;
        for (var e = [], i = this.cols + 1 - t, o = 0; o < i; o++) e[o] = this._getColGroupY(o, t);
        return e
    }, o._getColGroupY = function(t, e) {
        if (e < 2) return this.colYs[t];
        var i = this.colYs.slice(t, t + e);
        return Math.max.apply(Math, i)
    }, o._getHorizontalColPosition = function(t, e) {
        var i = this.horizontalColIndex % this.cols,
            o = t > 1 && i + t > this.cols;
        i = o ? 0 : i;
        var n = e.size.outerWidth && e.size.outerHeight;
        return this.horizontalColIndex = n ? i + t : this.horizontalColIndex, {
            col: i,
            y: this._getColGroupY(i, t)
        }
    }, o._manageStamp = function(t) {
        var i = e(t),
            o = this._getElementOffset(t),
            n = this._getOption("originLeft"),
            s = n ? o.left : o.right,
            r = s + i.outerWidth,
            a = Math.floor(s / this.columnWidth);
        a = Math.max(0, a);
        var u = Math.floor(r / this.columnWidth);
        u -= r % this.columnWidth ? 0 : 1, u = Math.min(this.cols - 1, u);
        for (var h = this._getOption("originTop"), d = (h ? o.top : o.bottom) + i.outerHeight, l = a; l <= u; l++) this.colYs[l] = Math.max(d, this.colYs[l])
    }, o._getContainerSize = function() {
        this.maxY = Math.max.apply(Math, this.colYs);
        var t = {
            height: this.maxY
        };
        return this._getOption("fitWidth") && (t.width = this._getContainerFitWidth()), t
    }, o._getContainerFitWidth = function() {
        for (var t = 0, e = this.cols; --e && 0 === this.colYs[e];) t++;
        return (this.cols - t) * this.columnWidth - this.gutter
    }, o.needsResizeLayout = function() {
        var t = this.containerWidth;
        return this.getContainerWidth(), t != this.containerWidth
    }, i
}),
function(t, e) {
    "function" == typeof define && define.amd ? define("isotope-layout/js/layout-modes/masonry", ["../layout-mode", "masonry-layout/masonry"], e) : "object" == typeof module && module.exports ? module.exports = e(require("../layout-mode"), require("masonry-layout")) : e(t.Isotope.LayoutMode, t.Masonry)
}(window, function(t, e) {
    "use strict";
    var i = t.create("masonry"),
        o = i.prototype,
        n = {
            _getElementOffset: !0,
            layout: !0,
            _getMeasurement: !0
        };
    for (var s in e.prototype) n[s] || (o[s] = e.prototype[s]);
    var r = o.measureColumns;
    o.measureColumns = function() {
        this.items = this.isotope.filteredItems, r.call(this)
    };
    var a = o._getOption;
    return o._getOption = function(t) {
        return "fitWidth" == t ? void 0 !== this.options.isFitWidth ? this.options.isFitWidth : this.options.fitWidth : a.apply(this.isotope, arguments)
    }, i
}),
function(t, e) {
    "function" == typeof define && define.amd ? define("isotope-layout/js/layout-modes/fit-rows", ["../layout-mode"], e) : "object" == typeof exports ? module.exports = e(require("../layout-mode")) : e(t.Isotope.LayoutMode)
}(window, function(t) {
    "use strict";
    var e = t.create("fitRows"),
        i = e.prototype;
    return i._resetLayout = function() {
        this.x = 0, this.y = 0, this.maxY = 0, this._getMeasurement("gutter", "outerWidth")
    }, i._getItemLayoutPosition = function(t) {
        t.getSize();
        var e = t.size.outerWidth + this.gutter,
            i = this.isotope.size.innerWidth + this.gutter;
        0 !== this.x && e + this.x > i && (this.x = 0, this.y = this.maxY);
        var o = {
            x: this.x,
            y: this.y
        };
        return this.maxY = Math.max(this.maxY, this.y + t.size.outerHeight), this.x += e, o
    }, i._getContainerSize = function() {
        return {
            height: this.maxY
        }
    }, e
}),
function(t, e) {
    "function" == typeof define && define.amd ? define("isotope-layout/js/layout-modes/vertical", ["../layout-mode"], e) : "object" == typeof module && module.exports ? module.exports = e(require("../layout-mode")) : e(t.Isotope.LayoutMode)
}(window, function(t) {
    "use strict";
    var e = t.create("vertical", {
            horizontalAlignment: 0
        }),
        i = e.prototype;
    return i._resetLayout = function() {
        this.y = 0
    }, i._getItemLayoutPosition = function(t) {
        t.getSize();
        var e = (this.isotope.size.innerWidth - t.size.outerWidth) * this.options.horizontalAlignment,
            i = this.y;
        return this.y += t.size.outerHeight, {
            x: e,
            y: i
        }
    }, i._getContainerSize = function() {
        return {
            height: this.y
        }
    }, e
}),
function(t, e) {
    "function" == typeof define && define.amd ? define(["outlayer/outlayer", "get-size/get-size", "desandro-matches-selector/matches-selector", "fizzy-ui-utils/utils", "isotope-layout/js/item", "isotope-layout/js/layout-mode", "isotope-layout/js/layout-modes/masonry", "isotope-layout/js/layout-modes/fit-rows", "isotope-layout/js/layout-modes/vertical"], function(i, o, n, s, r, a) {
        return e(t, i, o, n, s, r, a)
    }) : "object" == typeof module && module.exports ? module.exports = e(t, require("outlayer"), require("get-size"), require("desandro-matches-selector"), require("fizzy-ui-utils"), require("isotope-layout/js/item"), require("isotope-layout/js/layout-mode"), require("isotope-layout/js/layout-modes/masonry"), require("isotope-layout/js/layout-modes/fit-rows"), require("isotope-layout/js/layout-modes/vertical")) : t.Isotope = e(t, t.Outlayer, t.getSize, t.matchesSelector, t.fizzyUIUtils, t.Isotope.Item, t.Isotope.LayoutMode)
}(window, function(t, e, i, o, n, s, r) {
    function a(t, e) {
        return function(i, o) {
            for (var n = 0; n < t.length; n++) {
                var s = t[n],
                    r = i.sortData[s],
                    a = o.sortData[s];
                if (r > a || r < a) {
                    var u = void 0 !== e[s] ? e[s] : e,
                        h = u ? 1 : -1;
                    return (r > a ? 1 : -1) * h
                }
            }
            return 0
        }
    }
    var u = t.jQuery,
        h = String.prototype.trim ? function(t) {
            return t.trim()
        } : function(t) {
            return t.replace(/^\s+|\s+$/g, "")
        },
        d = e.create("isotope", {
            layoutMode: "masonry",
            isJQueryFiltering: !0,
            sortAscending: !0
        });
    d.Item = s, d.LayoutMode = r;
    var l = d.prototype;
    l._create = function() {
        this.itemGUID = 0, this._sorters = {}, this._getSorters(), e.prototype._create.call(this), this.modes = {}, this.filteredItems = this.items, this.sortHistory = ["original-order"];
        for (var t in r.modes) this._initLayoutMode(t)
    }, l.reloadItems = function() {
        this.itemGUID = 0, e.prototype.reloadItems.call(this)
    }, l._itemize = function() {
        for (var t = e.prototype._itemize.apply(this, arguments), i = 0; i < t.length; i++) {
            var o = t[i];
            o.id = this.itemGUID++
        }
        return this._updateItemsSortData(t), t
    }, l._initLayoutMode = function(t) {
        var e = r.modes[t],
            i = this.options[t] || {};
        this.options[t] = e.options ? n.extend(e.options, i) : i, this.modes[t] = new e(this)
    }, l.layout = function() {
        return !this._isLayoutInited && this._getOption("initLayout") ? void this.arrange() : void this._layout()
    }, l._layout = function() {
        var t = this._getIsInstant();
        this._resetLayout(), this._manageStamps(), this.layoutItems(this.filteredItems, t), this._isLayoutInited = !0
    }, l.arrange = function(t) {
        this.option(t), this._getIsInstant();
        var e = this._filter(this.items);
        this.filteredItems = e.matches, this._bindArrangeComplete(), this._isInstant ? this._noTransition(this._hideReveal, [e]) : this._hideReveal(e), this._sort(), this._layout()
    }, l._init = l.arrange, l._hideReveal = function(t) {
        this.reveal(t.needReveal), this.hide(t.needHide)
    }, l._getIsInstant = function() {
        var t = this._getOption("layoutInstant"),
            e = void 0 !== t ? t : !this._isLayoutInited;
        return this._isInstant = e, e
    }, l._bindArrangeComplete = function() {
        function t() {
            e && i && o && n.dispatchEvent("arrangeComplete", null, [n.filteredItems])
        }
        var e, i, o, n = this;
        this.once("layoutComplete", function() {
            e = !0, t()
        }), this.once("hideComplete", function() {
            i = !0, t()
        }), this.once("revealComplete", function() {
            o = !0, t()
        })
    }, l._filter = function(t) {
        var e = this.options.filter;
        e = e || "*";
        for (var i = [], o = [], n = [], s = this._getFilterTest(e), r = 0; r < t.length; r++) {
            var a = t[r];
            if (!a.isIgnored) {
                var u = s(a);
                u && i.push(a), u && a.isHidden ? o.push(a) : u || a.isHidden || n.push(a)
            }
        }
        return {
            matches: i,
            needReveal: o,
            needHide: n
        }
    }, l._getFilterTest = function(t) {
        return u && this.options.isJQueryFiltering ? function(e) {
            return u(e.element).is(t)
        } : "function" == typeof t ? function(e) {
            return t(e.element)
        } : function(e) {
            return o(e.element, t)
        }
    }, l.updateSortData = function(t) {
        var e;
        t ? (t = n.makeArray(t), e = this.getItems(t)) : e = this.items, this._getSorters(), this._updateItemsSortData(e)
    }, l._getSorters = function() {
        var t = this.options.getSortData;
        for (var e in t) {
            var i = t[e];
            this._sorters[e] = f(i)
        }
    }, l._updateItemsSortData = function(t) {
        for (var e = t && t.length, i = 0; e && i < e; i++) {
            var o = t[i];
            o.updateSortData()
        }
    };
    var f = function() {
        function t(t) {
            if ("string" != typeof t) return t;
            var i = h(t).split(" "),
                o = i[0],
                n = o.match(/^\[(.+)\]$/),
                s = n && n[1],
                r = e(s, o),
                a = d.sortDataParsers[i[1]];
            return t = a ? function(t) {
                return t && a(r(t))
            } : function(t) {
                return t && r(t)
            }
        }

        function e(t, e) {
            return t ? function(e) {
                return e.getAttribute(t)
            } : function(t) {
                var i = t.querySelector(e);
                return i && i.textContent
            }
        }
        return t
    }();
    d.sortDataParsers = {
        parseInt: function(t) {
            return parseInt(t, 10)
        },
        parseFloat: function(t) {
            return parseFloat(t)
        }
    }, l._sort = function() {
        if (this.options.sortBy) {
            var t = n.makeArray(this.options.sortBy);
            this._getIsSameSortBy(t) || (this.sortHistory = t.concat(this.sortHistory));
            var e = a(this.sortHistory, this.options.sortAscending);
            this.filteredItems.sort(e)
        }
    }, l._getIsSameSortBy = function(t) {
        for (var e = 0; e < t.length; e++)
            if (t[e] != this.sortHistory[e]) return !1;
        return !0
    }, l._mode = function() {
        var t = this.options.layoutMode,
            e = this.modes[t];
        if (!e) throw new Error("No layout mode: " + t);
        return e.options = this.options[t], e
    }, l._resetLayout = function() {
        e.prototype._resetLayout.call(this), this._mode()._resetLayout()
    }, l._getItemLayoutPosition = function(t) {
        return this._mode()._getItemLayoutPosition(t)
    }, l._manageStamp = function(t) {
        this._mode()._manageStamp(t)
    }, l._getContainerSize = function() {
        return this._mode()._getContainerSize()
    }, l.needsResizeLayout = function() {
        return this._mode().needsResizeLayout()
    }, l.appended = function(t) {
        var e = this.addItems(t);
        if (e.length) {
            var i = this._filterRevealAdded(e);
            this.filteredItems = this.filteredItems.concat(i)
        }
    }, l.prepended = function(t) {
        var e = this._itemize(t);
        if (e.length) {
            this._resetLayout(), this._manageStamps();
            var i = this._filterRevealAdded(e);
            this.layoutItems(this.filteredItems), this.filteredItems = i.concat(this.filteredItems), this.items = e.concat(this.items)
        }
    }, l._filterRevealAdded = function(t) {
        var e = this._filter(t);
        return this.hide(e.needHide), this.reveal(e.matches), this.layoutItems(e.matches, !0), e.matches
    }, l.insert = function(t) {
        var e = this.addItems(t);
        if (e.length) {
            var i, o, n = e.length;
            for (i = 0; i < n; i++) o = e[i], this.element.appendChild(o.element);
            var s = this._filter(e).matches;
            for (i = 0; i < n; i++) e[i].isLayoutInstant = !0;
            for (this.arrange(), i = 0; i < n; i++) delete e[i].isLayoutInstant;
            this.reveal(s)
        }
    };
    var c = l.remove;
    return l.remove = function(t) {
        t = n.makeArray(t);
        var e = this.getItems(t);
        c.call(this, t);
        for (var i = e && e.length, o = 0; i && o < i; o++) {
            var s = e[o];
            n.removeFrom(this.filteredItems, s)
        }
    }, l.shuffle = function() {
        for (var t = 0; t < this.items.length; t++) {
            var e = this.items[t];
            e.sortData.random = Math.random()
        }
        this.options.sortBy = "random", this._sort(), this._layout()
    }, l._noTransition = function(t, e) {
        var i = this.options.transitionDuration;
        this.options.transitionDuration = 0;
        var o = t.apply(this, e);
        return this.options.transitionDuration = i, o
    }, l.getFilteredItemElements = function() {
        return this.filteredItems.map(function(t) {
            return t.element
        })
    }, d
});
/*! 
 * Packery layout mode PACKAGED v2.0.0 
 * sub-classes Packery 
 */
! function(a, b) {
    "function" == typeof define && define.amd ? define("packery/js/rect", b) : "object" == typeof module && module.exports ? module.exports = b() : (a.Packery = a.Packery || {}, a.Packery.Rect = b())
}(window, function() {
    function a(b) {
        for (var c in a.defaults) this[c] = a.defaults[c];
        for (c in b) this[c] = b[c]
    }
    a.defaults = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };
    var b = a.prototype;
    return b.contains = function(a) {
        var b = a.width || 0,
            c = a.height || 0;
        return this.x <= a.x && this.y <= a.y && this.x + this.width >= a.x + b && this.y + this.height >= a.y + c
    }, b.overlaps = function(a) {
        var b = this.x + this.width,
            c = this.y + this.height,
            d = a.x + a.width,
            e = a.y + a.height;
        return this.x < d && b > a.x && this.y < e && c > a.y
    }, b.getMaximalFreeRects = function(b) {
        if (!this.overlaps(b)) return !1;
        var c, d = [],
            e = this.x + this.width,
            f = this.y + this.height,
            g = b.x + b.width,
            h = b.y + b.height;
        return this.y < b.y && (c = new a({
            x: this.x,
            y: this.y,
            width: this.width,
            height: b.y - this.y
        }), d.push(c)), e > g && (c = new a({
            x: g,
            y: this.y,
            width: e - g,
            height: this.height
        }), d.push(c)), f > h && (c = new a({
            x: this.x,
            y: h,
            width: this.width,
            height: f - h
        }), d.push(c)), this.x < b.x && (c = new a({
            x: this.x,
            y: this.y,
            width: b.x - this.x,
            height: this.height
        }), d.push(c)), d
    }, b.canFit = function(a) {
        return this.width >= a.width && this.height >= a.height
    }, a
}),
function(a, b) {
    if ("function" == typeof define && define.amd) define("packery/js/packer", ["./rect"], b);
    else if ("object" == typeof module && module.exports) module.exports = b(require("./rect"));
    else {
        var c = a.Packery = a.Packery || {};
        c.Packer = b(c.Rect)
    }
}(window, function(a) {
    function b(a, b, c) {
        this.width = a || 0, this.height = b || 0, this.sortDirection = c || "downwardLeftToRight", this.reset()
    }
    var c = b.prototype;
    c.reset = function() {
        this.spaces = [];
        var b = new a({
            x: 0,
            y: 0,
            width: this.width,
            height: this.height
        });
        this.spaces.push(b), this.sorter = d[this.sortDirection] || d.downwardLeftToRight
    }, c.pack = function(a) {
        for (var b = 0; b < this.spaces.length; b++) {
            var c = this.spaces[b];
            if (c.canFit(a)) {
                this.placeInSpace(a, c);
                break
            }
        }
    }, c.columnPack = function(a) {
        for (var b = 0; b < this.spaces.length; b++) {
            var c = this.spaces[b],
                d = c.x <= a.x && c.x + c.width >= a.x + a.width && c.height >= a.height - .01;
            if (d) {
                a.y = c.y, this.placed(a);
                break
            }
        }
    }, c.rowPack = function(a) {
        for (var b = 0; b < this.spaces.length; b++) {
            var c = this.spaces[b],
                d = c.y <= a.y && c.y + c.height >= a.y + a.height && c.width >= a.width - .01;
            if (d) {
                a.x = c.x, this.placed(a);
                break
            }
        }
    }, c.placeInSpace = function(a, b) {
        a.x = b.x, a.y = b.y, this.placed(a)
    }, c.placed = function(a) {
        for (var b = [], c = 0; c < this.spaces.length; c++) {
            var d = this.spaces[c],
                e = d.getMaximalFreeRects(a);
            e ? b.push.apply(b, e) : b.push(d)
        }
        this.spaces = b, this.mergeSortSpaces()
    }, c.mergeSortSpaces = function() {
        b.mergeRects(this.spaces), this.spaces.sort(this.sorter)
    }, c.addSpace = function(a) {
        this.spaces.push(a), this.mergeSortSpaces()
    }, b.mergeRects = function(a) {
        var b = 0,
            c = a[b];
        a: for (; c;) {
            for (var d = 0, e = a[b + d]; e;) {
                if (e == c) d++;
                else {
                    if (e.contains(c)) {
                        a.splice(b, 1), c = a[b];
                        continue a
                    }
                    c.contains(e) ? a.splice(b + d, 1) : d++
                }
                e = a[b + d]
            }
            b++, c = a[b]
        }
        return a
    };
    var d = {
        downwardLeftToRight: function(a, b) {
            return a.y - b.y || a.x - b.x
        },
        rightwardTopToBottom: function(a, b) {
            return a.x - b.x || a.y - b.y
        }
    };
    return b
}),
function(a, b) {
    "function" == typeof define && define.amd ? define("packery/js/item", ["outlayer/outlayer", "./rect"], b) : "object" == typeof module && module.exports ? module.exports = b(require("outlayer"), require("./rect")) : a.Packery.Item = b(a.Outlayer, a.Packery.Rect)
}(window, function(a, b) {
    var c = document.documentElement.style,
        d = "string" == typeof c.transform ? "transform" : "WebkitTransform",
        e = function() {
            a.Item.apply(this, arguments)
        },
        f = e.prototype = Object.create(a.Item.prototype),
        g = f._create;
    f._create = function() {
        g.call(this), this.rect = new b
    };
    var h = f.moveTo;
    return f.moveTo = function(a, b) {
        var c = Math.abs(this.position.x - a),
            d = Math.abs(this.position.y - b),
            e = this.layout.dragItemCount && !this.isPlacing && !this.isTransitioning && 1 > c && 1 > d;
        return e ? void this.goTo(a, b) : void h.apply(this, arguments)
    }, f.enablePlacing = function() {
        this.removeTransitionStyles(), this.isTransitioning && d && (this.element.style[d] = "none"), this.isTransitioning = !1, this.getSize(), this.layout._setRectSize(this.element, this.rect), this.isPlacing = !0
    }, f.disablePlacing = function() {
        this.isPlacing = !1
    }, f.removeElem = function() {
        this.element.parentNode.removeChild(this.element), this.layout.packer.addSpace(this.rect), this.emitEvent("remove", [this])
    }, f.showDropPlaceholder = function() {
        var a = this.dropPlaceholder;
        a || (a = this.dropPlaceholder = document.createElement("div"), a.className = "packery-drop-placeholder", a.style.position = "absolute"), a.style.width = this.size.width + "px", a.style.height = this.size.height + "px", this.positionDropPlaceholder(), this.layout.element.appendChild(a)
    }, f.positionDropPlaceholder = function() {
        this.dropPlaceholder.style[d] = "translate(" + this.rect.x + "px, " + this.rect.y + "px)"
    }, f.hideDropPlaceholder = function() {
        this.layout.element.removeChild(this.dropPlaceholder)
    }, e
}),
function(a, b) {
    "function" == typeof define && define.amd ? define("packery/js/packery", ["get-size/get-size", "outlayer/outlayer", "./rect", "./packer", "./item"], b) : "object" == typeof module && module.exports ? module.exports = b(require("get-size"), require("outlayer"), require("./rect"), require("./packer"), require("./item")) : a.Packery = b(a.getSize, a.Outlayer, a.Packery.Rect, a.Packery.Packer, a.Packery.Item)
}(window, function(a, b, c, d, e) {
    function f(a, b) {
        return a.position.y - b.position.y || a.position.x - b.position.x
    }

    function g(a, b) {
        return a.position.x - b.position.x || a.position.y - b.position.y
    }

    function h(a, b) {
        var c = b.x - a.x,
            d = b.y - a.y;
        return Math.sqrt(c * c + d * d)
    }
    c.prototype.canFit = function(a) {
        return this.width >= a.width - 1 && this.height >= a.height - 1
    };
    var i = b.create("packery");
    i.Item = e;
    var j = i.prototype;
    j._create = function() {
        b.prototype._create.call(this), this.packer = new d, this.shiftPacker = new d, this.isEnabled = !0, this.dragItemCount = 0;
        var a = this;
        this.handleDraggabilly = {
            dragStart: function() {
                a.itemDragStart(this.element)
            },
            dragMove: function() {
                a.itemDragMove(this.element, this.position.x, this.position.y)
            },
            dragEnd: function() {
                a.itemDragEnd(this.element)
            }
        }, this.handleUIDraggable = {
            start: function(b, c) {
                c && a.itemDragStart(b.currentTarget)
            },
            drag: function(b, c) {
                c && a.itemDragMove(b.currentTarget, c.position.left, c.position.top)
            },
            stop: function(b, c) {
                c && a.itemDragEnd(b.currentTarget)
            }
        }
    }, j._resetLayout = function() {
        this.getSize(), this._getMeasurements();
        var a, b, c;
        this._getOption("horizontal") ? (a = 1 / 0, b = this.size.innerHeight + this.gutter, c = "rightwardTopToBottom") : (a = this.size.innerWidth + this.gutter, b = 1 / 0, c = "downwardLeftToRight"), this.packer.width = this.shiftPacker.width = a, this.packer.height = this.shiftPacker.height = b, this.packer.sortDirection = this.shiftPacker.sortDirection = c, this.packer.reset(), this.maxY = 0, this.maxX = 0
    }, j._getMeasurements = function() {
        this._getMeasurement("columnWidth", "width"), this._getMeasurement("rowHeight", "height"), this._getMeasurement("gutter", "width")
    }, j._getItemLayoutPosition = function(a) {
        if (this._setRectSize(a.element, a.rect), this.isShifting || this.dragItemCount > 0) {
            var b = this._getPackMethod();
            this.packer[b](a.rect)
        } else this.packer.pack(a.rect);
        return this._setMaxXY(a.rect), a.rect
    }, j.shiftLayout = function() {
        this.isShifting = !0, this.layout(), delete this.isShifting
    }, j._getPackMethod = function() {
        return this._getOption("horizontal") ? "rowPack" : "columnPack"
    }, j._setMaxXY = function(a) {
        this.maxX = Math.max(a.x + a.width, this.maxX), this.maxY = Math.max(a.y + a.height, this.maxY)
    }, j._setRectSize = function(b, c) {
        var d = a(b),
            e = d.outerWidth,
            f = d.outerHeight;
        (e || f) && (e = this._applyGridGutter(e, this.columnWidth), f = this._applyGridGutter(f, this.rowHeight)), c.width = Math.min(e, this.packer.width), c.height = Math.min(f, this.packer.height)
    }, j._applyGridGutter = function(a, b) {
        if (!b) return a + this.gutter;
        b += this.gutter;
        var c = a % b,
            d = c && 1 > c ? "round" : "ceil";
        return a = Math[d](a / b) * b
    }, j._getContainerSize = function() {
        return this._getOption("horizontal") ? {
            width: this.maxX - this.gutter
        } : {
            height: this.maxY - this.gutter
        }
    }, j._manageStamp = function(a) {
        var b, d = this.getItem(a);
        if (d && d.isPlacing) b = d.rect;
        else {
            var e = this._getElementOffset(a);
            b = new c({
                x: this._getOption("originLeft") ? e.left : e.right,
                y: this._getOption("originTop") ? e.top : e.bottom
            })
        }
        this._setRectSize(a, b), this.packer.placed(b), this._setMaxXY(b)
    }, j.sortItemsByPosition = function() {
        var a = this._getOption("horizontal") ? g : f;
        this.items.sort(a)
    }, j.fit = function(a, b, c) {
        var d = this.getItem(a);
        d && (this.stamp(d.element), d.enablePlacing(), this.updateShiftTargets(d), b = void 0 === b ? d.rect.x : b, c = void 0 === c ? d.rect.y : c, this.shift(d, b, c), this._bindFitEvents(d), d.moveTo(d.rect.x, d.rect.y), this.shiftLayout(), this.unstamp(d.element), this.sortItemsByPosition(), d.disablePlacing())
    }, j._bindFitEvents = function(a) {
        function b() {
            d++, 2 == d && c.dispatchEvent("fitComplete", null, [a])
        }
        var c = this,
            d = 0;
        a.once("layout", b), this.once("layoutComplete", b)
    }, j.resize = function() {
        this.isResizeBound && this.needsResizeLayout() && (this.options.shiftPercentResize ? this.resizeShiftPercentLayout() : this.layout())
    }, j.needsResizeLayout = function() {
        var b = a(this.element),
            c = this._getOption("horizontal") ? "innerHeight" : "innerWidth";
        return b[c] != this.size[c]
    }, j.resizeShiftPercentLayout = function() {
        var b = this._getItemsForLayout(this.items),
            c = this._getOption("horizontal"),
            d = c ? "y" : "x",
            e = c ? "height" : "width",
            f = c ? "rowHeight" : "columnWidth",
            g = c ? "innerHeight" : "innerWidth",
            h = this[f];
        if (h = h && h + this.gutter) {
            this._getMeasurements();
            var i = this[f] + this.gutter;
            b.forEach(function(a) {
                var b = Math.round(a.rect[d] / h);
                a.rect[d] = b * i
            })
        } else {
            var j = a(this.element)[g] + this.gutter,
                k = this.packer[e];
            b.forEach(function(a) {
                a.rect[d] = a.rect[d] / k * j
            })
        }
        this.shiftLayout()
    }, j.itemDragStart = function(a) {
        if (this.isEnabled) {
            this.stamp(a);
            var b = this.getItem(a);
            b && (b.enablePlacing(), b.showDropPlaceholder(), this.dragItemCount++, this.updateShiftTargets(b))
        }
    }, j.updateShiftTargets = function(a) {
        this.shiftPacker.reset(), this._getBoundingRect();
        var b = this._getOption("originLeft"),
            d = this._getOption("originTop");
        this.stamps.forEach(function(a) {
            var e = this.getItem(a);
            if (!e || !e.isPlacing) {
                var f = this._getElementOffset(a),
                    g = new c({
                        x: b ? f.left : f.right,
                        y: d ? f.top : f.bottom
                    });
                this._setRectSize(a, g), this.shiftPacker.placed(g)
            }
        }, this);
        var e = this._getOption("horizontal"),
            f = e ? "rowHeight" : "columnWidth",
            g = e ? "height" : "width";
        this.shiftTargetKeys = [], this.shiftTargets = [];
        var h, i = this[f];
        if (i = i && i + this.gutter) {
            var j = Math.ceil(a.rect[g] / i),
                k = Math.floor((this.shiftPacker[g] + this.gutter) / i);
            h = (k - j) * i;
            for (var l = 0; k > l; l++) this._addShiftTarget(l * i, 0, h)
        } else h = this.shiftPacker[g] + this.gutter - a.rect[g], this._addShiftTarget(0, 0, h);
        var m = this._getItemsForLayout(this.items),
            n = this._getPackMethod();
        m.forEach(function(a) {
            var b = a.rect;
            this._setRectSize(a.element, b), this.shiftPacker[n](b), this._addShiftTarget(b.x, b.y, h);
            var c = e ? b.x + b.width : b.x,
                d = e ? b.y : b.y + b.height;
            if (this._addShiftTarget(c, d, h), i)
                for (var f = Math.round(b[g] / i), j = 1; f > j; j++) {
                    var k = e ? c : b.x + i * j,
                        l = e ? b.y + i * j : d;
                    this._addShiftTarget(k, l, h)
                }
        }, this)
    }, j._addShiftTarget = function(a, b, c) {
        var d = this._getOption("horizontal") ? b : a;
        if (!(0 !== d && d > c)) {
            var e = a + "," + b,
                f = -1 != this.shiftTargetKeys.indexOf(e);
            f || (this.shiftTargetKeys.push(e), this.shiftTargets.push({
                x: a,
                y: b
            }))
        }
    }, j.shift = function(a, b, c) {
        var d, e = 1 / 0,
            f = {
                x: b,
                y: c
            };
        this.shiftTargets.forEach(function(a) {
            var b = h(a, f);
            e > b && (d = a, e = b)
        }), a.rect.x = d.x, a.rect.y = d.y
    };
    var k = 120;
    j.itemDragMove = function(a, b, c) {
        function d() {
            f.shift(e, b, c), e.positionDropPlaceholder(), f.layout()
        }
        var e = this.isEnabled && this.getItem(a);
        if (e) {
            b -= this.size.paddingLeft, c -= this.size.paddingTop;
            var f = this,
                g = new Date;
            this._itemDragTime && g - this._itemDragTime < k ? (clearTimeout(this.dragTimeout), this.dragTimeout = setTimeout(d, k)) : (d(), this._itemDragTime = g)
        }
    }, j.itemDragEnd = function(a) {
        function b() {
            d++, 2 == d && (c.element.classList.remove("is-positioning-post-drag"), c.hideDropPlaceholder(), e.dispatchEvent("dragItemPositioned", null, [c]))
        }
        var c = this.isEnabled && this.getItem(a);
        if (c) {
            clearTimeout(this.dragTimeout), c.element.classList.add("is-positioning-post-drag");
            var d = 0,
                e = this;
            c.once("layout", b), this.once("layoutComplete", b), c.moveTo(c.rect.x, c.rect.y), this.layout(), this.dragItemCount = Math.max(0, this.dragItemCount - 1), this.sortItemsByPosition(), c.disablePlacing(), this.unstamp(c.element)
        }
    }, j.bindDraggabillyEvents = function(a) {
        this._bindDraggabillyEvents(a, "on")
    }, j.unbindDraggabillyEvents = function(a) {
        this._bindDraggabillyEvents(a, "off")
    }, j._bindDraggabillyEvents = function(a, b) {
        var c = this.handleDraggabilly;
        a[b]("dragStart", c.dragStart), a[b]("dragMove", c.dragMove), a[b]("dragEnd", c.dragEnd)
    }, j.bindUIDraggableEvents = function(a) {
        this._bindUIDraggableEvents(a, "on")
    }, j.unbindUIDraggableEvents = function(a) {
        this._bindUIDraggableEvents(a, "off")
    }, j._bindUIDraggableEvents = function(a, b) {
        var c = this.handleUIDraggable;
        a[b]("dragstart", c.start)[b]("drag", c.drag)[b]("dragstop", c.stop)
    };
    var l = j.destroy;
    return j.destroy = function() {
        l.apply(this, arguments), this.isEnabled = !1
    }, i.Rect = c, i.Packer = d, i
}),
function(a, b) {
    "function" == typeof define && define.amd ? define(["isotope/js/layout-mode", "packery/js/packery"], b) : "object" == typeof module && module.exports ? module.exports = b(require("isotope-layout/js/layout-mode"), require("packery")) : b(a.Isotope.LayoutMode, a.Packery)
}(window, function(a, b) {
    var c = a.create("packery"),
        d = c.prototype,
        e = {
            _getElementOffset: !0,
            _getMeasurement: !0
        };
    for (var f in b.prototype) e[f] || (d[f] = b.prototype[f]);
    var g = d._resetLayout;
    d._resetLayout = function() {
        this.packer = this.packer || new b.Packer, this.shiftPacker = this.shiftPacker || new b.Packer, g.apply(this, arguments)
    };
    var h = d._getItemLayoutPosition;
    d._getItemLayoutPosition = function(a) {
        return a.rect = a.rect || new b.Rect, h.call(this, a)
    };
    var i = d.needsResizeLayout;
    d.needsResizeLayout = function() {
        return this._getOption("horizontal") ? this.needsVerticalResizeLayout() : i.call(this)
    };
    var j = d._getOption;
    return d._getOption = function(a) {
        return "horizontal" == a ? void 0 !== this.options.isHorizontal ? this.options.isHorizontal : this.options.horizontal : j.apply(this.isotope, arguments)
    }, c
});
(function($) {
    "use strict";
    $.fn.avia_masonry = function(options) {
        if (!this.length) return this;
        var the_body = $('body'),
            the_win = $(window),
            isMobile = $.avia_utilities.isMobile,
            loading = false,
            methods = {
                masonry_filter: function() {
                    var current = $(this),
                        linktext = current.html(),
                        selector = current.data('filter'),
                        masonry = current.parents('.av-masonry:eq(0)'),
                        container = masonry.find('.av-masonry-container:eq(0)'),
                        links = masonry.find('.av-masonry-sort a'),
                        activeCat = masonry.find('.av-current-sort-title');
                    links.removeClass('active_sort');
                    current.addClass('active_sort');
                    container.attr('id', 'masonry_id_' + selector);
                    if (activeCat.length) activeCat.html(linktext);
                    methods.applyMasonry(container, selector, function() {
                        container.css({
                            overflow: 'visible'
                        });
                    });
                    setTimeout(function() {
                        the_win.trigger('debouncedresize');
                    }, 500);
                    return false;
                },
                applyMasonry: function(container, selector, callback) {
                    var filters = selector ? {
                        filter: '.' + selector
                    } : {};
                    filters['layoutMode'] = 'packery';
                    filters['packery'] = {
                        gutter: 0
                    };
                    filters['percentPosition'] = true;
                    filters['itemSelector'] = "a.isotope-item, div.isotope-item";
                    filters['originLeft'] = $('body').hasClass('rtl') ? false : true;
                    container.isotope(filters, function() {
                        the_win.trigger('av-height-change');
                    });
                    if (typeof callback === 'function') {
                        setTimeout(callback, 0);
                    }
                },
                show_bricks: function(bricks, callback) {
                    bricks.each(function(i) {
                        var currentLink = $(this),
                            browserPrefix = $.avia_utilities.supports('transition'),
                            multiplier = isMobile ? 0 : 100;
                        setTimeout(function() {
                            if (browserPrefix === false) {
                                currentLink.css({
                                    visibility: "visible",
                                    opacity: 0
                                }).animate({
                                    opacity: 1
                                }, 1500);
                            } else {
                                currentLink.addClass('av-masonry-item-loaded');
                            }
                            if (i == bricks.length - 1 && typeof callback == 'function') {
                                callback.call();
                                the_win.trigger('av-height-change');
                            }
                        }, (multiplier * i));
                    });
                },
                loadMore: function(e) {
                    e.preventDefault();
                    if (loading) return false;
                    loading = true;
                    var current = $(this),
                        data = current.data(),
                        masonry = current.parents('.av-masonry:eq(0)'),
                        container = masonry.find('.av-masonry-container'),
                        items = masonry.find('.av-masonry-entry'),
                        loader = $.avia_utilities.loading(),
                        finished = function() {
                            loading = false;
                            loader.hide();
                            the_body.trigger('av_resize_finished');
                        };
                    if (!data.offset) {
                        data.offset = 0;
                    }
                    data.offset += data.items;
                    data.action = 'avia_ajax_masonry_more';
                    data.loaded = [];
                    items.each(function() {
                        var item_id = $(this).data('av-masonry-item');
                        if (item_id) data.loaded.push(item_id);
                    });
                    $.ajax({
                        url: avia_framework_globals.ajaxurl,
                        type: "POST",
                        data: data,
                        beforeSend: function() {
                            loader.show();
                        },
                        success: function(response) {
                            if (response.indexOf("{av-masonry-loaded}") !== -1) {
                                var response = response.split('{av-masonry-loaded}'),
                                    new_items = $(response.pop()).filter('.isotope-item');
                                if (new_items.length > data.items) {
                                    new_items = new_items.not(':last');
                                } else {
                                    current.addClass('av-masonry-no-more-items');
                                }
                                var load_container = $('<div class="loadcontainer"></div>').append(new_items);
                                $.avia_utilities.preload({
                                    container: load_container,
                                    single_callback: function() {
                                        var links = masonry.find('.av-masonry-sort a'),
                                            filter_container = masonry.find('.av-sort-by-term'),
                                            allowed_filters = filter_container.data("av-allowed-sort");
                                        filter_container.hide();
                                        loader.hide();
                                        container.isotope('insert', new_items);
                                        $.avia_utilities.avia_ajax_call(masonry);
                                        setTimeout(function() {
                                            methods.show_bricks(new_items, finished);
                                        }, 150);
                                        setTimeout(function() {
                                            the_win.trigger('av-height-change');
                                        }, 550);
                                        if (links) {
                                            $(links).each(function(filterlinkindex) {
                                                var filterlink = $(this),
                                                    sort = filterlink.data('filter');
                                                if (new_items) {
                                                    $(new_items).each(function(itemindex) {
                                                        var item = $(this);
                                                        if (item.hasClass(sort) && allowed_filters.indexOf(sort) !== -1) {
                                                            var term_count = filterlink.find('.avia-term-count').text();
                                                            filterlink.find('.avia-term-count').text(' ' + (parseInt(term_count) + 1) + ' ');
                                                            if (filterlink.hasClass('avia_hide_sort')) {
                                                                filterlink.removeClass('avia_hide_sort').addClass('avia_show_sort');
                                                                masonry.find('.av-masonry-sort .' + sort + '_sep').removeClass('avia_hide_sort').addClass('avia_show_sort');
                                                                masonry.find('.av-masonry-sort .av-sort-by-term').removeClass('hidden');
                                                            }
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                        filter_container.fadeIn();
                                    }
                                });
                            } else {
                                finished();
                            }
                        },
                        error: finished,
                        complete: function() {
                            setTimeout(function() {
                                the_win.trigger('debouncedresize');
                            }, 500);
                        }
                    });
                }
            };
        return this.each(function() {
            var masonry = $(this),
                container = masonry.find('.av-masonry-container'),
                bricks = masonry.find('.isotope-item'),
                filter = masonry.find('.av-masonry-sort').css({
                    visibility: "visible",
                    opacity: 0
                }).on('click', 'a', methods.masonry_filter),
                load_more = masonry.find('.av-masonry-load-more').css({
                    visibility: "visible",
                    opacity: 0
                });
            $.avia_utilities.preload({
                container: container,
                single_callback: function() {
                    var start_animation = function() {
                        filter.animate({
                            opacity: 1
                        }, 400);
                        if (container.outerHeight() + container.offset().top + $('#footer').outerHeight() > $(window).height()) {
                            $('html').css({
                                'overflow-y': 'scroll'
                            });
                        }
                        methods.applyMasonry(container, false, function() {
                            masonry.addClass('avia_sortable_active');
                            container.removeClass('av-js-disabled ');
                        });
                        methods.show_bricks(bricks, function() {
                            load_more.css({
                                opacity: 1
                            }).on('click', methods.loadMore);
                        });
                    };
                    if (isMobile) {
                        start_animation();
                    } else {
                        masonry.waypoint(start_animation, {
                            offset: '80%'
                        });
                    }
                    $(window).on('debouncedresize', function() {
                        methods.applyMasonry(container, false, function() {
                            masonry.addClass('avia_sortable_active');
                        });
                    });
                }
            });
        });
    };
}(jQuery));
(function($) {
    "use strict";
    $.avia_utilities = $.avia_utilities || {};
    $(document).ready(function() {
        $.avia_utilities = $.avia_utilities || {};
        if ($.avia_utilities.avia_sticky_submenu)
            $.avia_utilities.avia_sticky_submenu();
    });
    $.avia_utilities.avia_sticky_submenu = function() {
        var win = $(window),
            html = $('html:first'),
            header = $('.html_header_top.html_header_sticky #header'),
            html_margin = parseInt($('html:first').css('margin-top'), 10),
            setWitdth = $('.html_header_sidebar #main, .boxed #main'),
            menus = $('.av-submenu-container'),
            bordermod = html.is('.html_minimal_header') ? 0 : 1,
            fixed_frame = $('.av-frame-top').height(),
            calc_margin = function() {
                html_margin = parseInt(html.css('margin-top'), 10);
                if (!$('.mobile_menu_toggle:visible').length) {
                    $('.av-open-submenu').removeClass('av-open-submenu');
                }
                menus.filter('.av-sticky-submenu').each(function() {
                    $(this).next('.sticky_placeholder').height($(this).height());
                });
            },
            calc_values = function() {
                var content_width = setWitdth.width();
                html_margin = parseInt(html.css('margin-top'), 10);
                menus.width(content_width);
            },
            check = function(placeholder, no_timeout) {
                var menu_pos = this.offset().top,
                    top_pos = placeholder.offset().top,
                    scrolled = win.scrollTop(),
                    modifier = html_margin,
                    fixed = false;
                if (header.length) {
                    modifier += header.outerHeight() + parseInt(header.css('margin-top'), 10);
                }
                if (fixed_frame) {
                    modifier += fixed_frame;
                }
                if (scrolled + modifier > top_pos) {
                    if (!fixed) {
                        this.css({
                            top: modifier - bordermod,
                            position: 'fixed'
                        });
                        fixed = true
                    }
                } else {
                    this.css({
                        top: 'auto',
                        position: 'absolute'
                    });
                    fixed = false
                }
            },
            toggle = function(e) {
                e.preventDefault();
                var clicked = $(this),
                    menu = clicked.siblings('.av-subnav-menu');
                if (menu.hasClass('av-open-submenu')) {
                    menu.removeClass('av-open-submenu');
                } else {
                    menu.addClass('av-open-submenu');
                }
            };
        win.on("debouncedresize av-height-change", calc_margin);
        calc_margin();
        if (setWitdth.length) {
            win.on("debouncedresize av-height-change", calc_values);
            calc_values();
        }
        menus.each(function() {
            var menu = $(this),
                sticky = menu.filter('.av-sticky-submenu'),
                placeholder = menu.next('.sticky_placeholder'),
                mobile_button = menu.find('.mobile_menu_toggle');
            if (sticky.length) win.on('scroll', function() {
                window.requestAnimationFrame($.proxy(check, sticky, placeholder))
            });
            if (mobile_button.length) {
                mobile_button.on('click', toggle);
            }
        });
        html.on('click', '.av-submenu-hidden .av-open-submenu li a', function() {
            var current = $(this);
            var list_item = current.siblings('ul, .avia_mega_div');
            if (list_item.length) {
                if (list_item.hasClass('av-visible-sublist')) {
                    list_item.removeClass('av-visible-sublist');
                } else {
                    list_item.addClass('av-visible-sublist');
                }
                return false;
            }
        });
        $('.avia_mobile').on('click', '.av-menu-mobile-disabled li a', function() {
            var current = $(this);
            var list_item = current.siblings('ul');
            if (list_item.length) {
                if (list_item.hasClass('av-visible-mobile-sublist')) {} else {
                    $('.av-visible-mobile-sublist').removeClass('av-visible-mobile-sublist');
                    list_item.addClass('av-visible-mobile-sublist');
                    return false;
                }
            }
        });
    }
}(jQuery));
(function($) {
    "use strict";
    $.fn.avia_sc_messagebox = function(options) {
        "use strict";
        return this.each(function() {
            var container = $(this),
                close_btn = container.find('.av_message_close'),
                mbox_ID = container.attr('id'),
                aviaSetCookie = function(CookieName, CookieValue, CookieDays) {
                    if (CookieDays) {
                        var date = new Date();
                        date.setTime(date.getTime() + (CookieDays * 24 * 60 * 60 * 1000));
                        var expires = "; expires=" + date.toGMTString();
                    } else var expires = "";
                    document.cookie = CookieName + "=" + CookieValue + expires + "; path=/";
                },
                aviaGetCookie = function(CookieName) {
                    var docCookiesStr = CookieName + "=";
                    var docCookiesArr = document.cookie.split(';');
                    for (var i = 0; i < docCookiesArr.length; i++) {
                        var thisCookie = docCookiesArr[i];
                        while (thisCookie.charAt(0) == ' ') {
                            thisCookie = thisCookie.substring(1, thisCookie.length);
                        }
                        if (thisCookie.indexOf(docCookiesStr) == 0) {
                            var cookieContents = container.attr('data-contents');
                            var savedContents = thisCookie.substring(docCookiesStr.length, thisCookie.length);
                            if (savedContents == cookieContents) {
                                return savedContents;
                            }
                        }
                    }
                    return null;
                };
            if (!aviaGetCookie(mbox_ID)) {
                container.removeClass('messagebox-hidden');
            }
            close_btn.on('click', function() {
                var cookieContents = container.attr('data-contents');
                if (container.hasClass('messagebox-session_cookie')) {
                    var cookieLifetime = "";
                } else if (container.hasClass('messagebox-custom_cookie')) {
                    var cookieLifetime = parseInt(container.attr('data-cookielifetime'));
                }
                aviaSetCookie(mbox_ID, cookieContents, cookieLifetime);
                container.addClass('messagebox-hidden');
            });
        });
    };
    $('.avia_message_box').avia_sc_messagebox();
}(jQuery));
(function($) {
    $.fn.avia_sc_animated_number = function(options) {
        if (!this.length) return;
        if (this.is('.avia_sc_animated_number_active')) return;
        this.addClass('avia_sc_animated_number_active');
        var skipStep = false,
            simple_upcount = (options && options.simple_up) ? true : false,
            start_timer = (options && options.start_timer) ? options.start_timer : 300,
            start_count = function(element, countTo, increment, current, fakeCountTo) {
                var newCount = current + increment;
                if (newCount >= fakeCountTo) {
                    element.text(countTo);
                } else {
                    var prepend = "",
                        addZeros = countTo.toString().length - newCount.toString().length
                    for (var i = addZeros; i > 0; i--) {
                        prepend += "0";
                    }
                    if (simple_upcount) prepend = 0;
                    element.text(prepend + newCount);
                    window.requestAnimationFrame(function() {
                        start_count(element, countTo, increment, newCount, fakeCountTo)
                    });
                }
            };
        return this.each(function() {
            var number_container = $(this),
                elements = number_container.find('.__av-single-number'),
                countTimer = number_container.data('timer') || 3000;
            elements.each(function(i) {
                var element = $(this),
                    text = element.text();
                if (window.addEventListener) element.text(text.replace(/./g, "0"));
            });
            number_container.addClass('number_prepared').on('avia_start_animation', function() {
                if (number_container.is('.avia_animation_done')) return;
                number_container.addClass('avia_animation_done');
                elements.each(function(i) {
                    var element = $(this),
                        countTo = element.data('number'),
                        fakeCountTo = countTo,
                        current = parseInt(element.text(), 10),
                        zeroOnly = /^0+$/.test(countTo),
                        increment = 0;
                    if (zeroOnly && countTo !== 0) fakeCountTo = countTo.replace(/0/g, '9');
                    increment = Math.round(fakeCountTo * 32 / countTimer);
                    if (increment == 0 || increment % 10 == 0) increment += 1;
                    setTimeout(function() {
                        start_count(element, countTo, increment, current, fakeCountTo);
                    }, start_timer);
                });
            });
            if (options && options.instant_start == true) {
                number_container.trigger('avia_start_animation');
            }
        });
    }
})(jQuery);
(function($) {
    "use strict";
    $.avia_utilities = $.avia_utilities || {};
    $.fn.avia_iso_sort = function(options) {
        return this.each(function() {
            var the_body = $('body'),
                container = $(this),
                portfolio_id = container.data('portfolio-id'),
                parentContainer = container.parents('.entry-content-wrapper, .avia-fullwidth-portfolio'),
                filter = parentContainer.find('.sort_width_container[data-portfolio-id="' + portfolio_id + '"]').find('#js_sort_items').css({
                    visibility: "visible",
                    opacity: 0
                }),
                links = filter.find('a'),
                imgParent = container.find('.grid-image'),
                isoActive = false,
                items = $('.post-entry', container),
                is_originLeft = the_body.hasClass('rtl') ? false : true;

            function applyIso() {
                container.addClass('isotope_activated').isotope({
                    layoutMode: 'fitRows',
                    itemSelector: '.flex_column',
                    originLeft: is_originLeft
                });
                container.isotope('on', 'layoutComplete', function() {
                    container.css({
                        overflow: 'visible'
                    });
                    the_body.trigger('av_resize_finished');
                });
                isoActive = true;
                setTimeout(function() {
                    parentContainer.addClass('avia_sortable_active');
                }, 0);
            };
            links.bind('click', function() {
                var current = $(this),
                    selector = current.data('filter'),
                    linktext = current.html(),
                    activeCat = parentContainer.find('.av-current-sort-title');
                if (activeCat.length) activeCat.html(linktext);
                links.removeClass('active_sort');
                current.addClass('active_sort');
                container.attr('id', 'grid_id_' + selector);
                parentContainer.find('.open_container .ajax_controlls .avia_close').trigger('click');
                container.isotope({
                    layoutMode: 'fitRows',
                    itemSelector: '.flex_column',
                    filter: '.' + selector,
                    originLeft: is_originLeft
                });
                return false;
            });
            $(window).on('debouncedresize', function() {
                applyIso();
            });
            $.avia_utilities.preload({
                container: container,
                single_callback: function() {
                    filter.animate({
                        opacity: 1
                    }, 400);
                    applyIso();
                    setTimeout(function() {
                        applyIso();
                    });
                    imgParent.css({
                        height: 'auto'
                    }).each(function(i) {
                        var currentLink = $(this);
                        setTimeout(function() {
                            currentLink.animate({
                                opacity: 1
                            }, 1500);
                        }, (100 * i));
                    });
                }
            });
        });
    };
    $.fn.avia_portfolio_preview = function(passed_options) {
        var win = $(window),
            the_body = $('body'),
            isMobile = $.avia_utilities.isMobile,
            defaults = {
                open_in: '.portfolio-details-inner',
                easing: 'easeOutQuint',
                timing: 800,
                transition: 'slide'
            },
            options = $.extend({}, defaults, passed_options);
        return this.each(function() {
            var container = $(this),
                portfolio_id = container.data('portfolio-id'),
                target_wrap = $('.portfolio_preview_container[data-portfolio-id="' + portfolio_id + '"]'),
                target_container = target_wrap.find(options.open_in),
                items = container.find('.grid-entry'),
                content_retrieved = {},
                is_open = false,
                animating = false,
                index_open = false,
                ajax_call = false,
                methods, controls, loader = $.avia_utilities.loading();
            methods = {
                load_item: function(e) {
                    e.preventDefault();
                    var link = $(this),
                        post_container = link.parents('.post-entry:eq(0)'),
                        post_id = "ID_" + post_container.data('ajax-id'),
                        clickedIndex = items.index(post_container);
                    if (post_id === is_open || animating == true) {
                        return false;
                    }
                    animating = true;
                    container.find('.active_portfolio_item').removeClass('active_portfolio_item');
                    post_container.addClass('active_portfolio_item');
                    loader.show();
                    methods.ajax_get_contents(post_id, clickedIndex);
                },
                scroll_top: function() {
                    setTimeout(function() {
                        var target_offset = target_wrap.offset().top - 175,
                            window_offset = win.scrollTop();
                        if (window_offset > target_offset || target_offset - window_offset > 100) {
                            $('html:not(:animated),body:not(:animated)').animate({
                                scrollTop: target_offset
                            }, options.timing, options.easing);
                        }
                    }, 10);
                },
                attach_item: function(post_id) {
                    content_retrieved[post_id] = $(content_retrieved[post_id]).appendTo(target_container);
                    ajax_call = true;
                },
                remove_video: function() {
                    var del = target_wrap.find('iframe, .avia-video').parents('.ajax_slide:not(.open_slide)');
                    if (del.length > 0) {
                        del.remove();
                        content_retrieved["ID_" + del.data('slideId')] = undefined;
                    }
                },
                show_item: function(post_id, clickedIndex) {
                    if (post_id === is_open) {
                        return false;
                    }
                    animating = true;
                    loader.hide();
                    if (false === is_open) {
                        target_wrap.addClass('open_container');
                        content_retrieved[post_id].addClass('open_slide');
                        methods.scroll_top();
                        target_wrap.css({
                            display: 'none'
                        }).slideDown(options.timing, options.easing, function() {
                            if (ajax_call) {
                                $.avia_utilities.activate_shortcode_scripts(content_retrieved[post_id]);
                                $.avia_utilities.avia_ajax_call(content_retrieved[post_id]);
                                the_body.trigger('av_resize_finished');
                                ajax_call = false;
                            }
                            methods.remove_video();
                            the_body.trigger('av_resize_finished');
                        });
                        index_open = clickedIndex;
                        is_open = post_id;
                        animating = false;
                    } else {
                        methods.scroll_top();
                        var initCSS = {
                                zIndex: 3
                            },
                            easing = options.easing;
                        if (index_open > clickedIndex) {
                            initCSS.left = '-110%';
                        }
                        if (options.transition === 'fade') {
                            initCSS.left = '0%';
                            initCSS.opacity = 0;
                            easing = 'easeOutQuad';
                        }
                        target_container.height(target_container.height());
                        content_retrieved[post_id].css(initCSS).avia_animate({
                            'left': "0%",
                            opacity: 1
                        }, options.timing, easing);
                        content_retrieved[is_open].avia_animate({
                            opacity: 0
                        }, options.timing, easing, function() {
                            content_retrieved[is_open].attr({
                                'style': ""
                            }).removeClass('open_slide');
                            content_retrieved[post_id].addClass('open_slide');
                            target_container.avia_animate({
                                height: content_retrieved[post_id].outerHeight() + 2
                            }, options.timing / 2, options.easing, function() {
                                target_container.attr({
                                    'style': ""
                                });
                                is_open = post_id;
                                index_open = clickedIndex;
                                animating = false;
                                methods.remove_video();
                                if (ajax_call) {
                                    the_body.trigger('av_resize_finished');
                                    $.avia_utilities.activate_shortcode_scripts(content_retrieved[post_id]);
                                    $.avia_utilities.avia_ajax_call(content_retrieved[post_id]);
                                    ajax_call = false;
                                }
                            });
                        });
                    }
                },
                ajax_get_contents: function(post_id, clickedIndex) {
                    if (content_retrieved[post_id] !== undefined) {
                        methods.show_item(post_id, clickedIndex);
                        return;
                    }
                    var template = $('#avia-tmpl-portfolio-preview-' + post_id.replace(/ID_/, ""));
                    if (template.length == 0) {
                        setTimeout(function() {
                            methods.ajax_get_contents(post_id, clickedIndex);
                            return;
                        }, 500);
                    }
                    content_retrieved[post_id] = template.html();
                    content_retrieved[post_id] = content_retrieved[post_id].replace('/*<![CDATA[*/', '').replace('*]]>', '');
                    methods.attach_item(post_id);
                    $.avia_utilities.preload({
                        container: content_retrieved[post_id],
                        single_callback: function() {
                            methods.show_item(post_id, clickedIndex);
                        }
                    });
                },
                add_controls: function() {
                    controls = target_wrap.find('.ajax_controlls');
                    target_wrap.avia_keyboard_controls({
                        27: '.avia_close',
                        37: '.ajax_previous',
                        39: '.ajax_next'
                    });
                    items.each(function() {
                        var current = $(this),
                            overlay;
                        current.addClass('no_combo').bind('click', function(event) {
                            overlay = current.find('.slideshow_overlay');
                            if (overlay.length) {
                                event.stopPropagation();
                                methods.load_item.apply(current.find('a:eq(0)'));
                                return false;
                            }
                        });
                    });
                },
                control_click: function() {
                    var showItem, activeID = container.find('.active_portfolio_item').data('ajax-id'),
                        active = container.find('.post-entry-' + activeID);
                    switch (this.hash) {
                        case '#next':
                            showItem = active.nextAll('.post-entry:visible:eq(0)').find('a:eq(0)');
                            if (!showItem.length) {
                                showItem = $('.post-entry:visible:eq(0)', container).find('a:eq(0)');
                            }
                            showItem.trigger('click');
                            break;
                        case '#prev':
                            showItem = active.prevAll('.post-entry:visible:eq(0)').find('a:eq(0)');
                            if (!showItem.length) {
                                showItem = $('.post-entry:visible:last', container).find('a:eq(0)');
                            }
                            showItem.trigger('click');
                            break;
                        case '#close':
                            animating = true;
                            target_wrap.slideUp(options.timing, options.easing, function() {
                                container.find('.active_portfolio_item').removeClass('active_portfolio_item');
                                content_retrieved[is_open].attr({
                                    'style': ""
                                }).removeClass('open_slide');
                                target_wrap.removeClass('open_container');
                                animating = is_open = index_open = false;
                                methods.remove_video();
                                the_body.trigger('av_resize_finished');
                            });
                            break;
                    }
                    return false;
                },
                resize_reset: function() {
                    if (is_open === false) {
                        target_container.html('');
                        content_retrieved = [];
                    }
                }
            };
            methods.add_controls();
            container.on("click", "a", methods.load_item);
            controls.on("click", "a", methods.control_click);
            if (jQuery.support.leadingWhitespace) {
                win.bind('debouncedresize', methods.resize_reset);
            }
        });
    };
}(jQuery));
(function($) {
    "use strict";
    $.fn.avia_sc_progressbar = function(options) {
        return this.each(function() {
            var container = $(this),
                elements = container.find('.avia-progress-bar');
            container.on('avia_start_animation', function() {
                elements.each(function(i) {
                    var element = $(this)
                    setTimeout(function() {
                        element.find('.progress').addClass('avia_start_animation')
                        element.find('.progressbar-percent').avia_sc_animated_number({
                            instant_start: true,
                            simple_up: true,
                            start_timer: 10
                        });
                    }, (i * 250));
                });
            });
        });
    }
}(jQuery));
(function($) {
    "use strict";
    $.AviaVideoAPI = function(options, video, option_container) {
        this.videoElement = video;
        this.$video = $(video);
        this.$option_container = option_container ? $(option_container) : this.$video;
        this.load_btn = this.$option_container.find('.av-click-to-play-overlay');
        this.video_wrapper = this.$video.parents('ul').eq(0);
        this.lazy_load = this.video_wrapper.hasClass('av-show-video-on-click') ? true : false;
        this.isMobile = $.avia_utilities.isMobile;
        this.fallback = this.isMobile ? this.$option_container.is('.av-mobile-fallback-image') : false;
        if (this.fallback) return;
        this._init(options);
    }
    $.AviaVideoAPI.defaults = {
        loop: false,
        mute: false,
        controls: false,
        events: 'play pause mute unmute loop toggle reset unload'
    };
    $.AviaVideoAPI.apiFiles = {
        youtube: {
            loaded: false,
            src: 'https://www.youtube.com/iframe_api'
        }
    }
    $.AviaVideoAPI.players = {}
    $.AviaVideoAPI.prototype = {
        _init: function(options) {
            this.options = this._setOptions(options);
            this.type = this._getPlayerType();
            this.player = false;
            this._bind_player();
            this.eventsBound = false;
            this.playing = false;
            this.$option_container.addClass('av-video-paused');
            this.pp = $.avia_utilities.playpause(this.$option_container);
        },
        _setOptions: function(options) {
            var newOptions = $.extend(true, {}, $.AviaVideoAPI.defaults, options),
                htmlData = this.$option_container.data(),
                i = "";
            for (i in htmlData) {
                if (htmlData.hasOwnProperty(i) && (typeof htmlData[i] === "string" || typeof htmlData[i] === "number" || typeof htmlData[i] === "boolean")) {
                    newOptions[i] = htmlData[i];
                }
            }
            return newOptions;
        },
        _getPlayerType: function() {
            var vid_src = this.$video.get(0).src || this.$video.data('src');
            if (this.$video.is('video')) return 'html5';
            if (this.$video.is('.av_youtube_frame')) return 'youtube';
            if (vid_src.indexOf('vimeo.com') != -1) return 'vimeo';
            if (vid_src.indexOf('youtube.com') != -1) return 'youtube';
        },
        _bind_player: function() {
            var _self = this;
            if (document.cookie.match(/aviaPrivacyVideoEmbedsDisabled/)) {
                this._use_external_link();
                return;
            }
            if (this.lazy_load && this.load_btn.length && this.type != "html5") {
                this.$option_container.addClass('av-video-lazyload');
                this.load_btn.on('click', function() {
                    _self.load_btn.remove();
                    _self._setPlayer();
                });
            } else {
                this.lazy_load = false;
                this._setPlayer();
            }
        },
        _use_external_link: function() {
            this.$option_container.addClass('av-video-lazyload');
            this.load_btn.on('click', function(e) {
                if (e.originalEvent === undefined) return;
                var src_url = $(this).parents('.avia-slide-wrap').find('div[data-original_url]').data('original_url');
                if (src_url) window.open(src_url, '_blank');
            });
        },
        _setPlayer: function() {
            var _self = this;
            switch (this.type) {
                case "html5":
                    this.player = this.$video.data('mediaelementplayer');
                    if (!this.player) {
                        this.$video.data('mediaelementplayer', $.AviaVideoAPI.players[this.$video.attr('id').replace(/_html5/, '')]);
                        this.player = this.$video.data('mediaelementplayer');
                    }
                    this._playerReady();
                    break;
                case "vimeo":
                    var ifrm = document.createElement("iframe");
                    var $ifrm = $(ifrm);
                    ifrm.onload = function() {
                        _self.player = Froogaloop(ifrm);
                        _self._playerReady();
                        _self.$option_container.trigger('av-video-loaded');
                    };
                    ifrm.setAttribute("src", this.$video.data('src'));
                    $ifrm.insertAfter(this.$video);
                    this.$video.remove();
                    this.$video = ifrm;
                    break;
                case "youtube":
                    this._getAPI(this.type);
                    $('body').on('av-youtube-iframe-api-loaded', function() {
                        _self._playerReady();
                    });
                    break;
            }
        },
        _getAPI: function(api) {
            if ($.AviaVideoAPI.apiFiles[api].loaded === false) {
                $.AviaVideoAPI.apiFiles[api].loaded = true;
                var tag = document.createElement('script'),
                    first = document.getElementsByTagName('script')[0];
                tag.src = $.AviaVideoAPI.apiFiles[api].src;
                first.parentNode.insertBefore(tag, first);
            }
        },
        _playerReady: function() {
            var _self = this;
            this.$option_container.on('av-video-loaded', function() {
                _self._bindEvents();
            });
            switch (this.type) {
                case "html5":
                    this.$video.on('av-mediajs-loaded', function() {
                        _self.$option_container.trigger('av-video-loaded');
                    });
                    this.$video.on('av-mediajs-ended', function() {
                        _self.$option_container.trigger('av-video-ended');
                    });
                    break;
                case "vimeo":
                    _self.player.addEvent('ready', function() {
                        _self.$option_container.trigger('av-video-loaded');
                        _self.player.addEvent('finish', function() {
                            _self.$option_container.trigger('av-video-ended');
                        });
                    });
                    break;
                case "youtube":
                    var params = _self.$video.data();
                    if (_self._supports_video()) params.html5 = 1;
                    _self.player = new YT.Player(_self.$video.attr('id'), {
                        videoId: params.videoid,
                        height: _self.$video.attr('height'),
                        width: _self.$video.attr('width'),
                        playerVars: params,
                        events: {
                            'onReady': function() {
                                _self.$option_container.trigger('av-video-loaded');
                            },
                            'onError': function(player) {
                                $.avia_utilities.log('YOUTUBE ERROR:', 'error', player);
                            },
                            'onStateChange': function(event) {
                                if (event.data === YT.PlayerState.ENDED) {
                                    var command = _self.options.loop != false ? 'loop' : 'av-video-ended';
                                    _self.$option_container.trigger(command);
                                }
                            }
                        }
                    });
                    break;
            }
            setTimeout(function() {
                if (_self.eventsBound == true || typeof _self.eventsBound == 'undefined' || _self.type == 'youtube') {
                    return;
                }
                $.avia_utilities.log('Fallback Video Trigger "' + _self.type + '":', 'log', _self);
                _self.$option_container.trigger('av-video-loaded');
            }, 2000);
        },
        _bindEvents: function() {
            if (this.eventsBound == true || typeof this.eventsBound == 'undefined') {
                return;
            }
            var _self = this,
                volume = 'unmute';
            this.eventsBound = true;
            this.$option_container.on(this.options.events, function(e) {
                _self.api(e.type);
            });
            if (!_self.isMobile) {
                if (this.options.mute != false) {
                    volume = "mute";
                }
                if (this.options.loop != false) {
                    _self.api('loop');
                }
                _self.api(volume);
            }
            setTimeout(function() {
                _self.$option_container.trigger('av-video-events-bound').addClass('av-video-events-bound');
            }, 50);
        },
        _supports_video: function() {
            return !!document.createElement('video').canPlayType;
        },
        api: function(action) {
            if (this.isMobile && !this.was_started()) return;
            if (this.options.events.indexOf(action) === -1) return;
            this.$option_container.trigger('av-video-' + action + '-executed');
            if (typeof this['_' + this.type + '_' + action] == 'function') {
                this['_' + this.type + '_' + action].call(this);
            }
            if (typeof this['_' + action] == 'function') {
                this['_' + action].call(this);
            }
        },
        was_started: function() {
            if (!this.player) return false;
            switch (this.type) {
                case "html5":
                    if (this.player.getCurrentTime() > 0) return true;
                    break;
                case "vimeo":
                    if (this.player.api('getCurrentTime') > 0) return true;
                    break;
                case "youtube":
                    if (this.player.getPlayerState() !== -1) return true;
                    break;
            }
            return false;
        },
        _play: function() {
            this.playing = true;
            this.$option_container.addClass('av-video-playing').removeClass('av-video-paused');
        },
        _pause: function() {
            this.playing = false;
            this.$option_container.removeClass('av-video-playing').addClass('av-video-paused');
        },
        _loop: function() {
            this.options.loop = true;
        },
        _toggle: function() {
            var command = this.playing == true ? 'pause' : 'play';
            this.api(command);
            this.pp.set(command);
        },
        _vimeo_play: function() {
            this.player.api('play');
        },
        _vimeo_pause: function() {
            this.player.api('pause');
        },
        _vimeo_mute: function() {
            this.player.api('setVolume', 0);
        },
        _vimeo_unmute: function() {
            this.player.api('setVolume', 0.7);
        },
        _vimeo_loop: function() {},
        _vimeo_reset: function() {
            this.player.api('seekTo', 0);
        },
        _vimeo_unload: function() {
            this.player.api('unload');
        },
        _youtube_play: function() {
            this.player.playVideo();
        },
        _youtube_pause: function() {
            this.player.pauseVideo()
        },
        _youtube_mute: function() {
            this.player.mute();
        },
        _youtube_unmute: function() {
            this.player.unMute();
        },
        _youtube_loop: function() {
            if (this.playing == true) this.player.seekTo(0);
        },
        _youtube_reset: function() {
            this.player.stopVideo();
        },
        _youtube_unload: function() {
            this.player.clearVideo();
        },
        _html5_play: function() {
            if (this.player) {
                this.player.options.pauseOtherPlayers = false;
                this.player.play();
            }
        },
        _html5_pause: function() {
            if (this.player) this.player.pause();
        },
        _html5_mute: function() {
            if (this.player) this.player.setMuted(true);
        },
        _html5_unmute: function() {
            if (this.player) this.player.setVolume(0.7);
        },
        _html5_loop: function() {
            if (this.player) this.player.options.loop = true;
        },
        _html5_reset: function() {
            if (this.player) this.player.setCurrentTime(0);
        },
        _html5_unload: function() {
            this._html5_pause();
            this._html5_reset();
        }
    }
    $.fn.aviaVideoApi = function(options, apply_to_parent) {
        return this.each(function() {
            var applyTo = this;
            if (apply_to_parent) {
                applyTo = $(this).parents(apply_to_parent).get(0);
            }
            var self = $.data(applyTo, 'aviaVideoApi');
            if (!self) {
                self = $.data(applyTo, 'aviaVideoApi', new $.AviaVideoAPI(options, this, applyTo));
            }
        });
    }
})(jQuery);
window.onYouTubeIframeAPIReady = function() {
    jQuery('body').trigger('av-youtube-iframe-api-loaded');
};
var Froogaloop = (function() {
    function Froogaloop(iframe) {
        return new Froogaloop.fn.init(iframe);
    }
    var eventCallbacks = {},
        hasWindowEvent = false,
        isReady = false,
        slice = Array.prototype.slice,
        playerOrigin = '*';
    Froogaloop.fn = Froogaloop.prototype = {
        element: null,
        init: function(iframe) {
            if (typeof iframe === "string") {
                iframe = document.getElementById(iframe);
            }
            this.element = iframe;
            return this;
        },
        api: function(method, valueOrCallback) {
            if (!this.element || !method) {
                return false;
            }
            var self = this,
                element = self.element,
                target_id = element.id !== '' ? element.id : null,
                params = !isFunction(valueOrCallback) ? valueOrCallback : null,
                callback = isFunction(valueOrCallback) ? valueOrCallback : null;
            if (callback) {
                storeCallback(method, callback, target_id);
            }
            postMessage(method, params, element);
            return self;
        },
        addEvent: function(eventName, callback) {
            if (!this.element) {
                return false;
            }
            var self = this,
                element = self.element,
                target_id = element.id !== '' ? element.id : null;
            storeCallback(eventName, callback, target_id);
            if (eventName != 'ready') {
                postMessage('addEventListener', eventName, element);
            } else if (eventName == 'ready' && isReady) {
                callback.call(null, target_id);
            }
            return self;
        },
        removeEvent: function(eventName) {
            if (!this.element) {
                return false;
            }
            var self = this,
                element = self.element,
                target_id = element.id !== '' ? element.id : null,
                removed = removeCallback(eventName, target_id);
            if (eventName != 'ready' && removed) {
                postMessage('removeEventListener', eventName, element);
            }
        }
    };

    function postMessage(method, params, target) {
        if (!target.contentWindow.postMessage) {
            return false;
        }
        var data = JSON.stringify({
            method: method,
            value: params
        });
        target.contentWindow.postMessage(data, playerOrigin);
    }

    function onMessageReceived(event) {
        var data, method;
        try {
            data = JSON.parse(event.data);
            method = data.event || data.method;
        } catch (e) {}
        if (method == 'ready' && !isReady) {
            isReady = true;
        }
        if (!(/^https?:\/\/player.vimeo.com/).test(event.origin)) {
            return false;
        }
        if (playerOrigin === '*') {
            playerOrigin = event.origin;
        }
        var value = data.value,
            eventData = data.data,
            target_id = target_id === '' ? null : data.player_id,
            callback = getCallback(method, target_id),
            params = [];
        if (!callback) {
            return false;
        }
        if (value !== undefined) {
            params.push(value);
        }
        if (eventData) {
            params.push(eventData);
        }
        if (target_id) {
            params.push(target_id);
        }
        return params.length > 0 ? callback.apply(null, params) : callback.call();
    }

    function storeCallback(eventName, callback, target_id) {
        if (target_id) {
            if (!eventCallbacks[target_id]) {
                eventCallbacks[target_id] = {};
            }
            eventCallbacks[target_id][eventName] = callback;
        } else {
            eventCallbacks[eventName] = callback;
        }
    }

    function getCallback(eventName, target_id) {
        if (target_id && eventCallbacks[target_id] && eventCallbacks[target_id][eventName]) {
            return eventCallbacks[target_id][eventName];
        } else {
            return eventCallbacks[eventName];
        }
    }

    function removeCallback(eventName, target_id) {
        if (target_id && eventCallbacks[target_id]) {
            if (!eventCallbacks[target_id][eventName]) {
                return false;
            }
            eventCallbacks[target_id][eventName] = null;
        } else {
            if (!eventCallbacks[eventName]) {
                return false;
            }
            eventCallbacks[eventName] = null;
        }
        return true;
    }

    function isFunction(obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    }

    function isArray(obj) {
        return toString.call(obj) === '[object Array]';
    }
    Froogaloop.fn.init.prototype = Froogaloop.fn;
    if (window.addEventListener) {
        window.addEventListener('message', onMessageReceived, false);
    } else {
        window.attachEvent('onmessage', onMessageReceived);
    }
    return (window.Froogaloop = window.$f = Froogaloop);
})();
(function($) {
    "use strict";
    $.AviaccordionSlider = function(options, slider) {
        this.$slider = $(slider);
        this.$inner = this.$slider.find('.aviaccordion-inner');
        this.$slides = this.$inner.find('.aviaccordion-slide');
        this.$images = this.$inner.find('.aviaccordion-image');
        this.$last = this.$slides.filter(':last');
        this.$titles = this.$slider.find('.aviaccordion-preview');
        this.$titlePos = this.$slider.find('.aviaccordion-preview-title-pos');
        this.$titleWrap = this.$slider.find('.aviaccordion-preview-title-wrap');
        this.$win = $(window);
        if ($.avia_utilities.supported.transition === undefined) {
            $.avia_utilities.supported.transition = $.avia_utilities.supports('transition');
        }
        this.browserPrefix = $.avia_utilities.supported.transition;
        this.cssActive = this.browserPrefix !== false ? true : false;
        this.transform3d = document.documentElement.className.indexOf('avia_transform3d') !== -1 ? true : false;
        this.isMobile = $.avia_utilities.isMobile;
        this.property = this.browserPrefix + 'transform', this.count = this.$slides.length;
        this.open = false;
        this.autoplay = false;
        this.increaseTitle = this.$slider.is(".aviaccordion-title-on-hover");
        this._init(options);
    }
    $.AviaccordionSlider.prototype = {
        _init: function(options) {
            var _self = this;
            _self.options = $.extend({}, options, this.$slider.data());
            $.avia_utilities.preload({
                container: this.$slider,
                single_callback: function() {
                    _self._kickOff();
                }
            });
        },
        _kickOff: function() {
            var _self = this;
            _self._calcMovement();
            _self._bindEvents();
            _self._showImages();
            _self._autoplay();
        },
        _autoplay: function() {
            var _self = this;
            if (_self.options.autoplay) {
                _self.autoplay = setInterval(function() {
                    _self.open = _self.open === false ? 0 : _self.open + 1;
                    if (_self.open >= _self.count) _self.open = 0;
                    _self._move({}, _self.open);
                }, _self.options.interval * 1000)
            }
        },
        _showImages: function() {
            var _self = this,
                counter = 0,
                delay = 300,
                title_delay = this.count * delay;
            if (this.cssActive) {
                setTimeout(function() {
                    _self.$slider.addClass('av-animation-active');
                }, 10);
            }
            this.$images.each(function(i) {
                var current = $(this),
                    timer = delay * (i + 1);
                setTimeout(function() {
                    current.avia_animate({
                        opacity: 1
                    }, 400, function() {
                        current.css($.avia_utilities.supported.transition + "transform", "none");
                    });
                }, timer);
            });
            if (_self.increaseTitle) title_delay = 0;
            this.$titlePos.each(function(i) {
                var current = $(this),
                    new_timer = title_delay + 100 * (i + 1);
                setTimeout(function() {
                    current.avia_animate({
                        opacity: 1
                    }, 200, function() {
                        current.css($.avia_utilities.supported.transition + "transform", "none");
                    });
                }, new_timer);
            });
        },
        _bindEvents: function() {
            var trigger = this.isMobile ? "click" : "mouseenter";
            this.$slider.on(trigger, '.aviaccordion-slide', $.proxy(this._move, this));
            this.$slider.on('mouseleave', '.aviaccordion-inner', $.proxy(this._move, this));
            this.$win.on('debouncedresize', $.proxy(this._calcMovement, this));
            this.$slider.on('av-prev av-next', $.proxy(this._moveTo, this));
            if (this.isMobile) {
                this.$slider.avia_swipe_trigger({
                    next: this.$slider,
                    prev: this.$slider,
                    event: {
                        prev: 'av-prev',
                        next: 'av-next'
                    }
                });
            }
        },
        _titleHeight: function() {
            var th = 0;
            this.$titleWrap.css({
                'height': 'auto'
            }).each(function() {
                var new_h = $(this).outerHeight();
                if (new_h > th) th = new_h;
            }).css({
                'height': th + 2
            });
        },
        _calcMovement: function(event, allow_repeat) {
            var _self = this,
                containerWidth = this.$slider.width(),
                defaultPos = this.$last.data('av-left'),
                imgWidth = this.$images.filter(':last').width() || containerWidth,
                imgWidthPercent = Math.floor((100 / containerWidth) * imgWidth),
                allImageWidth = imgWidthPercent * _self.count,
                modifier = 3,
                tempMinLeft = 100 - imgWidthPercent,
                minLeft = tempMinLeft > defaultPos / modifier ? tempMinLeft : 0,
                oneLeft = minLeft / (_self.count - 1),
                titleWidth = imgWidth;
            if (allImageWidth < 110 && allow_repeat !== false) {
                var slideHeight = this.$slider.height(),
                    maxHeight = (slideHeight / allImageWidth) * 110;
                this.$slider.css({
                    'max-height': maxHeight
                });
                _self._calcMovement(event, false);
                return;
            }
            if (oneLeft < 2) minLeft = 0;
            this.$slides.each(function(i) {
                var current = $(this),
                    newLeft = 0,
                    newRight = 0,
                    defaultLeft = current.data('av-left');
                if (minLeft !== 0) {
                    newLeft = oneLeft * i;
                    newRight = imgWidthPercent + newLeft - oneLeft;
                } else {
                    newLeft = defaultLeft / Math.abs(modifier);
                    newRight = 100 - ((newLeft / i) * (_self.count - i));
                }
                if (i == 1 && _self.increaseTitle) {
                    titleWidth = newRight + 1;
                }
                if (_self.cssActive) {
                    newLeft = newLeft - defaultLeft;
                    newRight = newRight - defaultLeft;
                    defaultLeft = 0;
                }
                current.data('av-calc-default', defaultLeft);
                current.data('av-calc-left', newLeft);
                current.data('av-calc-right', newRight);
            });
            if (_self.increaseTitle) {
                _self.$titles.css({
                    width: titleWidth + "%"
                });
            }
        },
        _moveTo: function(event) {
            var direction = event.type == "av-next" ? 1 : -1,
                nextSlide = this.open === false ? 0 : this.open + direction;
            if (nextSlide >= 0 && nextSlide < this.$slides.length) this._move(event, nextSlide);
        },
        _move: function(event, direct_open) {
            var _self = this,
                slide = event.currentTarget,
                itemNo = typeof direct_open != "undefined" ? direct_open : this.$slides.index(slide);
            this.open = itemNo;
            if (_self.autoplay && typeof slide != "undefined") {
                clearInterval(_self.autoplay);
                _self.autoplay = false;
            }
            this.$slides.removeClass('aviaccordion-active-slide').each(function(i) {
                var current = $(this),
                    dataSet = current.data(),
                    trans_val = i <= itemNo ? dataSet.avCalcLeft : dataSet.avCalcRight,
                    transition = {},
                    reset = event.type == 'mouseleave' ? 1 : 0,
                    active = itemNo === i ? _self.$titleWrap.eq(i) : false;
                if (active) current.addClass('aviaccordion-active-slide');
                if (reset) {
                    trans_val = dataSet.avCalcDefault;
                    this.open = false;
                }
                if (_self.cssActive) {
                    transition[_self.property] = _self.transform3d ? "translate3d(" + trans_val + "%, 0, 0)" : "translate(" + trans_val + "%,0)";
                    current.css(transition);
                } else {
                    transition.left = trans_val + "%";
                    current.stop().animate(transition, 700, 'easeOutQuint');
                }
            });
        }
    };
    $.fn.aviaccordion = function(options) {
        return this.each(function() {
            var active = $.data(this, 'AviaccordionSlider');
            if (!active) {
                $.data(this, 'AviaccordionSlider', 1);
                new $.AviaccordionSlider(options, this);
            }
        });
    }
})(jQuery);
(function($) {
    "use strict";
    $.AviaFullscreenSlider = function(options, slider) {
        this.$slider = $(slider);
        this.$inner = this.$slider.find('.avia-slideshow-inner');
        this.$innerLi = this.$inner.find('>li');
        this.$caption = this.$inner.find('.avia-slide-wrap .caption_container');
        this.$win = $(window);
        this.isMobile = $.avia_utilities.isMobile;
        this.property = {};
        this.scrollPos = "0";
        this.transform3d = document.documentElement.className.indexOf('avia_transform3d') !== -1 ? true : false;
        this.ticking = false;
        if ($.avia_utilities.supported.transition === undefined) {
            $.avia_utilities.supported.transition = $.avia_utilities.supports('transition');
        }
        this._init(options);
    }
    $.AviaFullscreenSlider.defaults = {
        height: 100,
        subtract: '#wpadminbar, #header, #main>.title_container'
    };
    $.AviaFullscreenSlider.prototype = {
        _init: function(options) {
            var _self = this;
            this.options = $.extend(true, {}, $.AviaFullscreenSlider.defaults, options);
            if (this.$slider.data('slide_height')) this.options.height = this.$slider.data('slide_height');
            this.options.parallax_enabled = this.$slider.data('image_attachment') == "" ? true : false;
            this.$subtract = $(this.options.subtract);
            this._setSize();
            this.$win.on('debouncedresize', $.proxy(this._setSize, this));
            setTimeout(function() {
                if (!_self.isMobile && _self.options.parallax_enabled) {
                    _self.$win.on('scroll', $.proxy(_self._on_scroll, _self));
                }
            }, 100);
            this.$slider.aviaSlider({
                bg_slider: true
            });
        },
        _on_scroll: function(e) {
            var _self = this;
            if (!_self.ticking) {
                _self.ticking = true;
                window.requestAnimationFrame($.proxy(_self._parallax_scroll, _self));
            }
        },
        _fetch_properties: function(slide_height) {
            this.property.offset = this.$slider.offset().top;
            this.property.wh = this.$win.height();
            this.property.height = slide_height || this.$slider.outerHeight();
            this._parallax_scroll();
        },
        _setSize: function() {
            if (!$.fn.avia_browser_height) {
                var viewport = this.$win.height(),
                    slide_height = Math.ceil((viewport / 100) * this.options.height);
                if (this.$subtract.length && this.options.height == 100) {
                    this.$subtract.each(function() {
                        slide_height -= this.offsetHeight - 0.5;
                    });
                } else {
                    slide_height -= 1;
                }
                this.$slider.height(slide_height).removeClass('av-default-height-applied');
                this.$inner.css('padding', 0);
            }
            this._fetch_properties(slide_height);
        },
        _parallax_scroll: function(e) {
            if (this.isMobile || !this.options.parallax_enabled) return;
            var winTop = this.$win.scrollTop(),
                winBottom = winTop + this.property.wh,
                scrollPos = "0",
                prop = {},
                prop2 = {};
            if (this.property.offset < winTop && winTop <= this.property.offset + this.property.height) {
                scrollPos = Math.round((winTop - this.property.offset) * 0.3);
            }
            if (this.scrollPos != scrollPos) {
                this.scrollPos = scrollPos;
                if (this.transform3d) {
                    prop[$.avia_utilities.supported.transition + "transform"] = "translate3d(0px," + scrollPos + "px,0px)";
                } else {
                    prop[$.avia_utilities.supported.transition + "transform"] = "translate(0px," + scrollPos + "px)";
                }
                this.$inner.css(prop);
            }
            this.ticking = false;
        }
    };
    $.fn.aviaFullscreenSlider = function(options) {
        return this.each(function() {
            var active = $.data(this, 'aviaFullscreenSlider');
            if (!active) {
                $.data(this, 'aviaFullscreenSlider', 1);
                new $.AviaFullscreenSlider(options, this);
            }
        });
    }
})(jQuery);
(function($) {
    "use strict";
    $.fn.layer_slider_height_helper = function(options) {
        return this.each(function() {
            var container = $(this),
                first_div = container.find('>div:first'),
                timeout = false,
                counter = 0,
                reset_size = function() {
                    if (first_div.height() > 0 || counter > 5) {
                        container.height('auto');
                    } else {
                        timeout = setTimeout(reset_size, 500);
                        counter++;
                    }
                };
            if (!first_div.length) return;
            timeout = setTimeout(reset_size, 0);
        });
    }
}(jQuery));
(function($) {
    "use strict";
    $.fn.avia_sc_tab_section = function() {
        var win = $(window),
            browserPrefix = $.avia_utilities.supports('transition'),
            cssActive = this.browserPrefix !== false ? true : false,
            isMobile = $.avia_utilities.isMobile,
            transform3d = document.documentElement.className.indexOf('avia_transform3d') !== -1 ? true : false,
            transition = {};
        return this.each(function() {
            var container = $(this),
                tabs = container.find('.av-section-tab-title'),
                tab_outer = container.find('.av-tab-section-outer-container'),
                tab_wrap = container.find('.av-tab-section-tab-title-container'),
                tab_nav = container.find('.av_tab_navigation'),
                content_wrap = container.find('.av-tab-section-inner-container'),
                single_tabs = container.find('.av-animation-delay-container'),
                inner_content = container.find('.av-layout-tab-inner'),
                sliding_active = container.is('.av-tab-slide-transition'),
                flexible = container.is('.av-tab-content-auto'),
                current_content = container.find('.__av_init_open'),
                min_width = 0,
                change_tab = function(e, prevent_hash) {
                    e.preventDefault();
                    var current_tab = $(e.currentTarget),
                        current_arrow = current_tab.find('.av-tab-arrow-container span'),
                        tab_nr = current_tab.data('av-tab-section-title');
                    current_content = container.find('[data-av-tab-section-content="' + tab_nr + '"]');
                    var new_bg = current_content.data('av-tab-bg-color'),
                        new_font = current_content.data('av-tab-color'),
                        prev_container = container.find('.av-active-tab-content').not('[data-av-tab-section-content="' + tab_nr + '"]');
                    tabs.attr('style', '').removeClass('av-active-tab-title');
                    current_tab.removeClass('no-scroll');
                    current_tab.addClass('av-active-tab-title');
                    current_content.addClass("av-active-tab-content");
                    if (new_bg !== "") current_arrow.css('background-color', new_bg);
                    if (new_font !== "") current_tab.css('color', new_font);
                    var new_pos = ((parseInt(tab_nr, 10) - 1) * -100);
                    if ($('body').hasClass('rtl')) {
                        new_pos = ((parseInt(tab_nr, 10) - 1) * 100);
                    }
                    if (cssActive) {
                        new_pos = new_pos / tabs.length;
                        transition['transform'] = transform3d ? "translate3d(" + new_pos + "%, 0, 0)" : "translate(" + new_pos + "%,0)";
                        transition['left'] = "0%";
                        content_wrap.css(transition);
                    } else {
                        content_wrap.css('left', new_pos + "%");
                    }
                    set_tab_titlte_pos();
                    set_slide_height();
                    if (!prevent_hash) location.hash = current_tab.attr('href');
                    setTimeout(function() {
                        current_content.trigger('avia_start_animation_if_current_slide_is_active');
                        single_tabs.not(current_content).trigger('avia_remove_animation');
                    }, 600);
                },
                set_min_width = function() {
                    min_width = 0;
                    tabs.each(function() {
                        min_width += $(this).outerWidth();
                    });
                    tab_wrap.css('min-width', min_width);
                },
                set_slide_height = function() {
                    if (current_content.length && flexible) {
                        var old_height = inner_content.height();
                        inner_content.height('auto');
                        var height = current_content.find('.av-layout-tab-inner').height(),
                            add_height = tab_wrap.height();
                        tab_outer.css('max-height', height + add_height + 100);
                        inner_content.height(old_height);
                        inner_content.height(height);
                        inner_content.css('overflow', 'hidden');
                        setTimeout(function() {
                            win.trigger('av-height-change');
                        }, 600);
                    }
                },
                set_tab_titlte_pos = function() {
                    var current_tab = container.find('.av-active-tab-title'),
                        viewport = container.width(),
                        left_pos = (current_tab.position().left * -1) - (current_tab.outerWidth() / 2) + (viewport / 2);
                    if (!$('body').hasClass("rtl")) {
                        if (viewport >= min_width) {
                            left_pos = 0;
                        }
                        if (left_pos + min_width < viewport) left_pos = (min_width - viewport) * -1;
                        if (left_pos > 0) left_pos = 0;
                        tab_wrap.css('left', left_pos);
                    } else {
                        var right_pos = 0;
                        if (viewport < min_width) {
                            if (left_pos + min_width > viewport) {
                                if (left_pos > 0) left_pos = 0;
                                var right_pos = (left_pos + min_width - viewport) * -1;
                                tab_wrap.css('left', 'auto');
                                tab_wrap.css('right', right_pos);
                            }
                        }
                        tab_wrap.css('left', 'auto');
                        tab_wrap.css('right', right_pos);
                    }
                },
                switch_to_next_prev = function(e) {
                    if (!isMobile) return;
                    var clicked = $(e.currentTarget),
                        current_tab = container.find('.av-active-tab-title');
                    if (clicked.is('.av_prev_tab_section')) {
                        current_tab.prev('.av-section-tab-title').trigger('click');
                    } else {
                        current_tab.next('.av-section-tab-title').trigger('click');
                    }
                },
                get_init_open = function() {
                    if (!hash && window.location.hash) var hash = window.location.hash;
                    var open = tabs.filter('[href="' + hash + '"]');
                    if (open.length) {
                        if (!open.is('.active_tab')) open.trigger('click');
                    } else {
                        container.find('.av-active-tab-title').trigger('click', true);
                    }
                };
            $.avia_utilities.preload({
                container: current_content,
                single_callback: function() {
                    tabs.on('click', change_tab);
                    tab_nav.on('click', switch_to_next_prev);
                    win.on('debouncedresize', set_tab_titlte_pos);
                    win.on('debouncedresize av-content-el-height-changed', set_slide_height);
                    set_min_width();
                    set_slide_height();
                    get_init_open();
                }
            });
            content_wrap.avia_swipe_trigger({
                prev: '.av_prev_tab_section',
                next: '.av_next_tab_section'
            });
        });
    };
}(jQuery));
(function($) {
    "use strict";
    $.fn.avia_sc_tabs = function(options) {
        var defaults = {
            heading: '.tab',
            content: '.tab_content',
            active: 'active_tab',
            sidebar: false
        };
        var win = $(window),
            options = $.extend(defaults, options);
        return this.each(function() {
            var container = $(this),
                tab_titles = $('<div class="tab_titles"></div>').prependTo(container),
                tabs = $(options.heading, container),
                content = $(options.content, container),
                newtabs = false,
                oldtabs = false;
            newtabs = tabs.clone();
            oldtabs = tabs.addClass('fullsize-tab').attr('aria-hidden', true);
            tabs = newtabs;
            tabs.prependTo(tab_titles).each(function(i) {
                var tab = $(this),
                    the_oldtab = false;
                if (newtabs) the_oldtab = oldtabs.filter(':eq(' + i + ')');
                tab.addClass('tab_counter_' + i).on('click', function() {
                    open_content(tab, i, the_oldtab);
                    return false;
                });
                tab.on('keydown', function(objEvent) {
                    if (objEvent.keyCode === 13) {
                        tab.trigger('click');
                    }
                });
                if (newtabs) {
                    the_oldtab.on('click', function() {
                        open_content(the_oldtab, i, tab);
                        return false;
                    });
                    the_oldtab.on('keydown', function(objEvent) {
                        if (objEvent.keyCode === 13) {
                            the_oldtab.trigger('click');
                        }
                    });
                }
            });
            set_size();
            trigger_default_open(false);
            win.on("debouncedresize", set_size);
            $('a').on('click', function() {
                var hash = $(this).attr('href');
                if (typeof hash != "undefined" && hash) {
                    hash = hash.replace(/^.*?#/, '');
                    trigger_default_open('#' + hash);
                }
            });

            function set_size() {
                if (!options.sidebar) return;
                content.css({
                    'min-height': tab_titles.outerHeight() + 1
                });
            }

            function open_content(tab, i, alternate_tab) {
                if (!tab.is('.' + options.active)) {
                    $('.' + options.active, container).removeClass(options.active);
                    $('.' + options.active + '_content', container).attr('aria-hidden', true).removeClass(options.active + '_content');
                    tab.addClass(options.active);
                    var new_loc = tab.data('fake-id');
                    if (typeof new_loc == 'string') location.replace(new_loc);
                    if (alternate_tab) alternate_tab.addClass(options.active);
                    var active_c = content.filter(':eq(' + i + ')').addClass(options.active + '_content').attr('aria-hidden', false);
                    if (typeof click_container != 'undefined' && click_container.length) {
                        sidebar_shadow.height(active_c.outerHeight());
                    }
                    var el_offset = active_c.offset().top,
                        scoll_target = el_offset - 50 - parseInt($('html').css('margin-top'), 10);
                    if (win.scrollTop() > el_offset) {
                        $('html:not(:animated),body:not(:animated)').scrollTop(scoll_target);
                    }
                }
                win.trigger('av-content-el-height-changed', tab);
            }

            function trigger_default_open(hash) {
                if (!hash && window.location.hash) hash = window.location.hash;
                if (!hash) return;
                var open = tabs.filter('[data-fake-id="' + hash + '"]');
                if (open.length) {
                    if (!open.is('.active_tab')) open.trigger('click');
                    window.scrollTo(0, container.offset().top - 70);
                }
            }
        });
    };
}(jQuery));
(function($) {
    "use strict";
    $.fn.avia_sc_testimonial = function(options) {
        return this.each(function() {
            var container = $(this),
                elements = container.find('.avia-testimonial');
            container.on('avia_start_animation', function() {
                elements.each(function(i) {
                    var element = $(this);
                    setTimeout(function() {
                        element.addClass('avia_start_animation')
                    }, (i * 150));
                });
            });
        });
    }
}(jQuery));
(function($) {
    "use strict";
    $(window).on('load', function(e) {
        if ($.AviaSlider) {
            $('.avia-timeline-container').avia_sc_timeline();
        }
    });
    $.fn.avia_sc_timeline = function(options) {
        return this.each(function() {
            var container = this,
                timeline_id = '#' + $(this).attr('id'),
                timeline = $(timeline_id),
                methods;
            methods = {
                matchHeights: function() {
                    this.setMinHeight($(timeline_id + ' .av-milestone-placement-top .av-milestone-date'), true);
                    this.setMinHeight($(timeline_id + ' .av-milestone-placement-bottom .av-milestone-content-wrap'), true);
                    this.setMinHeight($(timeline_id + ' .av-milestone-placement-bottom.avia-timeline-boxshadow .av-milestone-contentbox'), false);
                    this.setMinHeight($(timeline_id + ' .av-milestone-placement-top.avia-timeline-boxshadow .av-milestone-contentbox'), false);
                    this.setMinHeight($(timeline_id + ' .avia-timeline-horizontal.av-milestone-placement-alternate li >:first-child'), true);
                },
                setMinHeight: function(els, setNav) {
                    if (els.length < 2) return;
                    var elsHeights = new Array();
                    els.css('min-height', '0').each(function(i) {
                        var current = $(this);
                        var currentHeight = current.outerHeight(true);
                        elsHeights.push(currentHeight);
                    });
                    var largest = Math.max.apply(null, elsHeights);
                    els.css('min-height', largest);
                    if (setNav) {
                        var $firstElement = els.first(),
                            $parent = $firstElement.closest('.avia-timeline-container'),
                            $pos = $firstElement.height();
                        $parent.find('.av-timeline-nav').css('top', $pos);
                    }
                },
                createCarousel: function(e) {
                    var self = this,
                        slider = $(timeline_id + '.avia-slideshow-carousel'),
                        slides_num = 3,
                        slides_num_small = 1;
                    if (timeline.attr('avia-data-slides')) {
                        slides_num = parseInt(timeline.attr('avia-data-slides'));
                    }
                    if (slides_num >= 2) {
                        slides_num_small = 2;
                    }
                    var sliderOptions = {
                        carousel: 'yes',
                        keep_pading: true,
                        carouselSlidesToShow: slides_num,
                        carouselSlidesToScroll: 3,
                        carouselResponsive: [{
                            breakpoint: 989,
                            settings: {
                                carouselSlidesToShow: slides_num_small,
                                carouselSlidesToScroll: slides_num_small,
                            }
                        }, {
                            breakpoint: 767,
                            settings: {
                                carouselSlidesToShow: 1,
                                carouselSlidesToScroll: 1,
                            }
                        }],
                    }
                    slider.aviaSlider(sliderOptions);
                    slider.on('_kickOff', function() {
                        self.matchHeights();
                    });
                    $(window).on('resize', function() {
                        self.matchHeights();
                    });
                },
                layoutHelpers: function(e) {
                    $(timeline_id + ' .avia-timeline-vertical li').each(function(index, element) {
                        var $length = $(this).parents('ul').find('li').length;
                        var $icon_wrap = $(this).find('.av-milestone-icon-wrap');
                        var $icon_wrap_height = $icon_wrap.outerHeight(true);
                        var $icon_wrap_height_half = parseInt($icon_wrap_height / 2);
                        if (index === ($length - 1)) {
                            $icon_wrap.css({
                                'height': $icon_wrap_height_half,
                            });
                        } else {
                            $icon_wrap.css({
                                'height': $icon_wrap_height,
                            });
                        }
                    });
                },
                fireAnimations: function(e) {
                    if ($(timeline_id + ' > ul').hasClass('avia-timeline-vertical')) {
                        var milestone = timeline.find('.av-milestone');
                        timeline.on('avia_start_animation', function() {
                            milestone.each(function(i) {
                                var element = $(this);
                                setTimeout(function() {
                                    element.addClass('avia_start_animation')
                                }, (i * 350));
                            });
                        });
                    }
                }
            };
            methods.createCarousel();
            methods.layoutHelpers();
            methods.fireAnimations();
            methods.matchHeights();
        });
    }
})(jQuery);
(function($) {
    "use strict";
    $.fn.avia_sc_toggle = function(options) {
        var defaults = {
            single: '.single_toggle',
            heading: '.toggler',
            content: '.toggle_wrap',
            sortContainer: '.taglist'
        };
        var win = $(window),
            options = $.extend(defaults, options);
        return this.each(function() {
            var container = $(this).addClass('enable_toggles'),
                toggles = $(options.single, container),
                heading = $(options.heading, container),
                activeStyle = $(container).attr('data-currentstyle'),
                allContent = $(options.content, container),
                sortLinks = $(options.sortContainer + " a", container);
            heading.each(function(i) {
                var thisheading = $(this),
                    content = thisheading.next(options.content, container),
                    headingStyle = thisheading.attr('style'),
                    hoverStyle = thisheading.attr('data-hoverstyle');

                function scroll_to_viewport() {
                    var el_offset = content.offset().top,
                        scoll_target = el_offset - 50 - parseInt($('html').css('margin-top'), 10);
                    if (win.scrollTop() > el_offset) {
                        $('html:not(:animated),body:not(:animated)').animate({
                            scrollTop: scoll_target
                        }, 200);
                    }
                }
                if (content.css('visibility') != "hidden") {
                    thisheading.addClass('activeTitle').attr('style', activeStyle);
                }
                thisheading.on('click', function() {
                    if (content.css('visibility') != "hidden") {
                        content.slideUp(200, function() {
                            content.removeClass('active_tc').attr({
                                style: ''
                            });
                            win.trigger('av-height-change');
                            win.trigger('av-content-el-height-changed', this);
                            location.replace(thisheading.data('fake-id') + "-closed");
                        });
                        thisheading.removeClass('activeTitle').attr('style', headingStyle);
                    } else {
                        if (container.is('.toggle_close_all')) {
                            allContent.not(content).slideUp(200, function() {
                                $(this).removeClass('active_tc').attr({
                                    style: ''
                                });
                                scroll_to_viewport();
                            });
                            heading.removeClass('activeTitle').attr('style', headingStyle);
                        }
                        content.addClass('active_tc');
                        setTimeout(function() {
                            content.slideDown(200, function() {
                                if (!container.is('.toggle_close_all')) {
                                    scroll_to_viewport();
                                }
                                win.trigger('av-height-change');
                                win.trigger('av-content-el-height-changed', this);
                            });
                        }, 1);
                        thisheading.addClass('activeTitle').attr('style', activeStyle);
                        location.replace(thisheading.data('fake-id'));
                    }
                });
                if (hoverStyle) {
                    thisheading.hover(function() {
                        if (!thisheading.hasClass('activeTitle')) {
                            $(this).attr('style', hoverStyle);
                        }
                    }, function() {
                        if (!thisheading.hasClass('activeTitle')) {
                            $(this).attr('style', headingStyle);
                        }
                    });
                }
            });
            sortLinks.click(function(e) {
                e.preventDefault();
                var show = toggles.filter('[data-tags~="' + $(this).data('tag') + '"]'),
                    hide = toggles.not('[data-tags~="' + $(this).data('tag') + '"]');
                sortLinks.removeClass('activeFilter');
                $(this).addClass('activeFilter');
                heading.filter('.activeTitle').trigger('click');
                show.slideDown();
                hide.slideUp();
            });

            function trigger_default_open(hash) {
                if (!hash && window.location.hash) hash = window.location.hash;
                if (!hash) return;
                var open = heading.filter('[data-fake-id="' + hash + '"]');
                if (open.length) {
                    if (!open.is('.activeTitle')) open.trigger('click');
                    window.scrollTo(0, container.offset().top - 70);
                }
            }
            trigger_default_open(false);
            $('a').on('click', function() {
                var hash = $(this).attr('href');
                if (typeof hash != "undefined" && hash) {
                    hash = hash.replace(/^.*?#/, '');
                    trigger_default_open('#' + hash);
                }
            });
        });
    };
}(jQuery));
(function($) {
    "use strict";
    $('body').on('click', '.av-lazyload-video-embed .av-click-to-play-overlay', function(e) {
        if (document.cookie.match(/aviaPrivacyVideoEmbedsDisabled/)) {
            if (e.originalEvent === undefined) return;
            var src_url = $(this).parents('.avia-video').data('original_url');
            if (src_url) window.open(src_url, '_blank');
            return;
        }
        var clicked = $(this),
            container = clicked.parents('.av-lazyload-video-embed'),
            video = container.find('.av-video-tmpl').html();
        container.html(video);
    });
    $('.av-lazyload-immediate .av-click-to-play-overlay').trigger('click');
}(jQuery));
/*! Magnific Popup - v1.1.0 - 2016-02-20
 * http://dimsemenov.com/plugins/magnific-popup/
 * Copyright (c) 2016 Dmitry Semenov; */
! function(a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : a("object" == typeof exports ? require("jquery") : window.jQuery || window.Zepto)
}(function(a) {
    var b, c, d, e, f, g, h = "Close",
        i = "BeforeClose",
        j = "AfterClose",
        k = "BeforeAppend",
        l = "MarkupParse",
        m = "Open",
        n = "Change",
        o = "mfp",
        p = "." + o,
        q = "mfp-ready",
        r = "mfp-removing",
        s = "mfp-prevent-close",
        t = function() {},
        u = !!window.jQuery,
        v = a(window),
        w = function(a, c) {
            b.ev.on(o + a + p, c)
        },
        x = function(b, c, d, e) {
            var f = document.createElement("div");
            return f.className = "mfp-" + b, d && (f.innerHTML = d), e ? c && c.appendChild(f) : (f = a(f), c && f.appendTo(c)), f
        },
        y = function(c, d) {
            b.ev.triggerHandler(o + c, d), b.st.callbacks && (c = c.charAt(0).toLowerCase() + c.slice(1), b.st.callbacks[c] && b.st.callbacks[c].apply(b, a.isArray(d) ? d : [d]))
        },
        z = function(c) {
            return c === g && b.currTemplate.closeBtn || (b.currTemplate.closeBtn = a(b.st.closeMarkup.replace("%title%", b.st.tClose)), g = c), b.currTemplate.closeBtn
        },
        A = function() {
            a.magnificPopup.instance || (b = new t, b.init(), a.magnificPopup.instance = b)
        },
        B = function() {
            var a = document.createElement("p").style,
                b = ["ms", "O", "Moz", "Webkit"];
            if (void 0 !== a.transition) return !0;
            for (; b.length;)
                if (b.pop() + "Transition" in a) return !0;
            return !1
        };
    t.prototype = {
        constructor: t,
        init: function() {
            var c = navigator.appVersion;
            b.isLowIE = b.isIE8 = document.all && !document.addEventListener, b.isAndroid = /android/gi.test(c), b.isIOS = /iphone|ipad|ipod/gi.test(c), b.supportsTransition = B(), b.probablyMobile = b.isAndroid || b.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent), d = a(document), b.popupsCache = {}
        },
        open: function(c) {
            var e;
            if (c.isObj === !1) {
                b.items = c.items.toArray(), b.index = 0;
                var g, h = c.items;
                for (e = 0; e < h.length; e++)
                    if (g = h[e], g.parsed && (g = g.el[0]), g === c.el[0]) {
                        b.index = e;
                        break
                    }
            } else b.items = a.isArray(c.items) ? c.items : [c.items], b.index = c.index || 0;
            if (b.isOpen) return void b.updateItemHTML();
            b.types = [], f = "", c.mainEl && c.mainEl.length ? b.ev = c.mainEl.eq(0) : b.ev = d, c.key ? (b.popupsCache[c.key] || (b.popupsCache[c.key] = {}), b.currTemplate = b.popupsCache[c.key]) : b.currTemplate = {}, b.st = a.extend(!0, {}, a.magnificPopup.defaults, c), b.fixedContentPos = "auto" === b.st.fixedContentPos ? !b.probablyMobile : b.st.fixedContentPos, b.st.modal && (b.st.closeOnContentClick = !1, b.st.closeOnBgClick = !1, b.st.showCloseBtn = !1, b.st.enableEscapeKey = !1), b.bgOverlay || (b.bgOverlay = x("bg").on("click" + p, function() {
                b.close()
            }), b.wrap = x("wrap").attr("tabindex", -1).on("click" + p, function(a) {
                b._checkIfClose(a.target) && b.close()
            }), b.container = x("container", b.wrap)), b.contentContainer = x("content"), b.st.preloader && (b.preloader = x("preloader", b.container, b.st.tLoading));
            var i = a.magnificPopup.modules;
            for (e = 0; e < i.length; e++) {
                var j = i[e];
                j = j.charAt(0).toUpperCase() + j.slice(1), b["init" + j].call(b)
            }
            y("BeforeOpen"), b.st.showCloseBtn && (b.st.closeBtnInside ? (w(l, function(a, b, c, d) {
                c.close_replaceWith = z(d.type)
            }), f += " mfp-close-btn-in") : b.wrap.append(z())), b.st.alignTop && (f += " mfp-align-top"), b.fixedContentPos ? b.wrap.css({
                overflow: b.st.overflowY,
                overflowX: "hidden",
                overflowY: b.st.overflowY
            }) : b.wrap.css({
                top: v.scrollTop(),
                position: "absolute"
            }), (b.st.fixedBgPos === !1 || "auto" === b.st.fixedBgPos && !b.fixedContentPos) && b.bgOverlay.css({
                height: d.height(),
                position: "absolute"
            }), b.st.enableEscapeKey && d.on("keyup" + p, function(a) {
                27 === a.keyCode && b.close()
            }), v.on("resize" + p, function() {
                b.updateSize()
            }), b.st.closeOnContentClick || (f += " mfp-auto-cursor"), f && b.wrap.addClass(f);
            var k = b.wH = v.height(),
                n = {};
            if (b.fixedContentPos && b._hasScrollBar(k)) {
                var o = b._getScrollbarSize();
                o && (n.marginRight = o)
            }
            b.fixedContentPos && (b.isIE7 ? a("body, html").css("overflow", "hidden") : n.overflow = "hidden");
            var r = b.st.mainClass;
            return b.isIE7 && (r += " mfp-ie7"), r && b._addClassToMFP(r), b.updateItemHTML(), y("BuildControls"), a("html").css(n), b.bgOverlay.add(b.wrap).prependTo(b.st.prependTo || a(document.body)), b._lastFocusedEl = document.activeElement, setTimeout(function() {
                b.content ? (b._addClassToMFP(q), b._setFocus()) : b.bgOverlay.addClass(q), d.on("focusin" + p, b._onFocusIn)
            }, 16), b.isOpen = !0, b.updateSize(k), y(m), c
        },
        close: function() {
            b.isOpen && (y(i), b.isOpen = !1, b.st.removalDelay && !b.isLowIE && b.supportsTransition ? (b._addClassToMFP(r), setTimeout(function() {
                b._close()
            }, b.st.removalDelay)) : b._close())
        },
        _close: function() {
            y(h);
            var c = r + " " + q + " ";
            if (b.bgOverlay.detach(), b.wrap.detach(), b.container.empty(), b.st.mainClass && (c += b.st.mainClass + " "), b._removeClassFromMFP(c), b.fixedContentPos) {
                var e = {
                    marginRight: ""
                };
                b.isIE7 ? a("body, html").css("overflow", "") : e.overflow = "", a("html").css(e)
            }
            d.off("keyup" + p + " focusin" + p), b.ev.off(p), b.wrap.attr("class", "mfp-wrap").removeAttr("style"), b.bgOverlay.attr("class", "mfp-bg"), b.container.attr("class", "mfp-container"), !b.st.showCloseBtn || b.st.closeBtnInside && b.currTemplate[b.currItem.type] !== !0 || b.currTemplate.closeBtn && b.currTemplate.closeBtn.detach(), b.st.autoFocusLast && b._lastFocusedEl && a(b._lastFocusedEl).focus(), b.currItem = null, b.content = null, b.currTemplate = null, b.prevHeight = 0, y(j)
        },
        updateSize: function(a) {
            if (b.isIOS) {
                var c = document.documentElement.clientWidth / window.innerWidth,
                    d = window.innerHeight * c;
                b.wrap.css("height", d), b.wH = d
            } else b.wH = a || v.height();
            b.fixedContentPos || b.wrap.css("height", b.wH), y("Resize")
        },
        updateItemHTML: function() {
            var c = b.items[b.index];
            b.contentContainer.detach(), b.content && b.content.detach(), c.parsed || (c = b.parseEl(b.index));
            var d = c.type;
            if (y("BeforeChange", [b.currItem ? b.currItem.type : "", d]), b.currItem = c, !b.currTemplate[d]) {
                var f = b.st[d] ? b.st[d].markup : !1;
                y("FirstMarkupParse", f), f ? b.currTemplate[d] = a(f) : b.currTemplate[d] = !0
            }
            e && e !== c.type && b.container.removeClass("mfp-" + e + "-holder");
            var g = b["get" + d.charAt(0).toUpperCase() + d.slice(1)](c, b.currTemplate[d]);
            b.appendContent(g, d), c.preloaded = !0, y(n, c), e = c.type, b.container.prepend(b.contentContainer), y("AfterChange")
        },
        appendContent: function(a, c) {
            b.content = a, a ? b.st.showCloseBtn && b.st.closeBtnInside && b.currTemplate[c] === !0 ? b.content.find(".mfp-close").length || b.content.append(z()) : b.content = a : b.content = "", y(k), b.container.addClass("mfp-" + c + "-holder"), b.contentContainer.append(b.content)
        },
        parseEl: function(c) {
            var d, e = b.items[c];
            if (e.tagName ? e = {
                    el: a(e)
                } : (d = e.type, e = {
                    data: e,
                    src: e.src
                }), e.el) {
                for (var f = b.types, g = 0; g < f.length; g++)
                    if (e.el.hasClass("mfp-" + f[g])) {
                        d = f[g];
                        break
                    } e.src = e.el.attr("data-mfp-src"), e.src || (e.src = e.el.attr("href"))
            }
            return e.type = d || b.st.type || "inline", e.index = c, e.parsed = !0, b.items[c] = e, y("ElementParse", e), b.items[c]
        },
        addGroup: function(a, c) {
            var d = function(d) {
                d.mfpEl = this, b._openClick(d, a, c)
            };
            c || (c = {});
            var e = "click.magnificPopup";
            c.mainEl = a, c.items ? (c.isObj = !0, a.off(e).on(e, d)) : (c.isObj = !1, c.delegate ? a.off(e).on(e, c.delegate, d) : (c.items = a, a.off(e).on(e, d)))
        },
        _openClick: function(c, d, e) {
            var f = void 0 !== e.midClick ? e.midClick : a.magnificPopup.defaults.midClick;
            if (f || !(2 === c.which || c.ctrlKey || c.metaKey || c.altKey || c.shiftKey)) {
                var g = void 0 !== e.disableOn ? e.disableOn : a.magnificPopup.defaults.disableOn;
                if (g)
                    if (a.isFunction(g)) {
                        if (!g.call(b)) return !0
                    } else if (v.width() < g) return !0;
                c.type && (c.preventDefault(), b.isOpen && c.stopPropagation()), e.el = a(c.mfpEl), e.delegate && (e.items = d.find(e.delegate)), b.open(e)
            }
        },
        updateStatus: function(a, d) {
            if (b.preloader) {
                c !== a && b.container.removeClass("mfp-s-" + c), d || "loading" !== a || (d = b.st.tLoading);
                var e = {
                    status: a,
                    text: d
                };
                y("UpdateStatus", e), a = e.status, d = e.text, b.preloader.html(d), b.preloader.find("a").on("click", function(a) {
                    a.stopImmediatePropagation()
                }), b.container.addClass("mfp-s-" + a), c = a
            }
        },
        _checkIfClose: function(c) {
            if (!a(c).hasClass(s)) {
                var d = b.st.closeOnContentClick,
                    e = b.st.closeOnBgClick;
                if (d && e) return !0;
                if (!b.content || a(c).hasClass("mfp-close") || b.preloader && c === b.preloader[0]) return !0;
                if (c === b.content[0] || a.contains(b.content[0], c)) {
                    if (d) return !0
                } else if (e && a.contains(document, c)) return !0;
                return !1
            }
        },
        _addClassToMFP: function(a) {
            b.bgOverlay.addClass(a), b.wrap.addClass(a)
        },
        _removeClassFromMFP: function(a) {
            this.bgOverlay.removeClass(a), b.wrap.removeClass(a)
        },
        _hasScrollBar: function(a) {
            return (b.isIE7 ? d.height() : document.body.scrollHeight) > (a || v.height())
        },
        _setFocus: function() {
            (b.st.focus ? b.content.find(b.st.focus).eq(0) : b.wrap).focus()
        },
        _onFocusIn: function(c) {
            return c.target === b.wrap[0] || a.contains(b.wrap[0], c.target) ? void 0 : (b._setFocus(), !1)
        },
        _parseMarkup: function(b, c, d) {
            var e;
            d.data && (c = a.extend(d.data, c)), y(l, [b, c, d]), a.each(c, function(c, d) {
                if (void 0 === d || d === !1) return !0;
                if (e = c.split("_"), e.length > 1) {
                    var f = b.find(p + "-" + e[0]);
                    if (f.length > 0) {
                        var g = e[1];
                        "replaceWith" === g ? f[0] !== d[0] && f.replaceWith(d) : "img" === g ? f.is("img") ? f.attr("src", d) : f.replaceWith(a("<img>").attr("src", d).attr("class", f.attr("class"))) : f.attr(e[1], d)
                    }
                } else b.find(p + "-" + c).html(d)
            })
        },
        _getScrollbarSize: function() {
            if (void 0 === b.scrollbarSize) {
                var a = document.createElement("div");
                a.style.cssText = "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;", document.body.appendChild(a), b.scrollbarSize = a.offsetWidth - a.clientWidth, document.body.removeChild(a)
            }
            return b.scrollbarSize
        }
    }, a.magnificPopup = {
        instance: null,
        proto: t.prototype,
        modules: [],
        open: function(b, c) {
            return A(), b = b ? a.extend(!0, {}, b) : {}, b.isObj = !0, b.index = c || 0, this.instance.open(b)
        },
        close: function() {
            return a.magnificPopup.instance && a.magnificPopup.instance.close()
        },
        registerModule: function(b, c) {
            c.options && (a.magnificPopup.defaults[b] = c.options), a.extend(this.proto, c.proto), this.modules.push(b)
        },
        defaults: {
            disableOn: 0,
            key: null,
            midClick: !1,
            mainClass: "",
            preloader: !0,
            focus: "",
            closeOnContentClick: !1,
            closeOnBgClick: !0,
            closeBtnInside: !0,
            showCloseBtn: !0,
            enableEscapeKey: !0,
            modal: !1,
            alignTop: !1,
            removalDelay: 0,
            prependTo: null,
            fixedContentPos: "auto",
            fixedBgPos: "auto",
            overflowY: "auto",
            closeMarkup: '<button title="%title%" type="button" class="mfp-close">&#215;</button>',
            tClose: "Close (Esc)",
            tLoading: "Loading...",
            autoFocusLast: !0
        }
    }, a.fn.magnificPopup = function(c) {
        A();
        var d = a(this);
        if ("string" == typeof c)
            if ("open" === c) {
                var e, f = u ? d.data("magnificPopup") : d[0].magnificPopup,
                    g = parseInt(arguments[1], 10) || 0;
                f.items ? e = f.items[g] : (e = d, f.delegate && (e = e.find(f.delegate)), e = e.eq(g)), b._openClick({
                    mfpEl: e
                }, d, f)
            } else b.isOpen && b[c].apply(b, Array.prototype.slice.call(arguments, 1));
        else c = a.extend(!0, {}, c), u ? d.data("magnificPopup", c) : d[0].magnificPopup = c, b.addGroup(d, c);
        return d
    };
    var C, D, E, F = "inline",
        G = function() {
            E && (D.after(E.addClass(C)).detach(), E = null)
        };
    a.magnificPopup.registerModule(F, {
        options: {
            hiddenClass: "hide",
            markup: "",
            tNotFound: "Content not found"
        },
        proto: {
            initInline: function() {
                b.types.push(F), w(h + "." + F, function() {
                    G()
                })
            },
            getInline: function(c, d) {
                if (G(), c.src) {
                    var e = b.st.inline,
                        f = a(c.src);
                    if (f.length) {
                        var g = f[0].parentNode;
                        g && g.tagName && (D || (C = e.hiddenClass, D = x(C), C = "mfp-" + C), E = f.after(D).detach().removeClass(C)), b.updateStatus("ready")
                    } else b.updateStatus("error", e.tNotFound), f = a("<div>");
                    return c.inlineElement = f, f
                }
                return b.updateStatus("ready"), b._parseMarkup(d, {}, c), d
            }
        }
    });
    var H, I = "ajax",
        J = function() {
            H && a(document.body).removeClass(H)
        },
        K = function() {
            J(), b.req && b.req.abort()
        };
    a.magnificPopup.registerModule(I, {
        options: {
            settings: null,
            cursor: "mfp-ajax-cur",
            tError: '<a href="%url%">The content</a> could not be loaded.'
        },
        proto: {
            initAjax: function() {
                b.types.push(I), H = b.st.ajax.cursor, w(h + "." + I, K), w("BeforeChange." + I, K)
            },
            getAjax: function(c) {
                H && a(document.body).addClass(H), b.updateStatus("loading");
                var d = a.extend({
                    url: c.src,
                    success: function(d, e, f) {
                        var g = {
                            data: d,
                            xhr: f
                        };
                        y("ParseAjax", g), b.appendContent(a(g.data), I), c.finished = !0, J(), b._setFocus(), setTimeout(function() {
                            b.wrap.addClass(q)
                        }, 16), b.updateStatus("ready"), y("AjaxContentAdded")
                    },
                    error: function() {
                        J(), c.finished = c.loadError = !0, b.updateStatus("error", b.st.ajax.tError.replace("%url%", c.src))
                    }
                }, b.st.ajax.settings);
                return b.req = a.ajax(d), ""
            }
        }
    });
    var L, M = function(c) {
        if (c.data && void 0 !== c.data.title) return c.data.title;
        var d = b.st.image.titleSrc;
        if (d) {
            if (a.isFunction(d)) return d.call(b, c);
            if (c.el) return c.el.attr(d) || ""
        }
        return ""
    };
    a.magnificPopup.registerModule("image", {
        options: {
            markup: '<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',
            cursor: "mfp-zoom-out-cur",
            titleSrc: "title",
            verticalFit: !0,
            tError: '<a href="%url%">The image</a> could not be loaded.'
        },
        proto: {
            initImage: function() {
                var c = b.st.image,
                    d = ".image";
                b.types.push("image"), w(m + d, function() {
                    "image" === b.currItem.type && c.cursor && a(document.body).addClass(c.cursor)
                }), w(h + d, function() {
                    c.cursor && a(document.body).removeClass(c.cursor), v.off("resize" + p)
                }), w("Resize" + d, b.resizeImage), b.isLowIE && w("AfterChange", b.resizeImage)
            },
            resizeImage: function() {
                var a = b.currItem;
                if (a && a.img && b.st.image.verticalFit) {
                    var c = 0;
                    b.isLowIE && (c = parseInt(a.img.css("padding-top"), 10) + parseInt(a.img.css("padding-bottom"), 10)), a.img.css("max-height", b.wH - c)
                }
            },
            _onImageHasSize: function(a) {
                a.img && (a.hasSize = !0, L && clearInterval(L), a.isCheckingImgSize = !1, y("ImageHasSize", a), a.imgHidden && (b.content && b.content.removeClass("mfp-loading"), a.imgHidden = !1))
            },
            findImageSize: function(a) {
                var c = 0,
                    d = a.img[0],
                    e = function(f) {
                        L && clearInterval(L), L = setInterval(function() {
                            return d.naturalWidth > 0 ? void b._onImageHasSize(a) : (c > 200 && clearInterval(L), c++, void(3 === c ? e(10) : 40 === c ? e(50) : 100 === c && e(500)))
                        }, f)
                    };
                e(1)
            },
            getImage: function(c, d) {
                var e = 0,
                    f = function() {
                        c && (c.img[0].complete ? (c.img.off(".mfploader"), c === b.currItem && (b._onImageHasSize(c), b.updateStatus("ready")), c.hasSize = !0, c.loaded = !0, y("ImageLoadComplete")) : (e++, 200 > e ? setTimeout(f, 100) : g()))
                    },
                    g = function() {
                        c && (c.img.off(".mfploader"), c === b.currItem && (b._onImageHasSize(c), b.updateStatus("error", h.tError.replace("%url%", c.src))), c.hasSize = !0, c.loaded = !0, c.loadError = !0)
                    },
                    h = b.st.image,
                    i = d.find(".mfp-img");
                if (i.length) {
                    var j = document.createElement("img");
                    j.className = "mfp-img", c.el && c.el.find("img").length && (j.alt = c.el.find("img").attr("alt")), c.img = a(j).on("load.mfploader", f).on("error.mfploader", g), j.src = c.src, i.is("img") && (c.img = c.img.clone()), j = c.img[0], j.naturalWidth > 0 ? c.hasSize = !0 : j.width || (c.hasSize = !1)
                }
                return b._parseMarkup(d, {
                    title: M(c),
                    img_replaceWith: c.img
                }, c), b.resizeImage(), c.hasSize ? (L && clearInterval(L), c.loadError ? (d.addClass("mfp-loading"), b.updateStatus("error", h.tError.replace("%url%", c.src))) : (d.removeClass("mfp-loading"), b.updateStatus("ready")), d) : (b.updateStatus("loading"), c.loading = !0, c.hasSize || (c.imgHidden = !0, d.addClass("mfp-loading"), b.findImageSize(c)), d)
            }
        }
    });
    var N, O = function() {
        return void 0 === N && (N = void 0 !== document.createElement("p").style.MozTransform), N
    };
    a.magnificPopup.registerModule("zoom", {
        options: {
            enabled: !1,
            easing: "ease-in-out",
            duration: 300,
            opener: function(a) {
                return a.is("img") ? a : a.find("img")
            }
        },
        proto: {
            initZoom: function() {
                var a, c = b.st.zoom,
                    d = ".zoom";
                if (c.enabled && b.supportsTransition) {
                    var e, f, g = c.duration,
                        j = function(a) {
                            var b = a.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),
                                d = "all " + c.duration / 1e3 + "s " + c.easing,
                                e = {
                                    position: "fixed",
                                    zIndex: 9999,
                                    left: 0,
                                    top: 0,
                                    "-webkit-backface-visibility": "hidden"
                                },
                                f = "transition";
                            return e["-webkit-" + f] = e["-moz-" + f] = e["-o-" + f] = e[f] = d, b.css(e), b
                        },
                        k = function() {
                            b.content.css("visibility", "visible")
                        };
                    w("BuildControls" + d, function() {
                        if (b._allowZoom()) {
                            if (clearTimeout(e), b.content.css("visibility", "hidden"), a = b._getItemToZoom(), !a) return void k();
                            f = j(a), f.css(b._getOffset()), b.wrap.append(f), e = setTimeout(function() {
                                f.css(b._getOffset(!0)), e = setTimeout(function() {
                                    k(), setTimeout(function() {
                                        f.remove(), a = f = null, y("ZoomAnimationEnded")
                                    }, 16)
                                }, g)
                            }, 16)
                        }
                    }), w(i + d, function() {
                        if (b._allowZoom()) {
                            if (clearTimeout(e), b.st.removalDelay = g, !a) {
                                if (a = b._getItemToZoom(), !a) return;
                                f = j(a)
                            }
                            f.css(b._getOffset(!0)), b.wrap.append(f), b.content.css("visibility", "hidden"), setTimeout(function() {
                                f.css(b._getOffset())
                            }, 16)
                        }
                    }), w(h + d, function() {
                        b._allowZoom() && (k(), f && f.remove(), a = null)
                    })
                }
            },
            _allowZoom: function() {
                return "image" === b.currItem.type
            },
            _getItemToZoom: function() {
                return b.currItem.hasSize ? b.currItem.img : !1
            },
            _getOffset: function(c) {
                var d;
                d = c ? b.currItem.img : b.st.zoom.opener(b.currItem.el || b.currItem);
                var e = d.offset(),
                    f = parseInt(d.css("padding-top"), 10),
                    g = parseInt(d.css("padding-bottom"), 10);
                e.top -= a(window).scrollTop() - f;
                var h = {
                    width: d.width(),
                    height: (u ? d.innerHeight() : d[0].offsetHeight) - g - f
                };
                return O() ? h["-moz-transform"] = h.transform = "translate(" + e.left + "px," + e.top + "px)" : (h.left = e.left, h.top = e.top), h
            }
        }
    });
    var P = "iframe",
        Q = "//about:blank",
        R = function(a) {
            if (b.currTemplate[P]) {
                var c = b.currTemplate[P].find("iframe");
                c.length && (a || (c[0].src = Q), b.isIE8 && c.css("display", a ? "block" : "none"))
            }
        };
    a.magnificPopup.registerModule(P, {
        options: {
            markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',
            srcAction: "iframe_src",
            patterns: {
                youtube: {
                    index: "youtube.com",
                    id: "v=",
                    src: "//www.youtube.com/embed/%id%?autoplay=1"
                },
                vimeo: {
                    index: "vimeo.com/",
                    id: "/",
                    src: "//player.vimeo.com/video/%id%?autoplay=1"
                },
                gmaps: {
                    index: "//maps.google.",
                    src: "%id%&output=embed"
                }
            }
        },
        proto: {
            initIframe: function() {
                b.types.push(P), w("BeforeChange", function(a, b, c) {
                    b !== c && (b === P ? R() : c === P && R(!0))
                }), w(h + "." + P, function() {
                    R()
                })
            },
            getIframe: function(c, d) {
                var e = c.src,
                    f = b.st.iframe;
                a.each(f.patterns, function() {
                    return e.indexOf(this.index) > -1 ? (this.id && (e = "string" == typeof this.id ? e.substr(e.lastIndexOf(this.id) + this.id.length, e.length) : this.id.call(this, e)), e = this.src.replace("%id%", e), !1) : void 0
                });
                var g = {};
                return f.srcAction && (g[f.srcAction] = e), b._parseMarkup(d, g, c), b.updateStatus("ready"), d
            }
        }
    });
    var S = function(a) {
            var c = b.items.length;
            return a > c - 1 ? a - c : 0 > a ? c + a : a
        },
        T = function(a, b, c) {
            return a.replace(/%curr%/gi, b + 1).replace(/%total%/gi, c)
        };
    a.magnificPopup.registerModule("gallery", {
        options: {
            enabled: !1,
            arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
            preload: [0, 2],
            navigateByImgClick: !0,
            arrows: !0,
            tPrev: "Previous (Left arrow key)",
            tNext: "Next (Right arrow key)",
            tCounter: "%curr% of %total%"
        },
        proto: {
            initGallery: function() {
                var c = b.st.gallery,
                    e = ".mfp-gallery";
                return b.direction = !0, c && c.enabled ? (f += " mfp-gallery", w(m + e, function() {
                    c.navigateByImgClick && b.wrap.on("click" + e, ".mfp-img", function() {
                        return b.items.length > 1 ? (b.next(), !1) : void 0
                    }), d.on("keydown" + e, function(a) {
                        37 === a.keyCode ? b.prev() : 39 === a.keyCode && b.next()
                    })
                }), w("UpdateStatus" + e, function(a, c) {
                    c.text && (c.text = T(c.text, b.currItem.index, b.items.length))
                }), w(l + e, function(a, d, e, f) {
                    var g = b.items.length;
                    e.counter = g > 1 ? T(c.tCounter, f.index, g) : ""
                }), w("BuildControls" + e, function() {
                    if (b.items.length > 1 && c.arrows && !b.arrowLeft) {
                        var d = c.arrowMarkup,
                            e = b.arrowLeft = a(d.replace(/%title%/gi, c.tPrev).replace(/%dir%/gi, "left")).addClass(s),
                            f = b.arrowRight = a(d.replace(/%title%/gi, c.tNext).replace(/%dir%/gi, "right")).addClass(s);
                        e.click(function() {
                            b.prev()
                        }), f.click(function() {
                            b.next()
                        }), b.container.append(e.add(f))
                    }
                }), w(n + e, function() {
                    b._preloadTimeout && clearTimeout(b._preloadTimeout), b._preloadTimeout = setTimeout(function() {
                        b.preloadNearbyImages(), b._preloadTimeout = null
                    }, 16)
                }), void w(h + e, function() {
                    d.off(e), b.wrap.off("click" + e), b.arrowRight = b.arrowLeft = null
                })) : !1
            },
            next: function() {
                b.direction = !0, b.index = S(b.index + 1), b.updateItemHTML()
            },
            prev: function() {
                b.direction = !1, b.index = S(b.index - 1), b.updateItemHTML()
            },
            goTo: function(a) {
                b.direction = a >= b.index, b.index = a, b.updateItemHTML()
            },
            preloadNearbyImages: function() {
                var a, c = b.st.gallery.preload,
                    d = Math.min(c[0], b.items.length),
                    e = Math.min(c[1], b.items.length);
                for (a = 1; a <= (b.direction ? e : d); a++) b._preloadItem(b.index + a);
                for (a = 1; a <= (b.direction ? d : e); a++) b._preloadItem(b.index - a)
            },
            _preloadItem: function(c) {
                if (c = S(c), !b.items[c].preloaded) {
                    var d = b.items[c];
                    d.parsed || (d = b.parseEl(c)), y("LazyLoad", d), "image" === d.type && (d.img = a('<img class="mfp-img" />').on("load.mfploader", function() {
                        d.hasSize = !0
                    }).on("error.mfploader", function() {
                        d.hasSize = !0, d.loadError = !0, y("LazyLoadError", d)
                    }).attr("src", d.src)), d.preloaded = !0
                }
            }
        }
    });
    var U = "retina";
    a.magnificPopup.registerModule(U, {
        options: {
            replaceSrc: function(a) {
                return a.src.replace(/\.\w+$/, function(a) {
                    return "@2x" + a
                })
            },
            ratio: 1
        },
        proto: {
            initRetina: function() {
                if (window.devicePixelRatio > 1) {
                    var a = b.st.retina,
                        c = a.ratio;
                    c = isNaN(c) ? c() : c, c > 1 && (w("ImageHasSize." + U, function(a, b) {
                        b.img.css({
                            "max-width": b.img[0].naturalWidth / c,
                            width: "100%"
                        })
                    }), w("ElementParse." + U, function(b, d) {
                        d.src = a.replaceSrc(d, c)
                    }))
                }
            }
        }
    }), A()
});
(function($) {
    "use strict";
    $.avia_utilities = $.avia_utilities || {};
    $.avia_utilities.av_popup = {
        type: 'image',
        mainClass: 'avia-popup mfp-zoom-in',
        tLoading: '',
        tClose: '',
        removalDelay: 300,
        closeBtnInside: true,
        closeOnContentClick: false,
        midClick: true,
        fixedContentPos: false,
        iframe: {
            patterns: {
                youtube: {
                    index: 'youtube.com/watch',
                    id: function(url) {
                        var m = url.match(/[\\?\\&]v=([^\\?\\&]+)/),
                            id, params;
                        if (!m || !m[1]) return null;
                        id = m[1];
                        params = url.split('/watch');
                        params = params[1];
                        return id + params;
                    },
                    src: '//www.youtube.com/embed/%id%'
                }
            }
        },
        image: {
            titleSrc: function(item) {
                var title = item.el.attr('title');
                if (!title) title = item.el.find('img').attr('title');
                if (!title) title = item.el.parent().next('.wp-caption-text').html();
                if (typeof title == "undefined") return "";
                return title;
            }
        },
        gallery: {
            tPrev: '',
            tNext: '',
            tCounter: '%curr% / %total%',
            enabled: true,
            preload: [1, 1]
        },
        callbacks: {
            beforeOpen: function() {
                if (this.st.el && this.st.el.data('fixed-content')) {
                    this.fixedContentPos = true;
                }
            },
            open: function() {
                $.magnificPopup.instance.next = function() {
                    var self = this;
                    self.wrap.removeClass('mfp-image-loaded');
                    setTimeout(function() {
                        $.magnificPopup.proto.next.call(self);
                    }, 120);
                }
                $.magnificPopup.instance.prev = function() {
                    var self = this;
                    self.wrap.removeClass('mfp-image-loaded');
                    setTimeout(function() {
                        $.magnificPopup.proto.prev.call(self);
                    }, 120);
                }
                if (this.st.el && this.st.el.data('av-extra-class')) {
                    this.wrap.addClass(this.currItem.el.data('av-extra-class'));
                }
            },
            imageLoadComplete: function() {
                var self = this;
                setTimeout(function() {
                    self.wrap.addClass('mfp-image-loaded');
                }, 16);
            },
            change: function() {
                if (this.currItem.el) {
                    var current = this.currItem.el;
                    this.content.find('.av-extra-modal-content, .av-extra-modal-markup').remove();
                    if (current.data('av-extra-content')) {
                        var extra = current.data('av-extra-content');
                        this.content.append("<div class='av-extra-modal-content'>" + extra + "</div>");
                    }
                    if (current.data('av-extra-markup')) {
                        var markup = current.data('av-extra-markup');
                        this.wrap.append("<div class='av-extra-modal-markup'>" + markup + "</div>");
                    }
                }
            },
        }
    }, $.fn.avia_activate_lightbox = function(variables) {
        var defaults = {
                groups: ['.avia-slideshow', '.avia-gallery', '.av-horizontal-gallery', '.av-instagram-pics', '.portfolio-preview-image', '.portfolio-preview-content', '.isotope', '.post-entry', '.sidebar', '#main', '.main_menu', '.woocommerce-product-gallery'],
                autolinkElements: 'a.lightbox, a[rel^="prettyPhoto"], a[rel^="lightbox"], a[href$=jpg], a[href$=png], a[href$=gif], a[href$=jpeg], a[href*=".jpg?"], a[href*=".png?"], a[href*=".gif?"], a[href*=".jpeg?"], a[href$=".mov"] , a[href$=".swf"] , a:regex(href, .vimeo\.com/[0-9]) , a[href*="youtube.com/watch"] , a[href*="screenr.com"], a[href*="iframe=true"]',
                videoElements: 'a[href$=".mov"] , a[href$=".swf"] , a:regex(href, .vimeo\.com/[0-9]) , a[href*="youtube.com/watch"] , a[href*="screenr.com"], a[href*="iframe=true"]',
                exclude: '.noLightbox, .noLightbox a, .fakeLightbox, .lightbox-added, a[href*="dropbox.com"]',
            },
            options = $.extend({}, defaults, variables),
            active = !$('html').is('.av-custom-lightbox');
        if (!active) return this;
        return this.each(function() {
            var container = $(this),
                videos = $(options.videoElements, this).not(options.exclude).addClass('mfp-iframe'),
                ajaxed = !container.is('body') && !container.is('.ajax_slide');
            for (var i = 0; i < options.groups.length; i++) {
                container.find(options.groups[i]).each(function() {
                    var links = $(options.autolinkElements, this);
                    if (ajaxed) links.removeClass('lightbox-added');
                    links.not(options.exclude).addClass('lightbox-added').magnificPopup($.avia_utilities.av_popup);
                });
            }
        });
    }
})(jQuery);
(function($) {
    "use strict";
    $(document).ready(function() {
        avia_header_size();
    });

    function av_change_class($element, change_method, class_name) {
        if ($element[0].classList) {
            if (change_method == "add") {
                $element[0].classList.add(class_name);
            } else {
                $element[0].classList.remove(class_name);
            }
        } else {
            if (change_method == "add") {
                $element.addClass(class_name);
            } else {
                $element.removeClass(class_name);
            }
        }
    }

    function avia_header_size() {
        var win = $(window),
            header = $('.html_header_top.html_header_sticky #header'),
            unsticktop = $('.av_header_unstick_top');
        if (!header.length && !unsticktop.length) return;
        var logo = $('#header_main .container .logo img, #header_main .container .logo a'),
            elements = $('#header_main .container:not(#header_main_alternate>.container), #header_main .main_menu ul:first-child > li > a:not(.avia_mega_div a, #header_main_alternate a), #header_main #menu-item-shop .cart_dropdown_link'),
            el_height = $(elements).filter(':first').height(),
            isMobile = $.avia_utilities.isMobile,
            scroll_top = $('#scroll-top-link'),
            transparent = header.is('.av_header_transparency'),
            shrinking = header.is('.av_header_shrinking'),
            topbar_height = header.find('#header_meta').outerHeight(),
            set_height = function() {
                var st = win.scrollTop(),
                    newH = 0,
                    st_real = st;
                if (unsticktop) st -= topbar_height;
                if (st < 0) st = 0;
                if (shrinking && !isMobile) {
                    if (st < el_height / 2) {
                        newH = el_height - st;
                        if (st <= 0) {
                            newH = el_height;
                        }
                        av_change_class(header, 'remove', 'header-scrolled');
                    } else {
                        newH = el_height / 2;
                        av_change_class(header, 'add', 'header-scrolled');
                    }
                    if (st - 30 < el_height) {
                        av_change_class(header, 'remove', 'header-scrolled-full');
                    } else {
                        av_change_class(header, 'add', 'header-scrolled-full');
                    }
                    elements.css({
                        'height': newH + 'px',
                        'lineHeight': newH + 'px'
                    });
                    logo.css({
                        'maxHeight': newH + 'px'
                    });
                }
                if (unsticktop.length) {
                    if (st <= 0) {
                        if (st_real <= 0) st_real = 0;
                        unsticktop.css({
                            "margin-top": "-" + st_real + "px"
                        });
                    } else {
                        unsticktop.css({
                            "margin-top": "-" + topbar_height + "px"
                        });
                    }
                }
                if (transparent) {
                    if (st > 50) {
                        av_change_class(header, 'remove', 'av_header_transparency');
                    } else {
                        av_change_class(header, 'add', 'av_header_transparency');
                    }
                }
            };
        if ($('body').is('.avia_deactivate_menu_resize')) shrinking = false;
        if (!transparent && !shrinking && !unsticktop.length) return;
        win.on('debouncedresize', function() {
            el_height = $(elements).attr('style', "").filter(':first').height();
            set_height();
        });
        win.on('scroll', function() {
            window.requestAnimationFrame(set_height)
        });
        set_height();
    }
})(jQuery);
(function($) {
    "use strict";
    $(document).ready(function() {
        $('.avia_auto_toc').each(function() {
            var $toc_section = $(this).attr('id');
            var $levels = 'h1';
            var $levelslist = new Array();
            var $excludeclass = '';
            var $toc_container = $(this).find('.avia-toc-container');
            if ($toc_container.length) {
                var $levels_attr = $toc_container.attr('data-level');
                var $excludeclass_attr = $toc_container.attr('data-exclude');
                if (typeof $levels_attr !== undefined) {
                    $levels = $levels_attr;
                }
                if (typeof $excludeclass_attr !== undefined) {
                    $excludeclass = $excludeclass_attr;
                }
            }
            $levelslist = $levels.split(',');
            $('.entry-content-wrapper').find($levels).each(function() {
                var $h_id = $(this).attr('id');
                var $tagname = $(this).prop('tagName').toLowerCase();
                var $txt = $(this).text();
                var $pos = $levelslist.indexOf($tagname);
                var $extraclass = '';
                if ($h_id == undefined) {
                    var $new_id = av_pretty_url($txt);
                    $(this).attr('id', $new_id);
                    $h_id = $new_id;
                }
                if (!$(this).hasClass('av-no-toc') && !$(this).hasClass($excludeclass) && !$(this).parent().hasClass($excludeclass)) {
                    var $list_tag = '<a href="#' + $h_id + '" class="avia-toc-link avia-toc-level-' + $pos + '"><span>' + $txt + '</span></a>';
                }
                $toc_container.append($list_tag);
            });
            $(".avia-toc-smoothscroll .avia-toc-link").on('click', function(e) {
                e.preventDefault();
                var $target = $(this).attr('href');
                var $offset = 50;
                var $sticky_header = $('.html_header_top.html_header_sticky #header');
                if ($sticky_header.length) {
                    $offset = $sticky_header.outerHeight() + 50;
                }
                $('html,body').animate({
                    scrollTop: $($target).offset().top - $offset
                })
            });
        });
    });

    function av_pretty_url(text) {
        return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "-").replace(/^-+|-+$/g, '');
    }
})(jQuery);
"use strict";
(function($) {
    var objAviaGoogleMaps = null;
    var AviaGoogleMaps = function() {
        if ('undefined' == typeof window.av_google_map || 'undefined' == typeof avia_framework_globals) {
            return;
        }
        if (objAviaGoogleMaps != null) {
            return;
        }
        objAviaGoogleMaps = this;
        this.document = $(document);
        this.script_loading = false;
        this.script_loaded = false;
        this.script_source = avia_framework_globals.gmap_avia_api;
        this.maps = {};
        this.loading_icon_html = '<div class="ajax_load"><span class="ajax_load_inner"></span></div>';
        this.LoadAviaMapsAPIScript();
    };
    AviaGoogleMaps.prototype = {
        LoadAviaMapsAPIScript: function() {
            this.maps = $('body').find('.avia-google-map-container');
            if (this.maps.length == 0) {
                return;
            }
            var needToLoad = false;
            this.maps.each(function(index) {
                var container = $(this);
                if (container.hasClass('av_gmaps_show_unconditionally') || container.hasClass('av_gmaps_show_delayed')) {
                    needToLoad = true;
                    return false;
                }
            });
            if (!needToLoad) {
                return;
            }
            if (document.cookie.match(/aviaPrivacyGoogleMapsDisabled/)) {
                $('.av_gmaps_main_wrap').addClass('av-maps-user-disabled');
                return;
            }
            if (typeof $.AviaMapsAPI != 'undefined') {
                this.AviaMapsScriptLoaded();
                return;
            }
            $('body').on('avia-google-maps-api-script-loaded', $.proxy(this.AviaMapsScriptLoaded, this));
            this.script_loading = true;
            var script = document.createElement('script');
            script.id = 'avia-gmaps-api-script';
            script.type = 'text/javascript';
            script.src = this.script_source;
            document.body.appendChild(script);
        },
        AviaMapsScriptLoaded: function() {
            this.script_loading = false;
            this.script_loaded = true;
            var object = this;
            this.maps.each(function(index) {
                var container = $(this);
                if (container.hasClass('av_gmaps_show_page_only')) {
                    return;
                }
                var mapid = container.data('mapid');
                if ('undefined' == typeof window.av_google_map[mapid]) {
                    console.log('Map cannot be displayed because no info: ' + mapid);
                    return;
                }
                if (container.hasClass('av_gmaps_show_unconditionally')) {
                    container.aviaMaps();
                } else if (container.hasClass('av_gmaps_show_delayed')) {
                    var wrap = container.closest('.av_gmaps_main_wrap');
                    var confirm = wrap.find('a.av_text_confirm_link');
                    confirm.on('click', object.AviaMapsLoadConfirmed);
                } else {
                    console.log('Map cannot be displayed because missing display class: ' + mapid);
                }
            });
        },
        AviaMapsLoadConfirmed: function(event) {
            event.preventDefault();
            var confirm = $(this);
            var container = confirm.closest('.av_gmaps_main_wrap').find('.avia-google-map-container');
            container.aviaMaps();
        }
    };
    $(function() {
        new AviaGoogleMaps();
    });
})(jQuery);;
/*! This file is auto-generated */
! function(c, d) {
    "use strict";
    var e = !1,
        n = !1;
    if (d.querySelector)
        if (c.addEventListener) e = !0;
    if (c.wp = c.wp || {}, !c.wp.receiveEmbedMessage)
        if (c.wp.receiveEmbedMessage = function(e) {
                var t = e.data;
                if (t)
                    if (t.secret || t.message || t.value)
                        if (!/[^a-zA-Z0-9]/.test(t.secret)) {
                            for (var r, a, i, s = d.querySelectorAll('iframe[data-secret="' + t.secret + '"]'), n = d.querySelectorAll('blockquote[data-secret="' + t.secret + '"]'), o = 0; o < n.length; o++) n[o].style.display = "none";
                            for (o = 0; o < s.length; o++)
                                if (r = s[o], e.source === r.contentWindow) {
                                    if (r.removeAttribute("style"), "height" === t.message) {
                                        if (1e3 < (i = parseInt(t.value, 10))) i = 1e3;
                                        else if (~~i < 200) i = 200;
                                        r.height = i
                                    }
                                    if ("link" === t.message)
                                        if (a = d.createElement("a"), i = d.createElement("a"), a.href = r.getAttribute("src"), i.href = t.value, i.host === a.host)
                                            if (d.activeElement === r) c.top.location.href = t.value
                                }
                        }
            }, e) c.addEventListener("message", c.wp.receiveEmbedMessage, !1), d.addEventListener("DOMContentLoaded", t, !1), c.addEventListener("load", t, !1);

    function t() {
        if (!n) {
            n = !0;
            for (var e, t, r = -1 !== navigator.appVersion.indexOf("MSIE 10"), a = !!navigator.userAgent.match(/Trident.*rv:11\./), i = d.querySelectorAll("iframe.wp-embedded-content"), s = 0; s < i.length; s++) {
                if (!(e = i[s]).getAttribute("data-secret")) t = Math.random().toString(36).substr(2, 10), e.src += "#?secret=" + t, e.setAttribute("data-secret", t);
                if (r || a)(t = e.cloneNode(!0)).removeAttribute("security"), e.parentNode.replaceChild(t, e)
            }
        }
    }
}(window, document);
if (typeof LS_Meta === 'object' && LS_Meta.fixGSAP) {
    var LS_oldGS = window.GreenSockGlobals,
        LS_oldGSQueue = window._gsQueue,
        LS_oldGSDefine = window._gsDefine;
    window._gsDefine = null, delete window._gsDefine;
    var LS_GSAP = window.GreenSockGlobals = {};
}
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
        "use strict";
        _gsScope._gsDefine("TweenMax", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function(a, b, c) {
                var d = function(a) {
                        var b, c = [],
                            d = a.length;
                        for (b = 0; b !== d; c.push(a[b++]));
                        return c
                    },
                    e = function(a, b, c) {
                        var d, e, f = a.cycle;
                        for (d in f) e = f[d], a[d] = "function" == typeof e ? e(c, b[c]) : e[c % e.length];
                        delete a.cycle
                    },
                    f = function(a, b, d) {
                        c.call(this, a, b, d), this._cycle = 0, this._yoyo = this.vars.yoyo === !0, this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._dirty = !0, this.render = f.prototype.render
                    },
                    g = 1e-10,
                    h = c._internals,
                    i = h.isSelector,
                    j = h.isArray,
                    k = f.prototype = c.to({}, .1, {}),
                    l = [];
                f.version = "1.19.0", k.constructor = f, k.kill()._gc = !1, f.killTweensOf = f.killDelayedCallsTo = c.killTweensOf, f.getTweensOf = c.getTweensOf, f.lagSmoothing = c.lagSmoothing, f.ticker = c.ticker, f.render = c.render, k.invalidate = function() {
                    return this._yoyo = this.vars.yoyo === !0, this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._uncache(!0), c.prototype.invalidate.call(this)
                }, k.updateTo = function(a, b) {
                    var d, e = this.ratio,
                        f = this.vars.immediateRender || a.immediateRender;
                    b && this._startTime < this._timeline._time && (this._startTime = this._timeline._time, this._uncache(!1), this._gc ? this._enabled(!0, !1) : this._timeline.insert(this, this._startTime - this._delay));
                    for (d in a) this.vars[d] = a[d];
                    if (this._initted || f)
                        if (b) this._initted = !1, f && this.render(0, !0, !0);
                        else if (this._gc && this._enabled(!0, !1), this._notifyPluginsOfEnabled && this._firstPT && c._onPluginEvent("_onDisable", this), this._time / this._duration > .998) {
                        var g = this._totalTime;
                        this.render(0, !0, !1), this._initted = !1, this.render(g, !0, !1)
                    } else if (this._initted = !1, this._init(), this._time > 0 || f)
                        for (var h, i = 1 / (1 - e), j = this._firstPT; j;) h = j.s + j.c, j.c *= i, j.s = h - j.c, j = j._next;
                    return this
                }, k.render = function(a, b, c) {
                    this._initted || 0 === this._duration && this.vars.repeat && this.invalidate();
                    var d, e, f, i, j, k, l, m, n = this._dirty ? this.totalDuration() : this._totalDuration,
                        o = this._time,
                        p = this._totalTime,
                        q = this._cycle,
                        r = this._duration,
                        s = this._rawPrevTime;
                    if (a >= n - 1e-7 ? (this._totalTime = n, this._cycle = this._repeat, this._yoyo && 0 !== (1 & this._cycle) ? (this._time = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0) : (this._time = r, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1), this._reversed || (d = !0, e = "onComplete", c = c || this._timeline.autoRemoveChildren), 0 === r && (this._initted || !this.vars.lazy || c) && (this._startTime === this._timeline._duration && (a = 0), (0 > s || 0 >= a && a >= -1e-7 || s === g && "isPause" !== this.data) && s !== a && (c = !0, s > g && (e = "onReverseComplete")), this._rawPrevTime = m = !b || a || s === a ? a : g)) : 1e-7 > a ? (this._totalTime = this._time = this._cycle = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0, (0 !== p || 0 === r && s > 0) && (e = "onReverseComplete", d = this._reversed), 0 > a && (this._active = !1, 0 === r && (this._initted || !this.vars.lazy || c) && (s >= 0 && (c = !0), this._rawPrevTime = m = !b || a || s === a ? a : g)), this._initted || (c = !0)) : (this._totalTime = this._time = a, 0 !== this._repeat && (i = r + this._repeatDelay, this._cycle = this._totalTime / i >> 0, 0 !== this._cycle && this._cycle === this._totalTime / i && a >= p && this._cycle--, this._time = this._totalTime - this._cycle * i, this._yoyo && 0 !== (1 & this._cycle) && (this._time = r - this._time), this._time > r ? this._time = r : this._time < 0 && (this._time = 0)), this._easeType ? (j = this._time / r, k = this._easeType, l = this._easePower, (1 === k || 3 === k && j >= .5) && (j = 1 - j), 3 === k && (j *= 2), 1 === l ? j *= j : 2 === l ? j *= j * j : 3 === l ? j *= j * j * j : 4 === l && (j *= j * j * j * j), 1 === k ? this.ratio = 1 - j : 2 === k ? this.ratio = j : this._time / r < .5 ? this.ratio = j / 2 : this.ratio = 1 - j / 2) : this.ratio = this._ease.getRatio(this._time / r)), o === this._time && !c && q === this._cycle) return void(p !== this._totalTime && this._onUpdate && (b || this._callback("onUpdate")));
                    if (!this._initted) {
                        if (this._init(), !this._initted || this._gc) return;
                        if (!c && this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration)) return this._time = o, this._totalTime = p, this._rawPrevTime = s, this._cycle = q, h.lazyTweens.push(this), void(this._lazy = [a, b]);
                        this._time && !d ? this.ratio = this._ease.getRatio(this._time / r) : d && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1))
                    }
                    for (this._lazy !== !1 && (this._lazy = !1), this._active || !this._paused && this._time !== o && a >= 0 && (this._active = !0), 0 === p && (2 === this._initted && a > 0 && this._init(), this._startAt && (a >= 0 ? this._startAt.render(a, b, c) : e || (e = "_dummyGS")), this.vars.onStart && (0 !== this._totalTime || 0 === r) && (b || this._callback("onStart"))), f = this._firstPT; f;) f.f ? f.t[f.p](f.c * this.ratio + f.s) : f.t[f.p] = f.c * this.ratio + f.s, f = f._next;
                    this._onUpdate && (0 > a && this._startAt && this._startTime && this._startAt.render(a, b, c), b || (this._totalTime !== p || e) && this._callback("onUpdate")), this._cycle !== q && (b || this._gc || this.vars.onRepeat && this._callback("onRepeat")), e && (!this._gc || c) && (0 > a && this._startAt && !this._onUpdate && this._startTime && this._startAt.render(a, b, c), d && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !b && this.vars[e] && this._callback(e), 0 === r && this._rawPrevTime === g && m !== g && (this._rawPrevTime = 0))
                }, f.to = function(a, b, c) {
                    return new f(a, b, c)
                }, f.from = function(a, b, c) {
                    return c.runBackwards = !0, c.immediateRender = 0 != c.immediateRender, new f(a, b, c)
                }, f.fromTo = function(a, b, c, d) {
                    return d.startAt = c, d.immediateRender = 0 != d.immediateRender && 0 != c.immediateRender, new f(a, b, d)
                }, f.staggerTo = f.allTo = function(a, b, g, h, k, m, n) {
                    h = h || 0;
                    var o, p, q, r, s = 0,
                        t = [],
                        u = function() {
                            g.onComplete && g.onComplete.apply(g.onCompleteScope || this, arguments), k.apply(n || g.callbackScope || this, m || l)
                        },
                        v = g.cycle,
                        w = g.startAt && g.startAt.cycle;
                    for (j(a) || ("string" == typeof a && (a = c.selector(a) || a), i(a) && (a = d(a))), a = a || [], 0 > h && (a = d(a), a.reverse(), h *= -1), o = a.length - 1, q = 0; o >= q; q++) {
                        p = {};
                        for (r in g) p[r] = g[r];
                        if (v && (e(p, a, q), null != p.duration && (b = p.duration, delete p.duration)), w) {
                            w = p.startAt = {};
                            for (r in g.startAt) w[r] = g.startAt[r];
                            e(p.startAt, a, q)
                        }
                        p.delay = s + (p.delay || 0), q === o && k && (p.onComplete = u), t[q] = new f(a[q], b, p), s += h
                    }
                    return t
                }, f.staggerFrom = f.allFrom = function(a, b, c, d, e, g, h) {
                    return c.runBackwards = !0, c.immediateRender = 0 != c.immediateRender, f.staggerTo(a, b, c, d, e, g, h)
                }, f.staggerFromTo = f.allFromTo = function(a, b, c, d, e, g, h, i) {
                    return d.startAt = c, d.immediateRender = 0 != d.immediateRender && 0 != c.immediateRender, f.staggerTo(a, b, d, e, g, h, i)
                }, f.delayedCall = function(a, b, c, d, e) {
                    return new f(b, 0, {
                        delay: a,
                        onComplete: b,
                        onCompleteParams: c,
                        callbackScope: d,
                        onReverseComplete: b,
                        onReverseCompleteParams: c,
                        immediateRender: !1,
                        useFrames: e,
                        overwrite: 0
                    })
                }, f.set = function(a, b) {
                    return new f(a, 0, b)
                }, f.isTweening = function(a) {
                    return c.getTweensOf(a, !0).length > 0
                };
                var m = function(a, b) {
                        for (var d = [], e = 0, f = a._first; f;) f instanceof c ? d[e++] = f : (b && (d[e++] = f), d = d.concat(m(f, b)), e = d.length), f = f._next;
                        return d
                    },
                    n = f.getAllTweens = function(b) {
                        return m(a._rootTimeline, b).concat(m(a._rootFramesTimeline, b))
                    };
                f.killAll = function(a, c, d, e) {
                    null == c && (c = !0), null == d && (d = !0);
                    var f, g, h, i = n(0 != e),
                        j = i.length,
                        k = c && d && e;
                    for (h = 0; j > h; h++) g = i[h], (k || g instanceof b || (f = g.target === g.vars.onComplete) && d || c && !f) && (a ? g.totalTime(g._reversed ? 0 : g.totalDuration()) : g._enabled(!1, !1))
                }, f.killChildTweensOf = function(a, b) {
                    if (null != a) {
                        var e, g, k, l, m, n = h.tweenLookup;
                        if ("string" == typeof a && (a = c.selector(a) || a), i(a) && (a = d(a)), j(a))
                            for (l = a.length; --l > -1;) f.killChildTweensOf(a[l], b);
                        else {
                            e = [];
                            for (k in n)
                                for (g = n[k].target.parentNode; g;) g === a && (e = e.concat(n[k].tweens)), g = g.parentNode;
                            for (m = e.length, l = 0; m > l; l++) b && e[l].totalTime(e[l].totalDuration()), e[l]._enabled(!1, !1)
                        }
                    }
                };
                var o = function(a, c, d, e) {
                    c = c !== !1, d = d !== !1, e = e !== !1;
                    for (var f, g, h = n(e), i = c && d && e, j = h.length; --j > -1;) g = h[j], (i || g instanceof b || (f = g.target === g.vars.onComplete) && d || c && !f) && g.paused(a)
                };
                return f.pauseAll = function(a, b, c) {
                    o(!0, a, b, c)
                }, f.resumeAll = function(a, b, c) {
                    o(!1, a, b, c)
                }, f.globalTimeScale = function(b) {
                    var d = a._rootTimeline,
                        e = c.ticker.time;
                    return arguments.length ? (b = b || g, d._startTime = e - (e - d._startTime) * d._timeScale / b, d = a._rootFramesTimeline, e = c.ticker.frame, d._startTime = e - (e - d._startTime) * d._timeScale / b, d._timeScale = a._rootTimeline._timeScale = b, b) : d._timeScale
                }, k.progress = function(a, b) {
                    return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 !== (1 & this._cycle) ? 1 - a : a) + this._cycle * (this._duration + this._repeatDelay), b) : this._time / this.duration()
                }, k.totalProgress = function(a, b) {
                    return arguments.length ? this.totalTime(this.totalDuration() * a, b) : this._totalTime / this.totalDuration()
                }, k.time = function(a, b) {
                    return arguments.length ? (this._dirty && this.totalDuration(), a > this._duration && (a = this._duration), this._yoyo && 0 !== (1 & this._cycle) ? a = this._duration - a + this._cycle * (this._duration + this._repeatDelay) : 0 !== this._repeat && (a += this._cycle * (this._duration + this._repeatDelay)), this.totalTime(a, b)) : this._time
                }, k.duration = function(b) {
                    return arguments.length ? a.prototype.duration.call(this, b) : this._duration
                }, k.totalDuration = function(a) {
                    return arguments.length ? -1 === this._repeat ? this : this.duration((a - this._repeat * this._repeatDelay) / (this._repeat + 1)) : (this._dirty && (this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat, this._dirty = !1), this._totalDuration)
                }, k.repeat = function(a) {
                    return arguments.length ? (this._repeat = a, this._uncache(!0)) : this._repeat
                }, k.repeatDelay = function(a) {
                    return arguments.length ? (this._repeatDelay = a, this._uncache(!0)) : this._repeatDelay
                }, k.yoyo = function(a) {
                    return arguments.length ? (this._yoyo = a, this) : this._yoyo
                }, f
            }, !0), _gsScope._gsDefine("TimelineLite", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function(a, b, c) {
                var d = function(a) {
                        b.call(this, a), this._labels = {}, this.autoRemoveChildren = this.vars.autoRemoveChildren === !0, this.smoothChildTiming = this.vars.smoothChildTiming === !0, this._sortChildren = !0, this._onUpdate = this.vars.onUpdate;
                        var c, d, e = this.vars;
                        for (d in e) c = e[d], i(c) && -1 !== c.join("").indexOf("{self}") && (e[d] = this._swapSelfInParams(c));
                        i(e.tweens) && this.add(e.tweens, 0, e.align, e.stagger)
                    },
                    e = 1e-10,
                    f = c._internals,
                    g = d._internals = {},
                    h = f.isSelector,
                    i = f.isArray,
                    j = f.lazyTweens,
                    k = f.lazyRender,
                    l = _gsScope._gsDefine.globals,
                    m = function(a) {
                        var b, c = {};
                        for (b in a) c[b] = a[b];
                        return c
                    },
                    n = function(a, b, c) {
                        var d, e, f = a.cycle;
                        for (d in f) e = f[d], a[d] = "function" == typeof e ? e.call(b[c], c) : e[c % e.length];
                        delete a.cycle
                    },
                    o = g.pauseCallback = function() {},
                    p = function(a) {
                        var b, c = [],
                            d = a.length;
                        for (b = 0; b !== d; c.push(a[b++]));
                        return c
                    },
                    q = d.prototype = new b;
                return d.version = "1.19.0", q.constructor = d, q.kill()._gc = q._forcingPlayhead = q._hasPause = !1, q.to = function(a, b, d, e) {
                    var f = d.repeat && l.TweenMax || c;
                    return b ? this.add(new f(a, b, d), e) : this.set(a, d, e)
                }, q.from = function(a, b, d, e) {
                    return this.add((d.repeat && l.TweenMax || c).from(a, b, d), e)
                }, q.fromTo = function(a, b, d, e, f) {
                    var g = e.repeat && l.TweenMax || c;
                    return b ? this.add(g.fromTo(a, b, d, e), f) : this.set(a, e, f)
                }, q.staggerTo = function(a, b, e, f, g, i, j, k) {
                    var l, o, q = new d({
                            onComplete: i,
                            onCompleteParams: j,
                            callbackScope: k,
                            smoothChildTiming: this.smoothChildTiming
                        }),
                        r = e.cycle;
                    for ("string" == typeof a && (a = c.selector(a) || a), a = a || [], h(a) && (a = p(a)), f = f || 0, 0 > f && (a = p(a), a.reverse(), f *= -1), o = 0; o < a.length; o++) l = m(e), l.startAt && (l.startAt = m(l.startAt), l.startAt.cycle && n(l.startAt, a, o)), r && (n(l, a, o), null != l.duration && (b = l.duration, delete l.duration)), q.to(a[o], b, l, o * f);
                    return this.add(q, g)
                }, q.staggerFrom = function(a, b, c, d, e, f, g, h) {
                    return c.immediateRender = 0 != c.immediateRender, c.runBackwards = !0, this.staggerTo(a, b, c, d, e, f, g, h)
                }, q.staggerFromTo = function(a, b, c, d, e, f, g, h, i) {
                    return d.startAt = c, d.immediateRender = 0 != d.immediateRender && 0 != c.immediateRender, this.staggerTo(a, b, d, e, f, g, h, i)
                }, q.call = function(a, b, d, e) {
                    return this.add(c.delayedCall(0, a, b, d), e)
                }, q.set = function(a, b, d) {
                    return d = this._parseTimeOrLabel(d, 0, !0), null == b.immediateRender && (b.immediateRender = d === this._time && !this._paused), this.add(new c(a, 0, b), d)
                }, d.exportRoot = function(a, b) {
                    a = a || {}, null == a.smoothChildTiming && (a.smoothChildTiming = !0);
                    var e, f, g = new d(a),
                        h = g._timeline;
                    for (null == b && (b = !0), h._remove(g, !0), g._startTime = 0, g._rawPrevTime = g._time = g._totalTime = h._time, e = h._first; e;) f = e._next, b && e instanceof c && e.target === e.vars.onComplete || g.add(e, e._startTime - e._delay), e = f;
                    return h.add(g, 0), g
                }, q.add = function(e, f, g, h) {
                    var j, k, l, m, n, o;
                    if ("number" != typeof f && (f = this._parseTimeOrLabel(f, 0, !0, e)), !(e instanceof a)) {
                        if (e instanceof Array || e && e.push && i(e)) {
                            for (g = g || "normal", h = h || 0, j = f, k = e.length, l = 0; k > l; l++) i(m = e[l]) && (m = new d({
                                tweens: m
                            })), this.add(m, j), "string" != typeof m && "function" != typeof m && ("sequence" === g ? j = m._startTime + m.totalDuration() / m._timeScale : "start" === g && (m._startTime -= m.delay())), j += h;
                            return this._uncache(!0)
                        }
                        if ("string" == typeof e) return this.addLabel(e, f);
                        if ("function" != typeof e) throw "Cannot add " + e + " into the timeline; it is not a tween, timeline, function, or string.";
                        e = c.delayedCall(0, e)
                    }
                    if (b.prototype.add.call(this, e, f), (this._gc || this._time === this._duration) && !this._paused && this._duration < this.duration())
                        for (n = this, o = n.rawTime() > e._startTime; n._timeline;) o && n._timeline.smoothChildTiming ? n.totalTime(n._totalTime, !0) : n._gc && n._enabled(!0, !1), n = n._timeline;
                    return this
                }, q.remove = function(b) {
                    if (b instanceof a) {
                        this._remove(b, !1);
                        var c = b._timeline = b.vars.useFrames ? a._rootFramesTimeline : a._rootTimeline;
                        return b._startTime = (b._paused ? b._pauseTime : c._time) - (b._reversed ? b.totalDuration() - b._totalTime : b._totalTime) / b._timeScale, this
                    }
                    if (b instanceof Array || b && b.push && i(b)) {
                        for (var d = b.length; --d > -1;) this.remove(b[d]);
                        return this
                    }
                    return "string" == typeof b ? this.removeLabel(b) : this.kill(null, b)
                }, q._remove = function(a, c) {
                    b.prototype._remove.call(this, a, c);
                    var d = this._last;
                    return d ? this._time > d._startTime + d._totalDuration / d._timeScale && (this._time = this.duration(), this._totalTime = this._totalDuration) : this._time = this._totalTime = this._duration = this._totalDuration = 0, this
                }, q.append = function(a, b) {
                    return this.add(a, this._parseTimeOrLabel(null, b, !0, a))
                }, q.insert = q.insertMultiple = function(a, b, c, d) {
                    return this.add(a, b || 0, c, d)
                }, q.appendMultiple = function(a, b, c, d) {
                    return this.add(a, this._parseTimeOrLabel(null, b, !0, a), c, d)
                }, q.addLabel = function(a, b) {
                    return this._labels[a] = this._parseTimeOrLabel(b), this
                }, q.addPause = function(a, b, d, e) {
                    var f = c.delayedCall(0, o, d, e || this);
                    return f.vars.onComplete = f.vars.onReverseComplete = b, f.data = "isPause", this._hasPause = !0, this.add(f, a)
                }, q.removeLabel = function(a) {
                    return delete this._labels[a], this
                }, q.getLabelTime = function(a) {
                    return null != this._labels[a] ? this._labels[a] : -1
                }, q._parseTimeOrLabel = function(b, c, d, e) {
                    var f;
                    if (e instanceof a && e.timeline === this) this.remove(e);
                    else if (e && (e instanceof Array || e.push && i(e)))
                        for (f = e.length; --f > -1;) e[f] instanceof a && e[f].timeline === this && this.remove(e[f]);
                    if ("string" == typeof c) return this._parseTimeOrLabel(c, d && "number" == typeof b && null == this._labels[c] ? b - this.duration() : 0, d);
                    if (c = c || 0, "string" != typeof b || !isNaN(b) && null == this._labels[b]) null == b && (b = this.duration());
                    else {
                        if (f = b.indexOf("="), -1 === f) return null == this._labels[b] ? d ? this._labels[b] = this.duration() + c : c : this._labels[b] + c;
                        c = parseInt(b.charAt(f - 1) + "1", 10) * Number(b.substr(f + 1)), b = f > 1 ? this._parseTimeOrLabel(b.substr(0, f - 1), 0, d) : this.duration()
                    }
                    return Number(b) + c
                }, q.seek = function(a, b) {
                    return this.totalTime("number" == typeof a ? a : this._parseTimeOrLabel(a), b !== !1)
                }, q.stop = function() {
                    return this.paused(!0)
                }, q.gotoAndPlay = function(a, b) {
                    return this.play(a, b)
                }, q.gotoAndStop = function(a, b) {
                    return this.pause(a, b)
                }, q.render = function(a, b, c) {
                    this._gc && this._enabled(!0, !1);
                    var d, f, g, h, i, l, m, n = this._dirty ? this.totalDuration() : this._totalDuration,
                        o = this._time,
                        p = this._startTime,
                        q = this._timeScale,
                        r = this._paused;
                    if (a >= n - 1e-7) this._totalTime = this._time = n, this._reversed || this._hasPausedChild() || (f = !0, h = "onComplete", i = !!this._timeline.autoRemoveChildren, 0 === this._duration && (0 >= a && a >= -1e-7 || this._rawPrevTime < 0 || this._rawPrevTime === e) && this._rawPrevTime !== a && this._first && (i = !0, this._rawPrevTime > e && (h = "onReverseComplete"))), this._rawPrevTime = this._duration || !b || a || this._rawPrevTime === a ? a : e, a = n + 1e-4;
                    else if (1e-7 > a)
                        if (this._totalTime = this._time = 0, (0 !== o || 0 === this._duration && this._rawPrevTime !== e && (this._rawPrevTime > 0 || 0 > a && this._rawPrevTime >= 0)) && (h = "onReverseComplete", f = this._reversed), 0 > a) this._active = !1, this._timeline.autoRemoveChildren && this._reversed ? (i = f = !0, h = "onReverseComplete") : this._rawPrevTime >= 0 && this._first && (i = !0), this._rawPrevTime = a;
                        else {
                            if (this._rawPrevTime = this._duration || !b || a || this._rawPrevTime === a ? a : e, 0 === a && f)
                                for (d = this._first; d && 0 === d._startTime;) d._duration || (f = !1), d = d._next;
                            a = 0, this._initted || (i = !0)
                        }
                    else {
                        if (this._hasPause && !this._forcingPlayhead && !b) {
                            if (a >= o)
                                for (d = this._first; d && d._startTime <= a && !l;) d._duration || "isPause" !== d.data || d.ratio || 0 === d._startTime && 0 === this._rawPrevTime || (l = d), d = d._next;
                            else
                                for (d = this._last; d && d._startTime >= a && !l;) d._duration || "isPause" === d.data && d._rawPrevTime > 0 && (l = d), d = d._prev;
                            l && (this._time = a = l._startTime, this._totalTime = a + this._cycle * (this._totalDuration + this._repeatDelay))
                        }
                        this._totalTime = this._time = this._rawPrevTime = a
                    }
                    if (this._time !== o && this._first || c || i || l) {
                        if (this._initted || (this._initted = !0), this._active || !this._paused && this._time !== o && a > 0 && (this._active = !0), 0 === o && this.vars.onStart && (0 === this._time && this._duration || b || this._callback("onStart")), m = this._time, m >= o)
                            for (d = this._first; d && (g = d._next, m === this._time && (!this._paused || r));)(d._active || d._startTime <= m && !d._paused && !d._gc) && (l === d && this.pause(), d._reversed ? d.render((d._dirty ? d.totalDuration() : d._totalDuration) - (a - d._startTime) * d._timeScale, b, c) : d.render((a - d._startTime) * d._timeScale, b, c)), d = g;
                        else
                            for (d = this._last; d && (g = d._prev, m === this._time && (!this._paused || r));) {
                                if (d._active || d._startTime <= o && !d._paused && !d._gc) {
                                    if (l === d) {
                                        for (l = d._prev; l && l.endTime() > this._time;) l.render(l._reversed ? l.totalDuration() - (a - l._startTime) * l._timeScale : (a - l._startTime) * l._timeScale, b, c), l = l._prev;
                                        l = null, this.pause()
                                    }
                                    d._reversed ? d.render((d._dirty ? d.totalDuration() : d._totalDuration) - (a - d._startTime) * d._timeScale, b, c) : d.render((a - d._startTime) * d._timeScale, b, c)
                                }
                                d = g
                            }
                        this._onUpdate && (b || (j.length && k(), this._callback("onUpdate"))), h && (this._gc || (p === this._startTime || q !== this._timeScale) && (0 === this._time || n >= this.totalDuration()) && (f && (j.length && k(), this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !b && this.vars[h] && this._callback(h)))
                    }
                }, q._hasPausedChild = function() {
                    for (var a = this._first; a;) {
                        if (a._paused || a instanceof d && a._hasPausedChild()) return !0;
                        a = a._next
                    }
                    return !1
                }, q.getChildren = function(a, b, d, e) {
                    e = e || -9999999999;
                    for (var f = [], g = this._first, h = 0; g;) g._startTime < e || (g instanceof c ? b !== !1 && (f[h++] = g) : (d !== !1 && (f[h++] = g), a !== !1 && (f = f.concat(g.getChildren(!0, b, d)), h = f.length))), g = g._next;
                    return f
                }, q.getTweensOf = function(a, b) {
                    var d, e, f = this._gc,
                        g = [],
                        h = 0;
                    for (f && this._enabled(!0, !0), d = c.getTweensOf(a), e = d.length; --e > -1;)(d[e].timeline === this || b && this._contains(d[e])) && (g[h++] = d[e]);
                    return f && this._enabled(!1, !0), g
                }, q.recent = function() {
                    return this._recent
                }, q._contains = function(a) {
                    for (var b = a.timeline; b;) {
                        if (b === this) return !0;
                        b = b.timeline
                    }
                    return !1
                }, q.shiftChildren = function(a, b, c) {
                    c = c || 0;
                    for (var d, e = this._first, f = this._labels; e;) e._startTime >= c && (e._startTime += a), e = e._next;
                    if (b)
                        for (d in f) f[d] >= c && (f[d] += a);
                    return this._uncache(!0)
                }, q._kill = function(a, b) {
                    if (!a && !b) return this._enabled(!1, !1);
                    for (var c = b ? this.getTweensOf(b) : this.getChildren(!0, !0, !1), d = c.length, e = !1; --d > -1;) c[d]._kill(a, b) && (e = !0);
                    return e
                }, q.clear = function(a) {
                    var b = this.getChildren(!1, !0, !0),
                        c = b.length;
                    for (this._time = this._totalTime = 0; --c > -1;) b[c]._enabled(!1, !1);
                    return a !== !1 && (this._labels = {}), this._uncache(!0)
                }, q.invalidate = function() {
                    for (var b = this._first; b;) b.invalidate(), b = b._next;
                    return a.prototype.invalidate.call(this)
                }, q._enabled = function(a, c) {
                    if (a === this._gc)
                        for (var d = this._first; d;) d._enabled(a, !0), d = d._next;
                    return b.prototype._enabled.call(this, a, c)
                }, q.totalTime = function(b, c, d) {
                    this._forcingPlayhead = !0;
                    var e = a.prototype.totalTime.apply(this, arguments);
                    return this._forcingPlayhead = !1, e
                }, q.duration = function(a) {
                    return arguments.length ? (0 !== this.duration() && 0 !== a && this.timeScale(this._duration / a), this) : (this._dirty && this.totalDuration(), this._duration)
                }, q.totalDuration = function(a) {
                    if (!arguments.length) {
                        if (this._dirty) {
                            for (var b, c, d = 0, e = this._last, f = 999999999999; e;) b = e._prev, e._dirty && e.totalDuration(), e._startTime > f && this._sortChildren && !e._paused ? this.add(e, e._startTime - e._delay) : f = e._startTime, e._startTime < 0 && !e._paused && (d -= e._startTime, this._timeline.smoothChildTiming && (this._startTime += e._startTime / this._timeScale), this.shiftChildren(-e._startTime, !1, -9999999999), f = 0), c = e._startTime + e._totalDuration / e._timeScale, c > d && (d = c), e = b;
                            this._duration = this._totalDuration = d, this._dirty = !1
                        }
                        return this._totalDuration
                    }
                    return a && this.totalDuration() ? this.timeScale(this._totalDuration / a) : this
                }, q.paused = function(b) {
                    if (!b)
                        for (var c = this._first, d = this._time; c;) c._startTime === d && "isPause" === c.data && (c._rawPrevTime = 0), c = c._next;
                    return a.prototype.paused.apply(this, arguments)
                }, q.usesFrames = function() {
                    for (var b = this._timeline; b._timeline;) b = b._timeline;
                    return b === a._rootFramesTimeline
                }, q.rawTime = function() {
                    return this._paused ? this._totalTime : (this._timeline.rawTime() - this._startTime) * this._timeScale
                }, d
            }, !0), _gsScope._gsDefine("TimelineMax", ["TimelineLite", "TweenLite", "easing.Ease"], function(a, b, c) {
                var d = function(b) {
                        a.call(this, b), this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._cycle = 0, this._yoyo = this.vars.yoyo === !0, this._dirty = !0
                    },
                    e = 1e-10,
                    f = b._internals,
                    g = f.lazyTweens,
                    h = f.lazyRender,
                    i = _gsScope._gsDefine.globals,
                    j = new c(null, null, 1, 0),
                    k = d.prototype = new a;
                return k.constructor = d, k.kill()._gc = !1, d.version = "1.19.0", k.invalidate = function() {
                    return this._yoyo = this.vars.yoyo === !0, this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._uncache(!0), a.prototype.invalidate.call(this)
                }, k.addCallback = function(a, c, d, e) {
                    return this.add(b.delayedCall(0, a, d, e), c)
                }, k.removeCallback = function(a, b) {
                    if (a)
                        if (null == b) this._kill(null, a);
                        else
                            for (var c = this.getTweensOf(a, !1), d = c.length, e = this._parseTimeOrLabel(b); --d > -1;) c[d]._startTime === e && c[d]._enabled(!1, !1);
                    return this
                }, k.removePause = function(b) {
                    return this.removeCallback(a._internals.pauseCallback, b)
                }, k.tweenTo = function(a, c) {
                    c = c || {};
                    var d, e, f, g = {
                            ease: j,
                            useFrames: this.usesFrames(),
                            immediateRender: !1
                        },
                        h = c.repeat && i.TweenMax || b;
                    for (e in c) g[e] = c[e];
                    return g.time = this._parseTimeOrLabel(a), d = Math.abs(Number(g.time) - this._time) / this._timeScale || .001, f = new h(this, d, g), g.onStart = function() {
                        f.target.paused(!0), f.vars.time !== f.target.time() && d === f.duration() && f.duration(Math.abs(f.vars.time - f.target.time()) / f.target._timeScale), c.onStart && f._callback("onStart")
                    }, f
                }, k.tweenFromTo = function(a, b, c) {
                    c = c || {}, a = this._parseTimeOrLabel(a), c.startAt = {
                        onComplete: this.seek,
                        onCompleteParams: [a],
                        callbackScope: this
                    }, c.immediateRender = c.immediateRender !== !1;
                    var d = this.tweenTo(b, c);
                    return d.duration(Math.abs(d.vars.time - a) / this._timeScale || .001)
                }, k.render = function(a, b, c) {
                    this._gc && this._enabled(!0, !1);
                    var d, f, i, j, k, l, m, n, o = this._dirty ? this.totalDuration() : this._totalDuration,
                        p = this._duration,
                        q = this._time,
                        r = this._totalTime,
                        s = this._startTime,
                        t = this._timeScale,
                        u = this._rawPrevTime,
                        v = this._paused,
                        w = this._cycle;
                    if (a >= o - 1e-7) this._locked || (this._totalTime = o, this._cycle = this._repeat), this._reversed || this._hasPausedChild() || (f = !0, j = "onComplete", k = !!this._timeline.autoRemoveChildren, 0 === this._duration && (0 >= a && a >= -1e-7 || 0 > u || u === e) && u !== a && this._first && (k = !0, u > e && (j = "onReverseComplete"))), this._rawPrevTime = this._duration || !b || a || this._rawPrevTime === a ? a : e, this._yoyo && 0 !== (1 & this._cycle) ? this._time = a = 0 : (this._time = p, a = p + 1e-4);
                    else if (1e-7 > a)
                        if (this._locked || (this._totalTime = this._cycle = 0), this._time = 0, (0 !== q || 0 === p && u !== e && (u > 0 || 0 > a && u >= 0) && !this._locked) && (j = "onReverseComplete", f = this._reversed), 0 > a) this._active = !1, this._timeline.autoRemoveChildren && this._reversed ? (k = f = !0, j = "onReverseComplete") : u >= 0 && this._first && (k = !0), this._rawPrevTime = a;
                        else {
                            if (this._rawPrevTime = p || !b || a || this._rawPrevTime === a ? a : e, 0 === a && f)
                                for (d = this._first; d && 0 === d._startTime;) d._duration || (f = !1), d = d._next;
                            a = 0, this._initted || (k = !0)
                        }
                    else if (0 === p && 0 > u && (k = !0), this._time = this._rawPrevTime = a, this._locked || (this._totalTime = a, 0 !== this._repeat && (l = p + this._repeatDelay, this._cycle = this._totalTime / l >> 0, 0 !== this._cycle && this._cycle === this._totalTime / l && a >= r && this._cycle--, this._time = this._totalTime - this._cycle * l, this._yoyo && 0 !== (1 & this._cycle) && (this._time = p - this._time), this._time > p ? (this._time = p, a = p + 1e-4) : this._time < 0 ? this._time = a = 0 : a = this._time)), this._hasPause && !this._forcingPlayhead && !b) {
                        if (a = this._time, a >= q)
                            for (d = this._first; d && d._startTime <= a && !m;) d._duration || "isPause" !== d.data || d.ratio || 0 === d._startTime && 0 === this._rawPrevTime || (m = d), d = d._next;
                        else
                            for (d = this._last; d && d._startTime >= a && !m;) d._duration || "isPause" === d.data && d._rawPrevTime > 0 && (m = d), d = d._prev;
                        m && (this._time = a = m._startTime, this._totalTime = a + this._cycle * (this._totalDuration + this._repeatDelay))
                    }
                    if (this._cycle !== w && !this._locked) {
                        var x = this._yoyo && 0 !== (1 & w),
                            y = x === (this._yoyo && 0 !== (1 & this._cycle)),
                            z = this._totalTime,
                            A = this._cycle,
                            B = this._rawPrevTime,
                            C = this._time;
                        if (this._totalTime = w * p, this._cycle < w ? x = !x : this._totalTime += p, this._time = q, this._rawPrevTime = 0 === p ? u - 1e-4 : u, this._cycle = w, this._locked = !0, q = x ? 0 : p, this.render(q, b, 0 === p), b || this._gc || this.vars.onRepeat && this._callback("onRepeat"), q !== this._time) return;
                        if (y && (q = x ? p + 1e-4 : -1e-4, this.render(q, !0, !1)), this._locked = !1, this._paused && !v) return;
                        this._time = C, this._totalTime = z, this._cycle = A, this._rawPrevTime = B
                    }
                    if (!(this._time !== q && this._first || c || k || m)) return void(r !== this._totalTime && this._onUpdate && (b || this._callback("onUpdate")));
                    if (this._initted || (this._initted = !0), this._active || !this._paused && this._totalTime !== r && a > 0 && (this._active = !0), 0 === r && this.vars.onStart && (0 === this._totalTime && this._totalDuration || b || this._callback("onStart")), n = this._time, n >= q)
                        for (d = this._first; d && (i = d._next, n === this._time && (!this._paused || v));)(d._active || d._startTime <= this._time && !d._paused && !d._gc) && (m === d && this.pause(), d._reversed ? d.render((d._dirty ? d.totalDuration() : d._totalDuration) - (a - d._startTime) * d._timeScale, b, c) : d.render((a - d._startTime) * d._timeScale, b, c)), d = i;
                    else
                        for (d = this._last; d && (i = d._prev, n === this._time && (!this._paused || v));) {
                            if (d._active || d._startTime <= q && !d._paused && !d._gc) {
                                if (m === d) {
                                    for (m = d._prev; m && m.endTime() > this._time;) m.render(m._reversed ? m.totalDuration() - (a - m._startTime) * m._timeScale : (a - m._startTime) * m._timeScale, b, c), m = m._prev;
                                    m = null, this.pause()
                                }
                                d._reversed ? d.render((d._dirty ? d.totalDuration() : d._totalDuration) - (a - d._startTime) * d._timeScale, b, c) : d.render((a - d._startTime) * d._timeScale, b, c)
                            }
                            d = i
                        }
                    this._onUpdate && (b || (g.length && h(), this._callback("onUpdate"))), j && (this._locked || this._gc || (s === this._startTime || t !== this._timeScale) && (0 === this._time || o >= this.totalDuration()) && (f && (g.length && h(), this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !b && this.vars[j] && this._callback(j)))
                }, k.getActive = function(a, b, c) {
                    null == a && (a = !0), null == b && (b = !0), null == c && (c = !1);
                    var d, e, f = [],
                        g = this.getChildren(a, b, c),
                        h = 0,
                        i = g.length;
                    for (d = 0; i > d; d++) e = g[d], e.isActive() && (f[h++] = e);
                    return f
                }, k.getLabelAfter = function(a) {
                    a || 0 !== a && (a = this._time);
                    var b, c = this.getLabelsArray(),
                        d = c.length;
                    for (b = 0; d > b; b++)
                        if (c[b].time > a) return c[b].name;
                    return null
                }, k.getLabelBefore = function(a) {
                    null == a && (a = this._time);
                    for (var b = this.getLabelsArray(), c = b.length; --c > -1;)
                        if (b[c].time < a) return b[c].name;
                    return null
                }, k.getLabelsArray = function() {
                    var a, b = [],
                        c = 0;
                    for (a in this._labels) b[c++] = {
                        time: this._labels[a],
                        name: a
                    };
                    return b.sort(function(a, b) {
                        return a.time - b.time
                    }), b
                }, k.progress = function(a, b) {
                    return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 !== (1 & this._cycle) ? 1 - a : a) + this._cycle * (this._duration + this._repeatDelay), b) : this._time / this.duration()
                }, k.totalProgress = function(a, b) {
                    return arguments.length ? this.totalTime(this.totalDuration() * a, b) : this._totalTime / this.totalDuration()
                }, k.totalDuration = function(b) {
                    return arguments.length ? -1 !== this._repeat && b ? this.timeScale(this.totalDuration() / b) : this : (this._dirty && (a.prototype.totalDuration.call(this), this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat), this._totalDuration)
                }, k.time = function(a, b) {
                    return arguments.length ? (this._dirty && this.totalDuration(), a > this._duration && (a = this._duration), this._yoyo && 0 !== (1 & this._cycle) ? a = this._duration - a + this._cycle * (this._duration + this._repeatDelay) : 0 !== this._repeat && (a += this._cycle * (this._duration + this._repeatDelay)), this.totalTime(a, b)) : this._time
                }, k.repeat = function(a) {
                    return arguments.length ? (this._repeat = a, this._uncache(!0)) : this._repeat
                }, k.repeatDelay = function(a) {
                    return arguments.length ? (this._repeatDelay = a, this._uncache(!0)) : this._repeatDelay
                }, k.yoyo = function(a) {
                    return arguments.length ? (this._yoyo = a, this) : this._yoyo
                }, k.currentLabel = function(a) {
                    return arguments.length ? this.seek(a, !0) : this.getLabelBefore(this._time + 1e-8)
                }, d
            }, !0),
            function() {
                var a = 180 / Math.PI,
                    b = [],
                    c = [],
                    d = [],
                    e = {},
                    f = _gsScope._gsDefine.globals,
                    g = function(a, b, c, d) {
                        c === d && (c = d - (d - b) / 1e6), a === b && (b = a + (c - a) / 1e6), this.a = a, this.b = b, this.c = c, this.d = d, this.da = d - a, this.ca = c - a, this.ba = b - a
                    },
                    h = ",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,",
                    i = function(a, b, c, d) {
                        var e = {
                                a: a
                            },
                            f = {},
                            g = {},
                            h = {
                                c: d
                            },
                            i = (a + b) / 2,
                            j = (b + c) / 2,
                            k = (c + d) / 2,
                            l = (i + j) / 2,
                            m = (j + k) / 2,
                            n = (m - l) / 8;
                        return e.b = i + (a - i) / 4, f.b = l + n, e.c = f.a = (e.b + f.b) / 2, f.c = g.a = (l + m) / 2, g.b = m - n, h.b = k + (d - k) / 4, g.c = h.a = (g.b + h.b) / 2, [e, f, g, h]
                    },
                    j = function(a, e, f, g, h) {
                        var j, k, l, m, n, o, p, q, r, s, t, u, v, w = a.length - 1,
                            x = 0,
                            y = a[0].a;
                        for (j = 0; w > j; j++) n = a[x], k = n.a, l = n.d, m = a[x + 1].d, h ? (t = b[j], u = c[j], v = (u + t) * e * .25 / (g ? .5 : d[j] || .5), o = l - (l - k) * (g ? .5 * e : 0 !== t ? v / t : 0), p = l + (m - l) * (g ? .5 * e : 0 !== u ? v / u : 0), q = l - (o + ((p - o) * (3 * t / (t + u) + .5) / 4 || 0))) : (o = l - (l - k) * e * .5, p = l + (m - l) * e * .5, q = l - (o + p) / 2), o += q, p += q, n.c = r = o, 0 !== j ? n.b = y : n.b = y = n.a + .6 * (n.c - n.a), n.da = l - k, n.ca = r - k, n.ba = y - k, f ? (s = i(k, y, r, l), a.splice(x, 1, s[0], s[1], s[2], s[3]), x += 4) : x++, y = p;
                        n = a[x], n.b = y, n.c = y + .4 * (n.d - y), n.da = n.d - n.a, n.ca = n.c - n.a, n.ba = y - n.a, f && (s = i(n.a, y, n.c, n.d), a.splice(x, 1, s[0], s[1], s[2], s[3]))
                    },
                    k = function(a, d, e, f) {
                        var h, i, j, k, l, m, n = [];
                        if (f)
                            for (a = [f].concat(a), i = a.length; --i > -1;) "string" == typeof(m = a[i][d]) && "=" === m.charAt(1) && (a[i][d] = f[d] + Number(m.charAt(0) + m.substr(2)));
                        if (h = a.length - 2, 0 > h) return n[0] = new g(a[0][d], 0, 0, a[-1 > h ? 0 : 1][d]), n;
                        for (i = 0; h > i; i++) j = a[i][d], k = a[i + 1][d], n[i] = new g(j, 0, 0, k), e && (l = a[i + 2][d], b[i] = (b[i] || 0) + (k - j) * (k - j), c[i] = (c[i] || 0) + (l - k) * (l - k));
                        return n[i] = new g(a[i][d], 0, 0, a[i + 1][d]), n
                    },
                    l = function(a, f, g, i, l, m) {
                        var n, o, p, q, r, s, t, u, v = {},
                            w = [],
                            x = m || a[0];
                        l = "string" == typeof l ? "," + l + "," : h, null == f && (f = 1);
                        for (o in a[0]) w.push(o);
                        if (a.length > 1) {
                            for (u = a[a.length - 1], t = !0, n = w.length; --n > -1;)
                                if (o = w[n], Math.abs(x[o] - u[o]) > .05) {
                                    t = !1;
                                    break
                                } t && (a = a.concat(), m && a.unshift(m), a.push(a[1]), m = a[a.length - 3])
                        }
                        for (b.length = c.length = d.length = 0, n = w.length; --n > -1;) o = w[n], e[o] = -1 !== l.indexOf("," + o + ","), v[o] = k(a, o, e[o], m);
                        for (n = b.length; --n > -1;) b[n] = Math.sqrt(b[n]), c[n] = Math.sqrt(c[n]);
                        if (!i) {
                            for (n = w.length; --n > -1;)
                                if (e[o])
                                    for (p = v[w[n]], s = p.length - 1, q = 0; s > q; q++) r = p[q + 1].da / c[q] + p[q].da / b[q] || 0, d[q] = (d[q] || 0) + r * r;
                            for (n = d.length; --n > -1;) d[n] = Math.sqrt(d[n])
                        }
                        for (n = w.length, q = g ? 4 : 1; --n > -1;) o = w[n], p = v[o], j(p, f, g, i, e[o]), t && (p.splice(0, q), p.splice(p.length - q, q));
                        return v
                    },
                    m = function(a, b, c) {
                        b = b || "soft";
                        var d, e, f, h, i, j, k, l, m, n, o, p = {},
                            q = "cubic" === b ? 3 : 2,
                            r = "soft" === b,
                            s = [];
                        if (r && c && (a = [c].concat(a)), null == a || a.length < q + 1) throw "invalid Bezier data";
                        for (m in a[0]) s.push(m);
                        for (j = s.length; --j > -1;) {
                            for (m = s[j], p[m] = i = [], n = 0, l = a.length, k = 0; l > k; k++) d = null == c ? a[k][m] : "string" == typeof(o = a[k][m]) && "=" === o.charAt(1) ? c[m] + Number(o.charAt(0) + o.substr(2)) : Number(o), r && k > 1 && l - 1 > k && (i[n++] = (d + i[n - 2]) / 2), i[n++] = d;
                            for (l = n - q + 1, n = 0, k = 0; l > k; k += q) d = i[k], e = i[k + 1], f = i[k + 2], h = 2 === q ? 0 : i[k + 3], i[n++] = o = 3 === q ? new g(d, e, f, h) : new g(d, (2 * e + d) / 3, (2 * e + f) / 3, f);
                            i.length = n
                        }
                        return p
                    },
                    n = function(a, b, c) {
                        for (var d, e, f, g, h, i, j, k, l, m, n, o = 1 / c, p = a.length; --p > -1;)
                            for (m = a[p], f = m.a, g = m.d - f, h = m.c - f, i = m.b - f, d = e = 0, k = 1; c >= k; k++) j = o * k, l = 1 - j, d = e - (e = (j * j * g + 3 * l * (j * h + l * i)) * j), n = p * c + k - 1, b[n] = (b[n] || 0) + d * d
                    },
                    o = function(a, b) {
                        b = b >> 0 || 6;
                        var c, d, e, f, g = [],
                            h = [],
                            i = 0,
                            j = 0,
                            k = b - 1,
                            l = [],
                            m = [];
                        for (c in a) n(a[c], g, b);
                        for (e = g.length, d = 0; e > d; d++) i += Math.sqrt(g[d]), f = d % b, m[f] = i, f === k && (j += i, f = d / b >> 0, l[f] = m, h[f] = j, i = 0, m = []);
                        return {
                            length: j,
                            lengths: h,
                            segments: l
                        }
                    },
                    p = _gsScope._gsDefine.plugin({
                        propName: "bezier",
                        priority: -1,
                        version: "1.3.7",
                        API: 2,
                        global: !0,
                        init: function(a, b, c) {
                            this._target = a, b instanceof Array && (b = {
                                values: b
                            }), this._func = {}, this._mod = {}, this._props = [], this._timeRes = null == b.timeResolution ? 6 : parseInt(b.timeResolution, 10);
                            var d, e, f, g, h, i = b.values || [],
                                j = {},
                                k = i[0],
                                n = b.autoRotate || c.vars.orientToBezier;
                            this._autoRotate = n ? n instanceof Array ? n : [
                                ["x", "y", "rotation", n === !0 ? 0 : Number(n) || 0]
                            ] : null;
                            for (d in k) this._props.push(d);
                            for (f = this._props.length; --f > -1;) d = this._props[f], this._overwriteProps.push(d), e = this._func[d] = "function" == typeof a[d], j[d] = e ? a[d.indexOf("set") || "function" != typeof a["get" + d.substr(3)] ? d : "get" + d.substr(3)]() : parseFloat(a[d]), h || j[d] !== i[0][d] && (h = j);
                            if (this._beziers = "cubic" !== b.type && "quadratic" !== b.type && "soft" !== b.type ? l(i, isNaN(b.curviness) ? 1 : b.curviness, !1, "thruBasic" === b.type, b.correlate, h) : m(i, b.type, j), this._segCount = this._beziers[d].length, this._timeRes) {
                                var p = o(this._beziers, this._timeRes);
                                this._length = p.length, this._lengths = p.lengths, this._segments = p.segments, this._l1 = this._li = this._s1 = this._si = 0, this._l2 = this._lengths[0], this._curSeg = this._segments[0], this._s2 = this._curSeg[0], this._prec = 1 / this._curSeg.length
                            }
                            if (n = this._autoRotate)
                                for (this._initialRotations = [], n[0] instanceof Array || (this._autoRotate = n = [n]), f = n.length; --f > -1;) {
                                    for (g = 0; 3 > g; g++) d = n[f][g], this._func[d] = "function" == typeof a[d] ? a[d.indexOf("set") || "function" != typeof a["get" + d.substr(3)] ? d : "get" + d.substr(3)] : !1;
                                    d = n[f][2], this._initialRotations[f] = (this._func[d] ? this._func[d].call(this._target) : this._target[d]) || 0, this._overwriteProps.push(d)
                                }
                            return this._startRatio = c.vars.runBackwards ? 1 : 0, !0
                        },
                        set: function(b) {
                            var c, d, e, f, g, h, i, j, k, l, m = this._segCount,
                                n = this._func,
                                o = this._target,
                                p = b !== this._startRatio;
                            if (this._timeRes) {
                                if (k = this._lengths, l = this._curSeg, b *= this._length, e = this._li, b > this._l2 && m - 1 > e) {
                                    for (j = m - 1; j > e && (this._l2 = k[++e]) <= b;);
                                    this._l1 = k[e - 1], this._li = e, this._curSeg = l = this._segments[e], this._s2 = l[this._s1 = this._si = 0]
                                } else if (b < this._l1 && e > 0) {
                                    for (; e > 0 && (this._l1 = k[--e]) >= b;);
                                    0 === e && b < this._l1 ? this._l1 = 0 : e++, this._l2 = k[e], this._li = e, this._curSeg = l = this._segments[e], this._s1 = l[(this._si = l.length - 1) - 1] || 0, this._s2 = l[this._si]
                                }
                                if (c = e, b -= this._l1, e = this._si, b > this._s2 && e < l.length - 1) {
                                    for (j = l.length - 1; j > e && (this._s2 = l[++e]) <= b;);
                                    this._s1 = l[e - 1], this._si = e
                                } else if (b < this._s1 && e > 0) {
                                    for (; e > 0 && (this._s1 = l[--e]) >= b;);
                                    0 === e && b < this._s1 ? this._s1 = 0 : e++, this._s2 = l[e], this._si = e
                                }
                                h = (e + (b - this._s1) / (this._s2 - this._s1)) * this._prec || 0
                            } else c = 0 > b ? 0 : b >= 1 ? m - 1 : m * b >> 0, h = (b - c * (1 / m)) * m;
                            for (d = 1 - h, e = this._props.length; --e > -1;) f = this._props[e], g = this._beziers[f][c], i = (h * h * g.da + 3 * d * (h * g.ca + d * g.ba)) * h + g.a, this._mod[f] && (i = this._mod[f](i, o)), n[f] ? o[f](i) : o[f] = i;
                            if (this._autoRotate) {
                                var q, r, s, t, u, v, w, x = this._autoRotate;
                                for (e = x.length; --e > -1;) f = x[e][2], v = x[e][3] || 0, w = x[e][4] === !0 ? 1 : a, g = this._beziers[x[e][0]], q = this._beziers[x[e][1]], g && q && (g = g[c], q = q[c], r = g.a + (g.b - g.a) * h, t = g.b + (g.c - g.b) * h, r += (t - r) * h, t += (g.c + (g.d - g.c) * h - t) * h, s = q.a + (q.b - q.a) * h, u = q.b + (q.c - q.b) * h, s += (u - s) * h, u += (q.c + (q.d - q.c) * h - u) * h, i = p ? Math.atan2(u - s, t - r) * w + v : this._initialRotations[e], this._mod[f] && (i = this._mod[f](i, o)), n[f] ? o[f](i) : o[f] = i)
                            }
                        }
                    }),
                    q = p.prototype;
                p.bezierThrough = l, p.cubicToQuadratic = i, p._autoCSS = !0, p.quadraticToCubic = function(a, b, c) {
                    return new g(a, (2 * b + a) / 3, (2 * b + c) / 3, c)
                }, p._cssRegister = function() {
                    var a = f.CSSPlugin;
                    if (a) {
                        var b = a._internals,
                            c = b._parseToProxy,
                            d = b._setPluginRatio,
                            e = b.CSSPropTween;
                        b._registerComplexSpecialProp("bezier", {
                            parser: function(a, b, f, g, h, i) {
                                b instanceof Array && (b = {
                                    values: b
                                }), i = new p;
                                var j, k, l, m = b.values,
                                    n = m.length - 1,
                                    o = [],
                                    q = {};
                                if (0 > n) return h;
                                for (j = 0; n >= j; j++) l = c(a, m[j], g, h, i, n !== j), o[j] = l.end;
                                for (k in b) q[k] = b[k];
                                return q.values = o, h = new e(a, "bezier", 0, 0, l.pt, 2), h.data = l, h.plugin = i, h.setRatio = d, 0 === q.autoRotate && (q.autoRotate = !0), !q.autoRotate || q.autoRotate instanceof Array || (j = q.autoRotate === !0 ? 0 : Number(q.autoRotate), q.autoRotate = null != l.end.left ? [
                                    ["left", "top", "rotation", j, !1]
                                ] : null != l.end.x ? [
                                    ["x", "y", "rotation", j, !1]
                                ] : !1), q.autoRotate && (g._transform || g._enableTransforms(!1), l.autoRotate = g._target._gsTransform, l.proxy.rotation = l.autoRotate.rotation || 0, g._overwriteProps.push("rotation")), i._onInitTween(l.proxy, q, g._tween), h
                            }
                        })
                    }
                }, q._mod = function(a) {
                    for (var b, c = this._overwriteProps, d = c.length; --d > -1;) b = a[c[d]], b && "function" == typeof b && (this._mod[c[d]] = b)
                }, q._kill = function(a) {
                    var b, c, d = this._props;
                    for (b in this._beziers)
                        if (b in a)
                            for (delete this._beziers[b], delete this._func[b], c = d.length; --c > -1;) d[c] === b && d.splice(c, 1);
                    if (d = this._autoRotate)
                        for (c = d.length; --c > -1;) a[d[c][2]] && d.splice(c, 1);
                    return this._super._kill.call(this, a)
                }
            }(), _gsScope._gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin", "TweenLite"], function(a, b) {
                var c, d, e, f, g = function() {
                        a.call(this, "css"), this._overwriteProps.length = 0, this.setRatio = g.prototype.setRatio
                    },
                    h = _gsScope._gsDefine.globals,
                    i = {},
                    j = g.prototype = new a("css");
                j.constructor = g, g.version = "1.19.0", g.API = 2, g.defaultTransformPerspective = 0, g.defaultSkewType = "compensated", g.defaultSmoothOrigin = !0, j = "px", g.suffixMap = {
                    top: j,
                    right: j,
                    bottom: j,
                    left: j,
                    width: j,
                    height: j,
                    fontSize: j,
                    padding: j,
                    margin: j,
                    perspective: j,
                    lineHeight: ""
                };
                var k, l, m, n, o, p, q, r, s = /(?:\-|\.|\b)(\d|\.|e\-)+/g,
                    t = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,
                    u = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,
                    v = /(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g,
                    w = /(?:\d|\-|\+|=|#|\.)*/g,
                    x = /opacity *= *([^)]*)/i,
                    y = /opacity:([^;]*)/i,
                    z = /alpha\(opacity *=.+?\)/i,
                    A = /^(rgb|hsl)/,
                    B = /([A-Z])/g,
                    C = /-([a-z])/gi,
                    D = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi,
                    E = function(a, b) {
                        return b.toUpperCase()
                    },
                    F = /(?:Left|Right|Width)/i,
                    G = /(M11|M12|M21|M22)=[\d\-\.e]+/gi,
                    H = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,
                    I = /,(?=[^\)]*(?:\(|$))/gi,
                    J = /[\s,\(]/i,
                    K = Math.PI / 180,
                    L = 180 / Math.PI,
                    M = {},
                    N = document,
                    O = function(a) {
                        return N.createElementNS ? N.createElementNS("http://www.w3.org/1999/xhtml", a) : N.createElement(a)
                    },
                    P = O("div"),
                    Q = O("img"),
                    R = g._internals = {
                        _specialProps: i
                    },
                    S = navigator.userAgent,
                    T = function() {
                        var a = S.indexOf("Android"),
                            b = O("a");
                        return m = -1 !== S.indexOf("Safari") && -1 === S.indexOf("Chrome") && (-1 === a || Number(S.substr(a + 8, 1)) > 3), o = m && Number(S.substr(S.indexOf("Version/") + 8, 1)) < 6, n = -1 !== S.indexOf("Firefox"), (/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(S) || /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(S)) && (p = parseFloat(RegExp.$1)), b ? (b.style.cssText = "top:1px;opacity:.55;", /^0.55/.test(b.style.opacity)) : !1
                    }(),
                    U = function(a) {
                        return x.test("string" == typeof a ? a : (a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? parseFloat(RegExp.$1) / 100 : 1
                    },
                    V = function(a) {
                        window.console && console.log(a)
                    },
                    W = "",
                    X = "",
                    Y = function(a, b) {
                        b = b || P;
                        var c, d, e = b.style;
                        if (void 0 !== e[a]) return a;
                        for (a = a.charAt(0).toUpperCase() + a.substr(1), c = ["O", "Moz", "ms", "Ms", "Webkit"], d = 5; --d > -1 && void 0 === e[c[d] + a];);
                        return d >= 0 ? (X = 3 === d ? "ms" : c[d], W = "-" + X.toLowerCase() + "-", X + a) : null
                    },
                    Z = N.defaultView ? N.defaultView.getComputedStyle : function() {},
                    $ = g.getStyle = function(a, b, c, d, e) {
                        var f;
                        return T || "opacity" !== b ? (!d && a.style[b] ? f = a.style[b] : (c = c || Z(a)) ? f = c[b] || c.getPropertyValue(b) || c.getPropertyValue(b.replace(B, "-$1").toLowerCase()) : a.currentStyle && (f = a.currentStyle[b]), null == e || f && "none" !== f && "auto" !== f && "auto auto" !== f ? f : e) : U(a)
                    },
                    _ = R.convertToPixels = function(a, c, d, e, f) {
                        if ("px" === e || !e) return d;
                        if ("auto" === e || !d) return 0;
                        var h, i, j, k = F.test(c),
                            l = a,
                            m = P.style,
                            n = 0 > d,
                            o = 1 === d;
                        if (n && (d = -d), o && (d *= 100), "%" === e && -1 !== c.indexOf("border")) h = d / 100 * (k ? a.clientWidth : a.clientHeight);
                        else {
                            if (m.cssText = "border:0 solid red;position:" + $(a, "position") + ";line-height:0;", "%" !== e && l.appendChild && "v" !== e.charAt(0) && "rem" !== e) m[k ? "borderLeftWidth" : "borderTopWidth"] = d + e;
                            else {
                                if (l = a.parentNode || N.body, i = l._gsCache, j = b.ticker.frame, i && k && i.time === j) return i.width * d / 100;
                                m[k ? "width" : "height"] = d + e
                            }
                            l.appendChild(P), h = parseFloat(P[k ? "offsetWidth" : "offsetHeight"]), l.removeChild(P), k && "%" === e && g.cacheWidths !== !1 && (i = l._gsCache = l._gsCache || {}, i.time = j, i.width = h / d * 100), 0 !== h || f || (h = _(a, c, d, e, !0))
                        }
                        return o && (h /= 100), n ? -h : h
                    },
                    aa = R.calculateOffset = function(a, b, c) {
                        if ("absolute" !== $(a, "position", c)) return 0;
                        var d = "left" === b ? "Left" : "Top",
                            e = $(a, "margin" + d, c);
                        return a["offset" + d] - (_(a, b, parseFloat(e), e.replace(w, "")) || 0)
                    },
                    ba = function(a, b) {
                        var c, d, e, f = {};
                        if (b = b || Z(a, null))
                            if (c = b.length)
                                for (; --c > -1;) e = b[c], (-1 === e.indexOf("-transform") || Ca === e) && (f[e.replace(C, E)] = b.getPropertyValue(e));
                            else
                                for (c in b)(-1 === c.indexOf("Transform") || Ba === c) && (f[c] = b[c]);
                        else if (b = a.currentStyle || a.style)
                            for (c in b) "string" == typeof c && void 0 === f[c] && (f[c.replace(C, E)] = b[c]);
                        return T || (f.opacity = U(a)), d = Pa(a, b, !1), f.rotation = d.rotation, f.skewX = d.skewX, f.scaleX = d.scaleX, f.scaleY = d.scaleY, f.x = d.x, f.y = d.y, Ea && (f.z = d.z, f.rotationX = d.rotationX, f.rotationY = d.rotationY, f.scaleZ = d.scaleZ), f.filters && delete f.filters, f
                    },
                    ca = function(a, b, c, d, e) {
                        var f, g, h, i = {},
                            j = a.style;
                        for (g in c) "cssText" !== g && "length" !== g && isNaN(g) && (b[g] !== (f = c[g]) || e && e[g]) && -1 === g.indexOf("Origin") && ("number" == typeof f || "string" == typeof f) && (i[g] = "auto" !== f || "left" !== g && "top" !== g ? "" !== f && "auto" !== f && "none" !== f || "string" != typeof b[g] || "" === b[g].replace(v, "") ? f : 0 : aa(a, g), void 0 !== j[g] && (h = new ra(j, g, j[g], h)));
                        if (d)
                            for (g in d) "className" !== g && (i[g] = d[g]);
                        return {
                            difs: i,
                            firstMPT: h
                        }
                    },
                    da = {
                        width: ["Left", "Right"],
                        height: ["Top", "Bottom"]
                    },
                    ea = ["marginLeft", "marginRight", "marginTop", "marginBottom"],
                    fa = function(a, b, c) {
                        if ("svg" === (a.nodeName + "").toLowerCase()) return (c || Z(a))[b] || 0;
                        if (a.getBBox && Ma(a)) return a.getBBox()[b] || 0;
                        var d = parseFloat("width" === b ? a.offsetWidth : a.offsetHeight),
                            e = da[b],
                            f = e.length;
                        for (c = c || Z(a, null); --f > -1;) d -= parseFloat($(a, "padding" + e[f], c, !0)) || 0, d -= parseFloat($(a, "border" + e[f] + "Width", c, !0)) || 0;
                        return d
                    },
                    ga = function(a, b) {
                        if ("contain" === a || "auto" === a || "auto auto" === a) return a + " ";
                        (null == a || "" === a) && (a = "0 0");
                        var c, d = a.split(" "),
                            e = -1 !== a.indexOf("left") ? "0%" : -1 !== a.indexOf("right") ? "100%" : d[0],
                            f = -1 !== a.indexOf("top") ? "0%" : -1 !== a.indexOf("bottom") ? "100%" : d[1];
                        if (d.length > 3 && !b) {
                            for (d = a.split(", ").join(",").split(","), a = [], c = 0; c < d.length; c++) a.push(ga(d[c]));
                            return a.join(",")
                        }
                        return null == f ? f = "center" === e ? "50%" : "0" : "center" === f && (f = "50%"), ("center" === e || isNaN(parseFloat(e)) && -1 === (e + "").indexOf("=")) && (e = "50%"), a = e + " " + f + (d.length > 2 ? " " + d[2] : ""), b && (b.oxp = -1 !== e.indexOf("%"), b.oyp = -1 !== f.indexOf("%"), b.oxr = "=" === e.charAt(1), b.oyr = "=" === f.charAt(1), b.ox = parseFloat(e.replace(v, "")), b.oy = parseFloat(f.replace(v, "")), b.v = a), b || a
                    },
                    ha = function(a, b) {
                        return "function" == typeof a && (a = a(r, q)), "string" == typeof a && "=" === a.charAt(1) ? parseInt(a.charAt(0) + "1", 10) * parseFloat(a.substr(2)) : parseFloat(a) - parseFloat(b) || 0
                    },
                    ia = function(a, b) {
                        return "function" == typeof a && (a = a(r, q)), null == a ? b : "string" == typeof a && "=" === a.charAt(1) ? parseInt(a.charAt(0) + "1", 10) * parseFloat(a.substr(2)) + b : parseFloat(a) || 0
                    },
                    ja = function(a, b, c, d) {
                        var e, f, g, h, i, j = 1e-6;
                        return "function" == typeof a && (a = a(r, q)), null == a ? h = b : "number" == typeof a ? h = a : (e = 360, f = a.split("_"), i = "=" === a.charAt(1), g = (i ? parseInt(a.charAt(0) + "1", 10) * parseFloat(f[0].substr(2)) : parseFloat(f[0])) * (-1 === a.indexOf("rad") ? 1 : L) - (i ? 0 : b), f.length && (d && (d[c] = b + g), -1 !== a.indexOf("short") && (g %= e, g !== g % (e / 2) && (g = 0 > g ? g + e : g - e)), -1 !== a.indexOf("_cw") && 0 > g ? g = (g + 9999999999 * e) % e - (g / e | 0) * e : -1 !== a.indexOf("ccw") && g > 0 && (g = (g - 9999999999 * e) % e - (g / e | 0) * e)), h = b + g), j > h && h > -j && (h = 0), h
                    },
                    ka = {
                        aqua: [0, 255, 255],
                        lime: [0, 255, 0],
                        silver: [192, 192, 192],
                        black: [0, 0, 0],
                        maroon: [128, 0, 0],
                        teal: [0, 128, 128],
                        blue: [0, 0, 255],
                        navy: [0, 0, 128],
                        white: [255, 255, 255],
                        fuchsia: [255, 0, 255],
                        olive: [128, 128, 0],
                        yellow: [255, 255, 0],
                        orange: [255, 165, 0],
                        gray: [128, 128, 128],
                        purple: [128, 0, 128],
                        green: [0, 128, 0],
                        red: [255, 0, 0],
                        pink: [255, 192, 203],
                        cyan: [0, 255, 255],
                        transparent: [255, 255, 255, 0]
                    },
                    la = function(a, b, c) {
                        return a = 0 > a ? a + 1 : a > 1 ? a - 1 : a, 255 * (1 > 6 * a ? b + (c - b) * a * 6 : .5 > a ? c : 2 > 3 * a ? b + (c - b) * (2 / 3 - a) * 6 : b) + .5 | 0
                    },
                    ma = g.parseColor = function(a, b) {
                        var c, d, e, f, g, h, i, j, k, l, m;
                        if (a)
                            if ("number" == typeof a) c = [a >> 16, a >> 8 & 255, 255 & a];
                            else {
                                if ("," === a.charAt(a.length - 1) && (a = a.substr(0, a.length - 1)), ka[a]) c = ka[a];
                                else if ("#" === a.charAt(0)) 4 === a.length && (d = a.charAt(1), e = a.charAt(2), f = a.charAt(3), a = "#" + d + d + e + e + f + f), a = parseInt(a.substr(1), 16), c = [a >> 16, a >> 8 & 255, 255 & a];
                                else if ("hsl" === a.substr(0, 3))
                                    if (c = m = a.match(s), b) {
                                        if (-1 !== a.indexOf("=")) return a.match(t)
                                    } else g = Number(c[0]) % 360 / 360, h = Number(c[1]) / 100, i = Number(c[2]) / 100, e = .5 >= i ? i * (h + 1) : i + h - i * h, d = 2 * i - e, c.length > 3 && (c[3] = Number(a[3])), c[0] = la(g + 1 / 3, d, e), c[1] = la(g, d, e), c[2] = la(g - 1 / 3, d, e);
                                else c = a.match(s) || ka.transparent;
                                c[0] = Number(c[0]), c[1] = Number(c[1]), c[2] = Number(c[2]), c.length > 3 && (c[3] = Number(c[3]))
                            }
                        else c = ka.black;
                        return b && !m && (d = c[0] / 255, e = c[1] / 255, f = c[2] / 255, j = Math.max(d, e, f), k = Math.min(d, e, f), i = (j + k) / 2, j === k ? g = h = 0 : (l = j - k, h = i > .5 ? l / (2 - j - k) : l / (j + k), g = j === d ? (e - f) / l + (f > e ? 6 : 0) : j === e ? (f - d) / l + 2 : (d - e) / l + 4, g *= 60), c[0] = g + .5 | 0, c[1] = 100 * h + .5 | 0, c[2] = 100 * i + .5 | 0), c
                    },
                    na = function(a, b) {
                        var c, d, e, f = a.match(oa) || [],
                            g = 0,
                            h = f.length ? "" : a;
                        for (c = 0; c < f.length; c++) d = f[c], e = a.substr(g, a.indexOf(d, g) - g), g += e.length + d.length, d = ma(d, b), 3 === d.length && d.push(1), h += e + (b ? "hsla(" + d[0] + "," + d[1] + "%," + d[2] + "%," + d[3] : "rgba(" + d.join(",")) + ")";
                        return h + a.substr(g)
                    },
                    oa = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b";
                for (j in ka) oa += "|" + j + "\\b";
                oa = new RegExp(oa + ")", "gi"), g.colorStringFilter = function(a) {
                    var b, c = a[0] + a[1];
                    oa.test(c) && (b = -1 !== c.indexOf("hsl(") || -1 !== c.indexOf("hsla("), a[0] = na(a[0], b), a[1] = na(a[1], b)), oa.lastIndex = 0
                }, b.defaultStringFilter || (b.defaultStringFilter = g.colorStringFilter);
                var pa = function(a, b, c, d) {
                        if (null == a) return function(a) {
                            return a
                        };
                        var e, f = b ? (a.match(oa) || [""])[0] : "",
                            g = a.split(f).join("").match(u) || [],
                            h = a.substr(0, a.indexOf(g[0])),
                            i = ")" === a.charAt(a.length - 1) ? ")" : "",
                            j = -1 !== a.indexOf(" ") ? " " : ",",
                            k = g.length,
                            l = k > 0 ? g[0].replace(s, "") : "";
                        return k ? e = b ? function(a) {
                            var b, m, n, o;
                            if ("number" == typeof a) a += l;
                            else if (d && I.test(a)) {
                                for (o = a.replace(I, "|").split("|"), n = 0; n < o.length; n++) o[n] = e(o[n]);
                                return o.join(",")
                            }
                            if (b = (a.match(oa) || [f])[0], m = a.split(b).join("").match(u) || [], n = m.length, k > n--)
                                for (; ++n < k;) m[n] = c ? m[(n - 1) / 2 | 0] : g[n];
                            return h + m.join(j) + j + b + i + (-1 !== a.indexOf("inset") ? " inset" : "")
                        } : function(a) {
                            var b, f, m;
                            if ("number" == typeof a) a += l;
                            else if (d && I.test(a)) {
                                for (f = a.replace(I, "|").split("|"), m = 0; m < f.length; m++) f[m] = e(f[m]);
                                return f.join(",")
                            }
                            if (b = a.match(u) || [], m = b.length, k > m--)
                                for (; ++m < k;) b[m] = c ? b[(m - 1) / 2 | 0] : g[m];
                            return h + b.join(j) + i
                        } : function(a) {
                            return a
                        }
                    },
                    qa = function(a) {
                        return a = a.split(","),
                            function(b, c, d, e, f, g, h) {
                                var i, j = (c + "").split(" ");
                                for (h = {}, i = 0; 4 > i; i++) h[a[i]] = j[i] = j[i] || j[(i - 1) / 2 >> 0];
                                return e.parse(b, h, f, g)
                            }
                    },
                    ra = (R._setPluginRatio = function(a) {
                        this.plugin.setRatio(a);
                        for (var b, c, d, e, f, g = this.data, h = g.proxy, i = g.firstMPT, j = 1e-6; i;) b = h[i.v], i.r ? b = Math.round(b) : j > b && b > -j && (b = 0), i.t[i.p] = b, i = i._next;
                        if (g.autoRotate && (g.autoRotate.rotation = g.mod ? g.mod(h.rotation, this.t) : h.rotation), 1 === a || 0 === a)
                            for (i = g.firstMPT, f = 1 === a ? "e" : "b"; i;) {
                                if (c = i.t, c.type) {
                                    if (1 === c.type) {
                                        for (e = c.xs0 + c.s + c.xs1, d = 1; d < c.l; d++) e += c["xn" + d] + c["xs" + (d + 1)];
                                        c[f] = e
                                    }
                                } else c[f] = c.s + c.xs0;
                                i = i._next
                            }
                    }, function(a, b, c, d, e) {
                        this.t = a, this.p = b, this.v = c, this.r = e, d && (d._prev = this, this._next = d)
                    }),
                    sa = (R._parseToProxy = function(a, b, c, d, e, f) {
                        var g, h, i, j, k, l = d,
                            m = {},
                            n = {},
                            o = c._transform,
                            p = M;
                        for (c._transform = null, M = b, d = k = c.parse(a, b, d, e), M = p, f && (c._transform = o, l && (l._prev = null, l._prev && (l._prev._next = null))); d && d !== l;) {
                            if (d.type <= 1 && (h = d.p, n[h] = d.s + d.c, m[h] = d.s, f || (j = new ra(d, "s", h, j, d.r), d.c = 0), 1 === d.type))
                                for (g = d.l; --g > 0;) i = "xn" + g, h = d.p + "_" + i, n[h] = d.data[i], m[h] = d[i], f || (j = new ra(d, i, h, j, d.rxp[i]));
                            d = d._next
                        }
                        return {
                            proxy: m,
                            end: n,
                            firstMPT: j,
                            pt: k
                        }
                    }, R.CSSPropTween = function(a, b, d, e, g, h, i, j, k, l, m) {
                        this.t = a, this.p = b, this.s = d, this.c = e, this.n = i || b, a instanceof sa || f.push(this.n), this.r = j, this.type = h || 0, k && (this.pr = k, c = !0), this.b = void 0 === l ? d : l, this.e = void 0 === m ? d + e : m, g && (this._next = g, g._prev = this)
                    }),
                    ta = function(a, b, c, d, e, f) {
                        var g = new sa(a, b, c, d - c, e, -1, f);
                        return g.b = c, g.e = g.xs0 = d, g
                    },
                    ua = g.parseComplex = function(a, b, c, d, e, f, h, i, j, l) {
                        c = c || f || "", "function" == typeof d && (d = d(r, q)), h = new sa(a, b, 0, 0, h, l ? 2 : 1, null, !1, i, c, d), d += "", e && oa.test(d + c) && (d = [c, d], g.colorStringFilter(d), c = d[0], d = d[1]);
                        var m, n, o, p, u, v, w, x, y, z, A, B, C, D = c.split(", ").join(",").split(" "),
                            E = d.split(", ").join(",").split(" "),
                            F = D.length,
                            G = k !== !1;
                        for ((-1 !== d.indexOf(",") || -1 !== c.indexOf(",")) && (D = D.join(" ").replace(I, ", ").split(" "), E = E.join(" ").replace(I, ", ").split(" "), F = D.length), F !== E.length && (D = (f || "").split(" "), F = D.length), h.plugin = j, h.setRatio = l, oa.lastIndex = 0, m = 0; F > m; m++)
                            if (p = D[m], u = E[m], x = parseFloat(p), x || 0 === x) h.appendXtra("", x, ha(u, x), u.replace(t, ""), G && -1 !== u.indexOf("px"), !0);
                            else if (e && oa.test(p)) B = u.indexOf(")") + 1, B = ")" + (B ? u.substr(B) : ""), C = -1 !== u.indexOf("hsl") && T, p = ma(p, C), u = ma(u, C), y = p.length + u.length > 6, y && !T && 0 === u[3] ? (h["xs" + h.l] += h.l ? " transparent" : "transparent", h.e = h.e.split(E[m]).join("transparent")) : (T || (y = !1), C ? h.appendXtra(y ? "hsla(" : "hsl(", p[0], ha(u[0], p[0]), ",", !1, !0).appendXtra("", p[1], ha(u[1], p[1]), "%,", !1).appendXtra("", p[2], ha(u[2], p[2]), y ? "%," : "%" + B, !1) : h.appendXtra(y ? "rgba(" : "rgb(", p[0], u[0] - p[0], ",", !0, !0).appendXtra("", p[1], u[1] - p[1], ",", !0).appendXtra("", p[2], u[2] - p[2], y ? "," : B, !0), y && (p = p.length < 4 ? 1 : p[3], h.appendXtra("", p, (u.length < 4 ? 1 : u[3]) - p, B, !1))), oa.lastIndex = 0;
                        else if (v = p.match(s)) {
                            if (w = u.match(t), !w || w.length !== v.length) return h;
                            for (o = 0, n = 0; n < v.length; n++) A = v[n], z = p.indexOf(A, o), h.appendXtra(p.substr(o, z - o), Number(A), ha(w[n], A), "", G && "px" === p.substr(z + A.length, 2), 0 === n), o = z + A.length;
                            h["xs" + h.l] += p.substr(o)
                        } else h["xs" + h.l] += h.l || h["xs" + h.l] ? " " + u : u;
                        if (-1 !== d.indexOf("=") && h.data) {
                            for (B = h.xs0 + h.data.s, m = 1; m < h.l; m++) B += h["xs" + m] + h.data["xn" + m];
                            h.e = B + h["xs" + m]
                        }
                        return h.l || (h.type = -1, h.xs0 = h.e), h.xfirst || h
                    },
                    va = 9;
                for (j = sa.prototype, j.l = j.pr = 0; --va > 0;) j["xn" + va] = 0, j["xs" + va] = "";
                j.xs0 = "", j._next = j._prev = j.xfirst = j.data = j.plugin = j.setRatio = j.rxp = null, j.appendXtra = function(a, b, c, d, e, f) {
                    var g = this,
                        h = g.l;
                    return g["xs" + h] += f && (h || g["xs" + h]) ? " " + a : a || "", c || 0 === h || g.plugin ? (g.l++, g.type = g.setRatio ? 2 : 1, g["xs" + g.l] = d || "", h > 0 ? (g.data["xn" + h] = b + c, g.rxp["xn" + h] = e, g["xn" + h] = b, g.plugin || (g.xfirst = new sa(g, "xn" + h, b, c, g.xfirst || g, 0, g.n, e, g.pr), g.xfirst.xs0 = 0), g) : (g.data = {
                        s: b + c
                    }, g.rxp = {}, g.s = b, g.c = c, g.r = e, g)) : (g["xs" + h] += b + (d || ""), g)
                };
                var wa = function(a, b) {
                        b = b || {}, this.p = b.prefix ? Y(a) || a : a, i[a] = i[this.p] = this, this.format = b.formatter || pa(b.defaultValue, b.color, b.collapsible, b.multi), b.parser && (this.parse = b.parser), this.clrs = b.color, this.multi = b.multi, this.keyword = b.keyword, this.dflt = b.defaultValue, this.pr = b.priority || 0
                    },
                    xa = R._registerComplexSpecialProp = function(a, b, c) {
                        "object" != typeof b && (b = {
                            parser: c
                        });
                        var d, e, f = a.split(","),
                            g = b.defaultValue;
                        for (c = c || [g], d = 0; d < f.length; d++) b.prefix = 0 === d && b.prefix, b.defaultValue = c[d] || g, e = new wa(f[d], b)
                    },
                    ya = R._registerPluginProp = function(a) {
                        if (!i[a]) {
                            var b = a.charAt(0).toUpperCase() + a.substr(1) + "Plugin";
                            xa(a, {
                                parser: function(a, c, d, e, f, g, j) {
                                    var k = h.com.greensock.plugins[b];
                                    return k ? (k._cssRegister(), i[d].parse(a, c, d, e, f, g, j)) : (V("Error: " + b + " js file not loaded."), f)
                                }
                            })
                        }
                    };
                j = wa.prototype, j.parseComplex = function(a, b, c, d, e, f) {
                    var g, h, i, j, k, l, m = this.keyword;
                    if (this.multi && (I.test(c) || I.test(b) ? (h = b.replace(I, "|").split("|"), i = c.replace(I, "|").split("|")) : m && (h = [b], i = [c])), i) {
                        for (j = i.length > h.length ? i.length : h.length, g = 0; j > g; g++) b = h[g] = h[g] || this.dflt, c = i[g] = i[g] || this.dflt, m && (k = b.indexOf(m), l = c.indexOf(m), k !== l && (-1 === l ? h[g] = h[g].split(m).join("") : -1 === k && (h[g] += " " + m)));
                        b = h.join(", "), c = i.join(", ")
                    }
                    return ua(a, this.p, b, c, this.clrs, this.dflt, d, this.pr, e, f)
                }, j.parse = function(a, b, c, d, f, g, h) {
                    return this.parseComplex(a.style, this.format($(a, this.p, e, !1, this.dflt)), this.format(b), f, g)
                }, g.registerSpecialProp = function(a, b, c) {
                    xa(a, {
                        parser: function(a, d, e, f, g, h, i) {
                            var j = new sa(a, e, 0, 0, g, 2, e, !1, c);
                            return j.plugin = h, j.setRatio = b(a, d, f._tween, e), j
                        },
                        priority: c
                    })
                }, g.useSVGTransformAttr = m || n;
                var za, Aa = "scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent".split(","),
                    Ba = Y("transform"),
                    Ca = W + "transform",
                    Da = Y("transformOrigin"),
                    Ea = null !== Y("perspective"),
                    Fa = R.Transform = function() {
                        this.perspective = parseFloat(g.defaultTransformPerspective) || 0, this.force3D = g.defaultForce3D !== !1 && Ea ? g.defaultForce3D || "auto" : !1
                    },
                    Ga = window.SVGElement,
                    Ha = function(a, b, c) {
                        var d, e = N.createElementNS("http://www.w3.org/2000/svg", a),
                            f = /([a-z])([A-Z])/g;
                        for (d in c) e.setAttributeNS(null, d.replace(f, "$1-$2").toLowerCase(), c[d]);
                        return b.appendChild(e), e
                    },
                    Ia = N.documentElement,
                    Ja = function() {
                        var a, b, c, d = p || /Android/i.test(S) && !window.chrome;
                        return N.createElementNS && !d && (a = Ha("svg", Ia), b = Ha("rect", a, {
                            width: 100,
                            height: 50,
                            x: 100
                        }), c = b.getBoundingClientRect().width, b.style[Da] = "50% 50%", b.style[Ba] = "scaleX(0.5)", d = c === b.getBoundingClientRect().width && !(n && Ea), Ia.removeChild(a)), d
                    }(),
                    Ka = function(a, b, c, d, e, f) {
                        var h, i, j, k, l, m, n, o, p, q, r, s, t, u, v = a._gsTransform,
                            w = Oa(a, !0);
                        v && (t = v.xOrigin, u = v.yOrigin), (!d || (h = d.split(" ")).length < 2) && (n = a.getBBox(), b = ga(b).split(" "), h = [(-1 !== b[0].indexOf("%") ? parseFloat(b[0]) / 100 * n.width : parseFloat(b[0])) + n.x, (-1 !== b[1].indexOf("%") ? parseFloat(b[1]) / 100 * n.height : parseFloat(b[1])) + n.y]), c.xOrigin = k = parseFloat(h[0]), c.yOrigin = l = parseFloat(h[1]), d && w !== Na && (m = w[0], n = w[1], o = w[2], p = w[3], q = w[4], r = w[5], s = m * p - n * o, i = k * (p / s) + l * (-o / s) + (o * r - p * q) / s, j = k * (-n / s) + l * (m / s) - (m * r - n * q) / s, k = c.xOrigin = h[0] = i, l = c.yOrigin = h[1] = j), v && (f && (c.xOffset = v.xOffset, c.yOffset = v.yOffset, v = c), e || e !== !1 && g.defaultSmoothOrigin !== !1 ? (i = k - t, j = l - u, v.xOffset += i * w[0] + j * w[2] - i, v.yOffset += i * w[1] + j * w[3] - j) : v.xOffset = v.yOffset = 0), f || a.setAttribute("data-svg-origin", h.join(" "))
                    },
                    La = function(a) {
                        try {
                            return a.getBBox()
                        } catch (a) {}
                    },
                    Ma = function(a) {
                        return !!(Ga && a.getBBox && a.getCTM && La(a) && (!a.parentNode || a.parentNode.getBBox && a.parentNode.getCTM))
                    },
                    Na = [1, 0, 0, 1, 0, 0],
                    Oa = function(a, b) {
                        var c, d, e, f, g, h, i = a._gsTransform || new Fa,
                            j = 1e5,
                            k = a.style;
                        if (Ba ? d = $(a, Ca, null, !0) : a.currentStyle && (d = a.currentStyle.filter.match(G), d = d && 4 === d.length ? [d[0].substr(4), Number(d[2].substr(4)), Number(d[1].substr(4)), d[3].substr(4), i.x || 0, i.y || 0].join(",") : ""), c = !d || "none" === d || "matrix(1, 0, 0, 1, 0, 0)" === d, c && Ba && ((h = "none" === Z(a).display) || !a.parentNode) && (h && (f = k.display, k.display = "block"), a.parentNode || (g = 1, Ia.appendChild(a)), d = $(a, Ca, null, !0), c = !d || "none" === d || "matrix(1, 0, 0, 1, 0, 0)" === d, f ? k.display = f : h && Ta(k, "display"), g && Ia.removeChild(a)), (i.svg || a.getBBox && Ma(a)) && (c && -1 !== (k[Ba] + "").indexOf("matrix") && (d = k[Ba], c = 0), e = a.getAttribute("transform"), c && e && (-1 !== e.indexOf("matrix") ? (d = e, c = 0) : -1 !== e.indexOf("translate") && (d = "matrix(1,0,0,1," + e.match(/(?:\-|\b)[\d\-\.e]+\b/gi).join(",") + ")", c = 0))), c) return Na;
                        for (e = (d || "").match(s) || [], va = e.length; --va > -1;) f = Number(e[va]), e[va] = (g = f - (f |= 0)) ? (g * j + (0 > g ? -.5 : .5) | 0) / j + f : f;
                        return b && e.length > 6 ? [e[0], e[1], e[4], e[5], e[12], e[13]] : e
                    },
                    Pa = R.getTransform = function(a, c, d, e) {
                        if (a._gsTransform && d && !e) return a._gsTransform;
                        var f, h, i, j, k, l, m = d ? a._gsTransform || new Fa : new Fa,
                            n = m.scaleX < 0,
                            o = 2e-5,
                            p = 1e5,
                            q = Ea ? parseFloat($(a, Da, c, !1, "0 0 0").split(" ")[2]) || m.zOrigin || 0 : 0,
                            r = parseFloat(g.defaultTransformPerspective) || 0;
                        if (m.svg = !(!a.getBBox || !Ma(a)), m.svg && (Ka(a, $(a, Da, c, !1, "50% 50%") + "", m, a.getAttribute("data-svg-origin")), za = g.useSVGTransformAttr || Ja), f = Oa(a), f !== Na) {
                            if (16 === f.length) {
                                var s, t, u, v, w, x = f[0],
                                    y = f[1],
                                    z = f[2],
                                    A = f[3],
                                    B = f[4],
                                    C = f[5],
                                    D = f[6],
                                    E = f[7],
                                    F = f[8],
                                    G = f[9],
                                    H = f[10],
                                    I = f[12],
                                    J = f[13],
                                    K = f[14],
                                    M = f[11],
                                    N = Math.atan2(D, H);
                                m.zOrigin && (K = -m.zOrigin, I = F * K - f[12], J = G * K - f[13], K = H * K + m.zOrigin - f[14]), m.rotationX = N * L, N && (v = Math.cos(-N), w = Math.sin(-N), s = B * v + F * w, t = C * v + G * w, u = D * v + H * w, F = B * -w + F * v, G = C * -w + G * v, H = D * -w + H * v, M = E * -w + M * v, B = s, C = t, D = u), N = Math.atan2(-z, H), m.rotationY = N * L, N && (v = Math.cos(-N), w = Math.sin(-N), s = x * v - F * w, t = y * v - G * w, u = z * v - H * w, G = y * w + G * v, H = z * w + H * v, M = A * w + M * v, x = s, y = t, z = u), N = Math.atan2(y, x), m.rotation = N * L, N && (v = Math.cos(-N), w = Math.sin(-N), x = x * v + B * w, t = y * v + C * w, C = y * -w + C * v, D = z * -w + D * v, y = t), m.rotationX && Math.abs(m.rotationX) + Math.abs(m.rotation) > 359.9 && (m.rotationX = m.rotation = 0, m.rotationY = 180 - m.rotationY), m.scaleX = (Math.sqrt(x * x + y * y) * p + .5 | 0) / p, m.scaleY = (Math.sqrt(C * C + G * G) * p + .5 | 0) / p, m.scaleZ = (Math.sqrt(D * D + H * H) * p + .5 | 0) / p, m.rotationX || m.rotationY ? m.skewX = 0 : (m.skewX = B || C ? Math.atan2(B, C) * L + m.rotation : m.skewX || 0, Math.abs(m.skewX) > 90 && Math.abs(m.skewX) < 270 && (n ? (m.scaleX *= -1, m.skewX += m.rotation <= 0 ? 180 : -180, m.rotation += m.rotation <= 0 ? 180 : -180) : (m.scaleY *= -1, m.skewX += m.skewX <= 0 ? 180 : -180))), m.perspective = M ? 1 / (0 > M ? -M : M) : 0, m.x = I, m.y = J, m.z = K, m.svg && (m.x -= m.xOrigin - (m.xOrigin * x - m.yOrigin * B), m.y -= m.yOrigin - (m.yOrigin * y - m.xOrigin * C))
                            } else if (!Ea || e || !f.length || m.x !== f[4] || m.y !== f[5] || !m.rotationX && !m.rotationY) {
                                var O = f.length >= 6,
                                    P = O ? f[0] : 1,
                                    Q = f[1] || 0,
                                    R = f[2] || 0,
                                    S = O ? f[3] : 1;
                                m.x = f[4] || 0, m.y = f[5] || 0, i = Math.sqrt(P * P + Q * Q), j = Math.sqrt(S * S + R * R), k = P || Q ? Math.atan2(Q, P) * L : m.rotation || 0, l = R || S ? Math.atan2(R, S) * L + k : m.skewX || 0, Math.abs(l) > 90 && Math.abs(l) < 270 && (n ? (i *= -1, l += 0 >= k ? 180 : -180, k += 0 >= k ? 180 : -180) : (j *= -1, l += 0 >= l ? 180 : -180)), m.scaleX = i, m.scaleY = j, m.rotation = k, m.skewX = l, Ea && (m.rotationX = m.rotationY = m.z = 0, m.perspective = r, m.scaleZ = 1), m.svg && (m.x -= m.xOrigin - (m.xOrigin * P + m.yOrigin * R), m.y -= m.yOrigin - (m.xOrigin * Q + m.yOrigin * S))
                            }
                            m.zOrigin = q;
                            for (h in m) m[h] < o && m[h] > -o && (m[h] = 0)
                        }
                        return d && (a._gsTransform = m, m.svg && (za && a.style[Ba] ? b.delayedCall(.001, function() {
                            Ta(a.style, Ba)
                        }) : !za && a.getAttribute("transform") && b.delayedCall(.001, function() {
                            a.removeAttribute("transform")
                        }))), m
                    },
                    Qa = function(a) {
                        var b, c, d = this.data,
                            e = -d.rotation * K,
                            f = e + d.skewX * K,
                            g = 1e5,
                            h = (Math.cos(e) * d.scaleX * g | 0) / g,
                            i = (Math.sin(e) * d.scaleX * g | 0) / g,
                            j = (Math.sin(f) * -d.scaleY * g | 0) / g,
                            k = (Math.cos(f) * d.scaleY * g | 0) / g,
                            l = this.t.style,
                            m = this.t.currentStyle;
                        if (m) {
                            c = i, i = -j, j = -c, b = m.filter, l.filter = "";
                            var n, o, q = this.t.offsetWidth,
                                r = this.t.offsetHeight,
                                s = "absolute" !== m.position,
                                t = "progid:DXImageTransform.Microsoft.Matrix(M11=" + h + ", M12=" + i + ", M21=" + j + ", M22=" + k,
                                u = d.x + q * d.xPercent / 100,
                                v = d.y + r * d.yPercent / 100;
                            if (null != d.ox && (n = (d.oxp ? q * d.ox * .01 : d.ox) - q / 2, o = (d.oyp ? r * d.oy * .01 : d.oy) - r / 2, u += n - (n * h + o * i), v += o - (n * j + o * k)), s ? (n = q / 2, o = r / 2, t += ", Dx=" + (n - (n * h + o * i) + u) + ", Dy=" + (o - (n * j + o * k) + v) + ")") : t += ", sizingMethod='auto expand')", -1 !== b.indexOf("DXImageTransform.Microsoft.Matrix(") ? l.filter = b.replace(H, t) : l.filter = t + " " + b, (0 === a || 1 === a) && 1 === h && 0 === i && 0 === j && 1 === k && (s && -1 === t.indexOf("Dx=0, Dy=0") || x.test(b) && 100 !== parseFloat(RegExp.$1) || -1 === b.indexOf(b.indexOf("Alpha")) && l.removeAttribute("filter")), !s) {
                                var y, z, A, B = 8 > p ? 1 : -1;
                                for (n = d.ieOffsetX || 0, o = d.ieOffsetY || 0, d.ieOffsetX = Math.round((q - ((0 > h ? -h : h) * q + (0 > i ? -i : i) * r)) / 2 + u), d.ieOffsetY = Math.round((r - ((0 > k ? -k : k) * r + (0 > j ? -j : j) * q)) / 2 + v), va = 0; 4 > va; va++) z = ea[va], y = m[z], c = -1 !== y.indexOf("px") ? parseFloat(y) : _(this.t, z, parseFloat(y), y.replace(w, "")) || 0, A = c !== d[z] ? 2 > va ? -d.ieOffsetX : -d.ieOffsetY : 2 > va ? n - d.ieOffsetX : o - d.ieOffsetY, l[z] = (d[z] = Math.round(c - A * (0 === va || 2 === va ? 1 : B))) + "px"
                            }
                        }
                    },
                    Ra = R.set3DTransformRatio = R.setTransformRatio = function(a) {
                        var b, c, d, e, f, g, h, i, j, k, l, m, o, p, q, r, s, t, u, v, w, x, y, z = this.data,
                            A = this.t.style,
                            B = z.rotation,
                            C = z.rotationX,
                            D = z.rotationY,
                            E = z.scaleX,
                            F = z.scaleY,
                            G = z.scaleZ,
                            H = z.x,
                            I = z.y,
                            J = z.z,
                            L = z.svg,
                            M = z.perspective,
                            N = z.force3D;
                        if (((1 === a || 0 === a) && "auto" === N && (this.tween._totalTime === this.tween._totalDuration || !this.tween._totalTime) || !N) && !J && !M && !D && !C && 1 === G || za && L || !Ea) return void(B || z.skewX || L ? (B *= K, x = z.skewX * K, y = 1e5, b = Math.cos(B) * E, e = Math.sin(B) * E, c = Math.sin(B - x) * -F, f = Math.cos(B - x) * F, x && "simple" === z.skewType && (s = Math.tan(x - z.skewY * K), s = Math.sqrt(1 + s * s), c *= s, f *= s, z.skewY && (s = Math.tan(z.skewY * K), s = Math.sqrt(1 + s * s), b *= s, e *= s)), L && (H += z.xOrigin - (z.xOrigin * b + z.yOrigin * c) + z.xOffset, I += z.yOrigin - (z.xOrigin * e + z.yOrigin * f) + z.yOffset, za && (z.xPercent || z.yPercent) && (p = this.t.getBBox(), H += .01 * z.xPercent * p.width, I += .01 * z.yPercent * p.height), p = 1e-6, p > H && H > -p && (H = 0), p > I && I > -p && (I = 0)), u = (b * y | 0) / y + "," + (e * y | 0) / y + "," + (c * y | 0) / y + "," + (f * y | 0) / y + "," + H + "," + I + ")", L && za ? this.t.setAttribute("transform", "matrix(" + u) : A[Ba] = (z.xPercent || z.yPercent ? "translate(" + z.xPercent + "%," + z.yPercent + "%) matrix(" : "matrix(") + u) : A[Ba] = (z.xPercent || z.yPercent ? "translate(" + z.xPercent + "%," + z.yPercent + "%) matrix(" : "matrix(") + E + ",0,0," + F + "," + H + "," + I + ")");
                        if (n && (p = 1e-4, p > E && E > -p && (E = G = 2e-5), p > F && F > -p && (F = G = 2e-5), !M || z.z || z.rotationX || z.rotationY || (M = 0)), B || z.skewX) B *= K, q = b = Math.cos(B), r = e = Math.sin(B), z.skewX && (B -= z.skewX * K, q = Math.cos(B), r = Math.sin(B), "simple" === z.skewType && (s = Math.tan((z.skewX - z.skewY) * K), s = Math.sqrt(1 + s * s), q *= s, r *= s, z.skewY && (s = Math.tan(z.skewY * K), s = Math.sqrt(1 + s * s), b *= s, e *= s))), c = -r, f = q;
                        else {
                            if (!(D || C || 1 !== G || M || L)) return void(A[Ba] = (z.xPercent || z.yPercent ? "translate(" + z.xPercent + "%," + z.yPercent + "%) translate3d(" : "translate3d(") + H + "px," + I + "px," + J + "px)" + (1 !== E || 1 !== F ? " scale(" + E + "," + F + ")" : ""));
                            b = f = 1, c = e = 0
                        }
                        j = 1, d = g = h = i = k = l = 0, m = M ? -1 / M : 0, o = z.zOrigin, p = 1e-6, v = ",", w = "0", B = D * K, B && (q = Math.cos(B), r = Math.sin(B), h = -r, k = m * -r, d = b * r, g = e * r, j = q, m *= q, b *= q, e *= q), B = C * K, B && (q = Math.cos(B), r = Math.sin(B), s = c * q + d * r, t = f * q + g * r, i = j * r, l = m * r, d = c * -r + d * q, g = f * -r + g * q, j *= q, m *= q, c = s, f = t), 1 !== G && (d *= G, g *= G, j *= G, m *= G), 1 !== F && (c *= F, f *= F, i *= F, l *= F), 1 !== E && (b *= E, e *= E, h *= E, k *= E), (o || L) && (o && (H += d * -o, I += g * -o, J += j * -o + o), L && (H += z.xOrigin - (z.xOrigin * b + z.yOrigin * c) + z.xOffset, I += z.yOrigin - (z.xOrigin * e + z.yOrigin * f) + z.yOffset), p > H && H > -p && (H = w), p > I && I > -p && (I = w), p > J && J > -p && (J = 0)), u = z.xPercent || z.yPercent ? "translate(" + z.xPercent + "%," + z.yPercent + "%) matrix3d(" : "matrix3d(", u += (p > b && b > -p ? w : b) + v + (p > e && e > -p ? w : e) + v + (p > h && h > -p ? w : h), u += v + (p > k && k > -p ? w : k) + v + (p > c && c > -p ? w : c) + v + (p > f && f > -p ? w : f), C || D || 1 !== G ? (u += v + (p > i && i > -p ? w : i) + v + (p > l && l > -p ? w : l) + v + (p > d && d > -p ? w : d), u += v + (p > g && g > -p ? w : g) + v + (p > j && j > -p ? w : j) + v + (p > m && m > -p ? w : m) + v) : u += ",0,0,0,0,1,0,", u += H + v + I + v + J + v + (M ? 1 + -J / M : 1) + ")", A[Ba] = u
                    };
                j = Fa.prototype, j.x = j.y = j.z = j.skewX = j.skewY = j.rotation = j.rotationX = j.rotationY = j.zOrigin = j.xPercent = j.yPercent = j.xOffset = j.yOffset = 0, j.scaleX = j.scaleY = j.scaleZ = 1, xa("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,svgOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent,smoothOrigin", {
                    parser: function(a, b, c, d, f, h, i) {
                        if (d._lastParsedTransform === i) return f;
                        d._lastParsedTransform = i;
                        var j;
                        "function" == typeof i[c] && (j = i[c], i[c] = b);
                        var k, l, m, n, o, p, s, t, u, v = a._gsTransform,
                            w = a.style,
                            x = 1e-6,
                            y = Aa.length,
                            z = i,
                            A = {},
                            B = "transformOrigin",
                            C = Pa(a, e, !0, z.parseTransform),
                            D = z.transform && ("function" == typeof z.transform ? z.transform(r, q) : z.transform);
                        if (d._transform = C, D && "string" == typeof D && Ba) l = P.style, l[Ba] = D, l.display = "block", l.position = "absolute", N.body.appendChild(P), k = Pa(P, null, !1), C.svg && (p = C.xOrigin, s = C.yOrigin, k.x -= C.xOffset, k.y -= C.yOffset, (z.transformOrigin || z.svgOrigin) && (D = {}, Ka(a, ga(z.transformOrigin), D, z.svgOrigin, z.smoothOrigin, !0), p = D.xOrigin, s = D.yOrigin, k.x -= D.xOffset - C.xOffset, k.y -= D.yOffset - C.yOffset), (p || s) && (t = Oa(P, !0), k.x -= p - (p * t[0] + s * t[2]), k.y -= s - (p * t[1] + s * t[3]))), N.body.removeChild(P), k.perspective || (k.perspective = C.perspective), null != z.xPercent && (k.xPercent = ia(z.xPercent, C.xPercent)), null != z.yPercent && (k.yPercent = ia(z.yPercent, C.yPercent));
                        else if ("object" == typeof z) {
                            if (k = {
                                    scaleX: ia(null != z.scaleX ? z.scaleX : z.scale, C.scaleX),
                                    scaleY: ia(null != z.scaleY ? z.scaleY : z.scale, C.scaleY),
                                    scaleZ: ia(z.scaleZ, C.scaleZ),
                                    x: ia(z.x, C.x),
                                    y: ia(z.y, C.y),
                                    z: ia(z.z, C.z),
                                    xPercent: ia(z.xPercent, C.xPercent),
                                    yPercent: ia(z.yPercent, C.yPercent),
                                    perspective: ia(z.transformPerspective, C.perspective)
                                }, o = z.directionalRotation, null != o)
                                if ("object" == typeof o)
                                    for (l in o) z[l] = o[l];
                                else z.rotation = o;
                            "string" == typeof z.x && -1 !== z.x.indexOf("%") && (k.x = 0, k.xPercent = ia(z.x, C.xPercent)), "string" == typeof z.y && -1 !== z.y.indexOf("%") && (k.y = 0, k.yPercent = ia(z.y, C.yPercent)), k.rotation = ja("rotation" in z ? z.rotation : "shortRotation" in z ? z.shortRotation + "_short" : "rotationZ" in z ? z.rotationZ : C.rotation - C.skewY, C.rotation - C.skewY, "rotation", A), Ea && (k.rotationX = ja("rotationX" in z ? z.rotationX : "shortRotationX" in z ? z.shortRotationX + "_short" : C.rotationX || 0, C.rotationX, "rotationX", A), k.rotationY = ja("rotationY" in z ? z.rotationY : "shortRotationY" in z ? z.shortRotationY + "_short" : C.rotationY || 0, C.rotationY, "rotationY", A)), k.skewX = ja(z.skewX, C.skewX - C.skewY), (k.skewY = ja(z.skewY, C.skewY)) && (k.skewX += k.skewY, k.rotation += k.skewY)
                        }
                        for (Ea && null != z.force3D && (C.force3D = z.force3D, n = !0), C.skewType = z.skewType || C.skewType || g.defaultSkewType, m = C.force3D || C.z || C.rotationX || C.rotationY || k.z || k.rotationX || k.rotationY || k.perspective, m || null == z.scale || (k.scaleZ = 1); --y > -1;) u = Aa[y], D = k[u] - C[u], (D > x || -x > D || null != z[u] || null != M[u]) && (n = !0, f = new sa(C, u, C[u], D, f), u in A && (f.e = A[u]), f.xs0 = 0, f.plugin = h, d._overwriteProps.push(f.n));
                        return D = z.transformOrigin, C.svg && (D || z.svgOrigin) && (p = C.xOffset, s = C.yOffset, Ka(a, ga(D), k, z.svgOrigin, z.smoothOrigin), f = ta(C, "xOrigin", (v ? C : k).xOrigin, k.xOrigin, f, B), f = ta(C, "yOrigin", (v ? C : k).yOrigin, k.yOrigin, f, B), (p !== C.xOffset || s !== C.yOffset) && (f = ta(C, "xOffset", v ? p : C.xOffset, C.xOffset, f, B), f = ta(C, "yOffset", v ? s : C.yOffset, C.yOffset, f, B)), D = za ? null : "0px 0px"), (D || Ea && m && C.zOrigin) && (Ba ? (n = !0, u = Da, D = (D || $(a, u, e, !1, "50% 50%")) + "", f = new sa(w, u, 0, 0, f, -1, B), f.b = w[u], f.plugin = h, Ea ? (l = C.zOrigin, D = D.split(" "), C.zOrigin = (D.length > 2 && (0 === l || "0px" !== D[2]) ? parseFloat(D[2]) : l) || 0, f.xs0 = f.e = D[0] + " " + (D[1] || "50%") + " 0px", f = new sa(C, "zOrigin", 0, 0, f, -1, f.n), f.b = l, f.xs0 = f.e = C.zOrigin) : f.xs0 = f.e = D) : ga(D + "", C)), n && (d._transformType = C.svg && za || !m && 3 !== this._transformType ? 2 : 3), j && (i[c] = j), f
                    },
                    prefix: !0
                }), xa("boxShadow", {
                    defaultValue: "0px 0px 0px 0px #999",
                    prefix: !0,
                    color: !0,
                    multi: !0,
                    keyword: "inset"
                }), xa("borderRadius", {
                    defaultValue: "0px",
                    parser: function(a, b, c, f, g, h) {
                        b = this.format(b);
                        var i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"],
                            z = a.style;
                        for (q = parseFloat(a.offsetWidth), r = parseFloat(a.offsetHeight), i = b.split(" "), j = 0; j < y.length; j++) this.p.indexOf("border") && (y[j] = Y(y[j])), m = l = $(a, y[j], e, !1, "0px"), -1 !== m.indexOf(" ") && (l = m.split(" "), m = l[0], l = l[1]), n = k = i[j], o = parseFloat(m), t = m.substr((o + "").length), u = "=" === n.charAt(1), u ? (p = parseInt(n.charAt(0) + "1", 10), n = n.substr(2), p *= parseFloat(n), s = n.substr((p + "").length - (0 > p ? 1 : 0)) || "") : (p = parseFloat(n), s = n.substr((p + "").length)), "" === s && (s = d[c] || t), s !== t && (v = _(a, "borderLeft", o, t), w = _(a, "borderTop", o, t), "%" === s ? (m = v / q * 100 + "%", l = w / r * 100 + "%") : "em" === s ? (x = _(a, "borderLeft", 1, "em"), m = v / x + "em", l = w / x + "em") : (m = v + "px", l = w + "px"), u && (n = parseFloat(m) + p + s, k = parseFloat(l) + p + s)), g = ua(z, y[j], m + " " + l, n + " " + k, !1, "0px", g);
                        return g
                    },
                    prefix: !0,
                    formatter: pa("0px 0px 0px 0px", !1, !0)
                }), xa("borderBottomLeftRadius,borderBottomRightRadius,borderTopLeftRadius,borderTopRightRadius", {
                    defaultValue: "0px",
                    parser: function(a, b, c, d, f, g) {
                        return ua(a.style, c, this.format($(a, c, e, !1, "0px 0px")), this.format(b), !1, "0px", f)
                    },
                    prefix: !0,
                    formatter: pa("0px 0px", !1, !0)
                }), xa("backgroundPosition", {
                    defaultValue: "0 0",
                    parser: function(a, b, c, d, f, g) {
                        var h, i, j, k, l, m, n = "background-position",
                            o = e || Z(a, null),
                            q = this.format((o ? p ? o.getPropertyValue(n + "-x") + " " + o.getPropertyValue(n + "-y") : o.getPropertyValue(n) : a.currentStyle.backgroundPositionX + " " + a.currentStyle.backgroundPositionY) || "0 0"),
                            r = this.format(b);
                        if (-1 !== q.indexOf("%") != (-1 !== r.indexOf("%")) && r.split(",").length < 2 && (m = $(a, "backgroundImage").replace(D, ""), m && "none" !== m)) {
                            for (h = q.split(" "), i = r.split(" "), Q.setAttribute("src", m), j = 2; --j > -1;) q = h[j], k = -1 !== q.indexOf("%"), k !== (-1 !== i[j].indexOf("%")) && (l = 0 === j ? a.offsetWidth - Q.width : a.offsetHeight - Q.height, h[j] = k ? parseFloat(q) / 100 * l + "px" : parseFloat(q) / l * 100 + "%");
                            q = h.join(" ")
                        }
                        return this.parseComplex(a.style, q, r, f, g)
                    },
                    formatter: ga
                }), xa("backgroundSize", {
                    defaultValue: "0 0",
                    formatter: function(a) {
                        return a += "", ga(-1 === a.indexOf(" ") ? a + " " + a : a)
                    }
                }), xa("perspective", {
                    defaultValue: "0px",
                    prefix: !0
                }), xa("perspectiveOrigin", {
                    defaultValue: "50% 50%",
                    prefix: !0
                }), xa("transformStyle", {
                    prefix: !0
                }), xa("backfaceVisibility", {
                    prefix: !0
                }), xa("userSelect", {
                    prefix: !0
                }), xa("margin", {
                    parser: qa("marginTop,marginRight,marginBottom,marginLeft")
                }), xa("padding", {
                    parser: qa("paddingTop,paddingRight,paddingBottom,paddingLeft")
                }), xa("clip", {
                    defaultValue: "rect(0px,0px,0px,0px)",
                    parser: function(a, b, c, d, f, g) {
                        var h, i, j;
                        return 9 > p ? (i = a.currentStyle, j = 8 > p ? " " : ",", h = "rect(" + i.clipTop + j + i.clipRight + j + i.clipBottom + j + i.clipLeft + ")", b = this.format(b).split(",").join(j)) : (h = this.format($(a, this.p, e, !1, this.dflt)), b = this.format(b)), this.parseComplex(a.style, h, b, f, g)
                    }
                }), xa("textShadow", {
                    defaultValue: "0px 0px 0px #999",
                    color: !0,
                    multi: !0
                }), xa("autoRound,strictUnits", {
                    parser: function(a, b, c, d, e) {
                        return e
                    }
                }), xa("border", {
                    defaultValue: "0px solid #000",
                    parser: function(a, b, c, d, f, g) {
                        var h = $(a, "borderTopWidth", e, !1, "0px"),
                            i = this.format(b).split(" "),
                            j = i[0].replace(w, "");
                        return "px" !== j && (h = parseFloat(h) / _(a, "borderTopWidth", 1, j) + j), this.parseComplex(a.style, this.format(h + " " + $(a, "borderTopStyle", e, !1, "solid") + " " + $(a, "borderTopColor", e, !1, "#000")), i.join(" "), f, g)
                    },
                    color: !0,
                    formatter: function(a) {
                        var b = a.split(" ");
                        return b[0] + " " + (b[1] || "solid") + " " + (a.match(oa) || ["#000"])[0]
                    }
                }), xa("borderWidth", {
                    parser: qa("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")
                }), xa("float,cssFloat,styleFloat", {
                    parser: function(a, b, c, d, e, f) {
                        var g = a.style,
                            h = "cssFloat" in g ? "cssFloat" : "styleFloat";
                        return new sa(g, h, 0, 0, e, -1, c, !1, 0, g[h], b)
                    }
                });
                var Sa = function(a) {
                    var b, c = this.t,
                        d = c.filter || $(this.data, "filter") || "",
                        e = this.s + this.c * a | 0;
                    100 === e && (-1 === d.indexOf("atrix(") && -1 === d.indexOf("radient(") && -1 === d.indexOf("oader(") ? (c.removeAttribute("filter"), b = !$(this.data, "filter")) : (c.filter = d.replace(z, ""), b = !0)), b || (this.xn1 && (c.filter = d = d || "alpha(opacity=" + e + ")"), -1 === d.indexOf("pacity") ? 0 === e && this.xn1 || (c.filter = d + " alpha(opacity=" + e + ")") : c.filter = d.replace(x, "opacity=" + e))
                };
                xa("opacity,alpha,autoAlpha", {
                    defaultValue: "1",
                    parser: function(a, b, c, d, f, g) {
                        var h = parseFloat($(a, "opacity", e, !1, "1")),
                            i = a.style,
                            j = "autoAlpha" === c;
                        return "string" == typeof b && "=" === b.charAt(1) && (b = ("-" === b.charAt(0) ? -1 : 1) * parseFloat(b.substr(2)) + h), j && 1 === h && "hidden" === $(a, "visibility", e) && 0 !== b && (h = 0), T ? f = new sa(i, "opacity", h, b - h, f) : (f = new sa(i, "opacity", 100 * h, 100 * (b - h), f), f.xn1 = j ? 1 : 0, i.zoom = 1, f.type = 2, f.b = "alpha(opacity=" + f.s + ")", f.e = "alpha(opacity=" + (f.s + f.c) + ")", f.data = a, f.plugin = g, f.setRatio = Sa), j && (f = new sa(i, "visibility", 0, 0, f, -1, null, !1, 0, 0 !== h ? "inherit" : "hidden", 0 === b ? "hidden" : "inherit"), f.xs0 = "inherit", d._overwriteProps.push(f.n), d._overwriteProps.push(c)), f
                    }
                });
                var Ta = function(a, b) {
                        b && (a.removeProperty ? (("ms" === b.substr(0, 2) || "webkit" === b.substr(0, 6)) && (b = "-" + b), a.removeProperty(b.replace(B, "-$1").toLowerCase())) : a.removeAttribute(b))
                    },
                    Ua = function(a) {
                        if (this.t._gsClassPT = this, 1 === a || 0 === a) {
                            this.t.setAttribute("class", 0 === a ? this.b : this.e);
                            for (var b = this.data, c = this.t.style; b;) b.v ? c[b.p] = b.v : Ta(c, b.p), b = b._next;
                            1 === a && this.t._gsClassPT === this && (this.t._gsClassPT = null)
                        } else this.t.getAttribute("class") !== this.e && this.t.setAttribute("class", this.e)
                    };
                xa("className", {
                    parser: function(a, b, d, f, g, h, i) {
                        var j, k, l, m, n, o = a.getAttribute("class") || "",
                            p = a.style.cssText;
                        if (g = f._classNamePT = new sa(a, d, 0, 0, g, 2), g.setRatio = Ua, g.pr = -11, c = !0, g.b = o, k = ba(a, e), l = a._gsClassPT) {
                            for (m = {}, n = l.data; n;) m[n.p] = 1, n = n._next;
                            l.setRatio(1)
                        }
                        return a._gsClassPT = g, g.e = "=" !== b.charAt(1) ? b : o.replace(new RegExp("(?:\\s|^)" + b.substr(2) + "(?![\\w-])"), "") + ("+" === b.charAt(0) ? " " + b.substr(2) : ""), a.setAttribute("class", g.e), j = ca(a, k, ba(a), i, m), a.setAttribute("class", o), g.data = j.firstMPT, a.style.cssText = p, g = g.xfirst = f.parse(a, j.difs, g, h)
                    }
                });
                var Va = function(a) {
                    if ((1 === a || 0 === a) && this.data._totalTime === this.data._totalDuration && "isFromStart" !== this.data.data) {
                        var b, c, d, e, f, g = this.t.style,
                            h = i.transform.parse;
                        if ("all" === this.e) g.cssText = "", e = !0;
                        else
                            for (b = this.e.split(" ").join("").split(","), d = b.length; --d > -1;) c = b[d], i[c] && (i[c].parse === h ? e = !0 : c = "transformOrigin" === c ? Da : i[c].p), Ta(g, c);
                        e && (Ta(g, Ba), f = this.t._gsTransform, f && (f.svg && (this.t.removeAttribute("data-svg-origin"), this.t.removeAttribute("transform")), delete this.t._gsTransform))
                    }
                };
                for (xa("clearProps", {
                        parser: function(a, b, d, e, f) {
                            return f = new sa(a, d, 0, 0, f, 2), f.setRatio = Va, f.e = b, f.pr = -10, f.data = e._tween, c = !0, f
                        }
                    }), j = "bezier,throwProps,physicsProps,physics2D".split(","), va = j.length; va--;) ya(j[va]);
                j = g.prototype, j._firstPT = j._lastParsedTransform = j._transform = null, j._onInitTween = function(a, b, h, j) {
                    if (!a.nodeType) return !1;
                    this._target = q = a, this._tween = h, this._vars = b, r = j, k = b.autoRound, c = !1, d = b.suffixMap || g.suffixMap, e = Z(a, ""), f = this._overwriteProps;
                    var n, p, s, t, u, v, w, x, z, A = a.style;
                    if (l && "" === A.zIndex && (n = $(a, "zIndex", e), ("auto" === n || "" === n) && this._addLazySet(A, "zIndex", 0)), "string" == typeof b && (t = A.cssText, n = ba(a, e), A.cssText = t + ";" + b, n = ca(a, n, ba(a)).difs, !T && y.test(b) && (n.opacity = parseFloat(RegExp.$1)), b = n, A.cssText = t), b.className ? this._firstPT = p = i.className.parse(a, b.className, "className", this, null, null, b) : this._firstPT = p = this.parse(a, b, null), this._transformType) {
                        for (z = 3 === this._transformType, Ba ? m && (l = !0, "" === A.zIndex && (w = $(a, "zIndex", e), ("auto" === w || "" === w) && this._addLazySet(A, "zIndex", 0)), o && this._addLazySet(A, "WebkitBackfaceVisibility", this._vars.WebkitBackfaceVisibility || (z ? "visible" : "hidden"))) : A.zoom = 1, s = p; s && s._next;) s = s._next;
                        x = new sa(a, "transform", 0, 0, null, 2), this._linkCSSP(x, null, s), x.setRatio = Ba ? Ra : Qa, x.data = this._transform || Pa(a, e, !0), x.tween = h, x.pr = -1, f.pop()
                    }
                    if (c) {
                        for (; p;) {
                            for (v = p._next, s = t; s && s.pr > p.pr;) s = s._next;
                            (p._prev = s ? s._prev : u) ? p._prev._next = p: t = p, (p._next = s) ? s._prev = p : u = p, p = v
                        }
                        this._firstPT = t
                    }
                    return !0
                }, j.parse = function(a, b, c, f) {
                    var g, h, j, l, m, n, o, p, s, t, u = a.style;
                    for (g in b) n = b[g], "function" == typeof n && (n = n(r, q)), h = i[g], h ? c = h.parse(a, n, g, this, c, f, b) : (m = $(a, g, e) + "", s = "string" == typeof n, "color" === g || "fill" === g || "stroke" === g || -1 !== g.indexOf("Color") || s && A.test(n) ? (s || (n = ma(n), n = (n.length > 3 ? "rgba(" : "rgb(") + n.join(",") + ")"), c = ua(u, g, m, n, !0, "transparent", c, 0, f)) : s && J.test(n) ? c = ua(u, g, m, n, !0, null, c, 0, f) : (j = parseFloat(m), o = j || 0 === j ? m.substr((j + "").length) : "", ("" === m || "auto" === m) && ("width" === g || "height" === g ? (j = fa(a, g, e), o = "px") : "left" === g || "top" === g ? (j = aa(a, g, e), o = "px") : (j = "opacity" !== g ? 0 : 1, o = "")), t = s && "=" === n.charAt(1), t ? (l = parseInt(n.charAt(0) + "1", 10), n = n.substr(2), l *= parseFloat(n), p = n.replace(w, "")) : (l = parseFloat(n), p = s ? n.replace(w, "") : ""), "" === p && (p = g in d ? d[g] : o), n = l || 0 === l ? (t ? l + j : l) + p : b[g], o !== p && "" !== p && (l || 0 === l) && j && (j = _(a, g, j, o), "%" === p ? (j /= _(a, g, 100, "%") / 100, b.strictUnits !== !0 && (m = j + "%")) : "em" === p || "rem" === p || "vw" === p || "vh" === p ? j /= _(a, g, 1, p) : "px" !== p && (l = _(a, g, l, p), p = "px"), t && (l || 0 === l) && (n = l + j + p)), t && (l += j), !j && 0 !== j || !l && 0 !== l ? void 0 !== u[g] && (n || n + "" != "NaN" && null != n) ? (c = new sa(u, g, l || j || 0, 0, c, -1, g, !1, 0, m, n), c.xs0 = "none" !== n || "display" !== g && -1 === g.indexOf("Style") ? n : m) : V("invalid " + g + " tween value: " + b[g]) : (c = new sa(u, g, j, l - j, c, 0, g, k !== !1 && ("px" === p || "zIndex" === g), 0, m, n), c.xs0 = p))), f && c && !c.plugin && (c.plugin = f);
                    return c
                }, j.setRatio = function(a) {
                    var b, c, d, e = this._firstPT,
                        f = 1e-6;
                    if (1 !== a || this._tween._time !== this._tween._duration && 0 !== this._tween._time)
                        if (a || this._tween._time !== this._tween._duration && 0 !== this._tween._time || this._tween._rawPrevTime === -1e-6)
                            for (; e;) {
                                if (b = e.c * a + e.s, e.r ? b = Math.round(b) : f > b && b > -f && (b = 0), e.type)
                                    if (1 === e.type)
                                        if (d = e.l, 2 === d) e.t[e.p] = e.xs0 + b + e.xs1 + e.xn1 + e.xs2;
                                        else if (3 === d) e.t[e.p] = e.xs0 + b + e.xs1 + e.xn1 + e.xs2 + e.xn2 + e.xs3;
                                else if (4 === d) e.t[e.p] = e.xs0 + b + e.xs1 + e.xn1 + e.xs2 + e.xn2 + e.xs3 + e.xn3 + e.xs4;
                                else if (5 === d) e.t[e.p] = e.xs0 + b + e.xs1 + e.xn1 + e.xs2 + e.xn2 + e.xs3 + e.xn3 + e.xs4 + e.xn4 + e.xs5;
                                else {
                                    for (c = e.xs0 + b + e.xs1, d = 1; d < e.l; d++) c += e["xn" + d] + e["xs" + (d + 1)];
                                    e.t[e.p] = c
                                } else -1 === e.type ? e.t[e.p] = e.xs0 : e.setRatio && e.setRatio(a);
                                else e.t[e.p] = b + e.xs0;
                                e = e._next
                            } else
                                for (; e;) 2 !== e.type ? e.t[e.p] = e.b : e.setRatio(a), e = e._next;
                        else
                            for (; e;) {
                                if (2 !== e.type)
                                    if (e.r && -1 !== e.type)
                                        if (b = Math.round(e.s + e.c), e.type) {
                                            if (1 === e.type) {
                                                for (d = e.l, c = e.xs0 + b + e.xs1, d = 1; d < e.l; d++) c += e["xn" + d] + e["xs" + (d + 1)];
                                                e.t[e.p] = c
                                            }
                                        } else e.t[e.p] = b + e.xs0;
                                else e.t[e.p] = e.e;
                                else e.setRatio(a);
                                e = e._next
                            }
                }, j._enableTransforms = function(a) {
                    this._transform = this._transform || Pa(this._target, e, !0), this._transformType = this._transform.svg && za || !a && 3 !== this._transformType ? 2 : 3
                };
                var Wa = function(a) {
                    this.t[this.p] = this.e, this.data._linkCSSP(this, this._next, null, !0)
                };
                j._addLazySet = function(a, b, c) {
                    var d = this._firstPT = new sa(a, b, 0, 0, this._firstPT, 2);
                    d.e = c, d.setRatio = Wa, d.data = this
                }, j._linkCSSP = function(a, b, c, d) {
                    return a && (b && (b._prev = a), a._next && (a._next._prev = a._prev), a._prev ? a._prev._next = a._next : this._firstPT === a && (this._firstPT = a._next, d = !0), c ? c._next = a : d || null !== this._firstPT || (this._firstPT = a), a._next = b, a._prev = c), a
                }, j._mod = function(a) {
                    for (var b = this._firstPT; b;) "function" == typeof a[b.p] && a[b.p] === Math.round && (b.r = 1), b = b._next
                }, j._kill = function(b) {
                    var c, d, e, f = b;
                    if (b.autoAlpha || b.alpha) {
                        f = {};
                        for (d in b) f[d] = b[d];
                        f.opacity = 1, f.autoAlpha && (f.visibility = 1)
                    }
                    for (b.className && (c = this._classNamePT) && (e = c.xfirst, e && e._prev ? this._linkCSSP(e._prev, c._next, e._prev._prev) : e === this._firstPT && (this._firstPT = c._next), c._next && this._linkCSSP(c._next, c._next._next, e._prev), this._classNamePT = null), c = this._firstPT; c;) c.plugin && c.plugin !== d && c.plugin._kill && (c.plugin._kill(b), d = c.plugin), c = c._next;
                    return a.prototype._kill.call(this, f)
                };
                var Xa = function(a, b, c) {
                    var d, e, f, g;
                    if (a.slice)
                        for (e = a.length; --e > -1;) Xa(a[e], b, c);
                    else
                        for (d = a.childNodes, e = d.length; --e > -1;) f = d[e], g = f.type, f.style && (b.push(ba(f)), c && c.push(f)), 1 !== g && 9 !== g && 11 !== g || !f.childNodes.length || Xa(f, b, c)
                };
                return g.cascadeTo = function(a, c, d) {
                    var e, f, g, h, i = b.to(a, c, d),
                        j = [i],
                        k = [],
                        l = [],
                        m = [],
                        n = b._internals.reservedProps;
                    for (a = i._targets || i.target, Xa(a, k, m), i.render(c, !0, !0), Xa(a, l), i.render(0, !0, !0), i._enabled(!0), e = m.length; --e > -1;)
                        if (f = ca(m[e], k[e], l[e]), f.firstMPT) {
                            f = f.difs;
                            for (g in d) n[g] && (f[g] = d[g]);
                            h = {};
                            for (g in f) h[g] = k[e][g];
                            j.push(b.fromTo(m[e], c, h, f))
                        } return j
                }, a.activate([g]), g
            }, !0),
            function() {
                var a = _gsScope._gsDefine.plugin({
                        propName: "roundProps",
                        version: "1.6.0",
                        priority: -1,
                        API: 2,
                        init: function(a, b, c) {
                            return this._tween = c, !0
                        }
                    }),
                    b = function(a) {
                        for (; a;) a.f || a.blob || (a.m = Math.round), a = a._next
                    },
                    c = a.prototype;
                c._onInitAllProps = function() {
                    for (var a, c, d, e = this._tween, f = e.vars.roundProps.join ? e.vars.roundProps : e.vars.roundProps.split(","), g = f.length, h = {}, i = e._propLookup.roundProps; --g > -1;) h[f[g]] = Math.round;
                    for (g = f.length; --g > -1;)
                        for (a = f[g], c = e._firstPT; c;) d = c._next, c.pg ? c.t._mod(h) : c.n === a && (2 === c.f && c.t ? b(c.t._firstPT) : (this._add(c.t, a, c.s, c.c), d && (d._prev = c._prev), c._prev ? c._prev._next = d : e._firstPT === c && (e._firstPT = d), c._next = c._prev = null, e._propLookup[a] = i)), c = d;
                    return !1
                }, c._add = function(a, b, c, d) {
                    this._addTween(a, b, c, c + d, b, Math.round), this._overwriteProps.push(b)
                }
            }(),
            function() {
                _gsScope._gsDefine.plugin({
                    propName: "attr",
                    API: 2,
                    version: "0.6.0",
                    init: function(a, b, c, d) {
                        var e, f;
                        if ("function" != typeof a.setAttribute) return !1;
                        for (e in b) f = b[e], "function" == typeof f && (f = f(d, a)), this._addTween(a, "setAttribute", a.getAttribute(e) + "", f + "", e, !1, e), this._overwriteProps.push(e);
                        return !0
                    }
                })
            }(), _gsScope._gsDefine.plugin({
                propName: "directionalRotation",
                version: "0.3.0",
                API: 2,
                init: function(a, b, c, d) {
                    "object" != typeof b && (b = {
                        rotation: b
                    }), this.finals = {};
                    var e, f, g, h, i, j, k = b.useRadians === !0 ? 2 * Math.PI : 360,
                        l = 1e-6;
                    for (e in b) "useRadians" !== e && (h = b[e], "function" == typeof h && (h = h(d, a)), j = (h + "").split("_"), f = j[0], g = parseFloat("function" != typeof a[e] ? a[e] : a[e.indexOf("set") || "function" != typeof a["get" + e.substr(3)] ? e : "get" + e.substr(3)]()), h = this.finals[e] = "string" == typeof f && "=" === f.charAt(1) ? g + parseInt(f.charAt(0) + "1", 10) * Number(f.substr(2)) : Number(f) || 0, i = h - g, j.length && (f = j.join("_"), -1 !== f.indexOf("short") && (i %= k, i !== i % (k / 2) && (i = 0 > i ? i + k : i - k)), -1 !== f.indexOf("_cw") && 0 > i ? i = (i + 9999999999 * k) % k - (i / k | 0) * k : -1 !== f.indexOf("ccw") && i > 0 && (i = (i - 9999999999 * k) % k - (i / k | 0) * k)), (i > l || -l > i) && (this._addTween(a, e, g, g + i, e), this._overwriteProps.push(e)));
                    return !0
                },
                set: function(a) {
                    var b;
                    if (1 !== a) this._super.setRatio.call(this, a);
                    else
                        for (b = this._firstPT; b;) b.f ? b.t[b.p](this.finals[b.p]) : b.t[b.p] = this.finals[b.p], b = b._next
                }
            })._autoCSS = !0, _gsScope._gsDefine("easing.Back", ["easing.Ease"], function(a) {
                var b, c, d, e = _gsScope.GreenSockGlobals || _gsScope,
                    f = e.com.greensock,
                    g = 2 * Math.PI,
                    h = Math.PI / 2,
                    i = f._class,
                    j = function(b, c) {
                        var d = i("easing." + b, function() {}, !0),
                            e = d.prototype = new a;
                        return e.constructor = d, e.getRatio = c, d
                    },
                    k = a.register || function() {},
                    l = function(a, b, c, d, e) {
                        var f = i("easing." + a, {
                            easeOut: new b,
                            easeIn: new c,
                            easeInOut: new d
                        }, !0);
                        return k(f, a), f
                    },
                    m = function(a, b, c) {
                        this.t = a, this.v = b, c && (this.next = c, c.prev = this, this.c = c.v - b, this.gap = c.t - a)
                    },
                    n = function(b, c) {
                        var d = i("easing." + b, function(a) {
                                this._p1 = a || 0 === a ? a : 1.70158, this._p2 = 1.525 * this._p1
                            }, !0),
                            e = d.prototype = new a;
                        return e.constructor = d, e.getRatio = c, e.config = function(a) {
                            return new d(a)
                        }, d
                    },
                    o = l("Back", n("BackOut", function(a) {
                        return (a -= 1) * a * ((this._p1 + 1) * a + this._p1) + 1
                    }), n("BackIn", function(a) {
                        return a * a * ((this._p1 + 1) * a - this._p1)
                    }), n("BackInOut", function(a) {
                        return (a *= 2) < 1 ? .5 * a * a * ((this._p2 + 1) * a - this._p2) : .5 * ((a -= 2) * a * ((this._p2 + 1) * a + this._p2) + 2)
                    })),
                    p = i("easing.SlowMo", function(a, b, c) {
                        b = b || 0 === b ? b : .7, null == a ? a = .7 : a > 1 && (a = 1), this._p = 1 !== a ? b : 0, this._p1 = (1 - a) / 2, this._p2 = a, this._p3 = this._p1 + this._p2, this._calcEnd = c === !0
                    }, !0),
                    q = p.prototype = new a;
                return q.constructor = p, q.getRatio = function(a) {
                    var b = a + (.5 - a) * this._p;
                    return a < this._p1 ? this._calcEnd ? 1 - (a = 1 - a / this._p1) * a : b - (a = 1 - a / this._p1) * a * a * a * b : a > this._p3 ? this._calcEnd ? 1 - (a = (a - this._p3) / this._p1) * a : b + (a - b) * (a = (a - this._p3) / this._p1) * a * a * a : this._calcEnd ? 1 : b
                }, p.ease = new p(.7, .7), q.config = p.config = function(a, b, c) {
                    return new p(a, b, c)
                }, b = i("easing.SteppedEase", function(a) {
                    a = a || 1, this._p1 = 1 / a, this._p2 = a + 1
                }, !0), q = b.prototype = new a, q.constructor = b, q.getRatio = function(a) {
                    return 0 > a ? a = 0 : a >= 1 && (a = .999999999), (this._p2 * a >> 0) * this._p1
                }, q.config = b.config = function(a) {
                    return new b(a)
                }, c = i("easing.RoughEase", function(b) {
                    b = b || {};
                    for (var c, d, e, f, g, h, i = b.taper || "none", j = [], k = 0, l = 0 | (b.points || 20), n = l, o = b.randomize !== !1, p = b.clamp === !0, q = b.template instanceof a ? b.template : null, r = "number" == typeof b.strength ? .4 * b.strength : .4; --n > -1;) c = o ? Math.random() : 1 / l * n, d = q ? q.getRatio(c) : c, "none" === i ? e = r : "out" === i ? (f = 1 - c, e = f * f * r) : "in" === i ? e = c * c * r : .5 > c ? (f = 2 * c, e = f * f * .5 * r) : (f = 2 * (1 - c), e = f * f * .5 * r), o ? d += Math.random() * e - .5 * e : n % 2 ? d += .5 * e : d -= .5 * e, p && (d > 1 ? d = 1 : 0 > d && (d = 0)), j[k++] = {
                        x: c,
                        y: d
                    };
                    for (j.sort(function(a, b) {
                            return a.x - b.x
                        }), h = new m(1, 1, null), n = l; --n > -1;) g = j[n], h = new m(g.x, g.y, h);
                    this._prev = new m(0, 0, 0 !== h.t ? h : h.next)
                }, !0), q = c.prototype = new a, q.constructor = c, q.getRatio = function(a) {
                    var b = this._prev;
                    if (a > b.t) {
                        for (; b.next && a >= b.t;) b = b.next;
                        b = b.prev
                    } else
                        for (; b.prev && a <= b.t;) b = b.prev;
                    return this._prev = b, b.v + (a - b.t) / b.gap * b.c
                }, q.config = function(a) {
                    return new c(a)
                }, c.ease = new c, l("Bounce", j("BounceOut", function(a) {
                    return 1 / 2.75 > a ? 7.5625 * a * a : 2 / 2.75 > a ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : 2.5 / 2.75 > a ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375
                }), j("BounceIn", function(a) {
                    return (a = 1 - a) < 1 / 2.75 ? 1 - 7.5625 * a * a : 2 / 2.75 > a ? 1 - (7.5625 * (a -= 1.5 / 2.75) * a + .75) : 2.5 / 2.75 > a ? 1 - (7.5625 * (a -= 2.25 / 2.75) * a + .9375) : 1 - (7.5625 * (a -= 2.625 / 2.75) * a + .984375)
                }), j("BounceInOut", function(a) {
                    var b = .5 > a;
                    return a = b ? 1 - 2 * a : 2 * a - 1, a = 1 / 2.75 > a ? 7.5625 * a * a : 2 / 2.75 > a ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : 2.5 / 2.75 > a ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375, b ? .5 * (1 - a) : .5 * a + .5
                })), l("Circ", j("CircOut", function(a) {
                    return Math.sqrt(1 - (a -= 1) * a)
                }), j("CircIn", function(a) {
                    return -(Math.sqrt(1 - a * a) - 1)
                }), j("CircInOut", function(a) {
                    return (a *= 2) < 1 ? -.5 * (Math.sqrt(1 - a * a) - 1) : .5 * (Math.sqrt(1 - (a -= 2) * a) + 1)
                })), d = function(b, c, d) {
                    var e = i("easing." + b, function(a, b) {
                            this._p1 = a >= 1 ? a : 1, this._p2 = (b || d) / (1 > a ? a : 1), this._p3 = this._p2 / g * (Math.asin(1 / this._p1) || 0), this._p2 = g / this._p2
                        }, !0),
                        f = e.prototype = new a;
                    return f.constructor = e, f.getRatio = c, f.config = function(a, b) {
                        return new e(a, b)
                    }, e
                }, l("Elastic", d("ElasticOut", function(a) {
                    return this._p1 * Math.pow(2, -10 * a) * Math.sin((a - this._p3) * this._p2) + 1
                }, .3), d("ElasticIn", function(a) {
                    return -(this._p1 * Math.pow(2, 10 * (a -= 1)) * Math.sin((a - this._p3) * this._p2))
                }, .3), d("ElasticInOut", function(a) {
                    return (a *= 2) < 1 ? -.5 * (this._p1 * Math.pow(2, 10 * (a -= 1)) * Math.sin((a - this._p3) * this._p2)) : this._p1 * Math.pow(2, -10 * (a -= 1)) * Math.sin((a - this._p3) * this._p2) * .5 + 1
                }, .45)), l("Expo", j("ExpoOut", function(a) {
                    return 1 - Math.pow(2, -10 * a)
                }), j("ExpoIn", function(a) {
                    return Math.pow(2, 10 * (a - 1)) - .001
                }), j("ExpoInOut", function(a) {
                    return (a *= 2) < 1 ? .5 * Math.pow(2, 10 * (a - 1)) : .5 * (2 - Math.pow(2, -10 * (a - 1)))
                })), l("Sine", j("SineOut", function(a) {
                    return Math.sin(a * h)
                }), j("SineIn", function(a) {
                    return -Math.cos(a * h) + 1
                }), j("SineInOut", function(a) {
                    return -.5 * (Math.cos(Math.PI * a) - 1)
                })), i("easing.EaseLookup", {
                    find: function(b) {
                        return a.map[b]
                    }
                }, !0), k(e.SlowMo, "SlowMo", "ease,"), k(c, "RoughEase", "ease,"), k(b, "SteppedEase", "ease,"), o
            }, !0)
    }), _gsScope._gsDefine && _gsScope._gsQueue.pop()(),
    function(a, b) {
        "use strict";
        var c = {},
            d = a.GreenSockGlobals = a.GreenSockGlobals || a;
        if (!d.TweenLite) {
            var e, f, g, h, i, j = function(a) {
                    var b, c = a.split("."),
                        e = d;
                    for (b = 0; b < c.length; b++) e[c[b]] = e = e[c[b]] || {};
                    return e
                },
                k = j("com.greensock"),
                l = 1e-10,
                m = function(a) {
                    var b, c = [],
                        d = a.length;
                    for (b = 0; b !== d; c.push(a[b++]));
                    return c
                },
                n = function() {},
                o = function() {
                    var a = Object.prototype.toString,
                        b = a.call([]);
                    return function(c) {
                        return null != c && (c instanceof Array || "object" == typeof c && !!c.push && a.call(c) === b)
                    }
                }(),
                p = {},
                q = function(e, f, g, h) {
                    this.sc = p[e] ? p[e].sc : [], p[e] = this, this.gsClass = null, this.func = g;
                    var i = [];
                    this.check = function(k) {
                        for (var l, m, n, o, r, s = f.length, t = s; --s > -1;)(l = p[f[s]] || new q(f[s], [])).gsClass ? (i[s] = l.gsClass, t--) : k && l.sc.push(this);
                        if (0 === t && g) {
                            if (m = ("com.greensock." + e).split("."), n = m.pop(), o = j(m.join("."))[n] = this.gsClass = g.apply(g, i), h)
                                if (d[n] = c[n] = o, r = "undefined" != typeof module && module.exports, !r && "function" == typeof define && define.amd) define((a.GreenSockAMDPath ? a.GreenSockAMDPath + "/" : "") + e.split(".").pop(), [], function() {
                                    return o
                                });
                                else if (r)
                                if (e === b) {
                                    module.exports = c[b] = o;
                                    for (s in c) o[s] = c[s]
                                } else c[b] && (c[b][n] = o);
                            for (s = 0; s < this.sc.length; s++) this.sc[s].check()
                        }
                    }, this.check(!0)
                },
                r = a._gsDefine = function(a, b, c, d) {
                    return new q(a, b, c, d)
                },
                s = k._class = function(a, b, c) {
                    return b = b || function() {}, r(a, [], function() {
                        return b
                    }, c), b
                };
            r.globals = d;
            var t = [0, 0, 1, 1],
                u = s("easing.Ease", function(a, b, c, d) {
                    this._func = a, this._type = c || 0, this._power = d || 0, this._params = b ? t.concat(b) : t
                }, !0),
                v = u.map = {},
                w = u.register = function(a, b, c, d) {
                    for (var e, f, g, h, i = b.split(","), j = i.length, l = (c || "easeIn,easeOut,easeInOut").split(","); --j > -1;)
                        for (f = i[j], e = d ? s("easing." + f, null, !0) : k.easing[f] || {}, g = l.length; --g > -1;) h = l[g], v[f + "." + h] = v[h + f] = e[h] = a.getRatio ? a : a[h] || new a
                };
            for (g = u.prototype, g._calcEnd = !1, g.getRatio = function(a) {
                    if (this._func) return this._params[0] = a, this._func.apply(null, this._params);
                    var b = this._type,
                        c = this._power,
                        d = 1 === b ? 1 - a : 2 === b ? a : .5 > a ? 2 * a : 2 * (1 - a);
                    return 1 === c ? d *= d : 2 === c ? d *= d * d : 3 === c ? d *= d * d * d : 4 === c && (d *= d * d * d * d), 1 === b ? 1 - d : 2 === b ? d : .5 > a ? d / 2 : 1 - d / 2
                }, e = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"], f = e.length; --f > -1;) g = e[f] + ",Power" + f, w(new u(null, null, 1, f), g, "easeOut", !0), w(new u(null, null, 2, f), g, "easeIn" + (0 === f ? ",easeNone" : "")), w(new u(null, null, 3, f), g, "easeInOut");
            v.linear = k.easing.Linear.easeIn, v.swing = k.easing.Quad.easeInOut;
            var x = s("events.EventDispatcher", function(a) {
                this._listeners = {}, this._eventTarget = a || this
            });
            g = x.prototype, g.addEventListener = function(a, b, c, d, e) {
                e = e || 0;
                var f, g, j = this._listeners[a],
                    k = 0;
                for (this !== h || i || h.wake(), null == j && (this._listeners[a] = j = []), g = j.length; --g > -1;) f = j[g], f.c === b && f.s === c ? j.splice(g, 1) : 0 === k && f.pr < e && (k = g + 1);
                j.splice(k, 0, {
                    c: b,
                    s: c,
                    up: d,
                    pr: e
                })
            }, g.removeEventListener = function(a, b) {
                var c, d = this._listeners[a];
                if (d)
                    for (c = d.length; --c > -1;)
                        if (d[c].c === b) return void d.splice(c, 1)
            }, g.dispatchEvent = function(a) {
                var b, c, d, e = this._listeners[a];
                if (e)
                    for (b = e.length, b > 1 && (e = e.slice(0)), c = this._eventTarget; --b > -1;) d = e[b], d && (d.up ? d.c.call(d.s || c, {
                        type: a,
                        target: c
                    }) : d.c.call(d.s || c))
            };
            var y = a.requestAnimationFrame,
                z = a.cancelAnimationFrame,
                A = Date.now || function() {
                    return (new Date).getTime()
                },
                B = A();
            for (e = ["ms", "moz", "webkit", "o"], f = e.length; --f > -1 && !y;) y = a[e[f] + "RequestAnimationFrame"], z = a[e[f] + "CancelAnimationFrame"] || a[e[f] + "CancelRequestAnimationFrame"];
            s("Ticker", function(a, b) {
                var c, d, e, f, g, j = this,
                    k = A(),
                    m = b !== !1 && y ? "auto" : !1,
                    o = 500,
                    p = 33,
                    q = "tick",
                    r = function(a) {
                        var b, h, i = A() - B;
                        i > o && (k += i - p), B += i, j.time = (B - k) / 1e3, b = j.time - g, (!c || b > 0 || a === !0) && (j.frame++, g += b + (b >= f ? .004 : f - b), h = !0), a !== !0 && (e = d(r)), h && j.dispatchEvent(q)
                    };
                x.call(j), j.time = j.frame = 0, j.tick = function() {
                    r(!0)
                }, j.lagSmoothing = function(a, b) {
                    o = a || 1 / l, p = Math.min(b, o, 0)
                }, j.sleep = function() {
                    null != e && (m && z ? z(e) : clearTimeout(e), d = n, e = null, j === h && (i = !1))
                }, j.wake = function(a) {
                    null !== e ? j.sleep() : a ? k += -B + (B = A()) : j.frame > 10 && (B = A() - o + 5), d = 0 === c ? n : m && y ? y : function(a) {
                        return setTimeout(a, 1e3 * (g - j.time) + 1 | 0)
                    }, j === h && (i = !0), r(2)
                }, j.fps = function(a) {
                    return arguments.length ? (c = a, f = 1 / (c || 60), g = this.time + f, void j.wake()) : c
                }, j.useRAF = function(a) {
                    return arguments.length ? (j.sleep(), m = a, void j.fps(c)) : m
                }, j.fps(a), setTimeout(function() {
                    "auto" === m && j.frame < 5 && "hidden" !== document.visibilityState && j.useRAF(!1)
                }, 1500)
            }), g = k.Ticker.prototype = new k.events.EventDispatcher, g.constructor = k.Ticker;
            var C = s("core.Animation", function(a, b) {
                if (this.vars = b = b || {}, this._duration = this._totalDuration = a || 0, this._delay = Number(b.delay) || 0, this._timeScale = 1, this._active = b.immediateRender === !0, this.data = b.data, this._reversed = b.reversed === !0, V) {
                    i || h.wake();
                    var c = this.vars.useFrames ? U : V;
                    c.add(this, c._time), this.vars.paused && this.paused(!0)
                }
            });
            h = C.ticker = new k.Ticker, g = C.prototype, g._dirty = g._gc = g._initted = g._paused = !1, g._totalTime = g._time = 0, g._rawPrevTime = -1, g._next = g._last = g._onUpdate = g._timeline = g.timeline = null, g._paused = !1;
            var D = function() {
                i && A() - B > 2e3 && h.wake(), setTimeout(D, 2e3)
            };
            D(), g.play = function(a, b) {
                return null != a && this.seek(a, b), this.reversed(!1).paused(!1)
            }, g.pause = function(a, b) {
                return null != a && this.seek(a, b), this.paused(!0)
            }, g.resume = function(a, b) {
                return null != a && this.seek(a, b), this.paused(!1)
            }, g.seek = function(a, b) {
                return this.totalTime(Number(a), b !== !1)
            }, g.restart = function(a, b) {
                return this.reversed(!1).paused(!1).totalTime(a ? -this._delay : 0, b !== !1, !0)
            }, g.reverse = function(a, b) {
                return null != a && this.seek(a || this.totalDuration(), b), this.reversed(!0).paused(!1)
            }, g.render = function(a, b, c) {}, g.invalidate = function() {
                return this._time = this._totalTime = 0, this._initted = this._gc = !1, this._rawPrevTime = -1, (this._gc || !this.timeline) && this._enabled(!0), this
            }, g.isActive = function() {
                var a, b = this._timeline,
                    c = this._startTime;
                return !b || !this._gc && !this._paused && b.isActive() && (a = b.rawTime()) >= c && a < c + this.totalDuration() / this._timeScale
            }, g._enabled = function(a, b) {
                return i || h.wake(), this._gc = !a, this._active = this.isActive(), b !== !0 && (a && !this.timeline ? this._timeline.add(this, this._startTime - this._delay) : !a && this.timeline && this._timeline._remove(this, !0)), !1
            }, g._kill = function(a, b) {
                return this._enabled(!1, !1)
            }, g.kill = function(a, b) {
                return this._kill(a, b), this
            }, g._uncache = function(a) {
                for (var b = a ? this : this.timeline; b;) b._dirty = !0, b = b.timeline;
                return this
            }, g._swapSelfInParams = function(a) {
                for (var b = a.length, c = a.concat(); --b > -1;) "{self}" === a[b] && (c[b] = this);
                return c
            }, g._callback = function(a) {
                var b = this.vars,
                    c = b[a],
                    d = b[a + "Params"],
                    e = b[a + "Scope"] || b.callbackScope || this,
                    f = d ? d.length : 0;
                switch (f) {
                    case 0:
                        c.call(e);
                        break;
                    case 1:
                        c.call(e, d[0]);
                        break;
                    case 2:
                        c.call(e, d[0], d[1]);
                        break;
                    default:
                        c.apply(e, d)
                }
            }, g.eventCallback = function(a, b, c, d) {
                if ("on" === (a || "").substr(0, 2)) {
                    var e = this.vars;
                    if (1 === arguments.length) return e[a];
                    null == b ? delete e[a] : (e[a] = b, e[a + "Params"] = o(c) && -1 !== c.join("").indexOf("{self}") ? this._swapSelfInParams(c) : c, e[a + "Scope"] = d), "onUpdate" === a && (this._onUpdate = b)
                }
                return this
            }, g.delay = function(a) {
                return arguments.length ? (this._timeline.smoothChildTiming && this.startTime(this._startTime + a - this._delay), this._delay = a, this) : this._delay
            }, g.duration = function(a) {
                return arguments.length ? (this._duration = this._totalDuration = a, this._uncache(!0), this._timeline.smoothChildTiming && this._time > 0 && this._time < this._duration && 0 !== a && this.totalTime(this._totalTime * (a / this._duration), !0), this) : (this._dirty = !1, this._duration)
            }, g.totalDuration = function(a) {
                return this._dirty = !1, arguments.length ? this.duration(a) : this._totalDuration
            }, g.time = function(a, b) {
                return arguments.length ? (this._dirty && this.totalDuration(), this.totalTime(a > this._duration ? this._duration : a, b)) : this._time
            }, g.totalTime = function(a, b, c) {
                if (i || h.wake(), !arguments.length) return this._totalTime;
                if (this._timeline) {
                    if (0 > a && !c && (a += this.totalDuration()), this._timeline.smoothChildTiming) {
                        this._dirty && this.totalDuration();
                        var d = this._totalDuration,
                            e = this._timeline;
                        if (a > d && !c && (a = d), this._startTime = (this._paused ? this._pauseTime : e._time) - (this._reversed ? d - a : a) / this._timeScale, e._dirty || this._uncache(!1), e._timeline)
                            for (; e._timeline;) e._timeline._time !== (e._startTime + e._totalTime) / e._timeScale && e.totalTime(e._totalTime, !0), e = e._timeline
                    }
                    this._gc && this._enabled(!0, !1), (this._totalTime !== a || 0 === this._duration) && (I.length && X(), this.render(a, b, !1), I.length && X())
                }
                return this
            }, g.progress = g.totalProgress = function(a, b) {
                var c = this.duration();
                return arguments.length ? this.totalTime(c * a, b) : c ? this._time / c : this.ratio
            }, g.startTime = function(a) {
                return arguments.length ? (a !== this._startTime && (this._startTime = a, this.timeline && this.timeline._sortChildren && this.timeline.add(this, a - this._delay)), this) : this._startTime
            }, g.endTime = function(a) {
                return this._startTime + (0 != a ? this.totalDuration() : this.duration()) / this._timeScale
            }, g.timeScale = function(a) {
                if (!arguments.length) return this._timeScale;
                if (a = a || l, this._timeline && this._timeline.smoothChildTiming) {
                    var b = this._pauseTime,
                        c = b || 0 === b ? b : this._timeline.totalTime();
                    this._startTime = c - (c - this._startTime) * this._timeScale / a
                }
                return this._timeScale = a, this._uncache(!1)
            }, g.reversed = function(a) {
                return arguments.length ? (a != this._reversed && (this._reversed = a, this.totalTime(this._timeline && !this._timeline.smoothChildTiming ? this.totalDuration() - this._totalTime : this._totalTime, !0)), this) : this._reversed
            }, g.paused = function(a) {
                if (!arguments.length) return this._paused;
                var b, c, d = this._timeline;
                return a != this._paused && d && (i || a || h.wake(), b = d.rawTime(), c = b - this._pauseTime, !a && d.smoothChildTiming && (this._startTime += c, this._uncache(!1)), this._pauseTime = a ? b : null, this._paused = a, this._active = this.isActive(), !a && 0 !== c && this._initted && this.duration() && (b = d.smoothChildTiming ? this._totalTime : (b - this._startTime) / this._timeScale, this.render(b, b === this._totalTime, !0))), this._gc && !a && this._enabled(!0, !1), this
            };
            var E = s("core.SimpleTimeline", function(a) {
                C.call(this, 0, a), this.autoRemoveChildren = this.smoothChildTiming = !0
            });
            g = E.prototype = new C, g.constructor = E, g.kill()._gc = !1, g._first = g._last = g._recent = null, g._sortChildren = !1, g.add = g.insert = function(a, b, c, d) {
                var e, f;
                if (a._startTime = Number(b || 0) + a._delay, a._paused && this !== a._timeline && (a._pauseTime = a._startTime + (this.rawTime() - a._startTime) / a._timeScale), a.timeline && a.timeline._remove(a, !0), a.timeline = a._timeline = this, a._gc && a._enabled(!0, !0), e = this._last, this._sortChildren)
                    for (f = a._startTime; e && e._startTime > f;) e = e._prev;
                return e ? (a._next = e._next, e._next = a) : (a._next = this._first, this._first = a), a._next ? a._next._prev = a : this._last = a, a._prev = e, this._recent = a, this._timeline && this._uncache(!0), this
            }, g._remove = function(a, b) {
                return a.timeline === this && (b || a._enabled(!1, !0), a._prev ? a._prev._next = a._next : this._first === a && (this._first = a._next), a._next ? a._next._prev = a._prev : this._last === a && (this._last = a._prev), a._next = a._prev = a.timeline = null, a === this._recent && (this._recent = this._last), this._timeline && this._uncache(!0)), this
            }, g.render = function(a, b, c) {
                var d, e = this._first;
                for (this._totalTime = this._time = this._rawPrevTime = a; e;) d = e._next, (e._active || a >= e._startTime && !e._paused) && (e._reversed ? e.render((e._dirty ? e.totalDuration() : e._totalDuration) - (a - e._startTime) * e._timeScale, b, c) : e.render((a - e._startTime) * e._timeScale, b, c)), e = d
            }, g.rawTime = function() {
                return i || h.wake(), this._totalTime
            };
            var F = s("TweenLite", function(b, c, d) {
                    if (C.call(this, c, d), this.render = F.prototype.render, null == b) throw "Cannot tween a null target.";
                    this.target = b = "string" != typeof b ? b : F.selector(b) || b;
                    var e, f, g, h = b.jquery || b.length && b !== a && b[0] && (b[0] === a || b[0].nodeType && b[0].style && !b.nodeType),
                        i = this.vars.overwrite;
                    if (this._overwrite = i = null == i ? T[F.defaultOverwrite] : "number" == typeof i ? i >> 0 : T[i], (h || b instanceof Array || b.push && o(b)) && "number" != typeof b[0])
                        for (this._targets = g = m(b), this._propLookup = [], this._siblings = [], e = 0; e < g.length; e++) f = g[e], f ? "string" != typeof f ? f.length && f !== a && f[0] && (f[0] === a || f[0].nodeType && f[0].style && !f.nodeType) ? (g.splice(e--, 1), this._targets = g = g.concat(m(f))) : (this._siblings[e] = Y(f, this, !1), 1 === i && this._siblings[e].length > 1 && $(f, this, null, 1, this._siblings[e])) : (f = g[e--] = F.selector(f), "string" == typeof f && g.splice(e + 1, 1)) : g.splice(e--, 1);
                    else this._propLookup = {}, this._siblings = Y(b, this, !1), 1 === i && this._siblings.length > 1 && $(b, this, null, 1, this._siblings);
                    (this.vars.immediateRender || 0 === c && 0 === this._delay && this.vars.immediateRender !== !1) && (this._time = -l, this.render(Math.min(0, -this._delay)))
                }, !0),
                G = function(b) {
                    return b && b.length && b !== a && b[0] && (b[0] === a || b[0].nodeType && b[0].style && !b.nodeType);
                },
                H = function(a, b) {
                    var c, d = {};
                    for (c in a) S[c] || c in b && "transform" !== c && "x" !== c && "y" !== c && "width" !== c && "height" !== c && "className" !== c && "border" !== c || !(!P[c] || P[c] && P[c]._autoCSS) || (d[c] = a[c], delete a[c]);
                    a.css = d
                };
            g = F.prototype = new C, g.constructor = F, g.kill()._gc = !1, g.ratio = 0, g._firstPT = g._targets = g._overwrittenProps = g._startAt = null, g._notifyPluginsOfEnabled = g._lazy = !1, F.version = "1.19.0", F.defaultEase = g._ease = new u(null, null, 1, 1), F.defaultOverwrite = "auto", F.ticker = h, F.autoSleep = 120, F.lagSmoothing = function(a, b) {
                h.lagSmoothing(a, b)
            }, F.selector = a.$ || a.jQuery || function(b) {
                var c = a.$ || a.jQuery;
                return c ? (F.selector = c, c(b)) : "undefined" == typeof document ? b : document.querySelectorAll ? document.querySelectorAll(b) : document.getElementById("#" === b.charAt(0) ? b.substr(1) : b)
            };
            var I = [],
                J = {},
                K = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
                L = function(a) {
                    for (var b, c = this._firstPT, d = 1e-6; c;) b = c.blob ? a ? this.join("") : this.start : c.c * a + c.s, c.m ? b = c.m(b, this._target || c.t) : d > b && b > -d && (b = 0), c.f ? c.fp ? c.t[c.p](c.fp, b) : c.t[c.p](b) : c.t[c.p] = b, c = c._next
                },
                M = function(a, b, c, d) {
                    var e, f, g, h, i, j, k, l = [a, b],
                        m = 0,
                        n = "",
                        o = 0;
                    for (l.start = a, c && (c(l), a = l[0], b = l[1]), l.length = 0, e = a.match(K) || [], f = b.match(K) || [], d && (d._next = null, d.blob = 1, l._firstPT = l._applyPT = d), i = f.length, h = 0; i > h; h++) k = f[h], j = b.substr(m, b.indexOf(k, m) - m), n += j || !h ? j : ",", m += j.length, o ? o = (o + 1) % 5 : "rgba(" === j.substr(-5) && (o = 1), k === e[h] || e.length <= h ? n += k : (n && (l.push(n), n = ""), g = parseFloat(e[h]), l.push(g), l._firstPT = {
                        _next: l._firstPT,
                        t: l,
                        p: l.length - 1,
                        s: g,
                        c: ("=" === k.charAt(1) ? parseInt(k.charAt(0) + "1", 10) * parseFloat(k.substr(2)) : parseFloat(k) - g) || 0,
                        f: 0,
                        m: o && 4 > o ? Math.round : 0
                    }), m += k.length;
                    return n += b.substr(m), n && l.push(n), l.setRatio = L, l
                },
                N = function(a, b, c, d, e, f, g, h, i) {
                    "function" == typeof d && (d = d(i || 0, a));
                    var j, k, l = "get" === c ? a[b] : c,
                        m = typeof a[b],
                        n = "string" == typeof d && "=" === d.charAt(1),
                        o = {
                            t: a,
                            p: b,
                            s: l,
                            f: "function" === m,
                            pg: 0,
                            n: e || b,
                            m: f ? "function" == typeof f ? f : Math.round : 0,
                            pr: 0,
                            c: n ? parseInt(d.charAt(0) + "1", 10) * parseFloat(d.substr(2)) : parseFloat(d) - l || 0
                        };
                    return "number" !== m && ("function" === m && "get" === c && (k = b.indexOf("set") || "function" != typeof a["get" + b.substr(3)] ? b : "get" + b.substr(3), o.s = l = g ? a[k](g) : a[k]()), "string" == typeof l && (g || isNaN(l)) ? (o.fp = g, j = M(l, d, h || F.defaultStringFilter, o), o = {
                        t: j,
                        p: "setRatio",
                        s: 0,
                        c: 1,
                        f: 2,
                        pg: 0,
                        n: e || b,
                        pr: 0,
                        m: 0
                    }) : n || (o.s = parseFloat(l), o.c = parseFloat(d) - o.s || 0)), o.c ? ((o._next = this._firstPT) && (o._next._prev = o), this._firstPT = o, o) : void 0
                },
                O = F._internals = {
                    isArray: o,
                    isSelector: G,
                    lazyTweens: I,
                    blobDif: M
                },
                P = F._plugins = {},
                Q = O.tweenLookup = {},
                R = 0,
                S = O.reservedProps = {
                    ease: 1,
                    delay: 1,
                    overwrite: 1,
                    onComplete: 1,
                    onCompleteParams: 1,
                    onCompleteScope: 1,
                    useFrames: 1,
                    runBackwards: 1,
                    startAt: 1,
                    onUpdate: 1,
                    onUpdateParams: 1,
                    onUpdateScope: 1,
                    onStart: 1,
                    onStartParams: 1,
                    onStartScope: 1,
                    onReverseComplete: 1,
                    onReverseCompleteParams: 1,
                    onReverseCompleteScope: 1,
                    onRepeat: 1,
                    onRepeatParams: 1,
                    onRepeatScope: 1,
                    easeParams: 1,
                    yoyo: 1,
                    immediateRender: 1,
                    repeat: 1,
                    repeatDelay: 1,
                    data: 1,
                    paused: 1,
                    reversed: 1,
                    autoCSS: 1,
                    lazy: 1,
                    onOverwrite: 1,
                    callbackScope: 1,
                    stringFilter: 1,
                    id: 1
                },
                T = {
                    none: 0,
                    all: 1,
                    auto: 2,
                    concurrent: 3,
                    allOnStart: 4,
                    preexisting: 5,
                    "true": 1,
                    "false": 0
                },
                U = C._rootFramesTimeline = new E,
                V = C._rootTimeline = new E,
                W = 30,
                X = O.lazyRender = function() {
                    var a, b = I.length;
                    for (J = {}; --b > -1;) a = I[b], a && a._lazy !== !1 && (a.render(a._lazy[0], a._lazy[1], !0), a._lazy = !1);
                    I.length = 0
                };
            V._startTime = h.time, U._startTime = h.frame, V._active = U._active = !0, setTimeout(X, 1), C._updateRoot = F.render = function() {
                var a, b, c;
                if (I.length && X(), V.render((h.time - V._startTime) * V._timeScale, !1, !1), U.render((h.frame - U._startTime) * U._timeScale, !1, !1), I.length && X(), h.frame >= W) {
                    W = h.frame + (parseInt(F.autoSleep, 10) || 120);
                    for (c in Q) {
                        for (b = Q[c].tweens, a = b.length; --a > -1;) b[a]._gc && b.splice(a, 1);
                        0 === b.length && delete Q[c]
                    }
                    if (c = V._first, (!c || c._paused) && F.autoSleep && !U._first && 1 === h._listeners.tick.length) {
                        for (; c && c._paused;) c = c._next;
                        c || h.sleep()
                    }
                }
            }, h.addEventListener("tick", C._updateRoot);
            var Y = function(a, b, c) {
                    var d, e, f = a._gsTweenID;
                    if (Q[f || (a._gsTweenID = f = "t" + R++)] || (Q[f] = {
                            target: a,
                            tweens: []
                        }), b && (d = Q[f].tweens, d[e = d.length] = b, c))
                        for (; --e > -1;) d[e] === b && d.splice(e, 1);
                    return Q[f].tweens
                },
                Z = function(a, b, c, d) {
                    var e, f, g = a.vars.onOverwrite;
                    return g && (e = g(a, b, c, d)), g = F.onOverwrite, g && (f = g(a, b, c, d)), e !== !1 && f !== !1
                },
                $ = function(a, b, c, d, e) {
                    var f, g, h, i;
                    if (1 === d || d >= 4) {
                        for (i = e.length, f = 0; i > f; f++)
                            if ((h = e[f]) !== b) h._gc || h._kill(null, a, b) && (g = !0);
                            else if (5 === d) break;
                        return g
                    }
                    var j, k = b._startTime + l,
                        m = [],
                        n = 0,
                        o = 0 === b._duration;
                    for (f = e.length; --f > -1;)(h = e[f]) === b || h._gc || h._paused || (h._timeline !== b._timeline ? (j = j || _(b, 0, o), 0 === _(h, j, o) && (m[n++] = h)) : h._startTime <= k && h._startTime + h.totalDuration() / h._timeScale > k && ((o || !h._initted) && k - h._startTime <= 2e-10 || (m[n++] = h)));
                    for (f = n; --f > -1;)
                        if (h = m[f], 2 === d && h._kill(c, a, b) && (g = !0), 2 !== d || !h._firstPT && h._initted) {
                            if (2 !== d && !Z(h, b)) continue;
                            h._enabled(!1, !1) && (g = !0)
                        } return g
                },
                _ = function(a, b, c) {
                    for (var d = a._timeline, e = d._timeScale, f = a._startTime; d._timeline;) {
                        if (f += d._startTime, e *= d._timeScale, d._paused) return -100;
                        d = d._timeline
                    }
                    return f /= e, f > b ? f - b : c && f === b || !a._initted && 2 * l > f - b ? l : (f += a.totalDuration() / a._timeScale / e) > b + l ? 0 : f - b - l
                };
            g._init = function() {
                var a, b, c, d, e, f, g = this.vars,
                    h = this._overwrittenProps,
                    i = this._duration,
                    j = !!g.immediateRender,
                    k = g.ease;
                if (g.startAt) {
                    this._startAt && (this._startAt.render(-1, !0), this._startAt.kill()), e = {};
                    for (d in g.startAt) e[d] = g.startAt[d];
                    if (e.overwrite = !1, e.immediateRender = !0, e.lazy = j && g.lazy !== !1, e.startAt = e.delay = null, this._startAt = F.to(this.target, 0, e), j)
                        if (this._time > 0) this._startAt = null;
                        else if (0 !== i) return
                } else if (g.runBackwards && 0 !== i)
                    if (this._startAt) this._startAt.render(-1, !0), this._startAt.kill(), this._startAt = null;
                    else {
                        0 !== this._time && (j = !1), c = {};
                        for (d in g) S[d] && "autoCSS" !== d || (c[d] = g[d]);
                        if (c.overwrite = 0, c.data = "isFromStart", c.lazy = j && g.lazy !== !1, c.immediateRender = j, this._startAt = F.to(this.target, 0, c), j) {
                            if (0 === this._time) return
                        } else this._startAt._init(), this._startAt._enabled(!1), this.vars.immediateRender && (this._startAt = null)
                    } if (this._ease = k = k ? k instanceof u ? k : "function" == typeof k ? new u(k, g.easeParams) : v[k] || F.defaultEase : F.defaultEase, g.easeParams instanceof Array && k.config && (this._ease = k.config.apply(k, g.easeParams)), this._easeType = this._ease._type, this._easePower = this._ease._power, this._firstPT = null, this._targets)
                    for (f = this._targets.length, a = 0; f > a; a++) this._initProps(this._targets[a], this._propLookup[a] = {}, this._siblings[a], h ? h[a] : null, a) && (b = !0);
                else b = this._initProps(this.target, this._propLookup, this._siblings, h, 0);
                if (b && F._onPluginEvent("_onInitAllProps", this), h && (this._firstPT || "function" != typeof this.target && this._enabled(!1, !1)), g.runBackwards)
                    for (c = this._firstPT; c;) c.s += c.c, c.c = -c.c, c = c._next;
                this._onUpdate = g.onUpdate, this._initted = !0
            }, g._initProps = function(b, c, d, e, f) {
                var g, h, i, j, k, l;
                if (null == b) return !1;
                J[b._gsTweenID] && X(), this.vars.css || b.style && b !== a && b.nodeType && P.css && this.vars.autoCSS !== !1 && H(this.vars, b);
                for (g in this.vars)
                    if (l = this.vars[g], S[g]) l && (l instanceof Array || l.push && o(l)) && -1 !== l.join("").indexOf("{self}") && (this.vars[g] = l = this._swapSelfInParams(l, this));
                    else if (P[g] && (j = new P[g])._onInitTween(b, this.vars[g], this, f)) {
                    for (this._firstPT = k = {
                            _next: this._firstPT,
                            t: j,
                            p: "setRatio",
                            s: 0,
                            c: 1,
                            f: 1,
                            n: g,
                            pg: 1,
                            pr: j._priority,
                            m: 0
                        }, h = j._overwriteProps.length; --h > -1;) c[j._overwriteProps[h]] = this._firstPT;
                    (j._priority || j._onInitAllProps) && (i = !0), (j._onDisable || j._onEnable) && (this._notifyPluginsOfEnabled = !0), k._next && (k._next._prev = k)
                } else c[g] = N.call(this, b, g, "get", l, g, 0, null, this.vars.stringFilter, f);
                return e && this._kill(e, b) ? this._initProps(b, c, d, e, f) : this._overwrite > 1 && this._firstPT && d.length > 1 && $(b, this, c, this._overwrite, d) ? (this._kill(c, b), this._initProps(b, c, d, e, f)) : (this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration) && (J[b._gsTweenID] = !0), i)
            }, g.render = function(a, b, c) {
                var d, e, f, g, h = this._time,
                    i = this._duration,
                    j = this._rawPrevTime;
                if (a >= i - 1e-7) this._totalTime = this._time = i, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1, this._reversed || (d = !0, e = "onComplete", c = c || this._timeline.autoRemoveChildren), 0 === i && (this._initted || !this.vars.lazy || c) && (this._startTime === this._timeline._duration && (a = 0), (0 > j || 0 >= a && a >= -1e-7 || j === l && "isPause" !== this.data) && j !== a && (c = !0, j > l && (e = "onReverseComplete")), this._rawPrevTime = g = !b || a || j === a ? a : l);
                else if (1e-7 > a) this._totalTime = this._time = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0, (0 !== h || 0 === i && j > 0) && (e = "onReverseComplete", d = this._reversed), 0 > a && (this._active = !1, 0 === i && (this._initted || !this.vars.lazy || c) && (j >= 0 && (j !== l || "isPause" !== this.data) && (c = !0), this._rawPrevTime = g = !b || a || j === a ? a : l)), this._initted || (c = !0);
                else if (this._totalTime = this._time = a, this._easeType) {
                    var k = a / i,
                        m = this._easeType,
                        n = this._easePower;
                    (1 === m || 3 === m && k >= .5) && (k = 1 - k), 3 === m && (k *= 2), 1 === n ? k *= k : 2 === n ? k *= k * k : 3 === n ? k *= k * k * k : 4 === n && (k *= k * k * k * k), 1 === m ? this.ratio = 1 - k : 2 === m ? this.ratio = k : .5 > a / i ? this.ratio = k / 2 : this.ratio = 1 - k / 2
                } else this.ratio = this._ease.getRatio(a / i);
                if (this._time !== h || c) {
                    if (!this._initted) {
                        if (this._init(), !this._initted || this._gc) return;
                        if (!c && this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration)) return this._time = this._totalTime = h, this._rawPrevTime = j, I.push(this), void(this._lazy = [a, b]);
                        this._time && !d ? this.ratio = this._ease.getRatio(this._time / i) : d && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1))
                    }
                    for (this._lazy !== !1 && (this._lazy = !1), this._active || !this._paused && this._time !== h && a >= 0 && (this._active = !0), 0 === h && (this._startAt && (a >= 0 ? this._startAt.render(a, b, c) : e || (e = "_dummyGS")), this.vars.onStart && (0 !== this._time || 0 === i) && (b || this._callback("onStart"))), f = this._firstPT; f;) f.f ? f.t[f.p](f.c * this.ratio + f.s) : f.t[f.p] = f.c * this.ratio + f.s, f = f._next;
                    this._onUpdate && (0 > a && this._startAt && a !== -1e-4 && this._startAt.render(a, b, c), b || (this._time !== h || d || c) && this._callback("onUpdate")), e && (!this._gc || c) && (0 > a && this._startAt && !this._onUpdate && a !== -1e-4 && this._startAt.render(a, b, c), d && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !b && this.vars[e] && this._callback(e), 0 === i && this._rawPrevTime === l && g !== l && (this._rawPrevTime = 0))
                }
            }, g._kill = function(a, b, c) {
                if ("all" === a && (a = null), null == a && (null == b || b === this.target)) return this._lazy = !1, this._enabled(!1, !1);
                b = "string" != typeof b ? b || this._targets || this.target : F.selector(b) || b;
                var d, e, f, g, h, i, j, k, l, m = c && this._time && c._startTime === this._startTime && this._timeline === c._timeline;
                if ((o(b) || G(b)) && "number" != typeof b[0])
                    for (d = b.length; --d > -1;) this._kill(a, b[d], c) && (i = !0);
                else {
                    if (this._targets) {
                        for (d = this._targets.length; --d > -1;)
                            if (b === this._targets[d]) {
                                h = this._propLookup[d] || {}, this._overwrittenProps = this._overwrittenProps || [], e = this._overwrittenProps[d] = a ? this._overwrittenProps[d] || {} : "all";
                                break
                            }
                    } else {
                        if (b !== this.target) return !1;
                        h = this._propLookup, e = this._overwrittenProps = a ? this._overwrittenProps || {} : "all"
                    }
                    if (h) {
                        if (j = a || h, k = a !== e && "all" !== e && a !== h && ("object" != typeof a || !a._tempKill), c && (F.onOverwrite || this.vars.onOverwrite)) {
                            for (f in j) h[f] && (l || (l = []), l.push(f));
                            if ((l || !a) && !Z(this, c, b, l)) return !1
                        }
                        for (f in j)(g = h[f]) && (m && (g.f ? g.t[g.p](g.s) : g.t[g.p] = g.s, i = !0), g.pg && g.t._kill(j) && (i = !0), g.pg && 0 !== g.t._overwriteProps.length || (g._prev ? g._prev._next = g._next : g === this._firstPT && (this._firstPT = g._next), g._next && (g._next._prev = g._prev), g._next = g._prev = null), delete h[f]), k && (e[f] = 1);
                        !this._firstPT && this._initted && this._enabled(!1, !1)
                    }
                }
                return i
            }, g.invalidate = function() {
                return this._notifyPluginsOfEnabled && F._onPluginEvent("_onDisable", this), this._firstPT = this._overwrittenProps = this._startAt = this._onUpdate = null, this._notifyPluginsOfEnabled = this._active = this._lazy = !1, this._propLookup = this._targets ? {} : [], C.prototype.invalidate.call(this), this.vars.immediateRender && (this._time = -l, this.render(Math.min(0, -this._delay))), this
            }, g._enabled = function(a, b) {
                if (i || h.wake(), a && this._gc) {
                    var c, d = this._targets;
                    if (d)
                        for (c = d.length; --c > -1;) this._siblings[c] = Y(d[c], this, !0);
                    else this._siblings = Y(this.target, this, !0)
                }
                return C.prototype._enabled.call(this, a, b), this._notifyPluginsOfEnabled && this._firstPT ? F._onPluginEvent(a ? "_onEnable" : "_onDisable", this) : !1
            }, F.to = function(a, b, c) {
                return new F(a, b, c)
            }, F.from = function(a, b, c) {
                return c.runBackwards = !0, c.immediateRender = 0 != c.immediateRender, new F(a, b, c)
            }, F.fromTo = function(a, b, c, d) {
                return d.startAt = c, d.immediateRender = 0 != d.immediateRender && 0 != c.immediateRender, new F(a, b, d)
            }, F.delayedCall = function(a, b, c, d, e) {
                return new F(b, 0, {
                    delay: a,
                    onComplete: b,
                    onCompleteParams: c,
                    callbackScope: d,
                    onReverseComplete: b,
                    onReverseCompleteParams: c,
                    immediateRender: !1,
                    lazy: !1,
                    useFrames: e,
                    overwrite: 0
                })
            }, F.set = function(a, b) {
                return new F(a, 0, b)
            }, F.getTweensOf = function(a, b) {
                if (null == a) return [];
                a = "string" != typeof a ? a : F.selector(a) || a;
                var c, d, e, f;
                if ((o(a) || G(a)) && "number" != typeof a[0]) {
                    for (c = a.length, d = []; --c > -1;) d = d.concat(F.getTweensOf(a[c], b));
                    for (c = d.length; --c > -1;)
                        for (f = d[c], e = c; --e > -1;) f === d[e] && d.splice(c, 1)
                } else
                    for (d = Y(a).concat(), c = d.length; --c > -1;)(d[c]._gc || b && !d[c].isActive()) && d.splice(c, 1);
                return d
            }, F.killTweensOf = F.killDelayedCallsTo = function(a, b, c) {
                "object" == typeof b && (c = b, b = !1);
                for (var d = F.getTweensOf(a, b), e = d.length; --e > -1;) d[e]._kill(c, a)
            };
            var aa = s("plugins.TweenPlugin", function(a, b) {
                this._overwriteProps = (a || "").split(","), this._propName = this._overwriteProps[0], this._priority = b || 0, this._super = aa.prototype
            }, !0);
            if (g = aa.prototype, aa.version = "1.19.0", aa.API = 2, g._firstPT = null, g._addTween = N, g.setRatio = L, g._kill = function(a) {
                    var b, c = this._overwriteProps,
                        d = this._firstPT;
                    if (null != a[this._propName]) this._overwriteProps = [];
                    else
                        for (b = c.length; --b > -1;) null != a[c[b]] && c.splice(b, 1);
                    for (; d;) null != a[d.n] && (d._next && (d._next._prev = d._prev), d._prev ? (d._prev._next = d._next, d._prev = null) : this._firstPT === d && (this._firstPT = d._next)), d = d._next;
                    return !1
                }, g._mod = g._roundProps = function(a) {
                    for (var b, c = this._firstPT; c;) b = a[this._propName] || null != c.n && a[c.n.split(this._propName + "_").join("")], b && "function" == typeof b && (2 === c.f ? c.t._applyPT.m = b : c.m = b), c = c._next
                }, F._onPluginEvent = function(a, b) {
                    var c, d, e, f, g, h = b._firstPT;
                    if ("_onInitAllProps" === a) {
                        for (; h;) {
                            for (g = h._next, d = e; d && d.pr > h.pr;) d = d._next;
                            (h._prev = d ? d._prev : f) ? h._prev._next = h: e = h, (h._next = d) ? d._prev = h : f = h, h = g
                        }
                        h = b._firstPT = e
                    }
                    for (; h;) h.pg && "function" == typeof h.t[a] && h.t[a]() && (c = !0), h = h._next;
                    return c
                }, aa.activate = function(a) {
                    for (var b = a.length; --b > -1;) a[b].API === aa.API && (P[(new a[b])._propName] = a[b]);
                    return !0
                }, r.plugin = function(a) {
                    if (!(a && a.propName && a.init && a.API)) throw "illegal plugin definition.";
                    var b, c = a.propName,
                        d = a.priority || 0,
                        e = a.overwriteProps,
                        f = {
                            init: "_onInitTween",
                            set: "setRatio",
                            kill: "_kill",
                            round: "_mod",
                            mod: "_mod",
                            initAll: "_onInitAllProps"
                        },
                        g = s("plugins." + c.charAt(0).toUpperCase() + c.substr(1) + "Plugin", function() {
                            aa.call(this, c, d), this._overwriteProps = e || []
                        }, a.global === !0),
                        h = g.prototype = new aa(c);
                    h.constructor = g, g.API = a.API;
                    for (b in f) "function" == typeof a[b] && (h[f[b]] = a[b]);
                    return g.version = a.version, aa.activate([g]), g
                }, e = a._gsQueue) {
                for (f = 0; f < e.length; f++) e[f]();
                for (g in p) p[g].func || a.console.log("GSAP encountered missing dependency: " + g)
            }
            i = !1
        }
    }("undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window, "TweenMax");
! function(a, b) {
    "function" == typeof define && define.amd ? define(b) : "undefined" != typeof exports ? module.exports = b() : b()
}(this, function() {
    window.SplitType = function(a, b, c) {
        function r(a) {
            return null !== a && "object" == typeof a
        }

        function s(a) {
            return r(a) && "number" == typeof a.length && a.length > 0
        }

        function t(a) {
            return r(a) && "[object Object]" === Object.prototype.toString.call(a)
        }

        function u(a) {
            return r(a) && /^(1|3|11)$/.test(a.nodeType)
        }

        function v(a) {
            return "string" == typeof a
        }

        function w(a, b, c) {
            for (var d = Object(a), e = s(d) ? d : t(d) ? j(d) : [d], f = parseInt(e.length) || 0, g = 0; g < f; g++) b.call(c, e[g], g, d)
        }

        function x(a, b) {
            return a = Object(a), b = Object(b), Object.getOwnPropertyNames(a).reduce(function(c, d) {
                return l(c, d, n(b, d) || n(a, d))
            }, {})
        }

        function y(a, b, d) {
            var i, h = {};
            return r(a) && (i = a[e] || (a[e] = ++g), h = f[i] || (f[i] = {})), d === c ? b === c ? h : h[b] : b !== c ? (h[b] = d, d) : void 0
        }

        function z(a) {
            var b = a && a[e];
            b && (delete a[b], delete f[b])
        }

        function A(a, d) {
            var e = b.createElement(a);
            return d === c ? e : (w(d, function(a) {
                var b = d[a];
                if (null !== b) switch (a) {
                    case "textContent":
                        e.textContent = b;
                        break;
                    case "innerHTML":
                        e.innerHTML = b;
                        break;
                    case "children":
                        w(b, function(a) {
                            u(a) && e.appendChild(a)
                        });
                        break;
                    default:
                        e.setAttribute(a, b)
                }
            }), e)
        }

        function B(a) {
            var d, e, f, g, h, j, k, c = [];
            if (v(a) && (d = a.trim(), e = "#" === d[0] && !/[^\w]/.test(f = d.slice(1)), a = e ? b.getElementById(f) : b.querySelectorAll(d)), d || u(a)) return u(a) ? [a] : i.call(a);
            if (s(a))
                for (j = 0, g = a.length; j < g; j++)
                    if (s(a[j]))
                        for (k = 0, h = a[j].length; k < h; k++) u(a[j][k]) && c.push(a[j][k]);
                    else u(a[j]) && c.push(a[j]);
            return c
        }

        function C(b) {
            var f, t, u, v, x, c = this.settings,
                d = c.tagName,
                e = "B" + 1 * new Date + "R",
                g = c.split,
                j = g.indexOf("lines") !== -1,
                k = g.indexOf("words") !== -1,
                l = g.indexOf("chars") !== -1,
                m = "absolute" === c.position || c.absolute === !0,
                n = A("div"),
                q = [],
                r = [],
                s = [];
            if (x = j ? A("div") : o(), n.innerHTML = b.innerHTML.replace(/<br\s*\/?>/g, " " + e + " "), f = n.textContent.replace(/\s+/g, " ").trim(), r = f.split(" ").map(function(a) {
                    if (a === e) return x.appendChild(A("br")), null;
                    if (l) {
                        var b = a.split("").map(function(a) {
                            return v = A(d, {
                                class: c.charClass + " " + c.splitClass,
                                style: "display: inline-block;",
                                textContent: a
                            })
                        });
                        h.apply(s, b)
                    }
                    return k || j ? (u = A(d, {
                        class: c.wordClass + " " + c.splitClass,
                        style: "display: inline-block; position:" + (k ? "relative" : "static;"),
                        children: l ? b : null,
                        textContent: l ? null : a
                    }), x.appendChild(u)) : w(b, function(a) {
                        x.appendChild(a)
                    }), x.appendChild(p(" ")), u
                }, this).filter(function(a) {
                    return a
                }), b.innerHTML = "", b.appendChild(x), h.apply(this.words, r), h.apply(this.chars, s), m || j) {
                var B, C, D, E, F, G, H, I, J, K, L, z = [];
                H = y(b).nodes = b.getElementsByTagName(d), I = b.parentElement, J = b.nextElementSibling, K = a.getComputedStyle(b), L = K.textAlign, m && (E = {
                    left: x.offsetLeft,
                    top: x.offsetTop,
                    width: x.offsetWidth
                }, G = b.offsetWidth, F = b.offsetHeight, y(b).cssWidth = b.style.width, y(b).cssHeight = b.style.height), w(H, function(a) {
                    if (a !== x) {
                        var c, b = a.parentElement === x;
                        j && b && (c = y(a).top = a.offsetTop, c !== C && (C = c, z.push(B = [])), B.push(a)), m && (y(a).top = c || a.offsetTop, y(a).left = a.offsetLeft, y(a).width = a.offsetWidth, y(a).height = D || (D = a.offsetHeight))
                    }
                }), I.removeChild(b), j && (x = o(), q = z.map(function(a) {
                    return x.appendChild(t = A(d, {
                        class: c.lineClass + " " + c.splitClass,
                        style: "display: block; text-align:" + L + "; width: 100%;"
                    })), m && (y(t).type = "line", y(t).top = y(a[0]).top, y(t).height = D), w(a, function(a) {
                        k ? t.appendChild(a) : l ? i.call(a.children).forEach(function(a) {
                            t.appendChild(a)
                        }) : t.appendChild(p(a.textContent)), t.appendChild(p(" "))
                    }), t
                }), b.replaceChild(x, b.firstChild), h.apply(this.lines, q)), m && (b.style.width = b.style.width || G + "px", b.style.height = F + "px", w(H, function(a) {
                    var b = "line" === y(a).type,
                        c = !b && "line" === y(a.parentElement).type;
                    a.style.top = c ? 0 : y(a).top + "px", a.style.left = b ? E.left + "px" : (c ? y(a).left - E.left : y(a).left) + "px", a.style.height = y(a).height + "px", a.style.width = b ? E.width + "px" : y(a).width + "px", a.style.position = "absolute"
                })), J ? I.insertBefore(b, J) : I.appendChild(b)
            }
        }

        function D(a, b) {
            return this instanceof D ? (this.isSplit = !1, this.settings = x(q, b), this.elements = B(a), void(this.elements.length && (this.originals = this.elements.map(function(a) {
                return y(a).html = y(a).html || a.innerHTML
            }), this.split()))) : new D(a, b)
        }
        if (b.addEventListener && Function.prototype.bind) {
            var e = "splitType" + 1 * new Date,
                f = {},
                g = 0,
                h = Array.prototype.push,
                i = Array.prototype.slice,
                j = Object.keys,
                l = (Object.prototype.hasOwnProperty, Object.defineProperty),
                n = (Object.defineProperties, Object.getOwnPropertyDescriptor),
                o = b.createDocumentFragment.bind(b),
                p = b.createTextNode.bind(b),
                q = {
                    splitClass: "",
                    lineClass: "line",
                    wordClass: "word",
                    charClass: "char",
                    split: "lines, words, chars",
                    position: "relative",
                    absolute: !1,
                    tagName: "div",
                    DEBUG: !1
                };
            return l(D, "defaults", {
                get: function() {
                    return q
                },
                set: function(a) {
                    q = x(q, a)
                }
            }), D.prototype.split = function(b) {
                this.revert(), this.lines = [], this.words = [], this.chars = [], b !== c && (this.settings = x(this.settings, b)), w(this.elements, function(a) {
                    C.call(this, a), y(a).isSplit = !0
                }, this), this.isSplit = !0, w(this.elements, function(a) {
                    for (var b = y(a).nodes || [], c = 0, d = b.length; c < d; c++) z(b[c])
                })
            }, D.prototype.revert = function() {
                this.isSplit && (this.lines = this.words = this.chars = null), w(this.elements, function(a) {
                    y(a).isSplit && y(a).html && (a.innerHTML = y(a).html, a.style.height = y(a).cssHeight || "", a.style.width = y(a).cssWidth || "", this.isSplit = !1)
                }, this)
            }, D
        }
    }(window, document)
});
if (typeof LS_Meta === 'object' && LS_Meta.fixGSAP) {
    window.GreenSockGlobals = null, window._gsQueue = null, window._gsDefine = null, delete window.GreenSockGlobals, delete window._gsQueue, delete window._gsDefine, window.GreenSockGlobals = LS_oldGS, window._gsQueue = LS_oldGSQueue, window._gsDefine = LS_oldGSDefine;
};;
eval(function(p, a, c, k, e, r) {
    e = function(c) {
        return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
    };
    if (!''.replace(/^/, String)) {
        while (c--) r[e(c)] = k[c] || e(c);
        k = [function(e) {
            return r[e]
        }];
        e = function() {
            return '\\w+'
        };
        c = 1
    };
    while (c--)
        if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    return p
}('1o.2G={7K:{b2:!1,cV:!1},fI:"6L"!=2t jP&&jP,ba:[],aY:[],8G:[],2K:{},fC:{},bm:2D.bm,fA:5D(\'8l[23*="5x.fz.bX.js"]\')[0],cU:"",7B:!1,jy:19(e,t,i,s){1d a,o,r="5l"==2t e?5D("#"+e).3j():e;2M(t){1j"bX":o="qP 5D jd",a=\'j7 j6 j1 q4 q1 5o or fp pT pF an pu pt of 4z 5D iF pg pf 2e 9x 2n 5W fp pe. cM pd on fp 9N pa p8 2n 4z p2 9G of 9x ix 7R 4z "p0 oY oX 2n 3I" oR oQ 4z oK & oJ oF 6i.\';1y;1j"il":o="oz 5D jd",a="j7 j6 j1 ii f5 op an om 6D ("+i+") of 4z 5D iF. 9x ol at od 6D "+s+\' or oc. cM 8u 5D 2n 1.10.x or o8. o4: cM do 5n i0 4z 5D o2 5o on 9N . <a 4P="8x://o1.fz.5d/o0/4/5x-2e-nW/#81-13&nI-60">nG nF nE nD nC nB 5D by nA nz.</a>\'}5D(\'<1C 2r="ls-hN"><i 2r="ls-hN-nx">!</i><hK>\'+o+"</hK><85>"+a+"</85></1C>").nu(r)},hH:19(e){18.fC[e]=2u,2p 18.fC[e]},eV:19(e,t){2e(1d i=e.1K("."),s=t.1K("."),a=0;a<i.1t;++a){if(s.1t==a)1T!1;if(1l(i[a])!=1l(s[a]))1T!(1l(i[a])>1l(s[a]))}1T i.1t,s.1t,!0}},nj.ni.1i=19(e){1T(""+18).1i(e)},19(e){"i0 nh";1o.7b={},e.fn.53=19(i,s,a,o){i=i||{};1d r,n="1.8.0",l=e.fn.bX;if(1o.2G.eV(n,l,n))1T(2t i).4i("5S|6L")?18.3c(19(s){r="ne"+1A.2J().eT(36).hx(2,9),e(18).1a("72")||(1o.7b[r]=4p t(18,e(18),i,r))}):"1a"===i?1o.7b[18.1a("72")]:"4M"===i?1o.7b[18.1a("72")].2C.4M():"n3"===i?1o.7b[18.1a("72")].1p.1m.3V||!1:"6J"===i?1o.7b[18.1a("72")].6J||!1:"n2"===i?1o.7b[18.1a("72")].o||!1:"eR"===i?1o.7b[18.1a("72")].eR||!1:18.3c(19(t){1d r=1o.7b[e(18).1a("72")];r&&r.2C.9m(i,s,a,o),r=2u});1o.2G.jy(e(18),"il",l,n)};1d t=19(t,i,s,a){i.1a("72",a).1J("1a-5x-eQ",a);1d o=18,r=o.mZ=1o.2G.fI?1o.2G.fI:1o;o.1p={1m:{eP:"|",1V:"mX",57:["#3k","#1Y","#2H","#1P","#6m","#3h","#3h-6m"],3V:{22:"26",8B:"5b",eO:!0,hs:!0,hr:!0,71:-1,ck:-1,hk:-1,5T:-1,hi:"aF",eK:2u,bB:!1,9a:"b6",h6:"50% 50%",h5:!1,9h:!0,aa:!0,5g:!1,h1:1,h0:!1,eG:!1,5K:"eF",9Z:!1,4d:1,cO:mk,5L:-1,eE:!0,aV:!1,8e:!1,7V:cY,4j:"me",8y:"/5x/eD/",8E:"59",8L:!1,gS:"no-64",gR:"2j",gQ:"2E",gL:"50% 50%",eC:!0,au:!0,bS:!0,gH:!0,gG:!0,gF:!0,bY:!1,gE:!1,gD:!0,gC:!1,6u:"1r",cm:"60%",ew:1q,9V:60,ev:35,eu:1q,ak:0,et:!0,al:"2E",go:"ly.lt",eo:40,em:10,ek:"8f",g4:!1,3i:!1,g2:"1S: -g0; 29: -g0;",ei:!1,fW:"kU",fV:!0,eg:!1,fT:-1,ef:-1,ec:!0,eb:!1,ea:!0,fN:!1,kI:""}},1c:{aZ:"9x (kH: "+a+") 7g:"},1R:{8H:{kG:["1a","1O"],1O:["1a","1O"],kF:["1a","c7"],7T:["1a","7T"],8w:["1a","8w"],fL:["1a","fL"],7t:["1a","7t"],7u:["1a","7u"],ks:["1a","aT"],km:["1a","cE"],kj:["1a","cE"],ki:["1a","cK"],kg:["1a","cK"],kf:["1a","3e"],kd:["1a","3e"],2A:["1a","2A"],4H:["1a","4H"],52:["1a","52"],jp:["2y","ji"],j9:["2y","6E"],j8:["2y","2f"],j5:["2y","2f"],iT:["2y","2U"],sg:["1u","3C"],rT:["1u","2n"],iE:["1F","22"],iD:["1F","7q"],iB:["1F","dZ"],iw:["1F","3l"],iu:["1F","aL"],ip:["1F","bq"],io:["1F","2f"],ik:["1F","2f"],ic:["1F","8i"],i7:["1F","2w"],6d:["1a","6d"]},3V:{$4W:!1,1L:-1,1a:{1O:-1,c7:0,bT:0},1F:{},2y:{2U:1.2},1u:{}},rm:19(e,t,i){o.1p.1R.3V.2K||(o.1p.1R.3V.2K={}),o.1p.1R.3V.2K[e]=t}},2V:{8H:{hZ:["is"],26:["is"],6z:["31"],3A:["31"],ri:["31"],84:["4g"],88:["4g"],8Z:["4g"],54:["2Q"],57:["2Q"],67:["2Q"],cF:["2Q"],2A:["2Q"],4C:["2Q"],aA:["2Q"],rh:["2Z","4L"],r6:["2Z","4L"],r4:["2f","4L"],r2:["3B","4L"],qT:["3E","4L"],qS:["2f","4L"],qR:["3B","4L"],qL:["3E","4L"],qK:["2U","4L"],qJ:["4s","4L"],qI:["4O","4L"],qH:["5P","4L"],qA:["5U","4L"],qw:["3e","9l"],qv:["3Z","9l"],qs:["3P","68"],qr:["1f","68"],qh:["1g","68"],qg:["1u","68"],3X:["2f","58"],q3:["3B","58"],pV:["3E","58"],2f:["2f","58"],pO:["3B","58"],pI:["3E","58"],2U:["2U","58"],pG:["4s","58"],pD:["4O","58"],pc:["5P","58"],p7:["5U","58"],p6:["3l","9L"],oV:["x","9L"],oT:["y","9L"],oM:["2g","am"],oL:["2W","in"],oI:["2W","in"],oD:["2W","in"],oC:["1O","in"],dO:["2s","in"],oA:["2s","in"],ox:["1U","in"],ou:["2Z","3K"],os:["2Z","3K"],ok:["2f","3K"],og:["3B","3K"],o9:["3E","3K"],o7:["2f","3K"],o6:["3B","3K"],o3:["3E","3K"],nX:["2U","3K"],nV:["4s","3K"],nU:["4O","3K"],nK:["5P","3K"],nJ:["5U","3K"],ny:["2s","9z"],nr:["2s","9z"],nq:["3l","8v"],np:["x","8v"],nn:["y","8v"],ng:["22","28"],nf:["7P","28"],n7:["2W","28"],n6:["2W","28"],n1:["2W","28"],n0:["1O","28"],mY:["1U","28"],mW:["2Z","4h"],mV:["2Z","4h"],mU:["2f","4h"],mS:["3B","4h"],mP:["3E","4h"],mO:["2f","4h"],mN:["3B","4h"],mL:["3E","4h"],mJ:["2U","4h"],mF:["4s","4h"],mE:["4O","4h"],mD:["5P","4h"],mC:["5U","4h"],mA:["3e","9f"],mz:["3Z","9f"],my:["3P","6f"],mx:["1f","6f"],mv:["1g","6f"],mu:["1u","6f"],mr:["3l","ap"],mq:["x","ap"],mo:["y","ap"],mn:["2g","7r"],ml:["bz","1M"],mj:["2W","1M"],mi:["2W","1M"],mh:["1O","1M"],dD:["2s","1M"],md:["2s","1M"],mc:["1U","1M"],mb:["2Z","3w"],m8:["2Z","3w"],m5:["2f","3w"],m3:["3B","3w"],lY:["3E","3w"],lV:["2f","3w"],lU:["3B","3w"],lT:["3E","3w"],lS:["2U","3w"],lR:["4s","3w"],lK:["4O","3w"],lJ:["5P","3w"],lH:["5U","3w"],lG:["2s","3w"],lE:["2s","3w"],lD:["3l","8s"],lC:["x","8s"],lB:["y","8s"],lA:["22","2B"],lz:["7P","2B"],lv:["2W","2B"],lu:["2W","2B"],lr:["2W","2B"],lq:["1O","2B"],lp:["1U","2B"],lo:["2Z","4e"],ln:["2f","4e"],lm:["3B","4e"],ll:["3E","4e"],lg:["2f","4e"],lf:["3B","4e"],lc:["3E","4e"],l6:["2U","4e"],kT:["4s","4e"],kR:["4O","4e"],kQ:["5P","4e"],kP:["5U","4e"],kK:["3l","6y"],kx:["x","6y"],ko:["y","6y"],kk:["1u","6y"],kc:["2g","aH"],k6:["2W","1B"],t4:["2W","1B"],sO:["1O","1B"],sN:["3r","1B"],sL:["8N","1B"],sK:["8M","1B"],sJ:["2s","1B"],sr:["2s","1B"],1B:["1U","1B"],sk:["2Z","4l"],sj:["2f","4l"],rR:["3B","4l"],rQ:["3E","4l"],rM:["2f","4l"],rF:["3B","4l"],rD:["3E","4l"],rC:["2U","4l"],rq:["4s","4l"],rp:["4O","4l"],ro:["5P","4l"],rn:["5U","4l"],rl:["3e","4l"],rk:["3Z","4l"],rg:["5O","1r"],rf:["5O","1r"],re:["5O","1r"],r3:["5O","1r"],qp:["6I","1r"],q5:["6I","1r"],q0:["7f","1r"],pZ:["7f","1r"],pJ:["b4","1r"],pl:["dw","1r"],p3:["x","4G"],p1:["y","4G"],oZ:["1u","4G"],oB:["3P","4G"],ot:["3P","4G"],oq:["3l","4G"],1r:["1U","1r"],jp:["ji","2y"],j9:["6E","2y"],j8:["2f","2y"],j5:["2f","2y"],iT:["2U","2y"],oe:["6h","1F"],iE:["22","1F"],iD:["7q","1F"],iB:["dZ","1F"],iw:["3l","1F"],iu:["aL","1F"],ip:["bq","1F"],io:["2f","1F"],ik:["2f","1F"],ic:["8i","1F"],1F:["1U","1F"],o5:["2V","2w"],nQ:["2V","2w"],nO:["2V","2w"],nM:["4X","2w"],nL:["4X","2w"],nH:["4X","2w"],nv:["1B","2w"],na:["1r","2w"],i7:["1F","2w"]},dv:["mt","mp","mg","m6","m2","m0","lI","lF","lx","lk","le","l7","kO","kE","kC"],iK:{7O:[1],7o:[2],7I:[3,[1,2,6,7,8]],8U:[4],7x:[5],6w:[6,[1,2,3,4,5]],7k:[7],iH:[8],iA:[9],ay:[10],8r:[11,[2,3,4,5,6,7,8,9,10]],94:[12],ds:[13],5q:[14,[2,3,4,5,6,7,8,9,10,11,12,13]],99:[15],hC:[16],dn:[17]},5h:{1u:19(){1T{cN:0,hb:1q,gZ:1q,gN:0,"cS-3X":0,gI:0,gA:1q,gw:0}}},3V:19(e,t){1d i={is:{5N:!!e.is("3L.ls-bg"),2x:!!e.is(".ls-bg-4v"),gu:!!e.is("3L.ls-2V"),9T:!1,9t:!1,26:!0,d2:t},4Y:{},24:{},31:{6z:"dl",mM:t,9y:t},4g:{84:0,88:0},2Q:{57:2u,54:2u,67:2u,cF:"b6",2A:2u,4C:2u,2x:!1},1s:{7O:0,7o:0,7I:0,8U:0,7x:19(e){1T 1A.46(18.7o,18.8U)},6w:0,7k:0,iH:19(e){1T 0===18.7k&&e.1B.1U&&("4t"==2t e.1B.2W||-1!==e.1B.2W.1i("7I")&&-1!==e.1B.2W.1i("8U")&&-1!==e.1B.2W.1i("7x"))?(18.6w=o.1b.1k.1s.8c(e,e.1B.2W,"6w"),18.7k=-1!==e.1B.3r&&e.1s.6w+(e.1B.64+1)*e.1B.1O+e.1B.64*e.1B.8N):o.2b&&o.1H.1z("2I","9D.mH",e.5a[0].dk+"."+e.5a.1J("2r")+" [ "+e.5a.5j().hx(0,30)+"... ]"),1A.46(18.7o,18.7k)},iA:19(e){1T 1A.46(18.8U,18.7k)},ay:19(e){1T 1A.46(18.7x(),18.7k)},8r:0,94:0,ds:19(e){1T 1A.46(18.94,18.7k)},5q:19(e){1T 1A.46(18.ay(),18.94)},99:0,hC:19(e){1T 1A.46(18.99,18.94,18.7x())},dn:19(e){1T 1A.46(18.99,18.ds(),18.7x())},bs:!1,bt:!1},20:{in:{1U:!0,9B:{2o:!1,4N:!1,1e:{2Z:0}},9u:{2o:!1,7E:19(){o.1b.1k.in.7E(e)},4k:19(){o.1b.1k.in.4k(e)},1e:{3t:"5J",2Z:1,2f:0,3B:0,3E:0,4s:1,4O:1,5P:0,5U:0,x:0,y:0}},9q:{2o:!1,4N:!1,1e:{}},9o:{2o:!1,1e:{}},bH:{2o:!1,4N:!1,1e:{}},6Q:{2o:!1,1e:{}},9n:{3l:"50% 50% 0",x:0,y:0},bK:{},bL:{},63:{},2W:0,1O:1,2s:"a1"},28:{1U:2u,bO:{6r:{},2J:{},2Z:0},a3:{2s:"a1",1e:{2Z:1,2f:0,3B:0,3E:0,4s:1,4O:1,5P:0,5U:0,x:0,y:0}},9k:{6r:{},2J:{},3l:"50% 50% 0",x:0,y:0},1K:"",7P:.di,2W:"7o",1O:1},1M:{1U:!0,9B:{2o:!1,4N:!1,1e:{}},9u:{2o:!1,7E:19(){o.1b.1k.1M.7E(e)},4k:19(){o.1b.1k.1M.4k(e)},1e:{2Z:0,2f:0,3B:0,3E:0,4s:1,4O:1,5P:0,5U:0}},9q:{2o:!1,4N:!1,1e:{}},9o:{2o:!1,1e:{}},bH:{2o:!1,4N:!1,1e:{}},6Q:{2o:!1,1e:{}},9n:{x:0,y:0},bK:{},bL:{},63:{},2W:"a6",1O:1,2s:"a1"},2B:{1U:2u,bO:{4N:!1,6r:{},2Z:1},a3:{2s:"a1",4N:!1,6r:{},2J:{},2Z:0},9k:{6r:{},2J:{},x:0,y:0},1K:"",2W:"ay",7P:.di,1O:1},1B:{1U:2u,3C:{2o:!1,4N:!1,1e:{}},2n:{2o:!1,1e:{}},6Q:{2o:!1,4N:!1,1e:{}},9n:{3l:"50% 50% 0",x:0,y:0},63:{},2s:"jK",2W:"7x",8N:0,1O:1,3r:0,8M:!1},1r:{1U:2u,3C:{2o:!1,4N:!1,1e:{}},2n:{2o:!1,1e:{}},9k:{3l:"50% 50% 0"},dw:!0,5O:"a1",7f:.5},1F:{1U:2u},2y:{2U:1.2},2g:{1U:!1,a8:"0 0 0 0",46:"-a9 a9 a9 -a9"},1u:{3m:{1X:{},in:{},1M:{},1B:{},1r:{},9j:{},bZ:{},c0:{},c1:{}},1b:{bg:2u,in:2u,1M:2u,1B:2u,1r:2u}},1m:{1Q:{2o:!1,4N:!1,1e:{3t:"5J"}}},2w:{2V:6s,4X:6s,1B:6s,1r:6s},3x:{jF:{2o:!1,1e:{2Z:1,3t:"3q"}},dh:{2o:!1,1e:{x:0,y:0,2f:0,3B:0,3E:0,4s:1,4O:1,5P:0,5U:0,2Z:1,3t:"3q"}},dg:{2o:!1,1e:{x:0,y:0,2f:0,3B:0,3E:0,4s:1,4O:1,5P:0,5U:0,2Z:1}}}}};1T{is:i.is,4Y:i.4Y,24:i.24,31:i.31,4g:i.4g,2Q:i.2Q,2R:i.2R,1s:i.1s,in:i.20.in,hL:i.20.in.9B,4L:i.20.in.9B.1e,hB:i.20.in.9q,9l:i.20.in.9q.1e,hw:i.20.in.bH,hn:i.20.in.bH.1e,ao:i.20.in.9u,58:i.20.in.9u.1e,dd:i.20.in.9o,cg:i.20.in.9o.1e,dc:i.20.in.6Q,gs:i.20.in.6Q.1e,am:i.20.in.63,9L:i.20.in.9n,68:i.20.in.bK,ar:i.20.in.bL,28:i.20.28,3K:i.20.28.bO,9z:i.20.28.a3,kB:i.20.28.a3.1e,8v:i.20.28.9k,1M:i.20.1M,db:i.20.1M.9B,da:i.20.1M.9B.1e,d8:i.20.1M.9q,cn:i.20.1M.9q.1e,ax:i.20.1M.9u,4h:i.20.1M.9u.1e,cp:i.20.1M.9o,9f:i.20.1M.9o.1e,cq:i.20.1M.6Q,d7:i.20.1M.6Q.1e,7r:i.20.1M.63,ap:i.20.1M.9n,az:i.20.1M.bK,6f:i.20.1M.bL,2B:i.20.2B,cu:i.20.2B.bO,3w:i.20.2B.a3,8s:i.20.2B.9k,1B:i.20.1B,hR:i.20.1B.3C,d6:i.20.1B.3C.1e,cx:i.20.1B.2n,4e:i.20.1B.2n.1e,es:i.20.1B.6Q,fR:i.20.1B.6Q.1e,aH:i.20.1B.63,6y:i.20.1B.9n,1r:i.20.1r,ex:i.20.1r.3C,eH:i.20.1r.3C.1e,d5:i.20.1r.2n,4l:i.20.1r.2n.1e,4G:i.20.1r.9k,1F:i.20.1F,2y:i.20.2y,2g:i.20.2g,1u:i.20.1u,2w:i.20.2w,1m:i.20.1m,3x:i.20.3x}}}},o.1h={3r:0,3j:{},2H:{},2z:{},1P:{},1m:19(){if(!2D.3I.86(t))1T!1;2e(1d s=i.1D("> .ls-2V, > .ls-1R"),a=0,r=o.1p.1R.8H,n=0,l=s.1t;n<l;n++){1d d,u=e(s[n]),p=u[0].1X,c=e.4V(!0,{},o.1p.1R.3V);if(o.1h.3r++,u.3W("ls-2V").2a("ls-1R").1e({1f:o.1c.49.aQ,1g:o.1c.49.cP}).2i(o.1c.$7v),u.1a("ls"))2e(1d h=u.1a("ls").4m().1K(";"),m=0;m<h.1t;m++){1d f,g,v=h[m].1K(":");v[0]=e.3N(v[0]),v[1]=e.3N(v[1]),""!==v[0]&&(2q 0!==r[v[0]]?(f=2q 0===r[v[0]][1]?v[0]:r[v[0]][1],g=o.1N.2T.5h(v[1]),-1===f.4m().1i("1O")&&-1===f.4m().1i("47")&&"c7"!=f||(g/=3y),c[r[v[0]][0]]||(c[r[v[0]][0]]={}),c[r[v[0]][0]][f]=g):c.1a[v[0]]=v[1])}if(c.2K&&!e.4w(c.2K))2e(1d y in c.2K)if(u.1a("ls-5o-"+y)){1d b=u.1a("ls-5o-"+y).4m().1K(";"),S={};2e(1d w in c.2K[y])S[w.4m()]=w;2e(1d x=0;x<b.1t;x++){1d T,C=b[x].1K(":");C[0]=e.3N(C[0]),""!==C[0]&&(T=o.1N.2T.5h(e.3N(C[1])),-1===C[0].1i("1O")&&-1===C[0].1i("47")||(T/=3y),S[C[0]]?c.2K[y][S[C[0]]]=T:c.2K[y][C[0]]=T)}}2L 2p c.2K[y];if(u.3S("a.ls-4W").1t&&(c.1a.$4W=u.3S("a.ls-4W").3j().1e({7d:5}).1J("1a-ls-1R-4W",a+1).2i(o.1c.$6c),o.1k.21.d9(c.1a.$4W)),c.1a.$2x=u.3S(\'[1a-ls*="aA"]\').3j(),c.1a.$2x.1t&&(2u!==c.1a.$2x.1J("1a-ls").1K("aA")[1].1K(";")[0].4i(/(av|1U|on|1)/i)?(c.1a.$2x.2a("ls-bg-4v").1e({1f:"2E",1g:"2E"}).3S("4v, 87, 4a").1e({1f:"1q%",1g:"1q%"}),c.1a.$2x.9b(e(\'<1C 2r="ls-bg-4v-8Z"></1C>\'))):c.1a.$2x=!1),u.1D("> .ls-bg").1t&&(c.1a.$2h=u.1D("> .ls-bg").3j()),!c.1a.2A)u.1D("> .ls-hS").1t?d=u.1D("> .ls-hS").3j():u.1D("> .ls-bg").1t&&(d=u.1D("> .ls-bg").3j()),d?(c.1a.2A=o.1N.cf(d),c.1a.de=o.1N.fS(d)):c.1a.2A=o.o.8y+o.o.4j+"/lW.df";(c.1a.7t||c.1a.7u)&&"6L"==2t cd&&(2p c.1a.7t,2p c.1a.7u,o.2b&&o.1H.1z("2I","3z.hz",a+1)),"4J"===p.52&&(c.1a.52="4J"),c.1a.3e||(c.1a.3e=""===u[0].1X.3e?"59":u[0].1X.3e),o.1h[++a]={},o.1h[a].1a=e.4V(!0,{},o.1p.1R.3V.1a,c.1a),o.1h[a].1F=c.1F,o.1h[a].2y=c.2y,o.1h[a].1u=c.1u,o.1h[a].1L=a,o.1h[a].$1k=e(),o.1h[a].2K=c.2K,o.1c.4E.51(c.1a.2A),o.1k.1m(u,a)}o.2b&&o.1H.9g("3z.1X")},21:{iR:19(){1d e=o.1h;e.2H.1L=e.2z.1L,e.2z.1L=e.1P.1L,e.1P.1L=o.1w.2S.a5(o.1w.2F),e.21.dj(),o.1c.21.6l()},g7:19(e){1d t=o.1h;t.1P.1L=e,t.21.dj()},dj:19(){1d t=o.1h;t.2H=-1!==t.2H.1L?e.4V(!0,{},t[t.2H.1L]):{},t.2z=-1!==t.2z.1L?e.4V(!0,{},t[t.2z.1L]):{},t.1P=-1!==t.1P.1L?e.4V(!0,{},t[t.1P.1L]):{}},4d:19(){1d t=o.1h;if(t.3j.1L="2J"===o.o.4d?o.o.4d:1A.46(o.1N.2T.5h(o.o.4d,!0),1),o.o.8e&&o.1h.3r>2?o.o.aV=!1:o.o.8e=!1,t.3j.1L="2J"==t.3j.1L?1A.3J(1A.2J()*o.1h.3r+1):t.3j.1L,2D.6Y.9w)2e(1d i=1;i<t.3r+1;i++)t[i].1a.4H==2D.6Y.9w.1K("#")[1]&&(t.3j.1L=i);t.3j.1L=t.3j.1L<1||t.3j.1L>o.1h.3r?1:t.3j.1L,o.o.8e&&"2J"!=o.o.4d&&(t.3j.1L=o.o.4d),t.3j.1a=e.4V(!0,{},t[t.3j.1L].1a),o.o.5g&&o.1w.21.gt(),o.2b&&o.1H.3V.4d&&(t.3j.1L=o.1H.3V.4d)}},2S:{4H:19(e){1T e&&o.1h[e]&&o.1h[e].1a&&o.1h[e].1a.4H?o.1h[e].1a.4H:2u}},1R:[]},o.1k={$5C:e(),65:19(e,t){1T-1!=e.1i("%")?2P(e)*t:2P(e)},1m:19(i,s){if(!2D.3I.86(t))1T!1;2e(1d a,r=i.1D(\'.ls-bg, .ls-l, .ls-2V, *[2r^="ls-s"]\'),n=0,l=r.1t;n<l;n++){1d d=e(r[n]),u=d[0],p=d.3S();if(-1!=d.1J("2r").1i("ls-s")){1d c=d.1J("2r").1K("ls-s")[1].1K(" ")[0];d.3W("ls-s"+c).2a("ls-2V")}2L if(d.4y("ls-l"))d.3W("ls-l").2a("ls-2V");2L if(!d.is(".ls-bg, .ls-2V")){d.6a();rN}d.is("a")&&1===p.1t&&((u=(d=d.3S().3j())[0]).rP("1a-ls",u.gU.ag("1a-ls")),u.gU.kZ("1a-ls"),d.4c().3W("ls-2V"),d.2a("ls-2V")),d.1a(o.1p.1m.1V,4p o.1p.2V.3V(d,s)),-1!==d.1J("2r").1i("ls-dm-")&&18.21.ht(d),d.4c().is("a")?(a=d.4c(),18.21.d9(a)):a=d,o.1h[s].$1k=o.1h[s].$1k.1z(a)}},21:{d9:19(t){1d i=t.1J("4P"),s=t.1J("5t"),n="";if(s&&-1!==s.1i("ls-2j")){2M(i){1j"hv":n="aj 2n 9G 29";1y;1j"hy":n="aj 2n 9G 1Z";1y;1j"dp":n="aj 2n 4z 29 of 4z 1c";1y;1j"":1j"dq":n="aj 2n 4z 1Z of 4z 1c";1y;5H:n="aj 2n a hE 6Y on 4z 9G"}o.1k.21.dr(t,n),t.on("5m."+a,19(t){t.41();1d s,a=2D.3I.nw-o.1n.55;if(i)2M(i){1j"hv":s=0;1y;1j"hy":s=o.1n.ib-o.1n.55;1y;1j"dp":s=o.1c.4A;1y;1j"":1j"dq":s=o.1c.4A+o.1c.1g;1y;5H:s=e(i).3j().1t?e(i).cy().5Y().29:o.1c.4A+o.1c.1g}s+=o.o.ak,s=1A.a8(s,a),s=1A.46(0,s),r.3g.2n("5j, 3I",1,{cc:s,2s:r.kD.cb})})}if(-1!==o.1p.1m.57.1i(i)||i.4i(/^\\#[0-9]/)){1d l=e.3N(i.4m().1K("#")[1]),d=1l(l);2M(l){1j"2H":n="8o 2n 4z iO 1R";1y;1j"1P":n="8o 2n 4z 1P 1R";1y;1j"3k":n="3k 1w";1y;1j"1Y":n="1Y 1w";1y;1j"6m":n="6m 1R";1y;1j"3h":n="3h 1R";1y;1j"3h-6m":n="3h, l4 6m 1R";1y;5H:"4t"==2t d&&d==d&&(n="8o 2n 1R "+d)}o.1k.21.dr(t,n),t.on("5m."+a,19(e){if(e.41(),-1!==["2H","1P","3k","1Y"].1i(l))o.2m[l]("lb");2L if("4t"==2t d&&d==d)o.1w.6S(d,!0,!0);2L if(!o.1c.2v.8K)2M(l){1j"6m":o.2C.9m("6m");1y;1j"3h":o.2C.9m("3h");1y;1j"3h-6m":o.2C.9m("3h",!0)}})}},dr:19(e,t){e.1J("7y-7A")||e.1J("7y-7A",t)},ht:19(t){2e(1d s=t.1J("2r").1K(" "),r=1,n=0;n<s.1t;n++)-1!=s[n].1i("ls-dm-")&&(r=1l(s[n].1K("ls-dm-")[1]));t.1a(o.1p.1m.1V).31.iQ=r,t.1e({3u:"m1"}).on("5m."+a,19(t){t.41(),i.53(e(18).1a(o.1p.1m.1V).31.iQ)})},3f:19(e,t,i){t.is.5N||t.is.2x?(t.24.$8F=e.3O(".ls-bg-5A"),t.24.$bV=e.3O(".ls-bg-dt")):(t.24.$1Q=e.3O(".ls-in-1M"),t.24.$1Q.1a(o.1p.1m.1V,{}),t.31.du=t.24.$1Q.1a(o.1p.1m.1V),t.24.$8C=e.3O(".ls-2g"),t.24.$8C.1a(o.1p.1m.1V,{}),t.31.mQ=t.24.$8C.1a(o.1p.1m.1V),t.24.$7N=e.3O(".ls-1B"),t.24.$7N.1a(o.1p.1m.1V,{}),t.31.nl=t.24.$7N.1a(o.1p.1m.1V)),t.1F.1U&&(t.24.$8k=e.3O(".ls-1F"),t.24.$8k.1a(o.1p.1m.1V,{1F:{}}),t.31.jQ=t.24.$8k.1a(o.1p.1m.1V),o.1b.1k.1F.jT(t.24.$8k,t.31.jQ.1F,t,i)),t.1r.1U&&!o.1h[i].1a.6d&&o.1b.1k.1r.21(e,t),o.7l.9P?t.24.$7G=e.3O(".ls-z"):t.24.$7G=t.1F.1U?t.24.$8k:t.24.$8F?t.24.$bV:t.24.$1Q,t.24.$7G.1J("1a-1R-1L",i)},1X:19(e){1d t,i,s,a,r,n,l,d,u,p,c,h,m,f,g,v,y,b,S,w,x,T,C=e[0],k=e.1a(o.1p.1m.1V),I=C.1X,O=o.1k,L=0,$=0,B=!1,P=C.oN();if(d=""!==I.7m?O.65(I.7m,o.1c.49.8z):2P(e.1e("4u-1S")),p=""!==I.7i?O.65(I.7i,o.1c.49.8z):2P(e.1e("4u-3T")),u=""!==I.7h?O.65(I.7h,o.1c.49.8D):2P(e.1e("4u-29")),c=""!==I.7e?O.65(I.7e,o.1c.49.8D):2P(e.1e("4u-1Z")),h=""!==I.3U?O.65(I.3U,o.1c.49.8z):2P(e.1e("7c-1S")),m=""!==I.5E?O.65(I.5E,o.1c.49.8D):2P(e.1e("7c-29")),C.1X.7c="0",g=""!==I.7a?2P(I.7a):2P(e.1e("79-1S-1f")),y=""!==I.77?2P(I.77):2P(e.1e("79-3T-1f")),v=""!==I.76?2P(I.76):2P(e.1e("79-29-1f")),b=""!==I.74?2P(I.74):2P(e.1e("79-1Z-1f")),1===o.1W.$7z.1u(e).1t||e.3S("4a").1t){1d W=e.3S(),3p=W.1J("1f")?W.1J("1f"):W.1f(),M=W.1J("1g")?W.1J("1g"):W.1g();5e===1l(3p)&&b7===1l(M)&&(3p=rI,M=rJ),""!==C.1X.1f&&"2E"!==C.1X.1f||e.1e("1f",3p),""!==C.1X.1g&&"2E"!==C.1X.1g||e.1e("1g",M),"1q%"===I.1f&&"1q%"===I.1g&&(I.1S="50%",I.29="50%",k.2Q.6F=!0),B=3p/M,W.1e({1f:"1q%",1g:"1q%"})}1d z=k.6l;e.is("3L")&&(S=(a=e.1a("fO"))/(r=e.1a("fP")),(!I.1f&&!I.1g||"2E"===I.1f&&"2E"===I.1g)&&z&&(z.1f&&z.1g?(-1===z.1f.1i("%")?i=1l(z.1f):(L=1l(z.1f),i=O.65(z.1f,o.1c.49.8z)),-1===z.1g.1i("%")?s=1l(z.1g):($=1l(z.1g),s=O.65(z.1g,o.1c.49.8D))):z.4B&&(e[0].1X.1f=z.4B+"px",i=z.4B,s=e.1g()))),x=P.1f?P.1f:P.3T-P.1S,T=P.1g?P.1g:P.1Z-P.29,i||(i=I.1f,-1!==I.1f.1i("%")&&(L=1l(I.1f)),i=(i=""!==i&&"2E"!==i?O.65(i,o.1c.49.8z):x-d-p-g-y)||"2E"),s||(s=I.1g,-1!==I.1g.1i("%")&&($=1l(I.1g)),s=(s=""!==s&&"2E"!==s?O.65(s,o.1c.49.8D):T-u-c-v-b)||"2E"),w=B||i/s,!e.is("3L")||I.1f||I.1g||z&&(!z||z.1f||z.1g)||a===i&&r===s||(a!==i?s=(i=a>5?a:i)/(w=a>5?S:w):r!==s&&(i=(s=r>5?r:s)*(w=r>5?r:w))),2P(e.1e("2Z")),n=g+d+i+p+y,l=v+u+s+c+b,t=""!==I.2g&&I.2g,I.2g="",f=I.rS||I.1u;1d F=19(e){1d t=e;1T e&&-1!==e.1i("px ")&&(e=e.2k("px","").1K(" "),t=1A.6C(1l(e[0])/i*1q)+"%"),t};k.3b={2g:t,63:!1,1S:I.1S?I.1S:"0",29:I.29?I.29:"0",1f:1A.6R(i),1g:1A.6R(s),8O:L,8Q:$,4R:n,4T:l,k4:I.1f,k5:I.1g,1I:w,7m:d,7h:u,7i:p,7e:c,3U:h,5E:m,7a:g,76:v,77:y,74:b,3P:F(e.1e("k8"))+" "+F(e.1e("k9"))+" "+F(e.1e("ka"))+" "+F(e.1e("kb")),6A:2P(e.1e("ke-kh")),cH:e.1e("fQ-1g"),cG:e.1e("kq-kr"),3Z:e.1e("3Z"),7d:1l(e.1e("z-1L"))||"2E",1u:f,3e:e.1e("2h-3Z"),kt:e.1J("1a-ls")||"",dx:e.1J("1X")||""},I.7d="2E",k.26={1S:I.1S?I.1S:"0",29:I.29?I.29:"0",1f:i,1g:s}},5h:19(t,i,s){1d a=t.1a(o.1p.1m.1V);t.1a("ls");if(a.is.9t=!t.is("3L")&&!a.is.9T,a.5a=t,t.1a("ls"))2e(1d n=o.1p.2V.8H,l=t.1a("ls").1K(";"),d=t.1a("ls").4m().1K(";"),u=0;u<d.1t;u++)if(e.3N(d[u])){1d p=d[u].1i(":"),c=[d[u].8S(0,p),d[u].8S(p+1)],h=2u,m=2u,f=2u,g=2u,v=2u;if(""!==(h=e.3N(c[0])))if(2q 0!==n[h=h.2k("1K","4X")]){if(m=n[h][0],v="8Z"===h?e.3N(l[u].8S(p+1)):o.1N.2T.5h(e.3N(c[1])),c[1]&&-1!==c[1].1i("2J")&&(h.4i(/(4X)/)||(v=o.1N.2T.dy(v,m)),a.4Y.8u||(a.4Y.8u=!0)),"4t"==2t v&&m.4i(/(1O|fU|fX|47)/i)&&(v/=3y),h.4i(/(fZ)(.+)/))2M(v){1j!0:v=0;1y;1j!1:v=1}2q 0!==(g=n[h][1])?""!==v?"5S"==2t v?h.4i(/(4X)/)?g.4i(/(kJ)/i)?a[g][m]=v:a[g].6r[m]=v:(f=o.1N.2T.5h(e.3N(v[0])),o.2b&&o.1H.1z("2I","8b.kL",[h,v,f]),"4t"==2t f&&m.4i(/(1O|fU|fX|47)/i)&&(f/=3y),a[g][m]=f):h.4i(/(4X)/)&&-1!==v.eT().1i("2J")?a[g].2J[m]=v:a[g][m]=v:o.2b&&o.1H.1z("2I","8b.kM",h):a[m][h]=v}2L"2g"===h?(a.3b.2g=c[1],a.3b.63=!0):o.2b&&o.1H.1z("2I","8b.kN",h)}if(o.7l.g5&&(a.in.1U=!0,a.28.1U=!1,a.2B.1U=!1,a.28.22=2u,a.2B.22=2u),a.in.1U&&(a.ao.2s=a.dd.2s=a.dc.2s=o.1N.2T.4S(a.in.2s)),2q 0!==a.68.3P&&(a.ar.3P=a.3b.3P),2q 0!==a.6f.3P&&(a.az.3P=a.3b.3P),a.9l.3e&&(a.cg.3e=a.3b.3e),a.9f.3e&&(a.cn.3e=a.3b.3e),a.9l.3Z&&(a.cg.3Z=a.3b.3Z),a.9f.3Z&&(a.cn.3Z=a.3b.3Z),2q 0!==a.68.1f&&(a.ar.1f=a.3b.1f),2q 0!==a.6f.1f&&(a.az.1f=a.3b.1f),2q 0!==a.68.1g&&(a.ar.1g=a.3b.1g),2q 0!==a.6f.1g&&(a.az.1g=a.3b.1g),2q 0!==a.1M.bz&&0!==a.1M.bz&&(a.1M.2W="7o + "+a.1M.bz),-1!==a.1M.2W.1i("a6")&&"a6"!==a.1M.2W&&(a.1M.2W="a6"),a.1M.1U&&(a.ax.2s=a.cp.2s=a.cq.2s=o.1N.2T.4S(a.1M.2s)),e.7D(a.1B.3r)&&(a.1B.3r>0||-1===a.1B.3r)&&!1!==a.1B.1U?(a.1B.1U=!0,a.cx.2s=a.es.2s=o.1N.2T.4S(a.1B.2s),-1!==a.1B.3r?a.1B.8M?a.1B.64=2*a.1B.3r-1:a.1B.64=a.1B.3r-1:a.1B.64=-1):a.1B.1U=!1,(!e.4w(a.4l)||a.4G.x||a.4G.y||a.4G.3P||a.4G.1u)&&!1!==a.1r.1U?(a.1r.1U=!0,a.1r.6I||(a.1r.6I=a.1r.5O),a.1r.5O=o.1N.2T.4S(a.1r.5O),a.1r.6I=o.1N.2T.4S(a.1r.6I,!0),a.1r.b4||(a.1r.b4=a.1r.7f),r.3g.21(t[0],{2o:!1,1e:{2w:a.4G.2w}})):a.1r.1U=!1,a.1F.6h&&e.7D(a.1F.6h)&&0!==a.1F.6h&&!1!==a.1F.1U?a.1F.1U=!0:a.1F.1U=!1,a.is.5N){1d y={2U:1,2f:0};if(o.1h[i].2y.6E&&(a.2y=o.1h[i].2y),a.2y.6E){2M(a.2y.3C={},a.2y.2n={},a.2y.6E){1j"1M":a.2y.3C.2U=a.2y.2U||1,a.2y.3C.2f=a.2y.2f||0,a.2y.2n=y;1y;1j"in":a.2y.3C=y,a.2y.2n.2U=a.2y.2U||1,a.2y.2n.2f=a.2y.2f||0}2p a.2y.2U,2p a.2y.2f}2L a.2y.3C=y,a.2y.2n=y;e.4w(o.1h[i].1u)||(o.1h[i].1u.3C&&(a.1u.3m.c0=o.1b.1k.4Q.2T(o.1h[i].1u.3C)),o.1h[i].1u.2n&&(a.1u.3m.c1=o.1b.1k.4Q.2T(o.1h[i].1u.2n)))}if(a.28.22&&-1===o.1p.2V.dv.1i(a.28.22)&&(o.2b&&o.1H.1z("2I","8b.kS",[t[0].dk,a.28.22]),2p a.28.22,2p a.28.ns,a.28.1U=!1),a.2B.22&&-1===o.1p.2V.dv.1i(a.2B.22)&&(o.2b&&o.1H.1z("2I","8b.kV",[t[0].dk,a.2B.22]),2p a.2B.22,2p a.2B.ns,a.2B.1U=!1),a.28.22||a.2B.22){1d b=0;if(a.is.9t?(a.28.22&&(a.28.1U=!0,a.9z.2s=o.1N.2T.4S(a.9z.2s),a.28.1K=a.28.22.1K("3p")[0],t.3S().1t&&o.2b&&(b=1)),a.2B.22&&(a.2B.1U=!0,a.3w.2s=o.1N.2T.4S(a.3w.2s)),a.2B.1U&&a.2B.22.1K("3p")[0]!==a.28.1K&&(a.28.1K+=", "+a.2B.22.1K("3p")[0],t.3S().1t&&o.2b&&(b=1)),-1!==a.28.1K.1i("kW")&&-1===a.28.1K.1i("dz")&&(a.28.1K+=", dz"),-1!==a.28.1K.1i("dz")&&-1===a.28.1K.1i("gb")&&(a.28.1K+=", gb")):(2p a.28.22,2p a.2B.22,2p a.28.ns,2p a.2B.ns,o.2b&&(b=2)),o.2b&&0!==b&&i&&!s)2M(b){1j 1:o.1H.1z("2I","8b.l5",[t.8T("gc"),i]);1y;1j 2:o.1H.1z("2I","8b.l8",[i,t.8T("gc")])}}if((a.3b.2g||a.am.2g||a.7r.2g||a.aH.2g)&&(a.2g.1U=!0),a.in.1U&&a.58.2U&&(2p a.58.4s,2p a.58.4O),a.1M.1U&&a.4h.2U&&(2p a.4h.4s,2p a.4h.4O),a.68.1u&&(a.1u.3m.in=o.1b.1k.4Q.2T(a.68.1u)),a.1u.3m.1X=o.1b.1k.4Q.2T(a.3b.1u),a.6f.1u&&(a.1u.3m.1M=o.1b.1k.4Q.2T(a.6f.1u)),a.6y.1u&&(a.1u.3m.1B=o.1b.1k.4Q.2T(a.6y.1u)),a.4G.1u&&(a.1u.3m.1r=o.1b.1k.4Q.2T(a.4G.1u)),a.in.1U||(a.in.1O=0),a.28.1U||(a.28.1O=0),a.1B.1U||(a.1B.1O=0),a.2B.1U||(a.2B.1O=0),a.1M.1U||(a.1M.1O=0),t.1J("1a-ls-l9",i),2q 0!==a.31.3A&&"3q"!==a.31.3A){1d S=1l(a.31.3A);0!==S&&"la"!==a.31.3A?(t.1J("1a-ls-ge",S),a.31.9y=S):a.31.9y=0,a.is.3A=!0,t.1J("1a-ls-3A","1")}2L t.1J("1a-ls-ge",i);if(a.is.9T){1d w=t.3S("4v, 87").eq(0);if(2u!==a.2Q.57)2M(a.2Q.57){1j!0:w.8T("57",!0),w.ld("gf").7w("gf");1y;1j!1:w.8T("57",!1)}a.2Q.4C&&(a.2Q.4C<0?a.2Q.4C=0:a.2Q.4C>1q&&(a.2Q.4C=1q)),a.is.2x&&(o.1W.aD(a,t),a.4g.8Z&&t.1D(".ls-bg-4v-8Z").1e({gh:"6v("+a.4g.8Z+")"}))}a.4g.84&&(a.4g.84=2P(a.4g.84)),a.4g.88&&(a.4g.88=2P(a.4g.88))}},2S:19(e){1d t=18.$5C;if(e){1d i="in",s="",a="",r=\':5n(".ls-bg")\',n=\':5n(".ls-bg-4v")\';-1==(e=e.4m()).1i("co")&&-1==e.1i("aA")||(n="",e=e.2k("co","").2k("aA","")),-1!=e.1i("4v")&&(a+=", > 4v",e=e.2k("4v","")),-1!=e.1i("87")&&(a+=", > 87",e=e.2k("87","")),-1!=e.1i("5I")&&(a+=", > 4v, > 87",e=e.2k("5I","")),-1!=e.1i("3H")&&(a+=\', > 4a[23*="3H-cj.5d"], > 4a[23*="3H.5d"], > 4a[23*="ci.be"], > 4a[1a-23*="3H-cj.5d"], > 4a[1a-23*="3H.5d"], > 4a[1a-23*="ci.be"]\',e=e.2k("3H","")),-1!=e.1i("42")&&(a+=\', > 4a[23*="3D.42"], > 4a[1a-23*="3D.42"]\',e=e.2k("42","")),","==a.gl(0)&&(a=a.8S(2,a.1t)),-1!=e.1i("1M")&&(i="1M"),-1==e.1i("3L")&&-1==e.1i("5c")||(s="3L"),-1==e.1i("bg")&&-1==e.1i("2h")&&-1==e.1i("c8")||(r=""),t=-1!=e.1i("2z")?t.1u(s+"[1a-ls-1R"+i+\'="\'+o.1h.2z.1L+\'"]\'+r+n):-1!=e.1i("1P")?t.1u(s+"[1a-ls-1R"+i+\'="\'+o.1h.1P.1L+\'"]\'+r+n):t.1u(s+r+n),-1!=e.1i("aB")&&(t=t.1u(".ls-bg, .ls-bg-4v, :4I"),e=e.2k("aB","")),-1!=e.1i("3o")&&(t=t.1u(":4J:5n(.ls-bg, .ls-bg-4v)"),e=e.2k("3o","")),-1!=e.1i("c3")&&(t=t.1u(\':5n([1a-ls-3A="1"])\'),e=e.2k("c3","")),-1!=e.1i("3A")&&(t=t.1u(\'[1a-ls-3A="1"]\'),e=e.2k("3A","")),-1!=e.1i("c8")&&(t=t.1u(".ls-bg"),e=e.2k("c8","")),""!==a&&(t=t.1D(a))}1T t},8u:{1a:19(t,i,s){1d a,r,n;2M(t gn 5D||(t=e(t)),s&&t.1J("1a-ls",s).1a("ls",s),a=(r=t.1a(o.1p.1m.1V)).is.d2,n=r.3b,i){5H:1j"1b":r.31.7Q=!1,o.1k.21.5h(t,a,!0);1y;1j"5C":t.1a(o.1p.1m.1V,4p o.1p.2V.3V(t,a)),(r=t.1a(o.1p.1m.1V)).3b=n,o.1k.21.5h(t,a,!0),o.1k.21.3f(t,r,a)}}},5A:19(t,s){if(!o.1h[t].93&&"gp"!==o.1h[t].93){o.1h[t].93="gp";1d a=s?25:0,r=o.1h[t].$1k,n=r.1t;r.3c(19(s,r){o.2N["1R-"+t+"-2V-"+s]=5B(19(){2p o.2N["1R-"+t+"-2V-"+s];1d a,l=e(r),d=l,u="",p=!1,c="";l.4y("ls-3Y-6p")&&(c+=" ls-3Y-on-6p"),l.4y("ls-3Y-6o")&&(c+=" ls-3Y-on-6o"),l.4y("ls-3Y-bR")&&(c+=" ls-3Y-on-bR"),l.3W("ls-3Y-6p ls-3Y-6o ls-3Y-bR"),d.is("a")&&1===d.3S().1t&&(p=!0,l=d.1D(".ls-2V"));1d h=l.1a(o.1p.1m.1V);if(!h)1T!0;if(a=o.1c.$6c,h.is.2x?a=o.1c.$gr:h.is.5N&&(a=o.1c.$bQ),o.1k.21.1X(l),o.1k.21.5h(l,t),h.28.1K){1d m=4p lZ(l[0],{1K:h.28.1K});h.28.22&&(h.28.ns=m[h.28.22.1K("3p")[0]]),h.2B.22&&(h.2B.ns=m[h.2B.22.1K("3p")[0]])}h.is.5N||h.is.2x?u=\'<1C 2r="ls-1Q ls-bg-dt"><1C 2r="ls-1Q ls-bg-5A"></1C></1C>\':(h.2g.1U&&(u=\'<1C 2r="ls-1Q ls-2g"></1C>\'),h.1B.1U&&(u=\'<1C 2r="ls-1Q ls-1B">\'+u+"</1C>"),u=\'<1C 2r="ls-1Q ls-in-1M">\'+u+"</1C>"),h.1F.1U&&(u=\'<1C 2r="ls-1Q ls-1F">\'+u+"</1C>"),o.7l.9P&&(u=\'<1C 2r="ls-1Q ls-z">\'+u+"</1C>"),""!==u?l.2i(a).5A(u):l.2i(a),!0===p&&d.2a("ls-2V-4W").2i(l.4c());1d f={},g=l.1e("dA-dB-dC");g&&"5b"!==g&&(f["dA-dB-dC"]=g,l.1e("dA-dB-dC","5b")),h.3b.bP=1;1d v=1l(h.3b.7d);h.is.2x?f={7d:h.3b.bP}:h.is.5N?f={7d:h.3b.bP}:(v||(v=s+m4),f.7d=v,h.3b.bP=v),o.7l.9P&&(f.3F="gv("+m7*v+"px )"),o.1k.21.3f(l,h,t),h.24.$7G.1e(f).2a(c),h.is.5N&&h.24.$8F.1e({3e:o.1h[t].1a.3e}),o.1k.$5C=o.1k.$5C.1z(l),o.1h[t].$1k=o.1h[t].$1k.5n(d),s===n-1&&(i.3S(".ls-1R").eq(t-1).bM(),o.1h[t].93=!0)},a*(s+1))})}}},o.1w={2F:"1P",ma:0,97:!0,3R:{5b:[],bF:[]},2v:{73:!0,4r:!1,98:!1,as:!1,aq:!1},4Y:{6j:!1,3k:!1,1Y:!1},5f:19(){1T 18.2v.4r||18.2v.98||18.2v.as},1m:19(){1==o.1h.3r&&(o.o.9h=!1,o.o.eC=!1,o.o.au=!1,o.o.bS=!1,o.o.5L=-1,o.o.gx=!1,o.o.al=!0,o.o.4d=1,o.o.6u="br"),o.o.9h&&1!=o.1h.3r||o.1N.2Y(18,{73:!1,4r:!0}),18.21.5K(),18.21.gz()},21:{5K:19(){o.o.5K=!0===o.o.5K?o.1p.1m.3V.5K:o.o.5K,!1!==o.o.5K&&i.on("66."+a,19(){o.1c.2v.6N||(o.1N.2Y(o.1w,{as:!0}),"eF"!==o.o.5K&&o.1b.1k.1s.5G())}).on("5y."+a,19(){1d t=1;o.1b.1G&&o.1b.1G.1O()>o.1b.1k.1s.4o&&(t=o.1b.1k.1s.4o/o.1b.1G.1O()),o.1N.2Y(o.1w,{as:!1}),e("3I").4y("ls-ai")||"eF"===o.o.5K||o.o.9Z&&o.1w.5f()||o.1b.1k.1s.8p(),o.1b.1G&&o.1b.1k.1s.2v.7H&&o.1b.1G.3v()<t&&o.1N.2Y(o.1b.1k.1s,{7H:!1}),o.1w.3k()})},gz:19(){2e(1d t=0;t<o.1h.3r;t++)o.1w.3R.5b[t]=t+1;o.1w.3R.bF=o.1N.dE(e.mI([],o.1w.3R.5b))},gt:19(){1d e=o.o.8e?"bF":"5b",t=o.1w.3R[e],i=o.1w.3R[e].1t,s=t.1i(o.1h.3j.1L);o.1w.3R.9i=[];2e(1d a=s;a<i;a++)o.1w.3R.9i.51(t[a]);2e(1d r=0;r<s;r++)o.1w.3R.9i.51(t[r])},ac:19(e){2M(e){1j"2H":o.o.aV&&(o.1w.2F="2H"),o.1w.6S(o.1w.2S.a5("2H"),!0);1y;1j"1P":o.1w.2F="1P",o.1w.6S(o.1w.2S.a5("1P"),!0)}}},2S:{3R:19(){1d e="5b";1T o.o.5g?e="9i":o.o.8e&&(e="bF"),e},a5:19(e){1d t=o.1w.3R[18.3R()],i=t.1i(o.1h.2z.1L);2M(e){1j"2H":1T 0===i?t[t.1t-1]:t[i-1];1j"1P":1T i===t.1t-1?t[0]:t[i+1];5H:1T t[e]}},dF:19(e){1T o.1w.3R[18.3R()].1i(e)}},5L:{21:19(){o.o.5L>0&&(o.1w.b9=1,o.1w.dG=o.1w.2S.dF(o.1h.3j.1L))},7n:19(e){if(o.1w.2S.dF(e)===o.1w.dG)1T++o.1w.b9===o.o.5L+1}},3k:19(e){!18.5f()&&o.1b.1G&&o.1b.1k.1s.2v.7H&&18.6S(o.1h.1P.1L)},1Y:19(){o.1N.2Y(18,{73:!1,4r:!0})},6S:19(s,a,r){if(!2D.3I.86(t))1T!1;if(o.1h.2z.1L===s)1T!1;if(!18.97&&o.2C.4b("gT")){1d n=i.4f("gT",o.2C.4M());if(!1===n)1T;e.7D(n)&&(s=1l(n))}s>o.1h.3r||s<1?o.2b&&(o.1H.1z("81","1w"),o.1H.1z("2I","1w.mT",[s,o.1h.3r]),o.1H.9g()):o.1c.8d()||o.1w.2v.98&&!a?!o.1c.2v.a0&&o.1c.2v.89&&o.1b.3G&&(o.1w.4Y.6j=!0,o.1b.3G.3v(1),o.1b.5k&&o.1b.5k.3v(1)):(o.1N.2Y(o.1b.1k.1s,{7H:!1}),o.1w.4Y.6j=!1,o.2b&&o.1H.1z("81","1w"),a?("2H"===o.2m.2F&&o.o.aV&&(o.1w.2F="2H"),o.2b&&(o.1H.1z("5z","1w.n4",!1),o.o.aV&&o.1H.1z("5z","1w.n5",o.1w.2F))):o.2m.2F=o.1w.2F,o.1b.2l.3h(),o.1W.1Y(!0),o.1h.21.g7(s),o.2b&&(o.1H.1z("5z","1w.6j",[o.1h.2z.1L,o.1h.1P.1L,o.1w.2F,o.2m.2F]),o.1H.9g()),o.1N.2Y(18,{98:!1}),o.1N.2Y(o.1c,{8K:!0}),o.5Z.dH(o.1h.1P.1L,19(){o.1b.3k()}))},nc:19(){o.2m.1Y(),e.3c(o.2N,19(e,t){82(o.2N[e])}),o.1b.2l.1Y(),o.1b.1G.1Y(),o.1N.2Y(o.1b.1k.1s,{9U:!0,73:!1}),i.1D("*").1Y(!0,!1).nk()},gY:19(){i.1D("*").1Y(),o.2m.6j(o.1h.2z.1L,o.1w.2F)}},o.1W={nm:{},$7z:e(),7X:"9S:",9R:0,cI:0,1m:19(){-1!=2D.6Y.4P.1i("8x:")&&(18.7X="8x:"),o.1N.2Y(o.1c,{dI:!1,dJ:!1}),o.1W.3H.1m(),o.1W.42.1m(),o.1W.5I.1m()},3H:{1m:19(){1d t=0;18.$8n=o.1c.$7v.1D(\'4a[23*="3H-cj.5d"], 4a[23*="3H.5d"], 4a[23*="ci.be"], 4a[1a-23*="3H-cj.5d"], 4a[1a-23*="3H.5d"], 4a[1a-23*="ci.be"]\').3c(19(){1d i=e(18),s=i.4c(),a=s.1a(o.1p.1m.1V),r=(i.1J("23")||i.1J("1a-23")).2k(/&hc;/g,"&").2k("54=1","54=0").2k("?","?hd=av&"),n={$9Q:i,9O:(-1===r.1i("9S")?o.1W.7X:"")+r+(-1===r.1i("?")?"?":"&")+"hf=hh&5I=1&nN=1&6D=3&dK=0",hp:o.1W.7X+"//3L.3H.5d/nR/"+r.1K("nS/")[1].1K("?")[0]+"/"+o.o.go};i.1J("id","ls-3H-"+ ++t),a.2R={22:"3H",cB:n},o.1W.cA(a),a.is.2x&&o.1W.aD(a,s),a.is.2x||o.1W.cz(s,i,n.9O,n.hp,a)}),o.1W.$7z=o.1W.$7z.1z(18.$8n.4c()),18.$8n.1t&&(o.2N.dL=1A.3J(cw.cv()/3y),1o.cs||e("<8l>").1J({23:"8x://oa.3H.5d/ob",22:"4X/hu"}).2i("9K"),1o.oj=19(){1o.2G.7K.b2=!0},o.4F.dM=cl(19(){1o.cs&&1===1o.cs.dN||1o.2G.7K.b2||1A.3J(cw.cv()/3y)-o.2N.dL>3?(9H(o.4F.dM),2p o.4F.dM,2p o.2N.dL,o.1W.3H.$8n.4c().3c(19(){1d t=e(18),i=t.1a(o.1p.1m.1V),s=i.2R.cB;t.on("ca."+a+" 5m."+a,".ls-6k",19(){o.1W.c6(e(18)),o.1W.c5(t,i),o.1W.c4(t),o.1W.3H.2X(t,s.$9Q,s.9O,i)}).on("bW."+a,19(){o.1W.3H.2X(t,s.$9Q,s.9O,i)}).on("9J."+a,19(){o.1W.3H.1Y(t,s.$9Q,i,!0)}).on("dP."+a,19(){o.1W.3H.9C(t,s.$9Q,s.9O,i,!0)})}),o.1N.2Y(o.1c,{dI:!1})):o.1N.2Y(o.1c,{dI:!0})},25))},9C:19(e,t,i,s,a){if(2u!==s.2Q.67)2M(i=i.2k("&67=0","").2k("&67=1",""),s.2Q.67){1j!0:i+="&67=1";1y;1j!1:i+="&67=0"}if(2u!==s.2Q.57)2M(i=i.2k("&57=0","").2k("&57=1",""),s.2Q.57){1j!0:i+="&57=1";1y;1j!1:i+="&57=0"}t.1J("23",i),s.2R.3D=4p cs.oU(t[0],{bJ:{oW:19(){2u!==s.2Q.4C&&s.2R.3D.hA(s.2Q.4C),a&&!s.2R.dQ||(s.2R.3D.dR(),s.2R.dQ=!1)},p5:19(t){0===t.1a&&(s.is.2x?s.2R.3D.bG(0):o.1W.bE(e,s))}}})},2X:19(e,t,i,s){s.2R.3D?s.2R.3D.dR?s.2R.3D.dR():s.2R.dQ=!0:18.9C(e,t,i,s)},1Y:19(e,t,i,s){i.2R.3D&&(i.2R.3D.p9(),s&&i.2R.3D.bG(0),i.is.2x||o.1W.bD(e.1D(".ls-6k")))}},42:{1m:19(){1d t=18.$8n=o.1c.$7v.1D(\'4a[23*="3D.42"], 4a[1a-23*="3D.42"]\');if(t.1t){o.2N.dS=1A.3J(cw.cv()/3y),o.1W.$7z=o.1W.$7z.1z(t.4c());1d i=0;e("<8l>").1J({23:o.1W.7X+"//f.pi.5d/js/pj.a8.js",22:"4X/hu"}).2i("9K"),o.4F.dT=cl(19(){o.1N.2Y(o.1c,{dJ:!0}),(1o.pr||1A.3J(cw.cv()/3y)-o.2N.dS>3)&&(9H(o.4F.dT),2p o.4F.dT,2p o.2N.dS,1o.2G.7K.cV=!0,s())},25);1d s=19(){o.1W.42.$8n.3c(19(){1d t=e(18).1J("id","ls-42-"+ ++i),s=t.4c(),r=s.1a(o.1p.1m.1V),n=(t.1J("23")||t.1J("1a-23")).2k(/&hc;/g,"&").2k("54=1","54=0").2k("?","?hd=av&"),l=-1===n.1i("?")?"?":"&",d=-1===n.1i("9S")?o.1W.7X:"",u="hf=hh&2C=1&ps=ls-42-"+i,p=o.1W.7X+"//42.5d/2C/pv/4v/"+n.1K("4v/")[1].1K("?")[0]+".pw?py=?",c=d+n+l+u;r.2R={22:"42",cB:{}},o.1W.cA(r),r.is.2x&&o.1W.aD(r,s),e.pz(p,19(e){r.is.2x||o.1W.cz(s,t,c,e[0].pB,r)}),s.on("ca."+a+" 5m."+a,".ls-6k",19(){o.1W.c6(e(18)),o.1W.c5(s,r),o.1W.c4(s),o.1W.42.2X(s,t,c,r)}).on("bW."+a,19(){o.1W.42.2X(s,t,c,r)}).on("9J."+a,19(){o.1W.42.1Y(s,t,r,!0)}).on("dP."+a,19(){o.1W.42.9C(s,t,c,r,!0)})}),o.1N.2Y(o.1c,{dJ:!1})}}},9C:19(e,t,i,s,a){if(2u!==s.2Q.67)2M(i=i.2k("&9F=0","").2k("&9F=1","").2k("&9A=0","").2k("&9A=1","").2k("&9s=0","").2k("&9s=1",""),s.2Q.67){1j!0:i=i.2k("9F=0","9F=1","").2k("9A=0","9A=1","").2k("9s=0","9s=1","");1y;1j!1:i=i.2k("9F=1","9F=0","").2k("9A=1","9A=0","").2k("9s=1","9s=0","")}t.1J("23",i);1d r=19(){s.is.2x?s.2R.3D.2C("bG",0).2C("2X"):o.1W.bE(e,s)};s.2R.3D=$f(t[0]),s.2R.3D.hM("bx",19(){s.2R.3D.hM("pU",r),2u!==s.2Q.4C&&s.2R.3D.2C("hA",s.2Q.4C/1q),a||s.2R.3D.2C("2X")})},2X:19(e,t,i,s){s.2R.3D?s.2R.3D.2C("2X"):18.9C(e,t,i,s)},1Y:19(e,t,i,s){i.2R.3D&&(i.2R.3D.2C("5G"),s&&i.2R.3D.2C("bG",0),i.is.2x||o.1W.bD(e.1D(".ls-6k")))}},5I:{1m:19(){if(18.$24=o.1c.$7v.1D("4v, 87"),o.1W.$7z=o.1W.$7z.1z(18.$24.4c()),18.$24.1t){1d t=0;o.1W.5I.$24.3c(19(){1d i=e(18).1J("id","ls-5I-"+ ++t),s=e(18).4c(),r=s.1a(o.1p.1m.1V);if(r.2R={22:"5I",cB:{}},o.1W.cA(r),r.is.2x&&o.1W.aD(r,s),i.1J("54")){1d n=i.7w("54").bw(!0,!0);i.6a(),i=n.2i(s),s.1a("ls",s.1a("ls")+" 54: av;")}r.is.2x||o.1W.cz(s,i,!1,!1,r),i.on("pW."+a,19(){r.is.2x?(i[0].hO=0,i[0].2X()):o.1W.bE(s,r)}),s.on("ca."+a+" 5m."+a,".ls-6k",19(t){o.1W.c6(e(18)),o.1W.c5(s,r),o.1W.c4(s),o.1W.5I.2X(s,i,r)}).on("bW."+a,19(){o.1W.5I.2X(s,i,r)}).on("9J."+a,19(){o.1W.5I.1Y(s,i,r,!0)})})}},2X:19(e,t,i){2u===i.2Q.4C||i.2R.hQ||(t[0].4C=i.2Q.4C/1q,i.2R.hQ=!0),t[0].2X()},1Y:19(e,t,i,s){t[0].5G(),s&&(t[0].hO=0),i.is.2x||o.1W.bD(e.1D(".ls-6k"))}},aD:19(t,i){if(t.2Q={57:!1,54:!1,67:!1,cF:"b6",2A:!1,4C:t.2Q.4C?t.2Q.4C:0},i.1a("ls")&&-1!==i.1a("ls").1i("8h:")&&0==i.3S(".ls-6k").1t){1d s=e("<1C>").2a("ls-6k").2i(i),a=i.1a("ls").1K("8h:")[1].1K(";")[0].3N();e("<1C>").2i(s).2a("ls-dU").1J({1X:"2h-5c: 6v("+a+")"})}},cA:19(e){e.is.9T=!0},cz:19(t,i,s,a,r){1d n=e("<1C>").2a("ls-6k").2i(t);2u===r.2Q.54&&o.o.et||r.2Q.54?t.2a("ls-54"):e("<1C>").2i(n).2a("ls-q9"),t.1a("ls")&&-1!==t.1a("ls").1i("8h:")&&(a=t.1a("ls").1K("8h:")[1].1K(";")[0].3N()),i.is("4a")?e("<1C>").2i(n).2a("ls-dU").1J({1X:"2h-5c: 6v("+a+")"}):(a||2q 0===i.1J("8h")||(a=i.1J("8h"),i.7w("8h")),a&&e("<1C>").2i(n).2a("ls-dU").1J({1X:"2h-5c: 6v("+a+")"}))},c5:19(e,t){!t.is.3A&&o.o.al&&(o.1N.2Y(o.1w,{98:!0}),"2E"==o.o.al&&18.9R++)},c6:19(e){e.47(o.1b.1W.1p.47).5M(o.1b.1W.1p.5M)},bD:19(e){e.5s(o.1b.1W.1p.5s)},bE:19(e,t){"2E"!=o.o.al||t.is.2x||(t.is.3A||18.cI++,18.cI==18.9R&&0!==18.9R&&(o.1N.2Y(o.1w,{98:!1}),o.1w.qi=1,o.1w.3k()))},dV:19(e){1d t=e.1a(o.1p.1m.1V);t.is.9T&&(o.1n.6n&&(i.4y("ls-1n-is-6p")&&t.24.$7G.4y("ls-3Y-on-6p")||i.4y("ls-1n-is-6o")&&t.24.$7G.4y("ls-3Y-on-6o"))||(2u===t.2Q.54&&o.o.et||t.2Q.54)&&e.1D(".ls-6k").5p("ca"))},1Y:19(t){1d i=18;t=2q 0===t||t,o.1k.2S("2z,1M,3H").3c(19(){1d s=e(18),a=s.3O(".ls-2V"),r=a.1a(o.1p.1m.1V);i.3H.1Y(a,s,r,t)}),o.1k.2S("2z,1M,42").3c(19(){1d s=e(18),a=s.3O(".ls-2V"),r=a.1a(o.1p.1m.1V);i.42.1Y(a,s,r,t)}),o.1k.2S("2z,1M,5I").3c(19(){1d s=e(18),a=s.3O(".ls-2V"),r=a.1a(o.1p.1m.1V);i.5I.1Y(a,s,r,t)}),18.9R=0,18.cI=0},c4:19(e){o.1b.1G.5V(2u,e.3O(".ls-in-1M")[0])}},o.3i={1m:19(){o.o.3i&&(18.$1v=e("<3L>").2a("ls-qz").2i(i).1J("1X",o.o.g2).1e({6q:"4I",3t:"qB"}).on("4q."+a,19(){1d t=o.3i.$1v?6s:0;o.2N.3i=5B(19(){2p o.2N.3i,o.3i.$1v.1a("aQ",o.3i.$1v.1f()),o.3i.$1v.1a("cP",o.3i.$1v.1g()),"2E"!=o.3i.$1v.1e("1S")&&o.3i.$1v.1a("a7",o.3i.$1v[0].1X.1S),"2E"!=o.3i.$1v.1e("3T")&&o.3i.$1v.1a("ad",o.3i.$1v[0].1X.3T),"2E"!=o.3i.$1v.1e("29")&&o.3i.$1v.1a("af",o.3i.$1v[0].1X.29),"2E"!=o.3i.$1v.1e("1Z")&&o.3i.$1v.1a("ah",o.3i.$1v[0].1X.1Z),!1!==o.o.ei&&e("<a>").2i(i).1J("4P",o.o.ei).1J("5t",o.o.fW).1e({qO:"3q",qQ:"3q"}).9b(o.3i.$1v),o.3i.$1v.1e({3t:"3q",6q:"4J"}),o.3i.1E()},t)}).1J("23",o.o.3i))},1E:19(){18.$1v.1e({1f:18.$1v.1a("aQ")*o.1E.1I,1g:18.$1v.1a("cP")*o.1E.1I}),18.$1v.5s(5e);1d e="2E",t="2E",s="2E",a="2E";e=18.$1v.1a("a7")&&-1!=18.$1v.1a("a7").1i("%")?i.1f()/1q*2P(18.$1v.1a("a7"))-18.$1v.1f()/2+1l(i.1e("4u-1S")):1l(18.$1v.1a("a7"))*o.1E.1I,t=18.$1v.1a("ad")&&-1!=18.$1v.1a("ad").1i("%")?i.1f()/1q*2P(18.$1v.1a("ad"))-18.$1v.1f()/2+1l(i.1e("4u-3T")):1l(18.$1v.1a("ad"))*o.1E.1I,s=18.$1v.1a("af")&&-1!=18.$1v.1a("af").1i("%")?i.1g()/1q*2P(18.$1v.1a("af"))-18.$1v.1g()/2+1l(i.1e("4u-29")):1l(18.$1v.1a("af"))*o.1E.1I,a=18.$1v.1a("ah")&&-1!=18.$1v.1a("ah").1i("%")?i.1g()/1q*2P(18.$1v.1a("ah"))-18.$1v.1g()/2+1l(i.1e("4u-1Z")):1l(18.$1v.1a("ah"))*o.1E.1I,18.$1v.1e({1S:e,3T:t,29:s,1Z:a})}},o.1x={2m:{1m:19(){o.o.eC&&18.ac.1m(),(o.o.au||o.o.bS)&&18.1Z.1m()},ac:{1m:19(){e(\'<a 2r="ls-1x-1v ls-3n-2H" 7y-7A="8o 2n 4z iO 1R" 4P="#" />\').on("5m."+a,19(e){e.41(),i.53("2H")}).2i(i),e(\'<a 2r="ls-1x-1v ls-3n-1P" 7y-7A="8o 2n 4z 1P 1R" 4P="#" />\').on("5m."+a,19(e){e.41(),i.53("1P")}).2i(i),o.o.gF&&18.96()},96:19(){i.1D(".ls-3n-2H, .ls-3n-1P").1e({3t:"3q"}),i.on("66."+a,19(){o.1x.2m.dW||i.1D(".ls-3n-2H, .ls-3n-1P").1Y(!0,!0).5s(5e)}).on("5y."+a,19(){i.1D(".ls-3n-2H, .ls-3n-1P").1Y(!0,!0).5M(5e)})}},1Z:{1m:19(){18.1Q=e(\'<1C 2r="ls-1x-1v ls-1Z-3n-1Q" />\').2i(i),o.o.bS&&"95"!=o.o.6u&&18.cQ.1m(),o.o.au?18.hT():"95"!=o.o.6u&&18.hW(),o.o.bY&&"95"!=o.o.6u&&18.96(),"95"==o.o.6u&&(18.1Q.2a("ls-hX-4E"),18.4E.1m())},cQ:{1m:19(){1d t=18;e(\'<85 2r="ls-1Z-91" />\').2i(i.1D(".ls-1Z-3n-1Q"));2e(1d s=0;s<o.1h.3r;s++){1d r=e(\'<a 4P="#" 7y-7A="8o 2n 1R \'+(s+1)+\'" />\').2i(i.1D(".ls-1Z-91")).1a("1L",s+1).on("5m."+a,19(t){t.41(),i.53(e(18).1a("1L"))});"1r"==o.o.6u&&r.on("66."+a,19(){1d s=e(18);i.1D(".ls-2A-1r-3L").1e({1S:1l(t.83.1e("4u-1S")),29:1l(t.83.1e("4u-29"))}),t.aG.on("4q."+a,19(){0===e(18).1f()?t.aG.1e({6z:"dl",7c:"0 2E",1S:"2E"}):t.aG.1e({6z:"i3",3U:-e(18).1f()/2,1S:"50%"}),t.aG.1e("3t","3q").1Y(!0,!0).5s(8V)}).1J("23",o.1h[s.1a("1L")].1a.2A),t.83.1e({3t:"5J"}).1Y().8j({1S:e(18).6z().1S+(e(18).1f()-t.83.4R())/2},8V),t.dX.1e({3t:"3q",6q:"4J"}).1Y().5s(8V)}).on("5y."+a,19(){t.dX.1Y().5M(8V,19(){t.83.1e({6q:"4I",3t:"5J"})})})}t.21.3o(o.1h.3j.1L),"1r"==o.o.6u&&t.21.1r()},21:{3o:19(e){2q 0===e&&(e=o.1h.2z.1L),e--,i.1D(".ls-1Z-91 a").3W("ls-3n-3o"),i.1D(".ls-1Z-91 a:eq( "+e+" )").2a("ls-3n-3o")},1r:19(){1d t=o.1x.2m.1Z.cQ,s=e(\'<1C 2r="ls-2A-1r"><1C 2r="ls-2A-1r-bA"><1C 2r="ls-2A-1r-bg"></1C><1C 2r="ls-2A-1r-3L"><3L></1C><85></85></1C></1C>\').2i(i.1D(".ls-1Z-91"));i.1D(".ls-2A-1r, .ls-2A-1r-3L").1e({1f:o.o.ew,1g:o.o.9V}),t.83=i.1D(".ls-2A-1r"),t.aG=t.83.1D("3L").1e({1g:o.o.9V}),t.dX=i.1D(".ls-2A-1r-bA").1e({6q:"4I",3t:"5J"}),s.2i(i.1D(".ls-1Z-91"))}}},hT:19(){18.aI=e(\'<a 2r="ls-3n-3k" 7y-7A="3k 1w" 4P="#" />\').on("5m."+a,19(e){e.41(),i.53("3k")}).aF(i.1D(".ls-1Z-3n-1Q")),18.aJ=e(\'<a 2r="ls-3n-1Y" 7y-7A="1Y 1w" 4P="#" />\').on("5m."+a,19(e){e.41(),i.53("1Y")}).2i(i.1D(".ls-1Z-3n-1Q")),o.o.9h?18.aK("3k"):18.aK("1Y")},aK:19(e){if(o.o.au)2M(e){1j"3k":18.aI.2a("ls-3n-3k-3o"),18.aJ.3W("ls-3n-1Y-3o");1y;1j"1Y":18.aI.3W("ls-3n-3k-3o"),18.aJ.2a("ls-3n-1Y-3o")}},hW:19(){e(\'<85 2r="ls-3n-iq ls-3n-rG" />\').aF(i.1D(".ls-1Z-3n-1Q")),e(\'<85 2r="ls-3n-iq ls-3n-rH" />\').2i(i.1D(".ls-1Z-3n-1Q"))},96:19(){1d e=18;e.1Q.1e({3t:"3q"}),i.on("66."+a,19(){o.1x.2m.dW||e.1Q.1Y(!0,!0).5s(5e)}).on("5y."+a,19(){e.1Q.1Y(!0,!0).5M(5e)})},dY:19(e){if(o.o.bY&&!i.4y("ls-1r"))2M(e){1j"on":o.1x.2m.1Z.4E.1Q.1e({6q:"4I",3t:"5J"});1y;1j"6M":o.1x.2m.1Z.4E.1Q.1e({6q:"4J",3t:"3q"})}},4E:{1m:19(){18.1Q=e(\'<1C 2r="ls-1x-1v ls-2A-1Q"></1C>\').2i(i),e(\'<1C 2r="ls-2A"><1C 2r="ls-2A-bA"><1C 2r="ls-2A-1R-4U"><1C 2r="ls-2A-1R"></1C></1C></1C></1C>\').2i(18.1Q),18.$1v=i.1D(".ls-2A-1R-4U"),"bk"in 1o?18.$1v.2a("ls-rO"):18.$1v.on("66."+a,19(){e(18).2a("ls-2A-1R-1r")}).on("5y."+a,19(){e(18).3W("ls-2A-1R-1r"),o.1x.2m.1Z.4E.2j()}).on("7s."+a,19(t){1d i=1l(t.bh-e(18).5Y().1S)/e(18).1f()*(e(18).1f()-e(18).1D(".ls-2A-1R").1f());e(18).1D(".ls-2A-1R").1Y().1e({3U:i})});2e(1d t=0;t<o.1h.3r;t++){1d s=t+1,r=e(\'<a 4P="#" 2r="ls-7L-\'+(t+1)+\'"  7y-7A="8o 2n 1R \'+(t+1)+\'"><3L 23="\'+o.1h[s].1a.2A+\'"></a>\');o.1h[s].1a.de&&r.1D("3L").1J("e0",o.1h[s].1a.de),r.1a("1L",s).on("5m."+a,19(t){t.41(),i.53(e(18).1a("1L"))}).2i(i.1D(".ls-2A-1R")),"bk"in 1o||r.on("66."+a,19(){e(18).3S().1Y().bc(5e,o.o.ev/1q)}).on("5y."+a,19(){e(18).3S().4y("ls-7L-3o")||e(18).3S().1Y().bc(5e,o.o.eu/1q)})}o.1x.2m.1Z.aI&&o.1x.2m.1Z.aJ&&(o.1x.2m.1Z.1Q=e(\'<1C 2r="ls-1Z-3n-1Q ls-rU-4E"></1C>\').2i(i),o.1x.2m.1Z.aI.bw().on("5m."+a,19(e){e.41(),i.53("3k")}).2i(o.1x.2m.1Z.1Q),o.1x.2m.1Z.aJ.bw().on("5m."+a,19(e){e.41(),i.53("1Y")}).2i(o.1x.2m.1Z.1Q)),o.o.bY&&18.96()},96:19(){1d e=18;e.1Q.1e("3t","3q"),o.1x.2m.1Z.1Q&&(o.1x.2m.1Z.1Q="5J"==o.1x.2m.1Z.1Q.1e("3t")?o.1x.2m.1Z.1Q:i.1D(".ls-hX-4E"),o.1x.2m.1Z.1Q.1e("3t","3q")),i.on("66."+a,19(){i.2a("ls-1r"),o.1x.2m.dW||(e.1Q.1Y(!0,!0).5s(5e),o.1x.2m.1Z.1Q&&o.1x.2m.1Z.1Q.1Y(!0,!0).5s(5e))}).on("5y."+a,19(){i.3W("ls-1r"),e.1Q.1Y(!0,!0).5M(5e),o.1x.2m.1Z.1Q&&o.1x.2m.1Z.1Q.1Y(!0,!0).5M(5e)})},6j:19(t){1d s=t||o.1h.1P.1L;i.1D(".ls-2A-1R a:5n(.ls-7L-"+s+" )").3S().3c(19(){e(18).3W("ls-7L-3o").1Y().bc(cY,o.o.eu/1q)}),i.1D(".ls-2A-1R a.ls-7L-"+s).3S().2a("ls-7L-3o").1Y().bc(cY,o.o.ev/1q)},2j:19(){if(!i.1D(".ls-2A-1R-4U").4y("ls-2A-1R-1r")){1d e=!!i.1D(".ls-7L-3o").1t&&i.1D(".ls-7L-3o").4c();if(e){1d t=e.6z().1S+e.1f()/2,s=i.1D(".ls-2A-1R-4U").1f()/2-t;s=(s=s<i.1D(".ls-2A-1R-4U").1f()-i.1D(".ls-2A-1R").1f()?i.1D(".ls-2A-1R-4U").1f()-i.1D(".ls-2A-1R").1f():s)>0?0:s,i.1D(".ls-2A-1R").8j({3U:s},rV)}}},1E:19(){o.1x.2m.1Z.dY("on");1d e=-1==o.1c.49.1f.1i("%")?1l(o.1c.49.aQ):i.1f(),t=i.1D(".ls-2A"),s=-1==o.o.cm.1i("%")?1l(o.o.cm):1l(e/1q*1l(o.o.cm));i.1D(".ls-2A-1R a").1e({1f:1l(o.o.ew*o.1E.1I),1g:1l(o.o.9V*o.1E.1I)}),i.1D(".ls-2A-1R a:cy").1e({7c:0}),i.1D(".ls-2A-1R").1e({1g:1l(o.o.9V*o.1E.1I)}),t.1e({1f:s*1A.3J(1q*o.1E.1I)/1q}),t.1f()>i.1D(".ls-2A-1R").1f()&&t.1e({1f:i.1D(".ls-2A-1R").1f()}),o.1x.2m.1Z.dY("6M")}}}},4j:{4q:19(){i.2a("ls-"+o.o.4j);1d t,s=o.o.8y+o.o.4j+"/4j.1e",r=e("9K").1t?e("9K"):e("3I");e(\'4W[4P="\'+s+\'"]\').1t?(t=e(\'4W[4P="\'+s+\'"]\'),o.1x.4j.6B||(o.1x.4j.6B=!0,o.2N.e1=5B(19(){2p o.2N.e1,o.1c.1m()},b7))):2D.iL?(2D.iL(s),t=e(\'4W[4P="\'+s+\'"]\')):t=e(\'<4W dK="iM" 4P="\'+s+\'" 22="4X/1e" />\').2i(r),t.on("4q."+a,19(){o.1x.4j.6B||(o.1x.4j.6B=!0,o.2N.e2=5B(19(){2p o.2N.e2,o.1c.1m()},b7))}),e(1o).on("4q."+a,19(){o.1x.4j.6B||(o.1x.4j.6B=!0,o.2N.e3=5B(19(){2p o.2N.e3,o.1c.1m()},b7))}),o.2N.e4=5B(19(){o.1x.4j.6B||(o.1x.4j.6B=!0,2p o.2N.e4,o.1c.1m())},3y)}},4n:{1m:19(){18.21(),18.1E()},21:19(){18.$1v=e(\'<1C 2r="ls-1x-1v ls-4n"></1C>\').2i(i),"5J"!=18.$1v.1e("3t")||18.$1v.1D("3L").1t||(18.5W=19(){o.1x.4n.$1v.1e({3t:"3q",6q:"4J"}).5s(6s,19(){o.1x.4n.5W=!1})},18.5c=e("<3L>").1J("23",o.o.8y+o.o.4j+"/4n.df").2i(18.$1v),18.iW="4t"==2t 1l(i.1e("4u-1Z"))?1l(i.1e("4u-1Z")):0)},1E:19(){18.5c&&(18.5c.1g()>0?18.iW>0?18.$1v.1e({1g:18.5c.1g()/2}):18.$1v.1e({1g:18.5c.1g(),5E:-18.5c.1g()/2}):o.2N.iZ=5B(19(){2p o.2N.iZ,o.1x.4n.1E()},50))}},2l:{1m:19(){o.o.gE&&18.4D.61(),o.o.gD&&18.43.61();1d t=!1;(t=o.o.gC?e("<1C>").k7(i):e(\'[1a-2O-2e="\'+i.1J("id")+\'"], [1a-2O-2e="\'+a+\'"]\')).1t&&(t.2a("ls-1x-1v"),18.2O.61(t))},4D:{61:19(){18.$1v=e("<1C>").2a("ls-1x-1v ls-4D-jo").2i(i)}},43:{61:19(){18.$1v=e("<1C>").2a("ls-1x-1v ls-43-jo").2i(i),18.$1v.9b(e(\'<1C 2r="ls-ct-8f"></1C><1C 2r="ls-ct-1S"><1C 2r="ls-ct-3X"><1C 2r="ls-ct-jx"><1C 2r="ls-ct-jz"></1C></1C></1C></1C><1C 2r="ls-ct-3T"><1C 2r="ls-ct-3X"><1C 2r="ls-ct-jx"><1C 2r="ls-ct-jz"></1C></1C></1C></1C>\')),18.$1v.1a("3b",{2Z:18.$1v.1e("2Z")})}},2O:{$5w:[],$1v:[],$e5:[],$7J:[],$cL:[],e6:[],aR:[],7C:[],61:19(t){1d s,r=e(2D),n=18,l=19(e,t){(s=(e.bh?e.bh:o.1n.jL)-n.$1v[t].5Y().1S-n.7C[t]/2)<0&&(s=0),s>n.aR[t]-n.7C[t]&&(s="e7( 1q% - "+o.1x.2l.2O.7C[t]+"px )"),n.$7J[t].1e({1S:s}),o.1b.1G&&o.1b.1G.3v("5l"==2t s?o.1b.1k.1s.3v:s/(n.aR[t]-n.7C[t])*o.1b.1k.1s.3v)};e.3c(t,19(t,i){n.$5w[t]=e(i).2a("ls-2O-4U "+a),n.$1v[t]=e("<1C>").2a("ls-2O").2i(n.$5w[t]),n.$e5[t]=e("<1C>").2a("ls-kl").2i(n.$1v[t]),n.$7J[t]=e("<1C>").2a("ls-2O-1c-4U").2i(n.$5w[t]),n.$cL[t]=e("<1C>").2a("ls-2O-1c").2i(n.$7J[t]),n.7C[t]=n.$7J[t].1f(),n.$7J[t].1e({5E:-n.$cL[t].4T()/2}),n.$5w[t].on("8P."+a,19(e){l(e,t)}),n.$5w[t].on("kn."+a+" jR."+a,19(i){o.1b.1k.1s.5G(0),e("3I").8T("ai",!0).2a("ls-ai"),e(2D).on("7s."+a,19(e){l(e,t)}),l(i,t)}),r=r.1z(n.$cL[t])}),r.on("kp."+a+"jS."+a,19(t){e(t.5t).3O(i).1t||(o.1b.1G&&o.1b.1k.1s.2v.7H&&o.1b.1G.3v()!==o.1b.1k.1s.3v&&o.1N.2Y(o.1b.1k.1s,{7H:!1}),e(2D).6M("7s."+a),e("3I").8T("ai",!1).3W("ls-ai"),o.o.9Z&&!o.1w.2v.73||o.1c.5f||!o.1b.1G||o.o.5g||(!0===o.1b.1k.1s.2v.e8?o.1b.1k.1s.8p():o.1b.1k.1s.2X()))})}}},cr:{1m:19(){18.$1v=e("<1C>").1e({3t:"3q"}).2a("ls-1x-1v ls-jV-4U").2i(i),e("<1C>").2a("ls-jV-ku").2i(18.$1v)},5W:19(){18.$1v.47(kv).5s(5e)},3Y:19(){18.$1v.1Y(!0,!0).5M(5e)}}},o.2m={2F:"1P",1m:19(){o.1h.3r>1&&(18.21.jX(),18.21.fJ())},21:{jX:19(){o.o.gH&&e("3I").on("ky."+a,19(e){o.1c.kz||o.1c.kA||(37==e.fK?o.2m.2H():39==e.fK&&o.2m.1P())})},fJ:19(){"bk"in 1o&&o.o.gG&&(o.1c.$5Q.on("jR."+a,19(e){1d t=e.6G?e.6G:e.8J.6G;1==t.1t&&(o.1n.bN=o.1n.b0=t[0].e9)}),o.1c.$5Q.on("8P."+a,19(e){1d t=e.6G?e.6G:e.8J.6G;1==t.1t&&(o.1n.b0=t[0].e9),1A.3Q(o.1n.bN-o.1n.b0)>45&&e.41()}),o.1c.$5Q.on("jS."+a,19(e){1A.3Q(o.1n.bN-o.1n.b0)>45&&(o.1n.bN-o.1n.b0>0?i.53("b1"):i.53("b3"))}))}},2H:19(){(!o.1c.8A||o.1c.8A&&o.1c.2v.ed)&&(18.2F="2H",18.bn="2H",o.1w.21.ac("2H"))},1P:19(){(!o.1c.8A||o.1c.8A&&o.1c.2v.ed)&&(18.2F="1P",18.bn="1P",o.1w.21.ac("1P"))},3k:19(){o.1N.2Y(o.1w,{73:!0,4r:!1}),!0===o.1w.2v.aq&&o.1N.2Y(o.1w,{aq:!1}),o.1x.2m.1Z.aK("3k"),o.1w.2v.as||1!==o.1b.1G.5v()&&o.1b.1k.1s.8p(),o.1w.3k()},1Y:19(){o.1x.2m.1Z.aK("1Y"),o.o.9Z&&o.1b.1k.1s.5G(),o.1w.1Y()}},o.5Z={1m:19(){o.1c.$7v.1D(".ls-1R 3L").3c(19(){1d t=e(18),i=t[0],s={};if(t.is(".ls-2V, .ls-bg")){if(i.ag("1f")&&(s.1f=i.ag("1f")),i.ag("1g")&&(s.1g=i.ag("1g")),i.bl&&(s.bl=i.bl),i.bj&&o.o.ea){s.bi=i.bj,s.7Z=i.eh;1d a=s.bi.1K(",").kX(19(t){1T 1l(e.3N(t).1K(" ")[1])});s.4B=1A.46.kY(2u,a)}t.7w("1f").7w("1g").7w("bl").7w("bj"),e.4w(s)||(t.1a(o.1p.1m.1V).6l=s)}t.1a("fY-23")&&t.1a("23",t.1a("fY-23")),t.1a("23")?s.7Z&&t.1a("23",s.7Z):t.1a("23",s.7Z?s.7Z:i.23),t.1J("23","1a:5c/l0;l1,l2///l3")})},dH:19(t,s){if(!0!==o.1h[t].93){18.7U=t,s?(18.aO=s,o.1N.2Y(o.1c,{a0:!0}),o.1x.cr.5W()):18.aO=!1,o.1c.g1&&i.1e({6q:"4J"}),18.6T=[];1d a,r,n=18;o.1c.$7v.1D(".ls-1R:eq("+(n.7U-1)+") *").3c(19(){a=e(18),r=18;1d t=a.1a(o.1p.1m.1V);if(a.is("3L")){a.1a("23")&&a.1J("23",a.1a("23")),t&&t.6l&&t.6l.bi&&o.o.ea&&(r.bj=t.6l.bi);1d i=r.23,s=!!(t&&t.6l&&t.6l.7Z)&&t.6l.7Z;s&&i!==s&&a.is(".ls-bg")&&(i=s,o.1h[n.7U].1a.$2h.1J("23",i)),o.5Z.6T.51([i,a])}2L"3q"!==a.1e("2h-5c")&&-1!==a.1e("2h-5c").1i("6v")&&o.5Z.6T.51([a.1e("2h-5c").4i(/6v\\((.*)\\)/)[1].2k(/"/gi,""),a])}),o.1b.4d&&o.o.8L&&o.5Z.6T.51([o.o.8L,e()]),18.g3||18.4E(),0===18.6T.1t?18.4k():18.3k()}2L o.1c.d1&&s&&(o.1E.ej(o.1k.2S("1P, bg")),o.1E.1k(s))},4E:19(){2e(1d e=o.1c.4E.1u(19(e,t,i){1T i.1i(e)==t}),t=e.1t,i=0;i<t;i++){(4p g6).23=e[i]}18.g3=!0},3k:19(){o.2b&&(o.1H.1z("81","5Z"),o.1H.1z("5z","5Z.6O",18.7U)),18.g8=0;2e(1d e,t=18,i=19(){++t.g8==t.6T.1t&&(o.2b&&o.1H.9g(),t.4k())},s=19(){o.2b&&(e=18.23.8S(18.23.g9("/")+1,18.23.1t),o.1H.1z("5z","5Z.ga",e)),18.el.1a("fO",18.1f),18.el.1a("fP",18.1g),i()},a=19(){o.2b&&(e=18.23.8S(18.23.g9("/")+1,18.23.1t),o.1H.1z("2I","5Z.li",e)),i()},r=0;r<18.6T.1t;r++){1d n=4p g6;n.cZ("7g",a,!1),n.cZ("4q",s,!1),n.23=18.6T[r][0],n.el=18.6T[r][1]}},4k:19(){1d t=18;18.aO?(o.1k.5A(18.7U),19 i(){if(0!==o.1h[t.7U].$1k.1t)o.2N.gd=5B(i,1q);2L{2p o.2N.gd,o.1N.2Y(o.1b.1k.1F,{bx:!0}),e(".ls-2A-1Q, .ls-3n-1P, .ls-3n-2H, .ls-1Z-3n-1Q").1e({6q:"4J"}),o.1h[t.7U].93=!0;1d s=!(!1o.2G.7K.b2&&o.1k.2S("1P,in,3H,co").1t),a=!(!1o.2G.7K.cV&&o.1k.2S("1P,in,42,co").1t),r=19(){o.1x.cr.3Y(),o.1c.d1?(o.1E.ej(o.1k.2S("1P, bg")),o.1E.1k(t.aO)):t.aO()};s&&a?r():o.4F.en=cl(19(){(s||1o.2G.7K.b2)&&(a||1o.2G.7K.cV)&&(9H(o.4F.en),2p o.4F.en,r())},50)}}()):o.1k.5A(18.7U,!0),o.1N.2Y(o.1c,{a0:!1})}},o.1E={ej:19(e){18.$aM=e.1z(o.1k.2S("3o")),o.1h.1P.1a.$2x.1t&&(18.$aM=18.$aM.1z(o.1h.1P.1a.$2x))},5C:19(){if(!2D.3I.86(t))1T!1;o.2C.4b("gg")&&i.4f("gg",o.2C.4M()),18.1c(),18.2m(),18.1k(),18.3i(),18.4n(),18.2l(),o.1b.1k.1s.6b&&o.o.eb&&(o.1N.gj(),o.1b.1k.1s.61(!0)),o.2C.4b("gk")&&i.4f("gk",o.2C.4M())},cW:19(){e(1o).cc(1A.6C(o.1c.4A)-(o.1n.55-o.1c.1g)/2)},1c:19(){if(!2D.3I.86(t))1T!1;1d s,a=o.1c.$ep?o.1c.$ep:o.1N.gm("1f"),r=o.1c.49,n=o.1c.$er?a.1f()/1q*o.1c.$er:a.1f(),l=r.22,d=0!==r.4B?r.4B:n,u="2E"===r.3U?0:r.3U,p="2E"===r.8W?0:r.8W;if(o.1c.2v.6N?i[0].1X.4B="":0!==r.4B&&(i[0].1X.4B=r.4B+"px"),-1!==d.1i("%")&&(d=n/1q*1l(d)),(n-=u+p)>d&&d>=0&&(n=d),o.o.eO&&("6g"===l||"6F"===l&&"d4"!==o.o.8B&&"gq"!==o.o.8B)){i.4c();1d c=a.5Y().1S,h=1l(a.1e("4u-1S"))||0,m=1l(a.1e("79-1S-1f"))||0;i[0].1X.4B="3q",i[0].1X.3U=-(c+h+m)+"px",n=o.1n.70||e(1o).1f()}2M(n-=r.a2,o.1c.2v.6N&&(n=o.1n.1f),l){1j"26":o.1c.2v.6N?(o.1n.1I>r.1I?18.1I=o.1n.1g/r.1g:18.1I=o.1n.1f/r.1f,n=1A.6C(r.1f*18.1I),s=1A.6C(r.1g*18.1I)):(18.1I=n/r.1f,s=1A.6C(r.1g*18.1I));1y;1j"6g":n<o.o.71?(18.1I=n/o.o.71,s=1A.6C(r.1g*18.1I)):o.1c.2v.6N?o.1n.1I>r.9Y/r.1g?(18.1I=o.1n.1g/r.1g,s=o.1n.1g):(18.1I=o.1n.1f/r.9Y,s=r.1g*18.1I):(18.1I=1,s=r.1g);1y;1j"6F":2M(o.o.8B.4m()){1j"5b":s=o.1n.55-r.9X;1y;1j"k3":s=o.1n.55-r.9X,o.1c.2v.6N||(s-=o.1c.ey?o.1c.ey:o.1c.4A);1y;1j"d4":n=i.4c().1f()-r.a2,s=i.4c().1g()-r.9X;1y;1j"gq":n=i.4c().1f()-r.a2,s=o.1n.55-r.9X}n/s<r.1I?18.1I=n/r.9Y:18.1I=s/r.ez;1y;1j"gy":1j"eA":18.1I=1,n=r.1f,s=r.1g,o.o.5T=1,t.1X.4B="3q"}18.1I=o.o.5T&&o.o.5T>0&&18.1I>o.o.5T?o.o.5T:18.1I,t.1X.1f=n+"px",t.1X.1g=s+"px",o.1c.1f=n,o.1c.1g=s;1d f=i.5Y();o.1c.lL=f.1S,o.1c.lM=f.29,o.1n.6n?o.1n.70<lN&&o.1n.70>lO?i.3W("ls-1n-is-6p").2a("ls-1n-is-6o"):o.1n.70<lP&&i.3W("ls-1n-is-6o").2a("ls-1n-is-6p"):i.3W("ls-1n-is-6p ls-1n-is-6o").2a("ls-1n-is-bR")},3P:19(t){2e(1d i=(""+t).1K(" "),s="",a=o.o.5T&&o.o.5T>0&&18.1I>o.o.5T?o.o.5T:18.1I,r=0,n=i.1t;r<n;r++)-1===i[r].1i("%")?s+=1A.6R(1l(i[r])*a)+"px ":s+=i[r]+" ";1T e.3N(s)},1k:19(t){if(18.$aM){o.2b&&o.1H.1z("81","1E");1d i=18.1I,s=18.$aM,a=o.1c.49,r=o.1c.1f,n=o.1c.1g,l=r/n,d=[],u=[],p=[],c=[],h=0,m=0,f="26"===a.22&&-1!==o.o.5T?a.1f:a.9Y,g="26"===a.22&&-1!==o.o.5T?a.1g:a.ez;"6F"===a.22||"6g"===a.22||"26"===a.22?(h=f>0?(r-f*i)/2:0,m=g>0?(n-g*i)/2:0):(h=h<0?0:h,m=m<0?0:m);2e(1d v=0,y=s.1t;v<y;v++){1d b,S,w=e(s[v]),x=(s[v],w.1a(o.1p.1m.1V)),T=x.3b,C="gy"===x.31.6z,k=C?0:h,I=C?0:m,O={1f:C&&0!==T.8O?r/1q*T.8O:T.1f*i,1g:C&&0!==T.8Q?n/1q*T.8Q:T.1g*i,7m:T.7m*i,7h:T.7h*i,7i:T.7i*i,7e:T.7e*i,7a:1A.6R(T.7a*i),76:1A.6R(T.76*i),77:1A.6R(T.77*i),74:1A.6R(T.74*i),3P:18.3P(T.3P)},L={3U:T.3U*i,5E:T.5E*i},$={},B={3P:O.3P};if(C&&(T.8Q||T.8O)&&x.is.gu&&(T.8Q&&!T.8O&&(O.1f=T.1f*(O.1g/T.1g)),T.8O&&!T.8Q&&(O.1g=T.1g*(O.1f/T.1f))),("4t"==2t T.1f&&T.1f<0||"2E"==T.1f)&&o.2b&&o.1H.1z("2I","1E.1f",[v+1,T.1f]),("4t"==2t T.1g&&T.1g<0||"2E"==T.1g)&&o.2b&&o.1H.1z("2I","1E.1g",[v+1,T.1g]),x.is.9t&&(O.6A=T.6A*i,o.1n.6n&&O.6A<x.4g.88?O.6A=x.4g.88:O.6A<x.4g.84&&(O.6A=x.4g.84),S=O.6A/T.6A,O.6A+="px","5b"!==T.cH&&(O.cH=2P(T.cH)*S+"px"),"5b"!==T.cG&&(O.cG=2P(T.cG)*S+"px")),x.is.5N||x.is.2x)if(x.is.5N){1d P=o.1h[x.is.d2].1a.cE;2M((2q 0!==P&&"lQ"!==P?P:o.o.9a).2k("1q% 1q%","eB")){1j"2E":1y;1j"b6":T.1I<l?(O.1f=r,O.1g=O.1f/T.1I):(O.1g=n,O.1f=O.1g*T.1I);1y;1j"gB":T.1I<l?(O.1g=n,O.1f=O.1g*T.1I):(O.1f=r,O.1g=O.1f/T.1I);1y;1j"eB":O.1f=r,O.1g=n}O.1f=1A.6C(O.1f),O.1g=1A.6C(O.1g);1d W=o.1h[x.is.d2].1a.cK;2M((b=2q 0!==W?W.1K(" "):o.o.h6.1K(" "))[0]){1j"1S":O.x=0;1y;1j"8f":O.x=(o.1c.1f-O.1f)/2;1y;1j"3T":O.x=o.1c.1f-O.1f;1y;5H:-1!==b[0].1i("%")?O.x=(o.1c.1f-O.1f)/1q*1l(b[0]):O.x=1l(b[0])}if(2q 0!==b[1])2M(b[1]){1j"29":O.y=0;1y;1j"8f":O.y=(o.1c.1g-O.1g)/2;1y;1j"1Z":O.y=o.1c.1g-O.1g;1y;5H:-1!==b[1].1i("%")?O.y=(o.1c.1g-O.1g)/1q*1l(b[1]):O.y=1l(b[1])}O.3F="56("+O.x+"px) 4Z("+O.y+"px)",O["-ms-3F"]="56("+O.x+"px) 4Z("+O.y+"px)",O["-5F-3F"]="56("+O.x+"px) 4Z("+O.y+"px)"}2L x.is.2x&&(T.1I<l?(O.1f=r,O.1g=O.1f/T.1I):(O.1g=n,O.1f=O.1g*T.1I),O.x=(o.1c.1f-O.1f)/2,O.y=(o.1c.1g-O.1g)/2,O.1f=1A.6C(O.1f),O.1g=1A.6C(O.1g),O.3F="56("+O.x+"px) 4Z("+O.y+"px)",O["-ms-3F"]="56("+O.x+"px) 4Z("+O.y+"px)",O["-5F-3F"]="56("+O.x+"px) 4Z("+O.y+"px)");2L{if(x.2Q.6F)2M(x.2Q.cF){5H:1j"b6":T.1I<l?(O.1f=r,O.1g=O.1f/T.1I):(O.1g=n,O.1f=O.1g*T.1I);1y;1j"gB":T.1I>l?(O.1f=r,O.1g=O.1f/T.1I):(O.1g=n,O.1f=O.1g*T.1I)}O.4R=O.1f+O.7m+O.7i+O.7a+O.77,O.4T=O.1g+O.7h+O.7e+O.76+O.74,L.1f=$.1f=O.4R,L.1g=$.1g=O.4T,-1!=T.1S.1i("%")?"1q%"===T.1S?O.1S=0===k?o.1c.1f/1q*2P(T.1S)-O.4R:k+f*i/1q*2P(T.1S)-O.4R:"0%"===T.1S?O.1S=0===k?0:k:O.1S=0===k?o.1c.1f/1q*2P(T.1S)-O.4R/2:k+f*i/1q*2P(T.1S)-O.4R/2:O.1S=k+2P(T.1S)*i,L.1S=O.1S,-1!=T.29.1i("%")?"1q%"===T.29?O.29=0===I?o.1c.1g/1q*2P(T.29)-O.4T:I+g*i/1q*2P(T.29)-O.4T:"0%"===T.29?O.29=0===I?0:I+0:O.29=0===I?o.1c.1g/1q*2P(T.29)-O.4T/2:I+g*i/1q*2P(T.29)-O.4T/2:O.29=I+2P(T.29)*i,L.29=O.29}x.26=O,d[v]=O,x.is.5N||x.is.2x||(x.31.du.26=L,u[v]=L,p[v]=$,c[v]=B)}2e(1d 3p=0,M=d.1t;3p<M;3p++){1d z=e(s[3p]),F=z.1a(o.1p.1m.1V);z.1e(d[3p]),F.is.5N||F.is.2x?(F.is.5N||F.is.2x)&&(F.24.$bV.1e({1f:o.1c.1f,1g:o.1c.1g}),F.24.$7G.1e({1f:o.1c.1f,1g:o.1c.1g})):(z.1D(".1K-lX").1e(c[3p]),18.3f(z,F,u[3p],p[3p]))}2q 0!==t&&t(),o.2b&&o.1H.9g("1E")}},3f:19(e,t,i,s){i&&t.24.$1Q.1e(i),s&&t.1B.1U&&t.24.$7N.1e(s),r.3g.21(t.24.$1Q[0],{2o:!1,1e:{2w:t.2w.2V*o.1E.1I}}),t.1B.1U&&r.3g.21(t.24.$7N[0],{2o:!1,1e:{2w:t.2w.1B*o.1E.1I}}),t.1r.1U&&r.3g.21(e[0],{2o:!1,1e:{2w:t.2w.1r*o.1E.1I}}),t.28.5r&&r.3g.21(t.28.5r,{2o:!1,1e:{2w:t.2w.4X*o.1E.1I}}),t.2B.5r&&r.3g.21(t.2B.5r,{2o:!1,1e:{2w:t.2w.4X*o.1E.1I}}),t.1F.1U&&r.3g.21(t.24.$8k[0],{2o:!1,1e:{2w:t.2w.1F*o.1E.1I}})},8g:19(e,t,i,s){if("5S"==2t i.x){2e(1d a=[],r=0;r<i.x.1t;r++)"5l"==2t i.x[r]?a[r]=18.aw(e,i.x[r],"gJ"):a[r]=i.x[r]*o.1E.1I;t.6r.x=a}2L"5l"==2t i.x?t.x=18.aw(e,i.x,"gJ"):2q 0!==i.x&&(t.x=i.x*o.1E.1I);if("5S"==2t i.y){2e(1d n=[],l=0;l<i.y.1t;l++)"5l"==2t i.y[l]?n[l]=18.aw(e,i.y[l],"gK"):n[l]=i.y[l]*o.1E.1I;t.6r.y=n}2L"5l"==2t i.y?t.y=18.aw(e,i.y,"gK"):2q 0!==i.y&&(t.y=i.y*o.1E.1I);if(s&&(t=s),"5S"==2t i.3l){2e(1d d=[],u=0;u<i.3l.1t;u++)d[u]=o.1N.2T.3l(i.3l[u],e);t.6r.3l=d}2L"5l"==2t i.3l&&(t.3l=o.1N.2T.3l(i.3l,e))},92:19(t,i){2q 0!==i.1f&&(e.7D(i.1f)?t.1f=1l(i.1f)*o.1E.1I:"5l"==2t i.1f&&-1!==i.1f.1i("%")&&(t.1f=o.1c.1f/1q*1l(i.1f))),2q 0!==i.1g&&(e.7D(i.1g)?t.1g=1l(i.1g)*o.1E.1I:"5l"==2t i.1g&&-1!==i.1g.1i("%")&&(t.1g=o.1c.1g/1q*1l(i.1g))),i.3P&&(t.3P=o.1E.3P(i.3P))},2g:19(t,i,s){i=e.3N(i.2k("gM(","").2k(")",""));2e(1d a,r=t.1a(o.1p.1m.1V).26,n=1A.6R(r.4R),l=1A.6R(r.4T),d=-1===i.1i(",")?i.1K(" "):i.1K(","),u="",p=0;p<d.1t;p++)if(-1!==d[p].1i("%"))2M(p){1j 0:u+=1l(l/1q*1l(d[p])*1q)/1q+"px ";1y;1j 1:u+=s?1l(1q*(n-n/1q*1l(d[p])))/1q+"px ":1l(n/1q*1l(d[p])*1q)/1q+"px ";1y;1j 2:u+=s?1l(1q*(l-l/1q*1l(d[p])))/1q+"px ":1l(l/1q*1l(d[p])*1q)/1q+"px ";1y;1j 3:u+=1l(n/1q*1l(d[p])*1q)/1q+"px"}2L 2M(a=1l(d[p])*o.1E.1I,p){1j 0:u+=a+"px ";1y;1j 1:u+=s?n-a+" ":a+"px ";1y;1j 2:u+=s?l-a+"px ":a+"px ";1y;1j 3:u+=a+"px"}1T"gM("+u+")"},aw:19(e,t,i){1d s=0,a=e.1a(o.1p.1m.1V),r=a.3b,n=a.26,l=a.31.du.26;if(r&&n&&l)2M(t){1j"1S":s=-1!=r.1S.1i("%")?"1q%"===r.1S?-n.1S-n.4R-l.3U:-1l(r.1S)/1q*o.1c.1f-n.4R/2-l.3U:-n.1S-n.4R-l.3U;1y;1j"3T":s=-1!=r.1S.1i("%")?"1q%"===r.1S?o.1c.1f-n.1S-l.3U:(1-1l(r.1S)/1q)*o.1c.1f+n.4R/2-l.3U:o.1c.1f-n.1S-l.3U;1y;1j"29":s=-1!=r.29.1i("%")?"1q%"===r.29?-n.29-n.4T-l.5E:-1l(r.29)/1q*o.1c.1g-n.4T/2-l.5E:-n.29-n.4T-l.5E;1y;1j"1Z":s=-1!=r.29.1i("%")?"1q%"===r.29?o.1c.1g-n.29-l.5E:(1-1l(r.29)/1q)*o.1c.1g+n.4T/2-l.5E:o.1c.1g-n.29-l.5E;1y;1j"1f":s=n.4R;1y;1j"-1f":s=-n.4R;1y;1j"1g":s=n.4T;1y;1j"-1g":s=-n.4T;1y;5H:s=-1!==t.1i("%")?n["dt"+i]/1q*1l(t):-1!==t.1i("sw")?1l(t.1K("sw")[0])/1q*o.1c.1f:-1!==t.1i("sh")?1l(t.1K("lw")[0])/1q*o.1c.1g:-1!==t.1i("lw")?n.4R/1q*1l(t.1K("lw")[0]):-1!==t.1i("lh")?n.4T/1q*1l(t.1K("lj")[0]):1l(t)*o.1E.1I}1T s},2m:19(){"95"==o.o.6u&&o.1x.2m.1Z.4E.1E()},4n:19(){o.1x.4n.5W&&o.1x.4n.5W(),o.1x.4n.$1v&&o.1x.4n.1E()},3i:19(){o.3i.$1v&&o.3i.1E()},2l:19(){if(o.1x.2l.2O.$5w.1t>0)2e(1d e=0,t=o.1x.2l.2O.$5w.1t;e<t;e++)o.1x.2l.2O.aR[e]=o.1x.2l.2O.$5w[e].1f(),o.1x.2l.2O.e6[e]=o.1x.2l.2O.$1v[e].1f()}},o.1b={4d:!0,3k:19(){if(!2D.3I.86(t))1T!1;o.1n.2j.gO=o.1n.2j.2F,"95"==o.o.6u&&(o.1x.2m.1Z.4E.6j(),"bk"in 1o||o.1x.2m.1Z.4E.2j()),18.1k.1M.gP(),18.1R.1m()},1R:{$1Q:e(),1m:19(){1d t,i;if(o.1N.2Y(o.1c,{89:!0}),o.1b.1k.1F.3x(),o.1c.$6c.3S(\'.ls-1F[1a-ls-1F="3o"]\').3c(19(){e(18).1D(".ls-2V").1a(o.1p.1m.1V).31.9y===o.1h.2z.1L&&e(18).1J("1a-ls-1F","m9")}),o.1b.3s=o.1h.2z,o.1b.2c=o.1h.1P,o.1b.3G=4p r.6P({4r:!0,4k:19(){o.1b.1R.4k()}}),o.1b.4d){if(2q 0!==o.1b.2c.1a.$2h){1d s=o.1b.2c.1a.$2h.1a(o.1p.1m.1V),a=s.2y.6E?s.2y.3C.2U:1,n=s.2y.6E?s.2y.3C.2f:0,l=o.1b.2c.1u.3C||"3q";o.1b.3G.21(o.1b.2c.1a.$2h[0],{"-5F-1u":l,1u:l},0),o.1b.3G.48(o.1b.2c.1a.$2h.3O(".ls-bg-5A")[0],o.o.cO,{2o:!1,1e:{2U:a,2f:n,2Z:0,3t:"5J"}},{2o:!1,1e:{2Z:1}},0)}18.3k(!0)}2L"6L"==2t b5&&"6L"==2t cd?(18.3k(!0),o.2b&&o.1H.1z("2I","7p.mf",o.1b.2c.1L)):2q 0===o.1b.3s.1a.$2h&&2q 0===o.1b.2c.1a.$2h&&"59"==o.1b.3s.1a.3e&&"59"==o.1b.2c.1a.3e?18.3k(!0):("x"===o.o.bB?o.1n.$aE.2a("ls-gV-4I"):"y"===o.o.bB?o.1n.$aE.2a("ls-gW-4I"):!0===o.o.bB&&o.1n.$aE.2a("ls-52-4I"),2q 0!==o.1b.3s.1a.$2h&&(t=o.1b.3s.1a.$2h.3O(".ls-bg-5A")[0].gX,(i=o.1b.3s.1a.$2h.1a(o.1p.1m.1V)).26.1u=o.1b.3s.1a.$2h[0].1X.1u,i.26.8q=2q 0!==t?" 3X("+t.2f+"8m)":" 3X(mm)",i.26.80=2q 0!==t?" 2U("+t.4s+")":" 2U(1)"),o.1b.1R.$1Q=e("<1C>").2a("ls-1R-27-1Q").1e({1f:o.1c.1f,1g:o.1c.1g}),18.ch.h2())},ch:{h2:19(){o.1b.1R.5b.ch.h3()}},3k:19(e){1d t,s=!(!o.1h.2z.1L||!o.1h.2z.1a.$2x.1t),a=!(!o.1h.1P.1L||!o.1h.1P.1a.$2x.1t);if(!o.1w.97&&o.2C.4b("h4")&&i.4f("h4",o.2C.4M()),!e&&(2q 0!==o.1b.2c.1a.aT&&o.1b.3G.1O(o.1b.2c.1a.aT),o.2b&&o.1H.3V.aT&&o.1b.3G.1O(o.1H.3V.aT),o.1b.1k.1s.6W>.25)){1d n=o.1b.3G.1O()/(.75+o.1b.1k.1s.6W);n=n<.5?.5:n,o.1b.3G.1O(n)}1d l,d=o.1b.3G.1O()/o.1b.3G.5v(),u=d,p=o.1b.2c.1a.c7;p>0?p=0:p<0&&1A.3Q(p)>d&&(p=-d),o.1b.2c.1a.bT=p,l=o.1b.4d?o.o.cO+.mw:(u+p)*o.1b.3G.5v(),(s||a)&&o.1b.1W.h7(o.1b.4d,!(!s||!a)),o.1b.3G.h8(19(){!o.1w.97&&o.2C.4b("h9")&&i.4f("h9",o.2C.4M()),o.1w.4Y.6j||o.1b.1k.1s.ha(),o.1W.1Y(!0),o.1h.21.iR(),o.o.fN&&(2D.6Y.9w=o.1h[o.1h.2z.1L].1a.4H||"mB-4H-t9"),o.1w.3k(),!o.1b.4d&&o.1h.2H.1L&&o.1h.2H.1a.$2x.1t&&!o.1h.2H.1a.$2x.1a(o.1p.1m.1V).2R.eI&&(o.1h.2H.1a.$2x.5p("9J"),o.1h.2H.1a.$2x.1a(o.1p.1m.1V).24.$8F.1e({3t:"3q"})),o.1w.4Y.6j||o.1h.1P.1a.$2x.1t&&!o.1h.1P.1a.$2x.1a(o.1p.1m.1V).2R.eJ&&(o.1h.1P.1a.$2x.5p("dP"),o.1h.1P.1a.$2x.1a(o.1p.1m.1V).2R.eJ=!0),o.1b.4d=!1},[],18,l),o.1b.3G.2X(),2q 0!==o.1b.3s.1a&&2q 0!==o.1b.3s.1a.$2h&&(t=o.1b.3s.1a.$2h.1a(o.1p.1m.1V),o.2N.he=5B(19(){2p o.2N.he,o.1b.3s.1a.$2h.3O(".ls-bg-5A").3Y(),t.2y.6E&&r.3g.21(o.1b.3s.1a.$2h[0],{2o:!1,1e:t.2y.3C})},5))},4k:19(){1d e;2q 0!==o.1b.2c.1a.$2h&&o.1b.2c.1a.$2h.3O(".ls-bg-5A").5W(),"59"!==o.1b.2c.1a.3e?o.1c.$5Q.1e("2h-3Z",o.1b.2c.1a.3e):o.1c.$5Q.1e("2h-3Z",o.o.8E),o.o.mG||o.1n.$aE.3W("ls-gV-4I ls-gW-4I ls-52-4I"),18.$1Q&&(18.$1Q.5j("").6a(),18.$1Q=!1),o.1x.2m.1Z.cQ.21.3o(),o.o.5L>0&&(o.1w.5X("dG")?o.1w.5L.7n(o.1b.2c.1L)&&(o.2m.1Y(),o.1N.2Y(o.1w,{aq:!0}),o.o.eE&&(o.1w.b9=1)):o.1w.5L.21()),o.1N.2Y(o.1c,{89:!1,8K:!1}),!o.1w.97&&o.2C.4b("hg")&&i.4f("hg",o.2C.4M()),o.1w.97=!1,!1!==o.1w.4Y.6j&&o.2m.bn?(2q 0!==o.1b.3s.1a&&2q 0!==o.1b.3s.1a.$2h&&(e=o.1b.3s.1a.$2h.1a(o.1p.1m.1V),o.1b.3s.1a.$2h.3O(".ls-bg-5A").3Y(),e.2y.6E&&r.3g.21(o.1b.3s.1a.$2h[0],{2o:!1,1e:e.2y.3C})),o.1w.6S(o.1w.2S.a5(o.2m.bn),!0)):o.5Z.dH(o.1h.1P.1L)},5b:{ch:{h3:19(){if(o.o.7p)o.1b.1R.5b.eL(o.o.7p.22,o.o.7p.mK);2L{1d e,t,i=!!o.1b.2c.1a.7T&&o.1b.2c.1a.7T.eT().1K(",");o.1n.b3&&o.o.ec?(o.1n.b3=!1,18.27("2d","1")):o.1n.b1&&o.o.ec?(o.1n.b1=!1,18.27("2d","1")):o.1h.1P.1a.$2h||i&&(!i||-1!=i.1i("1")||-1!=i.1i("2")||-1!=i.1i("3")||-1!=i.1i("4"))?o.7l.hj()&&(o.1b.2c.1a.8w||o.1b.2c.1a.7u)?o.1b.2c.1a.8w&&o.1b.2c.1a.7u?(e=1A.3J(2*1A.2J()),t=[["3d",o.1b.2c.1a.8w],["hl",o.1b.2c.1a.7u]],18.27(t[e][0],t[e][1])):o.1b.2c.1a.8w?18.27("3d",o.1b.2c.1a.8w):18.27("hl",o.1b.2c.1a.7u):o.1b.2c.1a.7T&&o.1b.2c.1a.7t?(e=1A.3J(2*1A.2J()),t=[["2d",o.1b.2c.1a.7T],["hm",o.1b.2c.1a.7t]],18.27(t[e][0],t[e][1])):o.1b.2c.1a.7T?18.27("2d",o.1b.2c.1a.7T):o.1b.2c.1a.7t?18.27("hm",o.1b.2c.1a.7t):18.27("2d","1"):18.27("2d","5")}},27:19(e,t){o.2b&&o.1H.1z("81","7p.6O"),t+="";1d i,s=-1==e.1i("eM")?o.t:o.ct,a="3d";if(-1!=e.1i("2d")&&(a="2d"),-1!=t.1i("cy"))i=s["t"+a].1t-1,"cy";2L if(-1!=t.1i("5C"))i=1A.3J(1A.2J()*o.1N.ho(s["t"+a])),"2J 3C 5C";2L{1d r=t.1K(","),n=r.1t;i=1l(r[1A.3J(1A.2J()*n)])-1,"2J 3C hE"}2q 0===s["t"+a][i]&&(o.2b&&o.1H.1z("2I","7p.mR",[a.eN()+(-1===e.1i("eM")?"":" (hq)"),i+1]),s=o.t,e=a="2d",i=0),o.2b&&o.1H.1z("5z","7p.6O",[a.eN()+(-1===e.1i("eM")?"":" (hq)"),i+1,s["t"+a][i].aP]),o.1b.1R.5b.eL(a,s["t"+a][i])}},eL:19(t,i){1d s,a,n,l,d=e.4V(!0,{78:1,7j:1},i),u=2t d.78,p=2t d.7j,c=[],h=o.2m.2F,m=0,f=0,g=!!o.1b.3s.1a.$2h&&o.1N.cf(o.1b.3s.1a.$2h),v=!!o.1b.2c.1a.$2h&&o.1N.cf(o.1b.2c.1a.$2h),y=o.o.5g&&"9r"===o.1n.2j.2F?"2n":"3C";2M(u){1j"4t":u=d.78;1y;1j"5l":u=1A.3J(1A.2J()*(1l(d.78.1K(",")[1])-1l(d.78.1K(",")[0])+1))+1l(d.78.1K(",")[0]);1y;5H:u=1A.3J(1A.2J()*(d.78[1]-d.78[0]+1))+d.78[0]}2M(p){1j"4t":p=d.7j;1y;1j"5l":p=1A.3J(1A.2J()*(1l(d.7j.1K(",")[1])-1l(d.7j.1K(",")[0])+1))+1l(d.7j.1K(",")[0]);1y;5H:p=1A.3J(1A.2J()*(d.7j[1]-d.7j[0]+1))+d.7j[0]}if(o.1n.6n&&o.o.fV?(u>=15?u=7:u>=5?u=4:u>=4?u=3:u>2&&(u=2),p>=15?p=7:p>=5?p=4:p>=4?p=3:p>2&&(p=2),p>2&&u>2&&(p=2,u>4&&(u=4))):(u=u>35?35:u,p=p>35?35:p),o.2b&&!o.o.7p&&(o.1H.1z("5z","7p.5h",[[u,p],u*p]),o.1H.9g()),s=1A.3J(o.1c.1f/u),a=1A.3J(o.1c.1g/p),n=o.1c.1f-s*u,l=o.1c.1g-a*p,"2H"==h){d.6t&&d.6t.3R&&(d.6t.3R={2J:"2J",7Y:"3h",3h:"7Y","8Y-7Y":"8Y-3h","8Y-3h":"8Y-7Y"}[d.6t.3R]),e.3c(["4x","6Z","6H"],19(e,t){if(d[t]&&d[t].27){1d i=d[t].27;i.5R&&1A.3Q(i.5R)>44&&(i.5R*=-1),i.69&&1A.3Q(i.69)>44&&(i.69*=-1),i.3X&&(i.3X*=-1)}})}2e(1d b=0;b<u*p;b++)c.51(b);2M(d.6t.3R){1j"3h":c.3h();1y;1j"8Y-7Y":c=o.1N.eS(p,u,"7Y");1y;1j"8Y-3h":c=o.1N.eS(p,u,"3h");1y;1j"2J":c=o.1N.dE(c)}if("59"===o.1b.3s.1a.3e&&(o.1b.3s.1a.3e=o.o.8E),"59"===o.1b.2c.1a.3e&&(o.1b.2c.1a.3e=o.o.8E),"2d"==t){1d S=-1!=d.aP.4m().1i("n8"),w=-1!=d.aP.4m().1i("n9");18.$7F=e("<1C>").2a("ls-nb").2i(o.1b.1R.$1Q),18.$eU=e("<1C>").2a("ls-nd").2i(o.1b.1R.$1Q)}2e(1d x=0;x<u*p;x++){1d T,C,k,I,O,L,$,B=(x+1)%u==0?n:0,P=x>(p-1)*u-1?l:0,W=e("<1C>").2a("ls-1R-27-6t").1e({1f:s+B,1g:a+P}).1a("1X",{1f:s+B,1g:a+P}).2i(o.1b.1R.$1Q);c[x];if(m=x%u==0?m+1:m,f=x%u==0?1:f+1,"3d"==t){W.2a("ls-3d-4U");1d 3p,M,z,F,D,R,N,E=s+B,V=a+P,H=4p r.6P;N=1A.3Q(1A.3Q(f-u/2-.5)-u/2-.5)*1A.3Q(1A.3Q(m-p/2-.5)-p/2-.5),W.1e({7d:N}),M=E/2,z=V/2,F=(3p="hD"==d.4x.2F?1A.3Q(d.4x.27.69)>90&&"hF"!=d.6t.hG?1A.3J(E/7)+B:E:1A.3Q(d.4x.27.5R)>90&&"hF"!=d.6t.hG?1A.3J(V/7)+P:V)/2,18.6U("ls-3d-6i",W,0,0,0,0,-F,0,0,M+"px "+z+"px hI"),18.6U("ls-3d-hJ",W.1D(".ls-3d-6i"),E,V,0,0,F,0,0),"nt"==d.4x.2F&&1A.3Q(d.4x.27.5R)>90?18.6U("ls-3d-bf",W.1D(".ls-3d-6i"),E,V,0,0,-F,bb,0):18.6U("ls-3d-bf",W.1D(".ls-3d-6i"),E,V,0,0,-F,0,bb),18.6U("ls-3d-1S",W.1D(".ls-3d-6i"),3p,V,-F,0,0,0,-90),18.6U("ls-3d-3T",W.1D(".ls-3d-6i"),3p,V,E-F,0,0,0,90),18.6U("ls-3d-29",W.1D(".ls-3d-6i"),E,3p,0,-F,0,90,0),18.6U("ls-3d-1Z",W.1D(".ls-3d-6i"),E,3p,0,V-F,0,-90,0),T=W.1D(".ls-3d-hJ"),C="hD"==d.4x.2F?1A.3Q(d.4x.27.69)>90?W.1D(".ls-3d-bf"):d.4x.27.69>0?W.1D(".ls-3d-1S"):W.1D(".ls-3d-3T"):1A.3Q(d.4x.27.5R)>90?W.1D(".ls-3d-bf"):d.4x.27.5R>0?W.1D(".ls-3d-1Z"):W.1D(".ls-3d-29"),D=c[x]*d.6t.47,R=o.1b.1R.$1Q.1D(".ls-3d-4U:eq( "+x+" ) .ls-3d-6i"),d.6Z&&d.6Z.27?(d.6Z.27.47=d.6Z.27.47?(d.6Z.27.47+D)/3y:D/3y,H.2n(R[0],d.6Z.1O/3y,o.1N.2T.27(d.6Z.27,d.6Z.4S))):d.4x.27.47=d.4x.27.47?(d.4x.27.47+D)/3y:D/3y,H.2n(R[0],d.4x.1O/3y,o.1N.2T.27(d.4x.27,d.4x.4S)),d.6H&&(d.6H.27||(d.6H.27={}),H.2n(R[0],d.6H.1O/3y,o.1N.2T.27(d.6H.27,d.6H.4S,"6H"))),o.1b.3G.1z(H,0)}2L{1d A,X,Y,j,K,q,U,G,Q="2E",Z="2E",J="2E",ee="2E",9W=1,ie=1,se={};2M(X="2J"==d.27.2F?(A=["29","1Z","3T","1S"])[1A.3J(1A.2J()*A.1t)]:d.27.2F,-1!=d.aP.4m().1i("hP")&&x%2==0&&(h="2H"==h?"1P":"2H"),"2H"==h&&(X={29:"1Z",1Z:"29",1S:"3T",3T:"1S",eW:"eX",eY:"eZ",eZ:"eY",eX:"eW"}[X]),X){1j"29":Q=J=-W.1a("1X").1g,Z=ee=0;1y;1j"1Z":Q=J=W.1a("1X").1g,Z=ee=0;1y;1j"1S":Q=J=0,Z=ee=-W.1a("1X").1f;1y;1j"3T":Q=J=0,Z=ee=W.1a("1X").1f;1y;1j"eW":Q=W.1a("1X").1g,J=0,Z=W.1a("1X").1f,ee=0;1y;1j"eY":Q=W.1a("1X").1g,J=0,Z=-W.1a("1X").1f,ee=0;1y;1j"eZ":Q=-W.1a("1X").1g,J=0,Z=W.1a("1X").1f,ee=0;1y;1j"eX":Q=-W.1a("1X").1g,J=0,Z=-W.1a("1X").1f,ee=0}2M(18.9e=d.27.2U?d.27.2U:1,1==S&&1!=18.9e&&(Q/=2,J/=2,Z/=2,ee/=2),d.27.22){1j"fZ":Q=J=Z=ee=0,9W=0,ie=1;1y;1j"nP":9W=0,ie=1,1==18.9e&&(J=ee=0)}if((d.27.3X||d.27.5R||d.27.69||1!=18.9e)&&"1R"!=d.27.22?W.1e({52:"4J"}):W.1e({52:"4I"}),1==S?18.$7F.1e({52:"4J"}):18.$7F.1e({52:"4I"}),!0===w||"1R"==d.27.22||!0===S?(Y=W.2i(18.$7F),j=W.bw().2i(18.$eU),T=e("<1C>").2a("ls-hU").2i(Y)):j=W.2i(18.$eU),C=e("<1C>").2a("ls-hV").2i(j),K=c[x]*d.6t.47/3y,q=d.27.3X?d.27.3X:0,U=d.27.5R?d.27.5R:0,G=d.27.69?d.27.69:0,"2H"==h&&(q=-q,U=-U,G=-G),o.1b.3G.48(C[0],d.27.1O/3y,{4N:!1,2o:!1,1e:{x:-Z,y:-Q,3t:"5J",2Z:9W,2f:q,3B:U,3E:G,2U:18.9e}},{2o:!1,1e:{x:0,y:0,2Z:ie,2f:0,3B:0,3E:0,2U:1},2s:o.1N.2T.4S(d.27.4S)},K),1==w&&(2q 0===o.1b.2c.1a.$2h||2q 0!==o.1b.2c.1a.$2h&&(-1!=o.1b.2c.1a.$2h.1J("23").4m().1i("df")||o.1b.2c.1a.$2h.1f()<o.1c.1f||o.1b.2c.1a.$2h.1g()<o.1c.1g))&&(se.2Z=0),("1R"==d.27.22||1==S)&&-1==d.aP.4m().1i("hP")){1d ae=0;0!==q&&(ae=-q),se.x=ee,se.y=J,se.2f=ae,se.2U=18.9e,se.2Z=9W}2q 0!==T&&o.1b.3G.2n(T[0],d.27.1O/3y,{2o:!1,1e:se,2s:o.1N.2T.4S(d.27.4S)},K)}k=x%u*s,I=1A.3J(x/u)*a,2q 0!==o.1b.3s.1a.$2h&&(O=o.1b.3s.1a.$2h.1a(o.1p.1m.1V),"3d"===t||"2d"===t&&(!0===w||"1R"===d.27.22||!0===S)?T.9b(e("<3L>").1J("23",g).1e({1f:O.26.1f,1g:O.26.1g,"-5F-1u":O.26.1u,1u:O.26.1u,"-ms-3F":"56("+(O.26.x-k)+"px) 4Z("+(O.26.y-I)+"px)"+O.26.8q+O.26.80,"-5F-3F":"56("+(O.26.x-k)+"px) 4Z("+(O.26.y-I)+"px)"+O.26.8q+O.26.80,3F:"56("+(O.26.x-k)+"px) 4Z("+(O.26.y-I)+"px)"+O.26.8q+O.26.80})):0===18.$7F.3S().1t&&18.$7F.1e("2h-3Z",o.1b.3s.1a.3e).9b(e("<3L>").1J("23",g).1e({1f:O.26.1f,1g:O.26.1g,"-5F-1u":O.26.1u,1u:O.26.1u,"-ms-3F":"56("+O.26.x+"px) 4Z("+O.26.y+"px)"+O.26.8q+O.26.80,"-5F-3F":"56("+O.26.x+"px) 4Z("+O.26.y+"px)"+O.26.8q+O.26.80,3F:"56("+O.26.x+"px) 4Z("+O.26.y+"px)"+O.26.8q+O.26.80}))),"59"===o.1b.3s.1a.3e||o.1b.3s.1a.$2x.1t||("3d"===t||"2d"===t&&(!0===w||"1R"===d.27.22||!0===S)?T.1e("2h-3Z",o.1b.3s.1a.3e):0===18.$7F.3S().1t&&18.$7F.1e("2h-3Z",o.1b.3s.1a.3e)),2q 0!==o.1b.2c.1a.$2h&&($=(L=o.1b.2c.1a.$2h.1a(o.1p.1m.1V)).2y[y],C.9b(e("<3L>").1J("23",v).1e({1f:L.26.1f,1g:L.26.1g,"-5F-1u":o.1b.2c.1u.3C||"3q",1u:o.1b.2c.1u.3C||"3q","-ms-3F":"56("+(L.26.x-k)+"px) 4Z("+(L.26.y-I)+"px) 3X("+$.2f+"8m) 2U("+$.2U+")","-5F-3F":"56("+(L.26.x-k)+"px) 4Z("+(L.26.y-I)+"px) 3X("+$.2f+"8m) 2U("+$.2U+")",3F:"56("+(L.26.x-k)+"px) 4Z("+(L.26.y-I)+"px) 3X("+$.2f+"8m) 2U("+$.2U+")"}))),"59"===o.1b.2c.1a.3e||o.1b.2c.1a.$2x.1t||C.1e("2h-3Z",o.1b.2c.1a.3e)}o.1b.1R.$1Q.aF(o.o.h5?o.1c.$6c:o.1c.$5Q),o.1b.1R.3k()},6U:19(t,i,s,a,o,r,n,l,d,u){1d p="nT( "+o+"px, "+r+"px, "+n+"px)";0!==l&&(p+="5R( "+l+"8m)"),0!==d&&(p+="69( "+d+"8m)");1d c={1f:s,1g:a,3F:p,"-ms-3F":p,"-5F-3F":p};u&&(c["3F-f0"]=u,c["-ms-3F-f0"]=u,c["-5F-3F-f0"]=u),e("<1C>").2a(t).1e(c).2i(i)}}},1k:{in:{7E:19(e){e.1a(o.1p.1m.1V).1r.1U&&o.1b.1k.1r.7R(e)},4k:19(e){o.1W.dV(e)}},1M:{gP:19(){if(o.1b.5k){if(o.1b.1G){1d t,i,s=4p r.6P({4r:!0,hY:!0}),a=[],n=o.1k.2S("2z, in, 3A, 3o").1z(o.1k.2S("2z, 1M, 3A, 3o")),l=o.1k.2S("2z, 1M, c3, 3o"),d=o.1k.2S("2z, 1M, 3o"),u=e().1z(n).1z(l);u.3c(19(){1d r,n=e(18).1a(o.1p.1m.1V);if(n.1B.3M&&(o.1b.1G.6a(n.1B.3M),n.1B.3M.2X()),n.is.3A){t=[n.24.$1Q[0]],n.24.$8C&&(t=t.f1(n.24.$8C[0])),n.28.5r&&(t=t.f1(n.28.5r));2e(1d l=0;l<t.1t;l++)a=a.f1(o.1b.1G.nY(t[l],!0));2e(1d d=0;d<a.1t;d++)a[d].1O&&0!==a[d].1O()&&(i=a[d],r=i,s.1z(r,1q-r.1O()*r.3v()))}}),d.3c(19(){e(18).1a(o.1p.1m.1V).4Y.3x=!0}),s.2X().nZ(1q),o.1b.1G.c2("7E",2u),o.1b.1G.c2("4k",2u),o.1b.1G.c2("aN",2u),o.1b.1G.c2("6V",2u),o.1b.1G.1Y().6X()}o.1b.5k.2X()}o.1c.$6c.1D(".ls-4W").1e({3t:"3q"})},7E:19(e){},4k:19(e){1d t=e.1a(o.1p.1m.1V);(o.1c.2v.8K||t.31.9y!==o.1h.2z.1L)&&o.1b.1k.3x(e,t),t.1r.1U&&o.1b.1k.1r.aU(e)}},3x:19(e,t){t.1B.3M&&(t.1B.3M.1Y().6X(),2p t.1B.3M,r.3g.21(t.24.$7N[0],t.3x.dg)),r.3g.21(t.24.$1Q[0],t.3x.dh),r.3g.21(e[0],{"-5F-1u":"3q",1u:"3q"}),t.4Y.8u&&(t.3K.2J={},t.3w.2J={},o.1k.8u.1a(e)),t.4Y.3x=!1},1s:{6b:!1,61:19(t){1d s,n,l,d,u=t?"2z":"1P";o.1b.8I=u,o.1b.1k.1s.6b=!1,o.1b.1k.1s.i1(),o.1b.1G&&(o.1b.1G.5G().3v(0).5V().6X(!0),o.1b.1G=2u),o.1b.1G=4p r.6P({4r:!0,7E:19(){o.2C.4b("i2")&&i.4f("i2",o.2C.4M())},4k:19(){o.o.5g&&o.o.eG&&("1P"===o.1w.2F?o.1b.1k.1s.f2(!0):o.1b.1k.1s.bd(!0,!0))},aN:19(){o.2C.4b("i4")&&i.4f("i4",o.2C.4M()),o.1b.1k.1s.i5&&(o.1b.1k.1s.6b=!1,o.1b.1G.2X()),o.o.5g&&o.o.eG&&o.1b.1k.1s.bd(!0,!1)},6V:19(e){o.2C.4b("i6")&&i.4f("i6",e)},7W:["{5a}"]}),18.4o=0,18.3v=1,o.1b.5k=4p r.6P({4r:!0,hY:!0}),s=o.1k.2S(u+", in, aB"),n=o.1k.2S(u+", 1M, c3").1z(o.1k.2S(u+", 1M, 3o, 3A")),l=o.1k.2S(u+", in, c8, aB"),d=e().1z(s).1z(n).1z(l),18.cX(s,"in",o.1b.1G,o.1b.5k),18.cX(n,"1M",o.1b.1G,o.1b.5k),-1!==o.1h[u].1a.1O&&o.1h[u].1a.1O<18.4o?(18.3v=o.1h[u].1a.1O/18.4o,o.2b&&o.1H.1z("2I","f3.1O",[o.1h[u].1a.1O,18.4o])):o.1b.1G.1O()>18.4o&&(18.3v=18.4o/o.1b.1G.1O()),-1===o.1h[u].1a.1O?(o.1h[u].1a.1O=18.4o,o.1h[o.1h[u].1L].1a.1O=18.4o):18.4o=o.1h[u].1a.1O,18.cX(l,"in",o.1b.1G,o.1b.5k),!0===o.1b.1k.1s.6b&&o.2b&&o.1H.1z("2I","f3.gY",o.o.eb?"1U":"br");2e(1d p=0;p<d.1t;p++)e(d[p]).1a(o.1p.1m.1V).1F.1U&&e(d[p]).1a(o.1p.1m.1V).24.$8k.1J("1a-ls-1F","3o");if(o.1b.1k.1F.5p(),o.2C.4b("i8")&&i.4f("i8",{f3:o.1b.1G,oh:d,oi:18.4o}),o.1b.2l.61(),o.1b.2l.4D.3a&&o.1b.1G.1z(o.1b.2l.4D.3a.2X(),0),o.1b.2l.43.3a&&o.1b.1G.1z(o.1b.2l.43.3a.2X(),0),o.1b.2l.2O.3a&&o.1b.1G.1z(o.1b.2l.2O.3a.2X(),0),o.1b.1G.h8(19(){if(!o.1b.1G.i9()){if(o.2C.4b("ia")&&!1===i.4f("ia",o.2C.4M()))1T;o.1N.2Y(o.1b.1k.1s,{7H:!0}),!o.1w.5f()&&o.1w.2v.73?o.1w.6S(o.1h.1P.1L):o.1w.2v.aq&&o.1b.2l.3h()}},[],18,o.1h[u].1a.1O),o.1h.1P.1a.$4W&&o.1h.1P.1a.$4W.1e({3t:"5J"}),(!o.o.aa||"aX"!==o.1c.5i&&!o.o.h0)&&o.o.aa||!(o.1c.8A&&o.1c.2v.ed&&o.1c.2v.oo)&&o.1c.8A||(o.o.9Z&&o.1w.5f()&&o.1b.1G.5v(0),o.1b.1k.1s.2X(),o.o.5g&&"9r"===o.1n.2j.gO&&o.1b.1G.3v(1)),i.5p("5y.6d"+a),i.6M("66.6d"+a+" 5y.6d"+a+" 7s.6d"+a),o.1h[u].1a.6d){1d c=o.1k.2S(u+",in,aB").1z(o.1k.2S("3A,3o"));i.on("66.6d"+a,19(){c.3c(19(){o.1b.1k.1r.cR(e(18),e(18).1a(o.1p.1m.1V))})}),i.on("5y.6d"+a,19(){c.3c(19(){o.1b.1k.1r.f4(e(18),e(18).1a(o.1p.1m.1V))})}),i.on("7s.6d"+a,19(){c.3c(19(){o.1b.1k.1r.aS(e(18),e(18).1a(o.1p.1m.1V))})})}},ha:19(){o.1h.1P.1a.52&&"4I"!==o.1h.1P.1a.52?(o.1c.$6c.2a("ls-4J"),o.1c.$bQ.2a("ls-4J")):(o.1c.$6c.3W("ls-4J"),o.1c.$bQ.3W("ls-4J")),18.61()},8c:19(t,i,s,a){if("4t"==2t i)1T i;i=i.4m();1d r,n,l,d,u,p=o.1p.2V.iK,c=0;if(-1!==i.1i("*")&&(u="*"),-1!==i.1i("/")&&(u="/"),-1!==i.1i("+")&&(u="+"),-1!==i.1i("-")&&(u="-"),u)if(d=i.1K(u),r=e.3N(d[0]),l=1l(e.3N(d[1])),p[r]&&-1!==p[s][1].1i(p[r][0]))if(n="4t"==2t t.1s[r]?t.1s[r]:t.1s[r](t),a)c=l/3y;2L 2M(u){1j"*":c=n*l;1y;1j"/":c=n/l;1y;1j"+":c=n+l/3y;1y;1j"-":c=n-l/3y}2L o.2b&&(p[r]||o.1H.1z("2I","9D.ig",r),-1===p[s][1].1i(p[r][0])&&o.1H.1z("2I","9D.ih",[r,p[r],s,p[s]])),("+"===u||a)&&(c=l/3y);2L p[r=e.3N(i)]&&-1!==p[s][1].1i(p[r][0])?c=a?0:"4t"==2t t.1s[r]?t.1s[r]:t.1s[r](t):o.2b&&(p[r]?-1===p[s][1].1i(p[r][0])&&o.1H.1z("2I","9D.ih",[r,p[r],s,p[s]]):o.1H.1z("2I","9D.ig",r));1T(c!=c||c<0)&&(o.2b&&o.1H.1z("2I","9D.ov",[s,r,c]),c=0),c},cX:19(t,i,s,a){2e(1d n=0,l=t.1t;n<l;n++){1d d,u=e(t[n]),p=u.1a(o.1p.1m.1V),c=p.24.$1Q,h=p.24.$8C,m=p.24.$7N;if(p.4Y.3x&&o.1b.1k.3x(u,p),u.4y("ls-bg"))p.2y.6E&&s.48(u.3O(".ls-bg-5A"),o.1b.2c.1a.1O+o.1b.2c.1a.bT,{2o:!1,1e:p.2y.3C},{2o:!1,1e:p.2y.2n,2s:r.ow.cb},-o.1b.2c.1a.bT),e.4w(p.1u.3m.c0)&&e.4w(p.1u.3m.c1)||(p.1u.1b.bg||(p.1u.1b.bg=o.1b.1k.4Q.62(p,"bg",p.1u.3m.c0,p.1u.3m.c1)),s.2n([{p:0},u[0]],o.1b.2c.1a.1O,{p:1,2o:!1,2s:r.oy.cb,6V:o.1b.1k.4Q.8j,7W:["{5a}",p.1u.1b.bg]},0));2L 2M(i){1j"in":if(p.in.1U&&(p.31.7Q||("4t"!=2t p.in.2W&&(p.in.2W=0),p.1s.7O=p.in.2W,p.1s.7o=p.1s.7O+p.in.1O),o.1E.8g(u,p.4L,p.9L),o.1E.92(p.9l,p.68),o.1E.92(p.cg,p.ar),p.4L.2w=p.2w.2V*o.1E.1I,p.2g.1U&&(p.3b.2g||(p.3b.2g=p.2g.a8,p.3b.63=!0),p.am.2g?(p.hn.2g=o.1E.2g(u,p.am.2g,!0),p.gs.2g=o.1E.2g(u,p.3b.2g,p.3b.63),s.48(h[0],p.in.1O,p.hw,p.dc,p.1s.7O)):r.3g.21(h[0],{2g:o.1E.2g(u,p.3b.2g,p.3b.63)}),o.1b.1k.1s.6b=!0),e.4w(p.1u.3m.in)?e.4w(p.1u.3m.1M)||u.1e("1u",p.3b.1u):(p.1u.1b.in||(p.1u.1b.in=o.1b.1k.4Q.62(p,"in",p.1u.3m.in,p.1u.3m.1X)),s.2n([{p:0},u[0]],p.in.1O,{p:1,2o:!1,2s:p.ao.2s,6V:o.1b.1k.4Q.8j,7W:["{5a}",p.1u.1b.in]},p.1s.7O)),s.48(c[0],p.in.1O,p.hL,p.ao,p.1s.7O),s.48(u[0],p.in.1O,p.hB,p.dd,p.1s.7O)),p.is.9t&&((p.28.22||p.2B.22)&&o.1b.1k.7S.ij(u,p),p.28.1U&&(p.in.1U||s.2n(c[0],0,e.4V(!0,{},p.ao,p.1m.1Q),p.1s.7I),p.28.5r=o.1b.1k.7S.f6(p.28.22.1K("3p"),p.28.ns),o.1E.8g(u,p.3K,p.8v),p.3K.2w=p.2w.4X*o.1E.1I,e.4w(p.8v.2J)||o.1b.1k.7S.a4(p,p.8v.2J,p.3K),e.4w(p.3K.2J)||o.1b.1k.7S.a4(p,p.3K.2J,p.3K),2p p.3K.2J,p.31.7Q||(p.1s.7I=18.8c(p,p.28.2W,"7I"),p.1s.8U=p.1s.7I+(p.28.5r.1t-1)*p.28.7P+p.28.1O),s.im(p.28.5r,p.28.1O,p.3K,p.9z,p.28.7P,p.1s.7I,19(e){o.1b.1k.in.4k(e)},[u]))),p.is.hZ&&o.o.5g&&s.oE(p.1s.7x(),19(){5B(19(){2p o.2N.2j,o.1b.1k.1s.6W=0,o.1n.2j.9p=8V},6s)}),p.1B.1U){1d f=4p r.6P({64:p.1B.64,8N:p.1B.8N,8M:p.1B.8M,4r:!0});p.31.7Q&&!p.is.3A||(p.1s.6w=18.8c(p,p.1B.2W,"6w"),p.1s.7k=-1!==p.1B.3r&&p.1s.6w+(p.1B.64+1)*p.1B.1O+p.1B.64*p.1B.8N),p.1B.3M=f,o.1E.8g(u,p.4e,{x:p.6y.x,y:p.6y.y}),(p.4e.x&&0!==p.4e.x||p.4e.y&&0!==p.4e.y)&&(o.1b.1k.1s.6b=!0),p.d6.3l=o.1N.2T.3l(p.6y.3l,u),p.d6.2w=p.2w.1B*o.1E.1I,e.4w(p.1u.3m.1B)||(p.1u.1b.1B||(p.1u.1b.1B=o.1b.1k.4Q.62(p,"1B",e.4w(p.1u.3m.9j)?p.1u.3m.1X:p.1u.3m.9j,p.1u.3m.1B)),f.2n([{p:0},u[0]],p.1B.1O,{p:1,2o:!1,2s:p.cx.2s,6V:o.1b.1k.4Q.8j,7W:["{5a}",p.1u.1b.1B]},0)),f.48(m[0],p.1B.1O,p.hR,p.cx,0),p.aH.2g&&(p.fR.2g=o.1E.2g(u,p.aH.2g,!0),f.2n(h[0],p.1B.1O,p.es,0),o.1b.1k.1s.6b=!0),-1!==p.1B.64&&("oG"===o.o.5K||o.1x.2l.2O.$1v||o.o.5g)?(s.1z(f,p.1s.6w),f.2X()):s.oH(19(e){e.2X()},p.1s.6w,[f])}p.is.3A&&(p.1s.bs=p.1s.7o,p.1s.bt="1q%",p.31.7Q||(d=1A.46(p.1s.ay(),0),18.4o=1A.46(18.4o,d)));1y;1j"1M":p.is.9t&&p.2B.1U&&(p.2B.5r=o.1b.1k.7S.f6(p.2B.22.1K("3p"),p.2B.ns),o.1E.8g(u,p.3w,p.8s,p.cu),p.cu.2w=p.2w.4X*o.1E.1I,e.4w(p.8s.2J)||o.1b.1k.7S.a4(p,p.8s.2J,p.3w),e.4w(p.3w.2J)||o.1b.1k.7S.a4(p,p.3w.2J,p.3w),2p p.3w.2J,p.31.7Q||(p.1s.8r=18.8c(p,p.2B.2W,"8r"),p.1s.94=p.1s.8r+(p.2B.5r.1t-1)*p.2B.7P+p.2B.1O),p.2g.1U&&(2q 0===p.7r.2g&&s.2n(h[0],0,{4N:!1,1e:{2g:o.1E.2g(u,p.2g.46)}},p.1s.8r),o.1b.1k.1s.6b=!0),s.im(p.2B.5r,p.2B.1O,p.cu,p.3w,p.2B.7P,p.1s.8r)),o.1E.8g(u,p.4h,p.ap,p.da),o.1E.92(p.cn,p.az),o.1E.92(p.9f,p.6f),p.da.2w=p.2w.2V*o.1E.1I,"a6"!==p.1M.2W?(p.31.7Q&&!p.is.3A||(p.is.3A?(p.1s.bs=0,p.1s.5q=18.8c(p,p.1M.2W,"5q",!0),p.1s.bt=p.1s.5q):p.1s.5q=1A.46(18.8c(p,p.1M.2W,"5q"),p.1s.7o),p.1s.99=p.1s.5q+p.1M.1O),p.2g.1U&&(2q 0===p.7r.2g?s.2n(h[0],0,{4N:!1,1e:{2g:o.1E.2g(u,p.2g.46)}},p.1s.5q):(p.d7.2g=o.1E.2g(u,p.7r.2g,!0),s.2n(h[0],p.1M.1O,p.cq,p.1s.5q)),o.1b.1k.1s.6b=!0),e.4w(p.1u.3m.1M)||(p.1u.1b.1M||(p.1u.1b.1M=o.1b.1k.4Q.62(p,"1M",e.4w(p.1u.3m.bZ)?e.4w(p.1u.3m.9j)?p.1u.3m.1X:p.1u.3m.9j:p.1u.3m.bZ,p.1u.3m.1M)),s.2n([{p:0},u[0]],p.1M.1O,{p:1,2o:!1,2s:p.ax.2s,6V:o.1b.1k.4Q.8j,7W:["{5a}",p.1u.1b.1M]},p.1s.5q)),s.48(c[0],p.1M.1O,p.db,p.ax,p.1s.5q),s.48(u[0],p.1M.1O,p.d8,p.cp,p.1s.5q),s.48(c[0],0,p.1m.1Q,p.3x.jF,p.1s.99)):(p.1s.bs=0,p.1s.bt="1q%"),(!p.is.3A||p.is.3A&&p.31.9y===o.1h.1P.1L)&&(a.48(c[0],o.o.7V,p.db,p.ax,0),a.48(u[0],o.o.7V,p.d8,p.cp,0),p.2g.1U&&2q 0!==p.7r.2g&&(p.d7.2g=o.1E.2g(u,p.7r.2g,!0),a.2n(h[0],o.o.7V,p.cq,0))),d=1A.46(p.1s.dn(),0),18.4o=1A.46(18.4o,d),p.31.7Q=!0}}},2X:19(){o.1b.1G&&(o.1b.1G.2X(),o.1N.2Y(18,{e8:!0,73:!0,9U:!1,4r:!1}))},5G:19(t){t=e.7D(t)?t:.75;o.1b.1G&&(r.3g.2n(o.1b.1G,t,{5v:0}),o.1N.2Y(18,{4r:!0,9U:!1}))},8p:19(){o.1b.1G&&(r.3g.2n(o.1b.1G,.75,{5v:1}),o.1N.2Y(18,{4r:!1,9U:!1}))},3h:19(){o.1b.1G&&o.1b.1G.3h()},f2:19(e){if(e||(18.2X(),18.f7()),o.1b.1G&&!o.1c.8d()&&(0===o.1b.1G.4o()||1===o.1b.1G.3v())&&"9v"===o.1n.2j.2F){o.1w.2F="1P";1d t=o.1w.3R.9i;t.1i(o.1h.2z.1L)===t.1t-1?(o.1c.5i="bU",o.1n.2j.7R(),o.1w.2F="2H"):o.2m.1P()}},bd:19(e,t){(e&&!t||(18.3h(),18.f7()),o.1b.1G)&&(o.1c.8d()||0!==o.1b.1G.4o()&&0!==o.1b.1G.3v()||"9r"!==o.1n.2j.2F||(o.1w.2F="2H",0===o.1w.3R.9i.1i(o.1h.2z.1L)?(o.1c.5i="f8",o.1n.2j.7R(),o.1w.2F="1P"):o.2m.2H()))},f7:19(){if(o.1b.1G){r.3g.2n(o.1b.1G,.25,{5v:1+18.6W})}},i1:19(){18.2v={e8:!1,73:!1,4r:!1,9U:!1,7H:!1}}},1r:{7R:19(e){e.1J("1a-ls-f9","1")},aU:19(e){e.1J("1a-ls-f9","0")},21:19(e,t){t.24.$1Q.on("66."+a,19(){o.1b.1k.1r.cR(e,t)}),t.24.$1Q.on("5y."+a,19(){o.1b.1k.1r.f4(e,t)}),t.24.$1Q.on("7s."+a,19(){o.1b.1k.1r.aS(e,t)})},ir:19(t,i){if(i.1r.3M=4p r.6P({4r:!0,aN:19(e,t){t.1r.3M.oO&&(t.1r.3M.1Y().6X(),2p t.1r.3M)},oP:[t,i]}),o.1E.8g(t,i.4l,i.4G,i.eH),o.1E.92(i.4l,i.4G),i.eH.2w=i.2w.1r*o.1E.1I,i.1r.bI=r.3g.48(t[0],i.1r.7f,i.ex,i.d5),i.1r.3M.1z(i.1r.bI,0),t.1P().is(".ls-2V-4W")){1d s=t.1P(),a=e.4V(!0,{},i.ex,{1e:{2Z:1,3Z:"59",2h:"59",z:0}}),n=e.4V(!0,{},i.d5,{1e:{2Z:1,3Z:"59",2h:"59",z:0}});i.1r.8t=r.3g.48(s[0],i.1r.7f,a,n),i.1r.3M.1z(i.1r.8t,0)}2L i.1r.8t=2u;if(i.1r.dw){1d l={7d:a9};o.7l.9P&&(l.3F="gv(oS)"),i.1r.3M.2n(i.24.$7G[0],i.1r.7f,{2o:!1,1e:l},0)}i.1r.it=i.1r.7f/i.1r.b4==1?1:i.1r.7f/i.1r.b4,18.fa(t,i)},cR:19(e,t){"1"===e.1J("1a-ls-f9")&&(e.1J("1a-ls-fb",1),t.24.$1Q.6M("7s."+a),t.1r.3M?(t.1r.3M.2X().1Y().3v(0),18.fa(e,t)):18.ir(e,t))},f4:19(e,t){t.1r.3M&&(t.1r.3M.1Y().3v(1),18.iv(e,t)),e.7w("1a-ls-fb")},aS:19(e,t){e.1J("1a-ls-fb")||18.cR(e,t)},fa:19(e,t){t.1r.bI.bu({2s:t.1r.5O}),t.1r.8t&&t.1r.8t.bu({2s:t.1r.5O}),t.1r.3M.2X().5v(1)},iv:19(e,t){t.1r.bI.bu({2s:t.1r.6I}),t.1r.8t&&t.1r.8t.bu({2s:t.1r.6I}),t.1r.3M.3h().5v(t.1r.it)}},1F:{bp:{22:"2d",7q:"3u",x:!0,y:!0,2f:10,8i:10,aL:1.5,bq:1.2,3l:"50% 50% 0",2w:6s},1p:{ak:5,fc:"8f",9I:40,7M:10},2v:{1U:!1,bx:!1},3f:{3u:{$2d:e(),$3d:e()},2j:{$2d:e(),$3d:e()}},1m:19(){1d t=18;i.on("66."+a,19(){(t.3f.3u.$2d.1t||t.3f.3u.$3d.1t)&&t.9E()}),i.on("7s."+a,19(e){(t.3f.3u.$2d.1t||t.3f.3u.$3d.1t)&&t.aS(e)}),i.on("5y."+a,19(){(t.3f.3u.$2d.1t||t.3f.3u.$3d.1t)&&t.3x()}),o.1n.6n&&o.1n.iy&&(e(1o).on("p4."+a,19(){t.2v.bx&&t.iz(7q)}),e(1o).on("fd."+a,19(){t.9E()})),e(1o).on("2j.1F"+a+" 8P.1F"+a,19(){(t.3f.2j.$2d.1t||t.3f.2j.$3d.1t)&&t.2j()}),t.1p.ak*=o.o.g4?-1:1},jT:19(t,i,s,a){2M(18.2v.1U||(o.1N.2Y(18,{1U:!0}),18.1m()),e.4V(!0,i,18.bp,o.1h[a].1F,s.1F),s.2w.1F?i.2w=s.2w.1F:s.2w.1F=i.2w,i.7q.4i(/(3u|2j)/)||(i.7q="3u"),i.22.4i(/(2d,3d)/)&&(i.22="2d"),i.dZ){1j"3q":i.x=!1,i.y=!1;1y;1j"x":i.y=!1;1y;1j"y":i.x=!1}18.3f[i.7q]["$"+i.22]=18.3f[i.7q]["$"+i.22].1z(t)},fe:19(){1d t=o.1x.4n.$1v,i=o.1h.2z&&o.1h.2z.1F?o.1h.2z.1L:o.1h.1P.1L;if(o.1h[i].1a.$2h&&o.1h[i].1a.$2h.1a(o.1p.1m.1V).1F.1U&&o.1h[i].1a.52&&"4I"!==o.1h[i].1a.52){1d s,a="50% -"+.25*o.1c.1g+"px 0",n=o.1h[i].1a.$2h.1a(o.1p.1m.1V).1F;s=2q 0!==n.2f?2*n.2f:2q 0!==o.1h[i].1F.2f?2*o.1h[i].1F.2f:2*18.bp.2f,t.1a(o.1p.1m.1V,{1F:e.4V(!0,{},18.bp,o.1h[i].1F,{6h:n.6h,3l:a,2f:s})}),t.1J("1a-ls-1F","3o"),r.3g.21(t[0],{3l:a,2w:t.1a(o.1p.1m.1V).1F.2w*o.1E.1I}),"3d"===o.1h[i].1F.22||"3d"===n.22?18.3f.3u.$3d=18.3f.3u.$3d.1z(t):18.3f.3u.$2d=18.3f.3u.$2d.1z(t)}18.d0=!0},iC:19(){1d e=o.1x.4n.$1v;18.3f.3u.$2d=18.3f.3u.$2d.5n(e),18.3f.3u.$3d=18.3f.3u.$3d.5n(e),e.1J("1a-ls-1F","br"),18.d0=!1},9E:19(){e().1z(18.3f.3u.$2d).1z(18.3f.3u.$3d).1z(18.3f.2j.$2d).1z(18.3f.2j.$3d).3c(19(){1d t=e(18).1a(o.1p.1m.1V).1F;r.3g.21(e(18)[0],{3l:o.1N.2T.3l(t.3l,e(18),o.1c.$6c),2w:t.2w*o.1E.1I})}),18.9M=!0},iz:19(e){if(18.9M){1d t,i,s=1o.pb;0===s?(t=5*-1l(e.ff)*18.1p.7M*o.1E.1I,i=5*(18.1p.9I-1l(e.fg))*18.1p.7M*o.1E.1I):90===s?(t=5*-1l(e.fg)*18.1p.7M*o.1E.1I,i=5*(1l(e.ff)+18.1p.9I)*18.1p.7M*o.1E.1I):(t=5*1l(e.fg)*18.1p.7M*o.1E.1I,i=5*(18.1p.9I-1l(e.ff))*18.1p.7M*o.1E.1I),18.cT(t,i,"3u"),18.cJ(t,i,"3u")}2L 18.9E();o.1c.2v.89||18.d0||!o.1x.4n.$1v||18.fe()},5p:19(){e(1o).5p("2j.1F"+a),e(1o).5p("8P.1F"+a)},2j:19(){1d e=(("29"===18.1p.fc?o.1n.6e:o.1n.6e+(o.1n.55-o.1c.1g)/2)-o.1c.4A)*o.1E.1I*18.1p.ak;o.1c.2v.6N&&(e=0),18.9M||18.9E(),18.cT(0,e,"2j"),18.cJ(0,e,"2j")},aS:19(e){if(18.9M){o.1c.2v.89||18.d0||!o.1x.4n.$1v||18.fe();1d t=o.1c.ab+o.1c.1f/2,i=o.1c.4A+o.1c.1g/2,s=e.bh-t,a=e.ph-i;18.cT(s,a,"3u"),18.cJ(s,a,"3u")}2L 18.9E()},cT:19(t,i,s){18.3f[s].$2d.3c(19(){1d s=e(18);if("3o"===s.1J("1a-ls-1F")){1d a=s.1a(o.1p.1m.1V).1F,n=a.x?-t*(a.8i/bC)*1l(a.6h):0,l=a.y?-i*(a.8i/bC)*1l(a.6h):0;r.3g.2n(s[0],a.aL,{x:n,y:l})}})},cJ:19(t,i,s){18.3f[s].$3d.3c(19(){1d s=e(18);if("3o"===s.1J("1a-ls-1F")){1d a,n,l,d,u=s.1a(o.1p.1m.1V).1F;u.x?(n=-t/(iG/u.2f),l=-t*(u.8i/bC)*1l(u.6h)):(n=0,l=0),u.y?(a=i/(iG/u.2f),d=-i*(u.8i/bC)*1l(u.6h)):(a=0,d=0),r.3g.2n(s[0],u.aL,{3B:a,3E:n,x:l,y:d})}})},3x:19(){e().1z(18.3f.3u.$2d).1z(18.3f.3u.$3d).3c(19(){1d t=e(18);"3o"===t.1J("1a-ls-1F")?r.3g.2n(t[0],e(18).1a(o.1p.1m.1V).1F.bq,{x:0,y:0,3B:0,3E:0}):r.3g.21(t[0],{x:0,y:0,3B:0,3E:0})}),o.1x.4n.$1v&&18.iC(),18.9M=!1}},4Q:{62:19(e,t,i,s){1d a,r=4p o.1p.2V.5h.1u,n={};2e(a in r)2M(t){1j"in":n[a]=[r[a],r[a]],n[a][0]=i.5X(a)?i[a]:s.5X(a)?s[a]:r[a],n[a][1]=s.5X(a)?s[a]:r[a],e.1u.3m.9j[a]=n[a][1];1y;1j"1r":1j"1B":1j"1M":n[a]=[],n[a][0]=i.5X(a)?i[a]:r[a],n[a][1]=s.5X(a)?s[a]:i.5X(a)&&i[a]!==r[a]?i[a]:r[a],"1B"===t&&!0!==e.1B.8M&&-1!==e.1B.3r&&(e.1u.3m.bZ[a]=n[a][1]);1y;1j"bg":n[a]=[r[a],r[a]],i.5X(a)&&(n[a][0]=i[a]),s.5X(a)&&(n[a][1]=s[a])}1T n},2T:19(e){2e(1d t,i,s,a={},o=/(cN|hb|gZ|gN|cS-3X|gI|gA|gw)/i,r=0,n=(e=e.1K(" ")).1t;r<n;r++)(t=(s=e[r].1K("("))[0]).4i(o)&&(i=1l(s[1]),a[t]=i);1T a},8j:19(e,t){1d i=1q*e.5t[0].p;if("5S"==2t t){1d s="";2e(1d a in t)if("5S"==2t t[a]&&2===t[a].1t)2M(a){1j"cN":s+=" cN( "+(t[a][0]<t[a][1]?t[a][0]+1A.3Q(t[a][0]-t[a][1])/1q*i:t[a][0]-1A.3Q(t[a][0]-t[a][1])/1q*i)+"px )";1y;1j"cS-3X":s+=" cS-3X( "+(t[a][0]<t[a][1]?t[a][0]+1A.3Q(t[a][0]-t[a][1])/1q*i:t[a][0]-1A.3Q(t[a][0]-t[a][1])/1q*i)+"8m )";1y;5H:s+=" "+a+"( "+(t[a][0]<t[a][1]?t[a][0]+1A.3Q(t[a][0]-t[a][1])/1q*i:t[a][0]-1A.3Q(t[a][0]-t[a][1])/1q*i)+"% )"}r.3g.21(e.5t,{"-5F-1u":s,1u:s})}}},7S:{f6:19(e,t){1d i=t;if("pk"==e[1])i=t.fh(0).3h();2L if("pm"==e[1])i=t.fh(0).pn(19(){1T.5-1A.2J()});2L if("8f"==e[1]){1d s,a=1A.3J(t.1t/2);2e(i=[t[a]],s=1;s<=a;s++)i.51(t[a-s],t[a+s]);i.1t=t.1t}2L if("po"==e[1]){1d o,r=1A.3J(t.1t/2);2e(i=[t[0]],o=1;o<=r;o++)i.51(t[t.1t-o],t[o]);i.1t=t.1t}1T i},ij:19(t,i){e(".pp, .pq, .fQ",t).1z(i.24.$1Q).1e({3F:"3q",2Z:1}).3c(19(){2p 18.gX})},a4:19(e,t,i){2e(1d s in t){2e(1d a=[],r=0,n=e.28.5r.1t;r<n;r++)a[r]=o.1N.2T.dy(t[s],s);2p i[s],i.6r[s]=a}t=2u}}},1W:{1p:{47:6s,5s:6s,5M:cY},h7:19(e,t){if(o.1h.2z.1L&&o.1h.2z.1a.$2x.1t){1d s=o.1h.2z.1a.$2x,a=s.1a(o.1p.1m.1V).24.$8F;t&&(s.1a(o.1p.1m.1V).2R.eI=!0,a.5M(o.1b.1W.1p.5M,19(){s.5p("9J"),s.1a(o.1p.1m.1V).2R.eI=!1}))}if(o.1h.1P.1a.$2x.1t){1d r=o.1h.1P.1a.$2x,n=r.1a(o.1p.1m.1V).24.$8F,l=r.1a(o.1p.1m.1V).24.$bV;o.1n.6n&&(i.4y("ls-1n-is-6p")&&l.4y("ls-3Y-on-6p")||i.4y("ls-1n-is-6o")&&l.4y("ls-3Y-on-6o"))||5B(19(){r.5p("bW")},e?50:0),e||t?n.5s(o.1b.1W.1p.5M):n.1e({3t:"5J"}),r.1a(o.1p.1m.1V).2R.eJ=!0}}},2l:{1p:{iI:.35,iJ:.3},61:19(e){18.8I=e||"1P",18.3x(),o.1x.2l.4D.$1v&&18.4D.62(),o.1x.2l.43.$1v&&18.43.62(),o.1x.2l.2O.$1v&&18.2O.62()},3h:19(){if(o.1h.2z&&o.1h.2z.1a&&o.1b.1G){1d e=o.1b.1G.3v(),t=o.1h.2z.1a.1O*e/18.1p.iJ;o.1x.2l.4D.$1v&&18.4D.3a&&(o.1b.1G.6a(o.1b.2l.4D.3a),18.4D.3a.3h().5v(t)),o.1x.2l.43.$1v&&18.43.3a&&(o.1b.1G.6a(o.1b.2l.43.3a),18.43.3a.3h().5v(t)),o.1x.2l.2O.$1v&&18.2O.3a&&(o.1b.1G.6a(o.1b.2l.2O.3a),18.2O.3a.3h().5v(t))}},3x:19(){o.1x.2l.4D.$1v&&18.4D.3a&&18.4D.3x(),o.1x.2l.43.$1v&&18.43.3a&&18.43.3x(),o.1x.2l.2O.$1v&&18.2O.3a&&18.2O.3x()},4D:{3x:19(){18.3a&&(18.3a.5V(),18.3a=!1)},62:19(){18.3a=r.3g.48(o.1x.2l.4D.$1v[0],o.1h[o.1b.8I].1a.1O,{2o:!1,4r:!0,1e:{1f:0}},{2o:!1,1e:{},2s:r.9d.9c,aN:19(){o.1b.2l.4D.3a=!1},4k:19(e){e.5t.1X.1f="1q%",e.5t.1X.1f="e7( 1q% - "+o.1c.49.a2+"px )"},fi:["{5a}"],6V:19(e){e.5t.1X.1f=1A.a8(o.1c.1f,o.1c.1f*e.3v())+"px"},7W:["{5a}"]})}},43:{3x:19(){18.3a&&(o.1x.2l.43.$1v.1Y(!0,!0),18.3a.5V(),18.3a=!1)},62:19(){1d e=o.1x.2l.43.$1v.1D(".ls-ct-3T .ls-ct-3X")[0],t=o.1x.2l.43.$1v.1D(".ls-ct-1S .ls-ct-3X")[0],i=o.1h[o.1b.8I].1a.1O;18.3a=4p r.6P({4r:!0}).48(o.1x.2l.43.$1v[0],o.1b.2l.1p.iI,{2o:!1,4N:!0,1e:{2Z:0,3t:"5J"}},{2o:!1,1e:{2Z:o.1x.2l.43.$1v.1a("3b").2Z}}).48(e,i/2,{2o:!1,1e:{2f:0}},{2o:!1,1e:{2f:bb},2s:r.9d.9c},0).48(t,i/2,{2o:!1,1e:{2f:0}},{2o:!1,1e:{2f:bb},2s:r.9d.9c},i/2)}},2O:{3x:19(){18.3a&&(18.3a.5V(),18.3a=!1)},62:19(){1d t=18;t.3a=4p r.6P({4r:!0,aN:19(){o.1b.2l.2O.3a=!1}}),e.3c(o.1x.2l.2O.$7J,19(e,i){t.3a.1z(r.3g.48(o.1x.2l.2O.$7J[e][0],o.1h[o.1b.8I].1a.1O,{2o:!1,1e:{1S:0}},{2o:!1,1e:{},2s:r.9d.9c,4k:19(t){t.5t.1X.1S="e7( 1q% - "+o.1x.2l.2O.7C[e]+"px )"},fi:["{5a}"],6V:19(t){t.5t.1X.1S=(o.1x.2l.2O.aR[e]-o.1x.2l.2O.7C[e])*t.3v()+"px"},7W:["{5a}"]}),0),t.3a.1z(r.3g.48(o.1x.2l.2O.$e5[e][0],o.1h[o.1b.8I].1a.1O,{2o:!1,1e:{1f:0}},{2o:!1,1e:{},2s:r.9d.9c,4k:19(e){e.5t.1X.1f="1q%"},fi:["{5a}"],6V:19(t){t.5t.1X.1f=o.1x.2l.2O.e6[e]*t.3v()+"px"},7W:["{5a}"]}),0)})}}}},o.2K={4q:19(){if(o.o.2K&&0!==o.o.2K.1t){1d t=o.o.2K[0],i="5S"==2t t?t.fj:t;if(1o.2G.2K[i])o.2K.1m(i,t,!0),o.2K.4q();2L if(o.7l.fk||"5S"!=2t t)o.7l.fk?(1o.4K&&(4K.7g(o.1p.1c.aZ,"pA 4q 2K on iN:// 7X."),4K.6O("cM pC 4z 5o fl pE.")),o.o.2K.aC(0,1),o.2K.4q()):(1o.4K&&(4K.7g(o.1p.1c.aZ,"iP fl f5 pH!"),4K.6O(\'iP "\'+i+\'" fm fo pK in 1c 1m 3V, pL 4z pM fl f5 5n pN on 9G.\')),o.o.2K.aC(0,1),o.2K.4q());2L{if(-1!==1o.2G.8G.1i(i))1T 2q o.2K.iS(i);-1===1o.2G.ba.1i(i)&&-1===1o.2G.aY.1i(i)?(1o.2G.8G.51(i),e.pP({6v:-1===t.js.1i("9S://")&&-1===t.js.1i("8x://")?(1o.2G.7B?1o.2G.7B:1o.2G.cU+"/../2K/")+t.js:t.js,pQ:"8l",ga:19(){o.2K.1m(t.fj,t,!0),1o.2G.ba.51(i)},7g:19(e,t,s){1o.4K&&(4K.7g(o.1p.1c.aZ,i,"5o fm 5n fo dN!"),4K.7g("pR 7g 6O:",s)),1o.2G.aY.51(i)},pS:19(){1o.2G.8G.aC(1o.2G.8G.1i(i),1),o.2K.4q()}})):(o[i]||-1!==1o.2G.aY.1i(i)?o.o.2K.aC(0,1):o.2K.1m(i,t),o.2K.4q())}}2L o.1c.7n.8X()},1m:19(t,s,r){o.6x[t]=4p 1o.2G.2K[t](o,i,a,s.31),1o.2G.eV(o.6x[t].iU.iV,o.5o.6D)?(s.1e&&r&&e(\'<4W dK="iM" 4P="\'+(-1===s.1e.1i("9S://")&&-1===s.1e.1i("8x://")?(1o.2G.7B?1o.2G.7B:1o.2G.cU+"/../2K/")+s.1e:s.1e)+\'">\').2i("9K"),o.6x[t].1m&&o.6x[t].1m()):1o.4K&&4K.7g(o.1p.1c.aZ,t,"5o fm 5n fo dN! pX 9x 6D:",o.6x[t].iU.iV,"(ii pY:",o.5o.6D+")"),o.o.2K.aC(0,1)},iS:19(e){o.4F.fq=cl(19(){-1===1o.2G.ba.1i(e)&&-1===1o.2G.aY.1i(e)||-1!==1o.2G.8G.1i(e)||(9H(o.4F.fq),2p o.4F.fq,o.2K.4q())},1q)}},o.1c={d1:!0,4E:[],2v:{a0:!1,8K:!1,89:!1},5f:!1,8d:19(){1T 18.2v.a0||18.2v.8K||18.2v.89},4q:19(){if(!2D.3I.86(t))1T!1;o.2C.4b("iX")&&i.4f("iX"),o.1c.21.cC()},21:{cC:19(){if(o.eR=i[0].q2,o.6J=o.1N.2T.5h(o.1N.2T.iY(s)),o.8a={},o.o=e.4V(!0,{},o.1p.1m.3V,o.6J),o.o.7V/=3y,o.o.7V=o.o.7V>0?o.o.7V:.75,o.o.cO/=3y,1o.4K&&!0!==o.o.fr&&!0!==1o.2G.fr){1o.2G.fr=!0;1d t=1o.4K.6O?"6O":"5z";4K[t]("9x","v"+o.5o.6D,"8X"),4K[t]("q6 q7 ix q8 @ 8x://5x.fz.5d/")}1d a={fj:"1H",js:"1H/5x.1H.js",1e:"1H/5x.1H.1e"};-1!==2D.6Y.9w.1i("1H")&&1o.4K&&(-1!==2D.6Y.9w.1i("6v=")&&(1o.2G.7B=2D.6Y.9w.1K("6v=")[1].1K("&")[0],a.js=1o.2G.7B+"1H/5x.1H.js",a.1e=1o.2G.7B+"1H/5x.1H.1e"),"5S"==2t o.o.2K?o.o.2K.51(a):o.o.2K=[a]),(1o.2G.bm||1o.2G.fA)&&(1o.2G.cU=(1o.2G.bm||1o.2G.fA).23.2k(/\\\\/g,"/").2k(/\\/[^\\/]*$/,"")),"5S"==2t o.o.2K?o.2K.4q():o.1c.7n.8X()},dx:19(){1d s,r,n,l,d,u,p,c,h,m,f,g,v,y,b,S,w,x,T,C,k,I,O=o.1c,L=i.4c(),$=t.1X,B=1o.j0(t,2u),P=1l(t.qa),W=1l(t.qb),3p=1l(L.1f()),M=1l(L.1g()),z=o.o.ck,F=o.o.hk,D=o.o.22.4m();2M(o.2b&&o.1H.1z("81","3z.1X"),o.o.1f?s=-1==o.o.1f.1i("%")?1l(o.o.1f):o.o.1f:$.1f?s=-1==$.1f.1i("%")?1l($.1f):$.1f:z>0?(s=z,o.2b&&o.1H.1z("2I","3z.qc",z)):(s=P,o.2b&&o.1H.1z("2I","3z.qd",P)),n=s,o.o.1g?r=-1==o.o.1g.1i("%")?1l(o.o.1g):o.o.1g:$.1g?r=-1==$.1g.1i("%")?1l($.1g):$.1g:F>0?(r=F,o.2b&&o.1H.1z("2I","3z.qe",F)):(r=W,o.2b&&o.1H.1z("2I","3z.qf",M)),l=r,d=""!==$.4B?-1===$.4B.1i("%")?1l($.4B):$.4B:0,2q 0===o.6J.22&&(z>0&&F>0||"1q%"===s&&"1q%"===r?D="6F":z<=0&&F<=0&&(o.o.71<=0||o.o.71>0&&o.o.ce)?D=2q 0!==o.o.26&&!1===o.o.26?"eA":"26":o.o.71>0&&(D="6g")),D){1j"6g":-1!==s.1i("%")&&(o.2b&&o.1H.1z("2I","3z.j2",[D,s,P]),s=P),z<=0&&(z=s,o.2b&&o.1H.1z("2I","3z.j3",[D,s])),o.o.71<=0&&(o.o.71=z,o.2b&&o.1H.1z("2I","3z.6g",z)),-1!==r.1i("%")&&(p=M/(1q/1l(r)),o.2b&&o.1H.1z("2I","3z.qj",[D,r,p]),r=p),F<=0&&(F=r);1y;1j"6F":-1!==s.1i("%")&&(u=z>0?z:3p,o.2b&&o.1H.1z("2I","3z.6F",[D,s,u,3p,z]),s=u),z<=0&&(z=s,o.2b&&o.1H.1z("2I","3z.j3",[D,s])),-1!==r.1i("%")&&(p=F>0?F:e(1o).1g()/(1q/1l(r)),o.2b&&o.1H.1z("2I","3z.qk",[D,r,p,e(1o).1g(),F]),r=p),F<=0&&(F=r,o.2b&&o.1H.1z("2I","3z.ql",[D,r]));1y;1j"eA":1y;5H:o.6J.22=o.o.22=D="26",o.o.71=-1,-1!==s.1i("%")&&(s=P,o.2b&&o.1H.1z("2I","3z.j2",[D,s,P])),-1!==r.1i("%")&&(s=W,o.2b&&o.1H.1z("2I","3z.26",[D,r,W])),o.2b&&z>0&&o.1H.1z("2I","3z.qm",[D,z]),o.2b&&F>0&&o.1H.1z("2I","3z.qn",[D,F])}i.2a("ls-4U ls-"+D),i.4c().2a("ls-2F-qo"),o.o.hs&&o.o.eO&&("6g"===D||"6F"===D&&"d4"!==o.o.8B)&&i.j4(":5n(3I, 5j)").3c(19(){e(18).2a("ls-52-4J")}),o.6J.9a||"26"!==D||!o.6J.5X("ce")||o.6J.ce||(o.o.9a="2E",o.2b&&o.1H.1z("2I","3z.qq",D)),o.o.9a=o.o.9a.2k("1q% 1q%","eB"),c=z>0?z:s,h=F>0?F:r,"2E"===(g=t.1X.3U)?m="2E":""===g?m=1l(B.fs("7c-1S")):m=1l(t.1X.3U),"2E"===(v=t.1X.8W)?f="2E":""===v?f=1l(B.fs("7c-3T")):f=1l(t.1X.8W),m===f&&(""===g&&""===v&&(y=m,m="2E",f="2E"),i.1e({3U:"2E",8W:"2E"})),b=""!==$.7m?1l($.7m):1l(i.1e("4u-1S")),w=""!==$.7i?1l($.7i):1l(i.1e("4u-3T")),S=""!==$.7h?1l($.7h):1l(i.1e("4u-29")),x=""!==$.7e?1l($.7e):1l(i.1e("4u-1Z")),T=""!==$.7a?1l($.7a):1l(i.1e("79-1S-1f")),k=""!==$.77?1l($.77):1l(i.1e("79-3T-1f")),C=""!==$.76?1l($.76):1l(i.1e("79-29-1f")),I=""!==$.74?1l($.74):1l(i.1e("79-1Z-1f")),O.49={22:D,1f:s,1g:r,aQ:n,cP:l,8z:s/1q,8D:r/1q,9Y:z,ez:F,1I:c/h,4B:d,3U:m,8W:f,7m:b,7h:S,7i:w,7e:x,7a:T,76:C,77:k,74:I,a2:b+w+T+k,9X:S+x+C+I},o.2b&&(o.1H.1z("5z","3z.1X",[s,r,n,l,z,F,1l(c/h*1q)/1q,d>0?d:2q 0,[m,f]]),y&&o.1H.1z("2I","3z.7c",y)),e("5j").1J("id")?e("3I").1J("id")||e("3I").1J("id","ls-cC"):e("5j").1J("id","ls-cC"),"3A"!==$.6z&&"i3"!==$.6z&&(t.1X.6z="dl"),o.o.eK&&i[o.o.hi](o.o.eK),o.1c.$7v=e(\'<1C 2r="ls-c9-4U qt ls-4I" 1a-5x-eQ="\'+a+\'"></1C>\').2a(i.1J("2r")).aF("3I"),o.1c.$5Q=e(\'<1C 2r="ls-bA"></1C>\'),o.1c.$6c=e(\'<1C 2r="ls-1k"></1C>\').2i(o.1c.$5Q),o.1c.$gr=e(\'<1C 2r="ls-2h-8n"></1C>\').2i(o.1c.$6c),o.1c.$bQ=e(\'<1C 2r="ls-1R-qu"></1C>\').2i(o.1c.$6c),o.1c.$5Q.2i(i),!0===o.o.eg&&o.1n.6n?(i.2a("ls-8R"),i.3O(".ls-c9-6g-4U").2a("ls-8R"),o.o.9h=!1):o.1c.7n.ft(),o.o.8L&&o.1c.$5Q.1e({gh:"6v( "+o.o.8L+" )",qx:o.o.gS,qy:o.o.gR,cE:o.o.gQ,cK:o.o.gL}),o.1c.$5Q.1e({3e:o.o.8E}),"59"==o.o.8E&&!1===o.o.8L&&o.1c.$5Q.1e({2h:"3q 59"})},3V:19(){if(e("5j").1D(\'8a[fu*="9N"]\').1t&&(o.8a.ja=e("5j").1D(\'8a[fu*="9N"]\').1J("fu").1K("9N")[1]),e("5j").1D(\'8l[23*="5x"]\').1t&&-1!=e("5j").1D(\'8l[23*="5x"]\').1J("23").1i("?")&&(o.8a.jb=e("5j").1D(\'8l[23*="5x"]\').1J("23").1K("?")[1].1K("=")[1]),"6L"!=2t b5&&(o.t=e.4V({},b5)),"6L"!=2t cd&&(o.ct=e.4V({},cd)),o.2b&&("6L"!=2t qC?(o.1H.1z("5z","3z.hz",!1),"6L"==2t b5&&o.1H.1z("2I","3z.qD")):"6L"==2t b5&&o.1H.1z("2I","3z.qE")),"4t"==2t o.o.eo&&(o.1b.1k.1F.1p.9I=o.o.eo),"4t"==2t o.o.em&&(o.1b.1k.1F.1p.7M=o.o.em),o.o.ek&&(o.1b.1k.1F.1p.fc=o.o.ek),o.o.5g&&(o.o.5L=-1,o.o.aa=!0,o.o.5K=!1,o.o.9h=!1),o.o.aa){if(o.1c.5i=o.1n.6e>o.1c.4A-(o.1n.55-o.1c.1g)/2?"bU":"f8",o.o.5g){1d t,i,s,r=!0,n=4*o.o.h1;o.1n.2j.9p=8V,o.1b.1k.1s.6W=0,e(2D).on("qF."+a+" 8P."+a,19(e){o.1n.6n?((t=e.8J.6G[0].qG)>i?o.1n.2j.2F="9r":t<i&&(o.1n.2j.2F="9v"),s=i-t,i=t):(e.8J.jc>0?o.1n.2j.2F="9v":o.1n.2j.2F="9r",s=e.8J.jc),0!==1A.3Q(s)&&(o.1n.2j.bv?o.1n.2j.bv!==o.1n.2j.2F&&(o.1n.2j.bv=o.1n.2j.2F,o.1b.1k.1s.6W=0):o.1n.2j.bv=o.1n.2j.2F,"aX"===o.1c.5i&&(o.1E.cW(),s>=0?o.1b.1k.1s.f2():o.1b.1k.1s.bd(),r&&(82(o.2N.2j),r=!1,o.1b.1k.1s.6W=o.1b.1k.1s.6W<n?o.1b.1k.1s.6W+.25:n,o.2N.je=5B(19(){2p o.2N.je,r=!0,o.1n.2j.9p=o.1n.2j.9p>50?o.1n.2j.9p-50:50},o.1n.2j.9p))))})}e(1o).on("2j."+a,19(){o.1c.7n.5i()}),o.2N.jf=5B(19(){o.1c.7n.5i()},25)}o.1c.g1=!0},6l:19(){i.1J("1a-2z-1R",o.1h.2z.1L)}},7n:{8X:19(){o.2b&&o.1H.1z("5z","3z.6O",[o.5o.6D,o.5o.jg,o.6J.ce||"n/a or 1c 6D is qM 6.0.0",i.1J("id"),a,e.fn.bX,o.8a.jb,o.8a.ja],!0),o.1c.8X||(o.1c.8X=!0,18.eD())},eD:19(){o.o.4j&&""!==o.o.4j&&o.o.8y&&""!==o.o.8y?o.1x.4j.4q():o.1c.1m()},ft:19(){o.1n.6n&&!1!==o.o.eg||(o.1n.70<o.o.fT||o.1n.70>o.o.ef&&o.o.ef>0?o.1c.3Y():o.1c.5W())},5i:19(){if(2p o.2N.jf,o.o.5g){if(o.1n.2j.2F)("9v"===o.1n.2j.2F?o.1n.6e:o.1c.4A-(o.1n.55-o.1c.1g)/2)>("9v"===o.1n.2j.2F?o.1c.4A-(o.1n.55-o.1c.1g)/2:o.1n.6e)&&("9r"===o.1n.2j.2F&&"bU"===o.1c.5i||"9v"===o.1n.2j.2F&&"f8"===o.1c.5i)&&(o.1c.5i="aX",o.1E.cW(),o.1n.2j.aU())}2L{1d t=o.1n.6e+o.1n.55/2,i=o.1c.4A+o.1c.1g/2;(1A.3Q(t-i)<o.1n.55/2||o.1n.6e<o.1c.4A&&o.1n.6e+o.1n.55>o.1c.4A+o.1c.1g)&&(o.1c.5i="aX",e(1o).6M("2j."+a),o.2b&&o.1H.1z("5z","1w.qN",!1),o.1b.1G&&o.1b.1k.1s.2X())}}},1m:19(){82(o.2N.e1),82(o.2N.e2),82(o.2N.e3),82(o.2N.e4),o.1n.jh(),o.1c.21.dx(),o.1c.21.3V(),o.1h.1m(),o.1n.5u.21(),o.1W.1m(),o.1x.2l.1m(),o.1x.cr.1m(),o.5Z.1m(),o.1x.4n.1m(),o.2m.1m(),o.1w.1m(),o.1h.21.4d(),o.1x.2m.1m(),o.1E.1c(),o.3i.1m(),e(1o).on("1E."+a,19(){o.1c.7n.ft(),"aX"===o.1c.5i&&o.o.5g&&o.1E.cW(),o.1c.d1&&o.1E.5C()}),o.2b&&(e(1o).6M(".1H"+a),e(1o).on("1E.1H"+a,19(){o.1H.1z("5z","1E.1o",o.1n.70,!0)})),e(1o).on("fd."+a,19(){o.1n.fv(),o.1E.5C()}),o.1n.fv(),e(1o).5p("1E."+a),e(1o).5p("fd."+a),o.2C.4b("jj")&&i.4f("jj",o.2C.4M()),o.1N.2Y(o.1c,{6B:!0}),o.1c.2v.jk?o.2C.9m("jl"):o.1w.6S(o.1h.3j.1L)},3Y:19(){i.2a("ls-8R"),i.3O(".ls-c9-6g-4U").2a("ls-8R")},5W:19(){i.3W("ls-8R"),i.3O(".ls-c9-6g-4U").3W("ls-8R")}},o.1N={2T:{3l:19(t,i,s){1d a=e.3N(t),r=a.1K(" "),n="",l=["qU","qV"],d=[o.1c.1f,o.1c.1g];a=a.2k("qW","0").2k("qX","1q%").2k("qY","50%").2k("qZ","50%").2k("dp","0").2k("dq","1q%").2k("1S","0").2k("3T","1q%").2k("8f","50%").2k("r0","50%").2k("29","0").2k("1Z","1q%").1K(" ");2e(1d u=0;u<a.1t;u++)if(-1!==r[u].1i("1c")){o.1b.1k.1s.6b=!0;1d p=i.1a(o.1p.1m.1V).24.$1Q[0].1X;n+=u<2?d[u]/(1q/1l(a[u]))-1l(p[l[u].4m()])-1l(p["7c"+l[u]])+"px ":"hI"}2L{if(u<2&&i&&s)2M(u){1j 0:d=s.1f();1y;1j 1:d=s.1g()}-1!==a[u].1i("%")?n+=u<2&&i&&s?d/(1q/1l(a[u]))+"px ":a[u]+" ":n+=1l(a[u])*o.1E.1I+"px "}1T e.3N(n)},4S:19(e,t){1d i,s,a;1T"5l"==2t e?(-1!==(e=e.4m()).1i("r1")||-1!==e.1i("jK")?i=r.9d.9c:(s=e.4i(/(jm|dO|dD)(.+)/)[2],a=r[s.gl(0).eN()+s.fh(1)],-1!==e.1i("jm")?i=a.cb:-1!==e.1i("dD")?i=t?a.5O:a.6I:-1!==e.1i("dO")&&(i=t?a.6I:a.5O)),i):e},27:19(t,i,s,a){1d r=e.4V({},t);1T e.3c({3X:"2f",5R:"3B",69:"3E"},19(e,t){e in r&&(r[t]=r[e],2p r[e])}),"6H"===s?r.4s=r.4O=r.jn=1:r.fw!==a&&(r.4s=r.4O=r.jn=r.fw,2p r.fw),r.47&&(r.47="6H"===s?r.47/3y:r.47),2q 0===i&&(i="r5"),r.2s=o.1N.2T.4S(i),r},dy:19(e,t){if(e&&-1!==e.1i("(")&&-1!==e.1i(",")&&-1!==e.1i(")")){1d i=e.1K("(")[1].1K(")")[0].1K(","),s=1;1T i[0]=2P(i[0]),i[1]=2P(i[1]),-1!==t.1i("2U")&&(s=1q,i[0]*=s,i[1]*=s),1A.3J(1A.2J()*(i[1]-i[0]+1)+i[0])/s}1T e},5h:19(e,t){if("5l"==2t e)1T o.1N.2T.fx(e,t);if("5S"==2t e){2e(1d i in e)e[i]=o.1N.2T.fx(e[i],t);1T e}1T e},fx:19(t,i){if("7R"==t||"1U"==t||"av"==t)1T!0;if("aU"==t||"br"==t||"r7"==t)1T!1;if("5l"==2t t&&-1!==t.1i(o.1p.1m.eP)){2e(1d s=t.1K(o.1p.1m.eP),a=[],r=0;r<s.1t;r++)a[r]=e.7D(s[r])?2P(e.3N(s[r])):e.3N(s[r]);1T a}1T i?""+1l(t)=="r8"?0:1l(t):e.7D(t)?2P(t):t},iY:19(t){1T e.3c({r9:"4d",ra:"5L",gx:"eE",rb:"ck",rc:"ck",rd:"8e"},19(e,i){e in t&&(t[i]=t[e],2p t[e])}),t}},gm:19(t){2e(1d s,a=i.j4(),r=a.1t,n=1q,l=0;l<r;l++)if("2E"!==(s=1o.j0(a[l]).fs(t))){if(-1!==s.1i("px"))1T o.1c.$ep=e(a[l]),e(a[l]);-1!==s.1i("%")&&(n=n/1q*1l(s),o.1c.$er=n)}},eS:19(e,t,i){1d s=[];if("7Y"==i)2e(1d a=0;a<e;a++)2e(1d o=0;o<t;o++)s.51(a+o*e);2L 2e(1d r=e-1;r>-1;r--)2e(1d n=t-1;n>-1;n--)s.51(r+n*e);1T s},dE:19(e){2e(1d t,i,s=e.1t;0!==s;)i=1A.3J(1A.2J()*s),t=e[s-=1],e[s]=e[i],e[i]=t;1T e},ho:19(e){1d t=0;2e(1d i in e)e.5X(i)&&++t;1T t},cf:19(e){1T e[0].eh?e[0].eh:e.1a("23 ")?e.1a("23 "):e.1J("23")},fS:19(e){1T!!e.1J("e0")&&e.1J("e0")},2Y:19(e,t,s){if(e&&e.2v){1d a=o.1w.5f();if(s)e.2v[t]=s;2L 2e(1d r in t)e.2v[r]=t[r];1d n=o.1w.5f();e==o.1w&&(o.2C.4b("jq")&&i.4f("jq",o.2C.4M()),n!=a&&(n?o.2C.4b("jr")&&i.4f("jr",o.2C.4M()):o.2C.4b("jt")&&i.4f("jt",o.2C.4M())))}},ju:19(){2e(1d e in o.2N)82(o.2N[e]),2p o.2N[e];2e(1d t in o.4F)9H(o.4F[t]),2p o.4F[t]},jv:19(){o.1b.1G&&(o.1b.1G.5G().6X().5V(),2p o.1b.1G),o.1b.5k&&(o.1b.5k.5V(),2p o.1b.5k),o.1b.3G&&(o.1b.3G.5G().6X().5V(),2p o.1b.3G),r.3g.rj(i.1D(".ls-bg, .ls-2V, .ls-1Q, .ls-hU, .ls-hV").2S())},gj:19(){o.1b.1G&&(o.1b.1G.5G().3v(0).6X().5V(),2p o.1b.1G),o.1b.5k&&(o.1b.5k.5G().3v(1).6X().5V(),2p o.1b.5k),i.1D(".ls-2V:5n(.ls-bg-4v)").3c(19(){1d t=e(18).1a(o.1p.1m.1V);t.1B.3M&&(t.1B.3M.1Y().6X(),2p t.1B.3M,r.3g.21(t.24.$7N[0],t.3x.dg)),r.3g.21(t.24.$1Q[0],t.3x.dh)})},jw:19(){e(1o).1z("3I").1z(i).1z(i.1D("*")).1z("."+a).6M("."+a+" .1H"+a+" .1F"+a+" .fy"+a),i.6M()}},o.1n={$aE:e("3I").1t?e("3I"):e("5j"),6n:!!d3.bo.4i(/(jA|jB|jC|rr|rs|rt|ru|rv rw|rx|ry rz|rA 7)/i),iy:!!1o.rB,2j:{8H:[32,33,34,35,36,37,38,39,40],aU:19(){1o.cZ&&1o.cZ("jD",18.41,!1),1o.jE=18.rE,1o.cD=2D.cD=18.41,1o.jG=18.41,2D.jH=18.jI},7R:19(){1o.jJ&&1o.jJ("jD",18.41,!1),1o.cD=2D.cD=2u,1o.jE=2u,1o.jG=2u,2D.jH=2u},41:19(e){(e=e||1o.7q).41&&e.41(),e.rK=!1},jI:19(e){if(-1!==o.1n.2j.8H.1i(e.rL))1T o.1n.2j.41(e),!1}},fB:19(){1o.aW?1o.aW().bM?1o.aW().bM():1o.aW().jM&&1o.aW().jM():2D.jN&&2D.jN.bM()},5u:{jO:19(){"6F"==o.1c.49.22&&"k3"==o.o.8B&&(o.1c.ey=o.1c.4A),o.1N.2Y(o.1c,{6N:!0}),e("3I, 5j").2a("ls-5u"),o.1c.6K.fD(),i.5p("5y"),o.1n.fB()},fE:19(){o.1N.2Y(o.1c,{6N:!1}),o.1E.5C(),e("3I, 5j").3W("ls-5u"),o.1n.fB()},fF:19(){o.1n.5u.1v()?(o.1n.5u.fE(),2D.fG()):o.1n.5u.jO()},21:19(){o.o.hr&&(2D.rW||2D.rX||2D.rY||2D.rZ)&&(i.5A(\'<1C 2r="ls-5u-1Q"></1C>\'),o.1c.$6K=i.3O(".ls-5u-1Q"),o.1c.6K=o.1c.$6K[0],o.1c.6K.fD=o.1c.6K.fD||o.1c.6K.s0||o.1c.6K.s1||o.1c.6K.s2,2D.fG=2D.fG||2D.s3||2D.s4||2D.s5,e(2D).on("s6."+a+" s7."+a+" s8."+a+" s9."+a,19(){o.1n.5u.1v()||o.1n.5u.fE()}),o.1c.$6K.on("sa."+a,19(){o.1n.5u.fF()}))},1v:19(){1T 2D.sb||2D.sc||2D.sd||2D.sf}},fv:19(){18.1f=jU.1f,18.1g=jU.1g,18.70=e(1o).1f(),18.55=e(1o).1g(),18.si=e(2D).1f(),18.ib=e(2D).1g(),18.6e=e(1o).cc(),18.fH=e(1o).jW(),18.1I=18.1f/18.1g,o.1c.4A=i.5Y().29,o.1c.ab=i.5Y().1S},jh:19(){1d t,s=18;e(1o).on("1E.fy"+a,19(){s.70=e(1o).1f(),s.55=e(1o).1g(),s.1I=s.1f/s.1g,o.1c.4A=i.5Y().29,o.1c.ab=i.5Y().1S}),e(1o).on("2j.fy"+a,19(){s.6e=e(1o).cc(),s.fH=e(1o).jW(),o.1c.4A=i.5Y().29,o.1c.ab=i.5Y().1S}),e(1o).on("8P",19(e){s.6e=1o.sl,s.fH=1o.sm,1==(t=e.6G?e.6G:e.8J.6G).1t&&(s.jL=t[0].e9)})}},o.2C={4b:19(i,s){1d a=e.sn(s||t,"bJ");1T!(!a||!a[i])},9m:19(t,s,r,n){if(!o.1c.8d())if("4t"==2t t)t>0&&t<o.1h.3r+1&&t!=o.1h.2z.1L&&o.1w.6S(t,!0,!0);2L 2M(t){1j"b3":o.1n.b3=!0;1j"so":1j"2H":o.2m.2H();1y;1j"b1":o.1n.b1=!0;1j"2c":1j"1P":o.2m.1P();1y;1j"sp":1j"3k":o.2m.3k()}2M(t){1j"sq":o.6x.b8&&o.6x.b8.bJ.5W();1y;1j"ss":o.6x.b8&&o.6x.b8.bJ.3Y();1y;1j"st":s&&o.1k.8u.1a(s,r,n);1y;1j"su":1j"sv":o.1E.5C();1y;1j"sx":1j"6m":o.1b.1G&&(o.1b.1G.3v(0),o.1b.1G.2X());1y;1j"sy":1j"3h":o.1b.1G&&(o.1b.1G.i9()?o.1b.1G.2X():o.1b.1G.3h(),s&&(o.1b.1k.1s.i5=!0));1y;1j"sz":1j"1Y":o.2m.1Y();1y;1j"sA":1j"5G":o.1b.1G&&o.1b.1G.1Y(),o.1b.3G&&o.1b.3G.1Y(),o.1W.1Y(!1);1y;1j"sB":o.1k.2S("3o").3c(19(){o.1W.dV(e(18))});1j"sC":1j"8p":o.1b.1G&&(o.1b.1G.5v()<.sD&&o.1b.1k.1s.8p(),o.1b.1G.2X()),o.1b.3G&&o.1b.3G.2X();1y;1j"sE":1j"fF":o.1c.5f?(i.53("8p"),o.1c.5f=!1):(i.53("5G"),o.1c.5f=!0);1y;1j"3x":1j"sF":1y;1j"sG":1j"sH":o.1b.1G&&(o.1b.1G.3v(0),o.1b.1G.1Y()),o.1W.1Y(!0);1y;1j"jl":1j"5V":if(o.1c.2v.6B){if(o.1N.ju(),o.1N.jv(),o.1k.$5C.sI(),o.2C.4b("jY")&&i.4f("jY"),o.1c.2v.jZ||s){if(o.1c.$7v.6a(),o.1x.2l.2O.$5w)2e(1d l=0;l<o.1x.2l.2O.$5w.1t;l++)o.1x.2l.2O.$5w[l]gn 5D&&o.1x.2l.2O.$5w[l].6a();o.2C.4b("k0")&&i.4f("k0"),i.4c(".ls-5u-1Q").6a()}o.1N.jw(),1o.2G.hH(a)}2L o.1N.2Y(o.1c,{jk:!0,jZ:s||!1});o.1c.5i="bU",o.1n.2j.7R()}},4M:19(){1T{1a:o,sM:o.o,eQ:a,5t:t,1c:i,2v:o.1c.2v,8d:o.1c.8d(),2C:19(e){i.53(e)},1h:{3j:{1L:o.1h.3j.1L,4H:o.1h.2S.4H(o.1h.3j.1L),1a:o.1h.3j.1a},2H:{1L:o.1h.2H.1L,4H:o.1h.2S.4H(o.1h.2H.1L),1a:o.1h.2H.1a},2z:{1L:o.1h.2z.1L||o.1h.3j.1L,4H:o.1h.2S.4H(o.1h.2z.1L),k1:o.1k.2S("2z,in"),k2:o.1k.2S("2z,1M"),1s:o.1b.1G,1a:o.1h.2z.1a},1P:{1L:o.1h.1P.1L,4H:o.1h.2S.4H(o.1h.1P.1L),k1:o.1k.2S("1P,in"),k2:o.1k.2S("1P,1M"),1a:o.1h.1P.1a},3r:o.1h.3r},sP:o.1b.3G,1w:{2v:o.1w.2v,3R:o.1w.3R,2F:o.1w.2F,5f:o.1w.5f()},5L:{46:o.o.5L,2z:o.1w.b9}}}},o.7l={9P:!!d3.bo.4i(/(jA|jB|jC|sQ)/i)&&!d3.bo.4i(/(sR|sS|sT)/i),fk:-1!==2D.6Y.4P.1i("iN://"),hj:19(){2e(1d t=e("<1C>"),s=!1,a=!1,o=["sU","sV","sW","sX","sY"],r=["sZ","t0","t1","t2","t3"],n=o.1t-1;n>=0;n--)s=s||2q 0!==t[0].1X[o[n]];2e(1d l=r.1t-1;l>=0;l--)t.1e("3F-1X","fM-3d"),a=a||"fM-3d"==t[0].1X[r[l]];1T s&&2q 0!==t[0].1X[o[4]]&&(t.1J("id","ls-t5").2i(i),s=3===t[0].t6&&9===t[0].ab,t.6a()),s&&a},g5:-1!==d3.bo.1i("t7/5")},o.6x={},o.2N={},o.4F={},o.1H={3V:{}},o.5o={6D:"6.7.1",jg:"t8. kw. di."},o.1c.4q()}}(5D);', 62, 1808, '||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||this|function|data|transitions|slider|var|css|width|height|slides|indexOf|case|layers|parseInt|init|device|window|defaults|100|hover|timeline|length|filter|element|slideshow|gui|break|add|Math|loop|div|find|resize|parallax|_slideTimeline|debug|ratio|attr|split|index|out|functions|duration|next|wrapper|slide|left|return|enabled|dataKey|media|style|stop|bottom|transitionProperties|set|type|src|elements||responsive|transition|textIn|top|addClass|debugMode|nextSlide||for|rotation|clip|background|appendTo|scroll|replace|timers|navigation|to|autoCSS|delete|void|class|ease|typeof|null|state|transformPerspective|backgroundVideo|kenBurns|current|thumbnail|textOut|api|document|auto|direction|_layerSlider|prev|warn|random|plugins|else|switch|timeouts|slidebar|parseFloat|mediaSettings|mediaProperties|get|convert|scale|layer|startAt|play|setStates|opacity||settings|||||||||_transition|original|each||backgroundColor|wrappers|TweenMax|reverse|yourLogo|first|start|transformOrigin|values|nav|active|_|none|count|curSlide|display|cursor|progress|textOutNodesTo|reset|1e3|sliderInit|static|rotationX|from|player|rotationY|transform|_slideTransition|youtube|body|floor|textInNodesFrom|img|_timeline|trim|closest|borderRadius|abs|sequence|children|right|marginLeft|options|removeClass|rotate|hide|color||preventDefault|vimeo|circle|||max|delay|fromTo|initial|iframe|hasEvent|parent|firstSlide|loopToCSS|triggerHandler|styleSettings|outLayerToCSS|match|skin|onComplete|hoverToCSS|toLowerCase|shadow|totalDuration|new|load|paused|scaleX|number|padding|video|isEmptyObject|animation|hasClass|the|offsetTop|maxWidth|volume|bar|thumbnails|intervals|hoverShouldBeConverted|deeplink|hidden|visible|console|inLayerFromCSS|eventData|immediateRender|scaleY|href|filters|outerWidth|easing|outerHeight|container|extend|link|text|should|translateY||push|overflow|layerSlider|autoplay|viewportHeight|translateX|controls|inLayerToCSS|transparent|self|normal|image|com|300|isPaused|playByScroll|properties|positionToViewport|html|_forceLayersOut|string|click|not|plugin|trigger|transitionoutstart|nodes|fadeIn|target|fullscreen|timeScale|containerElement|layerslider|mouseleave|log|wrap|setTimeout|all|jQuery|marginTop|webkit|pause|default|html5|block|pauseOnHover|cycles|fadeOut|slideBackground|easeIn|skewX|innerWrapper|rotateX|object|maxRatio|skewY|kill|show|hasOwnProperty|offset|preload||create|createTransition|clipShouldBeConverted|repeat|getStyle|mouseenter|showinfo|inLayerStyleShouldBeConvertedFrom|rotateY|remove|shouldRestart|layersWrapper|globalhover|winScrollTop|outLayerStyleShouldBeConvertedTo|fullwidth|level|box|change|vpcontainer|attributes|replay|isMobile|tablet|phone|visibility|cycle|500|tile|thumbnailNavigation|url|loopstart|initializedPlugins|loopLayerShouldBeConverted|position|fontSize|isLoaded|round|version|zoom|fullsize|touches|after|easeOut|userInitOptions|fullscreenWrapper|undefined|off|inFullscreen|info|TimelineMax|clipTo|ceil|changeTo|preImages|createCuboids|onUpdate|timeScaleModifier|clear|location|before|viewportWidth|responsiveUnder|lsSliderUID|running|borderBottomWidth||borderTopWidth|borderRightWidth|cols|border|borderLeftWidth|_layerSliders|margin|zIndex|paddingBottom|durationIn|error|paddingTop|paddingRight|rows|loopend|browser|paddingLeft|check|transitioninend|slideTransition|event|outClipShouldBeConverted|mousemove|customtransition2d|customtransition3d|hiddenWrapper|removeAttr|allinend|aria|allMediaLayers|label|pluginsPath|sliderContainerElementWidth|isNumeric|onStart|curTiles|outerWrapper|finished|textinstart|sliderContainerElement|globals|thumb|sensitive|loopWrapper|transitioninstart|shiftNodes|timelineIsCalculated|enable|splitType|transition2d|slideIndex|forceLayersOutDuration|onUpdateParams|protocol|forward|curSrc|kbScale|group|clearTimeout|hoverWrapper|minfontsize|span|contains|audio|minmobilefontsize|animatingSlides|meta|layerInit|getTiming|isBusy|shuffleSlideshow|center|transformProperties|poster|distance|animate|parallaxWrapper|script|deg|videos|jump|resume|kbRotation|textoutstart|textOutShouldBeConverted|_linkTween|update|textInShouldBeConverted|transition3d|https|skinsPath|percW|isPopup|fullSizeMode|clipWrapper|percH|globalBGColor|bgWrapper|pluginsBeingLoaded|keys|curNext|originalEvent|changingSlides|globalBGImage|yoyo|repeatDelay|percentWidth|touchmove|percentHeight|forcehide|substring|prop|textinend|250|marginRight|initialized|col|overlay||slidebuttons|styleProperties|wrapped|textoutend|always|setHover|firstStart|pausedByVideo|transitionoutend|slideBGSize|append|easeNone|Linear|scale2D|outLayerStyleToCSS|groupEnd|autoStart|normalized|afterIn|shouldBeConverted|inLayerStyleFromCSS|methods|layerShouldBeConverted|layerStyleTo|timeout|layerStyleFrom|up|portrait|textLayer|layerTo|down|hash|LayerSlider|slideOut|textInNodesTo|byline|layerFrom|createPlayer|layerTransition|calculateTransformProperties|title|page|clearInterval|centerDegree|stopBackgroundVideo|head|inLayerShouldBeConverted|transformPropertiesCalculated|WordPress|videoURL|isSafari|videoElement|playingInCurSlide|http|mediaLayer|stopped|tnHeight|te|skinHeight|layersWidth|pauseLayers|preloadingImages|easeInOutQuint|skinWidth|nodesTo|setRandomProperties|slideInSequence|slidechangeonly|originalLeft|min|9999|startInViewport|offsetLeft|prevNext|originalRight||originalTop|getAttribute|originalBottom|unselectable|Scroll|scrollModifier|autoPauseSlideshow|inClipShouldBeConverted||inLayerTo|outLayerShouldBeConverted|pausedByLastCycle|inLayerStyleShouldBeConvertedTo|pausedByHover||navStartStop|true|getXY|outLayerTo|allinandloopend|outLayerStyleShouldBeConvertedFrom|backgroundvideo|notactive|splice|setBackgroundVideo|overflowWrapper|prependTo|hoverImage|loopClipShouldBeConverted|buttonStart|buttonStop|setStartStop|durationMove|responsiveLayers|onReverseComplete|onCompleteCallback|name|originalWidth|containerElementWidth|mouseMove|transitionDuration|disable|twoWaySlideshow|getSelection|inside|pluginsNotLoaded|errorText|touchEndX|touchNext|youTubeIsReady|touchPrev|durationOut|layerSliderTransitions|cover|150|popup|curCycle|pluginsLoaded|180|fadeTo|scrollBackwards||back||pageX|srcSet|srcset|ontouchstart|sizes|currentScript|forceDirection|userAgent|defaultProperties|durationLeave|disabled|staticfrom|staticto|updateTo|lastDirection|clone|ready||showUntil|inner|clipSlideTransition|2e3|showThumbnail|videoEnded|randomized|seekTo|clipFrom|_tween|events|layerStyleShouldBeConvertedFrom|layerStyleShouldBeConvertedTo|empty|touchStartX|nodesFrom|customZIndex|slideBGWrapper|desktop|navButtons|calculatedTimeShift|under|bgOuterWrapper|playBackgroundVideo|jquery|hoverBottomNav|afterLoop|bgFrom|bgTo|eventCallback|notstatic|removeFromTimeline|checkSlideshowState|hideThumbnail|timeShift|bgonly|wp|playMedia|easeInOut|scrollTop|layerSliderCustomTransitions|sliderVersion|getURL|inLayerStyleToCSS|select|youtu|nocookie|layersContainerWidth|setInterval|tnContainerWidth|outLayerStyleFromCSS|bgvideo|outLayerStyleTo|outClipTo|loadingIndicator|YT||textOutNodesFrom|now|Date|loopTo|last|setMediaElements|setProperties|saved|global|onmousewheel|backgroundSize|fillmode|letterSpacing|lineHeight|endedInCurSlide|animate3D|backgroundPosition|sliderElement|Please|blur|sliderFadeInDuration|originalHeight|bullets|mouseEnter|hue|animate2D|scriptPath|vimeoIsReady|viewport|addLayers|750|addEventListener|shadowIsChecked|shouldResize|onSlide|navigator|fitheight|hoverTo|loopFromCSS|outClipToCSS|outLayerStyleFrom|smartLinks|outLayerFromCSS|outLayerFrom|inClipTo|inLayerStyleTo|tnAlt|png|loopWrapperOnSlideChange|wrapperOnSlideChange|05|slidesData|tagName|relative|linkto|alloutandloopend||slidertop|sliderbottom|ariaLabel|textoutandloopend|outer|wrapperData|splitTypeKeys|alwaysOnTop|styles|randomProperties|words|mix|blend|mode|easeout|shuffleArray|indexOfSlideInSequence|cycleSlideIndex|imagesOfSlide|waitingForYouTube|waitingForVimeo|rel|loadYouTube|isYouTubeReady|loaded|easein|preloadBackgroundVideo|shouldPlay|playVideo|loadVimeo|isVimeoReady|videopreview|playIfAllowed|forceHide|hoverWrapperInner|switchHelper|axis|alt|skinLoad1|skinLoad2|skinLoad3|skinLoad4|progressBarElement|elementWidth|calc|started|clientX|useSrcset|allowRestartOnResize|slideOnSwipe|popupIsVisible||hideOver|hideOnMobile|currentSrc|yourLogoLink|setLayers|parallaxCenterLayers|originalLayer|parallaxSensitivity|waitForJSApisLoaded|parallaxCenterDegree|parentWithNumericWidthValue||parentWithNumericWidthValuePercent|loopClipTo|autoPlayVideos|tnInactiveOpacity|tnActiveOpacity|tnWidth|hoverFrom|heroTop|layersHeight|fixedsize|stretch|navPrevNext|skins|forceCycles|slideshowOnly|playByScrollSkipSlideBreaks|hoverFromCSS|willBePaused|isPreloaded|insertSelector|setTransition|custom|toUpperCase|fitScreenWidth|lsDataArraySplitChar|uid|originalMarkup|sortArray|toString|nextTiles|checkVersions|topleft|bottomright|topright|bottomleft|origin|concat|scrollForward|slideTimeline|mouseLeave|are|setNodesSequence|modifyTimeScale|over|canhover|hoverIn|hovered|centerLayers|orientationchange|addShadow|gamma|beta|slice|onCompleteParams|namespace|usesFileProtocol|files|has||been|your|pluginLoaded|hideWelcomeMessage|getPropertyValue|showHide|content|getDimensions|scale3d|_properties|setter|kreaturamedia|lsScript|removeSelection|slidersList|requestFullscreen|exit|toggle|exitFullscreen|winScrollLeft|GSAP|touch|which|transitionorigami|preserve|hashChange|preloadedWidth|preloadedHeight|line|loopClipToCSS|getALT|hideUnder|startat|optimizeForMobile|yourLogoTarget|shift|lazy|fade|10px|canShow|yourLogoStyle|thumbnailsAreLoaded|parallaxScrollReverse|isOld|Image|nextSlideIndex|preloadedImagesCount|lastIndexOf|success|lines|nodeName|waitForWrap|slideout|nocontrols|sliderWillResize|backgroundImage||resetSlideTimelines|sliderDidResize|charAt|getSliderClosestParentElementWidthNumericValueOfProperty|instanceof|youtubePreview|wrapping|fitwidth|bgVideosWrapper|inClipToCSS|normalizedSequence|imageLayer|translateZ|sepia|forceLoopNum|fixed|sequences|saturate|contain|showSlideBarTimer|showCircleTimer|showBarTimer|hoverPrevNext|touchNav|keybNav|invert|Width|Height|globalBGPosition|rect|grayscale|directionAtSlideTransitionStart|forced|globalBGSize|globalBGAttachment|globalBGRepeat|slideChangeWillStart|parentNode|overflowx|overflowy|_gsTransform|restart|contrast|playByScrollStart|playByScrollSpeed|slideTransitionType|transitionType|slideChangeDidStart|preferBlendMode|slideBGPosition|changeBackgroundVideo|call|slideChangeWillComplete|prepare|brightness|amp|smart|applyBG|wmode|slideChangeDidComplete|opaque|insertMethod|supports3D|layersContainerHeight|custom3d|custom2d|inClipFromCSS|countProp|videoThumbnailURL|CUSTOM|allowFullscreen|preventSliderClip|linkTo|javascript|pagetop|inClipFrom|substr|pagebottom|customTransitions|setVolume|inLayerStyleFrom|alloutend|horizontal|specified|large|depth|removeSlider|0px|front|strong|inLayerFrom|addEvent|notification|currentTime|mirror|volumeIsSet|loopFrom|tn|createStartStop|curtile|nexttile|createSides|above|autoRemoveChildren|keyframe|use|resetStates|slideTimelineDidStart|absolute|slideTimelineDidReverseComplete|shouldReplay|slideTimelineDidUpdate|parallaxtransformperspective|slideTimelineDidCreate|reversed|slideTimelineDidComplete|docHeight|parallaxdistance||||timing1|timing3|you|resetNodes|parallaxrotation|oldjquery|staggerFromTo||parallaxrotate|parallaxdurationleave|sides|createTimeline||reverseTimeScale|parallaxdurationmove|hoverOut|parallaxtransformorigin|and|supportOrientation|deviceTurn|textinandloopend|parallaxaxis|removeShadow|parallaxevent|parallaxtype|library|4e3|transitioninandloopend|fadeInDuration|reverseDuration|timelineHierarchy|createStyleSheet|stylesheet|file|previous|Plugin|linkedToSlide|slideIndexes|checkLoaded|kenburnsscale|pluginData|requiredLSVersion|btmMod|sliderWillLoad|oldProperties|resizeShadow|getComputedStyle|like|percWidth|conWidth|parents|kenburnsrotate|looks|It|kenburnsrotation|kenburnszoom|wpVersion|lswpVersion|deltaY|issue|scroll2|checkPosition|releaseDate|setBasicEvents|pan|sliderDidLoad|shouldBeDestroyed|destroy|easeinout|scaleZ|timer|kenburnspan|slideshowStateDidChange|slideshowDidPause||slideshowDidResume|clearTimers|clearTimelines|clearEvents|hider|showNotice|half|iPhone|iPod|iPad|DOMMouseScroll|onwheel|wrapperOnTimelineEnd|ontouchmove|onkeydown|preventDefaultForScrollKeys|removeEventListener|linear|touchX|removeAllRanges|selection|enter|LS_GSAP|parallaxWrapperData|touchstart|touchend|addLayer|screen|loading|scrollLeft|keyboard|sliderDidDestroy|sholudBeRemoved|sliderDidRemove|layersIn|layersOut|hero|styleWidth|styleHeight|loopdelay|insertAfter|borderTopLeftRadius|borderTopRightRadius|borderBottomRightRadius|borderBottomLeftRadius|loopclip|bgcolor|font|backgroundcolor|bgposition|size|backgroundposition|bgsize|loopfilter|progressbar|backgroundsize|mousedown|loopoffsety|mouseup|letter|spacing|transitionduration|dataLS|indicator|400|03|loopoffsetx|keydown|isAnimating|isPreloading|textInNodesToCSS|lines_edge|Quint|lines_center|timeshift|slidedelay|UID|staticImage|converted|looptransformorigin|prop1|prop2|prop4|lines_rand|loopskewy|loopskewx|loopscaley|splitType3a|loopscalex|_self|splitType3b|chars|map|apply|removeAttribute|gif|base64|R0lGODlhAQABAIAAAAAAAP|yH5BAEAAAAALAAAAAABAAEAAAIBRAA7|than|splitType1|loopscale|lines_desc|splitType2|slidein|forever|clicked|looprotationy|removeProp|lines_asc|looprotationx|looprotation||fail||words_edge|looprotatey|looprotatex|looprotate|loopopacity|texttransitionout|textdurationout|textoutstartat||jpg|textstartatout|textdelayout||words_center|maxresdefault|textshiftout|texttypeout|textoffsetyout|textoffsetxout|texttransformoriginout|texteasingout|words_rand|texteaseout|textskewyout|words_desc|textskewxout|textscaleyout|offsetX|offsetY|1025|767|768|inherit|textscalexout|textscaleout|textrotationyout|textrotationxout|textrotationout|nothumb|item|textrotateyout|SplitType|words_asc|pointer|chars_edge|textrotatexout|101|textrotateout|chars_center|3e3|textopacityout|disbaled|nextLoop|textfadeout|transitionout|easingout|v6|noSlideTransition|chars_rand|durationout|outstartat|startatout|350|showuntil|0deg|clipout|offsetyout|chars_desc|offsetxout|transformoriginout||chars_asc|filterout|heightout|01|widthout|radiusout|colorout|bgcolorout|_no|skewyout|skewxout|scaleyout|scalexout|leaveOverflow|infinite|merge|scaleout|obj|rotationyout|slideIn|rotationxout|rotationout|rotateyout|clipWrapperData|customTransition|rotatexout|invalidSlideIndex|rotateout|opacityout|fadeout|_LS|texttransitionin|gsap|textdurationin|textinstartat|sliderInitOptions|defaultInitOptions|changedByUser|setdir|textstartatin|textdelayin|carousel|crossfad|hovertransformperspective|curtiles|forceStop|nexttiles|LS|textshiftin|texttypein|strict|prototype|Number|dequeue|loopWrapperData|errors|textoffsetyin||textoffsetxin|texttransformoriginin|texteasingin||vertical|insertBefore|looptransformperspective|scrollHeight|logo|texteasein|here|clicking|updating|about|more|read|can|You|texttransformperspectiveout|entry|textskewyin|textskewxin|texttransformperspectivein|texttransformperspective|enablejsapi|transformperspectiveout|mixed|transformperspectivein|vi|embed|translate3d|textscaleyin|textscalexin|wordpress|textscalein|getTweensOf|seek|faq|support|Updater|textrotationyin|Important|transformperspective|textrotationxin|textrotationin|higher|textrotateyin|www|iframe_api|newer|least|parallaxlevel||textrotatexin|layersOnSlideTimeline|slideTimelineDuration|onYouTubeIframeAPIReady|textrotatein|requires|old||popupShouldStart|using|hovertransformorigin||textopacityin|hoverradius|textfadein|timing2|Quad|transitionin|Sine|Old|easingin|hoverborderradius|durationin|instartat|addPause|Settings|looplayers|addCallback|startatin|Advanced|Troubleshooting|delayin|clipin|getBoundingClientRect|_reversed|onReverseCompleteParams|within|option|999999px|offsetyin|Player|offsetxin|onReady|includes|JS|hoverfilter|Put|hoveroffsety|main|hoveroffsetx|deviceorientation|onStateChange|transformoriginin|skewy|area|pauseVideo|admin|orientation|skewx|navigate|sliders|problems|causing|pageY|vimeocdn|froogaloop2|desc|hoveralwaysontop|rand|sort|edge|char|word|Froogaloop|player_id|copy|extra|v2|json||callback|getJSON|Cannot|thumbnail_large|include|scaley|manually|loads|scalex|missing|rotationy|hoverdurationout|added|but|source|found|rotationx|ajax|dataType|Additional|complete|theme|finish|rotatey|ended|Required|have|hoverdurationin|hoverduration|another|outerHTML|rotatex|that|hovereasingout|Find|updates|docs|playvideo|clientWidth|clientHeight|noWidth|noWidth2|noHeight|noHeight2|filterin|heightin|remainingSlideDuration|fullwidth2|fullsize2|conHeight|conWidth2|conHeight2|fix|hovereaseout|bgCover|widthin|radiusin|fitvidsignore|backgrounds|colorin|bgcolorin|backgroundRepeat|backgroundAttachment|yourlogo|skewyin|bock|layerCustomSliderTransitions|slideTransitions|noSlideTransitions|wheel|clientY|skewxin|scaleyin|scalexin|scalein|rotationyin|pre|inviewport|textDecoration|Multiple|outline|rotationxin|rotationin|rotateyin|Left|Top|sliderleft|sliderright|slidercenter|slidermiddle|middle|swing|rotatexin|hovereasingin|rotatein|easeInOutQuart|opacityin|false|NaN|firstLayer|loops|layersContainer|sublayerContainer|randomSlideshow|hovereasein|hovereasing|hoverease|fadein|mirrortransitions|killTweensOf|hovercolor|hoverbgcolor|registerPluginDefaults|hoverskewy|hoverskewx|hoverscaley|hoverscalex|Android|BlackBerry|BB10|webOS|Windows|Phone|mobi|opera|mini|nexus|DeviceOrientationEvent|hoverscale|hoverrotationy|preventdefault|hoverrotationx|sideleft|sideright|640|360|returnValue|keyCode|hoverrotation|continue|touchscroll|setAttribute|hoverrotatey|hoverrotatex|webkitFilter|filterto|below|600|fullscreenEnabled|webkitFullscreenEnabled|mozFullScreenEnabled|msFullscreenEnabled|webkitRequestFullscreen|mozRequestFullScreen|msRequestFullscreen|webkitExitFullscreen|mozCancelFullScreen|msExitFullscreen|fullscreenchange|webkitfullscreenchange|mozfullscreenchange|msfullscreenchange|dblclick|fullscreenElement|webkitFullscreenElement|mozFullScreenElement||msFullscreenElement|filterfrom||docWidth|hoverrotate|hoveropacity|pageYOffset|pageXOffset|_data|previousSlide|startSlideshow|openPopup|loopeasing|closePopup|updateLayerData|redrawSlider|redraw||replaySlide|reverseSlide|stopSlideshow|pauseSlider|resumePopup|resumeSlider|001|toggleSlider|resetSlider|resetSlide|resetCurrentSlide|removeData|loopease|loopyoyo|looprepeatdelay|userData|loopcount|loopduration|slideChangeTimeline|Safari|Opera|Chrome|Edge|perspective|OPerspective|msPerspective|MozPerspective|WebkitPerspective|transformStyle|OTransformStyle|msTransformStyle|MozTransformStyle|WebkitTransformStyle|loopstartat|test3d|offsetHeight|rident|2018|found_'.split('|'), 0, {}));;
eval(function(p, a, c, k, e, r) {
    e = function(c) {
        return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
    };
    if (!''.replace(/^/, String)) {
        while (c--) r[e(c)] = k[c] || e(c);
        k = [function(e) {
            return r[e]
        }];
        e = function() {
            return '\\w+'
        };
        c = 1
    };
    while (c--)
        if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    return p
}('2b 22={2a:[{i:\'Z M G\',d:1,g:1,f:{e:0,j:\'n\'},c:{o:\'V\',b:\'1f\',a:F,h:\'t\'}},{i:\'Z M t\',d:1,g:1,f:{e:0,j:\'n\'},c:{o:\'V\',b:\'1f\',a:F,h:\'G\'}},{i:\'Z M L\',d:1,g:1,f:{e:0,j:\'n\'},c:{o:\'V\',b:\'1f\',a:F,h:\'K\'}},{i:\'Z M K\',d:1,g:1,f:{e:0,j:\'n\'},c:{o:\'V\',b:\'1f\',a:F,h:\'L\'}},{i:\'29\',d:1,g:1,f:{e:0,j:\'n\'},c:{o:\'13\',b:\'1f\',a:F,h:\'t\'}},{i:\'Y P n\',d:[2,4],g:[4,7],f:{e:1j,j:\'n\'},c:{o:\'13\',b:\'y\',a:F,h:\'t\'}},{i:\'Y P D\',d:[2,4],g:[4,7],f:{e:1j,j:\'D\'},c:{o:\'13\',b:\'y\',a:F,h:\'t\'}},{i:\'Y P 1i-n\',d:[2,4],g:[4,7],f:{e:1j,j:\'1i-n\'},c:{o:\'13\',b:\'y\',a:F,h:\'t\'}},{i:\'Y P 1i-D\',d:[2,4],g:[4,7],f:{e:1j,j:\'1i-D\'},c:{o:\'13\',b:\'y\',a:F,h:\'t\'}},{i:\'Y P (k)\',d:[2,4],g:[4,7],f:{e:1j,j:\'k\'},c:{o:\'13\',b:\'y\',a:F,h:\'t\'}},{i:\'1x 1z M G\',d:1,g:1u,f:{e:25,j:\'D\'},c:{o:\'13\',b:\'28\',a:U,h:\'t\'}},{i:\'1x 1z M t\',d:1,g:1u,f:{e:25,j:\'n\'},c:{o:\'13\',b:\'u\',a:U,h:\'t\'}},{i:\'1x 1z M L\',d:1u,g:1,f:{e:25,j:\'1i-D\'},c:{o:\'13\',b:\'u\',a:U,h:\'t\'}},{i:\'1x 1z M K\',d:1u,g:1,f:{e:25,j:\'1i-n\'},c:{o:\'13\',b:\'u\',a:U,h:\'t\'}},{i:\'1x X M G\',d:1,g:25,f:{e:1j,j:\'D\'},c:{o:\'V\',b:\'u\',a:1e,h:\'t\'}},{i:\'1x X M t\',d:1,g:25,f:{e:1j,j:\'n\'},c:{o:\'V\',b:\'u\',a:1e,h:\'G\'}},{i:\'1x 27 M L\',d:25,g:1,f:{e:1j,j:\'1i-D\'},c:{o:\'V\',b:\'u\',a:1e,h:\'K\'}},{i:\'1x X M K\',d:25,g:1,f:{e:1j,j:\'1i-n\'},c:{o:\'V\',b:\'u\',a:1e,h:\'L\'}},{i:\'Z P m G (k)\',d:[2,4],g:[4,7],f:{e:1c,j:\'k\'},c:{o:\'V\',b:\'y\',a:1l,h:\'G\'}},{i:\'Z P m t (k)\',d:[2,4],g:[4,7],f:{e:1c,j:\'k\'},c:{o:\'V\',b:\'y\',a:1l,h:\'t\'}},{i:\'Z P m L (k)\',d:[2,4],g:[4,7],f:{e:1c,j:\'k\'},c:{o:\'V\',b:\'y\',a:1l,h:\'L\'}},{i:\'Z P m K (k)\',d:[2,4],g:[4,7],f:{e:1c,j:\'k\'},c:{o:\'V\',b:\'y\',a:1l,h:\'K\'}},{i:\'Z k P m k 1R\',d:[2,4],g:[4,7],f:{e:1c,j:\'k\'},c:{o:\'V\',b:\'y\',a:1l,h:\'k\'}},{i:\'Z d m G (n)\',d:[7,11],g:1,f:{e:1a,j:\'n\'},c:{o:\'V\',b:\'u\',a:p,h:\'G\'}},{i:\'Z d m G (D)\',d:[7,11],g:1,f:{e:1a,j:\'D\'},c:{o:\'V\',b:\'u\',a:p,h:\'G\'}},{i:\'Z d m G (k)\',d:[7,11],g:1,f:{e:1a,j:\'k\'},c:{o:\'V\',b:\'u\',a:p,h:\'G\'}},{i:\'Z d m t (n)\',d:[7,11],g:1,f:{e:1a,j:\'n\'},c:{o:\'V\',b:\'u\',a:p,h:\'t\'}},{i:\'Z d m t (D)\',d:[7,11],g:1,f:{e:1a,j:\'D\'},c:{o:\'V\',b:\'u\',a:p,h:\'t\'}},{i:\'Z d m t (k)\',d:[7,11],g:1,f:{e:1a,j:\'k\'},c:{o:\'V\',b:\'u\',a:p,h:\'t\'}},{i:\'Z d M K m L (n)\',d:[7,11],g:1,f:{e:1a,j:\'n\'},c:{o:\'V\',b:\'u\',a:p,h:\'L\'}},{i:\'Z d M K m L (k)\',d:[7,11],g:1,f:{e:1a,j:\'k\'},c:{o:\'V\',b:\'u\',a:p,h:\'L\'}},{i:\'Z d M L m K (D)\',d:[7,11],g:1,f:{e:1a,j:\'D\'},c:{o:\'V\',b:\'u\',a:p,h:\'K\'}},{i:\'Z d M L m K (k)\',d:[7,11],g:1,f:{e:1a,j:\'k\'},c:{o:\'V\',b:\'u\',a:p,h:\'K\'}},{i:\'Z O m L (n)\',d:1,g:[12,16],f:{e:q,j:\'n\'},c:{o:\'V\',b:\'u\',a:p,h:\'L\'}},{i:\'Z O m L (D)\',d:1,g:[12,16],f:{e:q,j:\'D\'},c:{o:\'V\',b:\'u\',a:p,h:\'L\'}},{i:\'Z O m L (k)\',d:1,g:[12,16],f:{e:q,j:\'k\'},c:{o:\'V\',b:\'u\',a:p,h:\'L\'}},{i:\'Z O m K (n)\',d:1,g:[12,16],f:{e:q,j:\'n\'},c:{o:\'V\',b:\'u\',a:p,h:\'K\'}},{i:\'Z O m K (D)\',d:1,g:[12,16],f:{e:q,j:\'D\'},c:{o:\'V\',b:\'u\',a:p,h:\'K\'}},{i:\'Z O m K (k)\',d:1,g:[12,16],f:{e:q,j:\'k\'},c:{o:\'V\',b:\'u\',a:p,h:\'K\'}},{i:\'Z O M t m G (n)\',d:1,g:[12,16],f:{e:q,j:\'n\'},c:{o:\'V\',b:\'u\',a:p,h:\'G\'}},{i:\'Z O M t m G (k)\',d:1,g:[12,16],f:{e:q,j:\'k\'},c:{o:\'V\',b:\'u\',a:p,h:\'G\'}},{i:\'Z O M G m t (D)\',d:1,g:[12,16],f:{e:q,j:\'D\'},c:{o:\'V\',b:\'u\',a:p,h:\'t\'}},{i:\'Z O M G m t (k)\',d:1,g:[12,16],f:{e:q,j:\'k\'},c:{o:\'V\',b:\'u\',a:p,h:\'t\'}},{i:\'Y s X P m G (k)\',d:[2,4],g:[4,7],f:{e:1c,j:\'k\'},c:{o:\'Q\',b:\'y\',a:1l,h:\'G\'}},{i:\'Y s X P m t (k)\',d:[2,4],g:[4,7],f:{e:1c,j:\'k\'},c:{o:\'Q\',b:\'y\',a:1l,h:\'t\'}},{i:\'Y s X P m L (k)\',d:[2,4],g:[4,7],f:{e:1c,j:\'k\'},c:{o:\'Q\',b:\'y\',a:1l,h:\'L\'}},{i:\'Y s X P m K (k)\',d:[2,4],g:[4,7],f:{e:1c,j:\'k\'},c:{o:\'Q\',b:\'y\',a:1l,h:\'K\'}},{i:\'Y s X k P m k 1R\',d:[2,4],g:[4,7],f:{e:1c,j:\'k\'},c:{o:\'Q\',b:\'y\',a:1l,h:\'k\'}},{i:\'Y s X P M K-t (n)\',d:[2,4],g:[4,7],f:{e:1c,j:\'n\'},c:{o:\'Q\',b:\'y\',a:1l,h:\'26\'}},{i:\'Y s X P M L-G (D)\',d:[2,4],g:[4,7],f:{e:1c,j:\'D\'},c:{o:\'Q\',b:\'y\',a:1l,h:\'1Y\'}},{i:\'Y s X P M K-G (k)\',d:[2,4],g:[4,7],f:{e:1c,j:\'k\'},c:{o:\'Q\',b:\'y\',a:1l,h:\'1W\'}},{i:\'Y s X P M L-t (k)\',d:[2,4],g:[4,7],f:{e:1c,j:\'k\'},c:{o:\'Q\',b:\'y\',a:1l,h:\'23\'}},{i:\'Y s X d m G (n)\',d:[7,11],g:1,f:{e:1a,j:\'n\'},c:{o:\'Q\',b:\'u\',a:p,h:\'G\'}},{i:\'Y s X d m G (D)\',d:[7,11],g:1,f:{e:1a,j:\'D\'},c:{o:\'Q\',b:\'u\',a:p,h:\'G\'}},{i:\'Y s X d m G (k)\',d:[7,11],g:1,f:{e:1a,j:\'k\'},c:{o:\'Q\',b:\'u\',a:p,h:\'G\'}},{i:\'Y s X d m t (n)\',d:[7,11],g:1,f:{e:1a,j:\'n\'},c:{o:\'Q\',b:\'u\',a:p,h:\'t\'}},{i:\'Y s X d m t (D)\',d:[7,11],g:1,f:{e:1a,j:\'D\'},c:{o:\'Q\',b:\'u\',a:p,h:\'t\'}},{i:\'Y s X d m t (k)\',d:[7,11],g:1,f:{e:1a,j:\'k\'},c:{o:\'Q\',b:\'u\',a:p,h:\'t\'}},{i:\'Y s X d M K m L (n)\',d:[7,11],g:1,f:{e:1a,j:\'n\'},c:{o:\'Q\',b:\'u\',a:p,h:\'L\'}},{i:\'Y s X d M K m L (k)\',d:[7,11],g:1,f:{e:1a,j:\'k\'},c:{o:\'Q\',b:\'u\',a:p,h:\'L\'}},{i:\'Y s X d M L m K (D)\',d:[7,11],g:1,f:{e:1a,j:\'D\'},c:{o:\'Q\',b:\'u\',a:p,h:\'K\'}},{i:\'Y s X d M L m K (k)\',d:[7,11],g:1,f:{e:1a,j:\'k\'},c:{o:\'Q\',b:\'u\',a:p,h:\'K\'}},{i:\'Y s X O m L (n)\',d:1,g:[12,16],f:{e:q,j:\'n\'},c:{o:\'Q\',b:\'u\',a:p,h:\'L\'}},{i:\'Y s X O m L (D)\',d:1,g:[12,16],f:{e:q,j:\'D\'},c:{o:\'Q\',b:\'u\',a:p,h:\'L\'}},{i:\'Y s X O m L (k)\',d:1,g:[12,16],f:{e:q,j:\'k\'},c:{o:\'Q\',b:\'u\',a:p,h:\'L\'}},{i:\'Y s X O m K (n)\',d:1,g:[12,16],f:{e:q,j:\'n\'},c:{o:\'Q\',b:\'u\',a:p,h:\'K\'}},{i:\'Y s X O m K (D)\',d:1,g:[12,16],f:{e:q,j:\'D\'},c:{o:\'Q\',b:\'u\',a:p,h:\'K\'}},{i:\'Y s X O m K (k)\',d:1,g:[12,16],f:{e:q,j:\'k\'},c:{o:\'Q\',b:\'u\',a:p,h:\'K\'}},{i:\'Y s X O M t m G (n)\',d:1,g:[12,16],f:{e:q,j:\'n\'},c:{o:\'Q\',b:\'u\',a:p,h:\'G\'}},{i:\'Y s X O M t m G (k)\',d:1,g:[12,16],f:{e:q,j:\'k\'},c:{o:\'Q\',b:\'u\',a:p,h:\'G\'}},{i:\'Y s X O M G m t (D)\',d:1,g:[12,16],f:{e:q,j:\'D\'},c:{o:\'Q\',b:\'u\',a:p,h:\'t\'}},{i:\'Y s X O M G m t (k)\',d:1,g:[12,16],f:{e:q,j:\'k\'},c:{o:\'Q\',b:\'u\',a:p,h:\'t\'}},{i:\'1v\',d:1,g:1,f:{e:0,j:\'n\'},c:{o:\'Q\',b:\'1f\',a:U,h:\'t\',1g:0.5}},{i:\'1v d\',d:4,g:1,f:{e:1c,j:\'n\'},c:{o:\'Q\',b:\'1f\',a:U,h:\'t\',1g:0.5}},{i:\'1v g\',d:1,g:4,f:{e:1c,j:\'n\'},c:{o:\'Q\',b:\'1f\',a:U,h:\'t\',1g:0.5}},{i:\'1v P z\',d:3,g:4,f:{e:1u,j:\'n\'},c:{o:\'Q\',b:\'1f\',a:U,h:\'t\',1g:0.5,x:v}},{i:\'1v P C\',d:3,g:4,f:{e:1u,j:\'n\'},c:{o:\'Q\',b:\'1f\',a:U,h:\'K\',1g:0.5,w:-v}},{i:\'1v-1H P z\',d:3,g:4,f:{e:15,j:\'n\'},c:{o:\'Q\',b:\'1f\',a:U,h:\'t\',1g:0.5,x:v}},{i:\'1v-1H P C\',d:3,g:4,f:{e:15,j:\'n\'},c:{o:\'Q\',b:\'1f\',a:U,h:\'K\',1g:0.5,w:-v}},{i:\'1v 1H d\',d:4,g:1,f:{e:1c,j:\'n\'},c:{o:\'Q\',b:\'1f\',a:U,h:\'G\',1g:0.5}},{i:\'1v 1H g\',d:1,g:4,f:{e:1c,j:\'n\'},c:{o:\'Q\',b:\'1f\',a:U,h:\'t\',1g:0.5}},{i:\'1d f M t\',d:1,g:1,f:{e:0,j:\'n\'},c:{o:\'V\',b:\'y\',a:U,h:\'G\',x:v}},{i:\'1d f M G\',d:1,g:1,f:{e:0,j:\'n\'},c:{o:\'V\',b:\'y\',a:U,h:\'t\',x:-v}},{i:\'1d f M K\',d:1,g:1,f:{e:0,j:\'n\'},c:{o:\'V\',b:\'y\',a:U,h:\'L\',w:-v}},{i:\'1d f M L\',d:1,g:1,f:{e:0,j:\'n\'},c:{o:\'V\',b:\'y\',a:U,h:\'K\',w:v}},{i:\'1d P M t\',d:[3,4],g:[3,4],f:{e:19,j:\'n\'},c:{o:\'13\',b:\'y\',a:U,h:\'t\',x:v}},{i:\'1d P M G\',d:[3,4],g:[3,4],f:{e:19,j:\'D\'},c:{o:\'13\',b:\'y\',a:U,h:\'t\',x:-v}},{i:\'1d P M K\',d:[3,4],g:[3,4],f:{e:19,j:\'n\'},c:{o:\'13\',b:\'y\',a:U,h:\'t\',w:-v}},{i:\'1d P M L\',d:[3,4],g:[3,4],f:{e:19,j:\'D\'},c:{o:\'13\',b:\'y\',a:U,h:\'t\',w:v}},{i:\'1d d M K\',d:[6,12],g:1,f:{e:19,j:\'n\'},c:{o:\'13\',b:\'y\',a:U,h:\'t\',w:v}},{i:\'1d d M L\',d:[6,12],g:1,f:{e:19,j:\'D\'},c:{o:\'13\',b:\'y\',a:U,h:\'t\',w:-v}},{i:\'1d g M t\',d:1,g:[6,12],f:{e:19,j:\'n\'},c:{o:\'13\',b:\'y\',a:U,h:\'t\',x:-v}},{i:\'1d g M G\',d:1,g:[6,12],f:{e:19,j:\'D\'},c:{o:\'13\',b:\'y\',a:U,h:\'t\',x:v}},{i:\'1w d M t\',d:[3,10],g:1,f:{e:19,j:\'n\'},c:{o:\'13\',b:\'y\',a:U,h:\'t\',x:v}},{i:\'1w d M G\',d:[3,10],g:1,f:{e:19,j:\'D\'},c:{o:\'13\',b:\'y\',a:U,h:\'t\',x:-v}},{i:\'1w g M K\',d:1,g:[3,10],f:{e:19,j:\'n\'},c:{o:\'13\',b:\'y\',a:U,h:\'t\',w:-v}},{i:\'1w g M L\',d:1,g:[3,10],f:{e:19,j:\'D\'},c:{o:\'13\',b:\'y\',a:U,h:\'t\',w:v}},{i:\'1w s 1q f M t\',d:1,g:1,f:{e:q,j:\'n\'},c:{o:\'Q\',b:\'y\',a:U,h:\'G\',1g:0.1,1s:-v,x:v}},{i:\'1w s 1q f M G\',d:1,g:1,f:{e:q,j:\'n\'},c:{o:\'Q\',b:\'y\',a:U,h:\'t\',1g:0.1,1s:v,x:-v}},{i:\'1w s 1q P M t\',d:[3,4],g:[3,4],f:{e:19,j:\'n\'},c:{o:\'Q\',b:\'y\',a:U,h:\'G\',1s:-1r}},{i:\'1w s 1q P M G\',d:[3,4],g:[3,4],f:{e:19,j:\'n\'},c:{o:\'Q\',b:\'y\',a:U,h:\'t\',1s:-1r}},{i:\'1w s 1q P M k\',d:[3,4],g:[3,4],f:{e:19,j:\'k\'},c:{o:\'Q\',b:\'y\',a:U,h:\'k\',1s:-1r}},{i:\'E f 1Q\',d:1,g:1,f:{e:0,j:\'n\'},c:{o:\'13\',b:\'y\',a:18,h:\'t\',1g:0.8}},{i:\'E f M 1L\',d:1,g:1,f:{e:0,j:\'n\'},c:{o:\'13\',b:\'u\',a:18,h:\'t\',1g:1.2}},{i:\'E P k\',d:[3,4],g:[3,4],f:{e:1u,j:\'k\'},c:{o:\'13\',b:\'y\',a:U,h:\'t\',1g:0.1}},{i:\'E P M 1L k\',d:[3,4],g:[3,4],f:{e:1u,j:\'k\'},c:{o:\'13\',b:\'y\',a:U,h:\'t\',1g:2}},{i:\'E 1Q s 1q P k\',d:[3,4],g:[3,4],f:{e:1u,j:\'k\'},c:{o:\'13\',b:\'y\',a:U,h:\'t\',1g:0.1,1s:v}},{i:\'E s 1q P M 1L k\',d:[3,4],g:[3,4],f:{e:1u,j:\'k\'},c:{o:\'13\',b:\'y\',a:U,h:\'t\',1g:2,1s:-v}},{i:\'1F-X P 21\',d:3,g:4,f:{e:15,j:\'n\'},c:{o:\'V\',b:\'u\',a:24,h:\'1W\'}},{i:\'1F-X d z\',d:6,g:1,f:{e:0,j:\'n\'},c:{o:\'Q\',b:\'y\',a:U,h:\'t\'}},{i:\'1F-X d C\',d:6,g:1,f:{e:0,j:\'n\'},c:{o:\'Q\',b:\'y\',a:U,h:\'K\'}},{i:\'1F-X g z\',d:1,g:8,f:{e:0,j:\'n\'},c:{o:\'Q\',b:\'y\',a:U,h:\'t\'}},{i:\'1F-X g C\',d:1,g:8,f:{e:0,j:\'n\'},c:{o:\'Q\',b:\'y\',a:U,h:\'K\'}}],1Z:[{i:\'1b f m G (lÂ°)\',d:1,g:1,f:{e:q,j:\'n\'},r:{c:{x:1J},b:\'1A\',a:F,h:\'z\'},A:{c:{x:l},b:\'y\',a:F,h:\'z\'}},{i:\'1b f m t (lÂ°)\',d:1,g:1,f:{e:q,j:\'n\'},r:{c:{x:-1J},b:\'1A\',a:F,h:\'z\'},A:{c:{x:-l},b:\'y\',a:F,h:\'z\'}},{i:\'1b f m L (lÂ°)\',d:1,g:1,f:{e:q,j:\'n\'},r:{c:{w:-1J},b:\'1A\',a:1y,h:\'C\'},A:{c:{w:-l},b:\'y\',a:1y,h:\'C\'}},{i:\'1b f m K (lÂ°)\',d:1,g:1,f:{e:q,j:\'n\'},r:{c:{w:1J},b:\'1A\',a:1y,h:\'C\'},A:{c:{w:l},b:\'y\',a:1y,h:\'C\'}},{i:\'1b P m G (lÂ°)\',d:[2,4],g:[4,7],f:{e:q,j:\'n\'},r:{c:{x:l},b:\'u\',a:F,h:\'z\'}},{i:\'1b P m t (lÂ°)\',d:[2,4],g:[4,7],f:{e:q,j:\'D\'},r:{c:{x:-l},b:\'u\',a:F,h:\'z\'}},{i:\'1b P m L (lÂ°)\',d:[2,4],g:[4,7],f:{e:q,j:\'1i-n\'},r:{c:{w:-l},b:\'u\',a:F,h:\'C\'}},{i:\'1b P m K (lÂ°)\',d:[2,4],g:[4,7],f:{e:q,j:\'1i-D\'},r:{c:{w:l},b:\'u\',a:F,h:\'C\'}},{i:\'1G S P k (lÂ°)\',d:[2,4],g:[4,7],f:{e:q,j:\'k\'},r:{c:{x:l},b:\'u\',a:1K,h:\'z\'}},{i:\'1E S P k (lÂ°)\',d:[2,4],g:[4,7],f:{e:q,j:\'k\'},r:{c:{w:l},b:\'u\',a:1K,h:\'C\'}},{i:\'E s S P m G (lÂ°)\',d:[2,4],g:[4,7],f:{e:q,j:\'n\'},I:{c:{B:0.1D},a:1n,b:\'14\'},r:{c:{x:l},b:\'H\',a:F,h:\'z\'},A:{a:1e,b:\'H\'}},{i:\'E s S P m t (lÂ°)\',d:[2,4],g:[4,7],f:{e:q,j:\'D\'},I:{c:{B:0.1D},a:1n,b:\'14\'},r:{c:{x:-l},b:\'H\',a:F,h:\'z\'},A:{a:1e,b:\'H\'}},{i:\'E s S P m L (lÂ°)\',d:[2,4],g:[4,7],f:{e:q,j:\'1i-n\'},I:{c:{B:0.1D},a:1n,b:\'14\'},r:{c:{w:-l},b:\'H\',a:F,h:\'C\'},A:{a:1e,b:\'H\'}},{i:\'E s S P m K (lÂ°)\',d:[2,4],g:[4,7],f:{e:q,j:\'1i-D\'},I:{c:{B:0.1D},a:1n,b:\'14\'},r:{c:{w:l},b:\'H\',a:F,h:\'C\'},A:{a:1e,b:\'H\'}},{i:\'E s z S P k (lÂ°)\',d:[2,4],g:[4,7],f:{e:q,j:\'k\'},I:{c:{B:0.1D,w:1j},a:1n,b:\'14\'},r:{c:{x:l,w:-1j},b:\'H\',a:1K,h:\'z\'},A:{c:{w:0},a:1e,b:\'H\'}},{i:\'E s C S P k (lÂ°)\',d:[2,4],g:[4,7],f:{e:q,j:\'k\'},I:{c:{B:0.1D,x:-15},a:1n,b:\'14\'},r:{c:{w:l,x:15},b:\'H\',a:1K,h:\'C\'},A:{c:{x:0},a:1e,b:\'H\'}},{i:\'1b d m G (lÂ°)\',d:[5,9],g:1,f:{e:q,j:\'n\'},r:{c:{x:l},b:\'u\',a:18,h:\'z\'}},{i:\'1b d m t (lÂ°)\',d:[5,9],g:1,f:{e:q,j:\'n\'},r:{c:{x:-l},b:\'u\',a:18,h:\'z\'}},{i:\'1b d m L (lÂ°)\',d:[5,9],g:1,f:{e:q,j:\'n\'},r:{c:{w:-l},b:\'u\',a:F,h:\'C\'}},{i:\'1b d m K (lÂ°)\',d:[5,9],g:1,f:{e:q,j:\'D\'},r:{c:{w:l},b:\'u\',a:F,h:\'C\'}},{i:\'1G S d k (lÂ°)\',d:[5,9],g:1,f:{e:q,j:\'k\'},r:{c:{x:l},b:\'u\',a:18,h:\'z\'}},{i:\'1E S d k (lÂ°)\',d:[5,9],g:1,f:{e:q,j:\'k\'},r:{c:{w:-l},b:\'u\',a:18,h:\'C\'}},{i:\'1E S d k (1CÂ°)\',d:[3,7],g:1,f:{e:1N,j:\'k\'},r:{c:{w:-1C},b:\'u\',a:1O,h:\'C\'}},{i:\'E s S d m G (lÂ°)\',d:[5,9],g:1,f:{e:19,j:\'n\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{x:l},b:\'H\',a:1m,h:\'z\'},A:{c:{e:W},b:\'J\',a:p}},{i:\'E s S d m t (lÂ°)\',d:[5,9],g:1,f:{e:19,j:\'D\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{x:-l},b:\'H\',a:1m,h:\'z\'},A:{c:{e:W},b:\'J\',a:p}},{i:\'E s S d m L (lÂ°)\',d:[5,9],g:1,f:{e:19,j:\'n\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{w:-l},b:\'u\',a:p,h:\'C\'},A:{c:{e:W},b:\'J\',a:p}},{i:\'E s S d m K (lÂ°)\',d:[5,9],g:1,f:{e:19,j:\'D\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{w:l},b:\'u\',a:p,h:\'C\'},A:{c:{e:W},b:\'J\',a:p}},{i:\'E s z S d k (lÂ°)\',d:[5,9],g:1,f:{e:19,j:\'k\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{x:l},b:\'H\',a:1m,h:\'z\'},A:{c:{e:W},b:\'J\',a:p}},{i:\'E s C S d k (lÂ°)\',d:[5,9],g:1,f:{e:19,j:\'k\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{w:-l},b:\'H\',a:p,h:\'C\'},A:{c:{e:W},b:\'J\',a:p}},{i:\'1b O m G (lÂ°)\',d:1,g:[5,9],f:{e:q,j:\'n\'},r:{c:{x:l},b:\'u\',a:18,h:\'z\'}},{i:\'1b O m t (lÂ°)\',d:1,g:[5,9],f:{e:q,j:\'n\'},r:{c:{x:-l},b:\'u\',a:18,h:\'z\'}},{i:\'1b O m L (lÂ°)\',d:1,g:[5,9],f:{e:q,j:\'n\'},r:{c:{w:-l},b:\'u\',a:F,h:\'C\'}},{i:\'1b O m K (lÂ°)\',d:1,g:[5,9],f:{e:q,j:\'D\'},r:{c:{w:l},b:\'u\',a:F,h:\'C\'}},{i:\'1G S O k (lÂ°)\',d:1,g:[5,9],f:{e:q,j:\'k\'},r:{c:{x:l},b:\'u\',a:18,h:\'z\'}},{i:\'1E S O k (lÂ°)\',d:1,g:[5,9],f:{e:q,j:\'k\'},r:{c:{w:-l},b:\'u\',a:18,h:\'C\'}},{i:\'1G S O k (1CÂ°)\',d:1,g:[4,9],f:{e:1N,j:\'k\'},r:{c:{x:1C},b:\'u\',a:1O,h:\'z\'}},{i:\'E s S O m G (lÂ°)\',d:1,g:[7,11],f:{e:19,j:\'n\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{x:l},b:\'u\',a:p,h:\'z\'},A:{c:{e:W},b:\'J\',a:p}},{i:\'E s S O m t (lÂ°)\',d:1,g:[7,11],f:{e:19,j:\'D\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{x:-l},b:\'u\',a:p,h:\'z\'},A:{c:{e:W},b:\'J\',a:p}},{i:\'E s S O m L (lÂ°)\',d:1,g:[7,11],f:{e:19,j:\'n\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{w:-l},b:\'H\',a:1m,h:\'C\'},A:{c:{e:W},b:\'J\',a:p}},{i:\'E s S O m K (lÂ°)\',d:1,g:[7,11],f:{e:q,j:\'D\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{w:l},b:\'H\',a:1m,h:\'C\'},A:{c:{e:W},b:\'J\',a:p}},{i:\'E s z S O k (lÂ°)\',d:1,g:[7,11],f:{e:q,j:\'k\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{x:l},b:\'H\',a:p,h:\'z\'},A:{c:{e:W},b:\'J\',a:p}},{i:\'E s C S O k (lÂ°)\',d:1,g:[7,11],f:{e:q,j:\'k\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{w:-l},b:\'H\',a:1m,h:\'C\'},A:{c:{e:W},b:\'J\',a:p}},{i:\'1T 1U 1V s S m G (lÂ°)\',d:1,g:[7,11],f:{e:q,j:\'n\'},I:{c:{B:0.N,w:-1j},a:p,b:\'y\'},r:{c:{w:-1j,x:l},b:\'u\',a:F,h:\'z\'},A:{c:{w:0,e:W},b:\'y\',a:p}},{i:\'1T 1U 1V s S m t (lÂ°)\',d:1,g:[7,11],f:{e:q,j:\'D\'},I:{c:{B:0.N,w:-1j},a:p,b:\'y\'},r:{c:{w:1j,x:-l},b:\'u\',a:F,h:\'z\'},A:{c:{w:0,e:W},b:\'y\',a:p}},{i:\'1d 1t m G (vÂ°)\',d:1,g:1,f:{e:q,j:\'n\'},r:{c:{x:v},b:\'u\',a:18,h:\'z\'}},{i:\'1d 1t m t (vÂ°)\',d:1,g:1,f:{e:q,j:\'n\'},r:{c:{x:-v},b:\'u\',a:18,h:\'z\'}},{i:\'1d 1t m L (vÂ°)\',d:1,g:1,f:{e:q,j:\'n\'},r:{c:{w:-v},b:\'u\',a:18,h:\'C\'}},{i:\'1d 1t m K (vÂ°)\',d:1,g:1,f:{e:q,j:\'n\'},r:{c:{w:v},b:\'u\',a:18,h:\'C\'}},{i:\'E s 17 1t m G (vÂ°)\',d:1,g:1,f:{e:q,j:\'k\'},r:{c:{B:0.8,1s:7,w:10,x:1r},b:\'1f\',a:1y,h:\'z\'},A:{c:{1s:0,w:0,x:v},a:1y,b:\'1f\'}},{i:\'E s 17 1t m t (vÂ°)\',d:1,g:1,f:{e:q,j:\'k\'},r:{c:{B:0.8,1s:-7,w:10,x:-1r},b:\'1f\',a:1y,h:\'z\'},A:{c:{1s:0,w:0,x:-v},a:1y,b:\'1f\'}},{i:\'E s 17 1k m G (vÂ°)\',d:[2,4],g:[4,7],f:{e:q,j:\'n\'},I:{c:{B:0.N},a:1n,b:\'14\'},r:{c:{x:v},b:\'H\',a:F,h:\'z\'},A:{a:1e,b:\'H\'}},{i:\'E s 17 1k m t (vÂ°)\',d:[2,4],g:[4,7],f:{e:q,j:\'D\'},I:{c:{B:0.N},a:1n,b:\'14\'},r:{c:{x:-v},b:\'H\',a:F,h:\'z\'},A:{a:1e,b:\'H\'}},{i:\'E s 17 1k m L (vÂ°)\',d:[2,4],g:[4,7],f:{e:q,j:\'1i-n\'},I:{c:{B:0.N},a:1n,b:\'14\'},r:{c:{w:-v},b:\'H\',a:F,h:\'C\'},A:{a:1e,b:\'H\'}},{i:\'E s 17 1k m K (vÂ°)\',d:[2,4],g:[4,7],f:{e:q,j:\'1i-D\'},I:{c:{B:0.N},a:1n,b:\'14\'},r:{c:{w:v},b:\'H\',a:F,h:\'C\'},A:{a:1e,b:\'H\'}},{i:\'E s z 17 1k k (vÂ°)\',d:[2,4],g:[4,7],f:{e:q,j:\'k\'},I:{c:{B:0.q,w:-15},a:1p,b:\'14\'},r:{c:{x:q,w:15},b:\'H\',a:1p,h:\'z\'},A:{c:{x:v,w:0},a:1p,b:\'H\'}},{i:\'E s C 17 1k k (vÂ°)\',d:[2,4],g:[4,7],f:{e:q,j:\'k\'},I:{c:{B:0.q,x:15},a:1p,b:\'14\'},r:{c:{w:q,x:-15},b:\'H\',a:1p,h:\'C\'},A:{c:{w:v,x:0},a:1p,b:\'H\'}},{i:\'1d d m G (vÂ°)\',d:[5,9],g:1,f:{e:q,j:\'n\'},r:{c:{x:v},b:\'u\',a:18,h:\'z\'}},{i:\'1d d m t (vÂ°)\',d:[5,9],g:1,f:{e:q,j:\'n\'},r:{c:{x:-v},b:\'u\',a:18,h:\'z\'}},{i:\'1G 17 d k (vÂ°)\',d:[5,9],g:1,f:{e:q,j:\'k\'},r:{c:{x:v},b:\'u\',a:18,h:\'z\'}},{i:\'E s 17 d m G (vÂ°)\',d:[5,9],g:1,f:{e:q,j:\'n\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{x:20},b:\'H\',a:F,h:\'z\'},A:{c:{e:W,x:v},b:\'J\',a:p}},{i:\'E s 17 d m t (vÂ°)\',d:[5,9],g:1,f:{e:q,j:\'D\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{x:-v},b:\'H\',a:F,h:\'z\'},A:{c:{e:W},b:\'J\',a:p}},{i:\'E s 17 d m L (vÂ°)\',d:[5,9],g:1,f:{e:q,j:\'n\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{w:-v},b:\'H\',a:F,h:\'C\'},A:{c:{e:W},b:\'J\',a:p}},{i:\'E s 17 d m K (vÂ°)\',d:[5,9],g:1,f:{e:q,j:\'D\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{w:v},b:\'H\',a:F,h:\'C\'},A:{c:{e:W},b:\'J\',a:p}},{i:\'E s z 17 d k (vÂ°)\',d:[5,9],g:1,f:{e:q,j:\'k\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{x:v},b:\'H\',a:F,h:\'z\'},A:{c:{e:W},b:\'J\',a:p}},{i:\'E s C 17 d k (vÂ°)\',d:[5,9],g:1,f:{e:q,j:\'k\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{w:-v},b:\'H\',a:F,h:\'C\'},A:{c:{e:W},b:\'J\',a:p}},{i:\'E s z 17 1I d m G (vÂ°)\',d:[7,11],g:1,f:{e:q,j:\'n\'},r:{c:{B:0.N,x:1r},b:\'14\',a:F,h:\'z\'},A:{c:{x:v},b:\'14\',a:F}},{i:\'E s z 17 1I d m t (vÂ°)\',d:[7,11],g:1,f:{e:q,j:\'D\'},r:{c:{B:0.N,x:-1r},b:\'14\',a:F,h:\'z\'},A:{c:{x:-v},b:\'14\',a:F}},{i:\'1d O m L (vÂ°)\',d:1,g:[5,9],f:{e:q,j:\'n\'},r:{c:{w:-v},b:\'u\',a:F,h:\'C\'}},{i:\'1d O m K (vÂ°)\',d:1,g:[5,9],f:{e:q,j:\'D\'},r:{c:{w:v},b:\'u\',a:F,h:\'C\'}},{i:\'1E 17 O k (vÂ°)\',d:1,g:[5,9],f:{e:q,j:\'k\'},r:{c:{w:-v},b:\'u\',a:F,h:\'C\'}},{i:\'E s 17 O m L (vÂ°)\',d:1,g:[7,11],f:{e:q,j:\'n\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{w:-v},b:\'H\',a:F,h:\'C\'},A:{c:{e:W},b:\'J\',a:p}},{i:\'E s 17 O m K (vÂ°)\',d:1,g:[7,11],f:{e:q,j:\'D\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{w:v},b:\'H\',a:F,h:\'C\'},A:{c:{e:W},b:\'J\',a:p}},{i:\'E s 17 O m G (vÂ°)\',d:1,g:[7,11],f:{e:q,j:\'n\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{x:v},b:\'H\',a:F,h:\'z\'},A:{c:{e:W},b:\'J\',a:p}},{i:\'E s 17 O m t (vÂ°)\',d:1,g:[7,11],f:{e:q,j:\'D\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{x:-v},b:\'H\',a:F,h:\'z\'},A:{c:{e:W},b:\'J\',a:p}},{i:\'E s z 17 O k (vÂ°)\',d:1,g:[7,11],f:{e:q,j:\'k\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{x:v},b:\'H\',a:F,h:\'z\'},A:{c:{e:W},b:\'J\',a:p}},{i:\'E s C 17 O k (vÂ°)\',d:1,g:[7,11],f:{e:q,j:\'k\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{w:-v},b:\'H\',a:F,h:\'C\'},A:{c:{e:W},b:\'J\',a:p}},{i:\'E s C 17 1I O m G (vÂ°)\',d:1,g:[7,11],f:{e:q,j:\'n\'},r:{c:{B:0.N,w:1r},b:\'14\',a:F,h:\'C\'},A:{c:{w:v},b:\'14\',a:F}},{i:\'E s C 17 1I O m t (vÂ°)\',d:1,g:[7,11],f:{e:q,j:\'D\'},r:{c:{B:0.N,w:-1r},b:\'14\',a:F,h:\'C\'},A:{c:{w:-v},b:\'14\',a:F}},{i:\'1b 1t m G (lÂ°, R T)\',d:1,g:1,f:{e:q,j:\'n\',T:\'R\'},r:{c:{x:l},b:\'u\',a:18,h:\'z\'}},{i:\'1b 1t m t (lÂ°, R T)\',d:1,g:1,f:{e:q,j:\'n\',T:\'R\'},r:{c:{x:-l},b:\'u\',a:18,h:\'z\'}},{i:\'1b 1t m L (lÂ°, R T)\',d:1,g:1,f:{e:q,j:\'n\',T:\'R\'},r:{c:{w:-l},b:\'u\',a:18,h:\'C\'}},{i:\'1b 1t m K (lÂ°, R T)\',d:1,g:1,f:{e:q,j:\'n\',T:\'R\'},r:{c:{w:l},b:\'u\',a:18,h:\'C\'}},{i:\'E s S 1k m G (lÂ°, R T)\',d:[2,4],g:[4,7],f:{e:q,j:\'n\',T:\'R\'},I:{c:{B:0.N},a:1n,b:\'14\'},r:{c:{x:l},b:\'H\',a:F,h:\'z\'},A:{a:1e,b:\'H\'}},{i:\'E s S 1k m t (lÂ°, R T)\',d:[2,4],g:[4,7],f:{e:q,j:\'D\',T:\'R\'},I:{c:{B:0.N},a:1n,b:\'14\'},r:{c:{x:-l},b:\'H\',a:F,h:\'z\'},A:{a:1e,b:\'H\'}},{i:\'E s S 1k m L (lÂ°, R T)\',d:[2,4],g:[4,7],f:{e:q,j:\'1i-n\',T:\'R\'},I:{c:{B:0.N},a:1n,b:\'14\'},r:{c:{w:-l},b:\'H\',a:F,h:\'C\'},A:{a:1e,b:\'H\'}},{i:\'E s S 1k m K (lÂ°, R T)\',d:[2,4],g:[4,7],f:{e:q,j:\'1i-D\',T:\'R\'},I:{c:{B:0.N},a:1n,b:\'14\'},r:{c:{w:l},b:\'H\',a:F,h:\'C\'},A:{a:1e,b:\'H\'}},{i:\'E s z S 1k k (lÂ°, R T)\',d:[2,4],g:[4,7],f:{e:q,j:\'k\',T:\'R\'},I:{c:{B:0.1h},a:1p,b:\'14\'},r:{c:{x:l},b:\'H\',a:1p,h:\'z\'},A:{a:1p,b:\'H\'}},{i:\'E s C S 1k k (lÂ°, R T)\',d:[2,4],g:[4,7],f:{e:q,j:\'k\',T:\'R\'},I:{c:{B:0.1h},a:1p,b:\'14\'},r:{c:{w:l},b:\'H\',a:1p,h:\'C\'},A:{a:1p,b:\'H\'}},{i:\'E s S d m G (lÂ°, R T)\',d:[5,9],g:1,f:{e:1h,j:\'n\',T:\'R\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{x:l},b:\'u\',a:1m,h:\'z\'},A:{c:{e:W},b:\'y\',a:1o}},{i:\'E s S d m t (lÂ°, R T)\',d:[5,9],g:1,f:{e:1h,j:\'D\',T:\'R\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{x:-l},b:\'u\',a:1m,h:\'z\'},A:{c:{e:W},b:\'y\',a:1o}},{i:\'E s S d m L (lÂ°, R T)\',d:[5,9],g:1,f:{e:1h,j:\'n\',T:\'R\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{w:-l},b:\'H\',a:F,h:\'C\'},A:{c:{e:W},b:\'y\',a:1o}},{i:\'E s S d m K (lÂ°, R T)\',d:[5,9],g:1,f:{e:1h,j:\'D\',T:\'R\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{w:l},b:\'H\',a:F,h:\'C\'},A:{c:{e:W},b:\'y\',a:1o}},{i:\'E s z S d k (lÂ°, R T)\',d:[5,9],g:1,f:{e:1h,j:\'k\',T:\'R\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{x:l},b:\'u\',a:1m,h:\'z\'},A:{c:{e:W},b:\'y\',a:1o}},{i:\'E s C S d k (lÂ°, R T)\',d:[5,9],g:1,f:{e:1h,j:\'k\',T:\'R\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{w:-l},b:\'H\',a:F,h:\'C\'},A:{c:{e:W},b:\'y\',a:1o}},{i:\'E s S O m L (lÂ°, R T)\',d:1,g:[7,11],f:{e:1h,j:\'n\',T:\'R\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{w:-l},b:\'u\',a:1m,h:\'C\'},A:{c:{e:W},b:\'y\',a:1o}},{i:\'E s S O m K (lÂ°, R T)\',d:1,g:[7,11],f:{e:1h,j:\'D\',T:\'R\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{w:l},b:\'u\',a:1m,h:\'C\'},A:{c:{e:W},b:\'y\',a:1o}},{i:\'E s S O m G (lÂ°, R T)\',d:1,g:[7,11],f:{e:1h,j:\'n\',T:\'R\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{x:l},b:\'H\',a:F,h:\'z\'},A:{c:{e:W},b:\'y\',a:1o}},{i:\'E s S O m t (lÂ°, R T)\',d:1,g:[7,11],f:{e:1h,j:\'D\',T:\'R\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{x:-l},b:\'H\',a:F,h:\'z\'},A:{c:{e:W},b:\'y\',a:1o}},{i:\'E s z S O k (lÂ°, R T)\',d:1,g:[7,11],f:{e:1h,j:\'k\',T:\'R\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{x:l},b:\'H\',a:F,h:\'z\'},A:{c:{e:W},b:\'y\',a:1o}},{i:\'E s C S O k (lÂ°, R T)\',d:1,g:[7,11],f:{e:1h,j:\'k\',T:\'R\'},I:{c:{B:0.N},a:p,b:\'J\'},r:{c:{w:-l},b:\'u\',a:1m,h:\'C\'},A:{c:{e:W},b:\'y\',a:1o}},{i:\'1S 1q s 1z 1M\',d:1,g:1,f:{e:1,j:\'n\',T:\'R\'},I:{c:{B:0.1h,x:-1P,1B:0},a:18,b:\'1A\'},r:{c:{B:1,x:-1C,1B:1},b:\'y\',a:18,h:\'z\'}},{i:\'1X 1q s 1z 1M\',d:1,g:1,f:{e:1,j:\'n\',T:\'R\'},I:{c:{B:0.1h,w:-1P,1B:0},a:18,b:\'1A\'},r:{c:{B:1,w:-1C,1B:1},b:\'y\',a:18,h:\'C\'}},{i:\'1S 1q s 1z 1k\',d:[2,3],g:[3,5],f:{e:1c,j:\'k\'},I:{c:{B:0.q,1B:0},a:1e,b:\'1A\'},r:{c:{x:-1r,w:l},b:\'u\',a:1,h:\'C\'},A:{c:{x:0,1B:1},b:\'y\',a:1m}},{i:\'1X 1q s 1z 1k\',d:[2,3],g:[3,5],f:{e:1c,j:\'k\'},I:{c:{B:0.q,1B:0},a:1e,b:\'1A\'},r:{c:{w:-1r,x:l},b:\'u\',a:1,h:\'z\'},A:{c:{w:0,1B:1},b:\'y\',a:1m}}]};', 62, 136, '||||||||||duration|easing|transition|rows|delay|tile|cols|direction|name|sequence|random|180|to|forward|type|600|75|animation|and|left|easeInOutQuart|90|rotateX|rotateY|easeOutQuart|horizontal|after|scale3d|vertical|reverse|Scaling|1000|right|easeInOutBack|before|easeOutBack|top|bottom|from|85|columns|tiles|mixed|large|spinning|depth|750|slide|200|sliding|Fading|Sliding||||fade|easeInOutQuint|||turning|1500|55|100|Spinning|50|Turning|350|easeInOutQuad|scale|65|col|30|cuboids|500|1200|450|400|700|rotating|45|rotate|cuboid|35|Carousel|Flying|Smooth|800|fading|easeInQuart|opacity|540|95|Vertical|Mirror|Horizontal|mirror|drunk|91|1300|out|cube|150|2000|270|in|directions|Horizontally|Drunk|colums|scaling|topright|Vertically|bottomright|t3d|87|diagonal|layerSliderTransitions|bottomleft|850||topleft|sliging|linear|Crossfading|t2d|var'.split('|'), 0, {}));
