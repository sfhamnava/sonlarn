String.prototype.toPersin= function(){ 
    var digits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹']; 
    return this.replace(/[0-9]/g, function(w){ return digits[+w] }); 
}

function openModal(modal_id) {
    $('body').append($('.cmp-modal'));
    modal = $('#' + modal_id);
    if ($(".cmp-modal-overlay").length == 0)
        $('body').append('<div class="cmp-modal-overlay"></div>');
    overlay = $('.cmp-modal-overlay').attr('data-modal-id', modal.attr('id'));

    if (modal.find('.modal-close').length == 0)
        modal.find('.header').prepend("<i class='modal-close far fa-times'></i>");

    overlay.append(modal);
    modal.show();
    overlay.fadeIn(200).css('display', 'flex');
}

function loadCssIf(condition, css_url) {
    if (!condition)
        return;

}

function copyToClipboard(txt) {
    const elem = document.createElement('textarea');
    elem.value = txt;
    document.body.appendChild(elem);
    elem.select();
    document.execCommand('copy');
    document.body.removeChild(elem);
    alert('Copied successfully:\n' + txt);
}

$(document).ready(function() {
    //Notif Components
    //Start
    $('.notif-toggle').on('click', function() {
        $('.notif-drawer').toggleClass('open');
    });
    $('.notif-drawer .close').on('click', function() {
        $('.notif-drawer').toggleClass('open');
    });
    //End


    $("[class*=datepicker],[type=number]").attr("autocomplete", "off");
    $('[class*=datepicker]').each(function(i) {
        $(this).attr('title', gregorian_to_jalali($(this).val()));
    })

    $("#search").keyup(function() {
        keyword = $(this).val().toLowerCase();
        $(".srt").each(function(i, tag) {
            if ($(this).html().toLowerCase().includes(keyword)) {
                $(this).closest(".srb").removeClass("hide")
            } else {
                $(this).closest(".srb").addClass("hide")
            }
        });
    });

    // gallery shortcode
    $('.slgallery-thumb').click(function() {
        var wrap = $(this).closest('.sc_gallery');
        wrap.find('.slgallery-screen').prepend("<div class='slg-overlay'></div>").fadeIn(100);

        if ($(this).data('caption').length > 3)
            wrap.find('.slgallery-screen .slg-caption').html($(this).data('caption')).fadeIn(100);

        setTimeout(() => {
            wrap.find('.slg-overlay').fadeOut(100);
            wrap.find('.slgallery-screen img').attr('src', $(this).data('image'));
        }, 100);
    });

    // 7Learn custom modal
    $('[data-cmp-modal]').click(function() {
        openModal($(this).attr('data-cmp-modal'));
    });

    $('.cmp-modal').on('click', '.modal-close', function() {
        $('.cmp-modal-overlay').fadeOut(200);
    });
    // close in pres Escape
    $(document).keyup(function(e) {
        if (e.key === "Escape") { // escape key maps to keycode `27`
            $('.cmp-modal-overlay').fadeOut(200);
            $('#navbar-search').css('top', '-100%');
        }
    });
    // close on click outside
    $(document).mouseup(function(e) {
        var container = $(".cmp-modal,#navbar-search");
        if (!container.is(e.target) && container.has(e.target).length === 0 && !container.is('.stable')) {
            $('.cmp-modal-overlay').fadeOut(200);
            container.closest('.has-menu').removeClass('active');
        }
    });


    $(".auth-wrapper").on('click', '.auth-action', function() {
        $(this).parent().find(".active").removeClass("active");
        $(this).addClass("active");
        $('.auth-wrapper form').removeClass("active");
        $('#' + $(this).attr('data-form')).addClass("active");
    });

    $(".toc *[data-order]").click(function() {
        var ord = $(this).attr('data-order');
        $([document.documentElement, document.body]).animate({
            scrollTop: $("h2:eq(" + ord + ")").offset().top
        }, 200);
        // TODO: FIX Blue color
        $("#reaction-article-list").toggleClass('show');
    });


    window.onscroll = function() {
        (document.documentElement.scrollTop > 1500) ? $("#goToTop").show(): $("#goToTop").hide();
    };

    // component: accordion
    $('.acc-items .acc-item h4,.acc-items .acc-item h4').on('click', function() {
        var current = $(this).parent();
        items = current.parent();
        items.find('.acc-item>div').slideUp(200);
        if (current.is('.active')) {
            current.removeClass('active');
        } else {
            items.find('.acc-item').removeClass('active');
            current.find('>div').slideDown(200);
            current.addClass('active');
            if ($(this).is('[data-qid]')) {
                $.post("/ajx/faq/iv", { qid: $(this).attr('data-qid') });
            }
        }
    });

    // auto open searched question 
    if (window.location.hash.startsWith('#qa')) {
        $(window.location.hash + ' h4').click();
    }

    // top search toggle
    $("#search-open").on('click', function() {
        $('#navbar-search').fadeIn(200);
        $("input#si").focus();
    });
    $("#navbar-search .close").on('click', function() {
        $('#navbar-search').fadeOut(200);
    });

    $('.color-picker').blur(function() {
        $target = $('input[name=' + $(this).attr('id') + ']')
        $target.val($(this).val());
    });

    $('body').on('scroll', function() {
        console.log($(this).scrollTop());
    })

    // comment  rating
    $('.cmp-star-rating span.fa-star').on('click', function() {
        val = $(this).attr('data-val');
        $('#comment-stars span').removeClass('checked');
        $('#comment-stars span[data-val=' + val + ']').addClass('checked');
        $('#comment-form input[name=rate]').val(val);
    });
    $('[data-cmp-modal=comment-modal]').click(function() {
        $('textarea[name=comment_content]').focus();
        if ($(this).is('i.reply')) {
            $('#comment-modal input[name=parent]').val($(this).attr('data-parent'));
            $('#comment-modal .replytoname').html(" در پاسخ به " + $(this).attr('data-replyto'));
        } else {
            $('#comment-modal input[name=parent]').val(0);
            $('#comment-modal .replytoname').html(' جدید');
        }
    })

    // attach uploader linke to url inputs
    let uploaderTag = $("<a class='me-2 fas fa-upload text-secondary hoverable' href='https://7learn.com/uploader/' target='_blank'></a>");
    var inputs = $('[name*=bg],[name*=image],[name*=img],[name*=banner],[name*=_file],[name*=_url]:not(.noupload),[name*=media],[name*=avatar]');
    inputs.css({ width: 'calc(100% - 40px)', display: 'inline-block' });
    inputs.after(uploaderTag).parent().css('position', 'relative');

    // app navbar collapse
    // navbar
    function sidebarCollapse() {
        var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        var sidebar = $("#app-sidebar");
        var container = $("#app-page-container");
        if (width > 991) {
            sidebar.toggleClass("app-sidebar-merge");
            container.toggleClass("app-page-container-merge");
        } else {
            sidebar.toggleClass("app-sidebar-mobile");
            sidebar.removeClass("app-sidebar-merge");
        }
    }
    $('#sidebarCollapse').on('click', function() {
        sidebarCollapse()
    });

    // if (window.innerWidth > 1500)
    //     sidebarCollapse()

    window.addEventListener("click", function(e) {
        var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        var sidebar = document.getElementById("app-sidebar");
        if (width < 992 && sidebar != null) {
            $('#sidebarCollapse').click(function(e) {
                e.stopPropagation();
                sidebar.classList.add("app-sidebar-mobile");
            });
            $('#app-sidebar').click(function(e) {
                e.stopPropagation();
            });
            $('body,html').click(function(e) {
                e.stopPropagation();
                sidebar.classList.remove("app-sidebar-mobile");
            });
        }
    });

    // TODO: what's this ????
    $('.collapse').on('show.bs.collapse', function() {
        $(this).siblings('.panel-heading').addClass('active');
    });

    $('.collapse').on('hide.bs.collapse', function() {
        $(this).siblings('.panel-heading').removeClass('active');
    });

    $.post("/ajx/svl?rk=" + Math.floor(Math.random() * 9999999), { pid: $('#post-wrap').attr('data-pid') });

    $('input.live-search').keyup(function(e) {
        e.preventDefault();
        var keyword = $(this).val().trim();
        var form = $(this).closest('form');
        var resultTag = form.find('.cmp-results');

        var action = form.attr('action');
        if (form.is('[data-ajax-action]'))
            action = form.attr('data-ajax-action');

        if (keyword.length > 1) {
            resultTag.slideDown();
            if (resultTag.html().length < 2)
                resultTag.html('<span class="w-100 right-spinner spinner-secondary spinner-sm">در حال جستجو...</span>');
            $.ajax({
                type: 'POST',
                url: action,
                data: form.serialize(),
                success: function(response) {
                    resultTag.html(response);
                }
            });
        } else {
            resultTag.html('').slideUp();
        }
    });

    $(".cmp-navbar .has-menu").on('mouseenter', function(e) {
        $(this).addClass('active').find('.mega-menu').fadeIn(100);
    });
    $(".cmp-navbar .has-menu").on('mouseleave', function(e) {
        $(this).removeClass('active').find('.mega-menu').fadeOut(100);
    });

    // $(".cmp-navbar .has-menu").on('click', function(e) {
    //     $(this).toggleClass('active').find('.mega-menu').fadeToggle(100);
    // });



    //payment plans
    $('.cmp-payment-plan .toggle').click(function() {
        $(this).closest('.plan-footer-body').addClass('show');
    });
});



// 25000000 => 2,500,000
function number_format(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// add query param to current url & return urlParams
function add_query_param(key, value) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(key, value);
    return urlParams;
}

// add query param to current url & redirect
function go_query_param(key, value) {
    window.location.search = add_query_param(key, value);
}

function niceTime(seconds) {
    if (seconds >= 3600)
        return new Date(seconds * 1000).toISOString().substr(11, 8);
    return new Date(seconds * 1000).toISOString().substr(14, 5);
}


// item-type fontawesome icon
function get_item_icon(type, addedClasses = '') {
    var icons = {
        'chapter': 'fa fa-bars',
        'video': 'fa fa-play',
        'podcast': 'fa fa-microphone-alt',
        'text': 'fa fa-sticky-note',
        'quiz': 'fas fa-check-square',
        'webinar': 'fas fa-chalkboard-teacher',
        'kata': 'fas fa-code',
    };
    return `<i class='${icons[type]} ${addedClasses}'></i>`;
}


function is_url(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}




/**  Gregorian & Jalali (Hijri_Shamsi,Solar) Date Converter Functions
Author: JDF.SCR.IR =>> Download Full Version :  http://jdf.scr.ir/jdf
License: GNU/LGPL _ Open Source & Free :: Version: 2.81 : [2020=1399]
-------------------------------------------------------------------*/

function gregorian_to_jalali(datetime) {
    var parse = new Date(datetime);
    gy = parse.getFullYear();
    gm = parse.getMonth() + 1;
    gd = parse.getDate();

    var g_d_m, jy, jm, jd, gy2, days;
    g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    gy2 = (gm > 2) ? (gy + 1) : gy;
    days = 355666 + (365 * gy) + ~~((gy2 + 3) / 4) - ~~((gy2 + 99) / 100) + ~~((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
    jy = -1595 + (33 * ~~(days / 12053));
    days %= 12053;
    jy += 4 * ~~(days / 1461);
    days %= 1461;
    if (days > 365) {
        jy += ~~((days - 1) / 365);
        days = (days - 1) % 365;
    }
    if (days < 186) {
        jm = 1 + ~~(days / 31);
        jd = 1 + (days % 31);
    } else {
        jm = 7 + ~~((days - 186) / 30);
        jd = 1 + ((days - 186) % 30);
    }
    return `${jy}-${jm}-${jd}`;
}

function jalali_to_gregorian(jy, jm, jd) {
    var sal_a, gy, gm, gd, days;
    jy += 1595;
    days = -355668 + (365 * jy) + (~~(jy / 33) * 8) + ~~(((jy % 33) + 3) / 4) + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
    gy = 400 * ~~(days / 146097);
    days %= 146097;
    if (days > 36524) {
        gy += 100 * ~~(--days / 36524);
        days %= 36524;
        if (days >= 365) days++;
    }
    gy += 4 * ~~(days / 1461);
    days %= 1461;
    if (days > 365) {
        gy += ~~((days - 1) / 365);
        days = (days - 1) % 365;
    }
    gd = days + 1;
    sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];
    return [gy, gm, gd];
}