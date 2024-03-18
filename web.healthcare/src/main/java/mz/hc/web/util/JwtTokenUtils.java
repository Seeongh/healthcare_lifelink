package mz.hc.web.util;

import java.security.Key;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenUtils {
	
	private final Key KEY;
	private final String SECRET;
	
	public JwtTokenUtils(@Value("${token.secret}") String secret) {
		this.SECRET = secret;
		byte[] keyBytes = Decoders.BASE64.decode(SECRET);
    	this.KEY = Keys.hmacShaKeyFor(keyBytes);
	}
    
    // 클레임 파서
    public Claims parseClaims(String accessToken) {
        try {
            return Jwts.parserBuilder().setSigningKey(KEY).build().parseClaimsJws(accessToken).getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }
}
