<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/jsp/include/_dtd.jsp" %>
<!--상단 공통영역-->
</head>
<body>
  <div class="layout_wrap">
  	<c:if test="${!empty acToken }">
		<div class="header_layout">
			<div class="header_wrap inner">
				<a href="javascript:post('/dashboard')" class="main_logo">
		          <img src="../images/layout/logo.png" class="main_logo_img" alt="헬스케어">
		          <span>MZ Healthcare</span>
		        </a> -->
				<!-- Left로 레이아웃 변경 -->
				<!-- 
				<nav class="gnb">
					<ul class="gnb_list" id="gnbMenu">
						<c:if test="${!empty acToken }">
							<li class="gnb_list__item">
								<a href="javascript:post('/dashboard')" class="gnb_list__link <c:if test="${fn:split(uri,'/')[0] eq 'dashboard' or fn:split(uri,'/')[0] == null}">gnb_list__link--on</c:if>">대시보드</a>
							</li>
							<li class="gnb_list__item">
								<a href="javascript:post('/health/heartrate')" class="gnb_list__link <c:if test="${fn:split(uri,'/')[0] eq 'health'}">gnb_list__link--on</c:if>">건강정보</a>
							</li>
							<c:if test="${userRoleFk >= 3 }">	
								<li class="gnb_list__item">
									<a href="javascript:post('/userInfo/list_user')" class="gnb_list__link <c:if test="${fn:split(uri,'/')[0] eq 'userInfo'  && fn:contains(fn:split(uri,'/')[1], 'list')}">gnb_list__link--on</c:if>" >사용자 목록</a>
								</li>
							</c:if>
						</c:if>
					</ul>
				</nav> 
				-->
				<div class="login_info">
				<c:if test="${empty acToken }">
					<a href="<c:url value='/user/signin'/>" class="login_info__link">Login</a>
				</c:if>
				<c:if test="${!empty acToken }">
					<span class="login_info__txt">
						<strong class="login_info__user"><c:out value="${sessUserNm}" /></strong> 님, 안녕하세요.
					</span>
					<span class="login_info_bar"></span>
					<a href="<c:url value='/userInfo/mypage'/>" class="mypage_link">마이페이지</a>
					<a href="<c:url value='/user/logout'/>" class="login_info__link">Logout</a>
				</c:if>
				</div>
			</div>
		</div>
</c:if>