package mz.hc.service.healthcare.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
//@RequestMapping("/healthcare")
public class TestController {
	
	@GetMapping("/test")
	public Map<String, Object> test(HttpServletRequest request) {
		log.info("REQUEST ID   --> {}", request.getHeader("X-Auth-userId"));
		log.info("REQUEST ROLE --> {}", request.getHeader("X-Auth-userRole"));
		Map<String, Object> returnMap = new HashMap<>();
		returnMap.put("id", request.getHeader("X-Auth-userId"));
		returnMap.put("role", request.getHeader("X-Auth-userRole"));
		return returnMap;
	}
}