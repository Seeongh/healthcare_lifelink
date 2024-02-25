package mz.hc.service.commu.controller;

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
    public ResponseEntity<ApiResponse> writeBoard(@RequestBody Community community) {
        int result = communityService.writeBoard(community);
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
    public ResponseEntity<ApiResponse> findBoard(Long commuId) {
        return ApiResponse.ok(communityService.findBoard(commuId));
    }

    /**
     * community 게시글 전체 보기
     * @return
     */
    @GetMapping("findBoardlist")
    public ResponseEntity<ApiResponse> findBoardList() {

        List<Community> items = communityService.findBoardList();
        return ApiResponse.ok(items);
    }

    @PostMapping("updateBoard")
    public ResponseEntity<ApiResponse> updateBoard(@ModelAttribute Community community ) {
        Community updatedCommu = communityService.findBoard(community.getCommuId());
        updatedCommu.setContent(community.getContent());
        updatedCommu.setCategory(community.getCategory());
        communityService.writeBoard(updatedCommu);

        return ApiResponse.ok(community);
    }
}
