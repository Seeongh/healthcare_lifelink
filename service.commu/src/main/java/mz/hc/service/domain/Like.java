package mz.hc.service.domain;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class Like {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long likeId;

    @Column(name = "communityId")
    @ManyToOne
    Long commuId; //1:1 관계

    @Column(name = "userId")
    @ManyToOne
    Long userId;

}
