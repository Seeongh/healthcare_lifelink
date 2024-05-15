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

		model.addAttribute("uri", req.getRequestURI());
		model.addAttribute("url", req.getRequestURL());
		model.addAttribute("searchUserId", map.getOrDefault("searchUserId", session.getAttribute("userId")));
		model.addAttribute("searchWrd", map.getOrDefault("userId", session.getAttribute("userId")));
		return "/health/healthInfo";
	}
	@RequestMapping("/hello")
	public String Hello(HttpServletRequest req, HttpServletResponse res, HttpSession session, @RequestParam Map<String, Object> map, Model model){

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

		model.addAttribute("uri", req.getRequestURI());
		model.addAttribute("url", req.getRequestURL());
		model.addAttribute("searchUserId", map.getOrDefault("searchUserId", session.getAttribute("userId")));
		model.addAttribute("userNm", map.getOrDefault("userNm", null));
		return "/health/healthInfoList";
	}

	@GetMapping("/analysis")
	public String healthAnalysisInfo(HttpServletRequest req, HttpServletResponse res, @RequestParam Map<String, Object> map, Model model, HttpSession session) {

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
}
