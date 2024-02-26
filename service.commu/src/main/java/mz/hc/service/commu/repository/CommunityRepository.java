package mz.hc.service.commu.repository;

import lombok.RequiredArgsConstructor;
import mz.hc.service.commu.domain.Community;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceException;
import java.util.List;

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

    public Community findBoard(Long id) {
        Community community = em.find(Community.class, id);
        return community;
    }

    public List<Community> findBoardList() {
        return em.createQuery("select c from health_community c", Community.class)
                .getResultList();
    }

}
