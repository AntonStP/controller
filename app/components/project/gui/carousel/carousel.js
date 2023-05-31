import Swiper from 'swiper';
import $ from 'jquery';

$(() => {

  var swiper = new Swiper('.swiper-container', {
    slidePerView: "auto",
    spaceBetween: 70,
    centeredSlides: true,
    autoplay: {
      delay: 3500,
      stopOnLastSlide: true
    }
  });

});