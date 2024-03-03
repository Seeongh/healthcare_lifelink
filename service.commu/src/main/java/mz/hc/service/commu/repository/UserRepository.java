package mz.hc.service.commu.repository;

import mz.hc.service.commu.domain.Usermng;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Repository
public class UserRepository {
    @PersistenceContext
    private EntityManager em;

    public Usermng findOne(int userId) { return em.find(Usermng.class, userId);}
}
