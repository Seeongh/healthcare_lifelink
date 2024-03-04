package mz.hc.service.commu.repository;

import lombok.RequiredArgsConstructor;
import mz.hc.service.commu.domain.Community;
import mz.hc.service.commu.domain.Usermng;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceException;
import java.util.List;
import java.util.Map;

@Repository
public class CommunityRepository {

    @PersistenceContext //SPRINGDL ENtitymanager만들어서 주입해줌 @AutoWired로 변경가능-> REquiredArgsConstruct로 변경가능
    private EntityManager em;

    /**
     * 커뮤니티 보드 글쓰기
     * @param community
     */
    public int writeBoard(Community community) {
        try {
            em.persist(community);
            return 1;
        }
        catch(PersistenceException e) {
            // 실패
            e.printStackTrace();
            return 0;
        }
    }

    public Community findBoard(int commuSeq) {
        Community community = em.find(Community.class, commuSeq);
        return community;
    }

    public List<Community> findBoardList(Map<String,Object> map) {
        String jpql = "select c from health_community h where c.age/10 ="+ Integer.parseInt((String) map.get("age"))/10;
        return em.createQuery(jpql, Community.class)
                .getResultList();
    }

}
