<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<footer class="footer_wrap">
  <div class="footer">
    <div class="ft_logo_wrap _relative">
      <div class="swiper swiper-container swiper-container-initialized swiper-container-horizontal">
        <div class="_swiper_wrap swiper-wrapper">
          <!-- 7번이 생긴다면 ft_logo6의 바로 아래에 넣어야함. - swiper 때문에 1번 로고를 1번에 보이기 위해 억지로 loopedSlides: 2를 주었기 때문에(ft_logo3 = loopedSlides:2번임.) 가운데부터 보이도록 설정하기 위해서. -->
          <div class="ft_logo swiper-slide">
            <a href="https://https://www.kdca.go.kr" target="_blank"><img src="../images/main/fg_kdca.png" alt="질병청"></a>
          </div>
         <!-- <div class="ft_logo swiper-slide">-->
          <!--  <a href="https://www.cb.or.kr/creditbank/base/nMain.do" target="_blank"><img src="../_resource_user/images/common/ft_logo4.png" alt="학점은행"></a>-->
          <!--</div>-->
          <!--<div class="ft_logo swiper-slide">-->
          <!--  <a href="https://bdes.nile.or.kr/nile/base/bdesMain.do" target="_blank"><img src="../_resource_user/images/common/ft_logo5.png" alt="독학학위제"></a>-->
          <!--</div>-->
          <!--<div class="ft_logo swiper-slide">-->
          <!--  <a href="https://www.all.go.kr/center/common/main/mainForCenter.do" target="_blank"><img src="../_resource_user/images/common/ft_logo6.png" alt="평생학습계좌제"></a>-->
          <!--</div>-->
          <!--<div class="ft_logo swiper-slide">-->
          <!--  <a href="http://www.moe.go.kr/main.do?s=moe" target="_blank"><img src="../_resource_user/images/common/ft_logo1.png" alt="교육부"></a>-->
          <!--</div>-->
          <!--<div class="ft_logo swiper-slide">-->
          <!--  <a href="http://www.kmooc.kr/" target="_blank"><img src="../_resource_user/images/common/ft_logo2.png" alt="K-MOOC 한국형 온라인 공개강좌"></a>-->
          <!--</div>-->
          <!-- 7번이 생긴다면 ft_logo6의 바로 아래에 넣어야함. - swiper 때문에 1번 로고를 1번에 보이기 위해 억지로 loopedSlides: 2를 주었기 때문에(ft_logo3 = loopedSlides:2번임.) 가운데부터 보이도록 설정하기 위해서. -->
        </div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
    </div>

    <div class="ft_content_wrap">
      <section class="ft_info_wrap">
        <div class="fnb_wrap">
          <ul class="fnb">
            <li class="fnb__item"><a href="#none" class="fnb__link">저작권보호정책ㅣ</a></li>
            <li class="fnb__item"><a href="#none" class="fnb__link">이메일무단수집거부</a></li>
          </ul>
        </div>
        <address class="ft_addr_wrap">
          <span>: 경기도 성남시 분당구 성남대로 331번길 8 킨스타워(정자동) 11층 1103호실 TEL:  02-6429-7109</span>
          <span>copyright ⓒ mediazen all rights reserved.</span>
        </address>
      </section>
      <section class="footer_relation_wrap">
        <select name="siteSelect" id="openSite" class="footer_relation__select" title="관련사이트 바로가기">
          <option value="javascript:void(0);" selected="selected" disabled="disabled">관련사이트 바로가기</option>
          <option value="http://namuict.co.kr/">NAMU ICT</option>
          <option value="http://https://www.kdca.go.kr/">질병청</option>
        </select>
        <button type="button" class="footer_relation__btn" title="새 창으로 열림" onclick="javascript:openSite();">이동</button>
      </section>
    </div>
  </div>
</footer>

<!-- 하단 스크립트 -->
<script>
  // 메인 - search banner
  const serachSwiper01 = new Swiper('.search_swiper01', {
    breakpoints: {
      768: {
        spaceBetween : 34, // 슬라이드간 간격
        slidesPerView: 7,  //브라우저가 768보다 클 때
      },
      320: {
        spaceBetween : 20, // 슬라이드간 간격
        slidesPerView: "auto",  //브라우저가 768보다 클 때
        slidesPerGroup: 1,
      }
    },
    centeredSlides: false,  //이녀석을 false로 바꾸면 왼쪽부터 순차적으로 슬라이드가 들어섬
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    touchRatio: 0, // 드래그 금지
    speed : 1000,
    autoplay: {
      delay: 3000,
      pauseOnMouseEnter: false,
      disableOnInteraction: false,
    },
  });
  const serachSwiper02 = new Swiper('.search_swiper02', {
    breakpoints: {
      768: {
        spaceBetween : 34, // 슬라이드간 간격
        slidesPerView: 7,  //브라우저가 768보다 클 때
      },
      320: {
        spaceBetween : 20, // 슬라이드간 간격
        slidesPerView: "auto",  //브라우저가 768보다 클 때
        slidesPerGroup: 1,
      }
    },
    centeredSlides: false,  //이녀석을 false로 바꾸면 왼쪽부터 순차적으로 슬라이드가 들어섬
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    touchRatio: 0, // 드래그 금지
    speed : 1000,
    autoplay: {
      delay: 3000,
      pauseOnMouseEnter: false,
      disableOnInteraction: false,
    },
  });
  const serachSwiper03 = new Swiper('.search_swiper03', {
    breakpoints: {
      768: {
        spaceBetween : 34, // 슬라이드간 간격
        slidesPerView: 7,  //브라우저가 768보다 클 때
      },
      320: {
        spaceBetween : 20, // 슬라이드간 간격
        slidesPerView: "auto",  //브라우저가 768보다 클 때
        slidesPerGroup: 1,
      }
    },
    centeredSlides: false,  //이녀석을 false로 바꾸면 왼쪽부터 순차적으로 슬라이드가 들어섬
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    touchRatio: 0, // 드래그 금지
    speed : 1000,
    autoplay: {
      delay: 3000,
      pauseOnMouseEnter: true,
      disableOnInteraction: false,
    },
  });
  const serachSwiper04 = new Swiper('.search_swiper04', {
    breakpoints: {
      768: {
        spaceBetween : 34, // 슬라이드간 간격
        slidesPerView: 7,  //브라우저가 768보다 클 때
      },
      320: {
        spaceBetween : 20, // 슬라이드간 간격
        slidesPerView: "auto",  //브라우저가 768보다 클 때
        slidesPerGroup: 1,
      }
    },
    centeredSlides: false,  //이녀석을 false로 바꾸면 왼쪽부터 순차적으로 슬라이드가 들어섬
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    touchRatio: 0, // 드래그 금지
    speed : 1000,
    autoplay: {
      delay: 3000,
      pauseOnMouseEnter: true,
      disableOnInteraction: false,
    },
  });
  const serachSwiper05 = new Swiper('.search_swiper05', {
    breakpoints: {
      768: {
        spaceBetween : 34, // 슬라이드간 간격
        slidesPerView: 7,  //브라우저가 768보다 클 때
      },
      320: {
        spaceBetween : 20, // 슬라이드간 간격
        slidesPerView: "auto",  //브라우저가 768보다 클 때
        slidesPerGroup: 1,
      }
    },
    centeredSlides: false,  //이녀석을 false로 바꾸면 왼쪽부터 순차적으로 슬라이드가 들어섬
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    touchRatio: 0, // 드래그 금지
    speed : 1000,
    autoplay: {
      delay: 3000,
      pauseOnMouseEnter: true,
      disableOnInteraction: false,
    },
  });
  const serachSwiper06 = new Swiper('.search_swiper06', {
    breakpoints: {
      768: {
        spaceBetween : 34, // 슬라이드간 간격
        slidesPerView: 7,  //브라우저가 768보다 클 때
      },
      320: {
        spaceBetween : 20, // 슬라이드간 간격
        slidesPerView: "auto",  //브라우저가 768보다 클 때
        slidesPerGroup: 1,
      }
    },
    centeredSlides: false,  //이녀석을 false로 바꾸면 왼쪽부터 순차적으로 슬라이드가 들어섬
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    touchRatio: 0, // 드래그 금지
    speed : 1000,
    autoplay: {
      delay: 3000,
      pauseOnMouseEnter: true,
      disableOnInteraction: false,
    },
  });
  const serachSwiper07 = new Swiper('.search_swiper07', {
    breakpoints: {
      768: {
        spaceBetween : 34, // 슬라이드간 간격
        slidesPerView: 7,  //브라우저가 768보다 클 때
      },
      320: {
        spaceBetween : 20, // 슬라이드간 간격
        slidesPerView: "auto",  //브라우저가 768보다 클 때
        slidesPerGroup: 1,
      }
    },
    centeredSlides: false,  //이녀석을 false로 바꾸면 왼쪽부터 순차적으로 슬라이드가 들어섬
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    touchRatio: 0, // 드래그 금지
    speed : 1000,
    autoplay: {
      delay: 3000,
      pauseOnMouseEnter: true,
      disableOnInteraction: false,
    },
  });



  // 푸터 배너
  const swiper = new Swiper('.swiper', {
    breakpoints: {
      768: {
        spaceBetween : 30, // 슬라이드간 간격
        slidesPerView : 5, // 동시에 보여줄 슬라이드 갯수
        loopAdditionalSlides: 1, // 슬라이드 반복 시 마지막 슬라이드에서 다음 슬라이드가 보여지지 않는 현상 수정
        loopedSlides: 2, // 1번 로고를 1번에 보이기 위해 억지로 loopedSlides: 2를 주었기 때문에(ft_logo3 = loopedSlides:2번임.)
      },
      320: {
        spaceBetween : 20, // 슬라이드간 간격
        slidesPerView: "auto",  //브라우저가 768보다 클 때
        slidesPerGroup: 1,
        loopAdditionalSlides: 1,
        loopedSlides: 2,
      }
    },
    centeredSlides: true, // true 인 경우 활성 슬라이드는 항상 왼쪽이 아닌 가운데에 배치됩니다. - false가 되면 loop가 안도는 현상 발생... - 마지막 이미지 뒤로 1번 이미지가 형성이 안됨.
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    speed : 1000,
    autoplay: {
      delay: 5000,
      pauseOnMouseEnter: true,
      disableOnInteraction: false,
    },
  });



  // swiper mouseover 시 멈추고, mouseout시 다시 재생 시작.
  $(document).ready(function(){
    $('.swiper-slide').on('mouseover', function(){
      swiper.autoplay.stop();
    });
    $('.swiper-slide').on('mouseout', function(){
      swiper.autoplay.start();
    });
  }); // document ready end
</script>
<!-- 하단 스크립트 -->