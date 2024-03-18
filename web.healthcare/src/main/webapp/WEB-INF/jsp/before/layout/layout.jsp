<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/jsp/include/_dtd.jsp" %>
<jsp:include page='/WEB-INF/jsp/layout/head.jsp' flush="true">
<jsp:param name="pageType" value="eb-main" />
	<jsp:param name="bodyAttr" value="onload=''" />
	<jsp:param name="bodyStyle" value="eb-main" />
</jsp:include>
<!-- 스타일 -->
<title>타이틀</title>
<jsp:include page='/WEB-INF/jsp/layout/mainHeader.jsp' />
	<div class="container">
		<div class="container_wrap inner">
			<jsp:include page='/WEB-INF/jsp/layout/mainLeft.jsp' flush="true"/>
			<!-- 콘텐츠 -->
			
			
		</div>
	</div>
<jsp:include page='/WEB-INF/jsp/layout/mainFooter.jsp' />
<!-- 스크립트 -->
<script>

</script>
<jsp:include page='/WEB-INF/jsp/layout/mainEnd.jsp' />