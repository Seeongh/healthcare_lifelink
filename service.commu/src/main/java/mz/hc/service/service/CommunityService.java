package mz.hc.service.service;

import mz.hc.service.domain.Community;

import java.util.List;

public interface CommunityService {
    public int writeBoard(Community community);

    public Community findBoard(Long id) ;

    public List<Community> findBoardList();
}