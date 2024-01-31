package mz.hc.service.domain;

import lombok.Getter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.Date;

@Entity
@Getter
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
