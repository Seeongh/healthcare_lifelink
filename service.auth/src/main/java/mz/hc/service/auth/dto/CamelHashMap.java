package mz.hc.service.auth.dto;

import java.util.HashMap;

import com.google.common.base.CaseFormat;


/**
 * HashMap key
 * Snake Case => Camel Case 변환
 * 
 */
public class CamelHashMap extends HashMap<Object, Object>{

	private static final long serialVersionUID = 1L;
	
	public Object put(Object key, Object value) {
		return super.put(CaseFormat.UPPER_UNDERSCORE.to(CaseFormat.LOWER_CAMEL, (String) key), value);
	}
}
