package mz.hc.web.util;

import java.net.URL;
import java.util.Date;
import java.util.concurrent.TimeUnit;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.squareup.okhttp.MediaType;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.RequestBody;
import com.squareup.okhttp.Response;

@Component
@Slf4j
public class GatewayUtils {
	
	// API 버전 ex)/v1
	private static String version;
	
	private static String authUri;
	private static String secret;
	
	// API 만료시간 (초)
	private static int timeout;
	
	/**
     * @param SECRET = TOKEN SECRET KEY
     * @param AUTHURI = Gateway API 인증 URI 
     * @param VERSION = Gateway API 버전
     * @param TIMEOUT = API REQUEST TIMEOUT (SECONDS) 
     */
	public GatewayUtils(@Value("${token.secret}") String SECRET
			,@Value("${gateway.auth.uri}") String AUTHURI
			,@Value("${gateway.version}") String VERSION
			,@Value("${request.timeout}") int TIMEOUT){
		secret = SECRET;
		authUri = AUTHURI;
		version = VERSION;
		timeout = TIMEOUT;
	}

	/**
	 * @apiNote GateWay API get 호출 메서드
     * @param url = extends SearchVO 한 VO 객체
     * @param bodyStr = httpBody영역(type:String)
     * @return API 호출 result(type:String)
     */
	public static Object get(URL url, String tokenKey) throws Exception{
	    OkHttpClient client = new OkHttpClient();
	    client.setConnectTimeout(timeout, TimeUnit.SECONDS);
		client.setReadTimeout(timeout, TimeUnit.SECONDS);
		client.setWriteTimeout(timeout, TimeUnit.SECONDS);
		
	    Request request = new Request.Builder()
	      .url(url)
	      .get()
	      .addHeader("accept", "application/json")
	      .addHeader("content-type", "application/json")
	      .addHeader("Authorization", "Bearer "+tokenKey)
	      .build();

	    Response response = client.newCall(request).execute();	    
	    
	    return response.body().string();
	}
	
	

	/**
	 * @apiNote GateWay API Post 호출 메서드(토큰이 있는 요청)
     * @param url = extends SearchVO 한 VO 객체
     * @param tokenKey = Access token 토큰 값
     * @param bodyStr = httpBody영역 type:String
     * @return API 호출 result(type:String)
     */
	@SuppressWarnings("deprecation")
	public  static Object post(URL url, String tokenKey, String bodyStr) throws Exception{
		OkHttpClient client = new OkHttpClient();
		client.setConnectTimeout(timeout, TimeUnit.SECONDS);
		client.setReadTimeout(timeout, TimeUnit.SECONDS);
		client.setWriteTimeout(timeout, TimeUnit.SECONDS);
		
	    MediaType mediaType = MediaType.parse("application/json");
	    
	    RequestBody body = !bodyStr.isEmpty()? RequestBody.create(mediaType, bodyStr) : null; 

	    Request request = new Request.Builder()
	      .url(url)
	      .post(body)
	      .addHeader("accept", "application/json")
	      .addHeader("content-type", "application/json")
	      .addHeader("Authorization", "Bearer "+tokenKey)
	      .build();

		log.info("ash request detail " + request.toString());
	    Response response = client.newCall(request).execute();
	    
	    return response.body().string();
	}
	
	/**
	 * @apiNote GateWay API Post 호출 메서드(토큰이 없는 요청)
     * @param url = extends SearchVO 한 VO 객체
     * @param bodyStr = httpBody영역 (type:String)
     * @return API 호출 result(type:String) 
     */
	@SuppressWarnings("deprecation")
	public static Object post(URL url, String bodyStr) throws Exception{
		OkHttpClient client = new OkHttpClient();
		client.setConnectTimeout(timeout, TimeUnit.SECONDS);
		client.setReadTimeout(timeout, TimeUnit.SECONDS);
		client.setWriteTimeout(timeout, TimeUnit.SECONDS);
		
	    MediaType mediaType = MediaType.parse("application/json");
	    
	    RequestBody body = !bodyStr.isEmpty()? RequestBody.create(mediaType, bodyStr) : null; 

	    Request request = new Request.Builder()
	      .url(url)
	      .post(body)
	      .addHeader("accept", "application/json")
	      .addHeader("content-type", "application/json")
	      .build();
	    
	    Response response = client.newCall(request).execute();
	    
	    return response.body().string();
	}
	
	/**
	 * @apiNote GateWay API 토큰 유효시간 체크 및 경과 시 재발급 메서드
     * @param session = 요청한 controller session 사용 및 반환을 위함.
     * @param res = 요청한 controller request 사용 및 반환을 위함.
     * @return AccessToken(type:String)
     */
	@SuppressWarnings("deprecation")
	public static String tokenCheck(HttpSession session , HttpServletResponse res) throws Exception {
		String acToken = (String) session.getAttribute("acToken");
		String rfToken = (String) session.getAttribute("rfToken");
		
		JwtTokenUtils jwtTokenUtils = new JwtTokenUtils(secret);
		JSONObject jwt = new JSONObject(jwtTokenUtils.parseClaims(acToken));
		
		// 토큰 유효기간
		Date exp = new Date((Integer) jwt.get("exp")*1000L);
		
		// 현재 시간
		Date now = new Date();
		
		// 만료된 JWT토큰 => accessToken 토큰 재발급 
		if(!exp.after(now)) {
			if(acToken != null && !acToken.isEmpty()) {	// acToken 재발급
				OkHttpClient client = new OkHttpClient();
				client.setConnectTimeout(timeout, TimeUnit.SECONDS);
				client.setReadTimeout(timeout, TimeUnit.SECONDS);
				client.setWriteTimeout(timeout, TimeUnit.SECONDS);
				
			    MediaType mediaType = MediaType.parse("application/json");
			    JSONObject obj = new JSONObject();
			    
			    RequestBody body = RequestBody.create(mediaType, obj.toString()); 
			    
			    Request request = new Request.Builder()
			      .url(authUri+version+"/refresh")
			      .post(body)
			      .addHeader("accept", "application/json")
			      .addHeader("content-type", "application/json")
			      .addHeader("Authorization", "Bearer "+acToken)
			      .addHeader("refreshToken", "Bearer "+rfToken)
			      .build();

			    Response response = client.newCall(request).execute();
			    
			    JSONObject result = new JSONObject(response.body().string());

			    if(!result.isNull("resultData") && !result.isEmpty()) {
			    	result = (JSONObject) result.get("resultData");

			    	if(!result.isNull("refreshToken") && !result.isEmpty()) {
			    			rfToken = (String) result.get("refreshToken");
				    		acToken = (String) result.get("accessToken");
				    		session.setAttribute("acToken", acToken);
							session.setAttribute("rfToken", rfToken);
			    	}
			    }
			}
		}
		return acToken;
	}
}
