var gummBaseUrl = gummGetBaseUrl(),
    blueBoxLoadedIndicators = {window: false, video: true};

(function($) {
    window.checkBlueBoxPageLoaded = function() {
        var allLoaded = true;
        $.each(blueBoxLoadedIndicators, function(type, loaded) {
            if (!loaded) {
                allLoaded = false;
                return false;
            }
        });
        
        if (allLoaded) {
            $(window).trigger('blue-box-page-loaded');
        }
    };
    // Define constants
    var $bbSecCont,
        $bbSecContHeight,
        $bbPagesBullets,
        $bbPagesBulletsHeight,
        $bbFixedNav,
        $bbArrowDown,
        bbFooterHeight,
        s,
        bBoxView,
        blueBoxParallax,
        blueBoxScriptsLoader,
        blueboxLoaderIcon;

	$(document).ready(function (){
    blueboxLoaderIcon    = new $.blueboxLoaderIcon();
        blueBoxScriptsLoader = new $.blueBoxScriptsLoader();
        
        blueBoxScriptsLoader.push('const', function() {
            $bbSecCont              = $('.bb-hello .bb-section-container');
            $bbSecContHeight        = $bbSecCont.height();
            $bbPagesBullets         = $('.bb-pages-bullets');
            $bbPagesBulletsHeight   = $bbPagesBullets.outerHeight() + ($bbPagesBullets.children().size()*20);
            $bbFixedNav             = $('a.bb-fixed-nav');
            $bbArrowDown            = $('span.bb-arrow-down');
            
            bbFooterHeight          = $('footer').outerHeight() - 2;
        });

        blueBoxScriptsLoader.push('ready', function(scope) {
            if (scope === undefined) {
                scope = '';
            }
            
            // Initialize parallax if not touch device
            if (!Modernizr.touch) {
                // blueBoxParallax = new $.blueBoxParallax();
                $('.bb-parallax-bg').each(function(i, ele){
                    var $ele = $(ele);
                    var speedFactor = $ele.data('speedFactor') === undefined ? 0.5 : $ele.data('speedFactor');
                    
                    // setTimeout(function() {
                    //     $ele.css('background-attachment', 'fixed');
                    // }, 2000);

                    $ele.parallax('50%', speedFactor);
                });
            }

            // Initialize the BlueBoxScrollr widget
            new $.blueBoxScrollr({
                deviation: -200
            });

            // Initialize Blue Box Bullets Navigation
            $(scope + '.bb-pages-bullets').blueBoxBulletsNavi({
                speed: 1000,
                easing: 'linear'
            });

            $(scope + '.bb-video-player').bboxBgVideoPlayer();
        });
        
        blueBoxScriptsLoader.push('load', function(scope) {
            if (scope === undefined || typeof scope !== 'string') {
                scope = '';
            }
            
            $('body').css({
                paddingBottom   : bbFooterHeight,
            });

            var _pageHeadingOuterHeight = $(scope + '#bb-page-heading').outerHeight();
            if (_pageHeadingOuterHeight === null) {
                _pageHeadingOuterHeight = '';
            }
            $('.bb-ui-view.primary > .bb-ui-view-container').css({
                paddingTop      : _pageHeadingOuterHeight
            });
            
            s.refresh();

            
            // Bind BlueBox sliders
            $(scope + '.bb-slider').each(function(i, ele){
                var $ele             = $(ele);
                var $sliderElement   = $ele.children('.swiper-container');
                var $swiperSlides    = $sliderElement.children('.swiper-wrapper').children('.swiper-slide');
                var $activeSlide     = $swiperSlides.filter('.active-item');
                if ((i === 2) &&  $('.bb-ui-view .left .primary')) {
                 activeSlideIndex = 1;
                } else {
                    var activeSlideIndex = $activeSlide.size() > 0 ? $activeSlide.index() : 0;
                }
                
                $swiperSlides.filter(':not(:first)').css('display', 'none');
                $sliderElement.css({
                    height: $(ele).height(),
                    width: $(ele).width(),
                    overflow: 'hidden'
                });
                $swiperSlides.css('display', '');

                var swiperSettings = $.extend(true, {
                    pagination: false,
                    paginationClickable: true,
                    centeredSlides: true,
                    slidesPerView: 'auto',
                    calculateHeight: true,
                    initialSlide: activeSlideIndex,
                    onFirstInit: function(swiper) {
                        // var sliderWrapper = $(swiper.container).parent();
                        $sliderElement.css({
                            height: '',
                            width: '',
                            overflow: ''
                        });
                        swiper.swipeTo(activeSlideIndex);
                    },
                    onInit: function(swiper) {

                        // $sliderElement.addClass('initialized');
                    },
                    onSlideChangeEnd: function(swiper) {
                        if ($controlNavButtons !== undefined) {
                            $controlNavButtons.removeClass('active');
                            $controlNav.children().eq(swiper.activeLoopIndex).addClass('active');
                        }
                        if ($slideNav !== undefined) {
                            var val = swiper.activeLoopIndex * $slideNav.slider('option', 'step');
                            $slideNav.slider('value', val);
                        }
                    }
                }, $ele.data());

                var swiper = $sliderElement.swiper(swiperSettings);

                if ($ele.data('controlNav') !== undefined) {
                    var $controlNav = $ele.children($ele.data('controlNav'));
                    var $controlNavButtons = $controlNav.children();
                    $controlNavButtons.on('click', function(e){
                        e.preventDefault();
                        var $this = $(this);

                        $this.addClass('active');
                        $this.siblings('li').removeClass('active');

                        var index = $(this).index();
                        var swiper = $sliderElement.data('swiper');

                        swiper.swipeTo(index);
                    });
                }

                if ($ele.data('directionNav') !== undefined) {
                    var $directionNav = $ele.find($ele.data('directionNav'));
                    $directionNav.children().on('click', function(e){
                        e.preventDefault();

                        if ($(this).hasClass('prev')) {
                            swiper.swipePrev();
                        } else {
                            swiper.swipeNext();
                        }
                    });
                }
                
                if ($ele.data('slideNav') !== undefined) {
                    var $slideNav       = $ele.find($ele.data('slideNav'));
                    var slideNavWidth   = $slideNav.width();
                    
                    $slideNav.slider({
                        create: function(event, ui) {
                            $(this).slider('option', {
                                 step: 100/(swiper.slides.length-1)
                            });
                        },
                        slide: function(event, ui) {
                             var val = ui.value/$(this).slider('option', 'step');
                             swiper.swipeTo(Math.round(val));
                        }
                    });
                }
                
            });
            
            // console.log(scope.length);
    	    setTimeout(function() {
    		    $('.bb-hello h1').addClass('active');
    		}, scope.length > 0 ? 0 : 500);

    		setTimeout(function() {
    			$('.bb-hello p.welcome-text').addClass('active');
    		    $('.bb-hello figure').addClass('active');

                $('.bb-hello .bb-dots-details').addClass('initialized');

    		    $bbArrowDown.addClass('active');
    		    $('.bb-fixed-nav').addClass('active');
    		    $('.bb-contact-button').addClass('active');
    		    $('.bb-logo').addClass('active');
    		    $('.bb-pages-bullets').addClass('active');
    		    $('.bb-hello .scroll-down').addClass('active');
    		}, scope.length > 0 ? 0 : 2000);
        });
        

        // Initialize the BlueBoxLoadableContent widget
        bBoxView = new $.blueBoxUiPage({
            blueBoxLoaderIcon: blueboxLoaderIcon,
            blueBoxScriptsLoader: blueBoxScriptsLoader
        });
        // bBoxView = new $.blueBoxView({
        //     speed: 800,
        //     primaryViewSpeedDev : 1.5,
        //     primaryViewExitPos  : '-20%',
        //     blueBoxScriptsLoader    : blueBoxScriptsLoader
        // 
        // });

        // Initialize skrollr
        s = skrollr.init({
            forceHeight: false,
            mobileCheck: function() {
                return false;
            }
        });

    	// Initialize niceScroll
        // $('html').niceScroll({
        //              mousescrollstep: 80,
        //              scrollspeed: 120,
        //              cursorborder: false,
        //              zindex: 99999
        //         });
        //         $('#mobile-menu').niceScroll({
        //             mousescrollstep: 50,
        //             scrollspeed: 100,
        //             cursorborder: false,
        //             zindex: 10
        //         });

     	// Mobile Menu call
        $('#mobile-menu').blueBoxMobileMenu({
            onOpen: function() {
                $('#bb-footer').css({
                    zIndex: 0
                }).transit({
                    x: 250
                }, 490, function(){
                     $(this).css({
                         // zIndex: -1
                     });
                });
                this.button.addClass('clicked');
            },
            onClose: function(options){
                
                if (options.alsoTranslate) {
                    $('#bb-footer').css({
                         // zIndex: ''
                    }).transit({
                        x: 0
                    }, 490, function(){
                         $(this).css({
                             zIndex: ''
                         });
                    });
                }
                
                this.button.removeClass('clicked');
            }
        });
        

        $('li.menu-item').on('mouseenter', function() {
            $(this).find('.links-out').css("color", "rgba(255,255,255,0.5)")
        });
        $('li.menu-item').on('mouseleave', function() {
            $(this).find('.links-out').css("color", "rgba(255,255,255,0.1)")
        });

        // var _blueBoxPreloadImages = $([]);
        // $('.bb-section-bg').each(function(i, ele){
        //     var $ele = $(ele);
        //     bgPropMatch = $ele.css('background-image').match(/url\((.*)\)/);
        //     if (bgPropMatch !== null) {
        //         var $_img = $('<img src="' + bgPropMatch[1] + '" />');
        //         _blueBoxPreloadImages = _blueBoxPreloadImages.add($_img);
        //     }
        // });
        // imagesLoaded(_blueBoxPreloadImages, function(){
        //     // console.log('asd');
        // });


        // hello section auto resize
        $(window).on('resize', function(){
            var $winHeight = $(window).height();
                $sectionMargin = $winHeight / 2 - $bbSecCont.height() / 2;
                $pagesBulletsMargin = -($bbPagesBulletsHeight/2);

            $('section.bb-hello').height($winHeight);

            $bbSecCont.css('margin-top', $sectionMargin / 0.85);
            $bbPagesBullets.css('margin-top', $pagesBulletsMargin);
            
            $('body').css({
                paddingBottom   : $('footer').outerHeight() - 2,
            });

        }).trigger('resize');
    });

    $(window).load(function(){
        blueBoxLoadedIndicators.window = true;
        checkBlueBoxPageLoaded();
    });
    
    $(window).on('blue-box-page-loaded', function() {
        setTimeout(function() {
            $('.bb-ui-view.primary .bb-ui-view-loading-overlay').css({
                opacity: 1,
                zIndex: 10
            }).transit({
                opacity: 0
            }, 500, function(){
                $(this).css({
                    opacity: '',
                    zIndex: ''
                });
            });
            $('body').removeClass('not-loaded');
            
        }, 500);
    });
    
    // ======= //
    // PLUGINS //
    // ======= //
    
    // BEGIN BLUE BOX LOADER ICON
    $.blueboxLoaderIcon = function(options) {
        this.__construct(options);
    };
    $.blueboxLoaderIcon.prototype = {
        __construct: function(options) {
            this.icon = $('<span id="bb-page-loader-icon" class="bb-css3-preloader bb-icon-loading-content"><span></span></span>');
            this.icon.css({
                display: 'none'
            });
            $('body').append(this.icon);
        },
        center: function() {
            this.icon.css({
                position: 'fixed',
                top: '50%',
                left: '50%',
                marginLeft: -30,
                display: 'block',
                zIndex: 999
            });
        },
        hide: function() {
            this.icon.css({
                display: 'none',
                zIndex: ''
            });
        }
    };

    // BEGIN BLUE BOX SCRIPTS LOADER PLUGIN
    $.blueBoxScriptsLoader = function (options) {
        // console.log('asd');
        this.__construct(options);
    };

    $.blueBoxScriptsLoader.prototype = {
        __construct: function(options) {
            this.callbacks = {};
        },
        push: function(state, callback) {
            if (!state || !callback) {
                return;
            }
            this.callbacks[state] = callback;
            
            switch (state) {
             case 'ready':
                $(document).ready(function(){
                    callback.call(this);
                });
                break;
             case 'load':
                $(window).load(callback);
                break;
             case 'const':
                callback.call(window);
                break;
            }
        },
        reload: function(scope, onReloadCallback) {
            if (scope === undefined) {
                scope = '';
            } else {
                scope = '#' + scope + ' ';
            }
            
            if (this.callbacks.const !== undefined) {
                this.callbacks.const.call(window);
            }
            $.each(this.callbacks, function(state, callback) {
                switch (state) {
                 case 'const':
                    break;
                 case 'load':
                    var $imgs = $(scope + 'img');
                    if ($imgs.size() > 0) {
                        imagesLoaded($imgs, function(){
                            callback.call(window, scope);
                            
                            if (onReloadCallback !== undefined && typeof onReloadCallback === 'function') {
                                onReloadCallback.call(this);
                            }
                        });
                    } else {
                        callback.call(window, scope);
                    }
                    break;
                 default:
                    callback.call(window, scope);
                    break;
                }
            });
        }
    };
    
    // BEGIN BLUEBOX PARALLAX PLUGIN
    $.blueBoxParallax = function blueBoxParallax(options, callback) {
        this.__construct(options);
    };

    $.blueBoxParallax.settings = {
        items: 'section .bb-parallax-bg',
        reverseScrolling: false,
        accuracy: 0.2
    };

    $.blueBoxParallax.prototype = {
        __construct: function(options) {
            this.options = $.extend(true, {}, $.blueBoxParallax.settings, options);
            this.items = $(this.options.items);
        
            this.lastViewPortBottom = null;
            this.lastScrollPosition = null;
            
            this.calculatePositions();
            this.bindListeners();
        },
        calculatePositions: function() {
            var _self = this;
            
            this.windowHeight = $(window).height();
            this.itemsOffsets = [];
            this.items.each(function(i, ele){
                var $ele = $(ele);
                
                var height = $ele.height();
                var eleTop      = $ele.offset().top;
                var eleBottom   = eleTop + height;

                
                _self.itemsOffsets.push({
                    top:    eleTop,
                    bottom: eleBottom,
                    height: height
                });
            });
            
        },
        parallax: function() {
            var _self = this;
            var scrollPosition = $(window).scrollTop();
            var viewPortBottom = scrollPosition + this.windowHeight;
            
            if (this.lastViewPortBottom === null) {
                this.lastViewPortBottom = viewPortBottom;
            }
            if (this.lastScrollPosition === null) {
                this.lastScrollPosition = scrollPosition;
            }

            this.items.each(function(i, ele){
                var $ele = $(ele);
                var accuracy = $ele.data('accuracy') !== undefined ? $ele.data('accuracy') : _self.options.accuracy;
                var initialPos = $ele.data('initialPosition') !== undefined ? $ele.data('initialPosition') : 0;
                var reverseScrolling = $ele.data('reverseScrolling') !== undefined ? $ele.data('reverseScrolling') : _self.options.reverseScrolling;
                var dev = initialPos !== 0 ? scrollPosition - _self.itemsOffsets[i].top : viewPortBottom - _self.itemsOffsets[i].top;
                var theStep;
                

                if (_self.itemsOffsets[i].top < viewPortBottom && _self.itemsOffsets[i].bottom > scrollPosition) {
                    if (reverseScrolling) {
                        theStep = initialPos + (dev * accuracy);
                    } else {
                        theStep = initialPos - (dev * accuracy);
                    }

                    if ($ele.data('parallaxProp') === 'position') {
                        $ele.children().first().css({
                            top: theStep
                        });
                    } else {
                        $ele.css('background-position', 'center ' + theStep + 'px');
                    }
                }
            });
            
            this.lastViewPortBottom = viewPortBottom;
            this.lastScrollPosition = scrollPosition;
        },
        bindListeners: function() {
            var _self = this;
            $(window)
                .on('scroll', function(e) {
                    _self.parallax();
                })
                .on('resize', function(e) {
                    _self.calculatePositions();
                })
                .on('load', function(e) {
                    _self.calculatePositions();
                });
        
        }
    };
    
    // RESPONSIVE MENU PLUGIN
    $.blueBoxMobileMenu = function blueBoxMobileMenu(options, callback, element) {
        this.element = $(element);
        this.__construct(options, callback);
    };
    
    $.blueBoxMobileMenu.settings = {
        button: '#mobile-menu-button',
        wrap: '.bb-ui-view.primary > .bb-ui-view-container',
        menu: '#mobile-menu',
        alsoTranslate: '#mobile-menu-buttons, #bb-page-heading, #bb-mobile-head',
        items: 'li',
        subMenuItems: 'ul.sub-menu',
        dropdownLink: '.dropdown-link',
        dropDownClassOpen: 'icon-caret-down',
        dropDownClassClose: 'icon-caret-up',
        preventTouchEventsOn: '.swiper-slide',
        onOpen: function(){},
        onClose: function(){}
    };
    
    $.blueBoxMobileMenu.prototype = {
        state: 'closed',
        __construct: function(options, callback) {
            this.options = $.extend(true, {}, $.blueBoxMobileMenu.settings, options);
            this.button = $(this.options.button);
            this.wrap = $(this.options.wrap);
            this.items = this.element.find(this.options.items);
            this.dropdownButtons = this.items.find(this.options.dropdownLink);
            this.menu = $(this.options.menu);
            this.pageWrapper = $('#bb-page-wrapper');
            
            this.bindListeners();
        },
        setSubemuDataHeight: function(submenuItem) {
            submenuItem.css({display: 'block', 'height': 'auto'});
            submenuItem.data('height', submenuItem.outerHeight());
        },
        open: function() {
            var _self = this;
            
            // this.getBackgroundOverlay().css({
            //     display: 'block'
            // });
            
            this.menu.css({
                display:'block'
            });
            this.wrap.transit({
                x: 250
            }, 500, function(){
                $('body').addClass('mobile-menu-active');
            });
            $(this.options.alsoTranslate).transit({
                x:250
            }, 500);
            this.state = 'opened';
            
            this.options.onOpen.call(this);
        },
        close: function(options) {
            var _self = this;
            
            options = $.extend({
                translateWrap: true,
                translateMenu: false,
                alsoTranslate: true
            }, options);

            $('body').removeClass('mobile-menu-active');
            
            if (options.translateMenu) {
                _self.menu.transit({
                    x: -250
                }, 500);
            }
            
            // if (options.translateWrap) {
                this.wrap.transit({
                    x: 0
                }, 500, function(){
                    $(this).css({
                        transform: ''
                    });
                    _self.menu.css({
                        display: 'none',
                        transform: ''
                    });
                    // _self.getBackgroundOverlay().css({
                    //     display: 'none'
                    // });
                });
            // }

            // if (options.alsoTranslate) {
                // console.log('yeah');
                $(this.options.alsoTranslate).transit({
                    x:0
                }, 500);
            // }
            
            this.state = 'closed';
            this.options.onClose.call(this, options);
        },
        // getBackgroundOverlay: function() {
        //     var element = this.wrap.children('.bb-background-overlay');
        //     if (element.size() < 1) {
        //         element = $('<div class="bb-background-overlay" />');
        //         this.wrap.append(element);
        //     }
        //     
        //     return element;
        // },
        bindListeners: function() {
            var _self = this;
            $(document).on('click', this.options.button, function(e){
                e.preventDefault();
                e.stopPropagation();
                if (_self.state === 'closed') {
                    _self.open();
                } else {
                    _self.close();
                }
            });
            this.dropdownButtons.on('click', function(e){
                e.preventDefault();
                var submenuItem = $(this).parent().children(_self.options.subMenuItems);
                if ($(this).hasClass(_self.options.dropDownClassClose)) {
                    $(this).removeClass(_self.options.dropDownClassClose);
                    $(this).addClass(_self.options.dropDownClassOpen);
                    submenuItem.removeClass('dropdown-state-open').addClass('dropdown-state-close');
                    submenuItem.slideUp(200, 'linear');
                } else {
                    $(this).removeClass(_self.options.dropDownClassOpen);
                    $(this).addClass(_self.options.dropDownClassClose);
                    submenuItem.slideDown(200, 'linear');
                    submenuItem.addClass('dropdown-state-open').addClass('dropdown-state-open');
                }
            });
            
            // Some touch events thanks to hammer.js
            try {
                if (Modernizr.touch) {
                    this.wrap.hammer({
                        drag: false,
                        hold: false,
                        release: false,
                        swipe: true,
                        swipe_velocity: 0.5,
                        tap: false,
                        touch: true,
                        transform: false,
                        prevent_mouseevents: true
                    }).on('swiperight', function(e){
                        var $target = $(e.target);
                        if (!$target.is(_self.options.preventTouchEventsOn) && !$target.parent().is(_self.options.preventTouchEventsOn)) {
                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                            _self.open();                            
                        }
                    }).on('swipeleft', function(e){
                        if (!$(e.target).hasClass('swiper-slide')) {
                            _self.close();
                        }
                    }).on('touch', function(e){
                        if (_self.state === 'opened') {
                            _self.close();
                        }
                    });

                }
            } catch (err) {}
            
            this.wrap.on('touchmove', function(e){
                if (_self.state === 'opened') {
                    e.preventDefault();
                }
            });
            
            $('body').on('bb-ui-view-change-same', function(e){
                if (_self.state === 'opened') {
                    _self.close({
                        translateMenu: true
                    });
                }
            });
            $('body').on('bb-ui-view-change-next', function(e){
                if (_self.state === 'opened') {
                    _self.close({
                        translateMenu: true
                    });
                }
            });
            $('body').on('bb-ui-view-change-prev', function(e){
                if (_self.state === 'opened') {
                    _self.close({
                        translateWrap: false,
                        alsoTranslate: false,
                        translateMenu: true
                    });
                }
            });
            $('body').on('bb-ui-view-changed', function(e){
                _self.button = $(_self.options.button);
                _self.wrap = $(_self.options.wrap);
                _self.menu.css({
                    display: 'none'
                });
            });
            
            // $('body').on('gummContentLoading', function(e){
            //     if (_self.state === 'opened') {
            //         _self.close();
            //     }
            // }).on('bb-ui-before-view-change', function(e){
            //     if (_self.state === 'opened') {
            //         _self.close();
            //     }
            // }).on('bb-ui-content-changed', function(e){
            //     _self.button = $(_self.options.button);
            //     _self.wrap = $(_self.options.wrap);
            // });

        }
    };
    
    $.fn.blueBoxMobileMenu = function blueBoxMobileMenuFn(options, callback) {
        this.each(function () {
            var instance = $.data(this, 'blueBoxMobileMenu');
            if (instance) {
                // update options of current instance
                // instance.update(options);
            } else {
                $.data(this, 'blueBoxMobileMenu', new $.blueBoxMobileMenu(options, callback, this));
            }
            
        });
        return this;
    };
    
    // BEGIN BLUEBOX BULLETS NAVI PLUGIN
    $.blueBoxBulletsNavi = function blueBoxBulletsNavi(options, callback, element) {
        this.element = $(element);
        this.__construct(options, callback);
    };
    
    $.blueBoxBulletsNavi.settings = {
        items: 'li',
        currentClass: 'current',
        easing: 'swing',
        speed: 500,
        deviation: 50,
        scrollDeviation: 0
    };
    
    $.blueBoxBulletsNavi.prototype = {
        __construct: function(options, callback) {
            this.options = $.extend(true, {}, $.blueBoxBulletsNavi.settings, options);
            this.initialized = false;
            this.animating = false;
            
            var _self = this;
            
            this.items = this.element.find(this.options.items);
            this.sections = [];
            this.items.each(function(i, ele){
                _self.sections.push($($(ele).children('a:first').attr('href')));
            });
            
            this.calculateOffsets();
            this.bindListeners();
            
            this.currentIndex = this.getCurrentSectionIndex();
        },
        calculateOffsets: function() {
            this.offsets = [];
            var _self = this;
            $.each(this.sections, function(i, ele){
                var offset;
                if (ele.size() > 0) {
                    offset = ele.offset().top;
                } else {
                    offset = 0; 
                }

                _self.offsets.push(offset);
            });
            
        },
        getCurrentSectionIndex: function() {
            var windowTop = $(window).scrollTop();
            
            var currentIndex = null;
            var _self = this;
            $.each(this.offsets, function(i, offset){
                if (windowTop >= offset - _self.options.deviation && windowTop <= offset + _self.options.deviation) {
                    currentIndex = i;
                    return false;
                }
            });
            
            return currentIndex;
        },
        setCurrentSection: function(index) {
            this.currentIndex = index;
            
            this.items.removeClass(this.options.currentClass);
            this.items.eq(index).addClass(this.options.currentClass);
        },
        bindListeners: function() {
            var _self = this;
            this.items.on('click', function(e){
                e.preventDefault();
                var $this = $(this);
                
                var index = $this.index();
                _self.setCurrentSection(index);
                _self.animating = true;
                
                var scrollTo = _self.sections[index].offset().top + _self.options.scrollDeviation;
                $('html,body').animate({scrollTop:scrollTo}, _self.options.speed, _self.options.eaasing, function(){
                    _self.animating = false;
                    window.location.hash = e.toElement.hash;
                });
            });
            

            $(window).on('resize', function(){
                _self.calculateOffsets();
            });
            $(window).on('scroll', function(){
                if (_self.animating === false) {
                    var index = _self.getCurrentSectionIndex();
                    if (index !== null) {
                        _self.setCurrentSection(index);
                    }
                }
            });
        }
    };
    
    $.fn.blueBoxBulletsNavi = function blueBoxBulletsNaviFn(options, callback) {
        this.each(function () {
            var instance = $.data(this, 'blueBoxBulletsNavi');
            if (instance) {
                // update options of current instance
                // instance.update(options);
            } else {
                $.data(this, 'blueBoxBulletsNavi', new $.blueBoxBulletsNavi(options, callback, this));
            }
            
        });
        return this;
    };
    
    // BEGIN BLUEBOX SCROLLR PLUGIN
    $.blueBoxScrollr = function blueBoxScrollr(options, callback) {
        this.__construct(options);
    };

    $.blueBoxScrollr.settings = {
        items: '.bb-scrollr-item',
        inactiveClass: 'not-initialized',
        activeClass: 'initialized',
        deviation: -50
    };

    $.blueBoxScrollr.prototype = {
        initialized: false,
        windowScrollTop: null,
        allInitialized: false,
        scrollEventCallback: null,
        __construct: function(options) {
            this.options = $.extend(true, {}, $.blueBoxScrollr.settings, options);
            this.items = $(this.options.items);
            
            this.initializedOffsets = [],
            this.offsets = [],
            this.bindListeners();
        },
        __destruct: function() {
            $(window).unbind('scroll', this.scrollEventCallback);
        },
        initialize: function() {
            this.initialized = true;
            this.calculatePositions();
            this.unhideHidden();
        },
        calculatePositions: function() {
            var _self = this;
            this.items.each(function(i, ele){
                var $ele = $(ele);
                $ele.offset().top;
                $ele.height();
                var _offset = $ele.offset().top + ($ele.height()/2);
                
                _self.offsets.push(_offset);
            });
        },
        unhideHidden: function() {
            if (!this.initialized) return false;
            var _self = this;
            var scrollBottom = this.getScrollBottom();
            for (var i=0; i<this.offsets.length; i++) {
                if (this.initializedOffsets[i] === true) continue;
                var _offset = this.offsets[i];
                if (_offset < (scrollBottom + _self.options.deviation)) {
                    this.initializedOffsets[i] = true;
                    // setTimeout(function(i){
                        _self.items.eq(i).removeClass(_self.options.inactiveClass).addClass(_self.options.activeClass).trigger('blueBoxScrollred');
                    // }, 0, i);

                
                    if (this.initializedOffsets.length === this.offsets.length) {
                        this.allInitialized = true;
                        this.__destruct();
                    }
                }
            }
        },
        getScrollBottom: function() {
            return $(window).scrollTop() + $(window).height();
        },
        bindListeners: function() {
            var _self = this;
            this.scrollEventCallback = function() {
                _self.unhideHidden();
            };
            $(window).on('scroll', this.scrollEventCallback);
            $(window).on('load', function(e){
                // setTimeout(function(){
                    _self.initialize();
                // }, 0);
            });
        }
    };
    
    // ============== //
    // BBOX BG PLAYER //
    // ============== //
    
    $.bboxBgVideoPlayer = function(options, callback, element) {
        this.element = $(element);
        this.__construct(options, callback);
    };
    
    $.bboxBgVideoPlayer.settings = {
        loop: true,
        autoplay: true,
        mute: true,
        slideshowSpeed: 5000,
        fullScreen: false,
        useFlashForFirefox: true,
        videoTechOrder: ['html5','flash']
        // videoTechOrder: ['flash','html5']
    };
    
    $.bboxBgVideoPlayer.prototype = {
        __construct: function(options, callback) {
            var _self = this;
            
            this.isTouch = Modernizr.touch;
            
            if (this.isTouch) {
                return;
            }
            this.options = $.extend(true, {}, $.bboxBgVideoPlayer.settings, this.element.data(), options);
            
            this.src = this.options.src;
            if (this.src === undefined || !this.src) {
                return;
            }
            
            blueBoxLoadedIndicators.video = false;
            
            if (!$('body').hasClass('has-bb-video')) {
                $('body').addClass('has-bb-video');
            }
            
            this.wrapper = this.element.parent();
            
            var ua = navigator.userAgent.toLowerCase();
            var isFirefox = ua.indexOf('firefox') != -1;
            if (this.options.useFlashForFirefox && (isFirefox)) {
                this.options.videoTechOrder = ['flash', 'html5'];
            }
            
            this.playerElementId    = 'bb-bgvideo-player-' + uniqid();
            this.playerElement      = $('<video id="' + this.playerElementId + '" preload="auto" data-setup="{}" autoplay webkit-playsinline></video>');
            this.playerElement.css({
                display: 'none'
            });
            
            this.poster             = this.element.find('.bb-video-poster');
            
            this.flashApiElement = $([]);
            this.html5ApiElement = $([]);
            
            this.element.append(this.playerElement);
            
            this.calculatePositions();
            this.init();
            this.bindListeners();
        },
        init: function() {
            var _self = this;
            
            this.player = videojs(this.playerElementId, {
                controls: false, 
                autoplay: this.options.autoplay, 
                preload: 'auto', 
                techOrder: this.options.videoTechOrder
            });
            
            this.player.src(this.src);

        },
        ready: function() {
            if (this.flashApiElement.size() > 0) {
                // use flash callback to get mediaAspect ratio
                this.mediaAspect = this.flashApiElement.get(0).vjs_getProperty('videoWidth')/this.flashApiElement.get(0).vjs_getProperty('videoHeight');
            } else {
                // use html5 player to get mediaAspect
                this.mediaAspect = this.html5ApiElement.prop('videoWidth')/this.html5ApiElement.prop('videoHeight');
            }
            this.flashApiElement
                .attr('scale','noborder')
                .attr('width','100%')
                .attr('height','100%');
            
            this.updateSize();
            
            if (this.poster.size() > 0) {
                this.poster.css({
                    display: 'none'
                });
            }
            this.playerElement.css({
                display: 'block'
            });
            blueBoxLoadedIndicators.video = true;
            checkBlueBoxPageLoaded();
            // $('body').addClass('bb-video-loaded');
        },
        updateSize: function() {
            if (this.parentAspect < this.mediaAspect) {
                this.player
                    .width(this.parentWidth*this.mediaAspect)
                    .height(this.parentHeight);
                  
                this.playerElement.css({
                    top: 0,
                    left: -(this.parentHeight*this.mediaAspect-this.parentWidth)/2,
                    // height: this.parentHeight
                });
            
                this.html5ApiElement.css({
                    width: this.parentHeight*this.mediaAspect
                });
                this.flashApiElement.css({
                    width: this.parentHeight*this.mediaAspect,
                    height: this.parentHeight
                });
            } else {
                this.player
                    .width(this.parentWidth)
                    .height(this.parentWidth/this.mediaAspect);
                 
                this.playerElement.css({
                    top: -(this.parentWidth/this.mediaAspect - this.parentHeight)/2,
                    left: 0,
                    // height: this.parentHeight/this.mediaAspect
                });
                this.html5ApiElement.css({
                    width: '100%'
                });
                this.flashApiElement.css({
                    width: this.parentWidth,
                    height: this.parentWidth/this.mediaAspect
                });
            }
            // this.player.width()
        },
        calculatePositions: function() {
            this.parentWidth    = this.wrapper.width();
            this.parentHeight   = this.wrapper.height();
            this.parentAspect   = this.parentWidth/this.parentHeight;
        },
        bindListeners: function() {
            var _self = this;
            this.player.on('ended', function() {
                if (_self.options.loop) {
                    _self.player.currentTime(0);
                    _self.player.play();
                }
            });
            this.player.on('loadedmetadata', function() {
                _self.flashApiElement = $('#' + _self.playerElementId + '_flash_api');
                _self.html5ApiElement = $('#' + _self.playerElementId + '_html5_api');
                
                _self.ready();
            });
            
            $('window').on('resize', function() {
                _self.calculatePositions();
                _self.updateSize();
            });
            
            // $('body').on('blue-box-before-content-loaded', {player: this.player, instance: this}, this.disposePlayer);
        },
        disposePlayer: function(e) {
            $('body').off('blue-box-before-content-loaded', this.disposePlayer);
            try {
                if (e.data.player) {
                    e.data.player.dispose();
                }
            } catch(err){}
            e.data.instance.element.data('bboxBgVideoPlayer', false);
        },
    };
    
    $.fn.bboxBgVideoPlayer = function bboxBgVideoPlayer(options, callback) {
        this.each(function () {
            var instance = $.data(this, 'bboxBgVideoPlayer');
            if (instance) {
                // update options of current instance
                // instance.update(options);
            } else {
                $.data(this, 'bboxBgVideoPlayer', new $.bboxBgVideoPlayer(options, callback, this));
            }
            
        });
        return this;
    };

})(jQuery);

L.mapbox.accessToken = 'pk.eyJ1IjoidGRyZWl0eiIsImEiOiJyN050dGdJIn0.72HAwKIHesHgbNvJi41v0Q';
    var map = L.mapbox.map('map', 'tdreitz.hm21ldll', {zoomControl: false}).setView([34.011, -118.375], 12);

    // disable drag and zoom handlers
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    // disable tap handler, if present.
    if (map.tap) map.tap.disable();
        

function uniqid (prefix, more_entropy) {
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +    revised by: Kankrelune (http://www.webfaktory.info/)
  // %        note 1: Uses an internal counter (in php_js global) to avoid collision
  // *     example 1: uniqid();
  // *     returns 1: 'a30285b160c14'
  // *     example 2: uniqid('foo');
  // *     returns 2: 'fooa30285b1cd361'
  // *     example 3: uniqid('bar', true);
  // *     returns 3: 'bara20285b23dfd1.31879087'
  if (typeof prefix === 'undefined') {
    prefix = "";
  }

  var retId;
  var formatSeed = function (seed, reqWidth) {
    seed = parseInt(seed, 10).toString(16); // to hex str
    if (reqWidth < seed.length) { // so long we split
      return seed.slice(seed.length - reqWidth);
    }
    if (reqWidth > seed.length) { // so short we pad
      return Array(1 + (reqWidth - seed.length)).join('0') + seed;
    }
    return seed;
  };

  // BEGIN REDUNDANT
  if (!this.php_js) {
    this.php_js = {};
  }
  // END REDUNDANT
  if (!this.php_js.uniqidSeed) { // init seed with big random int
    this.php_js.uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
  }
  this.php_js.uniqidSeed++;

  retId = prefix; // start with prefix, add current milliseconds hex string
  retId += formatSeed(parseInt(new Date().getTime() / 1000, 10), 8);
  retId += formatSeed(this.php_js.uniqidSeed, 5); // add seed hex string
  if (more_entropy) {
    // for more entropy we add a float lower to 10
    retId += (Math.random() * 10).toFixed(8).toString();
  }

  return retId;
}

function gummGetBaseUrl() {
    var base = window.location.origin;
    var pathname = window.location.pathname;
    
    if (pathname.indexOf('/reset') !== false) {
        base += pathname.substr(0, pathname.lastIndexOf('/reset')) + '/reset/';
    }
    
    return base;
}