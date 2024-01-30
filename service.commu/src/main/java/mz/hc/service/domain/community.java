package mz.hc.servcie.domain;

import lombok.Getter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.Date;

@Entity
@Getter
public class community {

    @Id @GeneratedValue
    @Column(name = "commuId")
    private Long commuId;

    private String userNm;

    @Column(length = 100000000)
    private String content;
    private Date regDate;

    //내장타입
    private diseaseCategory category;
}
