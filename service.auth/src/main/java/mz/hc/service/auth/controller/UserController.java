package mz.hc.service.auth.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mz.hc.service.auth.dto.ApiResponse;
import mz.hc.service.auth.dto.ApiResultCode;
import mz.hc.service.auth.dto.FindDto;
import mz.hc.service.auth.dto.JwtTokenDto;
import mz.hc.service.auth.dto.SigninDto;
import mz.hc.service.auth.dto.SignupDto;
import mz.hc.service.auth.dto.UserDto;
import mz.hc.service.auth.service.UserService;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class UserController {
	
	private final UserService userService;
	
	/**
	 * @apiNote 회원가입
	 * */
	@PostMapping("/v1/signup")
	@Transactional
	public ResponseEntity<ApiResponse> signup(@Valid @RequestBody SignupDto user) throws Exception {
		/**
		 * 1. 사용자 정보 추가 되면 SignupDto에 정보 추가
		 * 2. 중복검사가 필요한 컬럼이 있을 시, 중복검사 API 신규 개발
		 * */
		// 회원 가입
		int result = userService.signup(user);
		if(result == 1) {
			// 회원 권한 추가 (userSeq)
			userService.insUserAuth(user);
			// 담당자 매핑 정보 추가.
			if(user.getDoctorSeq() != 0) {
				userService.insDoctorMapping(user);
			}
			if(user.getGuardian() != null) {
				if(!user.getGuardian().isEmpty()) {
					JSONArray arr = new JSONArray(user.getGuardian());
					for(Object obj : arr) {
						JSONObject json = new JSONObject(obj.toString());
						log.info(json.toString());
						log.info(json.keys().toString());
						user.setGuardianSeq((int) json.get("guardianSeq"));
						user.setGuardianId((String) json.get("guardianId"));
						userService.insGuardianMapping(user);
					}
				}
			}
	        return ApiResponse.ok();
		}else {
			return ApiResponse.error(ApiResultCode.INSERT_FAIL);
		}
    }
	
	/**
	 * @apiNote 회원가입(ID중복 체크)
	 * */
	@PostMapping("/v1/duplicateId")
	public ResponseEntity<ApiResponse> duplicateId(@RequestBody UserDto dto) throws Exception {
		if(userService.duplicateId(dto)) {
			return ApiResponse.ok();
		}else {
			return ApiResponse.error(ApiResultCode.DUPLICATE_CODE);
		}
        
    }
	/**
	 * @apiNote 회원가입(email중복 체크)
	 * */
	@PostMapping("/v1/duplicateEmail")
	public ResponseEntity<ApiResponse> duplicateEmail(@RequestBody UserDto dto) throws Exception {
		if(userService.duplicateEmail(dto)) {
			return ApiResponse.ok();
		}else {
			return ApiResponse.error(ApiResultCode.DUPLICATE_CODE);
		}
        
    }
	
	/**
	 * @apiNote 회원가입(담당자 검색)
	 * */
	@PostMapping("/v1/searchDoctor")
	public ResponseEntity<ApiResponse> serchDoctor(@RequestBody UserDto dto) throws Exception {
		
		Map<String,Object> result = new HashMap<>();
		
		List<Map<String,Object>> list = userService.searchDoctor(dto);
		if(list.size() == 0) {
			return ApiResponse.error(ApiResultCode.RESULT_IS_EMPTY);
		}else {
			result.put("list",list);
			return ApiResponse.ok(result);
		}
    }
	
	/**
	 * @apiNote 회원가입(보호자 검색)
	 * */
	@PostMapping("/v1/searchParent")
	public ResponseEntity<ApiResponse> serchParent(@RequestBody UserDto dto) throws Exception {
		Map<String,Object> result = new HashMap<>();
		List<Map<String,Object>> list = userService.searchParent(dto);
		if(list.size() == 0) {
			return ApiResponse.error(ApiResultCode.RESULT_IS_EMPTY);
		}else {
			result.put("list",list);
			return ApiResponse.ok(result);
		}
    }
	
	/**
	 * @apiNote 로그인
	 * */
	
	@PostMapping("/v1/signin")
	public ResponseEntity<ApiResponse> signin(@Valid @RequestBody SigninDto user) throws Exception {
		/**
		 * 1. 로그인에 필요한 정보가 추가 되면 SigninDto에 추가
		 *
		 * */

		return ApiResponse.ok(userService.signin(user));
	}
	
	/**
	 * @apiNote ID 찾기
	 * */
	@PostMapping("/v1/findUserId")
	public ResponseEntity<ApiResponse> findUserId(@RequestBody FindDto dto) throws Exception {
		Map<String, Object> map = userService.findUserId(dto);
		
		return ApiResponse.ok(map);
	}
	
	/**
	 * @apiNote PW 찾기(회원 정보 확인)
	 * */
	@PostMapping("/v1/findUserPw")
	public ResponseEntity<ApiResponse> findUserPw(@RequestBody FindDto dto) throws Exception {
		Map<String, Object> map = userService.findUserPw(dto);
		if(!map.isEmpty()) {
			if((Long) map.get("count") != 0) {	
				return ApiResponse.ok();
			}else {		// 일치하는 회원 없음.
				return ApiResponse.error(ApiResultCode.RESULT_IS_EMPTY);
			}
		}else {
			return ApiResponse.error(ApiResultCode.UNKOWN_ERR);
		}
	}
	
	/**
	 * @apiNote PW 변경(회원 정보 확인 후)
	 * */
	@PostMapping("/v1/updateUserPw")
	public ResponseEntity<ApiResponse> updateUserPw(@RequestBody FindDto dto) throws Exception {
		int result = userService.updateUserPw(dto);
		if(result > 0) {
			return ApiResponse.ok();
		}else {
			return ApiResponse.error(ApiResultCode.UPDATE_FAIL);
		}
	}
	
	/**
	 * @apiNote 토큰 재발급
	 * */
	@PostMapping("/v1/refresh")
	public ResponseEntity<ApiResponse> refresh(HttpServletRequest req) throws Exception {
//		JwtTokenDto refreshToken = userService.refresh(refreshToken);
		/**
		 * 1. Access Token에 대한 Invalid Check
		 * 2. Refresh Token에 대한 Expire and Invalid Check 
		 * 3. Refresh Token 추출 후 DB 비교 하여 일치하면 사용자 정보 Select하여 ATK, RTK 재 생성 후 Return
		 * 
		 * */
		String accessToken = "";
		String bearerToken = req.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer")) {
            accessToken = bearerToken.substring(7);
        }
        String refreshToken = "";
        String refreshBearerToken = req.getHeader("refreshToken");
        if (StringUtils.hasText(refreshBearerToken) && refreshBearerToken.startsWith("Bearer")) {
        	refreshToken = refreshBearerToken.substring(7);
        }
        
        JwtTokenDto token = userService.refresh(accessToken, refreshToken);
        
		return ApiResponse.ok(token);
	}
	
	/**
	 * @apiNote 로그아웃
	 * */
	@PostMapping("/v1/logout")
	public ResponseEntity<ApiResponse> logout(HttpServletRequest req) throws Exception {
		/**
		 * 1. Front 단에서는 ATK 정보 삭제
		 * 2. Back 단에서는 User 테이블의 RTK 정보 삭제
		 * */
		String token = "";
		String bearerToken = req.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer")) {
            token = bearerToken.substring(7);
        }
        
		userService.logout(token);
		return ApiResponse.ok();
	}
	
//	public String decodeBody(HttpServletRequest request){
//		ServletInputStream inputStream;
//		String s = null;
//		try {
//			inputStream = request.getInputStream();
//	        byte[] bytes = IOUtils.toByteArray(inputStream);
//	        s = new String(bytes, StandardCharsets.UTF_8);
//	        
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//		return s;
//	}
}