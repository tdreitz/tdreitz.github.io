changeResponsivePortfolioView = function() {
    var responsiveView = $('iframe');
    var responsiveButton = $('button')
    console.log(responsiveView);
    console.log(responsiveButton);
    responsiveButton.on('click', function() {
        console.log('click click click');
        if (responsiveView.hasClass('col-md-12')) { 
            responsiveView.removeClass('col-md-12');
            responsiveView.addClass('col-md-4 col-md-offset-4');
        } else {
            responsiveView.removeClass('col-md-4 col-md-offset-4');
            responsiveView.addClass('col-md-12');
        }
    });
}