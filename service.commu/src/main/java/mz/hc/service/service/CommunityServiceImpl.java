package mz.hc.service.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mz.hc.service.repository.CommunityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommunityServiceImpl implements CommunityService{

    @Autowired
    CommunityRepository communityRepository;

    public int writeBoard(Community community) throws Exception {
        return communityRepository.writeBoard(community);
    }
}
