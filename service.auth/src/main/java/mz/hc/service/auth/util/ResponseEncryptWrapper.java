package mz.hc.service.auth.util;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

import javax.servlet.ServletOutputStream;
import javax.servlet.WriteListener;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

public class ResponseEncryptWrapper extends HttpServletResponseWrapper {
    private final ByteArrayOutputStream output;

    public ResponseEncryptWrapper(HttpServletResponse response) {
        super(response);
        output = new ByteArrayOutputStream();
    }

    @Override
    public ServletOutputStream getOutputStream() throws IOException {
        return new ServletOutputStream() {
            @Override
            public boolean isReady() {
                return false;
            }

            @Override
            public void setWriteListener(WriteListener listener) {

            }

            @Override
            public void write(int b) throws IOException {
                output.write(b);
            }
        };
    }

    public byte[] encryptResponse() {
        String responseMessage = new String(output.toByteArray(), StandardCharsets.UTF_8);
        return AES256Util.encrypt(responseMessage).getBytes(StandardCharsets.UTF_8);
    }
}