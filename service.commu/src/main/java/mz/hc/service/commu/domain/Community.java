package mz.hc.service.commu.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity(name = "health_community") //이클래스를 테이블과 매핑
@Getter @Setter
@Table(name = "health_community")
public class Community {

    @Id @GeneratedValue //기본키에 매핑, @Access (AccessType.FIELD) 생략됨
    @Column(name = "community_seq")
    private int commuSeq;

    @Column(length = 100000)
    private String content;

    @Temporal(TemporalType.TIMESTAMP) //날짜 시간
    @Column(name = "reg_date")
    private Date regDate;

    @Column()
    private int heartrate;

    @Column()
    private double temperature;

    @Column()
    private double bloodpress;

    @Column()
    private int smoking;

    @Column()
    private int drinking;

    @Column()
    private int exercise;

    //내장타입

    @Column()
    private int age;

    @Column(name = "user_id")
    String userId;

    @Column
    String userNm;

    @Column(name = "body_age")
    int bodyAge;
//    @ManyToOne(fetch = FetchType.EAGER)
//    @JoinColumn(name="user_seq") //실제디비엔 user_seq 칼럼명으로 들어감
//    private Usermng user;
    // DB는 오브젝트를 저장 할 수 없다.FK는 자바는 오브젝트를 저장할 수 없다.
    @PrePersist
    public void beforePersist() {
        this.regDate = new Date(); // 현재 시간을 설정합니다.
    }
}
