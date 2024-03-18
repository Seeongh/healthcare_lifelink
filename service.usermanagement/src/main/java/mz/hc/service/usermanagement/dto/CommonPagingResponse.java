package mz.hc.service.usermanagement.dto;

import lombok.Builder;
import lombok.Data;
import mz.hc.service.usermanagement.util.PaginationInfo;

import java.util.List;

@Data
@Builder
public class CommonPagingResponse {

    private List<?> list;
    
    private int totalCount;
    private PaginationInfo paginationInfo;
}
