package mz.hc.web.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.net.URL;
import java.util.UUID;

@Component
public class ImagesUtil {

    private static String imgPath;
    private static String imgTmp;
    public ImagesUtil(@Value("${imgPath}") String IMGPATH,
                      @Value("${imgTmp}") String IMGTMP){
        imgPath = IMGPATH;
        imgTmp = IMGTMP;
    }
    public static String write(MultipartFile file) throws Exception {

        //저장 경로
        String projectPath = System.getProperty("user.dir") + imgPath;
        System.out.println("projectPath = " + projectPath);

        //식별자 생성
        UUID uuid = UUID.randomUUID();

        //식별자_원래 파일이름 = 저장될 파일이름
        String fileName = uuid + "_" + file.getOriginalFilename();

        //해당이름으로 빈 파일만듦
        File savedFile = new File(projectPath, fileName);

        //해당 파일을 원하는 경로로 이동
        file.transferTo(savedFile);
        return fileName;
    }

}
