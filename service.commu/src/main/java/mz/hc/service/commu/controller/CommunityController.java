package mz.hc.service.commu.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mz.hc.service.commu.domain.Community;
import mz.hc.service.commu.domain.dto.ApiResponse;
import mz.hc.service.commu.domain.dto.ApiResultCode;
import mz.hc.service.commu.service.CommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/community/v1/")
public class CommunityController {

    private final CommunityService communityService;

    /**
     * 커뮤니티 보드 INSERT
     */

    @PostMapping("writeBoard")
    public ResponseEntity<ApiResponse> writeBoard( @RequestBody Map<String,Object> map)   {
        log.info("ash get param " + map.toString());

        ObjectMapper obj = new ObjectMapper();
        int result=0;
        Community community = obj.convertValue(map, Community.class);
        result = communityService.writeBoard(community);

        if(result == 1) {

            return ApiResponse.ok();
        }
        else {
            return ApiResponse.error(ApiResultCode.INSERT_FAIL);
        }
    }

    /**
     * community 게시글 상세보기
     * @param commuId
     * @return
     */
    @PostMapping("findBoard")
    public ResponseEntity<ApiResponse> findBoard(int commuSeq) {
        return ApiResponse.ok(communityService.findBoard(commuSeq));
    }

    /**
     * community 게시글 전체 보기
     * @return
     */
    @PostMapping("findBoardlist")
    public ResponseEntity<ApiResponse> findBoardList(@RequestBody Map<String,Object> map) {

        List<Community> items = communityService.findBoardList(map);
        return ApiResponse.ok(items);
    }

    @PostMapping("updateBoard")
    public ResponseEntity<ApiResponse> updateBoard(@ModelAttribute Community community ) {
        Community updatedCommu = communityService.findBoard(community.getCommuSeq());
        updatedCommu.setContent(community.getContent());
        //updatedCommu.setCategory(community.getCategory());
        communityService.writeBoard(updatedCommu);

        return ApiResponse.ok(community);
    }
}
