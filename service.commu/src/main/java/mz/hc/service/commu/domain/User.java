package mz.hc.service.commu.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity //이클래스를 테이블과 매핑
@Getter
@Table(name = "user_mng")
public class User {

    @Id
    @Column(name = "user_seq")
    String userSeq;

    @Column
    String userNm;
}
