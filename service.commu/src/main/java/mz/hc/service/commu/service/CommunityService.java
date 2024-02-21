package mz.hc.service.commu.service;

import mz.hc.service.commu.domain.Community;
import org.springframework.stereotype.Service;

import java.util.List;

public interface CommunityService {
    public int writeBoard(Community community);

    public Community findBoard(Long commuId) ;

    public List<Community> findBoardList();

}