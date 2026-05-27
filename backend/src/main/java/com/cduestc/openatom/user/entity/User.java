package com.cduestc.openatom.user.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("users")
public class User {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    
    private String username;
    private String password;
    private String realName;
    private String studentId;
    private String email;
    private String phone;
    private String avatar;
    
    private Long departmentId;
    private String position;
    private Integer points;
    private String role;
    private String status;
    
    private LocalDateTime lastLoginTime;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    
    @TableLogic
    @TableField("deleted")
    private Boolean deleted;
}
