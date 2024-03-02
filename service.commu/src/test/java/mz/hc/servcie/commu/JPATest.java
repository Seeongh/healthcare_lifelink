package mz.hc.servcie.commu;

import mz.hc.service.commu.domain.Community;
import mz.hc.service.commu.domain.Usermng;
import mz.hc.service.commu.service.CommunityService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.persistence.EntityManager;
import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest
public class JPATest {

    @Autowired
    EntityManager em;

    @Autowired
    CommunityService communityService;

    @Test
    public void 게시판쓰기() throws Exception {
        //given
        Community commu = new Community();
        Usermng user = new Usermng("1", "ASH");
        //user.setUserNm("ash");
        //commu.setUser(user);
        commu.setContent("This is test board");

        communityService.writeBoard(commu);
        //when
        //then

     }

     @Test
     public void 게시판수정() throws Exception {
         //given
         Community commu = new Community();
         Usermng user = new Usermng("1", "ASH");
         //user.setUserNm("ash");
         //commu.setUser(user);
         commu.setContent("This is test board");

         communityService.writeBoard(commu);

         em.flush();

         Community board = communityService.findBoard(1L);

         //when

         board.setContent("This is update board");

         //then

      }

      @Test
      public void 불러오기() throws Exception {
          //given
          Community commu = new Community();
          commu.setContent("비밀입니다");
          commu.setAge("50");
          commu.setBloodpress("105");

          communityService.writeBoard(commu);
          //when
          List<Community> List = communityService.findBoardList();
          //then
          System.out.println("List = " + List);

       }
}
