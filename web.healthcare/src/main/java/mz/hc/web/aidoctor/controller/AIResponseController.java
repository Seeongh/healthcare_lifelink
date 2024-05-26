package mz.hc.web.aidoctor.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mz.hc.web.util.GatewayUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.net.MalformedURLException;
import java.net.URL;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/aidoctor")
public class AIResponseController {

    @Value("${gateway.healthcare.uri}")
    private String uri;

    @Value("${gateway.version}")
    private String version;
    @PostMapping("/chat_ai")
    @ResponseBody
    public Object getAIResult( HttpServletRequest req,HttpServletResponse res, @RequestParam Map<String, Object> map, Model model, HttpSession session ) {
        JSONObject body = new JSONObject(map);
        ObjectMapper obj = new ObjectMapper();

        Map<String, Object> result = new HashMap<>();
        String str ="";
        try {
            str = (String) GatewayUtils.post(new URL(uri+version+"/chat_ai"),
                   GatewayUtils.tokenCheck(session, res),
                   body.toString());
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }

        try {
            result = obj.readValue(str, Map.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        return result;
    }
}
