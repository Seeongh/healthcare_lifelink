package mz.hc.service.auth.service;

import mz.hc.service.auth.dto.*;
import org.springframework.stereotype.Service;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

public interface UserService {
     /* 로그인
     * */
    public Map<Object, Object> signin(SigninDto user) throws Exception;

    /**
     * 회원가입
     * @return
     * */
    public int signup(SignupDto user) throws Exception;

    /**
     * ID 중복체크
     * */
    public boolean duplicateId(UserDto dto);

    /**
     * Email 중복체크
     * */
    public boolean duplicateEmail(UserDto dto);
    /**
     * 로그아웃
     * */
    public void logout(String token) throws Exception;

    /**
     * 토큰 리프레쉬
     * */
    public JwtTokenDto refresh(String accessToken, String refreshToken) throws Exception;

    public List<Map<String,Object>> searchDoctor(UserDto dto);

    public List<Map<String, Object>> searchParent(UserDto dto);

    public int insUserAuth(@Valid SignupDto user);

    public int insDoctorMapping(@Valid SignupDto user);

    public int insGuardianMapping(@Valid SignupDto user);

    public Map<String, Object> findUserId(FindDto dto);

    public Map<String, Object> findUserPw(FindDto dto);

    public int updateUserPw(FindDto dto);
}
