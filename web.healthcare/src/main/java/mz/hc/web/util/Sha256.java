package mz.hc.web.util;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

public class Sha256 {

	private Sha256() {}

	public static String encryt(String passwd) throws NoSuchAlgorithmException{
		String hex = "";
		// "SHA1PRNG"은 알고리즘 이름
		SecureRandom random = SecureRandom.getInstance("SHA1PRNG");
		byte[] bytes = new byte[16];
		random.nextBytes(bytes);
		// SALT 생성
		String salt = new String(Base64.getEncoder().encode(bytes));
		String rawAndSalt = passwd+salt;
		
//		System.out.println("raw : "+passwd);
//		System.out.println("salt : "+salt);
		
		MessageDigest md = MessageDigest.getInstance("SHA-256");
		// 평문 암호화
		md.update(passwd.getBytes());
		hex = String.format("%064x", new BigInteger(1, md.digest()));
//		System.out.println("raw의 해시값 : "+hex);
		
//		// 평문+salt 암호화
//		md.update(rawAndSalt.getBytes());
//		hex = String.format("%064x", new BigInteger(1, md.digest()));
//		System.out.println("raw+salt의 해시값 : "+hex);
		
		return hex;
	}
	
	public static String passwdCheck(String passwd,String salt) throws NoSuchAlgorithmException {
		String hex = "";
		MessageDigest md = MessageDigest.getInstance("SHA-256");
		// 평문 암호화
		md.update(passwd.getBytes());
		hex = String.format("%064x", new BigInteger(1, md.digest()));
//		System.out.println("raw의 해시값 : "+hex);
		
		return passwd;
	}
}
