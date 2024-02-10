package mz.hc.service.domain;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

public class Like {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long likeId;

    @Column(name = "commu_id")
    Long commuId; //1:1 관계

    @Column(name = "user_id")
    Long userId;

    int likeCnt;
}
