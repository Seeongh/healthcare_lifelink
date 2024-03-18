package mz.hc.service.auth.dto;

import java.util.ArrayList;
import java.util.Map;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import org.json.simple.JSONArray;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@Builder
@NoArgsConstructor 
@AllArgsConstructor
public class SignupDto {
	
	private int userSeq;
	
	@NotEmpty @Size(max=30)
	private String userId;
	
	@NotEmpty 
	private String userPwEnc;
	
	@NotEmpty
	private String userNm;
	
	@NotEmpty 
	private String userRoleFk;
	
	@NotEmpty
	private String birthEnc;
	
	@NotEmpty
	private String telNumEnc;
	
	@NotEmpty
	private String email;
	
	private String deptNm;
	
	private int doctorSeq;
	
	private String doctorId;
	
	private String guardian;
	
	private int guardianSeq;
	
	private String guardianId;
	
	private float height;
	
	private float weight;
	
	private String gender;
	
	private String bloodType;

	private String imgFileName;
	private String agreementYn;
	private String userYn;

}
