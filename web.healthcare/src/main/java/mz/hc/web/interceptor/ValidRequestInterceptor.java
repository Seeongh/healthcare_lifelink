package mz.hc.web.interceptor;

@Slf4j
public class ValidRequestInterceptor implements HandlerInterceptor{
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse resonse, Object handler) throws Exception {
        HttpSession session = request.getSession();

        if(session.getAttribute("acToken") == null) {	// 토큰 값 없을때
            return response.sendRedirect("/user/signin"); // 로그인 안되어 있는 경우 진입 안됨
        }
        
        return true; //로그인 된경우만 진입
    }
}
