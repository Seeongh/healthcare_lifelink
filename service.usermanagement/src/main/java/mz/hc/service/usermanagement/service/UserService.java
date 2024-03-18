package mz.hc.service.usermanagement.service;

import mz.hc.service.usermanagement.dto.SearchDto;
import mz.hc.service.usermanagement.dto.UserDto;
import mz.hc.service.usermanagement.dto.UserhealthDto;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

public interface UserService {
    // 사용자 목록 조회 - 사용자
    public Object userList(UserDto dto);
    // 사용자 목록 조회 - 보호자
    public Object parentList(UserDto dto);

    // 사용자 목록 조회 - 담당자
    public Object doctorList(UserDto dto);

    public Object manage_userList(UserDto dto);

    public List<Map<String,Object>> searchuserList(Map<String, Object> map);

    @SuppressWarnings("unchecked")
    public Map<String, Object> userInfo(UserDto dto) throws Exception;

    public int updateUserInfo(@Valid UserDto dto) ;
    public int deleteUserInfo(@Valid UserDto dto) ;
    public int updatePasswd(@Valid UserDto dto) ;
    // 마이페이지 - 담당자 조회
    public List<Map<String, Object>> searchDoctor(UserDto dto);
    // 마이페이지 - 보호자 조회
    public List<Map<String, Object>> searchParent(UserDto dto);
    // 건강정보 - 조회 가능 유저 목록 조회
    public List<Map<String, Object>> searchHealthUserList(Map<String, Object> map);

    //유저 id로 의사, 보호자 리스트 조회
    public List<Map<String, Object>> searchdrguardianList(UserDto dto);

    public Map<String,Object> ageavgHealthinfo(UserhealthDto dto);
}
