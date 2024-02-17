package mz.hc.service.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity //이클래스를 테이블과 매핑
@Getter @Setter
@Table(name = "health_community")
public class Community {

    @Id @GeneratedValue //기본키에 매핑, @Access (AccessType.FIELD) 생략됨
    @Column(name = "communityId")
    private Long commuId;

    @Column(length = 100000000)
    @Lob //대용량 데이터
    private String content;

    @Temporal(TemporalType.TIMESTAMP) //날짜 시간
    private Date regDate;

    //내장타입

    @Enumerated(EnumType.STRING) //enum 을 String으로 저장
    private DiseaseCategory category;

    @ManyToOne
    @JoinColumn(name="userId") //실제디비엔 user_id 칼럼명으로 들어감
    private User user;
    // DB는 오브젝트를 저장 할 수 없다.FK는 자바는 오브젝트를 저장할 수 없다.

}
