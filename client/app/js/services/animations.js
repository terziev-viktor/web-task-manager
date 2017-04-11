app.service('animations', function() {
    return {
        showContent: () => {
            $('.to-show').fadeIn(150);
        },
        hideContent: () => {
            $('.to-show').fadeOut(150);     
        },
        showLoading: () => {
            $(".overlay, .overlay-loading-animation").show();
        },
        hideLoading: () => {
            $(".overlay, .overlay-loading-animation").fadeOut(100);
        }
    }
});
