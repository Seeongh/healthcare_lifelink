package mz.hc.service.domain;

import lombok.Getter;

import javax.persistence.*;
import java.util.Date;

@Entity //
@Getter
@Table(name = "community")
public class Community {

    @Id @GeneratedValue
    @Column(name = "communityId")
    private Long commuId;

    private String userNm;

    @Column(length = 100000000)
    private String content;
    private Date regDate;

    //내장타입
    private DiseaseCategory category;
}
