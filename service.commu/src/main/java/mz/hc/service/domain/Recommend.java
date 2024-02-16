package mz.hc.service.domain;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class Recommend {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long RecommendId;

    @Column(name = "community_Id")
    @ManyToOne
    Long commuId; //1:1 관계

    @Column(name = "user_Id")
    @ManyToOne
    Long userId;

}

