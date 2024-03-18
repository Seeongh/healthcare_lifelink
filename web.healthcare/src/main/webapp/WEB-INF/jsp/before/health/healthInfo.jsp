<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/jsp/include/_dtd.jsp" %>

<jsp:include page='/WEB-INF/jsp/layout/head.jsp' flush="true">
<jsp:param name="pageType" value="eb-main" />
	<jsp:param name="bodyAttr" value="onload=''" />
	<jsp:param name="bodyStyle" value="eb-main" />
</jsp:include>
<title>
	<c:choose>
		<c:when test="${fn:split(uri,'/')[1] eq 'temperature' }">체온</c:when>
		<c:when test="${fn:split(uri,'/')[1] eq 'spo2' }">산소포화도</c:when>
		<c:when test="${fn:split(uri,'/')[1] eq 'sleep' }">수면</c:when>
		<c:when test="${fn:split(uri,'/')[1] eq 'heartrate' }">심박수</c:when>
		<c:when test="${fn:split(uri,'/')[1] eq 'step' }">운동량</c:when>
		<c:when test="${fn:split(uri,'/')[1] eq 'stress' }">스트레스</c:when>
		<c:when test="${fn:split(uri,'/')[1] eq 'bloodpress' }">혈압</c:when>
		<c:otherwise>호흡수</c:otherwise>
	</c:choose>
</title>
<jsp:include page='/WEB-INF/jsp/layout/mainHeader.jsp' />
	<div class="container">
		<div class="container_wrap inner">
			<jsp:include page='/WEB-INF/jsp/layout/mainLeft.jsp' flush="true"/>
			<section class="layout_content">
	          <h1 class="content_main_title"><c:if test="${userNm ne 'undefined' && userNm ne null && userNm ne ''}"><c:out value="${userNm}" />님 </c:if>건강정보</h1> 
	          <div class="content_wrap">
	            <section class="radius_con">
	              <div class="chart_header">
					<c:choose>
						<c:when test="${fn:split(uri,'/')[1] eq 'heartrate' }"><h1 class="chart_header__chart01">심박수</h1></c:when>
						<c:when test="${fn:split(uri,'/')[1] eq 'spo2' }"><h1 class="chart_header__chart02">산소포화도</h1></c:when>
						<c:when test="${fn:split(uri,'/')[1] eq 'step' }"><h1 class="chart_header__chart03">운동량</h1></c:when>
						<c:when test="${fn:split(uri,'/')[1] eq 'stress' }"><h1 class="chart_header__chart04">스트레스</h1></c:when>
						<c:when test="${fn:split(uri,'/')[1] eq 'sleep' }"><h1 class="chart_header__chart05">수면</h1></c:when>
						<c:when test="${fn:split(uri,'/')[1] eq 'bloodpress' }"><h1 class="chart_header__chart06">혈압</h1></c:when>
						<c:when test="${fn:split(uri,'/')[1] eq 'temperature' }"><h1 class="chart_header__chart08">체온</h1></c:when>
						<c:otherwise><h1 class="chart_header__chart07">호흡수</h1></c:otherwise>
					</c:choose>
					
	                <div class="chart_header__tab">
	                  <a href="javascript:chartSet('D');" id="chartSetD" class="chart_header__tab_link">1일</a>
	                  <a href="javascript:chartSet('W');" id="chartSetW" class="chart_header__tab_link">1주일</a>
	                  <a href="javascript:chartSet('M');" id="chartSetM" class="chart_header__tab_link">1개월</a>
	                  <a href="javascript:chartSet('Y');" id="chartSetY" class="chart_header__tab_link">1년</a>
	                </div>
	              </div>
	
	              <div class="flex-box _end">
	                <div class="move_date">
	                	<input type="hidden" id="searchType" name="searchType" value="D" />
						<input type="hidden" id="searchWrd" name="" value="<c:out value="${fn:split(uri,'/')[1] }"></c:out>"/>
	                  	<a href="javascript:dateChange('prev')" class="move_date__prev"><span hidden></span></a>
	                  	<input type="date" id="date" name="date" value="" hidden="hidden">
	                  	<span id="dateTxt" class="move_date__txt"></span> 
	                  	<a href="javascript:dateChange('next')" class="move_date__next"><span hidden></span></a>
	                </div>
	              </div>
	              
	              <div class="chartSection">
	                <canvas id="myChart"></canvas>
	              </div>
	              
	            </section>
	          </div>
	          <!-- // 콘텐츠 내용 -->
	        </section>
		</div>
	</div>
<jsp:include page='/WEB-INF/jsp/layout/mainFooter.jsp' />
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="/js/chart/healthChart.js"></script>
<!-- <script src="/js/chart/healthChartM.js"></script> -->
<style>
	.chartSection {
		height : 500px;
	}
</style>
<script>
	
	var tag = '';
	var type = 'bar';
	var myChart;
	var condition = '';	// 그룹핑 조건 시간 주기
	var searchType = '';	// 검색 수치 타입
	
	$(document).ready(function(){
		var now = new Date();
		$('#date').val(now.toISOString().substring(0,10));
		$('#dateTxt').text(now.toISOString().substring(0,10).replaceAll('-','.'));
		chartSet("D");
	});
	function dateChange(calculation){
		var searchQuery = $('#searchType').val();
		var query = calculation === 'prev' ? -1: 1;
		var now = new Date($('#date').val());	// 현재 날짜 및 시간
		var date = '';	// 어제
		switch (searchQuery) {
			case "D":
				date = new Date(now.setDate(now.getDate() + query))
				break;
			case "W":
				date = new Date(now.setDate(now.getDate() + (query*7)))
				break;
			case "M":
				date = new Date(now.setDate(now.getDate() + (query*30)))
				break;
			case "Y":
				date = new Date(now.setFullYear(now.getFullYear() + query))
				break;
			default:
				date = new Date(now.setDate(now.getDate() + query))
				break;
		}
		
		
		$('#dateTxt').text(date.toISOString().substring(0,10).replaceAll('-','.'));
		$('#date').val(date.toISOString().substring(0,10));
		drawChartAjax();
	}
	
// 	function dateChange(calculation, division){
// 		var searchQuery = $('#searchType').val();
// 		var query = calculation === 'prev' ? -1: 1;
// 		var now = new Date($('#date').val());	// 현재 날짜 및 시간
// // 		var str = now.toISOString().substring(0,10);
// 		var date = new Date($('#date').val());	// 어제
// 		var str = date.toISOString().substring(0,10);
// 		switch (searchQuery) {
// 			case "D":
// 				date = new Date(date.setDate(now.getDate() + query))
// 				break;
// 			case "W":
// 				date = new Date(date.setDate(now.getDate() + (query*7)))
// 				break;
// 			case "M":
// 				date = new Date(date.setMonth(now.getMonth() + query))
// 				break;
// 			case "Y":
// 				date = new Date(date.setFullYear(now.getFullYear() + query))
// 				break;
// 			default:
// 				date = new Date(date.setDate(now.getDate() + query))
// 				break;
// 		}
// 		if(searchQuery != 'D'){
// 			if(calculation == 'prev')
// 				str = date.toISOString().substring(0,10)+' ~ '+str;
// 			else
// 				str += ' ~ '+date.toISOString().substring(0,10)
// 		}
// 		$('#dateTxt').text(str.replaceAll('-','.'));
// // 		$('#dateTxt').text(date.toISOString().substring(0,10).replaceAll('-','.'));
// 		if(division == null)
// 			$('#date').val(now.toISOString().substring(0,10))
// 		else
// 			$('#date').val(date.toISOString().substring(0,10))
// 		drawChartAjax();
// 	}
	
// 	$('#date').change(function(){
// 		drawChartAjax();
// 	})
	
	function typeCheck(){
		var id = $('#searchWrd').val();
		if(id == 'temperature'){
			searchType = 'all';
			condition = '30';
	  	}else if(id == 'spo2'){
	  		searchType = 'all';
	  		condition = '60';
	  	}else if(id == 'sleep'){
	  		searchType = 'all';
	  		condition = '60';
	  	}else if(id == 'heartrate'){
	  		searchType = 'all';
	  		condition = '5';
	  	}else if(id == 'step'){
	  		searchType = 'avg';
		  	condition = '60';
	  	}else if(id == 'stress'){
	  		searchType = 'all';
	  		condition = '30';
	  	}else if(id == 'bloodpress'){
	  		searchType = 'minmax';
	  		condition = '30';
	  	}else{	// 호흡수
	  		searchType = 'all';
	  		condition = '30';
	  	}
	}
	
	function drawChartAjax(){
			typeCheck();
			$.ajax({
		        type:"POST",
		        url:"/health/healthInfoChart",
		     	// 옵션이므로 JSON으로 받을게 아니면 안써도 됨
		        dataType:"JSON", 
		        data:{
		        		"query": $('#searchType').val()	// 일,주,월,년
						,"type": searchType	//	검색 데이터 (minmaxavg 종류 선택)
						,"userId": '<c:out value="${searchUserId}" />'
						,"date": $('#date').val()
						,"searchWrd":$('#searchWrd').val()
						,"condition": condition
			     	 },
		        success : function(data) {
		              // 통신이 성공적으로 이루어졌을 때 이 함수를 타게 된다.
		              if(data.resultCode == '0000'){
						var chartId = $('#searchWrd').val();
						if(chartId == 'step'){	// 일반 데이터 else: 최대/최소 데이터
							// 1달 데이터
							// var tempData = '{"lv":[["12/30",""],["12/31",""],["01/01","2023"],["01/02",""],["01/03",""],["01/04",""],["01/05",""],["01/06",""],["01/07",""],["01/08",""],["01/09",""],["01/10",""],["01/11",""],["01/12",""],["01/13",""],["01/14",""],["01/15",""],["01/16",""],["01/17",""],["01/18",""],["01/19",""],["01/20",""],["01/21",""],["01/22",""],["01/23",""],["01/24",""],["01/25",""],["01/26",""],["01/27",""],["01/28",""],["01/29",""]],'
							// 			+ '"dataMin":["80","67","70","85","68","59","60","80","67","70","85","68","59","60","80","67","70","85","68","59","60","80","67","70","85","68","59","60","68","59","60"],'
							// 			+ '"dataMax":["112","67","102","102","99","90","114","99","90","114","112","67","102","102","99","90","114","112","67","102","102","99","90","114","112","67","102","102","99","90","114"]}';
							// var tempData = '{"lv":[["12/30",""],["12/31",""],["01/01","2023"],["01/02",""],["01/03",""],["01/04",""],["01/05",""]],'
							// 			+ '"dataMin":[null,null,null,null,null,null,null],'
							// 			+ '"dataMax":[null,null,null,null,null,null,null]}';
							// drawBarChrt(tempData,chartId);
							drawBarChart(daata.resultData,chartId);
	            	  	}else if(chartId == 'stress'){
							var chartData = {};
							chartData["data"] = data.resultData.dataMax;
							chartData["lv"] = data.resultData.lv;
							drawBarChart(chartData,chartId);
						}else if(chartId == 'sleep'){
							drawStackedChart();
						}else{
							// 1일 데이터
							// var tempData = '{"dataMin": ["114","67","63","84","74","68","100","65","60","126","79","97","73","71","60","62","61","65","62","74","157","61","84","60","78","68","79","112","95","74","64","93","96","66","70","80","62","67","78","63","99","70","73","92","64","104","82","87","93","61","98","60","72","107","75","81","72","70","60","116","78","98","78","70","82","66","85","99","61","85","62","152","73","108","79","66","66","98","91","104","94","86","70","65","77","65","76","73","79","98","84","114","60","83","112","81","66","63","76","72","121","76","61","85","89","64","65","75","100","61","88","66","66","69","60","97","69","85","73","73","85","106","62","79","61","86","81","72","60","99","136","61","68","65","60","68","73","69","116","61","69","94","102","79","76","64","132","62","61","68","62","68","60","74","96","80","71","86","64","63","102","72","64","73","76","71","80","61","60","71","78","88","98","80","76","123","68","64","86","99","60","95","76","92","74","73","62","90","94","85","84","94","122","146","65","119","66","86","74","70","103","98","96","68","77","78","71","63","63","67","64","63","68","80","127","116","68","100","67","62","92","81","84","102","88","84","86","73","72","62","68","62","91","102","70","71","76","85","86","75","65","102","96","80","67","75","64","87","104","71","61","86","61","97","62","71","101","111","71","61","63","68","60","93","62","75","71","72","69","72","142","99","77","99","95","131","68","62","109","67","75","141","80","93","62","102","85","86"],'
							// 		+'"dataMax": ["182","184","175","154","184","180","178","185","144","186","162","183","137","188","176","164","159","188","135","146","190","172","188","188","188","176","166","177","188","144","171","185","187","190","166","183","161","149","169","171","190","148","179","169","113","180","111","185","157","190","164","130","184","142","173","165","171","159","131","187","189","190","143","189","177","144","111","187","176","178","160","189","185","147","178","186","190","184","179","176","165","169","153","186","131","123","152","175","181","185","187","187","186","162","169","188","165","139","183","183","172","121","157","186","190","171","171","146","161","177","175","122","157","190","184","167","181","188","159","158","169","189","180","157","179","162","172","171","186","188","186","132","190","174","173","133","135","167","185","180","149","187","180","175","142","161","164","190","114","184","167","178","182","173","186","172","104","149","184","188","175","188","190","184","190","183","183","164","183","172","189","187","178","180","184","176","178","173","187","154","140","181","187","157","137","162","139","189","159","187","190","151","190","179","179","150","183","165","181","131","188","156","171","178","168","177","149","180","148","189","180","142","189","180","151","173","179","165","124","161","159","187","153","184","188","177","175","185","174","187","189","154","149","173","158","183","180","148","142","181","167","179","183","185","183","180","182","174","169","174","184","162","181","176","180","170","158","174","190","126","118","177","183","172","179","96","125","171","186","167","175","182","189","127","155","178","144","159","171","151","136","188","181","147","184","184","184","107"],'
							// 		+'"lv": ["00시00분","00시05분","00시10분","00시15분","00시20분","00시25분","00시30분","00시35분","00시40분","00시45분","00시50분","00시55분","01시00분","01시05분","01시10분","01시15분","01시20분","01시25분","01시30분","01시35분","01시40분","01시45분","01시50분","01시55분","02시00분","02시05분","02시10분","02시15분","02시20분","02시25분","02시30분","02시35분","02시40분","02시45분","02시50분","02시55분","03시00분","03시05분","03시10분","03시15분","03시20분","03시25분","03시30분","03시35분","03시40분","03시45분","03시50분","03시55분","04시00분","04시05분","04시10분","04시15분","04시20분","04시25분","04시30분","04시35분","04시40분","04시45분","04시50분","04시55분","05시00분","05시05분","05시10분","05시15분","05시20분","05시25분","05시30분","05시35분","05시40분","05시45분","05시50분","05시55분","06시00분","06시05분","06시10분","06시15분","06시20분","06시25분","06시30분","06시35분","06시40분","06시45분","06시50분","06시55분","07시00분","07시05분","07시10분","07시15분","07시20분","07시25분","07시30분","07시35분","07시40분","07시45분","07시50분","07시55분","08시00분","08시05분","08시10분","08시15분","08시20분","08시25분","08시30분","08시35분","08시40분","08시45분","08시50분","08시55분","09시00분","09시05분","09시10분","09시15분","09시20분","09시25분","09시30분","09시35분","09시40분","09시45분","09시50분","09시55분","10시00분","10시05분","10시10분","10시15분","10시20분","10시25분","10시30분","10시35분","10시40분","10시45분","10시50분","10시55분","11시00분","11시05분","11시10분","11시15분","11시20분","11시25분","11시30분","11시35분","11시40분","11시45분","11시50분","11시55분","12시00분","12시05분","12시10분","12시15분","12시20분","12시25분","12시30분","12시35분","12시40분","12시45분","12시50분","12시55분","13시00분","13시05분","13시10분","13시15분","13시20분","13시25분","13시30분","13시35분","13시40분","13시45분","13시50분","13시55분","14시00분","14시05분","14시10분","14시15분","14시20분","14시25분","14시30분","14시35분","14시40분","14시45분","14시50분","14시55분","15시00분","15시05분","15시10분","15시15분","15시20분","15시25분","15시30분","15시35분","15시40분","15시45분","15시50분","15시55분","16시00분","16시05분","16시10분","16시15분","16시20분","16시25분","16시30분","16시35분","16시40분","16시45분","16시50분","16시55분","17시00분","17시05분","17시10분","17시15분","17시20분","17시25분","17시30분","17시35분","17시40분","17시45분","17시50분","17시55분","18시00분","18시05분","18시10분","18시15분","18시20분","18시25분","18시30분","18시35분","18시40분","18시45분","18시50분","18시55분","19시00분","19시05분","19시10분","19시15분","19시20분","19시25분","19시30분","19시35분","19시40분","19시45분","19시50분","19시55분","20시00분","20시05분","20시10분","20시15분","20시20분","20시25분","20시30분","20시35분","20시40분","20시45분","20시50분","20시55분","21시00분","21시05분","21시10분","21시15분","21시20분","21시25분","21시30분","21시35분","21시40분","21시45분","21시50분","21시55분","22시00분","22시05분","22시10분","22시15분","22시20분","22시25분","22시30분","22시35분","22시40분","22시45분","22시50분","22시55분","23시00분","23시05분","23시10분","23시15분","23시20분","23시25분","23시30분","23시35분","23시40분","23시45분","23시50분","23시55분"]}';
							// 1주 데이터
							// var tempData = '{"lv":[["30",""],["31",""],["01/01","2023"],["02",""],["03",""],["04",""],["05",""]],'
							// 			+'"dataMin":["80","67","70","85","68","59","60"],'
							// 			+'"dataMax":["112","67","102","102","99","90","114"]}';
							// 1달 데이터
							// var tempData = '{"lv":[["30",""],["31",""],["01/01","2023"],["02",""],["03",""],["04",""],["05",""],["06",""],["07",""],["08",""],["09",""],["10",""],["11",""],["12",""],["13",""],["14",""],["15",""],["16",""],["17",""],["18",""],["19",""],["20",""],["21",""],["22",""],["23",""],["24",""],["25",""],["26",""],["27",""],["28",""],["29",""]],'
							// 			+ '"dataMin":["80","67","70","85","68","59","60","80","67","70","85","68","59","60","80","67","70","85","68","59","60","80","67","70","85","68","59","60","68","59","60"],'
							// 			+ '"dataMax":["112","67","102","102","99","90","114","99","90","114","112","67","102","102","99","90","114","112","67","102","102","99","90","114","112","67","102","102","99","90","114"]}';
							// 1년 데이터
							// var tempData = '{"lv":[["4",""],["5",""],["6",""],["7",""],["8",""],["9",""],["10",""],["11",""],["12",""],["1","2023"],["2",""],["3",""]],'
							// 			+ '"dataMin":["80","67","70","85","68","59","60","70","85","68","59","60"],'
							// 			+ '"dataMax":["112","67","102","102","99","90","114","102","102","99","90","114"]}';

							// tempData = JSON.parse(tempData);
							// drawFloatingChart(tempData,chartId);
							drawFloatingChart(data.resultData,chartId);
		            	}
						
// 						if(searchType == 'minmax'){
// 							if(data.resultData.min != null)
// 								$('#avg').text(data.resultData.min+'/'+data.resultData.max);
// 							else if(data.resultData.dataAvg != null)
// 								$('#avg').text(data.resultData.dataAvg);
// 							else
// 								$('#avg').text(0);
// 						}else{
// 							if(data.resultData.avg != null)
// 								$('#avg').text(data.resultData.avg);
// 							else if(data.resultData.dataAvg != null)
// 								$('#avg').text(data.resultData.dataAvg);
// 							else
// 								$('#avg').text(0);
// 						}
		              }
// 		              else if(data.resultCode == '1003'){
// 							var newForm = document.createElement('form');
// 			          		newForm.method = 'post';
// 			          		newForm.action = '/user/signin';
// 			          		newForm.submit();
// 		          	  }
// 		              else{
// 			          		var newForm = document.createElement('form');
// 			          		newForm.method = 'post';
// 			          		newForm.action = '/user/signin';
// 			          		newForm.submit();
// 		              }
		              if($('#searchType').val()!='D')
		              		$('#dateTxt').text(data.resultData.startDt.replaceAll('-','.'));
		              else
		              		$('#dateTxt').text($('#date').val().replaceAll('-','.'));
		        },
		        complete : function(data) {
		              // 통신이 실패했어도 완료가 되었을 때 이 함수를 타게 된다.
		              // TODO
		        },
		        error : function(xhr, status, error) {
		              console.log(error);
		        }
		  });
	}
	
	function chartSet(type){
		$('#searchType').val(type);
		$('.chart_header__tab_link--on').each(function(idx, item){
		    $(item).attr('class','chart_header__tab_link');
		});
		switch (type) {
			case "Y":
				$('#chartSetY').attr('class', 'chart_header__tab_link--on');
				break;
			case "M":
				$('#chartSetM').attr('class', 'chart_header__tab_link--on');
				break;
			case "W":
				$('#chartSetW').attr('class', 'chart_header__tab_link--on');
				break;
			case "D":
			default:
				$('#chartSetD').attr('class', 'chart_header__tab_link--on');
				break;
		}
// 		dateChange('prev', null);
		drawChartAjax();
// 		
// 		dateChange('prev', null);
// 		$('#chartForm').submit();
	}
// 	function dateFormat(date) {
//         let month = date.getMonth() + 1;
//         let day = date.getDate();

//         month = month >= 10 ? month : '0' + month;
//         day = day >= 10 ? day : '0' + day;

// 		return date.getFullYear() + '-' + month + '-' + day;
// 	}
	
	/* function userHealthInfo(url){
		let f = document.createElement('form');
	    f.setAttribute('method', 'post');
	    f.setAttribute('action', url);
	    
	    var input1 = document.createElement('input');
		input1.setAttribute("type", "hidden");
		input1.setAttribute("name", "searchUserId");
		input1.setAttribute("value", '<c:out value="${searchUserId}" />');
		f.appendChild(input1);
		
		var input2 = document.createElement('input');
		input2.setAttribute("type", "hidden");
		input2.setAttribute("name", "userNm");
		input2.setAttribute("value", '<c:out value="${userNm}" />');
		f.appendChild(input2);
		
	    document.body.appendChild(f);
	    f.submit();
	} */
</script>
<jsp:include page='/WEB-INF/jsp/layout/mainEnd.jsp' />