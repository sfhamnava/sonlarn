var spinnerTag = `<span class="spinner-border spinner-border-sm text-primary align-middle"></span>`;
var spinnerTagSuccess = `<span class="spinner-border spinner-border-sm text-success align-middle"></span>`;
var modal_overlay = `<div class="line-spinner my-5" style='margin-top: 200px !important;'><div class="spinner-border text-white"></div></div>`;

const Toast = window.Toast = Swal.mixin({
    toast: true,
    padding: '1.2rem',
    position: 'top-right',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

$(document).ready(function() {
    $(document).on('click', '[data-ajax]', function(e) {
        e.preventDefault()
        const tag = $(this)
        const toast = $('.toast')
        const toastBody = $('.toast .toast-body')
        const data = JSON.parse(tag.attr('data-ajax'));
        const target = $('#' + data.target_id)
        if (data.confirm == 1) {
            if (!confirm('آیا از انجام این مورد مطمئن هستید؟'))
                return false;
        }
        if (data.action == 'replace') {
            if (target.length == 0) {
                alert('آیدی تگ مقصد را برای آپدیت محتوا به درستی وارد کنید.\nآیدی ' + data.target_id + 'وجود ندارد.')
                return false
            }
            target.css('opacity', 0.5)
        } else {
            Toast.fire({
                title: 'در حال ارسال ...',
                timer: 7000
            })
            tag.css('opacity', 0.5)
        }


        $.ajax({
            url: data.route,
            data: data,
            method: 'post',
            success: function(response) {
                if (data.action == 'replace') {
                    target.css('opacity', 1).html(response)
                } else {
                    Toast.fire({
                        icon: (response.success) ? 'success' : 'error',
                        title: response.message,
                        timerProgressBar: false
                    })
                    if (tag.is('[data-refresh]') && response.success) {
                        setTimeout(function() { location.reload() }, 700)
                    }
                    tag.css('opacity', 1)
                }
            },
            error: function(response) {
                target.css('opacity', 1)
                tag.css('opacity', 1)
                if (data.action == 'replace') {
                    Toast.fire({
                        icon: 'error',
                        title: 'خطایی در دریافت و رندر اطلاعات رخ داده است',
                        timerProgressBar: false
                    })
                } else {
                    Toast.fire({
                        icon: 'error',
                        title: response.responseJSON.message,
                        timerProgressBar: false
                    })
                }
            }
        })
    })

    $(document).on('submit', 'form.ajax-form', function(e) {
        e.preventDefault()
        const formTag = $(this)
        const afterSuccessAction = formTag.attr('data-after-success')
        const responseTag = formTag.find('.ajax-response')
        responseTag.removeClass('text-success')
            .removeClass('text-danger').html(spinnerTag)

        let formData = new FormData()
        let formInputs = formTag.serializeArray()

        formInputs.forEach(input => {
            formData.append(input.name, input.value)
        })

        const inputFiles = e.target.querySelectorAll('input[type="file"]')
        inputFiles.forEach(fileInput => {
            const files = fileInput.files
            for (let i = 0; i < files.length; i++) {
                formData.append(fileInput.name, files[i])
            }
        })

        $.ajax({
            url: formTag.attr('action'),
            data: formData,
            method: formTag.attr('method'),
            processData: false,
            contentType: false,
            success: function(response) {
                responseTag.addClass('text-success').html(response.message)
                switch (afterSuccessAction) {
                    case 'hide-modal':
                        setTimeout(function() {
                            formTag.closest('.modal').modal('hide')
                        }, 1000)
                        break
                    case 'hide-form':
                        formTag.delay(1000).slideUp(500)
                        break
                    case 'refresh':
                        var redirect_to = window.location.href
                        var backurl = formTag.find('input[name=backurl]').val()
                        if (is_url(backurl)) {
                            redirect_to = backurl
                        }
                        setTimeout(function() {
                            location.replace(redirect_to)
                        }, 700)
                        break
                    case 'reset':
                        formTag.trigger('reset')
                        formTag.find('.ql-editor').html('')
                        break
                }
                if (formTag.is('[data-echo]') && formTag.attr('data-echo') == 1) {
                    responseTag.html("<pre style='direction:ltr;text-align:left;unicode-bidi: embed;'>" + JSON.stringify(response) + '</pre>')
                }
            },
            error: function(response) {
                responseTag.addClass('text-danger').html(response.responseJSON.message)
                if (formTag.is('[data-echo]') && formTag.attr('data-echo') == 1) {
                    responseTag.html("<pre style='direction:ltr;text-align:left;unicode-bidi: embed;'>" + JSON.stringify(response.responseJSON) + '</pre>')
                }
            }
        })
    })


    $(document).on('click', '[data-crm]', function(e) {
        e.preventDefault()
        const tag = $(this)
        const data = JSON.parse(tag.attr('data-crm'));

        const toast = $('.toast')
        const toastBody = $('.toast .toast-body')
        $.ajax({
            url: "/app/crm/task-modal",
            data: data,
            method: 'post',
            success: function(response) {
                $("#crm-task-modal").remove();
                $('body').append(response);
                openModal("crm-task-modal");
            },
            error: function(response) {
                Toast.fire({
                    icon: 'error',
                    title: 'خطایی در دریافت و رندر اطلاعات رخ داده است',
                    timerProgressBar: false
                })
            }
        })
    })

    $(document).on('submit', 'form.chart-form', function(e) {
        e.preventDefault()
        const form = $(this);
        const chartWrapper = $(this).closest('.charts').find('.chart-wrapper').first();
        const chart = form.find('[name=chart]').val();
        const button = form.find('button');
        button.addClass('right-spinner');
        var data = {
            start_date: form.find('[name=start_date]').val(),
            end_date: form.find('[name=end_date]').val(),
            grouping: form.find('[name=grouping]').val()
        };
        $.ajax({
            url: "/chart/" + chart,
            data: data,
            method: 'get',
            success: function(response) {
                chartWrapper.html(response);
            },
            error: function(response) {
                Toast.fire({
                    icon: 'error',
                    title: 'خطایی در دریافت و رندر اطلاعات رخ داده است',
                    timerProgressBar: false
                })
            },
            complete: function(response) {
                button.removeClass('right-spinner');
            }
        })
    });

    // load default chart
    $('form.chart-form').each(function(i) {
        $(this).submit();
    });
})