<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/jsp/include/_dtd.jsp" %>
<jsp:include page='/WEB-INF/jsp/before/layout/head.jsp' flush="true">
<jsp:param name="pageType" value="eb-main" />
	<jsp:param name="bodyAttr" value="onload=''" />
	<jsp:param name="bodyStyle" value="eb-main" />

</jsp:include>
<title>로그인</title>
<jsp:include page='/WEB-INF/jsp/before/layout/mainHeader.jsp' />

<div class="container">
     <div class="login_layout">
     	<form id="command" name="loginForm" action="/user/loginCheck" method="post">
        <section class="login_box">
          <div class="login_box__header">
            <img src="../images/layout/login_logo.png" alt="">
            <strong class="login_box__logo_txt">MZ Healthcare</strong>
            <span class="login_box__logo_sub">인공지능 기반 건강관리</span>
          </div>
          <div class="login_box__body">
            <section class="login_box__form">
           		<div class="login_box__form_item _id">
              		<input type="text" id="userId" name="userId" class="login_form_text" placeholder="아이디">
                </div>
                <div class="login_box__form_item _pw">
                	<input type="password" id="userPwEnc" name="userPwEnc" class="login_form_password" placeholder="비밀번호">
                </div>
              <!-- <input type="text" id="userId" name="userId" class="form_item_text" placeholder="아이디" value=""> -->
              <!-- <input type="password" id="userPwEnc" name="userPwEnc" class="form_item_text" placeholder="비밀번호" value=""> -->
              
              	
              	<!-- <input type="text" class="userRoleFk" name="userRoleFk" value="" > -->
              	<%-- <div>
					<input type="radio" class="userRoleFk" name="userRoleFk" value="<c:out value="1"/>" checked="checked"> 담당자
				</div>
				<div>
					<input type="radio" class="userRoleFk" name="userRoleFk" value="<c:out value="2"/>" > 보호자
				</div>
				<div>
					<input type="radio" class="userRoleFk" name="userRoleFk" value="<c:out value="3"/>" > 사용자
				</div> --%>
                 <button type="button" class="login_box__form_btn" id="btn_login" onclick="duplicatelogin()">로그인</button>
                 <!-- <input type="submit" class="login_box__form_btn" id="btn_login" value ="로그인"/> -->
              </section>
              <section class="login_box__foot _end">
            	  <!-- <select id="userRoleFk" name="userRoleFk">
              	  	<option value="1">사용자</option>
              	  	<option value="2">보호자</option>
              	  	<option value="3" >담당자</option>
              	  	<option value="4" selected="selected">관리자</option>
              	  </select> -->
              	  <a href="/user/signup" class="login_box__foot_link" >회원가입</a>
	              <!-- <a href="" class="login_box__foot_link">아이디 / 패스워드 찾기</a> -->
	              <!-- <label for="ck01"><input type="checkbox" name="" id="ck01"> 자동 로그인</label> -->
              </section>
            </div>
        </section>
        </form>
     </div>
   </div>
	<%-- <div class="layout_wrap">
	    <div class="container">
	      <div class="login_layout">
	      	<form id="command" name="loginForm" action="<c:url value=''/>" method="post">
		        <section class="login_box">
		          <div class="login_box__header"><img src="/images/bufs/logo_bufs_main.png" alt=""></div>
		          <div class="login_box__body">
		            <section class="login_box__form">
		              <h1 class="login_box__title">로그인</h1>
		              <input type="text" id="id" name="id" class="form_item_text" onkeypress="" placeholder="아이디" value="">
		              <input type="password" id="password" name="password" class="form_item_text" onkeypress="" placeholder="비밀번호" value="">
		              <button type="button" class="login_box__form_btn" onclick="">로그인</button>

	              		<div class="login_ch">
							<input type="checkbox" name="checkId" class="form_item_check" id="checkId" onclick="" class="st1 hidden">
							<label for="checkId">ID저장하기 </label>
							<div class="slink">
								<!-- <a href="javascript:fnFormSubmit()" class="join_btn">회원가입</a> -->
								<a href="" class="join_btn">회원가입</a>
								<a href="" class="idfind_btn">아이디 찾기</a>
								<a href="" class="pwfind_btn">비밀번호찾기</a>
							</div>
						</div>
		            </section>
		          </div>
		        </section>
	        </form>
	      </div>
	    </div>
	</div> --%>
<script>
	$('#userPwEnc').keypress(function(e){
		if(e.keyCode && e.keyCode == 13){
			$('#btn_login').click();
		}
	});

	// 중복 로그인 방지
	function duplicatelogin() {
		if(!!getCookie('acToken')){	//로그인 되어있을때
			location.href = '/';
		}else{
			$.ajax({
		           type:"Post",
		           url:"/user/loginCheck",
		           dataType:"JSON", // 옵션이므로 JSON으로 받을게 아니면 안써도 됨
		           data: {
// 		        	   "userRoleFk": $('select[name="userRoleFk"]').val(),
		        	   "userId": $('input[id="userId"]').val(),
		        	   "userPwEnc": $('input[id="userPwEnc"]').val()
		           },
		           success : function(data) {
		               if(data.resultCode == '0000'){
                            if(data.userRoleFk == '1' ) { //사용자
		                    	location.href = '/userInfo/userBoardInfo?userinfoId=' + data.userId;
		                    }
		                    else {
		                        location.href = '/userInfo/manage_userList';
		                    }
		               }else{
			        	   alert('아이디 또는 비밀번호를 잘못 입력했습니다.\n입력하신 내용을 다시 확인해주세요.')
			           }
		           },
		           complete : function(data) {
		                 // 통신이 실패했어도 완료가 되었을 때 이 함수를 타게 된다.

		           },
		           error : function(xhr, status, error) {
		                console.log(error)
		           }
		     });
// 			$('#command').submit();
		}
	}

</script>
<jsp:include page='/WEB-INF/jsp/before/layout/mainEnd.jsp' />