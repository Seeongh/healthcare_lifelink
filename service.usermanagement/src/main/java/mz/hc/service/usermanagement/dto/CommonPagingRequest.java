package mz.hc.service.usermanagement.dto;

import lombok.Data;

@Data
public class CommonPagingRequest {

    private int pageIdx = 1;
    private int pageSize = 10;
    private int pageOffset;
    
    private String startDt; // 조회기간 시작
    private String endDt; // 조회기간 종료
    private String searchWrd; //검색어
    private String searchCondition; //검색타입

    public void setPageIdx(int pageIdx) {
        if(pageIdx < 1) {
            this.pageIdx = 1;
        } else {
            this.pageIdx = pageIdx;
        }
    }
    public void setPageSize(int pageSize) {
        if(pageSize < 1) {
            this.pageSize = 10;
        } else {
            this.pageSize = pageSize;
        }
    }
    public void setPageOffset(int pageOffset) {
        this.pageOffset = pageOffset;
    }

    public int getPageIdx() {
        return pageIdx;
    }
    public int getPageSize() {
        return pageSize;
    }
    public int getPageOffset() {
        this.pageOffset = (this.pageIdx - 1) * this.pageSize;
        return this.pageOffset;
    }

}
