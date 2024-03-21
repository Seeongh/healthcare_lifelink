package mz.hc.service.auth;

import mz.hc.service.auth.dto.SignupDto;
import mz.hc.service.auth.service.UserService;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.json.JSONObject;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import mz.hc.service.auth.util.Sha256;
import java.io.File;
import java.io.FileInputStream;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

@SpringBootTest
public class SingupTest {

    @Autowired
    UserService userService ;

    @Test
    public void join() throws Exception {
        //given


        String filePath = "D:\\5208_헬스 케어 플랫폼 개발\\300.개발\\디지털기반_노쇠평가_및_관리기술_개발_앱_계정정보_240228.xlsx";
        FileInputStream inputStream = new FileInputStream(new File(filePath));

        // Workbook 객체 생성
        Workbook workbook = WorkbookFactory.create(inputStream);

        Map<String, Object> map = new HashMap<>();
        JSONObject body = new JSONObject();
        SignupDto dto = new SignupDto();
        // 첫 번째 시트 선택
        for(int j = 0;j<3;j++) {

            Sheet sheet = workbook.getSheetAt( j);

            // 헤더 행을 건너뛰고 데이터 처리
            for (int i = 4; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row != null) {


                    // 각 셀에서 데이터 읽어오기
                    String userId = row.getCell(2).getStringCellValue();
                    String userPwEnc = row.getCell(3).getStringCellValue();
                    String userNm = row.getCell(4).getStringCellValue();
                    String email = row.getCell(5).getStringCellValue();
                    String agreementYn = row.getCell(6).getStringCellValue();
                    String userYn = row.getCell(7).getStringCellValue();
                    String deptNm = row.getCell(8).getStringCellValue();

                               // 읽어온 데이터 출력 또는 다른 작업 수행
                    System.out.println("User ID: " + userId);
                    System.out.println("User Password: " + userPwEnc);
                    System.out.println("User Name: " + userNm);
                    System.out.println("Email: " + email);
                    System.out.println("Agreement: " + agreementYn);
                    System.out.println("User Active: " + userYn);
                    System.out.println("Department Name: " + deptNm);
                    System.out.println("---------------------");

                    dto.setUserId(userId);

                    String passwd = "";
                    passwd = Sha256.encryt(userPwEnc);
                    dto.setUserRoleFk("1");
                    dto.setUserPwEnc(passwd);
                    dto.setUserNm(userNm);
                    dto.setEmail(email);
                    dto.setAgreementYn(agreementYn);
                    dto.setUserYn(userYn);

                    dto.setDeptNm(deptNm);
                    dto.setUserRoleFk("1");
                    dto.setTelNumEnc("");
                    dto.setBirthEnc("");
                    // web, moblie 구분 값
//                    userService.signup(dto);
//                    userService.insUserAuth(dto);
                }
            }

            // Workbook 및 InputStream 닫기
            workbook.close();
            inputStream.close();
        }



        //when

        //then

     }
}
