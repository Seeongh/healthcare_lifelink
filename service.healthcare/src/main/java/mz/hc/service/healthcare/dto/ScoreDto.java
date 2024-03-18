package mz.hc.service.healthcare.dto;

import lombok.Getter;
import lombok.Setter;

//점수계산에 사용되는 dto
@Getter @Setter
public class ScoreDto {

    private String userId;
    private String scoreField;
    private double userScore;
    private String date;
}
