package com.cduestc.openatom.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("project_members")
public class ProjectMember {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    
    private Long projectId;
    private Long userId;
    private String role;
    private LocalDateTime joinedAt;
}
