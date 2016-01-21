(function($) {
   /**
    * Blue Box Ui Page Object
    *
    */
    $.blueBoxUiPage = function(options) {
        this.__construct(options);
    }
    
    $.blueBoxUiPage.settings = {
        speed               : 500,
        easing              : 'cubic-bezier(.5,.5,.5,.5)',
        primaryViewSpeedDev : 1.5,
        primaryViewExitPos  : '-20%',
        blueBoxLoaderIcon   : null,
        blueBoxScriptsLoader: null
    }
    
    $.blueBoxUiPage.prototype = {
        __construct: function(options) {
            this.options = $.extend(true, {}, $.blueBoxUiPage.settings, options);
            
            this.blueBoxLoaderIcon  = this.options.blueBoxLoaderIcon;
            this.lastScrollPosition = $(window).scrollTop();
            this.currUrl            = window.location.href;
            this.prevUrl            = null;
            
            this.headerFixedElements         = $('#mobile-menu-buttons');
            this.previousHeaderFixedElements = false;
            this.leftViewFixedElements       = false;
            this.rightViewFixedElements      = false;
            this.closeViewButton             = $('#bb-ui-close-primary-view');
            this.footerElement               = $('#bb-footer');
            
            if (this.setupViews() === false) {
                return false;
            }
            
            this.setupDimensions();
            this.bindListeners();
        },
        setupViews: function() {
            this.activeView = $('.bb-ui-view.primary').blueBoxUiView();
            if (this.activeView.size() < 1) {
                return false;
            }
            if (this.activeView.hasClass('left')) {
                this.activeViewPosition = 'left';
                
                this.leftView   = this.activeView;
                this.rightView  = $('<div class="bb-ui-view right" />').blueBoxUiView();
                
                this.leftView.after(this.rightView);
                
                this.inactiveView = this.rightView;
                
                this.leftViewUrl  = this.currUrl;
                this.rightViewUrl = '';
            } else {
                this.activeViewPosition = 'right';
                
                this.leftView   = $('<div class="bb-ui-view left" />').blueBoxUiView();
                this.rightView  = this.activeView;

                this.rightView.before(this.leftView);
                
                this.inactiveView = this.leftView;
                
                this.leftViewUrl  = '';
                this.rightViewUrl = this.currUrl;
            }
            
            if (this.leftView.attr('id') === undefined) {
                this.leftView.attr('id', 'bb-ui-view-' + uniqid());
            }
            if (this.rightView.attr('id') === undefined) {
                this.rightView.attr('id', 'bb-ui-view-' + uniqid());
            }
        },
        setupDimensions: function() {
            this.documentWidth  = $(document).width();
            this.documentHeight = $(document).height();
            this.windowHeight   = $(window).height();
            this.footerHeight   = this.footerElement.outerHeight();
        },
        openPrevView: function(url) {
            var _self = this;
            
            // Set the new values
            this.activeView         = this.leftView;
            this.inactiveView       = this.rightView;
            this.prevViewPosition   = this.activeViewPosition;
            this.activeViewPosition = 'left';
            
            this.start();
            
            // Set views before animation and loader icon positions
            this.leftView.css({
                top: 0,
                position: 'fixed',
                display: 'block',
                width: this.documentWidth,
                height: '100%',
                // x: '-100%',
                x: this.options.primaryViewExitPos,
                zIndex: -1
            });
            this.leftView.blueBoxUiView('overlay', function(){
                this.css({
                    opacity: 1,
                    zIndex: 9
                });
            });
            this.rightView.css({
                zIndex: 10
            });
            this.blueBoxLoaderIcon.icon.css({
                display: 'block',
                position: 'fixed',
                x: -(this.documentWidth/2),
                top: '50%',
                left: '50%',
                marginLeft: -30,
                zIndex: 999
            });
            this.footerElement.css({
                zIndex: 4
            });

            // Trigger some events for other plugins
            $('body').trigger('bb-ui-view-change-prev');

            // Animate the heading if any (it's fixed and becomes ...)
            var $_pageHeading = $('#bb-page-heading');
            if ($_pageHeading.size() > 0) {
                $_pageHeading.css({
                    position: 'absolute',
                    top: $_pageHeading.offset().top
                }).transit({
                    opacity: .5
                }, this.options.speed, function(){
                    $(this).css({
                        opacity: '',
                        transform: ''
                    });
                });
            }

            // Animate the views and loader icon
            this.blueBoxLoaderIcon.icon.transit({
                x: 0
            }, this.options.speed, this.options.easing);
            this.leftView.transit({
                x: 0
            }, this.options.speed/this.options.primaryViewSpeedDev, this.options.easing);
            this.rightView.transit({
                x: '100%'
            }, this.options.speed, this.options.easing, function(){
                _self.loadCurrentView(url);
            });
            
            // Animate the fixed footer element as well
            this.footerElement.transit({
                x: '100%'
            }, this.options.speed - 50, this.options.easing, function(){
                _self.leftView.css({
                    zIndex: ''
                });
                $(this).css({
                    zIndex: '',
                    transform: ''
                })
            });
        },
        openNextView: function(url) {
            
            // this.options.speed = 5000;
            var _self = this;
            
            // Set the new values
            this.activeView         = this.rightView;
            this.inactiveView       = this.leftView;
            this.prevViewPosition   = this.activeViewPosition;
            this.activeViewPosition = 'right';
            
            this.start();
            
            // Set views before animation and loader icon positions
            this.rightView.css({
                top: 0,
                position: 'fixed',
                display: 'block',
                width: this.documentWidth,
                height: '100%',
                x: '100%',
                zIndex: 10
            });
            this.rightView.blueBoxUiView('overlay', function(){
                this.css({
                    opacity: 1,
                    zIndex: 10
                });
            })
            // this.rightView.blueBoxUiView('content', function(){
            //     this.css({
            //         opacity: 0
            //     });
            // });
            
            this.leftView.css({
                zIndex: 3
            });
            this.blueBoxLoaderIcon.icon.css({
                display: 'block',
                position: 'fixed',
                x: this.documentWidth,
                top: '50%',
                left: '50%',
                marginLeft: -30,
                zIndex: 999
            });
            
            // Trigger some events for other plugins
            $('body').trigger('bb-ui-view-change-next');
            
            // Animate the views and loader icon
            this.blueBoxLoaderIcon.icon.transit({
                x: 0
            }, this.options.speed, this.options.easing);
            // if (!$('body').hasClass('mobile-menu-active')) {
                this.leftView.transit({
                    x: this.options.primaryViewExitPos
                }, this.options.speed*this.options.primaryViewSpeedDev, this.options.easing);
            // }
            this.rightView.transit({
                x: 0
            }, this.options.speed, this.options.easing, function(){
                _self.loadCurrentView(url);
            });
            
            // Animate the fixed footer element as well
            this.footerElement.transit({
                x: this.options.primaryViewExitPos
            }, this.options.speed*this.options.primaryViewSpeedDev, this.options.easing, function(){
                $(this).css({
                    zIndex: '',
                    transform: ''
                });
            });
        },
        openSameView: function(url) {
            var _self = this;
            
            this.prevViewPosition   = this.activeViewPosition;
            
            var lastScrollPosition = this.lastScrollPosition;
            this.start(this.activeViewPosition);
            
            if (!$('body').hasClass('mobile-menu-active')) {
                var scrollPosition = $(window).scrollTop();
                var dev = this.footerHeight - (this.documentHeight - (this.windowHeight + scrollPosition));
                if (dev > 0) {
                    $('html, body').animate({
                        scrollTop: scrollPosition - dev
                    }, this.options.speed*.9);
                }
            }
            
            // Trigger some events for other plugins
            $('body').trigger('bb-ui-view-change-same');
            
            this.activeView.blueBoxUiView('getContent').transit({
                opacity: 0
            }, this.options.speed, function(){
                _self.blueBoxLoaderIcon.center();
                _self.loadCurrentView(url);
                
                _self.lastScrollPosition = lastScrollPosition;
            });

        },
        loadCurrentView: function(url) {
            var _self = this;
            if (url !== undefined && url) {
                this.pushUrlWindowState(url);
                if (this.activeViewPosition === 'left') {
                    this.leftViewUrl = this.getRealUrl(url);
                } else {
                    this.rightViewUrl = this.getRealUrl(url);
                }
                this.lastScrollPosition = $(window).scrollTop();
                
                $(window).scrollTop(0);
                
                $('body').trigger('blue-box-before-content-loaded');
                
                $.ajax({
                    url: url,
                    success: function(data) {
                        var elements = _self.getElementsFromString(data);
                        
                        document.title = elements.head.children('title').text();
                        elements.body.removeClass('not-loaded');
                        $('body').attr('class', elements.body.attr('class'));
                        
                        var incomingView = elements.body.find('.bb-ui-view.primary').blueBoxUiView();
                        if (incomingView.size() < 1) {
                            _self.error();
                            return;
                        }
                        
                        incomingView.blueBoxUiView('overlay', function(){
                            this.css({
                               opacity: 1,
                               zIndex: 10 
                            });
                        });
                        
                        _self.activeView.html(incomingView.html());
                        _self.activeView.blueBoxUiView('refresh');
                        
                        _self.end(elements.body);
                    }
                });
            } else {
                if (this.activeViewPosition === 'left') {
                    this.pushUrlWindowState(this.leftViewUrl);
                } else {
                    this.pushUrlWindowState(this.rightViewUrl);
                }

                this.end(false);
            }
        },
        start: function(prevView) {
            var _self = this;
            
            this.headerFixedElements.transit({
                opacity: 0,
                x: 0
            }, this.options.speed*.5);
            
            this.closeViewButton.transit({
                opacity: 0,
                display: 'block'
            }, this.options.speed, function(){
                $(this).css({
                    display: 'none',
                    zIndex: ''
                });
            });
            this.activeView.blueBoxUiView('heading', function(){
                if (prevView === _self.activeViewPosition) {                    
                    this.transit({
                        y: -this.outerHeight()
                    }, _self.options.speed, function(){
                        $(this).css({
                            opacity: ''
                        });
                    });
                } else {
                    this.css({
                        opacity: 0
                    });
                }
            });
        },
        end: function(newBodyElement) {
            var _self = this;
            
            this.activeView.addClass('primary');
            if (newBodyElement !== false && newBodyElement.size() > 0) {$(window).scrollTop(0);
                // Replace fixed heder elements
                var incomingHeaderFixedElements = newBodyElement.children('#' + _self.headerFixedElements.attr('id'));
                if (incomingHeaderFixedElements.size() > 0) {
                    if (_self.activeViewPosition === 'right' && _self.prevViewPosition !== 'right') {
                        _self.leftViewFixedElements = _self.headerFixedElements.clone();
                    } else {
                        _self.rightViewFixedElements = _self.headerFixedElements.clone();
                    }
                    _self.headerFixedElements.html(incomingHeaderFixedElements.html());
                    // _self.previousHeaderFixedElements = _self.headerFixedElements.clone();
                }
                // Check for heading fixed elements
                // var incomingPageHeading = newBodyElement.find('#bb-page-heading');
                // $('#bb-page-heading').remove();
                // if (incomingPageHeading.size() > 0) {
                //     incomingPageHeading.css('opacity', 0);
                //     _self.activeView.prepend(incomingPageHeading);
                // }
                // Reload the scripts for the new view
                this.options.blueBoxScriptsLoader.reload(this.activeView.attr('id'), function(){
                    $(window).scrollTop(0);
                    _self.displayViewsOnEnd();
                    $(window).trigger('resize');
                    
                    // Trigger some events for other plugins
                    $('body').trigger('bb-ui-view-changed');
                });

            } else {
                if (this.activeViewPosition === 'left' && this.leftViewFixedElements !== false) {
                    this.headerFixedElements.html(this.leftViewFixedElements.html());
                    this.leftViewFixedElements.remove();
                    this.leftViewFixedElements = false;
                } else if (this.rightViewFixedElements !== false) {
                    this.headerFixedElements.html(this.rightViewFixedElements.html());
                    this.rightViewFixedElements.remove();
                    this.rightViewFixedElements = false;
                }
                // if (this.previousHeaderFixedElements !== false) {
                //     this.headerFixedElements.html(this.previousHeaderFixedElements.html());
                //     this.previousHeaderFixedElements.remove();
                //     this.previousHeaderFixedElements = false;
                // }
                this.displayViewsOnEnd();
                $(window).scrollTop(this.lastScrollPosition);
                
                // Trigger some events for other plugins
                $('body').trigger('bb-ui-view-changed');
                $(window).trigger('resize');
            }
        },
        displayViewsOnEnd: function() {
            var _self = this;
            
            // Set css for upcoming transitions
            _self.inactiveView.css({
                position: '',
                width: '',
                height: '',
                display: 'none',
                zIndex: '',
                transform: ''
            }).removeClass('primary');
            _self.activeView.css({
                position: '',
                top: '',
                position: '',
                display: '',
                width: '',
                height: '',
                zIndex: '',
                transform: ''
            }).addClass('primary');
            
            // SHow header fixed elements
            _self.headerFixedElements.transit({
                opacity: 1
            }, _self.options.speed, function(){
                $(this).css({
                    opacity: ''
                });
            });
            
            // Show the close view button if right view active
            if (_self.activeViewPosition === 'right') {
                _self.closeViewButton.css({
                    opacity: 0,
                    display: 'block',
                    zIndex: 3
                }).transit({
                    opacity: 1
                }, _self.options.speed);
            }
            // Transit show the active content
            _self.activeView.blueBoxUiView('getOverlay').transit({
                opacity: 0
            }, _self.options.speed, function(){
                $(this).css({
                    opacity: '',
                    zIndex: ''
                });
            });
            
            // Transit show the heading
            _self.activeView.blueBoxUiView('heading', function(){
                if (this.size() > 0) {
                    this.transit({
                        y: 0,
                        opacity: 1
                    }, _self.options.speed, function(){
                        $(this).css({
                            opacity: '',
                            transform: ''
                        });
                    });
                } else {
                    _self.activeView.blueBoxUiView('getContainer').css('paddingTop', '');
                }
            });
            
            // Hide the loader icon
            _self.blueBoxLoaderIcon.icon.hide();
        },
        error: function() {
            
        },
        getElementsFromString: function(data) {
            var dataHead = data.match(/<\s*head.*>[\s\S]*<\s*\/head\s*>/ig).join("");
            dataHead = $(dataHead.replace(/<\s*head/gi,"<div"));

            var dataBody = data.match(/<\s*body.*>[\s\S]*<\s*\/body\s*>/ig).join("");
            dataBody  = $(dataBody.replace(/<\s*body/gi,"<div"));
            
            return {head: dataHead, body: dataBody}
        },
        getRealUrl: function(url) {
            var result = url;
            if (url === 'index.html' || url === 'index.php') {
                result = gummBaseUrl;
            }
            
            return result;
        },
        pushUrlWindowState: function(url) {
            window.history.pushState({path:url}, '', url);
            if (this.popStateListeners !== true) {
                this.popStateListeners = true;
                this.bindPopStateBackListener();
            }
        },
        bindPopStateBackListener: function() {
            var _self = this;
            $(window).on('popstate', function(e) {
                var url = _self.getRealUrl(location.href);
                if (gummBaseUrl.indexOf(url) === 0 && _self.activeViewPosition === 'right') {
                    _self.openPrevView(location.href);
                } else if (_self.activeViewPosition === 'right') {
                    _self.openSameView(location.href);
                }
                // console.log(location);
                // if (_self.current === 'right') {

                // } else {
                    // _self.openPreviousView(location.pathname, false);
                // }
            });
        },
        bindListeners: function() {
            var _self = this;
            this.closeViewButton.on('click', function(e){
                e.preventDefault();
                e.stopPropagation();
                
                _self.openPrevView();
            });
            $(document).on('click', 'a', function(e){
                // console.log('passed');
                var $this = $(this);
                // console.log('passed');
                var url = _self.getRealUrl($this.attr('href'));

                var $targ = $this.parent();
                
                if ($targ.hasClass('bb-services-pagination')) {
                    return
                }

                if ($targ.parent().hasClass('footer-social-links')) {
                    return 
                }

                if ($(this).hasClass('outside-link')) {
                    return
                }

                if ($(this).attr('id') === 'mobile-menu-button') {
                    return;
                }
                
                e.preventDefault();
                console.log('>passed');

                var tylerTest = window.location.href;
                
                console.log(url, tylerTest);

                if (url === window.location.href) {
                    console.log('>passed');
                    return;
                }
                
                if (url === '#') {


                } else if (url.indexOf('#') === 0) {
                    var $scrollToEle = $(url);
                    if ($scrollToEle.size() > 0) {
                        $('html, body').animate({
                            scrollTop: $scrollToEle.offset().top
                        }, _self.options.speed*2, function(){
                            window.location.hash = url;
                        });
                    }
                } else if (url.indexOf('#') > 0) {

                    tylerTest2 = url.indexOf('#');
                    console.log(tylerTest2);
                    
                    console.log(gummBaseUrl);

                } else if (gummBaseUrl.indexOf(url) === 0) {
                    if (_self.leftViewUrl.length > 0) {
                        _self.openPrevView();
                    } else {
                        _self.openPrevView(url);
                    }
                } else if (_self.activeViewPosition === 'left') {
                    _self.openNextView(url);
                } else {
                    _self.openSameView(url);
                }
            });
            $(window).on('resize', function(){
                _self.setupDimensions();
            });
        }
    }
    
   /**
    * Blue Box Ui View Plugin
    *
    */
    $.blueBoxUiView = function blueBoxUiView(options, callback, element) {
        this.element = $(element);
        this.__construct(options, callback);
    }
    $.blueBoxUiView.prototype = {
        __construct: function(options, callback) {
            this.init();
        },
        init: function() {
            this.container = this.element.children('.bb-ui-view-container');
            if (this.container.size() < 1) {
                this.initialize();
            } else {
                this.content = this.container.children('.bb-ui-view-content');
            }
            this.heading     = this.element.children('#bb-page-heading');
            this.overlay     = this.element.children('.bb-ui-view-loading-overlay');
            if (this.overlay.size() < 1) {
                this.overlay = $('<div class="bb-ui-view-loading-overlay" />');
                this.element.prepend(this.overlay);
            }
        },
        initialize: function() {
            this.container   = $('<div class="bb-ui-view-container" />');
            this.content     = $('<div class="bb-ui-view-content" />');
            this.overlay     = $('<div class="bb-ui-view-loading-overlay" />');
            
            this.element.append(this.overlay);
            this.container.append(this.content);
            this.element.append(this.container);
        }
    }
    $.fn.blueBoxUiView = function blueBoxUiViewFn(options, callback) {
        var result = this;
        this.each(function () {
            var instance = $.data(this, 'blueBoxUiView');
            if (instance) {
                switch (options) {
                 case 'content':
                    callback.apply(instance.content);
                    break;
                 case 'container':
                    callback.apply(instance.content);
                    break;
                 case 'heading':
                    callback.apply(instance.heading);
                    break;
                 case 'overlay':
                    callback.apply(instance.overlay);
                    break;
                 case 'getContent':
                    result = instance.content;
                    break;
                 case 'getContainer':
                    result = instance.container;
                    break;
                 case 'getHeading':
                    result = instance.heading;
                    break;
                 case 'getOverlay':
                    result = instance.overlay;
                    break;
                 case 'refresh':
                    instance.init();
                    break;
                }
            } else {
                $.data(this, 'blueBoxUiView', new $.blueBoxUiView(options, callback, this));
            }
        });
        return result;
    }
})(jQuery);