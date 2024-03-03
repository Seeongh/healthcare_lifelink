package mz.hc.service.commu.domain;

import lombok.Data;

import javax.persistence.*;

//@Entity
//@Data
public class Recommend {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long RecommendId;

    @JoinColumn(name = "community_id")
    @ManyToOne(fetch = FetchType.LAZY)
    Community commu; //1:1 관계

    @JoinColumn(name = "user_seq")
    @ManyToOne
    Usermng user;

}

