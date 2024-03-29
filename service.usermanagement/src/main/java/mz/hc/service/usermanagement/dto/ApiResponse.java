package mz.hc.service.usermanagement.dto;

import org.springframework.http.ResponseEntity;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class ApiResponse {
	
    private String resultCode;
    private String resultMessage;
    private Object resultData;
    
    
    public static ResponseEntity<ApiResponse> ok() {
        return response(ApiResultCode.SUCCESS.code, ApiResultCode.SUCCESS.message, null);
    }
    
    public static ResponseEntity<ApiResponse> ok(Object data) {
        return response(ApiResultCode.SUCCESS.code, ApiResultCode.SUCCESS.message, data);
    }
    
    public static ResponseEntity<ApiResponse> error(ApiResultCode errorCode) {
    	return response(errorCode.code, errorCode.message, null);
    }
    
    
    private static ResponseEntity<ApiResponse> response(String code, String message, Object data) {
        return ResponseEntity.ok(ApiResponse.builder()
                .resultCode(code)
                .resultMessage(message)
                .resultData(data)
                .build()
        );
    }
}
