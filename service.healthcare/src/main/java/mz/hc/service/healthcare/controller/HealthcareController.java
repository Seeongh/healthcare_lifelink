package mz.hc.service.healthcare.controller;

import java.io.IOException;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.servlet.http.HttpServletRequest;

import com.fasterxml.jackson.core.JsonParser;
import com.netflix.discovery.converters.Auto;
import mz.hc.service.healthcare.dto.*;
import mz.hc.service.healthcare.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;
import mz.hc.service.healthcare.service.HealthcareService;

@Slf4j
@RestController
@RequestMapping("/healthcare/v1/")
public class HealthcareController {
	
	@Autowired
	HealthcareService healthcareService;
	@Autowired
	Environment env;

	@Autowired
	ChatService chatService;

	@Autowired
	BioInfoDto bioInfoDto;

	private LocalDate getToday() {

		// 현재 날짜 구하기
		return LocalDate.now();
	}

	/**
	 * @apiNote 건강 정보 데이터 등록 API
	 * @param map(keyName) date: 검색 기준일(end Date) 
	 * @param map(keyName) condition: 차트 Level(ex: 60분, 30분, 5분)
	 * @param map(keyName) type: return 데이터 종류 (ex: all(min,max,avg), min/max(min,max), avg(sum,avg)) 
	 * @param map(keyName) searchWrd: 검색 데이터(ex: temperature)
	 * @param map(keyName) userId: 조회 ID
     * @return Map
     */
	@SuppressWarnings("unchecked")
	@PostMapping("insertHealthInfo")
	public ResponseEntity<ApiResponse> insertHealthInfo (HttpServletRequest request, @RequestBody Map<String, Object> map) {
		// KeyName: type (M: 월 데이터, D: 일 데이터, m: 분 데이터)
		ObjectMapper mapper = new ObjectMapper();
		if(map.get("type").equals("m")) {	// 분 데이터
			for(Map<String, Object> obj : (ArrayList<Map<String, Object>>) map.get("data")) {
				// KeyName: snakeCase => camelCase 변환
				CamelHashMap<String, Object> cm = mapper.convertValue(obj,CamelHashMap.class);
//				// map => dto parsing
				MinuteDataDto dto = mapper.convertValue(cm ,MinuteDataDto.class);
				dto.setUserId((String) map.get("userId"));
				healthcareService.insMinuteData(dto);
			}
		}else {		// 월 OR 일 데이터
			for(Map<String, Object> obj : (ArrayList<Map<String, Object>>) map.get("data")) {
				// KeyName: snakeCase => camelCase 변환
				CamelHashMap<String, Object> cm = mapper.convertValue(obj,CamelHashMap.class);
				// map => dto parsing
				MonthDayDataDto dto = mapper.convertValue(cm ,MonthDayDataDto.class);
				dto.setUserId((String) map.get("userId"));
				healthcareService.insMonthDayData(dto);
				UserDateDto userDateDto = mapper.convertValue(dto, UserDateDto.class);
				healthcareService.insExerciseScore(map);
				healthcareService.insStressScore(map);
			}
		}
		return ApiResponse.ok();
	}

	@GetMapping("/health_check")
	public String status() {
		return String.format("it working in health Service"
		+ ", db usernamae" + env.getProperty("spring.datasource.url"));
	}

//	@PostMapping("insertHealthInfo")
//	public ResponseEntity<ApiResponse> insertHealthInfo (HttpServletRequest request, @RequestBody HealthInfoDto dto) throws Exception{
//		dto.setReceiveTime(new Timestamp(System.currentTimeMillis()));
//		Map<String, Object> result = new HashMap<>();
//		int i = 0;
//		try {
//			i = healthcareService.insHealthInfo(dto);
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//		if(i == 1) {
//			return ApiResponse.ok(result);
//		}else if(i == 0){
//			return ApiResponse.error(ApiResultCode.INSERT_FAIL);
//		}else{
//			return ApiResponse.error(ApiResultCode.UNKOWN_ERR);
//		}
//	}
	
	@PostMapping("minmaxHealthInfo")
	public ResponseEntity<ApiResponse> minmaxHealthInfo(HttpServletRequest request, @RequestBody Map<String, Object> map){
		return ApiResponse.ok(healthcareService.minmaxHealthInfo(map));
	}
	
	//	건강 정보 조회
	@PostMapping("healthInfo")
	public ResponseEntity<ApiResponse> healthInfo(HttpServletRequest request, @RequestBody Map<String, Object> map){
		return ApiResponse.ok(healthcareService.healthInfo(map));
	}

	@PostMapping("healthInfoChart")
	public ResponseEntity<ApiResponse> healthInfoChart(HttpServletRequest request, @RequestBody Map<String, Object> map){
		Map<String, Object> result = healthcareService.healthInfoChart(map);
		String[] strArr = (String[]) result.get("lv");
		ArrayList<String[]> lv = new ArrayList<String[]>();
		String[] arr = map.get("query").equals("Y")?(String[]) result.get("year"):(String[]) result.get("month");
		for(int i=0; i< strArr.length; i++) {
			String year = "";
			if(map.get("query").equals("Y")) {	// 년 검색
				year = strArr[i].equals("01")? arr[i]:"";
			}else {	// 주 or 월 검색
				if(arr[i].equals("01")) {
					String date = (String)map.get("date");
					year = strArr[i].equals("01") ? date.substring(0, 4):"";
				}
				strArr[i] = strArr[i].equals("01") ? arr[i]+"/"+strArr[i]:strArr[i];
			}
			String[] res = {strArr[i],year}; 
			lv.add(res);
		}
		result.put("lv", lv);
		return ApiResponse.ok(result);
	}
	
	/**
	 * @apiNote 단위 커스텀 차트 데이터(단일 데이터 => 조건: 조회항목)
	 * @param map(keyName) date: 검색 기준일(end Date) 
	 * @param map(keyName) condition: 차트 Level(ex: 60분, 30분, 5분)
	 * @param map(keyName) type: return 데이터 종류 (ex: all(min,max,avg), min/max(min,max), avg(sum,avg)) 
	 * @param map(keyName) searchWrd: 검색 데이터(ex: temperature)
	 * @param map(keyName) userId: 조회 ID
     * @return Map
     */
	@PostMapping("customMinuteChart")
	public ResponseEntity<ApiResponse> customMinuteChartData(HttpServletRequest request, @RequestBody Map<String,Object> map){
		return ApiResponse.ok(healthcareService.customMinuteChartData(map));
	}
	
	/**
	 * @apiNote 커스텀 차트 데이터(대시 보드 모든 데이터 리스트)
	 * @param map(keyName) userId: 조회 ID
     * @return Map
     */
	@PostMapping("customMinuteDashBRDChart")
	public ResponseEntity<ApiResponse> customMinuteDashBRDChart(HttpServletRequest request, @RequestBody Map<String,Object> map){
		return ApiResponse.ok(healthcareService.customMinuteDashBRDChart(map));
	}

	/**
	 * dash 보드 진입시 가지고오는 실시간 데이터 + 수면데이터 + 목표데이터
	 * @param request
	 * @param map
	 * @return
	 */
	@PostMapping("dailydata")
	public ResponseEntity<ApiResponse>  dailydata(HttpServletRequest request, @RequestBody Map<String, Object> map) {
		map.put("todayDate", getToday() );
		Map<String,Object> responseData =healthcareService.realtimeBiodata(map);
		Map<String,Object> sleepData =healthcareService.todaySleepdata(map);
		log.info("ash dailydata : " + sleepData.toString());

		//목표 데이터 가져오기
		TargetDto dto = new TargetDto();
		if(responseData != null && !responseData.isEmpty()) {
			log.info("ash dailydata : " + responseData.toString());
			dto.setCurrentStep((Integer) responseData.get("step"));
			dto.setCurrentStress((Integer)responseData.get("stress"));
		}
		else {
			dto.setCurrentStep(0);
			dto.setCurrentStress(0);
		}

		if(sleepData != null && !sleepData.isEmpty()) {
			if((Integer) sleepData.get("sleep") > 600) {
				dto.setTotalSleep(600);
			}
			else {
				dto.setTotalSleep((Integer) sleepData.get("sleep"));
			}
		}
		else{
			dto.setTotalSleep(0);
		}

		Map<String,Object> targetData = healthcareService.getTarget(dto);

		responseData.putAll(sleepData);
		responseData.putAll(targetData);

		if(responseData.isEmpty() || sleepData.isEmpty()) {
			return ApiResponse.error(ApiResultCode.UPDATE_FAIL);
		}

		return ApiResponse.ok(responseData);
	}


	/**
	 * 1분에 한번씩 호출되는 실시간 데이터
	 * @param request
	 * @param map
	 * @return
	 */
	@PostMapping("realtimeBiodata") //ash 23.11.20 - review customer info for dash
	public ResponseEntity<ApiResponse> realtimeBiodata(HttpServletRequest request, @RequestBody Map<String,Object> map){
		map.put("todayDate", getToday() );
		Map<String,Object> responseData =healthcareService.realtimeBiodata(map);

		TargetDto dto = new TargetDto();
		if(responseData != null && !responseData.isEmpty()) {
			dto.setCurrentStep((Integer) responseData.get("step"));
			dto.setCurrentStress((Integer)responseData.get("stress"));
		}
		else{
			dto.setCurrentStep(0);
			dto.setCurrentStress(0);
		}

		if(map.get("sleep") != null) {
			dto.setTotalSleep(Integer.parseInt((String) map.get("sleep")));
		}
		else {
			dto.setTotalSleep(0);
		}

		Map<String,Object> targetData = healthcareService.getTarget(dto);
		responseData.putAll(targetData);

		if(responseData.isEmpty() ) {
			return ApiResponse.error(ApiResultCode.UPDATE_FAIL);
		}

		return ApiResponse.ok(responseData);
	}

	@PostMapping("graphBiodata")
	public ResponseEntity<ApiResponse> graphBiodata(HttpServletRequest request, @RequestBody Map<String,Object> map) {
		log.info((String) map.get("startTime"));
		return ApiResponse.ok(healthcareService.graphBiodata(map));
	}

	@PostMapping("healthinfoDailySleep")
	public ResponseEntity<ApiResponse> healthinfoDailySleep(@RequestBody Map<String,Object> map) {
		return ApiResponse.ok(healthcareService.healthinfoDailySleep(map));
	}

	/**
	 * API정의서 ver.1.7(추가)
	 * @apiNote Daily Step(일일 활동 데이터)
	 *
	 * @HTTPRequestBody
	 * @param map(keyName) userId: 유저 ID
	 * @param map(keyName) tid: 기기 구분값
	 * ArrayList<Map>
	 * @param map(keyName) mCalendar:
	 * @param map(keyName) totalSteps:
	 * @param map(keyName) totalCalories:
	 * @param map(keyName) totalDistance:
	 * @param map(keyName) runSteps:
	 * @param map(keyName) runCalories:
	 * @param map(keyName) runDistance:
	 * @param map(keyName) runDuration:
	 * @param map(keyName) walkSteps:
	 * @param map(keyName) walkCalories:
	 * @param map(keyName) walkDistance:
	 * @param map(keyName) walkDuration:
	 * @param map(keyName) hourDetails:
	 * @param map(keyName) runHourDetails:
	 * @param map(keyName) walkHourDetails:
	 *
	 * @HTTPResponese
	 * @return Map
	 */
	@PostMapping("insDailyStep")
	public ResponseEntity<ApiResponse> insertDailyStep(HttpServletRequest request, @RequestBody Map<String, Object> map) {
		Map<String, Object> result = new HashMap<>();
		result.put("count", healthcareService.insertDailyStep(map));

		//건강점수 계산
		//healthcareService.insExerciseScore(map);

		// 수정된 개수 return
		if((int) result.get("count") == 0)
			return ApiResponse.error(ApiResultCode.UPDATE_FAIL);

		return ApiResponse.ok(result);
	}

	/**
	 * API정의서 ver.1.7(추가)
	 * @apiNote Daily Sleep(일일 수면 데이터)
	 *
	 * @HTTPRequestBody
	 * @param map(keyName) tid: 기기 구분값
	 * ArrayList<Map>
	 * @param map(keyName) awakeCount:
	 * @param map(keyName) awakeTime:
	 * @param map(keyName) beginTime:
	 * @param map(keyName) calender:
	 * @param map(keyName) colorIndexOut:
	 * @param map(keyName) deepTime:
	 * @param map(keyName) endTime:
	 * @param map(keyName) lightTime:
	 * @param map(keyName) remTime:
	 * @param map(keyName) sleepInfoList:
	 * @param map(keyName) sleepTotalTime:
	 * @param map(keyName) timeArray:
	 * @param map(keyName) timePoint:
	 *
	 * @HTTPResponese
	 * @return Map
	 */
	@PostMapping("insDailySleep")
	public ResponseEntity<ApiResponse> insertDailySleep(HttpServletRequest request, @RequestBody Map<String, Object> map){
		Map<String, Object> result = new HashMap<>();
		result.put("count", healthcareService.insertDailySleep(map));

		//수면 점수 계산
		healthcareService.insSleepScore(map);

		// 수정된 개수 return
		if((int) result.get("count") == 0)
			return ApiResponse.error(ApiResultCode.UPDATE_FAIL);

		return ApiResponse.ok(result);
	}

	@PostMapping("healthScoreList")
	public ResponseEntity<ApiResponse> healthScoreList(@RequestBody Map<String,Object> map) {
		log.info("ash healthinfo + " + map.get("userId"));
		return ApiResponse.ok(healthcareService.healthScoreList(map));
	}

	@PostMapping("/inscommunity")
	public ResponseEntity<ApiResponse> inscommunity(@RequestBody Map<String,Object> map) {
		return ApiResponse.ok(healthcareService.inscommunity(map));
	}

	@PostMapping("communityList")
	public ResponseEntity<ApiResponse> communityList(@RequestBody Map<String,Object> map) {
		log.info("ash result" + map.toString());
		return ApiResponse.ok(healthcareService.commuList(map));
	}

	@PostMapping("/chat_ai")
	public ResponseEntity<ApiResponse> chat_ai(@RequestBody Map<String,Object> map)  {

		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("userId", map.get("userId"));

		LocalDate today = LocalDate.now();
		// 원하는 형식으로 포맷하기
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		String formattedDate = today.format(formatter);
		paramMap.put("regDate", formattedDate);

		//날짜와 이름으로 response데이터가 있는지 검색
		Map<String,Object> responseMap = healthcareService.getAiResponse(paramMap);
		String aiResponse = "";
		if(responseMap != null) {
			aiResponse = (String) responseMap.get("airesponse");
		}
		else {
			AIHandleDto aiHandleDto = new AIHandleDto();
			//받아온 데이터로 쿼리생성
			String query = aiHandleDto.getQuery(bioInfoDto.getBioInfoDto(map));

			aiResponse= chatService.getChatResponse(query); //받아옴

			paramMap.put("aiResponse", aiResponse);
			healthcareService.insAiResponse(paramMap); //정보 넣음( 이 정보 기준으로 chatgpt 사용여부 결정)
		}

		Map<String, Object> result = new HashMap<>();
		result.put("aiResponse", aiResponse);
		return ApiResponse.ok(result);
	}
}