package mz.hc.service.domain;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class Recommend {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long RecommendId;

    @Column(name = "community_id")
    @ManyToOne(fetch = FetchType.LAZY)
    Long commuId; //1:1 관계

    @Column(name = "user_seq")
    Long userSep;

}

