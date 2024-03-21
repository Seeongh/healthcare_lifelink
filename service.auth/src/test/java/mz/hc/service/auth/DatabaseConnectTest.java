package mz.hc.service.auth;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.metadata.HikariDataSourcePoolMetadata;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

//connect에 시간이 오래걸려 확인용으로 만듦

@SpringBootTest
public class DatabaseConnectTest {

    @Autowired
    DataSource dataSource;

    static {
        try {
            Class.forName("org.postgresql.Driver");
        } catch(Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    public void CP_FRAMEWORK_사용() throws Exception {
        //given
        System.out.println("datasource = " + dataSource); //jdbc.PoolDataSourceImpl
        System.out.println("datasource = " + dataSource.getClass());

        //when

        //then

     }
    //가설 1. 오랜시간이 흐르고(특정할 수 없음) 처음 db에 접근 시 결과 받아오는데 15초정도 소요
    @Test
    public void DB_단일_연결시간_테스트() throws Exception {
        //given
        //항상 새로운 커넥션 생성 oracle- 12ms소요 hikari - 8ms소요
        System.out.println("DriverManager.getConnection 얻어오기");
        Connection con = dataSource.getConnection();
        long start = System.currentTimeMillis();
        //Connection con = DriverManager.getConnection("jdbc:postgresql://ictsupp.asuscomm.com:5432/mzhc_db?currentSchema=healthcare&characterEncoding=UTF-8&serverTimezone",
        //        "mzhc","mzhc");
        System.out.println("DriverManager.getConnection 완료");
        System.out.println("connection={"+con+"} class={"+con.getClass()+"}");

        String sql ;
        sql = "SELECT * FROM health_data_minute where user_seq = '646'";

        Statement state = con.createStatement();
        ResultSet rs = state.executeQuery(sql);

        rs.close();
        state.close();
        con.close();
        long end = System.currentTimeMillis();
        long secDiffTime = (end-start);
        System.out.println("조회 시간 : " + secDiffTime/1e3);
        //then

     }

     @Test
     public void DB_커넥션풀_테스트() throws Exception {
         //given
         ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
         executor.setCorePoolSize(30); //쓰레드 30개 생성
         executor.initialize();



         //when

         //then

      }
}
