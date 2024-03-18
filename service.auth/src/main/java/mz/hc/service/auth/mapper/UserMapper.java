package mz.hc.service.auth.mapper;

import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import mz.hc.service.auth.dto.FindDto;
import mz.hc.service.auth.dto.SigninDto;
import mz.hc.service.auth.dto.SignupDto;
import mz.hc.service.auth.dto.UserDto;

@Mapper
public interface UserMapper {
	
	UserDto signin(SigninDto user);
	
	void updateToken(@Param("userId") String userId, 
						@Param("userRoleFk") String userRole, 
						@Param("source") String source, 
						@Param("token") String token);
	
	String selectRefreshToken(@Param("userId") String userId, 
								@Param("userRoleFk") String userRole, 
								@Param("source") String source);
	
	int signup(SignupDto user);

	Object duplicateId(UserDto dto);

	List<Map<String,Object>> searchDoctor(UserDto dto);

	List<Map<String, Object>> searchParent(UserDto dto);

	Object duplicateEmail(UserDto dto);

	int insUserAuth(SignupDto user);

	int insDoctorMapping(@Valid SignupDto user);

	int insGuardianMapping(@Valid SignupDto user);

	Map<String, Object> findUserId(FindDto dto);

	Map<String, Object> findUserPw(FindDto dto);

	int updateUserPw(FindDto dto);

}
