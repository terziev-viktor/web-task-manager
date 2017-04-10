app.service('animations', function() {
    return {
        showContent: () => {
            $('.to-show').fadeIn(350);
        },
        hideContent: () => {
            $('.to-show').fadeOut(350);     
        },
        showLoading: () => {
            $(".overlay, .overlay-loading-animation").show();
        },
        hideLoading: () => {
            $(".overlay, .overlay-loading-animation").hide();
        }
    }
});
