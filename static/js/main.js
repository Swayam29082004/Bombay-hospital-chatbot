AOS.init();

var owl = $('#img-owl');
owl.owlCarousel({
  items:1,
  loop:true,
//   margin:30,
  autoplay:true,
  autoplayTimeout:3000,
  autoplayHoverPause:true,
  responsive:{
      0:{
  items:1
},
991:{
  items:1
},
1000:{
  items:1
},
1300:{
  items:1
}
}
});

$('.counter').each(function () {
    $(this).prop('Counter',0).animate({
        Counter: $(this).text()
    }, {
        duration: 4000,
        easing: 'swing',
        step: function (now) {
            $(this).text(Math.ceil(now));
        }
    });
    });