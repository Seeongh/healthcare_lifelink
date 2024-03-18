package mz.hc.service.auth.dto;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@Builder
@NoArgsConstructor 
@AllArgsConstructor
public class SigninDto {
	
	@NotEmpty @Size(max=30)
	private String userId;
	
	@NotEmpty
	private String userPwEnc;
	
//	@NotEmpty
	private String userRoleFk;
	
	@NotEmpty
	private String source;
}
