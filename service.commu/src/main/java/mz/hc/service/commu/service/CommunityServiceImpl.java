package mz.hc.service.commu.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mz.hc.service.commu.domain.Community;
import mz.hc.service.commu.domain.Usermng;
import mz.hc.service.commu.repository.CommunityRepository;
import mz.hc.service.commu.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Slf4j
@Service
@Transactional(readOnly=true)
public class CommunityServiceImpl implements CommunityService{


    private final CommunityRepository communityRepository;

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = false) //읽기전용으로 하면 데이터 변경이 안됨.
    public int writeBoard(Community community) {
        Usermng um = userRepository.findOne(community.getUserId());
        community.setUserNm(um.getUser_nm());
        return communityRepository.writeBoard(community);
    }

    @Override
    public Community findBoard(int commuSeq) {
        return communityRepository.findBoard(commuSeq);
    }

    @Override
    @Transactional
    public List<Community> findBoardList() {
        return communityRepository.findBoardList();
    }
}
