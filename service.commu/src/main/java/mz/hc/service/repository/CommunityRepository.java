package mz.hc.service.repository;

import lombok.RequiredArgsConstructor;
import mz.hc.service.domain.Community;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceException;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class CommunityRepository {

    private final EntityManager em;

    /**
     * 커뮤니티 보드 글쓰기
     * @param community
     */
    public int writeBoard(Community community) {
        try {
            em.getTransaction().begin();
            em.persist(community);
            em.getTransaction().commit();
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
        return em.createQuery("select i from Community c", Community.class)
                .getResultList();
    }

}
