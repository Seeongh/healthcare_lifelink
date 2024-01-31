package mz.hc.service.repository;

import lombok.RequiredArgsConstructor;
import mz.hc.service.domain.Community;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;

@Repository
@RequiredArgsConstructor
public class CommunityRepository {

    private final EntityManager em;

    /**
     * 커뮤니티 보드 글쓰기
     * @param community
     */
    public void writeBoard(Community community) {
        em.persist(community);
    }

}
