package mz.hc.service.auth.util;

import java.nio.charset.StandardCharsets;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import lombok.extern.slf4j.Slf4j;

/**
 * <strong>AES256 유틸</Strong>
 * */
@Slf4j
public class
AES256Util {
	
	private AES256Util() { /* 생성금지 */ }
	
	private static final byte[] KEY = {
		0x58, 0x32, 0x4E, 0x6E, 0x6C, 0x63, 0x70, 0x70,
		0x6E, 0x74, 0x79, 0x4F, 0x45, 0x46, 0x61, 0x47,
		0x50, 0x37, 0x79, 0x36, 0x63, 0x35, 0x23, 0x39,
		0x72, 0x58, 0x79, 0x51, 0x77, 0x54, 0x30, 0x67
	};
	private static final byte[] IV = {
			0x40, 0x32, 0x59, 0x36, 0x4E, 0x69, 0x59, 0x53, 
			0x67, 0x42, 0x75, 0x55, 0x4D, 0x65, 0x51, 0x6B
	};
	
	/** 암호화 */
	public static String encrypt(final String str) {
		try{
			SecretKey secretKey = new SecretKeySpec(KEY, "AES");
			Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
			cipher.init(Cipher.ENCRYPT_MODE, secretKey, new IvParameterSpec(IV));
			byte[] encrypted = cipher.doFinal(str.getBytes(StandardCharsets.UTF_8));
			
			return new String(Base64.getEncoder().encode(encrypted));
		}catch (NoSuchAlgorithmException | NoSuchPaddingException | InvalidAlgorithmParameterException 
				| InvalidKeyException | BadPaddingException | IllegalBlockSizeException encE) {
			log.error("AES256 Encrypt Error : ", encE);
		}
		catch (Exception e) {
			log.error("Unknown error : ", e);
		}
		return "";
	}
	
	/** 복호화 */
	public static String decrypt(final String str) {
		try{
			SecretKey secretKey = new SecretKeySpec(KEY, "AES");
			Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
			cipher.init(Cipher.DECRYPT_MODE, secretKey, new IvParameterSpec(IV));
			byte[] decrypted = Base64.getDecoder().decode(str.getBytes(StandardCharsets.UTF_8));
			
			return new String(cipher.doFinal(decrypted), StandardCharsets.UTF_8);
		}
		catch (NoSuchAlgorithmException | NoSuchPaddingException | InvalidAlgorithmParameterException 
				| InvalidKeyException | BadPaddingException | IllegalBlockSizeException decE) {
			log.error("AES256 Decrypt Error : ", decE);
		}
		catch (Exception e) {
			log.error("Unknown error : ", e);
		}
		return "";
	}
}
