package mz.hc.service.domain;

import javax.persistence.*;

@Entity
public class Recommend {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long RecommendId;

    @Column(name = "commu_id")
    @ManyToOne
    Long commuId; //1:1 관계

    @Column(name = "user_id")
    @ManyToOne
    Long userId;
    int recommendCnt;

}

