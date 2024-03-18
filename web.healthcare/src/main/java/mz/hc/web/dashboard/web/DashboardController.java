package mz.hc.web.dashboard.web;

import java.net.MalformedURLException;
import java.net.URL;
import java.security.NoSuchAlgorithmException;
import java.util.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import mz.hc.web.dto.TestDto;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;
import mz.hc.web.util.GatewayUtils;
import mz.hc.web.util.Sha256;
import mz.hc.web.util.StringEncrypt;
import org.springframework.web.servlet.ModelAndView;


@Slf4j
@Controller
public class DashboardController {
	
	@RequestMapping(value="/")
	public String main(HttpServletRequest req, HttpServletResponse res, HttpSession session, @RequestParam Map<String, Object> map, Model model) {
		if(session.getAttribute("acToken") == null) {	// 토큰 값 없을때
			return "redirect:/user/signin";
		}
		model.addAttribute("uri", req.getRequestURI());
		model.addAttribute("url", req.getRequestURL());
		model.addAttribute("searchUserId", map.getOrDefault("searchUserId", session.getAttribute("userId")));
		model.addAttribute("searchWrd", map.getOrDefault("userId", session.getAttribute("userId")));
		return "/health/healthInfo";
	}
	@RequestMapping("/hello")
	public String Hello(HttpServletRequest req, HttpServletResponse res, HttpSession session, @RequestParam Map<String, Object> map, Model model){

		if(session.getAttribute("acToken") == null) {	// 토큰 값
			return "redirect:/user/signin";
		}

		model.addAttribute("uri", req.getRequestURI());
		model.addAttribute("url", req.getRequestURL());
		model.addAttribute("searchUserId", map.getOrDefault("searchUserId", session.getAttribute("userId")));
		model.addAttribute("userNm", map.getOrDefault("userNm", null));

		//사용자 권한 확인
		if( session.getAttribute("userRoleFk").equals("1")){ //사용자일 경우
			return "/user/dashboard";
		}
		else{
			return "/userInfo/user_manage_list";
		}

	}
	@RequestMapping("/addform")
	public String addform(HttpServletRequest req, HttpServletResponse res, HttpSession session, @RequestParam Map<String, Object> map, Model model){

		return "/userInfo/user_add_detail";
	}

	@RequestMapping("/write")
	public String write(HttpServletRequest req, HttpServletResponse res, HttpSession session, @RequestParam Map<String, Object> map, Model model){

		return "/community/communitymain";
	}

	@RequestMapping("/helloo")
	public ModelAndView Helloo(){
		return new ModelAndView("/health/healthInfoList");
	}
	@GetMapping("/dashboard")
	public String healthInfoList(HttpServletRequest req, HttpServletResponse res, @RequestParam Map<String, Object> map, Model model, HttpSession session) {
		if(session.getAttribute("acToken") == null) {	// 토큰 값 없을때
			return "redirect:/user/signin";
		}
		model.addAttribute("uri", req.getRequestURI());
		model.addAttribute("url", req.getRequestURL());
		model.addAttribute("searchUserId", map.getOrDefault("searchUserId", session.getAttribute("userId")));
		model.addAttribute("userNm", map.getOrDefault("userNm", null));
		return "/health/healthInfoList";
	}

	@GetMapping("/analysis")
	public String healthAnalysisInfo(HttpServletRequest req, HttpServletResponse res, @RequestParam Map<String, Object> map, Model model, HttpSession session) {
		if(session.getAttribute("acToken") == null) {	// 토큰 값 없을때
			return "redirect:/user/signin";
		}
		model.addAttribute("uri", req.getRequestURI());
		if(session.getAttribute("acToken") == null) {
			return "redirect:/user/signin";
		}

		model.addAttribute("uri", req.getRequestURI());
		model.addAttribute("url", req.getRequestURL());
		model.addAttribute("searchUserId", map.getOrDefault("searchUserId", session.getAttribute("userId")));
		model.addAttribute("userNm", map.getOrDefault("userNm", null));
		return "health/analysis";
	}

	@GetMapping("/tempanal")
	public String tempanal(HttpServletRequest req, HttpServletResponse res, @RequestParam Map<String, Object> map, Model model, HttpSession session) {
//		if(session.getAttribute("acToken") == null) {	// 토큰 값 없을때
//			return "redirect:/user/signin";
//		}
		return "/health/tempanal";
	}

	@GetMapping("/community")
	public String community(HttpServletRequest req, HttpServletResponse res, @RequestParam Map<String, Object> map, Model model, HttpSession session) {
		if(session.getAttribute("acToken") == null) {	// 토큰 값 없을때
			return "redirect:/user/signin";
		}
		model.addAttribute("uri", req.getRequestURI());
		model.addAttribute("url", req.getRequestURL());
		model.addAttribute("searchUserId", map.getOrDefault("searchUserId", session.getAttribute("userId")));
		model.addAttribute("userNm", map.getOrDefault("userNm", null));

		List<TestDto> list = new ArrayList<>();

		TestDto list1= new TestDto("김미영","정보", "오늘은 날씨가 너무 안좋네요 건강조심하세요 ^^", 2);
		TestDto list2= new TestDto("이정현","정보", "고혈압에 좋은 음식으로는 토마토가 있습니다.<p>" +
				"<p>1. 칼륨이 풍부한 바나나\n" +
				"바나나는 나트륨 함량이 낮고 혈압을 낮추는 데 도움을 주는 칼륨의 좋은 공급원이다. 또한 섬유질로 가득 차 있어 속을 채워준다. 텍사스주 베일러대학병원 스테파니 딘 박사는 “특정 혈압약을 복용하면 칼륨의 필요성이 증가할 수 있다”며 “칼륨의 부족은 근육과 심박수에 영향을 미친다”고 말한다.\n</p>" +
				"\n" +
				"<p>2. 칼슘을 제공하는 요거트\n" +
				"요거트는 칼슘의 훌륭한 공급원이다. 하버드헬스퍼블리싱에 의하면 칼슘 결핍은 고혈압의 원인이 될 수 있다. 딘 박사는 “많은 사람들이 칼슘을 주로 아이들에게 필요한 것으로 생각하지만 어른도 여전히 칼슘이 필요하다”고 말한다. 8온스(약 226g) 가량 플레인 저지방 요구르트는 칼슘 약 415 mg을 제공한다. 이는 성인의 1일 칼슘 권장량의 약 3분의 1에 해당한다.", 6);
		TestDto list3= new TestDto("최미옥","정보", "피로 피로 피로</p>" +
				"\n" +
				"<p>대표질환: 체력저하, 우울증, 수면무호흡증, 갑상선기능 이상, 심한 간기능/신기능 이상, 빈혈 등\n" +
				"\n" +
				"대책: 간단히 병에 의한 것인지 검사하기. 자기 자신을 인정하고 사랑하고 챙겨주기.\n" +
				"\n" +
				"과로를 하지 않았는데도 피로하거나, 평소보다 충분히 쉬었는데도 피로가 풀리지 않는 상태가 지속될 경우에는 혹시라도 질병과 관련이 있는지 의사의 도움을 받는 것이 좋습니다. 의사들은 이런 분들에 대해 혈액검사를 통해 갑상선기능이상, 빈혈, 당뇨병, 간기능 장애, 신장기능 장애 유무를 살펴보고, 수면무호흡증 여부를 염두에 두고 평소 코를 심하게 골고, 자다가 10초 이상 숨을 멈추다 ‘푸우’하고 쉬는 경우가 자주 있는지 물어보게 되며 필요하면 수면다원검사를 하게 됩니다.  . ",1);

		list.add(list3);
		list.add(list2);
		//list.add(list1);
		model.addAttribute("list", list);
		return "community/com_main";
	}
}
