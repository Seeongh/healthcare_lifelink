//package mz.hc.web.community;
//
//import io.github.flashvayne.chatgpt.property.ChatgptProperties;
//import io.github.flashvayne.chatgpt.service.ChatgptService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//@Service
//@RequiredArgsConstructor
//public class ChatService {
//
//
//    private final ChatgptService chatgptService;
//    private final ChatgptProperties cp;
//
//    public String getChatResponse(String gptQuery) {
//        // ChatGPT 에게 질문을 던집니다.
//        cp.setModel("gpt-3.5-turbo-instruct");
//        cp.setTemperature(0.4);
//        return chatgptService.sendMessage(gptQuery);
//
//    }
//}
