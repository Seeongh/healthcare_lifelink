package mz.hc.service.usermanagement.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import mz.hc.service.usermanagement.dto.*;
import mz.hc.service.usermanagement.util.AES256Util;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.amqp.rabbit.connection.AbstractConnectionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mz.hc.service.usermanagement.service.UserServiceImpl;
import mz.hc.service.usermanagement.util.PagingUtil;

@RestController
@RequiredArgsConstructor
@RequestMapping("/management")
@Slf4j
public class ManagementController {
	
	@Autowired
	UserServiceImpl userService;
	
	@Autowired
	PagingUtil pagingUtil;
	
	/**
	 * @apiNote 유저 정보 조회(마이페이지)
	 * */
	
	@PostMapping("/v1/userInfo")
	public ResponseEntity<ApiResponse> userInfo(HttpServletRequest req,@Valid @RequestBody UserDto dto) throws Exception {
		return ApiResponse.ok(userService.userInfo(dto));
	}

	@PostMapping("/v1/userBoardInfo")
	public ResponseEntity<ApiResponse> userBoardInfo(HttpServletRequest req,@Valid @RequestBody UserDto dto) throws Exception {

		Map<String, Object> responseData  = new HashMap<>();

		log.info("ash userboardinfo : " + dto.toString());
		Map<String, Object> userBioinfo = userService.userInfo(dto);
		List<Map<String, Object>> userRoleinfo = userService.searchdrguardianList(dto);

		UserhealthDto userhealthDto = new UserhealthDto();
		userhealthDto.setBirthdate(AES256Util.decrypt((String) userBioinfo.get("birthEnc")));
		userhealthDto.setGender((String) userBioinfo.get("gender"));

		Map<String, Object> userHealthavg = userService.ageavgHealthinfo(userhealthDto);

		responseData.put("userBioinfo", userBioinfo);
		responseData.put("userRolelist", userRoleinfo);
		responseData.put("userHealthavg", userHealthavg);

		log.info("ash userboardinfo result : " + responseData.toString());

		if(userBioinfo.isEmpty()) {
			return ApiResponse.error(ApiResultCode.RESULT_IS_EMPTY);
		}else {
			return ApiResponse.ok(responseData);
		}
	}

	/**
	 * @apiNote 유저 정보 수정(마이페이지)
	 * */
	@PostMapping("/v1/updateUserInfo")
	public ResponseEntity<ApiResponse> updateUserInfo(HttpServletRequest req,@Valid @RequestBody 
//			Map<String, Object> map 
			UserDto dto
			) throws Exception {
		int result = userService.updateUserInfo(dto);
		
		if(result == 1) {	
			return ApiResponse.ok();
		}else if(result == 0){	//	update 갯수: 0
			return ApiResponse.error(ApiResultCode.UPDATE_FAIL);
		}else {
			return ApiResponse.error(ApiResultCode.UNKOWN_ERR);
		}
	}
	
	/**
	 * @apiNote 회원 탈퇴(마이페이지)
	 * */
	@PostMapping("/v1/deleteUserInfo")
	public ResponseEntity<ApiResponse> deleteUserInfo(HttpServletRequest req,@Valid @RequestBody UserDto dto) throws Exception {
		int result = userService.deleteUserInfo(dto);
		if(result == 1) {	
			return ApiResponse.ok();
		}else if(result == 0){	//	update 갯수: 0
			return ApiResponse.error(ApiResultCode.UPDATE_FAIL);
		}else {
			return ApiResponse.error(ApiResultCode.UNKOWN_ERR);
		}
	}
	
	/**
	 * @apiNote 비밀번호 변경(마이페이지)
	 * */
	@PostMapping("/v1/updatePasswd")
	public ResponseEntity<ApiResponse> updatePasswd(HttpServletRequest req,@Valid @RequestBody UserDto dto) throws Exception {
		int result = userService.updatePasswd(dto);
		if(result == 1) {	
			return ApiResponse.ok();
		}else if(result == 0){	//	update 갯수: 0
			return ApiResponse.error(ApiResultCode.UPDATE_FAIL);
		}else {
			return ApiResponse.error(ApiResultCode.UNKOWN_ERR);
		}
	}
	
	/**
	 * @apiNote 마이페이지 - 담당자조회
	 * */
	@PostMapping("/v1/searchDoctor")
	public ResponseEntity<ApiResponse> searchDoctor(@RequestBody UserDto dto){
		Map<String, Object> result = new HashMap<>();
		List<Map<String, Object>> list = userService.searchDoctor(dto);
		if(list.size() == 0) {
			return ApiResponse.error(ApiResultCode.RESULT_IS_EMPTY);
		}else {
			result.put("list", list);
			return ApiResponse.ok(result);
		}
	}

	/**
	 * @apiNote 마이페이지 - 보호자 조회
	 * */
	@PostMapping("/v1/searchParent")
	public ResponseEntity<ApiResponse> searchParent(@RequestBody UserDto dto){
		Map<String, Object> result = new HashMap<>();
		List<Map<String, Object>> list = userService.searchParent(dto);
		if(list.size() == 0) {
			return ApiResponse.error(ApiResultCode.RESULT_IS_EMPTY);
		}else {
			result.put("list", list);
			return ApiResponse.ok(result);
		}
	}
	
	/**
	 * @apiNote 사용자 목록 조회 - 담당자, 보호자, 사용자 조회
	 * */
	@RequestMapping("/v1/list")
	public ResponseEntity<ApiResponse> userList(UserDto dto, @RequestBody Map<String,Object> map) throws Exception{
		
		dto.setUserRoleFk((String) map.get("userRoleFk"));
		dto.setPageIndex((int) map.get("pageIdx"));
		dto.setPageOffset((int) map.get("pageOffset"));
//		dto.setPageSize(10);
		dto.setSearchKeyword((String) map.get("searchKeyword"));
		
		if(map.get("userRoleFk").equals("3")) {
			return ApiResponse.ok(userService.doctorList(dto));
		}else if(map.get("userRoleFk").equals("2")) {
			return ApiResponse.ok(userService.parentList(dto));
		}else if(map.get("userRoleFk").equals("1")) {
			dto.setUserId((String) map.getOrDefault("userId", null));
			return ApiResponse.ok(userService.userList(dto));
		}else {
			return ApiResponse.error(ApiResultCode.UNKOWN_ERR);
		}
	}
	
	@PostMapping("/v1/healthUserList")
	public ResponseEntity<ApiResponse> searchHealthUserList(@RequestBody Map<String,Object> map) {
		return ApiResponse.ok(userService.searchHealthUserList(map));
	}


	@PostMapping("/v1/drguardianList")
	public ResponseEntity<ApiResponse> drguardianList(UserDto dto) {
		return ApiResponse.ok(userService.searchdrguardianList(dto));
	}

	@PostMapping("/v1/manage_userList")
	public ResponseEntity<ApiResponse> roleuserList(@RequestBody Map<String,Object> map) {
		UserDto dto = new UserDto();
		dto.setUserId((String) map.get("userId"));
		dto.setUserRoleFk((String) map.get("userRoleFk"));
		dto.setPageIndex((int) map.get("pageIdx"));
		dto.setPageOffset((int) map.get("pageOffset"));
//		dto.setPageSize(10);
		dto.setSearchKeyword((String) map.get("searchKeyword"));

		return ApiResponse.ok(userService.manage_userList(dto));
	}

	@PostMapping("/v1/search_userList")
	public ResponseEntity<ApiResponse> searchuserList(@RequestBody Map<String,Object> map) {
		return ApiResponse.ok(userService.searchuserList(map));
	}
}
