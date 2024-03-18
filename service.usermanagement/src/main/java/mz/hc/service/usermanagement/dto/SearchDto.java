package mz.hc.service.usermanagement.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter @Setter
public class SearchDto {
    String keyword;
    String category;
    String searchtype;
}
