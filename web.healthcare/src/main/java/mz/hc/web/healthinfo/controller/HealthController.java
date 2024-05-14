package mz.hc.web.healthinfo.controller;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;
import mz.hc.web.util.GatewayUtils;

@Slf4j
@Controller
@RequestMapping("/health")
public class HealthController {
	
	@Value("${gateway.healthcare.uri}")
	private String uri;
	
	@Value("${gateway.version}")
	private String version;
	
	/**
	 * @apiNote 건강정보 view
     * @return view
     */
	@PostMapping(path = {"/temperature","/spo2","/sleep","/heartrate","/step","/stress","/bloodpress","/repiratory" })
	public String healthInfo(HttpServletRequest req, HttpServletResponse res, @RequestParam Map<String, Object> map, Model model, HttpSession session) {

		model.addAttribute("uri", req.getRequestURI());
		model.addAttribute("url", req.getRequestURL());
		if(map.getOrDefault("searchUserId",null)!= null && map.getOrDefault("searchUserId",null).equals("undefined")) {	// 검색 ID 없으면 내 ID
			map.put("searchUserId", session.getAttribute("userId"));
		}
		model.addAttribute("searchUserId", map.getOrDefault("searchUserId", session.getAttribute("userId")));
		model.addAttribute("userNm", map.getOrDefault("userNm", null));
		return "/health/healthInfo";
	}
	
	/**
	 * @apiNote 건강 정보 조회
     * @return Map
     */
	@PostMapping("/healthInfoChart")
	@ResponseBody
	public Object healthInfoChart(HttpServletRequest req, HttpServletResponse res, @RequestParam Map<String, Object> map, Model model, HttpSession session) {
		JSONObject body = new JSONObject(map);
		Map<String, Object> result = new HashMap<>();
		String url = "/customMinuteDashBRDChart";	// 대시보드 (모든 데이터:일데이터(Day))
		if(map.containsKey("searchWrd")) {
			if(map.get("query").equals("D"))	// 건강정보 상세 : 조건 일데이터(Day) 일데이터는 최대/최소 구분된 값이 혈압 외 없음.
				url = "/customMinuteChart";
			else {
				if(map.get("searchWrd").equals("step") || map.get("searchWrd").equals("sleep") || map.get("searchWrd").equals("heartrate") ) {
					url = "/healthInfoChart";	// 일반 값 (최대/최소로 구성된 데이터가 아님)
				}else {
					url = "/minmaxHealthInfoChart";	// 최대/최소로 구성된 데이터
				}
			}
		}
		try {
			String str = (String) GatewayUtils.post(new URL(uri+version+url), GatewayUtils.tokenCheck(session, res), body.toString());
			ObjectMapper obj = new ObjectMapper();
			result = obj.readValue(str, Map.class);
			if(result.containsKey("resultCode") && result.get("resultCode").equals("1003")) {
				session.removeAttribute("acToken");
				session.removeAttribute("rfToken");
			}
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	@PostMapping("/healthrealtimeData")
	@ResponseBody
	public Object healthrealtimeData(HttpServletRequest req, HttpServletResponse res, @RequestParam Map<String, Object> map, Model model, HttpSession session) {
		JSONObject body = new JSONObject(map);
		Map<String, Object> result = new HashMap<>();

		String url = "";
		//String url = "/customMinuteDashBRDChart";	// 대시보드 (모든 데이터:일데이터(Day))
		//if(map.containsKey("searchWrd")) {
//			if(map.get("query").equals("D"))	// 건강정보 상세 : 조건 일데이터(Day) 일데이터는 최대/최소 구분된 값이 혈압 외 없음.
				url = "/realtimeBiodata";
		try {
			String str = (String) GatewayUtils.post(new URL(uri+version+url), GatewayUtils.tokenCheck(session, res), body.toString());
			log.info(str);
			ObjectMapper obj = new ObjectMapper();
			result = obj.readValue(str, Map.class);
			if(result.containsKey("resultCode") && result.get("resultCode").equals("1003")) {
				session.removeAttribute("acToken");
				session.removeAttribute("rfToken");
			}

			log.info("ash realtime param " + str);

		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	/*
	심박, 체온, 스트레스, 걸음수, 혈압 , 목표(걸음,스트레스)
	 */
	@PostMapping("/healthgraphBiodata")
	@ResponseBody
	public Object healthgraphBiodata(HttpServletRequest req, HttpServletResponse res, @RequestParam Map<String, Object> map, Model model, HttpSession session) {
		String url = "";
		url = "/graphBiodata";
		log.info("ash param" + map.toString());
		JSONObject body = new JSONObject(map);
		Map<String, Object> result = new HashMap<>();
		try{
			String str = (String) GatewayUtils.post(new URL(uri+version+url), GatewayUtils.tokenCheck(session, res), body.toString());
			ObjectMapper obj = new ObjectMapper();

			result = obj.readValue(str, Map.class);
			if(result.containsKey("resultCode") && result.get("resultCode").equals("5001")) {
				session.removeAttribute("acToken"); //세션종료
				session.removeAttribute("rfToken");
			}
			log.info("ash analysis param " + str);
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return result;
	}


	/**
	 * 실시간데이터와
	 * 수면데이터(1일 1회 업데이트됨)
	 * 타겟
	 * @param req
	 * @param res
	 * @param map
	 * @param model
	 * @param session
	 * @return
	 */
	@PostMapping("/healthdailyData")
	@ResponseBody
	public Object healthdailyData(HttpServletRequest req, HttpServletResponse res, @RequestParam Map<String, Object> map, Model model, HttpSession session) {
		String url = "";
		url = "/dailydata";
		log.info("ash param" + map.toString());
		JSONObject body = new JSONObject(map);
		Map<String, Object> result = new HashMap<>();
		try{
			String str = (String) GatewayUtils.post(new URL(uri+version+url), GatewayUtils.tokenCheck(session, res), body.toString());
			ObjectMapper obj = new ObjectMapper();

			result = obj.readValue(str, Map.class);
			if(result.containsKey("resultCode") && result.get("resultCode").equals("1003")) {
				session.removeAttribute("acToken");
				session.removeAttribute("rfToken");
			}
			log.info("ash analysis param " + str);
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return result;
	}

	@PostMapping("/healthinfoDailySleep")
	@ResponseBody
	public Object healthinfoDailySleep(HttpServletRequest req, HttpServletResponse res, @RequestParam Map<String, Object> map, Model model, HttpSession session) {
		String url = "";
		url = "/healthinfoDailySleep";
		JSONObject body = new JSONObject(map);
		Map<String, Object> result = new HashMap<>();
		try{
			//[[수면 type,기간,종료시간,시작시간]....]
			String str = (String) GatewayUtils.post(new URL(uri+version+url), GatewayUtils.tokenCheck(session, res), body.toString());

			ObjectMapper obj = new ObjectMapper();
			result = obj.readValue(str, Map.class);

			if(result.containsKey("resultCode") && result.get("resultCode").equals("1003")) {
				session.removeAttribute("acToken");
				session.removeAttribute("rfToken");
			}
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return result;
	}

	@PostMapping("/healthScoreList")
	@ResponseBody
	public Object healthScoreList(HttpServletRequest req, HttpServletResponse res, @RequestParam Map<String, Object> map, Model model, HttpSession session) {
		JSONObject body = new JSONObject(map);
		Map<String, Object> result = new HashMap<>();

		String url = "";
		url = "/healthScoreList";
		try {
			String str = (String) GatewayUtils.post(new URL(uri+version+url), GatewayUtils.tokenCheck(session, res), body.toString());

			ObjectMapper obj = new ObjectMapper();
			result = obj.readValue(str, Map.class);
			log.info("ash result" + result);
			if(result.containsKey("resultCode") && result.get("resultCode").equals("1003")) {
				session.removeAttribute("acToken");
				session.removeAttribute("rfToken");
			}
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

}
