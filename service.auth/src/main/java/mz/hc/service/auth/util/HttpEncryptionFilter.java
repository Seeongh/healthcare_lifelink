package mz.hc.service.auth.util;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebFilter("/*")
public class HttpEncryptionFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {

        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        HttpServletResponse httpServletResponse = (HttpServletResponse) response;

        RequestDecryptWrapper requestDecryptWrapper = new RequestDecryptWrapper(httpServletRequest);
        ResponseEncryptWrapper responseEncryptWrapper = new ResponseEncryptWrapper(httpServletResponse);

        chain.doFilter(requestDecryptWrapper, responseEncryptWrapper);

        httpServletResponse.getOutputStream().write(responseEncryptWrapper.encryptResponse());
    }
}