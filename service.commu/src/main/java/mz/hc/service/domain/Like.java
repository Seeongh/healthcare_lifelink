package mz.hc.service.domain;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class Like {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long likeId;

    @Column(name = "commu_id")
    @ManyToOne
    Long commuId; //1:1 관계

    @Column(name = "user_id")
    @ManyToOne
    Long userId;

}
