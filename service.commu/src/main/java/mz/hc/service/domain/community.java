package mz.hc.service.domain;

import lombok.Getter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.util.Date;

@Entity //이클래스를 테이블과 매핑
@Getter
@Table(name = "health_community")
public class Community {

    @Id @GeneratedValue //기본키에 매핑
    @Column(name = "communityId")
    private Long commuId;

    @Column(length = 100000000)
    @Lob //대용량 데이터
    private String content;

    private Date regDate;

    //내장타입
    private DiseaseCategory category;

    @ManyToOne(fetch= FetchType.EAGER) //기본전략
    @JoinColumn(name="userId") //실제디비엔 user_id 칼럼명으로 들어감
    private User user;
    // DB는 오브젝트를 저장 할 수 없다.FK는 자바는 오브젝트를 저장할 수 없다.

}
