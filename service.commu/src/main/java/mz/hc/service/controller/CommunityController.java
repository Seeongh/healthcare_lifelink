package mz.hc.service.controller;

import lombok.extern.slf4j.Slf4j;
import mz.hc.service.domain.Community;
import mz.hc.service.domain.dto.ApiResponse;
import mz.hc.service.domain.dto.ApiResultCode;
import mz.hc.service.service.CommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/community/v1/")
public class CommunityController {

    @Autowired
    CommunityService communityService;

    /**
     * 커뮤니티 보드 INSERT
     */

    @PostMapping("writeBoard")
    public ResponseEntity<ApiResponse> writeBoard(@RequestBody Community community) {
        int result = communityService.writeBoard(community);
        if(result == 1) {

            return ApiResponse.ok();
        }
        else {
            return ApiResponse.error(ApiResultCode.INSERT_FAIL);
        }
    }
}
