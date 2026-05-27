package com.cduestc.openatom.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("projects")
public class Project {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    
    private String name;
    private String description;
    private String coverImage;
    private String repositoryUrl;
    private String demoUrl;
    private Long leaderId;
    private String status; // recruiting, developing, completed
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    
    @TableLogic
    private Boolean deleted;
}
