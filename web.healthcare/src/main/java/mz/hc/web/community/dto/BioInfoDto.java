package mz.hc.web.community.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter @Getter
public class BioInfoDto {
    String heartrate;
    String temperature;
    String stress;
    String bloodpressMax;
    String bloodpressMin;
    String gender;
    String ageAvg;
    String userNm;
//    String gender;
//    String Age;

    public BioInfoDto(String heartrate, String temperature, String stress, String bloodpressMax, String bloodpressMin, String gender, String ageAvg, String userNm) {
        this.heartrate = heartrate;
        this.temperature = temperature;
        this.stress = stress;
        this.bloodpressMax = bloodpressMax;
        this.bloodpressMin = bloodpressMin;
        this.gender = gender;
        this.ageAvg = ageAvg;
        this.userNm = userNm;

    }
}
