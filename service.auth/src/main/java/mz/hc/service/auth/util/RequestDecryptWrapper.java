package mz.hc.service.auth.util;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

import javax.servlet.ReadListener;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

import org.apache.commons.io.IOUtils;
import org.springframework.util.ObjectUtils;

public class RequestDecryptWrapper extends HttpServletRequestWrapper {
	private final Charset encoding;
    private String decodingBody;
    private byte[] rawData;

    public RequestDecryptWrapper(HttpServletRequest request) {
        super(request);
        String charEncoding = request.getCharacterEncoding();

        this.encoding = ObjectUtils.isEmpty(charEncoding) ? StandardCharsets.UTF_8 : Charset.forName(charEncoding);

        try {
            InputStream inputStream = request.getInputStream();
            rawData = IOUtils.toByteArray(inputStream);

            if (ObjectUtils.isEmpty(rawData)) {
                return;
            }
            this.decodingBody = AES256Util.decrypt(new String(rawData, StandardCharsets.UTF_8));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public ServletInputStream getInputStream() {
        final ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(decodingBody == null ? "".getBytes(encoding) : decodingBody.getBytes(encoding));
        return new ServletInputStream() {
            @Override
            public boolean isFinished() {
                return false;
            }

            @Override
            public boolean isReady() {
                return false;
            }

            @Override
            public void setReadListener(ReadListener listener) {
            }

            @Override
            public int read() {
                return byteArrayInputStream.read();
            }
        };
    }

    @Override
    public BufferedReader getReader() {
        return new BufferedReader(new InputStreamReader(this.getInputStream()));
    }
}
