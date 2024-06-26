package mz.hc.web.community;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mz.hc.web.util.GatewayUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/community")
public class CommunityController {


    @Value("${gateway.community.uri}")
    private String uri;

    @Value("${gateway.version}")
    private String version;

    /**
     * @apiNote 커뮤니티 view
     * return view
     */

    @GetMapping("/listboard")
    public String boardlist(HttpServletRequest req, HttpServletResponse res, Model model, HttpSession session, @RequestParam String boardUserid) throws Exception{
        if(session.getAttribute("acToken") == null) {	// 토큰 값 없을때
            return "redirect:/user/signin";
        }
        model.addAttribute("uri", req.getRequestURI());
        if(session.getAttribute("acToken") == null) {
            return "redirect:/user/signin";
        }
        JSONObject body = new JSONObject();
        ObjectMapper obj = new ObjectMapper();

        body.put("boardUserid", boardUserid);

        String str = (String) GatewayUtils.post(new URL(uri+version+"/findBoardlist"),
                GatewayUtils.tokenCheck(session, res),
                body.toString());


        Map<String, Object> result = obj.readValue(str, Map.class);

        ArrayList<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

        if(result.get("resultCode").equals("0000")) {
            result = (Map<String, Object>) result.get("resultData");

            for(Map<String, Object> d : (ArrayList<Map<String, Object>>)result.get("list")) {
                list.add(d);
            }
        }
        model.addAttribute("list", list);

        return "/community/communitymain";
    }

    /**
     * board insert
     * @param req
     * @param res
     * @param map
     * @param model
     * @param session
     * @return
     */
    @PostMapping("/inscommunity")
    @ResponseBody
    public Object inscommunity(HttpServletRequest req, HttpServletResponse res, @RequestParam Map<String, Object> map, Model model, HttpSession session) {
        String url = "";
        url = "/writeBoard";

        log.info("ash map " + map.toString());
        map.put("age", Integer.parseInt((String) map.get("age")));
        JSONObject body = new JSONObject(map);
        Map<String, Object> result = new HashMap<>();
        try{
            String str = (String) GatewayUtils.post(new URL(uri+version+url), GatewayUtils.tokenCheck(session, res), body.toString());

            ObjectMapper obj = new ObjectMapper();
            result = obj.readValue(str, Map.class);

            if(result.containsKey("resultCode") && result.get("resultCode").equals("1003")) {
                session.removeAttribute("acToken");
                session.removeAttribute("rfToken");
            }


        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }



}
