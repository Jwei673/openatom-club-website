package com.cduestc.openatom.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cduestc.openatom.user.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {
    // 可以在这里添加自定义的 SQL 方法
}
