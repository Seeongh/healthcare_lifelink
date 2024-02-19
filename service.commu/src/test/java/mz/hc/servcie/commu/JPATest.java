package mz.hc.servcie.commu;

import mz.hc.service.domain.Community;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.persistence.EntityManager;

@SpringBootTest
public class JPATest {

    @Autowired
    EntityManager em;

    @Test
    public void 게시판쓰기() throws Exception {
        //given
        em.clear();

        Community commu = new Community();
        User user = new User();
        user.setUserNm("ash");
        commu.setUser(user);
        commu.setContent("This is test board");

        //when
        em.persist(commu);
        em. close();

        //then

     }
}
