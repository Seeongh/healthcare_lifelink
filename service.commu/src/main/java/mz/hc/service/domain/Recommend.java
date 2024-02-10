package mz.hc.service.domain;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

public class Recommend {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long RecommendId;

    @Column(name = "commu_id")
    Long commuId; //1:1 관계

    @Column(name = "user_id")
    Long userId;
    int recommendCnt;

}

