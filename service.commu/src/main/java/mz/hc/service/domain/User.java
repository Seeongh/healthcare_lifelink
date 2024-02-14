package mz.hc.service.domain;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Id;

@Data
public class User {
    @Id
    @Column(name = "userId")
    Long userId;
    String userNm;
}
