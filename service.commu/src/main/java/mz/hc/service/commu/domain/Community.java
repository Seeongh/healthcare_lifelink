package mz.hc.service.commu.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity //이클래스를 테이블과 매핑
@Getter @Setter
@Table(name = "health_community")
public class Community {

    @Id @GeneratedValue //기본키에 매핑, @Access (AccessType.FIELD) 생략됨
    @Column(name = "community_id")
    private Long commuId;

    @Column(length = 100000000)
    @Lob //대용량 데이터
    private String content;

    @Temporal(TemporalType.TIMESTAMP) //날짜 시간
    private Date regDate;

    @Column()
    private String heartrate;

    @Column()
    private String temperature;

    @Column()
    private String bloodpress;

    //내장타입

    @Enumerated(EnumType.STRING) //enum 을 String으로 저장
    private DiseaseCategory category;

    @Column(name = "user_seq")
    String userSeq;
//    @ManyToOne(fetch = FetchType.EAGER)
//    @JoinColumn(name="user_seq") //실제디비엔 user_seq 칼럼명으로 들어감
//    private Usermng user;
    // DB는 오브젝트를 저장 할 수 없다.FK는 자바는 오브젝트를 저장할 수 없다.

}
