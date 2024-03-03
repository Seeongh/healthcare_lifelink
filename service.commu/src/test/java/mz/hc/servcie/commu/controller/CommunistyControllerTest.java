package mz.hc.servcie.commu.controller;

import mz.hc.service.commu.controller.CommunityController;
import mz.hc.service.commu.domain.Community;
import mz.hc.service.commu.service.CommunityService;
import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

@ExtendWith(SpringExtension.class)
@WebMvcTest(CommunityController.class)
public class CommunistyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    CommunityService communityService;

    @Test
    public void 리스트불러오기() throws Exception {
        //given
        Community commu = new Community();
        commu.setContent("비밀입니다");
       // commu.setAge("50");
        //commu.setBloodpress("105");

        communityService.writeBoard(commu);
        //when
        List<Community> List = communityService.findBoardList();
        //then
        System.out.println("List = " + List);
     }
}
