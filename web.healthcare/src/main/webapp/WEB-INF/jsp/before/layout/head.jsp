<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%--
<!DOCTYPE html >
<html lang="ko">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" pageEncoding="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!-- 파비콘 -->
<link rel="shortcut icon" type="image/png" href="/favicon-32x32.png">
<!-- 선호 URL -->
<link rel="canonical" href="http://ooo.test.kr">
<!-- 페이지 설명 -->
<meta name="description" content="미디어젠은...">

<!-- open graph : 소셜미디어 공유될 때 우선 활용 정보 -->
<meta property="og:type" content="website"> 
<meta property="og:title" content="미디어젠">
<meta property="og:description" content="미디어젠은...">
<meta property="og:image" content="">
<meta property="og:url" content="http://ooo.test.kr">

<!-- 스타일 -->
<link rel="stylesheet" href="/css/popupwindow.css" type="text/css">
<link rel="stylesheet" href="/css/popModal.css" type="text/css">
<link rel="stylesheet" href="/css/core.css" type="text/css">
<link rel="stylesheet" href="/css/main.css" type="text/css">
<link rel="stylesheet" href="/css/common.css" type="text/css">
<link rel="stylesheet" href="/css/sub.css" type="text/css">

<link rel="stylesheet" href="/css/bufs_common.css" type="text/css">

<!-- 스크립트 -->
<script src="/js/jquery-3.1.1.min.js"></script>
<script src="/js/jquery-1.10.1.min.js"></script>
<script src="/js/jquery-ui.min.js"></script>
<!-- <script src="jquery.cookie.js"></script>   -->

<script src="/js/main.js"></script>
<script src="/js/common.js"></script>
<script src="/js/egovframework/common/common.js"></script>

<!-- 첨부파일 -->
<script src="/js/egovframework/com/cmm/fms/EgovMultiFile.js"></script>

<script  src="/js/swiper.min.js" ></script>
<!-- loading bar 관련-->
<script src="/js/biz/common/loading.js"></script>

<!-- popup 관련 -->
<script src="/js/popModal.js"></script>
<script src="/js/popupwindow.js"></script>
<!-- <script src="/js/biz/common/popupLoad.js"></script> -->
<jsp:include page='/WEB-INF/jsp/layout/mainHeader.jsp' flush="true" />
<script type="text/javascript">
	function post(url){
		let f = document.createElement('form');
	    f.setAttribute('method', 'post');
	    f.setAttribute('action', url);
	    document.body.appendChild(f);
	    f.submit();
	}
</script> --%>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- 파비콘 -->
  <link rel="shortcut icon" type="image/png" href="../favicon-32x32.png">
  <!-- 선호 URL -->
  <link rel="canonical" href="http://ooo.test.kr">
  <!-- 페이지 설명 -->
  <meta name="description" content="미디어젠은...">

  <!-- open graph : 소셜미디어 공유될 때 우선 활용 정보 -->
  <meta property="og:type" content="website"> 
  <meta property="og:title" content="미디어젠">
  <meta property="og:description" content="미디어젠은...">
  <meta property="og:image" content="">
  <meta property="og:url" content="http://ooo.test.kr">

  <!-- 스타일 -->
  <link rel="stylesheet" href="../css/popupwindow.css" type="text/css">
  <link rel="stylesheet" href="../css/popModal.css" type="text/css">
  <link rel="stylesheet" href="../css/core.css" type="text/css">
  <link rel="stylesheet" href="../css/main.css" type="text/css">
  <link rel="stylesheet" href="../css/common.css" type="text/css">
  <link rel="stylesheet" href="../css/sub.css" type="text/css">
  
  <link rel="stylesheet" href="../css/bufs_common.css" type="text/css">
  

  <!-- 스크립트 -->
  <script src="../js/jquery-3.1.1.min.js"></script>
  <script src="../js/jquery-1.10.1.min.js"></script>
  <script src="../js/jquery-ui.min.js"></script>

  <script src="../js/main.js"></script>
  <script src="../js/common.js"></script>
  <script src="../js/egovframework/common/common.js"></script>
  <!--왼쪽 하위메뉴 : 공통 -->
  <script src="../js/left_nav/navBar.js"></script>
  <!-- 첨부파일 -->
  <script src="../js/egovframework/com/cmm/fms/EgovMultiFile.js"></script>

  <!-- 유틸 -->
  <script src="../js/egovframework/com/cmm/utl/EgovCmmUtl.js"></script>
  <script src="../js/wavus/comm/wavus-util.js"></script>
  <script src="../js/biz/common/fn_egov_file.js"></script>

  <script  src="../js/swiper.min.js" ></script>
  <!-- loading bar 관련-->
  <script src="../js/biz/common/loading.js"></script>
  <!-- popup 관련 -->
  <script src="../js/popModal.js"></script>
  <script src="../js/popupwindow.js"></script>
  <script src="../js/biz/common/popupLoad.js"></script>

  <!-- video.js 예제 -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/video.js/7.8.1/video-js.min.css" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/video.js/7.8.1/video.min.js"></script>
  <script src="../js/video.js"></script>