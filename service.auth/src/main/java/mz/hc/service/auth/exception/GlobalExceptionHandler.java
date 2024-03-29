package mz.hc.service.auth.exception;

import javax.naming.AuthenticationException;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import mz.hc.service.auth.dto.ApiResponse;
import mz.hc.service.auth.dto.ApiResultCode;


@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler({MethodArgumentNotValidException.class})
    public ResponseEntity<ApiResponse> paramValidErr(MethodArgumentNotValidException exception) {
		exception.printStackTrace();
        return ApiResponse.error(ApiResultCode.PARAM_VALID_ERR);
    }
	
	@ExceptionHandler({DuplicateKeyException.class})
	public ResponseEntity<ApiResponse> duplicateKeyErr(Exception exception) {
		exception.printStackTrace();
		return ApiResponse.error(ApiResultCode.DUPLICATE_KEY_ERR);
	}
	
	@ExceptionHandler({AuthenticationException.class})
	public ResponseEntity<ApiResponse> authErr(Exception exception) {
		exception.getStackTrace();
		return ApiResponse.error(ApiResultCode.AUTH_ERR);
	}
	
	@ExceptionHandler({ExpiredJwtException.class})
	public ResponseEntity<ApiResponse> expJwtTokenErr(Exception exception) {
		exception.getStackTrace();
		return ApiResponse.error(ApiResultCode.EXP_JWT_TOKEN_ERR);
	}
	
	@ExceptionHandler({io.jsonwebtoken.security.SecurityException.class, MalformedJwtException.class, UnsupportedJwtException.class})
	public ResponseEntity<ApiResponse> invalidJwtTokenErr(Exception exception) {
		exception.getStackTrace();
		return ApiResponse.error(ApiResultCode.INVALID_JWT_TOKEN_ERR);
	}
	
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiResponse> unkownErr(Exception exception) {
		exception.printStackTrace();
		return ApiResponse.error(ApiResultCode.UNKOWN_ERR);
	}
	
	

}
